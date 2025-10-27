/**
 * Mach Five Magnet Demo - Install Code Modal
 * Shows installation code with copy-to-clipboard and multiple platform tabs
 */

(function() {
    'use strict';

    // Configuration
    const MAGNET_CONFIGS = {
        'Homepage Demo Scheduler': {
            id: 'mag_5f8a9c2b1e',
            domain: 'www.example.com',
            pages: '/',
            displayMode: 'chat-bubble'
        },
        'Blog Newsletter Capture': {
            id: 'mag_3d7e6f9a2c',
            domain: 'blog.example.com',
            pages: '/blog/*',
            displayMode: 'slide-panel'
        },
        'Pricing Exit Intent': {
            id: 'mag_8b4c1f3e7a',
            domain: 'www.example.com',
            pages: '/pricing',
            displayMode: 'popup'
        },
        'Product Finder Quiz': {
            id: 'mag_2e9d4a6f1b',
            domain: 'www.example.com',
            pages: '/products/*',
            displayMode: 'embedded'
        }
    };

    let currentMagnetName = '';
    let currentTab = 'html';

    /**
     * Initialize modal functionality
     */
    function init() {
        createModal();
        attachEventListeners();
    }

    /**
     * Create modal HTML structure
     */
    function createModal() {
        const modalHTML = `
            <div id="install-code-modal" class="install-modal">
                <div class="install-modal-overlay"></div>
                <div class="install-modal-content">
                    <div class="install-modal-header">
                        <h2 class="install-modal-title">
                            <span class="material-symbols-outlined">code</span>
                            <span>Install Your Magnet</span>
                        </h2>
                        <button class="install-modal-close" aria-label="Close">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div class="install-modal-body">
                        <p class="install-intro">
                            Copy and paste the code below to install <strong id="install-magnet-name"></strong> on your website.
                        </p>

                        <!-- Platform Tabs -->
                        <div class="install-tabs">
                            <button class="install-tab active" data-tab="html">
                                <span class="material-symbols-outlined">code</span>
                                <span>HTML</span>
                            </button>
                            <button class="install-tab" data-tab="wordpress">
                                <span class="material-symbols-outlined">wysiwyg</span>
                                <span>WordPress</span>
                            </button>
                            <button class="install-tab" data-tab="shopify">
                                <span class="material-symbols-outlined">shopping_cart</span>
                                <span>Shopify</span>
                            </button>
                            <button class="install-tab" data-tab="gtm">
                                <span class="material-symbols-outlined">analytics</span>
                                <span>Google Tag Manager</span>
                            </button>
                        </div>

                        <!-- Tab Content -->
                        <div class="install-tab-content">
                            <div class="install-tab-pane active" data-pane="html">
                                <p class="install-instructions">
                                    Add this code snippet before the closing <code>&lt;/body&gt;</code> tag on pages where you want the magnet to appear:
                                </p>
                                <div class="code-block-container">
                                    <pre class="code-block"><code id="code-html"></code></pre>
                                    <button class="copy-code-btn" data-code-target="code-html">
                                        <span class="material-symbols-outlined">content_copy</span>
                                        <span class="copy-text">Copy</span>
                                    </button>
                                </div>
                            </div>

                            <div class="install-tab-pane" data-pane="wordpress">
                                <p class="install-instructions">
                                    <strong>Option 1: Using a Plugin (Recommended)</strong><br>
                                    Install the "Insert Headers and Footers" plugin, then paste this code in the footer section:
                                </p>
                                <div class="code-block-container">
                                    <pre class="code-block"><code id="code-wordpress"></code></pre>
                                    <button class="copy-code-btn" data-code-target="code-wordpress">
                                        <span class="material-symbols-outlined">content_copy</span>
                                        <span class="copy-text">Copy</span>
                                    </button>
                                </div>
                                <p class="install-instructions" style="margin-top: 16px;">
                                    <strong>Option 2: Theme File</strong><br>
                                    Add the code above to your theme's <code>footer.php</code> file before <code>&lt;/body&gt;</code>
                                </p>
                            </div>

                            <div class="install-tab-pane" data-pane="shopify">
                                <p class="install-instructions">
                                    1. In your Shopify admin, go to <strong>Online Store → Themes</strong><br>
                                    2. Click <strong>Actions → Edit Code</strong><br>
                                    3. Open <code>theme.liquid</code><br>
                                    4. Paste this code before the closing <code>&lt;/body&gt;</code> tag:
                                </p>
                                <div class="code-block-container">
                                    <pre class="code-block"><code id="code-shopify"></code></pre>
                                    <button class="copy-code-btn" data-code-target="code-shopify">
                                        <span class="material-symbols-outlined">content_copy</span>
                                        <span class="copy-text">Copy</span>
                                    </button>
                                </div>
                            </div>

                            <div class="install-tab-pane" data-pane="gtm">
                                <p class="install-instructions">
                                    1. In Google Tag Manager, create a new <strong>Custom HTML Tag</strong><br>
                                    2. Paste this code:<br>
                                </p>
                                <div class="code-block-container">
                                    <pre class="code-block"><code id="code-gtm"></code></pre>
                                    <button class="copy-code-btn" data-code-target="code-gtm">
                                        <span class="material-symbols-outlined">content_copy</span>
                                        <span class="copy-text">Copy</span>
                                    </button>
                                </div>
                                <p class="install-instructions" style="margin-top: 16px;">
                                    3. Set trigger to <strong>All Pages</strong> or create custom page rules<br>
                                    4. Save and publish your container
                                </p>
                            </div>
                        </div>

                        <!-- Additional Info -->
                        <div class="install-info">
                            <div class="install-info-row">
                                <span class="material-symbols-outlined">widgets</span>
                                <div>
                                    <strong>Magnet ID:</strong> <code id="install-magnet-id"></code>
                                </div>
                            </div>
                            <div class="install-info-row">
                                <span class="material-symbols-outlined">key</span>
                                <div>
                                    <strong>API Key:</strong> <code>pk_live_abc123def456ghi789</code> <span class="info-badge">Demo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        const modal = document.getElementById('install-code-modal');
        const closeBtn = modal.querySelector('.install-modal-close');
        const overlay = modal.querySelector('.install-modal-overlay');

        // Close modal
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Tab switching
        const tabs = modal.querySelectorAll('.install-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // Copy buttons
        const copyButtons = modal.querySelectorAll('.copy-code-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => copyCode(btn));
        });

        // Install buttons in magnet cards
        attachInstallButtons();
    }

    /**
     * Attach click handlers to install buttons
     */
    function attachInstallButtons() {
        // Add install buttons to each magnet card
        const magnetCards = document.querySelectorAll('.magnet-card');
        magnetCards.forEach(card => {
            const magnetName = card.querySelector('.magnet-name').textContent;
            const actionsDiv = card.querySelector('.magnet-actions');

            // Create install button
            const installBtn = document.createElement('button');
            installBtn.className = 'icon-btn install-code-btn';
            installBtn.title = 'Get Install Code';
            installBtn.innerHTML = '<span class="material-symbols-outlined">code</span>';
            installBtn.dataset.magnetName = magnetName;

            // Insert before "more" button
            const moreBtn = actionsDiv.querySelector('[title="More"]');
            actionsDiv.insertBefore(installBtn, moreBtn);

            // Add click handler
            installBtn.addEventListener('click', () => openModal(magnetName));
        });
    }

    /**
     * Open modal with magnet data
     */
    function openModal(magnetName) {
        currentMagnetName = magnetName;
        const config = MAGNET_CONFIGS[magnetName];

        if (!config) return;

        const modal = document.getElementById('install-code-modal');

        // Update modal content
        document.getElementById('install-magnet-name').textContent = magnetName;
        document.getElementById('install-magnet-id').textContent = config.id;

        // Generate code for each platform
        generateCode(config);

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    function closeModal() {
        const modal = document.getElementById('install-code-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Switch between platform tabs
     */
    function switchTab(tabName) {
        currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.install-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab panes
        document.querySelectorAll('.install-tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.dataset.pane === tabName);
        });
    }

    /**
     * Generate install code for all platforms
     */
    function generateCode(config) {
        const baseCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.machfivemagnet.com/magnet.js';
    script.async = true;
    script.onload = function() {
      MachFiveMagnet.init({
        magnetId: '${config.id}',
        apiKey: 'pk_live_abc123def456ghi789'
      });
    };
    document.body.appendChild(script);
  })();
</script>`;

        // HTML (same for all platforms in this demo)
        document.getElementById('code-html').textContent = baseCode;
        document.getElementById('code-wordpress').textContent = baseCode;
        document.getElementById('code-shopify').textContent = baseCode;
        document.getElementById('code-gtm').textContent = baseCode;
    }

    /**
     * Copy code to clipboard
     */
    function copyCode(button) {
        const targetId = button.dataset.codeTarget;
        const codeElement = document.getElementById(targetId);
        const code = codeElement.textContent;

        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            // Show success feedback
            const textSpan = button.querySelector('.copy-text');
            const icon = button.querySelector('.material-symbols-outlined');

            const originalText = textSpan.textContent;
            textSpan.textContent = 'Copied!';
            icon.textContent = 'check';
            button.classList.add('copied');

            setTimeout(() => {
                textSpan.textContent = originalText;
                icon.textContent = 'content_copy';
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy code. Please copy manually.');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
