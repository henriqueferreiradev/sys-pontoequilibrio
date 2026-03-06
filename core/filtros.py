from core.models import Paciente

def filtrar_pacientes(params):
    """
    Função que filtra pacientes baseado nos parâmetros
    """
    # Começa com todos os pacientes
    pacientes = Paciente.objects.all()
    
    # Aplica os filtros
    if params.get('sexo'):
        pacientes = pacientes.filter(sexo=params['sexo'])
    
    if params.get('cidade'):
        pacientes = pacientes.filter(cidade__icontains=params['cidade'])
    
    if params.get('data_inicio') and params.get('data_fim'):
        pacientes = pacientes.filter(
            data_cadastro__range=[params['data_inicio'], params['data_fim']]
        )
    
    # Converte para lista de dicionários
    resultados = []
    for p in pacientes:
        resultados.append({
            'nome': f'{p.nome} {p.sobrenome}',
            'sexo': p.sexo,
            'cidade': p.cidade,
            'data_cadastro': str(p.data_cadastro),
             
        })
    
    return resultados