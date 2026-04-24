// Monitor de Red
function updateNetworkInfo() {
    const netStatus = document.getElementById('net-status');
    const netType = document.getElementById('net-type');
    const netIndicator = document.getElementById('net-indicator');
    
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (conn) {
        netType.innerText = `Tipo: ${conn.effectiveType.toUpperCase()}`;
        if (conn.effectiveType === '4g') {
            netIndicator.className = 'indicator status-good';
            netStatus.innerText = "Excelente";
        } else if (conn.effectiveType === '3g') {
            netIndicator.className = 'indicator status-fair';
            netStatus.innerText = "Regular";
        } else {
            netIndicator.className = 'indicator status-bad';
            netStatus.innerText = "Baja Cobertura";
        }
    }
}

// Monitor GPS
function updateGPS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((pos) => {
            const acc = pos.coords.accuracy;
            document.getElementById('gps-accuracy').innerText = acc.toFixed(1);
            const gpsIndicator = document.getElementById('gps-indicator');
            const gpsStatus = document.getElementById('gps-status');

            if (acc < 20) {
                gpsIndicator.className = 'indicator status-good';
                gpsStatus.innerText = "Señal Fuerte";
            } else if (acc < 100) {
                gpsIndicator.className = 'indicator status-fair';
                gpsStatus.innerText = "Señal Media";
            } else {
                gpsIndicator.className = 'indicator status-bad';
                gpsStatus.innerText = "Señal Débil";
            }
        }, (err) => {
            document.getElementById('gps-status').innerText = "Sin acceso a GPS";
        }, { enableHighAccuracy: true });
    }
}

window.addEventListener('load', () => {
    updateNetworkInfo();
    updateGPS();
    if(navigator.connection) {
        navigator.connection.addEventListener('change', updateNetworkInfo);
    }
});
