document.addEventListener('DOMContentLoaded', () => {

    /* 1. MENÚ MOBILE */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
            const bars = hamburger.querySelectorAll('.bar');
            if(hamburger.classList.contains('active')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    /* 2. HEADER STICKY SCROLL */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 3. LÓGICA DEL COTIZADOR (3 VEHÍCULOS X 3 SERVICIOS EXACTOS) */
    const sizeButtons = document.querySelectorAll('#size-options .calc-opt-btn');
    const serviceButtons = document.querySelectorAll('#service-options .calc-opt-btn');
    
    const planName = document.getElementById('plan-name');
    const planDesc = document.getElementById('plan-desc');
    const planPrice = document.getElementById('plan-price');

    // Matriz exclusiva basada estrictamente en tus tres servicios de lavado reales
    const pricingMatrix = {
        'chico-express': { name: 'Lavado Express', desc: 'Exterior detallado a mano + limpieza de alfombras para autos chicos.', price: '$14.000' },
        'chico-interior': { name: 'Lavado Interior Detallado', desc: 'Descontaminación clínica, tapizados y plásticos a fondo de habitáculo chico.', price: '$16.000' },
        'chico-full': { name: 'Full Detailing', desc: 'Lavado completo de todo: exterior al detalle, interior completo e ingeniería de motor.', price: '$28.000' },
        
        'mediano-express': { name: 'Lavado Express', desc: 'Exterior técnico con espuma activa + limpieza profunda de alfombras para sedanes.', price: '$16.000' },
        'mediano-interior': { name: 'Lavado Interior Detallado', desc: 'Limpieza profunda por extracción e inyección en todas las butacas de sedanes.', price: '$18.000' },
        'mediano-full': { name: 'Full Detailing', desc: 'Tratamiento absoluto In & Out. Limpieza de trompa a cola, habitáculo entero y vano motor.', price: '$32.000' },
        
        'grande-express': { name: 'Lavado Express', desc: 'Lavado exterior seguro de carrocería grande + remoción y limpieza de alfombras.', price: '$18.000' },
        'grande-interior': { name: 'Lavado Interior Detallado', desc: 'Restauración clínica interior completa de Pick-Ups o SUVs familiares.', price: '$20.000' },
        'grande-full': { name: 'Full Detailing', desc: 'Máximo nivel de limpieza para camionetas. Chasis/Exterior, interior a fondo y motor.', price: '$38.000' }
    };

    function updateCalculator() {
        const activeSize = document.querySelector('#size-options .calc-opt-btn.active').getAttribute('data-value');
        const activeService = document.querySelector('#service-options .calc-opt-btn.active').getAttribute('data-value');
        const key = `${activeSize}-${activeService}`;
        
        const result = pricingMatrix[key];
        if (result && planName && planDesc && planPrice) {
            planName.textContent = result.name;
            planDesc.textContent = result.desc;
            planPrice.textContent = result.price; // Podes cambiar estos precios de referencia por los tuyos reales fijándote acá arriba
        }
    }

    function linkSelector(buttons) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateCalculator();
            });
        });
    }

    if(sizeButtons.length > 0 && serviceButtons.length > 0) {
        linkSelector(sizeButtons);
        linkSelector(serviceButtons);
        updateCalculator();
    }

    /* 4. ACORDEÓN (FAQ) */
    const accordionCards = document.querySelectorAll('.accordion-card');
    accordionCards.forEach(card => {
        const trigger = card.querySelector('.accordion-trigger');
        if(trigger) {
            trigger.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                accordionCards.forEach(c => c.classList.remove('active'));
                if(!isActive) {
                    card.classList.add('active');
                }
            });
        }
    });

    /* 5. REVELACIÓN AL HACER SCROLL (OBSERVER) */
    const scrollElements = document.querySelectorAll('.animate-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.05 });

    scrollElements.forEach(el => scrollObserver.observe(el));

    /* 6. ENVÍO INTERACTIVO DE FORMULARIO (REDIRECCIÓN PREPARADA) */
    const form = document.getElementById('main-contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            
            const name = document.getElementById('f-name').value;
            const phone = document.getElementById('f-phone').value;
            const car = document.getElementById('f-car').value;
            const zone = document.getElementById('f-zone').value;
            
            const activePlan = planName.textContent;
            const activePrice = planPrice.textContent;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando Turno...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Turno Listo';
                
                // Arma el mensaje automático para mandarte directo a tu celular
                const whatsappMessage = `Hola Full Detailing! Mi nombre es ${name}. Quiero agendar un turno para un "${activePlan}" (${activePrice}) para mi coche: ${car}. Vivo en la zona de ${zone}. Mi número es ${phone}.`;
                const encodedText = encodeURIComponent(whatsappMessage);
                
                // Reemplaza el número de abajo (542641234567) por tu WhatsApp real
                window.open(`https://wa.me/542645643805?text=${encodedText}`, '_blank');
                
                form.reset();
                btn.disabled = false;
                btn.innerHTML = 'Enviar Solicitud por WhatsApp <i class="fa-solid fa-paper-plane"></i>';
            }, 1200);
        });
    }
});