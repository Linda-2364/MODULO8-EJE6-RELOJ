// Elementos del DOM
const hoursElement = document.querySelector('.hours');
const minutesElement = document.querySelector('.minutes');
const secondsElement = document.querySelector('.seconds');
const periodDisplay = document.getElementById('period');
const greetingDisplay = document.getElementById('greeting');
const formatBtn = document.getElementById('formatBtn');
const formatText = document.getElementById('formatText');
const timezoneDisplay = document.getElementById('timezone');
const dayOfYearDisplay = document.getElementById('dayOfYear');
const weekNumberDisplay = document.getElementById('weekNumber');
const secondsTodayDisplay = document.getElementById('secondsToday');
const progressFill = document.getElementById('progressFill');
const dayProgress = document.getElementById('dayProgress');

// Estado
let is24HourFormat = false;

/**
 * Actualizar el reloj
 */
function updateClock() {
    const now = new Date();
    
    // Obtener componentes de tiempo
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Determinar período (AM/PM)
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convertir a formato 12h si es necesario
    if (!is24HourFormat) {
        hours = hours % 12 || 12; // Convertir 0 a 12
        periodDisplay.textContent = period;
    } else {
        periodDisplay.textContent = '';
    }
    
    // Formatear con ceros a la izquierda
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    
    // Actualizar elementos de tiempo
    hoursElement.textContent = hoursStr;
    minutesElement.textContent = minutesStr;
    secondsElement.textContent = secondsStr;
    
    // Actualizar fecha
    updateDate(now);
    
    // Actualizar saludo
    updateGreeting(now.getHours());
    
    // Actualizar estadísticas
    updateStats(now);
    
    // Actualizar progreso del día
    updateDayProgress(now);
}

/**
 * Actualizar la fecha
 */
function updateDate(date) {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const weekday = weekdays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Actualizar elementos de fecha
    document.querySelector('.weekday').textContent = weekday;
    document.querySelector('.day').textContent = day;
    document.querySelector('.month').textContent = month;
    document.querySelector('.year').textContent = year;
}

/**
 * Actualizar saludo según la hora
 */
function updateGreeting(hour) {
    let greeting, icon;
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Buenos días';
        icon = 'fas fa-sun';
    } else if (hour >= 12 && hour < 19) {
        greeting = 'Buenas tardes';
        icon = 'fas fa-cloud-sun';
    } else {
        greeting = 'Buenas noches';
        icon = 'fas fa-moon';
    }
    
    greetingDisplay.querySelector('span').textContent = greeting;
    const iconElement = greetingDisplay.querySelector('i');
    if (iconElement) {
        iconElement.className = icon;
    }
}

/**
 * Obtener zona horaria
 */
function getTimezone() {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    
    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Calcular día del año
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Calcular número de semana
 */
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Calcular segundos transcurridos hoy
 */
function getSecondsToday(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Actualizar estadísticas
 */
function updateStats(date) {
    dayOfYearDisplay.textContent = String(getDayOfYear(date)).padStart(3, '0');
    weekNumberDisplay.textContent = String(getWeekNumber(date)).padStart(2, '0');
    secondsTodayDisplay.textContent = getSecondsToday(date).toLocaleString();
}

/**
 * Actualizar progreso del día
 */
function updateDayProgress(date) {
    const totalSecondsInDay = 24 * 60 * 60;
    const secondsToday = getSecondsToday(date);
    const progress = (secondsToday / totalSecondsInDay) * 100;
    
    progressFill.style.width = `${progress}%`;
    dayProgress.textContent = `${progress.toFixed(2)}%`;
}

/**
 * Cambiar formato de 12h a 24h
 */
function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    
    formatText.textContent = is24HourFormat ? 'Cambiar a 12h' : 'Cambiar a 24h';
    formatBtn.querySelector('i').className = is24HourFormat ? 'fas fa-clock' : 'fas fa-hourglass-half';
    
    updateClock();
}

// Event Listeners
formatBtn.addEventListener('click', toggleFormat);

// Inicializar
timezoneDisplay.textContent = getTimezone();
updateClock();

// Actualizar reloj cada segundo
setInterval(updateClock, 1000);

// Efecto de carga inicial
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🚀 Reloj futurista iniciado');
    console.log(`Zona horaria: ${getTimezone()}`);
    console.log(`Formato: ${is24HourFormat ? '24 horas' : '12 horas'}`);
});