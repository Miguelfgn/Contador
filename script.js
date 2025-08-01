document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const daysCounterElement = document.getElementById('daysCounter');
    const recordDaysElement = document.getElementById('recordDays');
    const resetButton = document.getElementById('resetButton');
    const statusMessageElement = document.getElementById('statusMessage');

    // === CAMBIOS EN LAS VARIABLES DE INICIO ===
    // 1. Aquí se definen los valores iniciales.
    // 2. Estos valores se usarán si el localStorage está vacío.
    let daysWithoutAccident = 30;
    let recordAccidentFreeDays = 121;
    const initialStartDate = new Date('2025-07-01T08:00:00');
    let lastResetDate = initialStartDate.getTime();
    
    // Función para guardar los datos en localStorage
    function saveData() {
        localStorage.setItem('daysWithoutAccident', daysWithoutAccident);
        localStorage.setItem('recordAccidentFreeDays', recordAccidentFreeDays);
        localStorage.setItem('lastResetDate', lastResetDate);
    }

   // Función para cargar los datos desde localStorage de forma robusta
function loadData() {
    const storedRecord = localStorage.getItem('recordAccidentFreeDays');
    const storedResetDate = localStorage.getItem('lastResetDate');

    // Si el récord está vacío, usamos el valor inicial. Si no, lo cargamos.
    if (storedRecord === null) {
        recordAccidentFreeDays = 121;
    } else {
        recordAccidentFreeDays = parseInt(storedRecord, 10);
    }

    // Si la fecha de inicio está vacía, usamos la fecha inicial.
    if (storedResetDate === null) {
        const initialStartDate = new Date('2025-07-01T08:00:00');
        lastResetDate = initialStartDate.getTime();
    } else {
        lastResetDate = parseInt(storedResetDate, 10);
    }

    // Siempre recalcular los días sin accidente al cargar la página
    const now = new Date().getTime();
    daysWithoutAccident = Math.floor((now - lastResetDate) / (1000 * 60 * 60 * 24));

    saveData(); // Guardamos los nuevos valores
    updateUI();
}

    // Función para actualizar la interfaz de usuario
    function updateUI() {
        daysCounterElement.textContent = daysWithoutAccident;
        recordDaysElement.textContent = recordAccidentFreeDays;
        
        // Mensaje de estado
        if (daysWithoutAccident > recordAccidentFreeDays) {
            statusMessageElement.textContent = '¡Felicidades, has superado el récord!';
            statusMessageElement.style.color = '#27ae60';
        } else {
            statusMessageElement.textContent = 'El récord a superar es de ' + recordAccidentFreeDays + ' días.';
            statusMessageElement.style.color = '#34495e';
        }
    }

    // Función principal para actualizar el contador
    function updateCounter() {
        const now = new Date().getTime();
        const differenceInDays = Math.floor((now - lastResetDate) / (1000 * 60 * 60 * 24));
        
        if (differenceInDays > daysWithoutAccident) {
            daysWithoutAccident = differenceInDays;
            saveData();
            updateUI();
        }
    }

    // Evento para el botón de reinicio
    resetButton.addEventListener('click', () => {
        if (daysWithoutAccident > recordAccidentFreeDays) {
            recordAccidentFreeDays = daysWithoutAccident;
        }
        daysWithoutAccident = 0;
        lastResetDate = new Date().getTime();
        saveData();
        updateUI();
    });

    // Carga inicial de los datos y actualización del contador
    loadData();
    setInterval(updateCounter, 3600000); // Actualiza cada hora (3600000 ms)
});