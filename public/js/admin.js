
document.addEventListener('DOMContentLoaded', () => {
    const appListDiv = document.getElementById('app-list');
    const BACKEND_URL = 'http://localhost:3000'; // lalas-backend URL

    async function fetchRunningApps() {
        try {
            // In a real scenario, lalas-backend would expose an endpoint to list Node.js services
            // For now, we simulate this or assume a specific endpoint exists.
            // Let's assume lalas-backend has an /api/services endpoint that returns a list of service names.
            const response = await fetch(`${BACKEND_URL}/api/services`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apps = await response.json(); // Expected: [{ name: 'lalas-backend', status: 'running' }, ...]

            if (apps.length === 0) {
                appListDiv.innerHTML = '<p>No Node.js apps found.</p>';
                return;
            }

            appListDiv.innerHTML = '';
            apps.forEach(app => {
                const appDiv = document.createElement('div');
                appDiv.className = 'app-item';
                appDiv.innerHTML = `
                    <span>${app.name} (Status: ${app.status})</span>
                    <button data-app-name="${app.name}">Restart</button>
                `;
                appListDiv.appendChild(appDiv);
            });

            // Add event listeners for restart buttons
            appListDiv.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const appName = event.target.dataset.appName;
                    if (confirm(`Are you sure you want to restart ${appName}?`)) {
                        await restartApp(appName);
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching running apps:', error);
            appListDiv.innerHTML = '<p>Failed to load apps. Ensure lalas-backend is running and exposes /api/services.</p>';
        }
    }

    async function restartApp(appName) {
        try {
            // In a real scenario, lalas-backend would expose an endpoint to restart a service
            // Let's assume lalas-backend has a /api/restart-service endpoint that takes the service name.
            const response = await fetch(`${BACKEND_URL}/api/restart-service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serviceName: appName }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message || `Successfully sent restart request for ${appName}.`);
            fetchRunningApps(); // Refresh the list after restart
        } catch (error) {
            console.error(`Error restarting ${appName}:`, error);
            alert(`Failed to restart ${appName}. Error: ${error.message}. Ensure lalas-backend exposes /api/restart-service.`);
        }
    }

    fetchRunningApps();
});
