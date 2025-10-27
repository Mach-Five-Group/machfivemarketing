// Flow Builder Interactive Functionality

(function() {
    let selectedNode = null;
    let zoomLevel = 100;

    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initializeFlowBuilder();
    });

    function initializeFlowBuilder() {
        // Make nodes clickable
        const nodes = document.querySelectorAll('.flow-node');
        nodes.forEach(node => {
            node.addEventListener('click', function(e) {
                e.stopPropagation();
                selectNode(this);
            });
        });

        // Canvas click to deselect
        const canvas = document.querySelector('.flow-canvas');
        if (canvas) {
            canvas.addEventListener('click', function() {
                deselectAllNodes();
            });
        }

        // Zoom controls
        const zoomIn = document.querySelector('.btn-icon[title="Zoom In"]');
        const zoomOut = document.querySelector('.btn-icon[title="Zoom Out"]');
        const fitScreen = document.querySelector('.btn-icon[title="Fit to Screen"]');

        if (zoomIn) {
            zoomIn.addEventListener('click', function() {
                adjustZoom(10);
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', function() {
                adjustZoom(-10);
            });
        }

        if (fitScreen) {
            fitScreen.addEventListener('click', function() {
                setZoom(100);
            });
        }

        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            // Already has href, just add smooth transition
            backBtn.style.transition = 'all 0.2s ease';
        }
    }

    function selectNode(nodeElement) {
        // Deselect all nodes
        deselectAllNodes();

        // Select this node
        selectedNode = nodeElement;
        nodeElement.classList.add('selected');

        // Highlight connected lines
        highlightConnections(nodeElement);

        // Show properties panel
        showPropertiesPanel(nodeElement);
    }

    function deselectAllNodes() {
        const nodes = document.querySelectorAll('.flow-node');
        nodes.forEach(node => {
            node.classList.remove('selected');
        });

        // Reset connection line colors
        const lines = document.querySelectorAll('.connection-line');
        lines.forEach(line => {
            line.style.stroke = '#CBD5E1';
            line.style.strokeWidth = '2';
        });

        // Hide properties panel
        hidePropertiesPanel();

        selectedNode = null;
    }

    function highlightConnections(nodeElement) {
        // This is simplified - in real app would trace actual connections
        const lines = document.querySelectorAll('.connection-line');
        lines.forEach((line, index) => {
            // Highlight some lines to show interactivity
            if (index % 2 === 0) {
                line.style.stroke = '#FF6B35';
                line.style.strokeWidth = '3';
            }
        });
    }

    function showPropertiesPanel(nodeElement) {
        const emptyState = document.querySelector('.properties-empty');
        const contentPanel = document.querySelector('.properties-content');

        if (emptyState) emptyState.style.display = 'none';
        if (contentPanel) {
            contentPanel.style.display = 'block';
            animateIn(contentPanel);
        }

        // Update panel based on node type
        updatePropertiesContent(nodeElement);
    }

    function hidePropertiesPanel() {
        const emptyState = document.querySelector('.properties-empty');
        const contentPanel = document.querySelector('.properties-content');

        if (emptyState) emptyState.style.display = 'flex';
        if (contentPanel) contentPanel.style.display = 'none';
    }

    function updatePropertiesContent(nodeElement) {
        const nodeType = nodeElement.querySelector('.node-header span:last-child');
        const nodeBody = nodeElement.querySelector('.node-body');

        if (!nodeType || !nodeBody) return;

        // Get node data
        const typeText = nodeType.textContent.trim();
        const preview = nodeBody.querySelector('.node-preview');
        const previewText = preview ? preview.textContent.trim() : '';

        // Update property panel title
        const propertyValue = document.querySelector('.property-value');
        if (propertyValue) {
            propertyValue.textContent = typeText;
        }

        // Update message text
        const propertyInput = document.querySelector('.property-input');
        if (propertyInput && previewText) {
            propertyInput.value = previewText.replace(/["""]/g, '');
        }
    }

    function adjustZoom(delta) {
        zoomLevel = Math.max(50, Math.min(200, zoomLevel + delta));
        setZoom(zoomLevel);
    }

    function setZoom(level) {
        zoomLevel = level;
        const canvas = document.querySelector('.flow-canvas');
        const zoomDisplay = document.querySelector('.zoom-level');

        if (canvas) {
            canvas.style.transform = `scale(${zoomLevel / 100})`;
            canvas.style.transformOrigin = 'top left';
        }

        if (zoomDisplay) {
            zoomDisplay.textContent = zoomLevel + '%';
        }
    }

    function animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    // Add hover effects to nodes
    document.addEventListener('DOMContentLoaded', function() {
        const nodes = document.querySelectorAll('.flow-node');
        nodes.forEach(node => {
            node.style.cursor = 'pointer';

            node.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.borderColor = '#FF6B35';
                }
            });

            node.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.borderColor = '';
                }
            });
        });
    });

})();
