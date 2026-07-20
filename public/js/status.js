
document.addEventListener('DOMContentLoaded', () => {
    const systemInfoDiv = document.getElementById('system-info');
    const appsStatusListDiv = document.getElementById('apps-status-list');
    const config = window.APP_CONFIG || {};
    const BACKEND_URL = config.backendUrl || `${window.location.protocol}//${window.location.hostname}:${config.backendPort || 3000}`;

    async function fetchMachineStatus() {
        try {
            // Assume lalas-backend has an /api/machine-status endpoint
            const response = await fetch(`${BACKEND_URL}/api/machine-status`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const status = await response.json();

            systemInfoDiv.innerHTML = `
                <p>CPU Usage: ${status.cpuUsage || 'N/A'}</p>
                <p>Memory Usage: ${status.memoryUsage || 'N/A'}</p>
                <p>Disk Usage: ${status.diskUsage || 'N/A'}</p>
            `;
        } catch (error) {
            console.error('Error fetching machine status:', error);
            systemInfoDiv.innerHTML = '<p>Failed to load machine status. Ensure lalas-backend is running and exposes /api/machine-status.</p>';
        }
    }

    async function fetchDeployedAppsStatus() {
        try {
            // Assume lalas-backend has an /api/deployed-apps-status endpoint
            const response = await fetch(`${BACKEND_URL}/api/deployed-apps-status`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apps = await response.json(); // Expected: [{ name: 'app1', status: 'running' }, ...]

            if (apps.length === 0) {
                appsStatusListDiv.innerHTML = '<p>No deployed apps found.</p>';
                return;
            }

            appsStatusListDiv.innerHTML = '';
            apps.forEach(app => {
                const appDiv = document.createElement('div');
                appDiv.className = 'app-status-item';
                appDiv.innerHTML = `<span>${app.name}: ${app.status}</span>`;
                appsStatusListDiv.appendChild(appDiv);
            });
        } catch (error) {
            console.error('Error fetching deployed apps status:', error);
            appsStatusListDiv.innerHTML = '<p>Failed to load deployed apps status. Ensure lalas-backend is running and exposes /api/deployed-apps-status.</p>';
        }
    }

    fetchMachineStatus();
    fetchDeployedAppsStatus();
});
