document.addEventListener('DOMContentLoaded', function () {
    const filtroHeader = document.querySelector('.filtro-header');
    const filtroUniversal = document.querySelector('.filtro-universal');
    const openModalBtn = document.getElementById('openModalBtn');

    if (filtroHeader && filtroUniversal) {
        filtroHeader.addEventListener('click', function (e) {

            // 🔒 Se clicou no botão de enviar documento, não fecha/abre filtro
            if (e.target.closest('#openModalBtn')) return;

            filtroUniversal.classList.toggle('open');
        });
    }
});