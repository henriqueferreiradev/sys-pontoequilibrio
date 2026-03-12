from core.models import Paciente, Receita, Despesa, Profissional
from django.db.models.functions import ExtractMonth, ExtractDay
from datetime import date, timedelta
from decimal import Decimal
from django.db.models import Sum, Min, Max
 
 


def aplicar_filtros(queryset, params):

    # ===== FILTROS SIMPLES =====
    filtros_diretos = [
        'sexo',
        'estado_civil',
        'cor_raca',
        'midia',
        'cidade',
        'bairro',
        'profissao',
        'naturalidade'
    ]

    for campo in filtros_diretos:
        valor = params.get(campo)
        if valor:
            if campo in ['cidade', 'bairro', 'profissao', 'naturalidade']:
                queryset = queryset.filter(**{f"{campo}__icontains": valor})
            else:
                queryset = queryset.filter(**{campo: valor})

    # ===== FILTROS BOOLEANOS =====
    booleanos = [
        'ativo',
        'pre_cadastro',
        'conferido',
        'consentimento_lgpd',
        'nf_reembolso_plano',
        'nf_imposto_renda'
    ]

    for campo in booleanos:
        valor = params.get(campo)

        if valor in ['true', 'false']:
            queryset = queryset.filter(**{campo: valor == 'true'})

    # ===== FILTRO UF =====
    if params.get('uf'):
        queryset = queryset.filter(estado=params['uf'])

    # ===== FAIXA ETÁRIA =====
    faixa = params.get('faixa_etaria')

    if faixa:

        hoje = date.today()

        if faixa == 'crianca':
            queryset = queryset.filter(data_nascimento__gte=hoje.replace(year=hoje.year-11))

        elif faixa == 'adolescente':
            queryset = queryset.filter(
                data_nascimento__lte=hoje.replace(year=hoje.year-12),
                data_nascimento__gte=hoje.replace(year=hoje.year-17)
            )

        elif faixa == 'jovem':
            queryset = queryset.filter(
                data_nascimento__lte=hoje.replace(year=hoje.year-18),
                data_nascimento__gte=hoje.replace(year=hoje.year-29)
            )

        elif faixa == 'adulto':
            queryset = queryset.filter(
                data_nascimento__lte=hoje.replace(year=hoje.year-30),
                data_nascimento__gte=hoje.replace(year=hoje.year-59)
            )

        elif faixa == 'idoso':
            queryset = queryset.filter(
                data_nascimento__lte=hoje.replace(year=hoje.year-60)
            )

    # ===== FILTRO PERÍODO =====
    data_inicio = params.get('data_inicio')
    data_fim = params.get('data_fim')

    if data_inicio and data_fim:
        queryset = queryset.filter(
            data_cadastro__range=[data_inicio, data_fim]
        )

    # ===== FILTRO ANIVERSÁRIO =====
    if params.get('ordenar_por') == 'aniversario':

        queryset = queryset.annotate(
            mes_aniversario=ExtractMonth('data_nascimento'),
            dia_aniversario=ExtractDay('data_nascimento')
        )

    # ===== ORDENAÇÃO =====
    ordenar_por = params.get('ordenar_por')
    ordem = params.get('ordem')

    if ordenar_por:

        if ordenar_por == 'aniversario':

            if ordem == 'desc':
                queryset = queryset.order_by('-mes_aniversario', '-dia_aniversario')
            else:
                queryset = queryset.order_by('mes_aniversario', 'dia_aniversario')

        else:

            if ordem == 'desc':
                queryset = queryset.order_by(f'-{ordenar_por}')
            else:
                queryset = queryset.order_by(ordenar_por)

    return queryset




#==================================PACIENTES FILTROS===============================================


def filtrar_pacientes(params):
    """
    Função que filtra pacientes baseado nos parâmetros
    """
    # Começa com todos os pacientes
    pacientes = Paciente.objects.all()
    
    # Aplica os filtros
    pacientes = aplicar_filtros(pacientes, params)
    
    # Converte para lista de dicionários
    resultados = []
    for p in pacientes:
        resultados.append({
            'ID': p.id,
            'nome': f'{p.nome} {p.sobrenome}',
            'sexo': p.sexo,
            'cidade': p.cidade,
            'data_cadastro': str(p.data_cadastro),
             
        })
    
    return resultados


def filtrar_pacientes_inativos(params):
    """
    Função que filtra pacientes inativos baseado nos parâmetros
    """
    # Começa com todos os pacientes inativos
    pacientes = Paciente.objects.filter(ativo=False)
    
    # Aplica os filtros
    pacientes = aplicar_filtros(pacientes, params)
    
    # Converte para lista de dicionários
    resultados = []
    for p in pacientes:
        resultados.append({
            'ID': p.id,
            'Nome': f'{p.nome} {p.sobrenome}',
            'Sexo': p.sexo,
            'Cidade': p.cidade,
            'Data de Cadastro': str(p.data_cadastro),
             
        })
    
    return resultados

from datetime import datetime
from django.db.models import Q
from core.models import Paciente


def filtrar_pacientes_por_aniversario(params):

    pacientes = Paciente.objects.all()

    pacientes = aplicar_filtros(pacientes, params)
    resultados = []

    for p in pacientes:
        resultados.append({
            'ID':p.id,
            'Nome': f'{p.nome} {p.sobrenome}',
            'Data de Nascimento': p.data_nascimento.strftime("%d/%m/%Y") if p.data_nascimento else 'N/A',
            'Idade': p.idade_formatada,
        })

    return resultados
 



#==================================PROFISSIONAIS FILTROS===============================================

def filtrar_profissionais(params):

    profissionais = Profissional.objects.all()
    profissionais = aplicar_filtros(profissionais, params)

    resultados = []

    for p in profissionais:
        resultados.append({
            "ID":p.id,
            "Nome": f"{p.nome} {p.sobrenome}",
            "Especialidade": p.especialidade.nome,
            
        })

    return resultados

def gerar_dre(params):
    """
    Gera relatório DRE baseado nos parâmetros
    """
    data_inicio = params.get('data_inicio')
    data_fim = params.get('data_fim')
    
    if not data_inicio or not data_fim:
        # Se não vier data, usa o mês atual como padrão
        hoje = date.today()
        data_inicio = date(hoje.year, hoje.month, 1)
        if hoje.month == 12:
            data_fim = date(hoje.year, 12, 31)
        else:
            data_fim = date(hoje.year, hoje.month + 1, 1) - timedelta(days=1)
    else:
        data_inicio = date.fromisoformat(data_inicio)
        data_fim = date.fromisoformat(data_fim)
    
    # Busca o período com dados reais para dar dicas
    receitas_com_data = Receita.objects.filter(
        status='pago', 
        vencimento__isnull=False
    ).aggregate(
        primeira=Min('vencimento'),
        ultima=Max('vencimento')
    )
    
    primeira_receita = receitas_com_data['primeira']
    ultima_receita = receitas_com_data['ultima']
    
    print(f"📅 Período solicitado: {data_inicio.strftime('%d/%m/%Y')} a {data_fim.strftime('%d/%m/%Y')}")
    if primeira_receita:
        print(f"📊 Período com dados: {primeira_receita.strftime('%d/%m/%Y')} a {ultima_receita.strftime('%d/%m/%Y')}")
    
    # 1. RECEITAS
    receitas_qs = Receita.objects.filter(
        status='pago',
        vencimento__range=[data_inicio, data_fim]
    )
    
    forma_pagamento = params.get('forma_pagamento')
    if forma_pagamento:
        receitas_qs = receitas_qs.filter(forma_pagamento=forma_pagamento)
    
    # Agrupa por categoria
    receitas_por_categoria = receitas_qs.values(
        'categoria_receita__nome'
    ).annotate(valor=Sum('valor')).order_by('-valor')
    
    total_receitas = receitas_qs.aggregate(total=Sum('valor'))['total'] or Decimal('0')
    
    # 2. DESPESAS
    despesas_qs = Despesa.objects.filter(
        status='pago',
        vencimento__range=[data_inicio, data_fim]
    )
    
    if forma_pagamento:
        despesas_qs = despesas_qs.filter(forma_pagamento=forma_pagamento)
    
    despesas_por_categoria = despesas_qs.values(
        'categoria__nome'
    ).annotate(valor=Sum('valor')).order_by('-valor')
    
    total_despesas = despesas_qs.aggregate(total=Sum('valor'))['total'] or Decimal('0')
    
    resultado_liquido = total_receitas - total_despesas
    margem_liquida = (resultado_liquido / total_receitas * 100) if total_receitas > 0 else 0
    
    # MONTA O RELATÓRIO
    dados = []
    
    # CABEÇALHO
    dados.append({
        'Seção': 'PERÍODO',
        'Descrição': f'📅 {data_inicio.strftime("%d/%m/%Y")} a {data_fim.strftime("%d/%m/%Y")}',
        'Valor (R$)': '',
        'Percentual': ''
    })
    
    # Se não tem dados no período, mostra sugestão
    if total_receitas == 0 and primeira_receita:
        dados.append({
            'Seção': 'ATENÇÃO',
            'Descrição': f'⚠️ Nenhuma receita encontrada neste período',
            'Valor (R$)': '',
            'Percentual': ''
        })
        dados.append({
            'Seção': 'SUGESTÃO',
            'Descrição': f'💡 Tente: {primeira_receita.strftime("%m/%Y")} (primeira receita)',
            'Valor (R$)': '',
            'Percentual': ''
        })
        
        # Já adiciona os meses disponíveis como sugestão
        meses_disponiveis = Receita.objects.filter(
            status='pago'
        ).dates('vencimento', 'month')
        
        for mes in meses_disponiveis[:3]:  # Mostra até 3 meses
            dados.append({
                'Seção': 'MÊS',
                'Descrição': f'   • {mes.strftime("%B/%Y").capitalize()}',
                'Valor (R$)': '',
                'Percentual': ''
            })
    
    dados.append({'Seção': '', 'Descrição': '', 'Valor (R$)': '', 'Percentual': ''})
    
    # RECEITAS
    dados.append({
        'Seção': 'RECEITAS',
        'Descrição': '>>> RECEITAS OPERACIONAIS <<<',
        'Valor (R$)': '',
        'Percentual': ''
    })
    
    if receitas_por_categoria:
        for item in receitas_por_categoria:
            nome = item['categoria_receita__nome'] or 'Outras receitas'
            valor = float(item['valor'])
            percentual = (valor / float(total_receitas) * 100) if total_receitas > 0 else 0
            
            dados.append({
                'Seção': 'RECEITAS',
                'Descrição': f'  {nome}',
                'Valor (R$)': f'R$ {valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
                'Percentual': f'{percentual:.1f}%'.replace('.', ',')
            })
    else:
        dados.append({
            'Seção': 'RECEITAS',
            'Descrição': '  Nenhuma receita no período',
            'Valor (R$)': 'R$ 0,00',
            'Percentual': '0%'
        })
    
    dados.append({
        'Seção': 'RECEITAS',
        'Descrição': 'TOTAL DAS RECEITAS',
        'Valor (R$)': f'R$ {float(total_receitas):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
        'Percentual': '100%'
    })
    
    dados.append({'Seção': '', 'Descrição': '', 'Valor (R$)': '', 'Percentual': ''})
    
    # DESPESAS
    dados.append({
        'Seção': 'DESPESAS',
        'Descrição': '>>> DESPESAS OPERACIONAIS <<<',
        'Valor (R$)': '',
        'Percentual': ''
    })
    
    if despesas_por_categoria:
        for item in despesas_por_categoria:
            nome = item['categoria__nome'] or 'Outras despesas'
            valor = float(item['valor'])
            percentual = (valor / float(total_receitas) * 100) if total_receitas > 0 else 0
            
            dados.append({
                'Seção': 'DESPESAS',
                'Descrição': f'  {nome}',
                'Valor (R$)': f'R$ {valor:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
                'Percentual': f'{percentual:.1f}%'.replace('.', ',')
            })
    else:
        dados.append({
            'Seção': 'DESPESAS',
            'Descrição': '  Nenhuma despesa no período',
            'Valor (R$)': 'R$ 0,00',
            'Percentual': '0%'
        })
    
    dados.append({
        'Seção': 'DESPESAS',
        'Descrição': 'TOTAL DAS DESPESAS',
        'Valor (R$)': f'R$ {float(total_despesas):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
        'Percentual': f'{(float(total_despesas)/float(total_receitas)*100):.1f}%'.replace('.', ',') if total_receitas > 0 else '0%'
    })
    
    dados.append({'Seção': '', 'Descrição': '', 'Valor (R$)': '', 'Percentual': ''})
    
    # RESULTADO
    if total_receitas > 0 or total_despesas > 0:
        dados.append({
            'Seção': 'RESULTADO',
            'Descrição': 'RESULTADO OPERACIONAL',
            'Valor (R$)': f'R$ {float(resultado_liquido):,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.'),
            'Percentual': f'{margem_liquida:.1f}%'.replace('.', ',')
        })
        
        if resultado_liquido > 0:
            status = "💰 LUCRO"
        elif resultado_liquido < 0:
            status = "📉 PREJUÍZO"
        else:
            status = "⚖️ EQUILÍBRIO"
            
        dados.append({
            'Seção': 'STATUS',
            'Descrição': status,
            'Valor (R$)': '',
            'Percentual': ''
        })
    
    return dados