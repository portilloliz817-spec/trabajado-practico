document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});

function renderServices() {
    const services = getServices();
    const grid = document.getElementById('services-list');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'card service-card';
        card.innerHTML = `
            <img src="${service.img}" alt="${service.name}">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p class="price-tag">$${service.price}</p>
                <a href="turnos.html?service=${service.id}" class="btn">Reservar este servicio</a>
            </div>
        `;
        grid.appendChild(card);
    });
}
