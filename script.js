// ===== Particle Network Animation =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 195, 247, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(79, 195, 247, ${0.08 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Code Rain Background =====
const codeRain = document.getElementById('codeRain');
const codeSnippets = [
    'WITH cte AS (SELECT * FROM raw.events)',
    'dbt run --select marts.*',
    'SELECT * FROM {{ ref("fct_transactions") }}',
    'CLUSTER BY (transaction_date)',
    'MERGE INTO target USING source ON id',
    'def run_pipeline(config: dict):',
    'PARTITION BY customer_id ORDER BY ts',
    'ALTER WAREHOUSE compute_wh SET AUTO_SUSPEND = 60',
    'pd.read_csv("transactions.csv")',
    'tests:\n  - not_null\n  - unique',
    'COPY INTO raw.events FROM @s3_stage',
    'CREATE OR REPLACE STREAM events_stream ON TABLE raw',
    'dbt test --select staging.*',
    'SELECT DATE_TRUNC("month", created_at) AS month',
    'QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY ts) = 1',
    'snowflake.connector.connect(account=ACCOUNT)',
    'spark.read.parquet("s3a://data-lake/raw/")',
    'ZEROIFNULL(SUM(amount)) AS total_revenue',
    '{{ config(materialized="incremental") }}',
    'SYSTEM$STREAM_HAS_DATA("events_stream")',
];

function createCodeLine() {
    const line = document.createElement('div');
    line.className = 'line';
    line.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    line.style.top = Math.random() * 100 + '%';
    line.style.animationDuration = (15 + Math.random() * 20) + 's';
    line.style.animationDelay = Math.random() * 10 + 's';
    line.style.fontSize = (12 + Math.random() * 4) + 'px';
    codeRain.appendChild(line);

    setTimeout(() => line.remove(), 35000);
}

for (let i = 0; i < 12; i++) {
    setTimeout(createCodeLine, i * 800);
}
setInterval(createCodeLine, 3000);

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'all 0.4s ease';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card, .contact-card, .about-grid, .section-title, .section-subtitle').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Smooth anchor scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
