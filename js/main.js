// Configuración inicial y gestión de datos en LocalStorage
const DEFAULT_SERVICES = [
    { id: 1, name: "Corte de cabello", description: "Corte moderno para damas y caballeros.", price: 1500, img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Tintura", description: "Coloración profesional con productos de alta calidad.", price: 3500, img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Botox capilar", description: "Hidratación profunda y restauración de la fibra.", price: 4500, img: "https://images.unsplash.com/photo-1554519934-e32b8fb89120?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Alisado", description: "Lacio perfecto y duradero sin dañar tu cabello.", price: 5000, img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400" },
    { id: 5, name: "Peinados", description: "Recogidos y estilos para eventos especiales.", price: 2500, img: "https://images.unsplash.com/photo-1516729825348-18301596f26d?auto=format&fit=crop&q=80&w=400" },
    { id: 6, name: "Tratamientos capilares", description: "Nutrición y cuidado específico para cada tipo de pelo.", price: 2000, img: "https://images.unsplash.com/photo-1527799822367-a5886717f007?auto=format&fit=crop&q=80&w=400" },
    { id: 7, name: "Brushing", description: "Secado y modelado para un acabado impecable.", price: 1200, img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" }
];

document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
});

function initLocalStorage() {
    if (!localStorage.getItem('shs_services')) {
        localStorage.setItem('shs_services', JSON.stringify(DEFAULT_SERVICES));
    }
    if (!localStorage.getItem('shs_appointments')) {
        localStorage.setItem('shs_appointments', JSON.stringify([]));
    }
}

// Funciones de utilidad
function getServices() {
    return JSON.parse(localStorage.getItem('shs_services'));
}

function saveServices(services) {
    localStorage.setItem('shs_services', JSON.stringify(services));
}

function getAppointments() {
    return JSON.parse(localStorage.getItem('shs_appointments'));
}

function saveAppointments(appointments) {
    localStorage.setItem('shs_appointments', JSON.stringify(appointments));
}

function showNotification(message, type = 'success') {
    // Implementación simple de notificación
    const alert = document.createElement('div');
    alert.style.position = 'fixed';
    alert.style.bottom = '20px';
    alert.style.right = '20px';
    alert.style.padding = '15px 25px';
    alert.style.borderRadius = '10px';
    alert.style.color = '#fff';
    alert.style.zIndex = '9999';
    alert.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
