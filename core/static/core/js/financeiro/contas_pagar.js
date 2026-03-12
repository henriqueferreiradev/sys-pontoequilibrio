// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = 'success') {
    const toastContainer = document.getElementById('toast-container') || criarToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo} toast-slide-in`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-header">
                <div class="toast-icon">
                    ${getIcon(tipo)}
                </div>
                <div class="toast-title">
                    ${getTitle(tipo)}
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div>${mensagem}</div>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Remove após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('toast-slide-out');
            setTimeout(() => toast.remove(), 500);
        }
    }, 5000);
}

// Funções auxiliares
function criarToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getIcon(tipo) {
    const icons = {
        'success': '<i class="fas fa-check-circle"></i>',
        'warning': '<i class="fas fa-exclamation-triangle"></i>',
        'error': '<i class="fas fa-exclamation-circle"></i>',
        'info': '<i class="fas fa-info-circle"></i>'
    };
    return icons[tipo] || icons['info'];
}

function getTitle(tipo) {
    const titles = {
        'success': 'Sucesso',
        'warning': 'Aviso',
        'error': 'Erro',
        'info': 'Informação'
    };
    return titles[tipo] || 'Mensagem';
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('[ContasPagar] Inicializando...');

    // ========================================
    // 1. FUNCIONALIDADE DO MODAL DE FORNECEDOR
    // ========================================
    (function () {
        console.log('[ModalFornecedor] Configurando...');

        // Elementos
        const modal = document.getElementById('modalFornecedor');
        const btnOpen = document.getElementById('btnAbrirModalFornecedor');
        const btnClose = document.getElementById('fecharModalFornecedor');
        const btnConfirmar = document.getElementById('confirmarFornecedor');
        const btnLimpar = document.getElementById('limparFornecedor');
        const busca = document.getElementById('buscaFornecedor');
        const lista = document.getElementById('listaFornecedores');
        const fornecedorId = document.getElementById('fornecedor_id');
        const fornecedorDisplay = document.getElementById('fornecedor_display');

        // Verificar se elementos existem
        if (!modal || !btnOpen) {
            console.error('[ModalFornecedor] Elementos não encontrados!');
            return;
        }

        let fornecedorSelecionado = null;

        // Função para abrir o modal
        function abrirModal() {
            console.log('[ModalFornecedor] Abrindo modal...');
            modal.classList.add('active');

            // Focar no campo de busca
            if (busca) {
                busca.value = '';
                busca.focus();
                filtrarFornecedores('');
            }

            // Habilitar/desabilitar botão confirmar
            if (btnConfirmar) {
                btnConfirmar.disabled = !fornecedorSelecionado;
            }

            // Marcar item selecionado
            marcarItemSelecionado();
        }

        // Função para fechar o modal
        function fecharModal() {
            console.log('[ModalFornecedor] Fechando modal...');
            modal.classList.remove('active');
        }

        // Filtrar fornecedores
        function filtrarFornecedores(termo) {
            if (!lista) return;

            const itens = lista.querySelectorAll('.modal-item');
            termo = termo.toLowerCase().trim();

            itens.forEach(item => {
                const texto = item.textContent.toLowerCase();
                if (texto.includes(termo)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Marcar item selecionado
        function marcarItemSelecionado() {
            if (!lista || !fornecedorSelecionado) return;

            const itens = lista.querySelectorAll('.modal-item');
            itens.forEach(item => {
                item.classList.remove('selected');
                if (item.dataset.id === fornecedorSelecionado.id) {
                    item.classList.add('selected');
                }
            });
        }

        // Event Listeners
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal();
        });

        if (btnClose) {
            btnClose.addEventListener('click', fecharModal);
        }

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                fecharModal();
            }
        });

        // Filtro de busca
        if (busca) {
            busca.addEventListener('input', function (e) {
                filtrarFornecedores(e.target.value);
            });
        }

        // Selecionar fornecedor
        if (lista) {
            lista.addEventListener('click', function (e) {
                const item = e.target.closest('.modal-item');
                if (!item) return;

                // Remover seleção anterior
                lista.querySelectorAll('.modal-item').forEach(i => {
                    i.classList.remove('selected');
                });

                // Selecionar novo
                item.classList.add('selected');
                fornecedorSelecionado = {
                    id: item.dataset.id,
                    nome: item.dataset.nome,
                    centroCustoId: item.dataset.centroCustoId,
                    centroCustoCodigo: item.dataset.centroCustoCodigo,
                    centroCustoDescricao: item.dataset.centroCustoDescricao
                };

                // Habilitar botão confirmar
                if (btnConfirmar) {
                    btnConfirmar.disabled = false;
                }
            });
        }

        // Botão confirmar
        // Botão confirmar
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', function () {
                if (!fornecedorSelecionado) return;

                // Preencher fornecedor
                fornecedorId.value = fornecedorSelecionado.id;
                fornecedorDisplay.value = fornecedorSelecionado.nome;

                // 🔥 PREENCHER PLANO DE CONTAS AUTOMATICAMENTE
                const contaCodigoInput = document.querySelector('.conta-codigo');
                const contaDescInput = document.querySelector('.conta-desc');

                if (
                    fornecedorSelecionado.centroCustoCodigo &&
                    fornecedorSelecionado.centroCustoDescricao &&
                    contaCodigoInput &&
                    contaDescInput
                ) {
                    contaCodigoInput.value = fornecedorSelecionado.centroCustoCodigo;
                    contaDescInput.value =
                        `${fornecedorSelecionado.centroCustoCodigo} - ${fornecedorSelecionado.centroCustoDescricao}`;

                    console.log('[ModalFornecedor] Plano de contas preenchido automaticamente');
                } else {
                    // Se fornecedor não tiver plano
                    if (contaCodigoInput) contaCodigoInput.value = '';
                    if (contaDescInput) contaDescInput.value = '';
                    console.log('[ModalFornecedor] Fornecedor sem plano de contas');
                }

                fecharModal();
            });
        }


        // Botão limpar
        if (btnLimpar) {
            btnLimpar.addEventListener('click', function () {
                fornecedorSelecionado = null;

                // Limpar seleção visual
                if (lista) {
                    lista.querySelectorAll('.modal-item').forEach(i => {
                        i.classList.remove('selected');
                    });
                }

                // Limpar campos do fornecedor
                if (fornecedorId) fornecedorId.value = '';
                if (fornecedorDisplay) fornecedorDisplay.value = '';

                // Limpar campos do centro de custo também
                const centroCustoId = document.getElementById('centro_custo_id');
                const centroCustoCodigo = document.getElementById('centro_custo_codigo');
                const centroCustoDisplay = document.getElementById('centro_custo_display');

                if (centroCustoId) centroCustoId.value = '';
                if (centroCustoCodigo) centroCustoCodigo.value = '';
                if (centroCustoDisplay) centroCustoDisplay.value = '';

                // Desabilitar botão confirmar
                if (btnConfirmar) btnConfirmar.disabled = true;
            });
        }

        console.log('[ModalFornecedor] Configuração concluída!');
    })();


    // ========================================
    // 3. FUNCIONALIDADES GERAIS DA PÁGINA
    // ========================================

    // Bulk selection functionality
    const selectAll = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');

    function updateBulkActions() {
        const selected = document.querySelectorAll('.row-checkbox:checked').length;
        if (selectedCount) selectedCount.textContent = selected;

        if (selected > 0 && bulkActions) {
            bulkActions.classList.add('active');
        } else if (bulkActions) {
            bulkActions.classList.remove('active');
        }
    }

    if (selectAll) {
        selectAll.addEventListener('change', function () {
            const isChecked = this.checked;
            rowCheckboxes.forEach(checkbox => {
                if (!checkbox.disabled) {
                    checkbox.checked = isChecked;
                }
            });
            updateBulkActions();
        });
    }

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });

    // Bulk action buttons
    document.getElementById('btnBulkPay')?.addEventListener('click', function () {
        const selected = Array.from(document.querySelectorAll('.row-checkbox:checked'))
            .map(cb => cb.closest('tr').querySelector('td:nth-child(3)').textContent);
        alert(`Marcar como pago: ${selected.join(', ')}`);
    });

    document.getElementById('btnBulkDeselect')?.addEventListener('click', function () {
        rowCheckboxes.forEach(cb => cb.checked = false);
        if (selectAll) selectAll.checked = false;
        updateBulkActions();
    });

    // Filter functionality
    document.getElementById('btnFiltrar')?.addEventListener('click', function () {
        console.log('Aplicando filtros...');
    });

    document.getElementById('btnLimparFiltros')?.addEventListener('click', function () {
        document.querySelectorAll('.filter-select, .filter-input').forEach(el => {
            if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else {
                el.value = '';
            }
        });
    });

    // Enhanced modal functionality
    const modals = {
        pagamento: document.getElementById('modalPagamento'),
        novaDespesa: document.getElementById('modalNovaDespesa'),
        fornecedor: document.getElementById('modalFornecedor'),
        centroCusto: document.getElementById('modalCentroCusto')
    };

    // Open modals
    document.querySelectorAll('.btn-success.btn-icon').forEach(btn => {
        btn.addEventListener('click', () => modals.pagamento.classList.add('active'));
    });

    document.getElementById('openModalNovaDespesa')?.addEventListener('click',
        () => modals.novaDespesa.classList.add('active'));

    // Close modals
    document.getElementById('closePaymentModal')?.addEventListener('click',
        () => modals.pagamento.classList.remove('active'));
    document.getElementById('cancelPaymentModal')?.addEventListener('click',
        () => modals.pagamento.classList.remove('active'));

    document.getElementById('closeNovaDespesa')?.addEventListener('click',
        () => modals.novaDespesa.classList.remove('active'));
    document.getElementById('cancelNovaDespesa')?.addEventListener('click',
        () => modals.novaDespesa.classList.remove('active'));

    // Close modals on outside click
    Object.values(modals).forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Dynamic form fields
    const anexarComprovante = document.getElementById('anexarComprovante');
    const comprovanteField = document.getElementById('comprovanteField');
    if (anexarComprovante && comprovanteField) {
        anexarComprovante.addEventListener('change', () => {
            comprovanteField.style.display = anexarComprovante.checked ? 'block' : 'none';
        });
    }

    const despesaRecorrente = document.getElementById('despesaRecorrente');
    const recorrenciaFields = document.getElementById('recorrenciaFields');
    if (despesaRecorrente && recorrenciaFields) {
        despesaRecorrente.addEventListener('change', () => {
            recorrenciaFields.style.display = despesaRecorrente.checked ? 'grid' : 'none';
        });
    }

    // Export functionality
    document.getElementById('btnExport')?.addEventListener('click', function () {
        alert('Exportando dados...');
    });

    // Print functionality
    document.getElementById('btnPrint')?.addEventListener('click', function () {
        window.print();
    });

    // Dropdown functionality
    document.addEventListener('click', function (e) {
        const toggle = e.target.closest('.dropdown-toggle');
        const openMenus = document.querySelectorAll('.dropdown-menu.show');

        if (toggle) {
            e.preventDefault();
            const menu = toggle.parentElement.querySelector('.dropdown-menu');
            if (menu) menu.classList.toggle('show');

            // Close other menus
            openMenus.forEach(m => {
                if (m !== menu) m.classList.remove('show');
            });
        } else {
            openMenus.forEach(m => m.classList.remove('show'));
        }
    });

    console.log('[ContasPagar] Configuração concluída!');
});

// ============================================================
// NOVA DESPESA COM RECORRÊNCIA (TODAS AS FREQUÊNCIAS)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const valorInput = document.getElementById('valor_total');
    const recorrenteCheck = document.getElementById('despesaRecorrente');

    // Container de recorrência
    const recorrenciaContainer = document.getElementById('recorrenciaContainer');

    // Elementos do DOM
    const tipoRecorrenciaSelector = document.getElementById('tipoRecorrenciaSelector');
    const tipoRecorrencia = document.getElementById('tipoRecorrencia');
    const recorrenciaMesesFields = document.getElementById('recorrenciaMesesFields');
    const recorrenciaDataFields = document.getElementById('recorrenciaDataFields');
    const frequenciaField = document.getElementById('frequenciaField');
    const frequenciaRecorrencia = document.getElementById('frequencia_recorrencia');
    const previewRecorrencia = document.getElementById('previewRecorrencia');
    const previewTexto = document.getElementById('previewTexto');

    // Inputs específicos
    const inicioMeses = document.getElementById('inicio_recorrencia_meses');
    const qtdMeses = document.getElementById('qtd_meses');
    const inicioData = document.getElementById('inicio_recorrencia_data');
    const terminoData = document.getElementById('termino_recorrencia');

    // Mapeamento de frequências para dias/meses
    const frequenciaMap = {
        'semanal': { dias: 7, tipo: 'dias', label: 'semanal' },
        'quinzenal': { dias: 15, tipo: 'dias', label: 'quinzenal' },
        'mensal': { meses: 1, tipo: 'meses', label: 'mensal' },
        'bimestral': { meses: 2, tipo: 'meses', label: 'bimestral' },
        'trimestral': { meses: 3, tipo: 'meses', label: 'trimestral' },
        'semestral': { meses: 6, tipo: 'meses', label: 'semestral' },
        'anual': { meses: 12, tipo: 'meses', label: 'anual' }
    };

    // Função para formatar valor monetário
    function parseValor(valor) {
        if (!valor) return 0;
        // Remove pontos de milhar e substitui vírgula por ponto
        return parseFloat(
            valor.replace(/\./g, '').replace(',', '.')
        ) || 0;
    }

    function formatar(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Função para calcular datas de recorrência
    function calcularDatasRecorrencia(dataInicio, frequencia, quantidade) {
        const datas = [];
        let dataAtual = new Date(dataInicio + 'T12:00:00'); // Evita problemas de fuso

        const config = frequenciaMap[frequencia];
        if (!config) return datas;

        for (let i = 0; i < quantidade; i++) {
            if (i > 0) {
                if (config.tipo === 'dias') {
                    // Para frequências em dias (semanal, quinzenal)
                    dataAtual = new Date(dataAtual);
                    dataAtual.setDate(dataAtual.getDate() + config.dias);
                } else {
                    // Para frequências em meses
                    dataAtual = new Date(dataAtual);
                    dataAtual.setMonth(dataAtual.getMonth() + config.meses);
                }
            }
            datas.push(new Date(dataAtual));
        }

        return datas;
    }

    // Função para calcular quantidade de ocorrências baseado em data de término
    function calcularQuantidadePorData(dataInicio, dataTermino, frequencia) {
        const inicio = new Date(dataInicio + 'T12:00:00');
        const termino = new Date(dataTermino + 'T12:00:00');

        if (termino <= inicio) return 1;

        const config = frequenciaMap[frequencia];
        if (!config) return 1;

        let quantidade = 0;
        let dataAtual = new Date(inicio);

        while (dataAtual <= termino) {
            quantidade++;

            if (config.tipo === 'dias') {
                dataAtual.setDate(dataAtual.getDate() + config.dias);
            } else {
                dataAtual.setMonth(dataAtual.getMonth() + config.meses);
            }
        }

        return quantidade;
    }

    // Função para calcular total da recorrência
    function calcularTotalRecorrencia() {
        const valor = parseValor(valorInput?.value || '0');

        if (!recorrenteCheck?.checked) {
            return { valorMensal: valor, quantidade: 1, valorTotal: valor };
        }

        const frequencia = frequenciaRecorrencia?.value || 'mensal';
        let quantidade = 1;

        if (tipoRecorrencia?.value === 'meses') {
            quantidade = parseInt(qtdMeses?.value) || 1;
        } else {
            if (inicioData?.value && terminoData?.value) {
                quantidade = calcularQuantidadePorData(
                    inicioData.value,
                    terminoData.value,
                    frequencia
                );
            }
        }

        return {
            valorUnitario: valor,
            quantidade: quantidade,
            valorTotal: valor * quantidade,
            frequencia: frequenciaMap[frequencia]?.label || frequencia
        };
    }

    // Função para obter nome do mês
    function getMesNome(data) {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return meses[data.getMonth()];
    }

    // Função para formatar data abreviada
    function formatarDataAbreviada(data) {
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    // Função para atualizar preview da recorrência
    function atualizarPreviewRecorrencia() {
        if (!recorrenteCheck?.checked) {
            if (previewRecorrencia) previewRecorrencia.style.display = 'none';
            return;
        }

        const valor = parseValor(valorInput?.value || '0');
        const frequencia = frequenciaRecorrencia?.value || 'mensal';
        const config = frequenciaMap[frequencia];

        let inicio, quantidade;

        if (tipoRecorrencia?.value === 'meses') {
            inicio = inicioMeses?.value;
            quantidade = parseInt(qtdMeses?.value) || 1;
        } else {
            inicio = inicioData?.value;
            if (inicioData?.value && terminoData?.value) {
                quantidade = calcularQuantidadePorData(
                    inicioData.value,
                    terminoData.value,
                    frequencia
                );
            } else {
                quantidade = 1;
            }
        }

        if (!inicio || valor <= 0) {
            if (previewTexto) {
                previewTexto.innerText = !inicio ?
                    'Selecione a data de início' :
                    'Informe um valor válido';
            }
            if (previewRecorrencia) previewRecorrencia.style.display = 'block';
            return;
        }

        // Calcula as próximas datas
        const datas = calcularDatasRecorrencia(inicio, frequencia, quantidade);

        if (datas.length === 0) {
            previewRecorrencia.style.display = 'none';
            return;
        }

        // Monta texto do preview baseado no tipo de frequência
        let texto = '';
        const frequenciaLabel = config.label;

        if (quantidade === 1) {
            texto = `💰 Despesa única de ${formatar(valor)} em ${datas[0].toLocaleDateString('pt-BR')}`;
        } else {
            // Cabeçalho
            texto = `💰 ${quantidade}x de ${formatar(valor)} (${frequenciaLabel})<br>`;
            texto += `📅 Início: ${datas[0].toLocaleDateString('pt-BR')}<br>`;
            texto += `📅 Término: ${datas[datas.length - 1].toLocaleDateString('pt-BR')}<br>`;
            texto += `💵 Total: ${formatar(valor * quantidade)}`;

            // Preview das datas
            if (config.tipo === 'dias') {
                // Para frequências diárias/semanais
                if (quantidade <= 5) {
                    texto += `<br><br><small>Datas: `;
                    for (let i = 0; i < quantidade; i++) {
                        texto += datas[i].toLocaleDateString('pt-BR');
                        if (i < quantidade - 1) texto += ', ';
                    }
                    texto += `</small>`;
                } else {
                    texto += `<br><br><small>Primeiras datas: `;
                    for (let i = 0; i < 3; i++) {
                        texto += datas[i].toLocaleDateString('pt-BR');
                        if (i < 2) texto += ', ';
                    }
                    texto += ` ... +${quantidade - 3} ocorrências</small>`;
                }
            } else {
                // Para frequências mensais/anuais
                if (quantidade <= 6) {
                    texto += `<br><br><small>Meses: `;
                    for (let i = 0; i < quantidade; i++) {
                        texto += getMesNome(datas[i]);
                        if (i < quantidade - 1) texto += ', ';
                    }
                    texto += `</small>`;
                } else {
                    texto += `<br><br><small>Primeiros meses: `;
                    for (let i = 0; i < 3; i++) {
                        texto += getMesNome(datas[i]);
                        if (i < 2) texto += ', ';
                    }
                    texto += ` ... +${quantidade - 3} meses</small>`;
                }
            }
        }

        if (previewTexto) previewTexto.innerHTML = texto;
        if (previewRecorrencia) previewRecorrencia.style.display = 'block';
    }

    // Event listener para checkbox recorrente
    if (recorrenteCheck) {
        recorrenteCheck.addEventListener('change', function () {
            const isRecorrente = this.checked;

            // Mostra todos os containers de recorrência
            if (tipoRecorrenciaSelector) tipoRecorrenciaSelector.style.display = isRecorrente ? 'block' : 'none';
            if (frequenciaField) frequenciaField.style.display = isRecorrente ? 'block' : 'none';

            if (isRecorrente) {
                // Mostra o tipo selecionado inicialmente
                if (tipoRecorrencia?.value === 'meses') {
                    if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'grid';
                    if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'none';
                } else {
                    if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'none';
                    if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'grid';
                }

                // Pré-preenche datas
                const hoje = new Date().toISOString().split('T')[0];
                if (inicioMeses && !inicioMeses.value) inicioMeses.value = hoje;
                if (inicioData && !inicioData.value) inicioData.value = hoje;

                // Pré-preenche quantidade de meses
                if (qtdMeses && !qtdMeses.value) qtdMeses.value = '12';

                atualizarPreviewRecorrencia();
            } else {
                // Esconde todos os campos
                if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'none';
                if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'none';
                if (previewRecorrencia) previewRecorrencia.style.display = 'none';
            }
        });
    }

    // Troca entre os tipos de recorrência
    if (tipoRecorrencia) {
        tipoRecorrencia.addEventListener('change', function () {
            if (this.value === 'meses') {
                if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'grid';
                if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'none';
            } else {
                if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'none';
                if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'grid';
            }
            atualizarPreviewRecorrencia();
        });
    }

    // Event listeners para atualizar preview
    if (valorInput) valorInput.addEventListener('input', atualizarPreviewRecorrencia);
    if (inicioMeses) inicioMeses.addEventListener('change', atualizarPreviewRecorrencia);
    if (qtdMeses) qtdMeses.addEventListener('input', atualizarPreviewRecorrencia);
    if (inicioData) inicioData.addEventListener('change', atualizarPreviewRecorrencia);
    if (terminoData) terminoData.addEventListener('change', atualizarPreviewRecorrencia);
    if (frequenciaRecorrencia) frequenciaRecorrencia.addEventListener('change', atualizarPreviewRecorrencia);

    // Validação antes de salvar
    const saveBtn = document.getElementById('saveNovaDespesa');
    if (saveBtn) {
        saveBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Validações básicas
            const fornecedorId = document.getElementById('fornecedor_id')?.value;
            if (!fornecedorId) {
                mostrarMensagem('Selecione um fornecedor', 'warning');
                return;
            }

            const contaCodigo = document.querySelector('.conta-codigo')?.value;
            if (!contaCodigo) {
                mostrarMensagem('Selecione um plano de contas', 'warning');
                return;
            }

            const descricao = document.getElementById('despDescricao')?.value;
            if (!descricao) {
                mostrarMensagem('Preencha a descrição da despesa', 'warning');
                return;
            }

            const vencimento = document.getElementById('despVencimento')?.value;
            if (!vencimento) {
                mostrarMensagem('Preencha a data de vencimento', 'warning');
                return;
            }

            const valor = parseValor(valorInput?.value);
            if (valor <= 0) {
                mostrarMensagem('Preencha um valor válido', 'warning');
                return;
            }

            // Validações específicas para despesa recorrente
            if (recorrenteCheck?.checked) {
                let inicio, quantidade;

                if (tipoRecorrencia?.value === 'meses') {
                    inicio = inicioMeses?.value;
                    quantidade = parseInt(qtdMeses?.value) || 0;

                    if (!inicio) {
                        mostrarMensagem('Preencha a data de início da recorrência', 'warning');
                        return;
                    }

                    if (quantidade < 1) {
                        mostrarMensagem('A quantidade de ocorrências deve ser maior que zero', 'warning');
                        return;
                    }
                } else {
                    inicio = inicioData?.value;
                    const termino = terminoData?.value;

                    if (!inicio || !termino) {
                        mostrarMensagem('Preencha as datas de início e término', 'warning');
                        return;
                    }

                    if (new Date(termino) <= new Date(inicio)) {
                        mostrarMensagem('Data de término deve ser posterior à data de início', 'warning');
                        return;
                    }

                    quantidade = calcularQuantidadePorData(inicio, termino, frequenciaRecorrencia?.value);
                }

                if (quantidade > 60) {
                    if (!confirm(`A recorrência tem ${quantidade} ocorrências. Deseja continuar?`)) {
                        return;
                    }
                }

                const total = calcularTotalRecorrencia();
                const frequenciaLabel = frequenciaMap[frequenciaRecorrencia?.value]?.label || frequenciaRecorrencia?.value;

                const confirmMsg =
                    `CONFIRMAR DESPESA RECORRENTE\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Fornecedor: ${document.getElementById('fornecedor_display')?.value}\n` +
                    `Descrição: ${descricao}\n` +
                    `Valor unitário: ${formatar(total.valorUnitario)}\n` +
                    `Frequência: ${frequenciaLabel}\n` +
                    `Quantidade: ${total.quantidade} ocorrência(s)\n` +
                    `Data início: ${new Date(inicio).toLocaleDateString('pt-BR')}\n` +
                    `Valor total: ${formatar(total.valorTotal)}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Deseja confirmar o cadastro desta despesa recorrente?`;

                if (!confirm(confirmMsg)) {
                    return;
                }
            }

            // Se passou por todas validações, desabilita botão e envia
            this.disabled = true;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

            // Coleta dados para envio
            const payload = {
                fornecedor_id: fornecedorId,
                conta_codigo: contaCodigo,
                descricao: descricao,
                vencimento: vencimento,
                competencia: document.querySelector('input[type="month"]')?.value,
                valor: valor,
                status: document.getElementById('status_despesa')?.value || 'pendente',
                conta_debito: document.getElementById('conta_debito')?.value,
                observacoes: document.getElementById('observacoes_despesa')?.value,
                recorrente: recorrenteCheck?.checked || false,
                tipo_recorrencia: tipoRecorrencia?.value,
                frequencia: frequenciaRecorrencia?.value,
                inicio_recorrencia: tipoRecorrencia?.value === 'meses' ? inicioMeses?.value : inicioData?.value,
                qtd_ocorrencias: tipoRecorrencia?.value === 'meses' ? parseInt(qtdMeses?.value) : null,
                termino_recorrencia: tipoRecorrencia?.value === 'data' ? terminoData?.value : null
            };

            console.log('[NovaDespesa] Enviando:', payload);

            // Simula sucesso (substituir por fetch real)
            setTimeout(() => {
                mostrarMensagem('Despesa cadastrada com sucesso!', 'success');

                // Fecha modal e limpa formulário
                const modal = document.getElementById('modalNovaDespesa');
                if (modal) modal.classList.remove('active');

                document.getElementById('formNovaDespesa')?.reset();

                // Reabilita botão
                this.disabled = false;
                this.innerHTML = '<i class="fa-solid fa-save"></i> Salvar Despesa';

                // Recarrega tabela
                setTimeout(() => location.reload(), 1500);
            }, 1000);
        });
    }

    // Inicializa estado dos campos
    if (recorrenciaMesesFields) recorrenciaMesesFields.style.display = 'none';
    if (recorrenciaDataFields) recorrenciaDataFields.style.display = 'none';
    if (tipoRecorrenciaSelector) tipoRecorrenciaSelector.style.display = 'none';
    if (frequenciaField) frequenciaField.style.display = 'none';
    if (previewRecorrencia) previewRecorrencia.style.display = 'none';

    console.log('[NovaDespesa] Configuração de recorrência concluída!');
});
/**
 * contas_pagar_complemento.js
 * ============================================================
 * Código FALTANTE identificado em contas_pagar.js
 * Inclua este arquivo APÓS contas_pagar.js no template:
 *   <script src="{% static 'core/js/financeiro/contas_pagar_complemento.js' %}"></script>
 * ============================================================
 */

// ============================================================
// 1. FUNÇÃO abrirModalSelecao — AUSENTE NO JS ORIGINAL
//    Chamada no botão de Plano de Contas do modal Nova Despesa:
//    onclick="abrirModalSelecao(this)"
// ============================================================


// ============================================================
// 2. MODAL DE DETALHES — AUSENTE NO JS ORIGINAL
//    Botões com ícone fa-eye abrem painel de detalhes da conta
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    // ---------- Criar modal de detalhes dinamicamente ----------
    const detailsModal = document.createElement('div');
    detailsModal.id = 'modalDetalhes';
    detailsModal.className = 'modal-overlay';
    detailsModal.innerHTML = `
        <div class="modal-container" style="max-width:620px;">
            <div class="modal-header">
                <h3 class="modal-title"><i class="fa-solid fa-eye"></i> Detalhes da Conta</h3>
                <button class="modal-close" id="closeDetalhesModal">&times;</button>
            </div>
            <div class="modal-body" id="detalhesModalBody">
                <div style="text-align:center;padding:2rem;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--roxoPrincipal);"></i>
                    <p>Carregando...</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" id="cancelDetalhesModal">Fechar</button>
                <button class="btn btn-primary" id="btnEditarDetalhe">
                    <i class="fa-solid fa-pencil"></i> Editar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(detailsModal);

    // Fechar modal de detalhes
    ['closeDetalhesModal', 'cancelDetalhesModal'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => {
            detailsModal.classList.remove('active');
        });
    });
    detailsModal.addEventListener('click', e => {
        if (e.target === detailsModal) detailsModal.classList.remove('active');
    });

    // Função para montar conteúdo de detalhes a partir da linha da tabela
    function montarDetalhes(row) {
        const cells = row.querySelectorAll('td');
        const venc = cells[0]?.textContent.trim() || '—';
        const forn = cells[1]?.textContent.trim() || '—';
        const desc = cells[2]?.textContent.trim() || '—';
        const categ = cells[3]?.textContent.trim() || '—';
        const valor = cells[4]?.textContent.trim() || '—';
        const badgeEl = cells[5]?.querySelector('.badge');
        const status = badgeEl?.textContent.trim() || '—';
        const badgeClass = badgeEl?.className || '';

        return `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Fornecedor</div>
                    <div style="font-weight:600;">${forn}</div>
                </div>
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Descrição</div>
                    <div>${desc}</div>
                </div>
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Vencimento</div>
                    <div>${venc}</div>
                </div>
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Categoria</div>
                    <div>${categ}</div>
                </div>
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Valor</div>
                    <div style="font-size:1.4rem;font-weight:800;color:var(--roxoPrincipal);">${valor}</div>
                </div>
                <div>
                    <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.35rem;">Status</div>
                    <span class="${badgeClass}">${status}</span>
                </div>
            </div>
            <hr style="margin:1.25rem 0;border-color:var(--cinza-borda);">
            <div>
                <div style="font-size:.8rem;text-transform:uppercase;letter-spacing:.5px;color:var(--cinza-escuro);font-weight:600;margin-bottom:.5rem;">Histórico de Alterações</div>
                <div style="color:var(--cinza-medio);font-size:.9rem;font-style:italic;">Nenhum histórico registrado.</div>
            </div>
        `;
    }

    // Vincular clique nos botões de detalhes (fa-eye)
    document.querySelectorAll('.btn-icon[title="Detalhes"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const body = document.getElementById('detalhesModalBody');
            if (body && row) body.innerHTML = montarDetalhes(row);

            // Guardar referência para botão Editar
            detailsModal._currentRow = row;
            detailsModal.classList.add('active');
        });
    });

    // Botão Editar dentro do modal de detalhes → abre modal de edição
    document.getElementById('btnEditarDetalhe')?.addEventListener('click', function () {
        detailsModal.classList.remove('active');
        // Abre o modal nova despesa em modo edição (implementar preenchimento conforme necessidade)
        const novaDespesa = document.getElementById('modalNovaDespesa');
        if (novaDespesa) {
            novaDespesa.classList.add('active');
            console.log('[Detalhes] Modal de edição aberto.');
        }
    });


    // ============================================================
    // 3. SAVE NOVA DESPESA — AJAX POST AUSENTE NO JS ORIGINAL
    // ============================================================
    document.getElementById('saveNovaDespesa')?.addEventListener('click', function () {
        const form = document.getElementById('formNovaDespesa');
        if (!form) return;

        // Função auxiliar para parse de valor monetário
        function parseValor(valor) {
            if (!valor) return 0;
            return parseFloat(
                valor.replace(/\./g, '').replace(',', '.')
            ) || 0;
        }

        // Validação básica dos campos obrigatórios
        const obrigatorios = form.querySelectorAll('[required]');
        let valido = true;
        obrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                campo.style.borderColor = 'var(--erro)';
                valido = false;
            } else {
                campo.style.borderColor = '';
            }
        });

        if (!valido) {
            mostrarMensagem('Preencha todos os campos obrigatórios (*).', 'warning');
            return;
        }

        // Validações específicas para recorrência
        const recorrenteCheck = document.getElementById('despesaRecorrente');
        const tipoRecorrencia = document.getElementById('tipoRecorrencia');

        if (recorrenteCheck?.checked) {
            if (tipoRecorrencia?.value === 'meses') {
                const inicioMeses = document.getElementById('inicio_recorrencia_meses')?.value;
                const qtdMeses = document.getElementById('qtd_meses')?.value;

                if (!inicioMeses) {
                    mostrarMensagem('Preencha a data de início da recorrência', 'warning');
                    return;
                }
                if (!qtdMeses || parseInt(qtdMeses) < 1) {
                    mostrarMensagem('Preencha a quantidade de ocorrências', 'warning');
                    return;
                }
            } else {
                const inicioData = document.getElementById('inicio_recorrencia_data')?.value;
                const terminoData = document.getElementById('termino_recorrencia')?.value;

                if (!inicioData || !terminoData) {
                    mostrarMensagem('Preencha as datas de início e término', 'warning');
                    return;
                }

                if (new Date(terminoData) <= new Date(inicioData)) {
                    mostrarMensagem('Data de término deve ser posterior à data de início', 'warning');
                    return;
                }
            }
        }

        // Coletar dados do formulário
        const fornecedorId = document.getElementById('fornecedor_id')?.value;
        const contaCodigo = document.querySelector('.conta-codigo')?.value;


        const descricao = document.getElementById('despDescricao')?.value// Ajuste conforme necessário

        const vencimento = document.getElementById('despVencimento')?.value;
        const competencia = document.getElementById('despCompetencia')?.value;
        const valorTotal = document.getElementById('valor_total')?.value;
        const status = document.getElementById('status_despesa')?.value || 'pendente';
        const contaDebito = document.getElementById('conta_debito')?.value;
        const obs = document.getElementById('observacoes_despesa')?.value;
        const documento = document.getElementById('despDocumento')?.value

        // Campos de recorrência
        const recorrente = document.getElementById('despesaRecorrente')?.checked || false;

        let payload = {
            // Campos básicos
            fornecedor_id: fornecedorId,
            conta_codigo: contaCodigo,
            descricao: descricao,
            vencimento: vencimento,
            competencia: competencia,
            valor: parseValor(valorTotal),
            status: status,
            conta_debito: contaDebito,
            observacoes: obs,
            documento: documento,

            // Campos de recorrência
            recorrente: recorrente
        };

        // Adiciona campos de recorrência se for recorrente
        if (recorrente) {
            const frequencia = document.getElementById('frequencia_recorrencia')?.value || 'mensal';
            const tipoRec = document.getElementById('tipoRecorrencia')?.value || 'meses';

            payload.frequencia = frequencia;
            payload.tipo_recorrencia = tipoRec;

            if (tipoRec === 'meses') {
                payload.inicio_recorrencia = document.getElementById('inicio_recorrencia_meses')?.value;
                payload.qtd_ocorrencias = parseInt(document.getElementById('qtd_meses')?.value) || 1;
            } else {
                payload.inicio_recorrencia = document.getElementById('inicio_recorrencia_data')?.value;
                payload.termino_recorrencia = document.getElementById('termino_recorrencia')?.value;

                // Calcula quantidade de ocorrências baseada nas datas
                if (payload.inicio_recorrencia && payload.termino_recorrencia) {
                    const inicio = new Date(payload.inicio_recorrencia + 'T12:00:00');
                    const termino = new Date(payload.termino_recorrencia + 'T12:00:00');

                    const frequenciaMap = {
                        'semanal': { dias: 7 },
                        'quinzenal': { dias: 15 },
                        'mensal': { meses: 1 },
                        'bimestral': { meses: 2 },
                        'trimestral': { meses: 3 },
                        'semestral': { meses: 6 },
                        'anual': { meses: 12 }
                    };

                    const config = frequenciaMap[frequencia];
                    let qtd = 1;
                    let dataAtual = new Date(inicio);

                    while (dataAtual <= termino) {
                        qtd++;
                        if (config.dias) {
                            dataAtual.setDate(dataAtual.getDate() + config.dias);
                        } else {
                            dataAtual.setMonth(dataAtual.getMonth() + config.meses);
                        }
                    }

                    payload.qtd_ocorrencias = qtd;
                }
            }

            // Calcula valor total da recorrência
            payload.valor_total_recorrencia = payload.valor * (payload.qtd_ocorrencias || 1);
        }

        console.log('[NovaDespesa] Enviando payload:', payload);

        // Obter CSRF token do cookie Django
        const csrfToken = getCookie('csrftoken');

        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

        fetch('/financeiro/contas-pagar/nova/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarMensagem('Despesa cadastrada com sucesso!', 'success');

                    // Se for recorrente e tiver múltiplas ocorrências, mostra mensagem adicional
                    if (recorrente && payload.qtd_ocorrencias > 1) {
                        mostrarMensagem(
                            `${payload.qtd_ocorrencias} ocorrências geradas com sucesso!`,
                            'info'
                        );
                    }

                    document.getElementById('modalNovaDespesa')?.classList.remove('active');
                    form.reset();

                    // Recarregar tabela após salvar
                    setTimeout(() => location.reload(), 1500);
                } else {
                    mostrarMensagem(data.message || 'Erro ao salvar despesa.', 'error');
                }
            })
            .catch(err => {
                console.error('[NovaDespesa] Erro:', err);
                mostrarMensagem('Erro de conexão ao salvar despesa.', 'error');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save"></i> Salvar Despesa';
            });
    });


    // ============================================================
    // 4. SAVE PAGAMENTO — AJAX POST AUSENTE NO JS ORIGINAL
    // ============================================================
    document.getElementById('savePagamento')?.addEventListener('click', function () {
        const form = document.getElementById('formPagamento');
        if (!form) return;

        const dataPagto = form.querySelector('input[type="date"]')?.value;
        const formaPagto = form.querySelector('select')?.value;
        const valorPago = form.querySelectorAll('.form-control')[5]?.value;
        const multa = form.querySelectorAll('.form-control')[6]?.value;
        const desconto = form.querySelectorAll('.form-control')[7]?.value;
        const contaBancaria = form.querySelectorAll('select')[1]?.value;
        const nrDoc = form.querySelectorAll('.form-control')[9]?.value;
        const obs = form.querySelector('textarea')?.value;

        if (!dataPagto || !formaPagto || !valorPago) {
            mostrarMensagem('Preencha data, forma de pagamento e valor pago.', 'warning');
            return;
        }

        const payload = {
            data_pagamento: dataPagto,
            forma_pagamento: formaPagto,
            valor_pago: valorPago,
            multa: multa,
            desconto: desconto,
            conta_bancaria: contaBancaria,
            nr_documento: nrDoc,
            observacoes: obs
        };

        console.log('[Pagamento] Enviando payload:', payload);

        const csrfToken = getCookie('csrftoken');
        const btn = this;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';

        // A URL deve incluir o ID da conta — adapte conforme sua URL pattern
        const contaId = document.getElementById('modalPagamento')?.dataset.contaId || '';

        fetch(`/financeiro/contas-pagar/${contaId}/pagar/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarMensagem('Pagamento registrado com sucesso!', 'success');
                    document.getElementById('modalPagamento')?.classList.remove('active');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    mostrarMensagem(data.message || 'Erro ao registrar pagamento.', 'error');
                }
            })
            .catch(err => {
                console.error('[Pagamento] Erro:', err);
                mostrarMensagem('Erro de conexão ao registrar pagamento.', 'error');
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Registrar Pagamento';
            });
    });

    // Vincular data-conta-id ao abrir modal de pagamento por botão da linha
    document.querySelectorAll('.btn-success.btn-icon[title="Registrar Pagamento"]').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const modal = document.getElementById('modalPagamento');

            // Tentar pegar ID do data attribute da linha (adicione data-id="{{conta.id}}" no <tr> no template)
            const contaId = row?.dataset.id || '';
            if (modal) modal.dataset.contaId = contaId;

            // Preencher campos read-only com dados da linha
            const cells = row?.querySelectorAll('td') || [];
            const fornecedorInput = modal?.querySelector('input[readonly]:first-of-type');
            const descInput = modal?.querySelectorAll('input[readonly]')[1];
            if (fornecedorInput) fornecedorInput.value = cells[1]?.textContent.trim() || '';
            if (descInput) descInput.value = cells[2]?.textContent.trim() || '';

            modal?.classList.add('active');
        });
    });


    // ============================================================
    // 5. FILTROS — LÓGICA REAL AUSENTE NO JS ORIGINAL
    // ============================================================
    document.getElementById('btnFiltrar')?.addEventListener('click', function () {
        const status = document.getElementById('filterStatus')?.value.toLowerCase();
        const periodo = document.getElementById('filterPeriodo')?.value.toLowerCase();
        const fornecedor = document.getElementById('filterFornecedor')?.value.toLowerCase().trim();
        const categoria = document.getElementById('filterCategoria')?.value.toLowerCase();

        const rows = document.querySelectorAll('tbody .row-status');
        let visiveis = 0;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowStatus = [...row.classList].find(c => c !== 'row-status') || '';
            const rowForn = cells[1]?.textContent.toLowerCase() || '';
            const rowCateg = cells[3]?.textContent.toLowerCase() || '';
            const rowVenc = cells[0]?.textContent.trim() || '';

            let mostrar = true;

            if (status && rowStatus !== status) mostrar = false;
            if (fornecedor && !rowForn.includes(fornecedor)) mostrar = false;
            if (categoria && !rowCateg.includes(categoria)) mostrar = false;

            // Filtro por período (comparação de datas simples)
            if (periodo && mostrar) {
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const [d, m, a] = rowVenc.split('/');
                const dataVenc = a ? new Date(`${a}-${m}-${d}`) : null;

                if (dataVenc) {
                    const diff = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
                    if (periodo === 'hoje' && diff !== 0) mostrar = false;
                    if (periodo === 'semana' && (diff < 0 || diff > 7)) mostrar = false;
                    if (periodo === 'mes' && (diff < 0 || diff > 30)) mostrar = false;
                    if (periodo === 'atrasado' && diff >= 0) mostrar = false;
                    if (periodo === 'futuro' && (diff < 1 || diff > 30)) mostrar = false;
                }
            }

            row.style.display = mostrar ? '' : 'none';
            if (mostrar) visiveis++;
        });

        // Atualizar info de paginação
        const paginInfo = document.querySelector('.pagination-info');
        if (paginInfo) {
            paginInfo.textContent = `Mostrando ${visiveis} resultado(s) filtrado(s)`;
        }

        console.log(`[Filtros] ${visiveis} linha(s) visível(eis)`);
    }, { capture: true }); // capture: true para sobrescrever o listener vazio do arquivo original


    // ============================================================
    // 6. CHECKBOXES DE SELEÇÃO EM MASSA — AUSENTES NA TABELA HTML
    //    (injetados via JS pois o template não os tem)
    // ============================================================
    (function injetarCheckboxes() {
        const thead = document.querySelector('table thead tr');
        const tbody = document.querySelector('table tbody');
        if (!thead || !tbody) return;

        // Adicionar TH no início do cabeçalho
        const thCheck = document.createElement('th');
        thCheck.style.width = '40px';
        thCheck.innerHTML = `<label class='checkbox-option'><input type="checkbox" id="selectAll" title="Selecionar todos"></label>`;
        thead.insertBefore(thCheck, thead.firstChild);

        // Adicionar TD em cada linha
        tbody.querySelectorAll('tr').forEach(row => {
            const isPago = row.classList.contains('pago');
            const td = document.createElement('td');
            td.innerHTML = `<label class='checkbox-option'><input type="checkbox" class="row-checkbox"
                            ${isPago ? 'disabled title="Já pago"' : ''}
                            style="accent-color:var(--roxoPrincipal);"></label>
            `;
            row.insertBefore(td, row.firstChild);
        });

        // Lógica select all
        const selectAll = document.getElementById('selectAll');
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');

        function updateBulk() {
            const checked = document.querySelectorAll('.row-checkbox:checked').length;
            if (selectedCount) selectedCount.textContent = checked;
            if (bulkActions) bulkActions.classList.toggle('active', checked > 0);
            if (selectAll) {
                const total = document.querySelectorAll('.row-checkbox:not([disabled])').length;
                selectAll.indeterminate = checked > 0 && checked < total;
                selectAll.checked = checked === total && total > 0;
            }
        }

        selectAll?.addEventListener('change', function () {
            document.querySelectorAll('.row-checkbox:not([disabled])').forEach(cb => {
                cb.checked = this.checked;
            });
            updateBulk();
        });

        tbody.addEventListener('change', e => {
            if (e.target.classList.contains('row-checkbox')) updateBulk();
        });

        document.getElementById('btnBulkDeselect')?.addEventListener('click', () => {
            document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
            if (selectAll) selectAll.checked = false;
            updateBulk();
        });
    })();

});


// ============================================================
// UTILITÁRIO — getCookie (CSRF Django)
// ============================================================
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}