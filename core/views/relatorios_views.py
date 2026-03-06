# relatorios/views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.contrib.auth.decorators import login_required
from core.models import CategoriaRelatorio, RelatorioConfig, ExecucaoRelatorio
import json
import time

@login_required
def pagina_relatorios(request):
    """Renderiza a página principal de relatórios"""
    return render(request, 'core/administrativo/relatorios.html')

@login_required
def listar_relatorios(request):
    """API para listar todos os relatórios (substitui o JSON estático)"""
    categorias = CategoriaRelatorio.objects.all().order_by('ordem')
    dados = []
    
    for cat in categorias:
        relatorios = cat.relatorioconfig_set.filter(ativo=True)
        if relatorios.exists():
            dados.append({
                'setor': cat.nome,
                'icon_setor': cat.icone,
                'relatorios': [
                    {
                        'setor': cat.nome,
                        'icon': r.icone,
                        'nome': r.nome,
                        'desc': r.descricao,
                        'slug': r.slug,
                        'extra': r.filtros_disponiveis
                    }
                    for r in relatorios
                ]
            })
    
    return JsonResponse({'setores': dados})

@login_required
@csrf_exempt
def executar_relatorio(request, slug):
    """Executa um relatório específico"""
    relatorio = get_object_or_404(RelatorioConfig, slug=slug, ativo=True)
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    
    try:
        dados = json.loads(request.body)
    except:
        dados = request.POST.dict()
    
    # Merge com GET params
    params = {**request.GET.dict(), **dados}
    
    inicio = time.time()
    
    try:
        # Executa a query
        resultados = executar_query_relatorio(relatorio, params)
        
        # Salva histórico
        ExecucaoRelatorio.objects.create(
            relatorio=relatorio,
            usuario=request.user,
            parametros=params,
            dados_resultado=resultados[:100],  # salva só os primeiros 100
            tempo_execucao=time.time() - inicio
        )
        
        return JsonResponse({
            'dados': resultados,
            'total': len(resultados),
            'parametros': params
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def executar_query_relatorio(relatorio, params):
    """Executa a query do relatório"""
    
    # Se tem função Python, usa ela
    if relatorio.funcao_python:
        from django.utils.module_loading import import_string
        func = import_string(relatorio.funcao_python)
        return func(params)
    
    # Senão, executa SQL
    with connection.cursor() as cursor:
        cursor.execute(relatorio.query_sql, params)
        
        # Pega nomes das colunas
        colunas = [col[0] for col in cursor.description]
        
        # Converte para dicionário
        resultados = [
            dict(zip(colunas, row))
            for row in cursor.fetchall()
        ]
        
        return resultados

@login_required
def exportar_relatorio(request, slug, formato):
    """Exporta relatório em Excel/PDF/CSV"""
    relatorio = get_object_or_404(RelatorioConfig, slug=slug, ativo=True)
    params = request.GET.dict()
    
    resultados = executar_query_relatorio(relatorio, params)
    
    if formato == 'excel':
        return exportar_excel(relatorio.nome, resultados)
    elif formato == 'csv':
        return exportar_csv(relatorio.nome, resultados)
    elif formato == 'pdf':
        return exportar_pdf(relatorio.nome, resultados)
    
    return JsonResponse({'error': 'Formato não suportado'})

def exportar_excel(nome, dados):
    """Exporta para Excel"""
    import pandas as pd
    from io import BytesIO
    
    df = pd.DataFrame(dados)
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Relatório', index=False)
    
    output.seek(0)
    response = HttpResponse(
        output.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{nome}.xlsx"'
    
    return response

def exportar_csv(nome, dados):
    """Exporta para CSV"""
    import csv
    import io
    
    if not dados:
        return HttpResponse("Sem dados", status=204)
    
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=dados[0].keys())
    writer.writeheader()
    writer.writerows(dados)
    
    response = HttpResponse(output.getvalue(), content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{nome}.csv"'
    
    return response

def exportar_pdf(nome, dados):
    """Exporta para PDF (simplificado)"""
    from django.template.loader import render_to_string
    from weasyprint import HTML
    
    html_string = render_to_string('relatorios/pdf_template.html', {
        'titulo': nome,
        'dados': dados,
        'data': time.strftime('%d/%m/%Y')
    })
    
    html = HTML(string=html_string)
    pdf = html.write_pdf()
    
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{nome}.pdf"'
    
    return response