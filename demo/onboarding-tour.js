/**
 * Mach Five Magnet Demo - Onboarding Tour
 * Guided tour for first-time users with tooltips and spotlights
 */

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'mfm_demo_tour_completed';
    const TOUR_STEPS = [
        {
            target: '.demo-sidebar',
            title: 'Welcome to Mach Five Magnet!',
            content: 'This is a demo showcasing how Mach Five Magnet helps you create conversational lead capture flows. Let\'s take a quick tour!',
            position: 'right',
            highlightPadding: 10
        },
        {
            target: '.stats-grid',
            title: 'Dashboard Overview',
            content: 'Track your key metrics at a glance: conversations started, completion rates, leads captured, and active magnets.',
            position: 'bottom',
            highlightPadding: 15
        },
        {
            target: '.charts-section',
            title: 'Analytics & Insights',
            content: 'Visualize your performance with interactive charts showing trends, funnels, traffic sources, and magnet comparisons.',
            position: 'bottom',
            highlightPadding: 15,
            scrollTo: true
        },
        {
            target: '.activity-feed',
            title: 'Live Activity Feed',
            content: 'Watch real-time updates as visitors interact with your magnets. See completions, leads, and abandonments as they happen.',
            position: 'left',
            highlightPadding: 15,
            scrollTo: true
        },
        {
            target: 'a[href="/demo/magnets.html"]',
            title: 'Your Magnets',
            content: 'Manage all your lead capture magnets, edit flows, view performance, and get install codes for your website.',
            position: 'right',
            highlightPadding: 12
        },
        {
            target: 'a[href="/demo/flow-builder.html"]',
            title: 'Flow Builder',
            content: 'Create conversational experiences with our visual flow builder. Design paths, add questions, and set up conditional logic.',
            position: 'right',
            highlightPadding: 12,
            linkClick: true
        },
        {
            target: '.btn-primary',
            title: 'Ready to Start',
            content: 'Click "Add New Magnet" to create your first conversational flow. Or explore the templates library for pre-built patterns!',
            position: 'bottom',
            highlightPadding: 12,
            finalStep: true
        }
    ];

    let currentStep = 0;
    let tourActive = false;
    let overlay = null;
    let tooltip = null;
    let spotlight = null;

    /**
     * Initialize onboarding tour
     */
    function init() {
        // Check if tour has been completed
        if (hasCompletedTour()) {
            return;
        }

        // Only show on dashboard page
        if (!window.location.pathname.includes('/demo/') || window.location.pathname.includes('magnets') || window.location.pathname.includes('flow-builder')) {
            return;
        }

        // Wait a moment before starting tour
        setTimeout(() => {
            startTour();
        }, 1000);
    }

    /**
     * Check if user has completed tour
     */
    function hasCompletedTour() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    /**
     * Mark tour as completed
     */
    function completeTour() {
        localStorage.setItem(STORAGE_KEY, 'true');
    }

    /**
     * Start the onboarding tour
     */
    function startTour() {
        if (tourActive) return;

        tourActive = true;
        currentStep = 0;

        createOverlay();
        createTooltip();
        createSpotlight();

        showStep(currentStep);
    }

    /**
     * Create dark overlay
     */
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            backdrop-filter: blur(2px);
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Create spotlight effect
     */
    function createSpotlight() {
        spotlight = document.createElement('div');
        spotlight.className = 'onboarding-spotlight';
        spotlight.style.cssText = `
            position: absolute;
            border: 3px solid #FF6B35;
            border-radius: 12px;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 107, 53, 0.6);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(spotlight);
    }

    /**
     * Create tooltip
     */
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'onboarding-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            z-index: 10000;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
            animation: tooltipSlideIn 0.3s ease-out;
        `;

        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h3 class="tooltip-title"></h3>
                <p class="tooltip-text"></p>
                <div class="tooltip-footer">
                    <div class="tooltip-progress">
                        <span class="progress-text"></span>
                    </div>
                    <div class="tooltip-actions">
                        <button class="tooltip-btn tooltip-skip">Skip Tour</button>
                        <button class="tooltip-btn tooltip-next">Next</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tooltipSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .tooltip-title {
                font-size: 20px;
                font-weight: 700;
                color: #181818;
                margin: 0 0 12px 0;
            }
            .tooltip-text {
                font-size: 15px;
                line-height: 1.6;
                color: #666;
                margin: 0 0 20px 0;
            }
            .tooltip-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
            }
            .tooltip-progress {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .progress-text {
                font-size: 13px;
                color: #999;
                font-weight: 600;
            }
            .tooltip-actions {
                display: flex;
                gap: 12px;
            }
            .tooltip-btn {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            .tooltip-skip {
                background: transparent;
                color: #999;
            }
            .tooltip-skip:hover {
                color: #666;
                background: #F5F7FA;
            }
            .tooltip-next {
                background: #3498DB;
                color: white;
            }
            .tooltip-next:hover {
                background: #2980B9;
                transform: translateY(-1px);
            }
            .tooltip-next.final {
                background: #27AE60;
            }
            .tooltip-next.final:hover {
                background: #229954;
            }
        `;
        document.head.appendChild(style);

        // Attach event listeners
        tooltip.querySelector('.tooltip-skip').addEventListener('click', skipTour);
        tooltip.querySelector('.tooltip-next').addEventListener('click', nextStep);

        document.body.appendChild(tooltip);
    }

    /**
     * Show a specific step
     */
    function showStep(stepIndex) {
        if (stepIndex >= TOUR_STEPS.length) {
            endTour();
            return;
        }

        const step = TOUR_STEPS[stepIndex];
        const target = document.querySelector(step.target);

        if (!target) {
            console.warn('Onboarding target not found:', step.target);
            nextStep();
            return;
        }

        // Scroll to target if needed
        if (step.scrollTo) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => positionElements(target, step), 400);
        } else {
            positionElements(target, step);
        }

        // Update tooltip content
        tooltip.querySelector('.tooltip-title').textContent = step.title;
        tooltip.querySelector('.tooltip-text').textContent = step.content;
        tooltip.querySelector('.progress-text').textContent = `Step ${stepIndex + 1} of ${TOUR_STEPS.length}`;

        // Update next button
        const nextBtn = tooltip.querySelector('.tooltip-next');
        if (step.finalStep) {
            nextBtn.textContent = 'Got It!';
            nextBtn.classList.add('final');
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.classList.remove('final');
        }
    }

    /**
     * Position spotlight and tooltip around target
     */
    function positionElements(target, step) {
        const rect = target.getBoundingClientRect();
        const padding = step.highlightPadding || 10;

        // Position spotlight
        spotlight.style.top = (rect.top - padding) + 'px';
        spotlight.style.left = (rect.left - padding) + 'px';
        spotlight.style.width = (rect.width + padding * 2) + 'px';
        spotlight.style.height = (rect.height + padding * 2) + 'px';

        // Position tooltip
        const tooltipRect = tooltip.getBoundingClientRect();
        let top, left;

        switch (step.position) {
            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 20;
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 20;
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'top':
                top = rect.top - tooltipRect.height - 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            default:
                top = rect.bottom + 20;
                left = rect.left;
        }

        // Keep tooltip in viewport
        const margin = 20;
        top = Math.max(margin, Math.min(top, window.innerHeight - tooltipRect.height - margin));
        left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
    }

    /**
     * Go to next step
     */
    function nextStep() {
        currentStep++;
        if (currentStep >= TOUR_STEPS.length) {
            endTour();
        } else {
            showStep(currentStep);
        }
    }

    /**
     * Skip entire tour
     */
    function skipTour() {
        if (confirm('Are you sure you want to skip the tour? You can always restart it from Settings.')) {
            endTour();
        }
    }

    /**
     * End tour and cleanup
     */
    function endTour() {
        completeTour();
        tourActive = false;

        // Animate out
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
        if (spotlight) {
            spotlight.style.opacity = '0';
            setTimeout(() => spotlight.remove(), 300);
        }
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }
    }

    /**
     * Public API to restart tour (can be called from settings)
     */
    window.MFMOnboarding = {
        restart: function() {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
