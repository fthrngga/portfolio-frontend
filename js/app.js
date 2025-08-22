document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://my-portfolio-api-a3id.onrender.com/api'; // Pastikan URL ini benar

    const profileContainer = document.getElementById('profile-data');
    const projectsGrid = document.getElementById('projects-grid');
    const visitorCountSpan = document.getElementById('visitor-count');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    // --- 1. Fetch Profile Data with Skeleton Loader ---
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            // Hapus skeleton, tampilkan data asli
            profileContainer.innerHTML = `
                <h1>${data.name}</h1>
                <p>${data.title}</p>
            `;
        } catch (error) {
            profileContainer.innerHTML = '<p>Gagal memuat profil. Silakan coba lagi.</p>';
            console.error('Failed to fetch profile:', error);
        }
    };

    // --- 2. Fetch Projects Data with Skeleton Loader ---
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            if (!response.ok) throw new Error('Network response was not ok');
            const projects = await response.json();
            
            projectsGrid.innerHTML = ''; // Hapus skeleton cards

            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'card';
                projectCard.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-pills">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="card-links">
                        <a href="${project.github_url}" target="_blank">GitHub</a>
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank">Live Demo</a>` : ''}
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });
        } catch (error) {
            projectsGrid.innerHTML = '<p>Gagal memuat proyek.</p>';
            console.error('Failed to fetch projects:', error);
        }
    };

    // --- 3. Fetch Visitor Count with Animation ---
    const fetchVisitorCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            // Animate counter
            const finalCount = data.visitors;
            let currentCount = 0;
            const increment = Math.ceil(finalCount / 100);

            const timer = setInterval(() => {
                currentCount += increment;
                if (currentCount >= finalCount) {
                    currentCount = finalCount;
                    clearInterval(timer);
                }
                visitorCountSpan.textContent = currentCount;
            }, 10);

        } catch (error) {
            visitorCountSpan.textContent = 'N/A';
            console.error('Failed to fetch visitor count:', error);
        }
    };

    // --- 4. Interactive Terminal Logic ---
    terminalInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command === '') return;

            // Tampilkan command yang diketik user
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-output-line';
            commandLine.innerHTML = `<span class="prompt-user">user@fathur.dev:~$</span> ${command}`;
            terminalOutput.appendChild(commandLine);

            terminalInput.value = ''; // Kosongkan input

            try {
                const response = await fetch(`${API_BASE_URL}/terminal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: command })
                });
                const data = await response.json();

                // Tampilkan output dari API
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-output-line';
                outputLine.textContent = data.output;
                terminalOutput.appendChild(outputLine);

            } catch (error) {
                const errorLine = document.createElement('div');
                errorLine.className = 'terminal-output-line';
                errorLine.textContent = 'Error: Could not connect to API.';
                terminalOutput.appendChild(errorLine);
            }
            
            // Auto scroll ke bawah
            document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
        }
    });


    // --- Panggil semua fungsi saat halaman dimuat ---
    fetchProfile();
    fetchProjects();
    fetchVisitorCount();
    
    // Logic untuk contact form bisa ditambahkan di sini
});