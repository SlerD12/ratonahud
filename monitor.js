// Elementos de la interfaz para permisos
const overlay = document.getElementById('permission-overlay');
const permBtn = document.getElementById('request-permission-btn');

// Función para iniciar el monitoreo y ocultar el modal
function startApp() {
    if (overlay) overlay.style.display = 'none'; 
    updateNetworkInfo();
    updateGPS();
    
    if(navigator.connection) {
        navigator.connection.addEventListener('change', updateNetworkInfo);
    }
}

// Verificar si ya se concedieron permisos anteriormente
async function checkPermissions() {
    if ("permissions" in navigator) {
        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            if (result.state === 'granted') {
                startApp();
            }
        } catch (error) {
            console.log("Error al consultar permisos:", error);
        }
    }
}

// Evento para el botón del modal
if (permBtn) {
    permBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    startApp();
                },
                (err) => {
                    alert("Es necesario habilitar el GPS para que la app funcione.");
                    console.error(err);
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Tu dispositivo no es compatible con GPS.");
        }
    });
}

// --- Lógica de Monitoreo ---

function updateNetworkInfo() {
    const netStatus = document.getElementById('net-status');
    const netType = document.getElementById('net-type');
    const netIndicator = document.getElementById('net-indicator');
    
    if (!netStatus || !netIndicator) return;

    if (!navigator.onLine) {
        netIndicator.className = 'indicator status-bad';
        netStatus.innerText = "Sin Cobertura de Red";
        if (netType) netType.innerText = "Modo Fuera de Línea";
        return;
    }

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (conn) {
        if (netType) netType.innerText = `Tipo: ${conn.effectiveType.toUpperCase()}`;
        if (conn.effectiveType === '4g') {
            netIndicator.className = 'indicator status-good';
            netStatus.innerText = "Conexión Excelente";
        } else if (conn.effectiveType === '3g' || conn.effectiveType === '2g') {
            netIndicator.className = 'indicator status-fair';
            netStatus.innerText = "Conexión Limitada";
        } else {
            netIndicator.className = 'indicator status-bad';
            netStatus.innerText = "Señal Muy Débil";
        }
    }
}

function updateGPS() {
    const gpsIndicator = document.getElementById('gps-indicator');
    const gpsStatus = document.getElementById('gps-status');
    const gpsAccuracy = document.getElementById('gps-accuracy');

    if (!gpsIndicator || !gpsStatus) return;

    if ("geolocation" in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 8000, 
            maximumAge: 0
        };

        navigator.geolocation.watchPosition(
            (pos) => {
                const acc = pos.coords.accuracy;
                if (gpsAccuracy) gpsAccuracy.innerText = acc.toFixed(1);

                if (acc < 25) {
                    gpsIndicator.className = 'indicator status-good';
                    gpsStatus.innerText = "GPS: Señal Precisa";
                } else {
                    gpsIndicator.className = 'indicator status-fair';
                    gpsStatus.innerText = "GPS: Buscando Mejor Precisión";
                }
            },
            (err) => {
                gpsIndicator.className = 'indicator status-bad';
                if (gpsAccuracy) gpsAccuracy.innerText = "-";
                
                switch(err.code) {
                    case err.PERMISSION_DENIED:
                        gpsStatus.innerText = "GPS: Permiso Denegado";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        gpsStatus.innerText = "GPS: Ubicación No Disponible";
                        break;
                    case err.TIMEOUT:
                        gpsStatus.innerText = "GPS: Tiempo de Espera Agotado";
                        break;
                    default:
                        gpsStatus.innerText = "GPS: Error Desconocido";
                        break;
                }
            }, 
            options
        );
    }
}

// Eventos globales
window.addEventListener('offline', updateNetworkInfo);
window.addEventListener('online', updateNetworkInfo);
window.addEventListener('load', checkPermissions);
