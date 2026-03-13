(function() {
    // 1. Identify the script and get parameters
    const script = document.currentScript;
    const agentId = script.getAttribute('data-agent-id');
    const theme = script.getAttribute('data-theme') || 'dark';
    const frontendUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://supportgenie.vercel.app'; // Replace with real URL

    if (!agentId) {
        console.error('SupportGenie: Missing data-agent-id attribute.');
        return;
    }

    // 2. Create the iframe container
    const container = document.createElement('div');
    container.id = 'supportgenie-widget-container';
    Object.assign(container.style, {
        position: 'fixed',
        bottom: '0',
        right: '0',
        zIndex: '2147483647',
        width: '100px',
        height: '100px',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
    });

    // 3. Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${frontendUrl}/widget/${agentId}`;
    iframe.id = 'supportgenie-iframe';
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent'
    });

    container.appendChild(iframe);
    document.body.appendChild(container);

    // 4. Listen for resize messages from the widget
    window.addEventListener('message', function(event) {
        if (event.origin !== frontendUrl) return;

        if (event.data.type === 'GENIE_WIDGET_STATE') {
            if (event.data.isOpen) {
                // Expanding for chat window
                container.style.width = window.innerWidth < 640 ? '100%' : '420px';
                container.style.height = '600px';
            } else {
                // Collapsing to just the button
                container.style.width = '100px';
                container.style.height = '100px';
            }
        }
    });
})();
