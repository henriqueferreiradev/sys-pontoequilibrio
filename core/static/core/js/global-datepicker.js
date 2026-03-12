document.addEventListener('DOMContentLoaded', () => {

    // DATE PICKER (dia/mês/ano)
    const dateInputs = document.querySelectorAll('input[type="date"]');

    dateInputs.forEach(input => {
        flatpickr(input, {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d/m/Y",
            locale: flatpickr.l10ns.pt,
            disableMobile: true,
            onReady: (_, __, instance) => {
                instance.altInput.placeholder =
                    input.getAttribute("placeholder") || "Selecione uma data";
            }
        });
    });

    // MONTH PICKER (mês/ano)
    const monthInputs = document.querySelectorAll('input[type="month"]');

    monthInputs.forEach(input => {
        flatpickr(input, {
            plugins: [
                new monthSelectPlugin({
                    shorthand: true,
                    dateFormat: "Y-m",
                    altFormat: "F Y"
                })
            ],
            altInput: true,
            locale: flatpickr.l10ns.pt,
            disableMobile: true
        });
    });

});