from datetime import date, datetime, timedelta
from math import e
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden, JsonResponse
from django.db.models import Sum, Q
from django.utils import timezone
from numpy import true_divide
from core.models import CategoriaContasReceber, CategoriaFinanceira, ContaBancaria, Fornecedor, Pagamento, Receita, Despesa, SubgrupoConta
from core.utils import paginate
import json

@login_required(login_url='login')
def financeiro_view(request):
    if request.user.tipo == 'profissional':
        return HttpResponseForbidden("Acesso negado.")
    
    
    
    
    total_receitas = Pagamento.objects.aggregate(todas_receitas=(Sum('valor')))
   
    ultimos_recebimentos = Pagamento.objects.filter(status="pago").order_by('-id')[:3]
 
    for u in ultimos_recebimentos:
        print(u.paciente.nome)
    


    context = {
        'total_receitas': total_receitas,
        'ultimos_recebimentos': ultimos_recebimentos,
    }

    return render(request, 'core/financeiro/dashboard.html', context)

def fluxo_caixa_view(request):
 
    return render(request, 'core/financeiro/fluxo_caixa.html')

# views/financeiro_views.py - SUBSTITUA a função:

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from decimal import Decimal
from django.db.models import Q, Sum
from django.core.paginator import Paginator
from django.db.models.functions import Coalesce
from datetime import date

@login_required
def contas_a_receber_view(request):
    hoje = timezone.localdate()
    
    # 🚨 SIMPLIFIQUE: Busca apenas receitas com saldo
    receitas_com_saldo = Receita.objects.filter(
        Q(status='pendente') | Q(status='atrasado')
    ).annotate(
        total_pago_calculado=Coalesce(
            Sum('pagamentos__valor', filter=Q(pagamentos__status='pago')),
            Decimal('0.00')
        )
    ).annotate(
        saldo_calculado=Coalesce('valor', Decimal('0.00')) - Coalesce('total_pago_calculado', Decimal('0.00'))
    ).filter(
        saldo_calculado__gt=Decimal('0.00')
    ).select_related('paciente', 'categoria_receita', 'pacote').order_by('vencimento')
    
    # Converter para formato da view
    lancamentos = []
    for receita in receitas_com_saldo:
        # Status
        if receita.vencimento:
            if receita.vencimento < hoje:
                status = 'Atrasado'
            elif receita.vencimento == hoje:
                status = 'Vence Hoje'
            else:
                status = 'Pendente'
        else:
            status = 'Pendente'
        
        # Tipo baseado no vínculo direto
        tipo = 'pacote_via_receita' if receita.pacote else 'receita_manual'
        
        lancamentos.append({
            'id': receita.id,
            'paciente': receita.paciente,
            'descricao': receita.descricao,
            'valor': receita.saldo_calculado,
            'valor_total': receita.valor,
            'vencimento': receita.vencimento,
            'status': status,
            'origem': 'receita',
            'total_pago': receita.total_pago_calculado,
            'tipo': tipo,
            'item_id': receita.id,
            'pacote_codigo': receita.pacote.codigo if receita.pacote else None
        })
    
    # KPIs
    total_pendente = Decimal('0')
    total_atrasado = Decimal('0')
    total_vence_hoje = Decimal('0')
    
    for lanc in lancamentos:
        if lanc['status'] == 'Atrasado':
            total_atrasado += lanc['valor']
        elif lanc['status'] == 'Vence Hoje':
            total_vence_hoje += lanc['valor']
        else:
            total_pendente += lanc['valor']
    
    total_a_receber = total_pendente + total_atrasado + total_vence_hoje
    
    # Paginação
    paginator = Paginator(lancamentos, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'total_pendente': total_pendente,
        'total_atrasado': total_atrasado,
        'total_vence_hoje': total_vence_hoje,
        'total_a_receber': total_a_receber,
        'categorias': CategoriaContasReceber.objects.filter(ativo=True),
    }
    
    return render(request, 'core/financeiro/contas_receber.html', context)

def contas_a_pagar_view(request):
    hoje = timezone.localdate()

    despesas_qs  = (Despesa.objects.select_related('fornecedor','categoria', 'conta_bancaria'))
    despesas = Despesa.objects.all()
    

    status = request.GET.get('status')
    fornecedor = request.GET.get('fornecedor')
    #categoria = request.GET.get('categoria')
    
    if status:
        despesas_qs = despesas_qs.filter(status=status)
    if fornecedor:
        despesas_qs = despesas_qs.filter(fornecedor__razao_social__icontains=fornecedor)
    #if categoria:
    #    despesas_qs = despesas_qs.filter(categoria=categoria)    

    despesas_qs = despesas_qs.order_by('vencimento')

    lancamentos = []
    
    for despesa in despesas_qs:
        if despesa.status == 'pago':
            status_calculado = 'Pago'
        elif despesa.status == 'agendado':
            status_calculado = 'Agendado'
        else:
            if despesa.vencimento < hoje:
                status_calculado = "Atrasado"
            elif despesa.vencimento == hoje:
                status_calculado = 'Vence Hoje'
            else:
                status_calculado = 'Pendente'
    

        lancamentos.append({
            'id':despesa.id,
             'categoria':despesa.categoria,
            'valor': despesa.valor,
            'vencimento':despesa.vencimento,
            'status': despesa.status,
            'status_calculado': status_calculado,
            'item_id':despesa.id,
            }

        )


    total_atrasado = Decimal('0')
    total_vence_hoje = Decimal('0')
    total_pendente = Decimal('0')
    total_agendado = Decimal('0')

    for despesa in despesas_qs.exclude(status='pago'):
        if despesa.status == 'agendado':
            total_agendado += despesa.valor
        elif despesa.vencimento < hoje:
            total_atrasado += despesa.valor
        elif despesa.vencimento == hoje:
            total_vence_hoje += despesa.valor
        else:
            total_pendente +=despesa.valor

    
    total_a_pagar = (
        total_atrasado + total_vence_hoje + total_pendente + total_agendado
    )

    page_obj = paginate(request, despesas, per_page=10)



    fornecedores = Fornecedor.objects.filter(ativo=True)
    contas_bancarias = ContaBancaria.objects.filter(ativo=True)
    
    context = {
        'page_obj':page_obj,
        'fornecedores':fornecedores,
        'contas_bancarias':contas_bancarias,
        'total_atrasado':total_atrasado,
        'total_vence_hoje':total_vence_hoje,
        'total_a_pagar':total_a_pagar,
        'total_pendente':total_pendente,
        'total_agendado':total_agendado, 
    }
    
    return render(request, 'core/financeiro/contas_pagar.html', context)

import json
from datetime import date, timedelta
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from core.models import Despesa, Fornecedor, SubgrupoConta, ContaBancaria
import calendar

def ultimo_dia_mes(ano, mes):
    return calendar.monthrange(ano, mes)[1]
@csrf_exempt
@require_http_methods(["POST"])
def criar_nova_despesa(request):
    try:
        # Verifica content type
        if request.content_type != 'application/json':
            return JsonResponse({
                'success': False,
                'message': 'Content-Type must be application/json'
            }, status=400)

        # Carrega dados do request
        data = json.loads(request.body)
        print("[DEBUG] Dados recebidos:", data)

        # Valida campos obrigatórios
        campos_obrigatorios = ['fornecedor_id', 'conta_codigo', 'descricao', 
                              'vencimento', 'valor', 'status']
        
        for campo in campos_obrigatorios:
            if campo not in data or not data[campo]:
                return JsonResponse({
                    'success': False,
                    'message': f'Campo obrigatório: {campo}'
                }, status=400)

        # Busca fornecedor
        try:
            fornecedor = Fornecedor.objects.get(id=data['fornecedor_id'])
        except Fornecedor.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Fornecedor não encontrado'
            }, status=400)

        # Busca conta contábil
        try:
            conta_contabil = SubgrupoConta.objects.get(codigo_completo=data['conta_codigo'])
        except SubgrupoConta.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Conta contábil não encontrada'
            }, status=400)

        # Busca conta bancária (opcional)
        conta_debito = None
        if data.get('conta_debito'):
            try:
                conta_debito = ContaBancaria.objects.get(id=data['conta_debito'])
            except ContaBancaria.DoesNotExist:
                pass

        # Converte valor para Decimal
        valor = Decimal(str(data['valor']))

        # Se NÃO for recorrente, cria uma única despesa
        if not data.get('recorrente'):
            despesa = Despesa.objects.create(
                fornecedor=fornecedor,
                categoria=conta_contabil,   
                descricao=data['descricao'],
                vencimento=data['vencimento'],
                valor=valor,
                status=data['status'],
                conta_bancaria=conta_debito,
                documento=data['documento', 'Não Informado'],
                observacoes=data.get('observacoes', ''),
                recorrente=False
            )

            return JsonResponse({
                'success': True,
                'message': 'Despesa cadastrada com sucesso!',
                'id': despesa.id,
                'recorrente': False
            })

        # ============================================
        # CASO RECORRENTE - cria múltiplas despesas
        # ============================================
        
        # Valida campos de recorrência
        if not data.get('frequencia') or not data.get('tipo_recorrencia') or not data.get('inicio_recorrencia'):
            return JsonResponse({
                'success': False,
                'message': 'Campos de recorrência incompletos'
            }, status=400)

        frequencia = data['frequencia']
        tipo_recorrencia = data['tipo_recorrencia']
        inicio_recorrencia = data['inicio_recorrencia']
        
        # Mapeamento de frequências para dias/meses
        frequencia_map = {
            'semanal': {'dias': 7, 'label': 'Semanal'},
            'quinzenal': {'dias': 15, 'label': 'Quinzenal'},
            'mensal': {'meses': 1, 'label': 'Mensal'},
            'bimestral': {'meses': 2, 'label': 'Bimestral'},
            'trimestral': {'meses': 3, 'label': 'Trimestral'},
            'semestral': {'meses': 6, 'label': 'Semestral'},
            'anual': {'meses': 12, 'label': 'Anual'}
        }

        if frequencia not in frequencia_map:
            return JsonResponse({
                'success': False,
                'message': f'Frequência inválida: {frequencia}'
            }, status=400)

        # Determina quantidade de ocorrências
        if tipo_recorrencia == 'meses':
            # Por quantidade de meses
            if not data.get('qtd_ocorrencias') or data['qtd_ocorrencias'] < 1:
                return JsonResponse({
                    'success': False,
                    'message': 'Quantidade de ocorrências inválida'
                }, status=400)
            
            qtd_ocorrencias = data['qtd_ocorrencias']
            data_termino = None
            
        else:  # tipo_recorrencia == 'data'
            # Por data de término
            if not data.get('termino_recorrencia'):
                return JsonResponse({
                    'success': False,
                    'message': 'Data de término é obrigatória para este tipo de recorrência'
                }, status=400)
            
            data_termino = data['termino_recorrencia']
            # Calcula quantidade baseada nas datas
            qtd_ocorrencias = data.get('qtd_ocorrencias')  # Pode vir calculado do front

        # Gera as despesas
        despesas_criadas = []
        data_atual = date.fromisoformat(inicio_recorrencia)
        
        # Se qtd_ocorrencias não veio do front, calcula agora
        if not qtd_ocorrencias and data_termino:
            qtd_ocorrencias = calcular_quantidade_ocorrencias(
                data_atual, 
                date.fromisoformat(data_termino), 
                frequencia
            )
        elif not qtd_ocorrencias:
            qtd_ocorrencias = 1

        # Cria as despesas
        for i in range(qtd_ocorrencias):
            # Calcula data de vencimento para esta ocorrência
            if i == 0:
                data_vencimento = data_atual
            else:
                if 'dias' in frequencia_map[frequencia]:
                    # Frequência baseada em dias
                    dias = frequencia_map[frequencia]['dias']
                    data_vencimento = data_atual + timedelta(days=dias * i)
                else:
                    # Frequência baseada em meses
                    meses = frequencia_map[frequencia]['meses']
                    # Adiciona meses mantendo o mesmo dia do mês
                    mes_atual = data_atual.month + (meses * i)
                    ano_atual = data_atual.year + (mes_atual - 1) // 12
                    mes_atual = ((mes_atual - 1) % 12) + 1
                    
                    # Ajusta dia para não ultrapçar o mês
                    dia = min(data_atual.day, ultimo_dia_mes(ano_atual, mes_atual))
                    data_vencimento = date(ano_atual, mes_atual, dia)

            # Cria a despesa
            despesa = Despesa.objects.create(
                fornecedor=fornecedor,
                categoria=conta_contabil,
                descricao=f"{data['descricao']} - {i+1}/{qtd_ocorrencias}",
                vencimento=data_vencimento,
                valor=valor,
                status='pendente' if i > 0 else data['status'],  # Primeira segue status, as demais pendentes
                conta_bancaria=conta_debito,
                documento=data['documento', 'Não Informado'],
                observacoes=data.get('observacoes', ''),
                recorrente=True,
                frequencia=frequencia,
                tipo_recorrencia=tipo_recorrencia,
                inicio_recorrencia=inicio_recorrencia,
                termino_recorrencia=data_termino,
                qtd_ocorrencias=qtd_ocorrencias,
                valor_total_recorrencia=valor * qtd_ocorrencias
            )
            
            despesas_criadas.append({
                'id': despesa.id,
                'vencimento': despesa.vencimento.isoformat(),
                'valor': float(despesa.valor)
            })

        return JsonResponse({
            'success': True,
            'message': f'{len(despesas_criadas)} despesas recorrentes cadastradas com sucesso!',
            'recorrente': True,
            'quantidade': len(despesas_criadas),
            'despesas': despesas_criadas
        })

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Erro ao decodificar JSON'
        }, status=400)
    except Exception as e:
        print("[ERRO]", str(e))
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'message': f'Erro interno: {str(e)}'
        }, status=500)


def calcular_quantidade_ocorrencias(data_inicio, data_termino, frequencia):
    """
    Calcula quantas ocorrências cabem entre duas datas
    """
    frequencia_map = {
        'semanal': 7,
        'quinzenal': 15,
        'mensal': 30,
        'bimestral': 60,
        'trimestral': 90,
        'semestral': 180,
        'anual': 365
    }
    
    dias_intervalo = frequencia_map.get(frequencia, 30)
    dias_totais = (data_termino - data_inicio).days
    
    if dias_totais <= 0:
        return 1
    
    return (dias_totais // dias_intervalo) + 1


 
# View para listar despesas (exemplo)
@require_http_methods(["GET"])
def listar_despesas(request):
    """
    Lista despesas com filtros opcionais
    """
    despesas = Despesa.objects.all().order_by('-vencimento')
    
    # Aplica filtros
    status = request.GET.get('status')
    if status:
        despesas = despesas.filter(status=status)
    
    fornecedor = request.GET.get('fornecedor')
    if fornecedor:
        despesas = despesas.filter(fornecedor_id=fornecedor)
    
    data_inicio = request.GET.get('data_inicio')
    data_fim = request.GET.get('data_fim')
    if data_inicio and data_fim:
        despesas = despesas.filter(vencimento__range=[data_inicio, data_fim])
    
    # Paginação simples
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    start = (page - 1) * page_size
    end = start + page_size
    
    total = despesas.count()
    despesas_page = despesas[start:end]
    
    dados = []
    for d in despesas_page:
        dados.append({
            'id': d.id,
            'fornecedor': d.fornecedor.razao_social if d.fornecedor else '',
            'descricao': d.descricao,
            'vencimento': d.vencimento.isoformat(),
            'valor': float(d.valor),
            'status': d.status,
            'recorrente': d.recorrente,
            'frequencia': d.frequencia if d.recorrente else None
        })
    
    return JsonResponse({
        'success': True,
        'data': dados,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })



def faturamento_view(request):
 
    return render(request, 'core/financeiro/faturamento.html')

def folha_pagamento_view(request):
    return render(request, 'core/financeiro/folha_pagamento.html')

def relatorios_view(request):
    return render(request, 'core/financeiro/relatorios.html')


 