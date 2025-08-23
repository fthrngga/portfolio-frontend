document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const heroTitle = document.getElementById('hero-title');
    const profileSubtitle = document.getElementById('profile-subtitle');
    // ... (semua elemen DOM lainnya dari versi sebelumnya) ...
    const profileContainer = document.getElementById('profile-data');
    const projectsGrid = document.getElementById('projects-grid');
    const visitorCountSpan = document.getElementById('visitor-count');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const monitorLogs = document.getElementById('monitor-logs');
    const monitorToggleBtn = document.getElementById('monitor-toggle-btn');
    const apiMonitor = document.getElementById('api-monitor');

    const API_BASE_URL = 'https://my-portfolio-api-a3id.onrender.com/api';


    // --- Efek Mengetik untuk Hero ---
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = '<span class="cursor">|</span>';
        const typing = () => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
                i++;
                setTimeout(typing, speed);
            } else {
                 element.innerHTML = text + '<span class="cursor">|</span>';
            }
        };
        typing();
    };

    // --- Animasi Fade-in saat Scroll ---
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(el => {
        fadeInObserver.observe(el);
    });
    
    // --- API Monitor & Fetch Wrapper (Sama seperti sebelumnya) ---
    // ... (salin dan paste seluruh bagian API Monitor & Fetch Wrapper dari kode JS Anda sebelumnya) ...
     const logApiCall = (method, endpoint, status, duration) => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        const statusClass = status === 200 ? 'success' : 'error';
        const statusText = status === 200 ? '200 OK' : `ERR ${status}`;

        logEntry.innerHTML = `
            <span class="log-status ${statusClass}">${statusText}</span>
            <span class="log-method">${method}</span>
            <span class="log-endpoint">${endpoint}</span>
            <span class="log-duration">${duration}ms</span>
        `;
        monitorLogs.appendChild(logEntry);
        monitorLogs.scrollTop = monitorLogs.scrollHeight; // Auto-scroll
    };

    monitorToggleBtn.addEventListener('click', () => {
        monitorLogs.style.display = monitorLogs.style.display === 'none' ? 'block' : 'none';
        monitorToggleBtn.textContent = monitorLogs.style.display === 'none' ? '+' : '-';
    });


    // --- Wrapper untuk Fetch API ---
    const apiFetch = async (method, endpoint, body = null) => {
        const startTime = Date.now();
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const duration = Date.now() - startTime;
            
            logApiCall(method, endpoint, response.status, duration);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();

        } catch (error) {
            const duration = Date.now() - startTime;
            logApiCall(method, endpoint, 'NET_ERR', duration);
            console.error(`Fetch error for ${endpoint}:`, error);
            throw error;
        }
    };


    // --- Fungsi Fetch Data (Dimodifikasi untuk mengisi elemen baru) ---
    const fetchProfile = async () => {
        try {
            const data = await apiFetch('GET', '/profile');
            typeWriter(heroTitle, data.name); // Gunakan efek mengetik
            profileSubtitle.textContent = data.title;
        } catch (error) {
            heroTitle.textContent = "Gagal memuat data.";
        }
    };

    // ... (fungsi fetchProjects, fetchVisitorCount, dan terminal tetap sama seperti sebelumnya) ...
    const fetchProjects = async () => {
        try {
            const projects = await apiFetch('GET', '/projects');
            projectsGrid.innerHTML = ''; // Hapus skeleton
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'card';
                projectCard.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-pills">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div>
                    <div class="card-links">
                        <a href="${project.github_url}" target="_blank">GitHub</a>
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank">Live Demo</a>` : ''}
                    </div>`;
                projectsGrid.appendChild(projectCard);
            });
        } catch (error) {
            projectsGrid.innerHTML = '<p>Gagal memuat proyek.</p>';
        }
    };

    const fetchVisitorCount = async () => {
        try {
            const data = await apiFetch('GET', '/stats');
            visitorCountSpan.textContent = data.visitors; // Hilangkan animasi agar lebih direct
        } catch (error) {
            visitorCountSpan.textContent = 'N/A';
        }
    };

    terminalInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command === '') return;

            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-output-line';
            commandLine.innerHTML = `<span class="prompt-user">user@fathur.dev:~$</span> ${command}`;
            terminalOutput.appendChild(commandLine);
            terminalInput.value = '';

            try {
                const data = await apiFetch('POST', '/terminal', { command });
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-output-line';
                outputLine.textContent = data.output;
                terminalOutput.appendChild(outputLine);
            } catch (error) {
                // Error sudah di-log oleh apiFetch
            }
            document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
        }
    });

    // Panggil fungsi inisialisasi
    fetchProfile();
    fetchProjects();
    fetchVisitorCount();
});