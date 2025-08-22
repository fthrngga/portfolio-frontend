document.addEventListener('DOMContentLoaded', () => {
    // PENTING: Ganti URL ini dengan URL backend Render Anda saat deploy
    const API_BASE_URL = 'http://127.0.0.1:5000/api'; 

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile`);
            const data = await response.json();
            document.getElementById('profile-name').textContent = data.name;
            document.getElementById('profile-title').textContent = data.title;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const fetchProjects = async () => {
        // Logika untuk fetch /projects dan render hasilnya ke #projects-list
    };

    const fetchVisitorCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            const data = await response.json();
            document.getElementById('visitor-count').textContent = data.visitors;
        } catch (error) {
            console.error('Failed to fetch visitor count:', error);
        }
    };

    const handleContactForm = (event) => {
        event.preventDefault();
        // Logika untuk mengambil data form, POST ke /contact, dan menampilkan pesan sukses/gagal
    };

    // Panggil semua fungsi
    fetchProfile();
    fetchProjects();
    fetchVisitorCount();

    document.getElementById('contact-form').addEventListener('submit', handleContactForm);
});