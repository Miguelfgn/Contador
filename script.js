document.addEventListener('DOMContentLoaded', () => {
    const daysCounterElement = document.getElementById('daysCounter');
    const recordDaysElement = document.getElementById('recordDays');
    const resetButton = document.getElementById('resetButton');
    const statusMessageElement = document.getElementById('statusMessage');

    let daysWithoutAccident = 0;
    let recordAccidentFreeDays = 0;

    // Almacenar en localStorage para persistencia
    const STORAGE_KEY_DAYS = 'daysWithoutAccident';
    const STORAGE_KEY_RECORD = 'recordAccidentFreeDays';
    const STORAGE_KEY_LAST_RESET = 'lastResetDate';

    // Función para cargar los datos al iniciar
    function loadData() {
        daysWithoutAccident = parseInt(localStorage.getItem(STORAGE_KEY_DAYS) || '0', 10);
        recordAccidentFreeDays = parseInt(localStorage.getItem(STORAGE_KEY_RECORD) || '0', 10);
        
        // Calcular días desde el último reseteo para actualizar el contador
        const lastResetDate = localStorage.getItem(STORAGE_KEY_LAST_RESET);
        if (lastResetDate) {
            const lastReset = new Date(lastResetDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastReset.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Si ha pasado al menos un día completo desde el último reinicio, actualizar el contador
            // y asegurarse de que no se reinició en el mismo día varias veces.
            if (diffDays > daysWithoutAccident) {
                daysWithoutAccident = diffDays;
                saveData(); // Guardar el contador actualizado
            }
        } else {
            // Si no hay fecha de último reseteo, es la primera vez que se carga o se borró el localStorage
            // Establecer la fecha actual como el inicio del conteo
            localStorage.setItem(STORAGE_KEY_LAST_RESET, new Date().toISOString());
        }

        updateDisplay();
    }

    // Función para guardar los datos
    function saveData() {
        localStorage.setItem(STORAGE_KEY_DAYS, daysWithoutAccident.toString());
        localStorage.setItem(STORAGE_KEY_RECORD, recordAccidentFreeDays.toString());
    }

    // Función para actualizar la visualización en el HTML
    function updateDisplay() {
        daysCounterElement.textContent = daysWithoutAccident;
        recordDaysElement.textContent = recordAccidentFreeDays;
        
        if (daysWithoutAccident > recordAccidentFreeDays) {
            statusMessageElement.textContent = "¡Hemos superado nuestro récord anterior!";
            recordAccidentFreeDays = daysWithoutAccident; // Actualizar el récord automáticamente
            saveData();
        } else if (daysWithoutAccident === recordAccidentFreeDays && daysWithoutAccident > 0) {
            statusMessageElement.textContent = "¡Estamos igualando nuestro récord!";
        } else {
            statusMessageElement.textContent = ""; // Limpiar el mensaje si no hay récord
        }
    }

    // Función para reiniciar el contador
    function resetCounter() {
        if (confirm('¿Estás seguro de que quieres reiniciar el contador? Esto indicaría un accidente.')) {
            if (daysWithoutAccident > recordAccidentFreeDays) {
                recordAccidentFreeDays = daysWithoutAccident; // Actualizar el récord si se superó
            }
            daysWithoutAccident = 0;
            localStorage.setItem(STORAGE_KEY_LAST_RESET, new Date().toISOString()); // Guardar la fecha de reinicio
            saveData();
            updateDisplay();
            statusMessageElement.textContent = "¡Contador reiniciado! Empecemos de nuevo el camino a cero accidentes.";
        }
    }

    // Event listener para el botón de reinicio
    resetButton.addEventListener('click', resetCounter);

    // Cargar los datos al iniciar la página
    loadData();

    // Actualizar el contador de días cada 24 horas (opcional, para que el contador avance automáticamente)
    // Para propósitos de demostración local, puedes comentar esto o ajustar el intervalo para pruebas.
    // En un entorno de producción, un servidor podría encargarse de esto o podrías usar un servicio más robusto.
    setInterval(() => {
        const lastResetDate = localStorage.getItem(STORAGE_KEY_LAST_RESET);
        if (lastResetDate) {
            const lastReset = new Date(lastResetDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastReset.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Usar floor para evitar incrementar antes de las 24h
            
            if (diffDays > daysWithoutAccident) {
                daysWithoutAccident = diffDays;
                saveData();
                updateDisplay();
            }
        }
    }, 1000 * 60 * 60); // Actualizar cada hora para asegurar que se detecta el cambio de día.
});