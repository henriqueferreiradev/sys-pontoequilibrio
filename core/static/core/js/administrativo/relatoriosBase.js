(function () {
    // Variáveis globais
    let todosRelatorios = [];
    const modalOverlay = document.getElementById('modalFiltros');
    const modalTitulo = document.getElementById('modalTitulo');
    const dataInicioInput = document.getElementById('dataInicio');
    const dataFimInput = document.getElementById('dataFim');
    const extraContainer = document.getElementById('extraFieldsContainer');
    const btnCancelar = document.getElementById('btnCancelarModal');
    const btnConfirmar = document.getElementById('btnConfirmarModal');
    const setoresContainer = document.getElementById('setoresContainer');
    const searchInput = document.getElementById('searchInput');
    let currentReport = null;

    // Carrega relatórios do backend
    async function carregarRelatorios() {
        try {
            const response = await fetch('/relatorios/api/listar/');
            const data = await response.json();

            todosRelatorios = [];
            data.setores.forEach(setor => {
                setor.relatorios.forEach(rel => {
                    todosRelatorios.push({
                        setor: rel.setor,
                        icon: rel.icon,
                        nome: rel.nome,
                        desc: rel.desc,
                        slug: rel.slug,
                        extra: rel.extra
                    });
                });
            });

            renderCards('');
        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            setoresContainer.innerHTML = '<div style="color:red; text-align:center;">Erro ao carregar relatórios</div>';
        }
    }

    // Renderiza os cards
    function renderCards(filtroTexto = '') {
        const filtro = filtroTexto.trim().toLowerCase();
        const setoresMap = new Map();

        todosRelatorios.forEach(rel => {
            if (filtro === '' ||
                rel.nome.toLowerCase().includes(filtro) ||
                rel.desc.toLowerCase().includes(filtro) ||
                rel.setor.toLowerCase().includes(filtro)) {

                if (!setoresMap.has(rel.setor)) {
                    setoresMap.set(rel.setor, []);
                }
                setoresMap.get(rel.setor).push(rel);
            }
        });

        const ordemSetores = ["PACIENTES", "PROFISSIONAIS", "AGENDA", "FINANCEIRO"];
        const iconesSetor = {
            "PACIENTES": "fas fa-user-injured",
            "PROFISSIONAIS": "fas fa-user-md",
            "AGENDA": "fas fa-calendar-alt",
            "FINANCEIRO": "fas fa-coins"
        };

        let htmlStr = '';

        for (let setor of ordemSetores) {
            const rels = setoresMap.get(setor) || [];
            if (rels.length === 0 && filtro !== '') continue;

            htmlStr += `<div class="setor-section">`;
            htmlStr += `<div class="setor-titulo"><i class="${iconesSetor[setor]}"></i> ${setor}</div>`;
            htmlStr += `<div class="cards-grid">`;

            rels.forEach(rel => {
                htmlStr += `
                <div class="card-relatorio">
                    <div class="card-icon"><i class="${rel.icon}"></i></div>
                    <h3>${rel.nome}</h3>
                    <div class="card-desc">${rel.desc}</div>
                    <button class="btn-abrir abrir-relatorio" data-slug="${rel.slug}" data-nome="${rel.nome}" data-extra='${JSON.stringify(rel.extra)}'>
                        <i class="fas fa-external-link-alt"></i> Abrir
                    </button>
                </div>
                `;
            });

            htmlStr += `</div></div>`;
        }

        if (htmlStr === '') {
            htmlStr = '<div style="text-align:center; padding:3rem; color:var(--cinzaEscuro);"><i class="fas fa-search"></i> <p>Nenhum relatório encontrado</p></div>';
        }

        setoresContainer.innerHTML = htmlStr;

        // Reatribuir eventos
        document.querySelectorAll('.abrir-relatorio').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const slug = this.dataset.slug;
                const nome = this.dataset.nome;
                const extra = JSON.parse(this.dataset.extra);

                abrirModal({
                    slug: slug,
                    nome: nome,
                    extra: extra
                });
            });
        });
    }

    // Função para abrir modal com filtros
    function abrirModal(report) {
        currentReport = report;
        modalTitulo.innerText = `Filtrar: ${report.nome}`;
        extraContainer.innerHTML = '';

        if (report.extra && report.extra.length) {
            report.extra.forEach(campo => {
                // Usa a função global de renderização de filtros
                if (window.renderizarFiltro) {
                    extraContainer.innerHTML += window.renderizarFiltro(campo);
                } else {
                    // Fallback para caso a config não carregue
                    extraContainer.innerHTML += `
                        <div class="campo-group">
                            <label>${campo}</label>
                            <input type="text" id="extra_${campo}">
                        </div>
                    `;
                }
            });
        }

        modalOverlay.classList.add('active');
    }

    function fecharModal() {
        modalOverlay.classList.remove('active');
        currentReport = null;
    }

    // Função para coletar valores dos filtros
    function coletarValoresFiltros(extra) {
        const valores = {};

        extra.forEach(campo => {
            const elemento = document.getElementById(`extra_${campo}`);
            if (elemento) {
                if (elemento.type === 'checkbox') {
                    valores[campo] = elemento.checked;
                } else {
                    valores[campo] = elemento.value;
                }
            }
        });

        return valores;
    }

    // Confirmar modal
    btnConfirmar.addEventListener('click', async function () {
        if (!currentReport) return;

        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;

        if (!dataInicio || !dataFim) {
            alert('Preencha data inicial e final');
            return;
        }

        // Monta parâmetros base
        const params = {
            data_inicio: dataInicio,
            data_fim: dataFim
        };

        // Adiciona filtros extras
        if (currentReport.extra && currentReport.extra.length) {
            const valoresExtras = coletarValoresFiltros(currentReport.extra);
            Object.assign(params, valoresExtras);
        }

        try {
            const response = await fetch(`/relatorios/api/executar/${currentReport.slug}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(params)
            });

            const data = await response.json();

            if (data.error) {
                alert('Erro: ' + data.error);
                return;
            }

            abrirPaginaResultados(currentReport, data);
            fecharModal();

        } catch (error) {
            alert('Erro ao gerar relatório');
            console.error(error);
        }
    });

    // Função para pegar CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Abre página com resultados
    function abrirPaginaResultados(report, data) {
        const params = data.parametros || {};  // PEGA OS PARÂMETROS DA RESPOSTA

        let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${report.nome}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
            :root { --roxoPrincipal: #6D398E; --verdePrincipal: #92cbad; }
            body { background: #E4E9F7; font-family: 'Segoe UI', sans-serif; padding: 2rem; }
            .report-container { max-width: 1300px; margin: 0 auto; background: white; border-radius: 32px; padding: 2rem; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .total { background: #f0f0f0; padding: 0.5rem 1rem; border-radius: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 1rem; background: #f0f0f0; color: var(--roxoPrincipal); }
            td { padding: .5rem; border-bottom: 1px solid #ddd; }
            .badge { background: var(--verdePrincipal); padding: 0.3rem 1rem; border-radius: 40px; }
            .btn-exportar { background: var(--roxoPrincipal); color: white; border: none; border-radius: 40px; padding: 0.5rem 1rem; cursor: pointer; margin-left: 0.5rem; }
            .btn-voltar { background: #6c757d; color: white; border: none; border-radius: 40px; padding: 0.5rem 1rem; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div>
                    <h2><i class="fas fa-file-alt" style="color:var(--roxoPrincipal);"></i> ${report.nome}</h2>
                    <div class="total">📊 Total: ${data.total || data.dados.length} registros</div>
                </div>
                <div>
                    <button class="btn-voltar" onclick="window.close()"><i class="fas fa-arrow-left"></i> Voltar</button>
                    <button class="btn-exportar" onclick="exportarExcel()"><i class="fas fa-file-excel"></i> Excel</button>
                    <button class="btn-exportar" onclick="exportarPDF()"><i class="fas fa-file-pdf"></i> PDF</button>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>`;

        // Cabeçalhos da tabela
        if (data.dados && data.dados.length > 0) {
            Object.keys(data.dados[0]).forEach(key => {
                htmlContent += `<th>${key}</th>`;
            });
        } else {
            htmlContent += '<th>Sem dados</th>';
        }

        htmlContent += `</tr>
                </thead>
                <tbody>`;

        // Linhas da tabela
        if (data.dados && data.dados.length > 0) {
            data.dados.forEach(row => {
                htmlContent += '<tr>';
                Object.values(row).forEach(val => {
                    htmlContent += `<td>${val || '-'}</td>`;
                });
                htmlContent += '</tr>';
            });
        } else {
            htmlContent += '<tr><td colspan="100" style="text-align:center;">Nenhum dado encontrado</td></tr>';
        }

        // Cria uma string com os parâmetros para a URL
        const paramsString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key] || '')}`)
            .join('&');

        htmlContent += `</tbody>
            </table>
            
            <div style="margin-top: 2rem; text-align: right; color: #666;">
                <small>Gerado em ${new Date().toLocaleString('pt-BR')}</small>
            </div>
        </div>
        
        <script>
            function exportarExcel() {
                window.location.href = '/relatorios/api/exportar/${report.slug}/excel/?${paramsString}';
            }
            function exportarPDF() {
                window.location.href = '/relatorios/api/exportar/${report.slug}/pdf/?${paramsString}';
            }
        </script>
    </body>
    </html>
    `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    // Event listeners
    btnCancelar.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) fecharModal();
    });

    searchInput.addEventListener('input', function () {
        renderCards(this.value);
    });

    // Carrega configuração de filtros
    function carregarConfigFiltros() {
        // Se já tem a config global, não precisa fazer nada
        if (!window.FILTROS_CONFIG) {
            // Tenta carregar o script de filtros
            const script = document.createElement('script');
            script.src = '/static/core/js/filtros_config.js';
            script.onload = () => console.log('Config de filtros carregada');
            script.onerror = () => console.error('Erro ao carregar config de filtros');
            document.head.appendChild(script);
        }
    }

    // Inicializa
    carregarConfigFiltros();
    carregarRelatorios();
})();