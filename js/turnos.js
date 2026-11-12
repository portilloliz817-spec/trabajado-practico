document.addEventListener('DOMContentLoaded', () => {
    populateServices();
    handleUrlParams();
    
    const form = document.getElementById('appointment-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Configurar fecha mínima (hoy)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

function populateServices() {
    const serviceSelect = document.getElementById('service');
    const services = getServices();
    
    if (!serviceSelect) return;
    
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.textContent = `${service.name} - $${service.price}`;
        serviceSelect.appendChild(option);
    });
}

function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('service');
    
    if (serviceId) {
        const services = getServices();
        const service = services.find(s => s.id == serviceId);
        if (service) {
            const serviceSelect = document.getElementById('service');
            serviceSelect.value = service.name;
        }
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    // Validar disponibilidad
    const appointments = getAppointments();
    const isTaken = appointments.some(app => app.date === date && app.time === time && app.status !== 'cancelado');
    
    if (isTaken) {
        showNotification('Lo sentimos, este horario ya está reservado. Por favor elige otro.', 'error');
        return;
    }
    
    const newAppointment = {
        id: Date.now(),
        name,
        phone,
        service,
        date,
        time,
        status: 'pendiente', // pendiente, confirmado, cancelado
        createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    saveAppointments(appointments);
    
    // Mostrar éxito
    document.getElementById('success-alert').style.display = 'block';
    document.getElementById('appointment-form').reset();
    
    setTimeout(() => {
        document.getElementById('success-alert').style.display = 'none';
        window.location.href = 'index.html';
    }, 3000);
}
