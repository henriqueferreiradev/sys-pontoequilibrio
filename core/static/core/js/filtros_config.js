// ============================================
// CONFIGURAÇÃO COMPLETA DE FILTROS
// Baseada nos models do sistema
// ============================================

const FILTROS_CONFIG = {

    // ===== FILTROS DO PACIENTE =====
    'sexo': {
        tipo: 'select',
        label: 'Sexo',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'masculino', rotulo: 'Masculino' },
            { valor: 'feminino', rotulo: 'Feminino' },
            { valor: 'outro', rotulo: 'Outro' },
            { valor: 'prefiro não informar', rotulo: 'Prefiro não informar' }
        ]
    },

    'estado_civil': {
        tipo: 'select',
        label: 'Estado Civil',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'solteiro(a)', rotulo: 'Solteiro(a)' },
            { valor: 'casado(a)', rotulo: 'Casado(a)' },
            { valor: 'divorciado(a)', rotulo: 'Divorciado(a)' },
            { valor: 'viuvo(a)', rotulo: 'Viúvo(a)' },
            { valor: 'uniao estavel', rotulo: 'União Estável' }
        ]
    },

    'cor_raca': {
        tipo: 'select',
        label: 'Cor/Raça',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'branca', rotulo: 'Branca' },
            { valor: 'preta', rotulo: 'Preta' },
            { valor: 'parda', rotulo: 'Parda' },
            { valor: 'amarela', rotulo: 'Amarela' },
            { valor: 'indígena', rotulo: 'Indígena' },
            { valor: 'prefiro não informar', rotulo: 'Prefiro não informar' }
        ]
    },

    'uf': {
        tipo: 'select',
        label: 'UF',
        opcoes: [
            { valor: '', rotulo: 'Todas' },
            { valor: 'AC', rotulo: 'Acre' },
            { valor: 'AL', rotulo: 'Alagoas' },
            { valor: 'AP', rotulo: 'Amapá' },
            { valor: 'AM', rotulo: 'Amazonas' },
            { valor: 'BA', rotulo: 'Bahia' },
            { valor: 'CE', rotulo: 'Ceará' },
            { valor: 'DF', rotulo: 'Distrito Federal' },
            { valor: 'ES', rotulo: 'Espírito Santo' },
            { valor: 'GO', rotulo: 'Goiás' },
            { valor: 'MA', rotulo: 'Maranhão' },
            { valor: 'MT', rotulo: 'Mato Grosso' },
            { valor: 'MS', rotulo: 'Mato Grosso do Sul' },
            { valor: 'MG', rotulo: 'Minas Gerais' },
            { valor: 'PA', rotulo: 'Pará' },
            { valor: 'PB', rotulo: 'Paraíba' },
            { valor: 'PR', rotulo: 'Paraná' },
            { valor: 'PE', rotulo: 'Pernambuco' },
            { valor: 'PI', rotulo: 'Piauí' },
            { valor: 'RJ', rotulo: 'Rio de Janeiro' },
            { valor: 'RN', rotulo: 'Rio Grande do Norte' },
            { valor: 'RS', rotulo: 'Rio Grande do Sul' },
            { valor: 'RO', rotulo: 'Rondônia' },
            { valor: 'RR', rotulo: 'Roraima' },
            { valor: 'SC', rotulo: 'Santa Catarina' },
            { valor: 'SP', rotulo: 'São Paulo' },
            { valor: 'SE', rotulo: 'Sergipe' },
            { valor: 'TO', rotulo: 'Tocantins' }
        ]
    },

    'midia': {
        tipo: 'select',
        label: 'Como conheceu a clínica',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'indicacao', rotulo: 'Indicação' },
            { valor: 'redes_sociais', rotulo: 'Redes Sociais (Instagram, Facebook etc.)' },
            { valor: 'google_site', rotulo: 'Google / Site' },
            { valor: 'outdoor_panfleto', rotulo: 'Outdoor / Panfleto' },
            { valor: 'evento', rotulo: 'Evento' },
            { valor: 'tv_radio', rotulo: 'TV / Rádio' },
            { valor: 'whatsapp', rotulo: 'WhatsApp' },
            { valor: 'outro', rotulo: 'Outro' }
        ]
    },

    'vinculo': {
        tipo: 'select',
        label: 'Vínculo com Emergência',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'pai', rotulo: 'Pai' },
            { valor: 'mae', rotulo: 'Mãe' },
            { valor: 'padrasto', rotulo: 'Padrasto' },
            { valor: 'madrasta', rotulo: 'Madrasta' },
            { valor: 'filho_filha', rotulo: 'Filho(a)' },
            { valor: 'irmao_irma', rotulo: 'Irmão(ã)' },
            { valor: 'avo_avó', rotulo: 'Avô(ó)' },
            { valor: 'neto_neta', rotulo: 'Neto(a)' },
            { valor: 'tio_tia', rotulo: 'Tio(a)' },
            { valor: 'primo_prima', rotulo: 'Primo(a)' },
            { valor: 'sobrinho_sobrinha', rotulo: 'Sobrinho(a)' },
            { valor: 'cunhado_cunhada', rotulo: 'Cunhado(a)' },
            { valor: 'genro_nora', rotulo: 'Genro/Nora' },
            { valor: 'sogro_sogra', rotulo: 'Sogro(a)' },
            { valor: 'marido_esposa', rotulo: 'Marido/Esposa' },
            { valor: 'companheiro_companheira', rotulo: 'Companheiro(a)' },
            { valor: 'namorado_namorada', rotulo: 'Namorado(a)' },
            { valor: 'amigo_amiga', rotulo: 'Amigo(a)' },
            { valor: 'vizinho_vizinha', rotulo: 'Vizinho(a)' },
            { valor: 'colega_trabalho', rotulo: 'Colega de trabalho' },
            { valor: 'outro', rotulo: 'Outro' }
        ]
    },

    'faixa_etaria': {
        tipo: 'select',
        label: 'Faixa Etária',
        opcoes: [
            { valor: '', rotulo: 'Todas' },
            { valor: 'crianca', rotulo: 'Criança (0-11)' },
            { valor: 'adolescente', rotulo: 'Adolescente (12-17)' },
            { valor: 'jovem', rotulo: 'Jovem (18-29)' },
            { valor: 'adulto', rotulo: 'Adulto (30-59)' },
            { valor: 'idoso', rotulo: 'Idoso (60+)' }
        ]
    },

    'status_paciente': {
        tipo: 'select',
        label: 'Status do Paciente',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Ativo' },
            { valor: 'false', rotulo: 'Inativo' }
        ]
    },

    'pre_cadastro': {
        tipo: 'select',
        label: 'Pré-cadastro',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Sim' },
            { valor: 'false', rotulo: 'Não' }
        ]
    },

    'conferido': {
        tipo: 'select',
        label: 'Dados Conferidos',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Sim' },
            { valor: 'false', rotulo: 'Não' }
        ]
    },

    'consentimento_lgpd': {
        tipo: 'select',
        label: 'Consentimento LGPD',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Consentiu' },
            { valor: 'false', rotulo: 'Não consentiu' }
        ]
    },

    'nf_reembolso_plano': {
        tipo: 'select',
        label: 'Solicita NF para Reembolso',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Sim' },
            { valor: 'false', rotulo: 'Não' }
        ]
    },

    'nf_imposto_renda': {
        tipo: 'select',
        label: 'Solicita NF para IR',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Sim' },
            { valor: 'false', rotulo: 'Não' }
        ]
    },

    'cidade': {
        tipo: 'text',
        label: 'Cidade',
        placeholder: 'Digite o nome da cidade'
    },

    'bairro': {
        tipo: 'text',
        label: 'Bairro',
        placeholder: 'Digite o nome do bairro'
    },

    'profissao': {
        tipo: 'text',
        label: 'Profissão',
        placeholder: 'Digite a profissão'
    },

    'naturalidade': {
        tipo: 'text',
        label: 'Naturalidade',
        placeholder: 'Digite a naturalidade'
    },

    // ===== FILTROS DE PROFISSIONAL =====
    'conselho': {
        tipo: 'select',
        label: 'Conselho Profissional',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'cref', rotulo: 'CREF' },
            { valor: 'crefito', rotulo: 'CREFITO' },
            { valor: 'cfn', rotulo: 'CFN' },
            { valor: 'crbm', rotulo: 'CRBM' },
            { valor: 'coren', rotulo: 'COREN' },
            { valor: 'cra', rotulo: 'CRA' }
        ]
    },

    'especialidade': {
        tipo: 'dynamic_select',
        label: 'Especialidade',
        endpoint: '/api/especialidades/',  // Você precisa criar esse endpoint
        opcoes: []  // Será preenchido via AJAX
    },

    'tipo_funcionario': {
        tipo: 'select',
        label: 'Tipo de Funcionário',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'funcionario', rotulo: 'Funcionário' },
            { valor: 'sublocatario', rotulo: 'Sublocatário' },
            { valor: 'parceiro', rotulo: 'Parceiro' }
        ]
    },

    'status_profissional': {
        tipo: 'select',
        label: 'Status do Profissional',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Ativo' },
            { valor: 'false', rotulo: 'Inativo' }
        ]
    },

    // ===== FILTROS DE AGENDAMENTO =====
    'status_agendamento': {
        tipo: 'select',
        label: 'Status do Agendamento',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'pre', rotulo: 'Pré-Agendado' },
            { valor: 'agendado', rotulo: 'Agendado' },
            { valor: 'finalizado', rotulo: 'Finalizado' },
            { valor: 'desistencia_remarcacao', rotulo: 'Desmarcação com reposição' },
            { valor: 'falta_remarcacao', rotulo: 'Falta com reposição' },
            { valor: 'falta_cobrada', rotulo: 'Falta cobrada' },
            { valor: 'desistencia', rotulo: 'Desistência' }
        ]
    },

    'profissional': {
        tipo: 'dynamic_select',
        label: 'Profissional',
        endpoint: '/api/profissionais/',  // Precisa criar
        opcoes: []
    },

    'profissional_1': {
        tipo: 'dynamic_select',
        label: 'Profissional Principal',
        endpoint: '/api/profissionais/',
        opcoes: []
    },

    'profissional_2': {
        tipo: 'dynamic_select',
        label: 'Profissional Auxiliar',
        endpoint: '/api/profissionais/',
        opcoes: []
    },

    'ambiente': {
        tipo: 'dynamic_select',
        label: 'Sala/Ambiente',
        endpoint: '/api/salas/',  // Precisa criar
        opcoes: []
    },

    'servico': {
        tipo: 'dynamic_select',
        label: 'Serviço',
        endpoint: '/api/servicos/',  // Precisa criar
        opcoes: []
    },

    // ===== FILTROS DE PACOTES =====
    'tipo_reposicao': {
        tipo: 'select',
        label: 'Tipo de Reposição',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'd', rotulo: 'Reposição D' },
            { valor: 'dcr', rotulo: 'Reposição DCR' },
            { valor: 'fcr', rotulo: 'Reposição FCR' }
        ]
    },

    'eh_reposicao': {
        tipo: 'select',
        label: 'É Pacote de Reposição?',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Sim' },
            { valor: 'false', rotulo: 'Não' }
        ]
    },

    'pacote_ativo': {
        tipo: 'select',
        label: 'Pacote Ativo',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Ativo' },
            { valor: 'false', rotulo: 'Inativo' }
        ]
    },

    // ===== FILTROS FINANCEIROS =====
    'forma_pagamento': {
        tipo: 'select',
        label: 'Forma de Pagamento',
        opcoes: [
            { valor: '', rotulo: 'Todas' },
            { valor: 'pix', rotulo: 'Pix' },
            { valor: 'credito', rotulo: 'Cartão de Crédito' },
            { valor: 'debito', rotulo: 'Cartão de Débito' },
            { valor: 'dinheiro', rotulo: 'Dinheiro' },
            { valor: 'transferencia', rotulo: 'Transferência' },
            { valor: 'boleto', rotulo: 'Boleto' }
        ]
    },

    'status_pagamento': {
        tipo: 'select',
        label: 'Status do Pagamento',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'pendente', rotulo: 'Pendente' },
            { valor: 'pago', rotulo: 'Pago' },
            { valor: 'cancelado', rotulo: 'Cancelado' },
            { valor: 'atrasado', rotulo: 'Atrasado' }
        ]
    },

    'status_receita': {
        tipo: 'select',
        label: 'Status da Receita',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'pendente', rotulo: 'Pendente' },
            { valor: 'pago', rotulo: 'Pago' },
            { valor: 'atrasado', rotulo: 'Atrasado' },
            { valor: 'cancelada', rotulo: 'Cancelada' }
        ]
    },

    'status_despesa': {
        tipo: 'select',
        label: 'Status da Despesa',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'pendente', rotulo: 'Pendente' },
            { valor: 'agendado', rotulo: 'Agendado' },
            { valor: 'pago', rotulo: 'Pago' },
            { valor: 'atrasado', rotulo: 'Atrasado' }
        ]
    },

    'categoria_financeira': {
        tipo: 'dynamic_select',
        label: 'Categoria Financeira',
        endpoint: '/api/categorias-financeiras/',  // Precisa criar
        opcoes: []
    },

    'conta_contabil': {
        tipo: 'dynamic_select',
        label: 'Conta Contábil',
        endpoint: '/api/contas-contabeis/',  // Precisa criar
        opcoes: []
    },

    'fornecedor': {
        tipo: 'dynamic_select',
        label: 'Fornecedor',
        endpoint: '/api/fornecedores/',  // Precisa criar
        opcoes: []
    },

    // ===== FILTROS DE FREQUÊNCIA =====
    'status_frequencia': {
        tipo: 'select',
        label: 'Status de Frequência',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'primeiro_mes', rotulo: '1º Mês' },
            { valor: 'premium', rotulo: 'Premium' },
            { valor: 'vip', rotulo: 'VIP' },
            { valor: 'plus', rotulo: 'Plus' },
            { valor: 'indefinido', rotulo: 'Indefinido' }
        ]
    },

    'mes': {
        tipo: 'select',
        label: 'Mês',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: '1', rotulo: 'Janeiro' },
            { valor: '2', rotulo: 'Fevereiro' },
            { valor: '3', rotulo: 'Março' },
            { valor: '4', rotulo: 'Abril' },
            { valor: '5', rotulo: 'Maio' },
            { valor: '6', rotulo: 'Junho' },
            { valor: '7', rotulo: 'Julho' },
            { valor: '8', rotulo: 'Agosto' },
            { valor: '9', rotulo: 'Setembro' },
            { valor: '10', rotulo: 'Outubro' },
            { valor: '11', rotulo: 'Novembro' },
            { valor: '12', rotulo: 'Dezembro' }
        ]
    },

    'ano': {
        tipo: 'number',
        label: 'Ano',
        min: 2020,
        max: 2030,
        valor_padrao: 2026
    },

    'fechado': {
        tipo: 'select',
        label: 'Mês Fechado',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'true', rotulo: 'Fechado' },
            { valor: 'false', rotulo: 'Aberto' }
        ]
    },

    // ===== FILTROS GERAIS =====
    'dias': {
        tipo: 'number',
        label: 'Dias',
        min: 1,
        max: 999,
        valor_padrao: 30
    },

    'periodo_cadastro': {
        tipo: 'select',
        label: 'Período de Cadastro',
        opcoes: [
            { valor: '', rotulo: 'Todos' },
            { valor: 'hoje', rotulo: 'Hoje' },
            { valor: 'semana', rotulo: 'Esta semana' },
            { valor: 'mes', rotulo: 'Este mês' },
            { valor: 'trimestre', rotulo: 'Este trimestre' },
            { valor: 'ano', rotulo: 'Este ano' }
        ]
    },

    'data_inicio': {
        tipo: 'date',
        label: 'Data Início'
    },

    'data_fim': {
        tipo: 'date',
        label: 'Data Fim'
    },

    'valor_minimo': {
        tipo: 'number',
        label: 'Valor Mínimo (R$)',
        min: 0,
        step: 0.01
    },

    'valor_maximo': {
        tipo: 'number',
        label: 'Valor Máximo (R$)',
        min: 0,
        step: 0.01
    },
    'ordenar_por': {
        tipo: 'select',
        label: 'Ordenar por',
        opcoes: [
            { valor: '', rotulo: 'Padrão' },
            { valor: 'nome', rotulo: 'Nome' },
            { valor: 'data_cadastro', rotulo: 'Data de Cadastro' },
            { valor: 'data_nascimento', rotulo: 'Data de Nascimento' },
            { valor: 'aniversario', rotulo: 'Data de Aniversário (mês/dia)' },
            { valor: 'cidade', rotulo: 'Cidade' }
        ]
    },

    'ordem': {
        tipo: 'select',
        label: 'Ordem',
        opcoes: [
            { valor: 'asc', rotulo: 'Crescente' },
            { valor: 'desc', rotulo: 'Decrescente' }
        ]
    },
};

// ============================================
// SUGESTÕES DE FILTROS POR MODELO
// ============================================

const SUGESTOES_FILTROS = {

    'paciente': {
        'basico': ['sexo', 'estado_civil', 'cidade', 'bairro'],
        'cadastro': ['status_paciente', 'pre_cadastro', 'conferido', 'periodo_cadastro'],
        'documentos': ['cpf', 'rg', 'email'],
        'consentimentos': ['consentimento_lgpd', 'nf_reembolso_plano', 'nf_imposto_renda'],
        'origem': ['midia', 'uf', 'naturalidade'],
        'emergencia': ['vinculo', 'nomeEmergencia'],
        'completo': ['sexo', 'estado_civil', 'cor_raca', 'uf', 'cidade', 'bairro',
            'midia', 'status_paciente', 'faixa_etaria']
    },

    'profissional': {
        'basico': ['sexo', 'estado_civil', 'cidade', 'especialidade'],
        'cadastro': ['status_profissional', 'data_cadastro'],
        'documentos': ['conselho', 'cpf', 'cnpj'],
        'contato': ['telefone', 'celular', 'email'],
        'remuneracao': ['valor_hora', 'tipo_funcionario']
    },

    'agendamento': {
        'basico': ['data_inicio', 'data_fim', 'status_agendamento'],
        'profissionais': ['profissional_1', 'profissional_2'],
        'local': ['ambiente'],
        'servico': ['servico', 'especialidade'],
        'pacote': ['pacote', 'tipo_reposicao']
    },

    'financeiro': {
        'receitas': ['data_inicio', 'data_fim', 'status_receita', 'forma_pagamento'],
        'despesas': ['data_inicio', 'data_fim', 'status_despesa', 'categoria_financeira'],
        'contas': ['conta_contabil', 'fornecedor'],
        'valores': ['valor_minimo', 'valor_maximo']
    },

    'frequencia': {
        'basico': ['mes', 'ano', 'status_frequencia'],
        'detalhado': ['fechado', 'percentual_minimo', 'freq_sistema_minima']
    },

    'pacote': {
        'basico': ['data_inicio', 'pacote_ativo', 'tipo_reposicao'],
        'valores': ['valor_minimo', 'valor_maximo'],
        'sessoes': ['qtd_sessoes', 'sessoes_restantes']
    },


};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function renderizarFiltro(campo, valorAtual = '') {
    const config = FILTROS_CONFIG[campo];

    if (!config) {
        console.warn(`Filtro "${campo}" não configurado`);
        return `<div class="campo-group">
            <label>${campo}</label>
            <input type="text" id="extra_${campo}" value="${valorAtual}">
        </div>`;
    }

    let html = `<div class="campo-group"><label>${config.label}</label>`;

    if (config.tipo === 'select' || config.tipo === 'dynamic_select') {
        html += `<select id="extra_${campo}" class="filtro-select">`;

        if (config.opcoes && config.opcoes.length > 0) {
            config.opcoes.forEach(op => {
                const selected = op.valor == valorAtual ? 'selected' : '';
                html += `<option value="${op.valor}" ${selected}>${op.rotulo}</option>`;
            });
        } else {
            html += `<option value="">Selecione...</option>`;
        }

        html += `</select>`;

        // Se for dinâmico, carrega opções via AJAX
        if (config.tipo === 'dynamic_select' && config.endpoint) {
            setTimeout(() => carregarOpcoesDinamicas(campo, config.endpoint, valorAtual), 100);
        }
    }
    else if (config.tipo === 'number') {
        html += `<input type="number" id="extra_${campo}" 
            min="${config.min || 0}" 
            max="${config.max || 999999}" 
            step="${config.step || 1}"
            value="${valorAtual || config.valor_padrao || ''}">`;
    }
    else if (config.tipo === 'date') {
        html += `<input type="date" id="extra_${campo}" value="${valorAtual || ''}">`;
    }
    else if (config.tipo === 'text') {
        html += `<input type="text" id="extra_${campo}" 
            placeholder="${config.placeholder || ''}" 
            value="${valorAtual}">`;
    }
    else if (config.tipo === 'checkbox') {
        html += `<input type="checkbox" id="extra_${campo}" ${valorAtual ? 'checked' : ''}>`;
    }

    html += `</div>`;
    return html;
}

function carregarOpcoesDinamicas(campo, endpoint, valorSelecionado) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById(`extra_${campo}`);
            if (select) {
                // Limpa opções existentes
                select.innerHTML = '<option value="">Selecione...</option>';

                // Adiciona novas opções
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.nome;
                    if (item.id == valorSelecionado) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error(`Erro ao carregar ${campo}:`, error));
}

// ============================================
// EXPORTAÇÃO
// ============================================

// Torna disponível globalmente
window.FILTROS_CONFIG = FILTROS_CONFIG;
window.SUGESTOES_FILTROS = SUGESTOES_FILTROS;
window.renderizarFiltro = renderizarFiltro;





