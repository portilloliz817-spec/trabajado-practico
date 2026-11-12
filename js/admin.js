document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initAdmin();
});

function checkAuth() {
    const isLogged = sessionStorage.getItem('shs_admin_logged');
    const overlay = document.getElementById('login-overlay');
    if (isLogged) {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sessionStorage.setItem('shs_admin_logged', 'true');
            overlay.style.display = 'none';
            initAdmin();
        });
    }
}

function logout() {
    sessionStorage.removeItem('shs_admin_logged');
    location.reload();
}

function initAdmin() {
    updateDashboard();
    renderAllAppointments();
    renderAdminServices();
    
    // Listeners para filtros
    document.getElementById('search-turnos').addEventListener('input', renderAllAppointments);
    document.getElementById('filter-status').addEventListener('change', renderAllAppointments);
    
    // Formulario de servicios
    document.getElementById('service-form').addEventListener('submit', handleServiceSubmit);
}

function showSection(sectionId) {
    document.querySelectorAll('.main-content section').forEach(s => s.style.display = 'none');
    document.getElementById(`section-${sectionId}`).style.display = 'block';
    
    document.querySelectorAll('.nav-admin button').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${sectionId}`).classList.add('active');
}

// DASHBOARD
function updateDashboard() {
    const appointments = getAppointments();
    const total = appointments.length;
    const pendientes = appointments.filter(a => a.status === 'pendiente').length;
    const confirmados = appointments.filter(a => a.status === 'confirmado').length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pendientes').textContent = pendientes;
    document.getElementById('stat-confirmados').textContent = confirmados;
    
    const recentTable = document.querySelector('#recent-appointments-table tbody');
    recentTable.innerHTML = '';
    appointments.slice(-5).reverse().forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.name}</td>
            <td>${app.service}</td>
            <td>${app.date} ${app.time}</td>
            <td><span class="status-badge status-${app.status}">${app.status}</span></td>
        `;
        recentTable.appendChild(tr);
    });
}

// GESTIÓN DE TURNOS
function renderAllAppointments() {
    const appointments = getAppointments();
    const searchTerm = document.getElementById('search-turnos').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    
    const tableBody = document.querySelector('#all-appointments-table tbody');
    tableBody.innerHTML = '';
    
    const filtered = appointments.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    filtered.reverse().forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.name}</td>
            <td>${app.phone}</td>
            <td>${app.service}</td>
            <td>${app.date}</td>
            <td>${app.time}</td>
            <td><span class="status-badge status-${app.status}">${app.status}</span></td>
            <td>
                ${app.status === 'pendiente' ? `<button class="action-btn btn-confirm" onclick="updateAppointmentStatus(${app.id}, 'confirmado')">Confirmar</button>` : ''}
                ${app.status !== 'cancelado' ? `<button class="action-btn btn-cancel" onclick="updateAppointmentStatus(${app.id}, 'cancelado')">Cancelar</button>` : ''}
                <button class="action-btn btn-delete" onclick="deleteAppointment(${app.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateAppointmentStatus(id, newStatus) {
    const appointments = getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments[index].status = newStatus;
        saveAppointments(appointments);
        updateDashboard();
        renderAllAppointments();
        showNotification(`Turno ${newStatus} correctamente`);
    }
}

function deleteAppointment(id) {
    if (confirm('¿Estás seguro de eliminar este turno?')) {
        let appointments = getAppointments();
        appointments = appointments.filter(a => a.id !== id);
        saveAppointments(appointments);
        updateDashboard();
        renderAllAppointments();
        showNotification('Turno eliminado');
    }
}

// GESTIÓN DE SERVICIOS
function renderAdminServices() {
    const services = getServices();
    const tableBody = document.querySelector('#admin-services-table tbody');
    tableBody.innerHTML = '';
    
    services.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${s.img}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;"></td>
            <td>${s.name}</td>
            <td>${s.description}</td>
            <td>$${s.price}</td>
            <td>
                <button class="action-btn btn-confirm" onclick="openServiceModal(${s.id})">Editar</button>
                <button class="action-btn btn-delete" onclick="deleteService(${s.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function openServiceModal(id = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    const title = document.getElementById('modal-title');
    
    form.reset();
    if (id) {
        const services = getServices();
        const s = services.find(serv => serv.id === id);
        document.getElementById('edit-service-id').value = s.id;
        document.getElementById('service-name').value = s.name;
        document.getElementById('service-desc').value = s.description;
        document.getElementById('service-price').value = s.price;
        document.getElementById('service-img').value = s.img;
        title.textContent = 'Editar Servicio';
    } else {
        document.getElementById('edit-service-id').value = '';
        title.textContent = 'Nuevo Servicio';
    }
    
    modal.style.display = 'flex';
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

function handleServiceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-service-id').value;
    const name = document.getElementById('service-name').value;
    const description = document.getElementById('service-desc').value;
    const price = document.getElementById('service-price').value;
    const img = document.getElementById('service-img').value;
    
    let services = getServices();
    
    if (id) {
        // Editar
        const index = services.findIndex(s => s.id == id);
        services[index] = { ...services[index], name, description, price, img };
        showNotification('Servicio actualizado');
    } else {
        // Nuevo
        const newService = {
            id: Date.now(),
            name,
            description,
            price,
            img
        };
        services.push(newService);
        showNotification('Servicio creado');
    }
    
    saveServices(services);
    renderAdminServices();
    closeServiceModal();
}

function deleteService(id) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
        let services = getServices();
        services = services.filter(s => s.id !== id);
        saveServices(services);
        renderAdminServices();
        showNotification('Servicio eliminado');
    }
}
