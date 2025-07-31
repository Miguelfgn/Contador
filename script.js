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

    // Función para cargar los datos desde localStorage
    function loadData() {
        const storedDays = localStorage.getItem('daysWithoutAccident');
        const storedRecord = localStorage.getItem('recordAccidentFreeDays');
        const storedResetDate = localStorage.getItem('lastResetDate');

        // === CAMBIO CLAVE AQUÍ ===
        // Si el localStorage está vacío, USA los valores que definiste arriba.
        // Si no está vacío, usa los que ya estaban guardados.
        if (storedDays !== null) {
            daysWithoutAccident = parseInt(storedDays, 10);
            recordAccidentFreeDays = parseInt(storedRecord, 10);
            lastResetDate = parseInt(storedResetDate, 10);
        } else {
            // Cuando no hay datos guardados, el script usará los valores de 'daysWithoutAccident',
            // 'recordAccidentFreeDays' y 'lastResetDate' que definiste arriba.
            // Simplemente guardamos estos valores por primera vez.
            saveData();
        }

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