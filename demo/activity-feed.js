/**
 * Mach Five Magnet Demo - Real-time Activity Feed
 * Makes the Dashboard activity feed dynamic with auto-updating items
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        updateInterval: 12000, // 12 seconds between new items
        maxItems: 12, // Maximum items to keep in feed
        timestampUpdateInterval: 60000, // Update timestamps every minute
        pauseOnInteraction: true
    };

    // Activity templates with realistic demo data
    const ACTIVITY_TEMPLATES = [
        {
            type: 'conversion',
            icon: 'check_circle',
            title: 'Flow completed',
            names: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Park', 'Lisa Thompson', 'James Wilson', 'Jennifer Lee', 'Robert Martinez', 'Amanda White', 'Christopher Brown'],
            flows: [
                { name: 'Homepage Demo Scheduler', outcome: 'Booked' },
                { name: 'Product Finder Quiz', outcome: 'Qualified' },
                { name: 'Pricing Exit Intent', outcome: 'Downloaded' },
                { name: 'Contact Sales Flow', outcome: 'Meeting Scheduled' },
                { name: 'Free Trial Signup', outcome: 'Account Created' }
            ]
        },
        {
            type: 'new-lead',
            icon: 'forum',
            title: 'Conversation started',
            names: ['Alex Turner', 'Maria Garcia', 'Kevin Zhang', 'Nicole Anderson', 'Ryan Cooper', 'Samantha Hill', 'Daniel Kim', 'Rachel Foster', 'Brandon Scott', 'Jessica Adams'],
            flows: ['Blog Newsletter Capture', 'Homepage Demo Scheduler', 'Product Finder Quiz', 'Exit Intent Offer', 'Resource Download Flow']
        },
        {
            type: 'conversion',
            icon: 'person_add',
            title: 'Lead captured',
            names: ['Tyler Brooks', 'Olivia Mitchell', 'Justin Hayes', 'Megan Price', 'Andrew Ross', 'Lauren Bell', 'Matthew Ward', 'Victoria Gray', 'Nathan Reed', 'Ashley Coleman'],
            flows: [
                { name: 'Pricing Exit Intent', outcome: 'Email' },
                { name: 'Blog Newsletter Capture', outcome: 'Subscribed' },
                { name: 'Webinar Registration', outcome: 'Registered' },
                { name: 'Ebook Download', outcome: 'Downloaded' },
                { name: 'Free Consultation', outcome: 'Contact Info' }
            ]
        },
        {
            type: 'engagement',
            icon: 'close',
            title: 'Flow abandoned',
            names: ['Brian Murphy', 'Kelly Russell', 'Gregory Cook', 'Christine Morgan', 'Patrick Hughes', 'Melissa Rivera', 'Jason Butler', 'Stephanie Powell', 'Eric Long', 'Kimberly Patterson'],
            flows: ['Homepage Demo', 'Product Quiz', 'Pricing Flow', 'Contact Form', 'Newsletter Signup'],
            steps: ['Step 1/5', 'Step 2/5', 'Step 3/5', 'Step 2/4', 'Step 1/3']
        }
    ];

    // State management
    let activityFeed = null;
    let updateTimer = null;
    let timestampTimer = null;
    let isPaused = false;
    let activityItems = [];

    /**
     * Initialize the activity feed
     */
    function init() {
        activityFeed = document.querySelector('.activity-feed');
        if (!activityFeed) return;

        // Parse existing items and add timestamps
        parseExistingItems();

        // Start timers
        startActivityUpdates();
        startTimestampUpdates();

        // Pause on user interaction
        if (CONFIG.pauseOnInteraction) {
            setupInteractionListeners();
        }
    }

    /**
     * Parse existing static items and convert to dynamic
     */
    function parseExistingItems() {
        const existingItems = activityFeed.querySelectorAll('.activity-item');
        const now = Date.now();

        existingItems.forEach((item, index) => {
            const metaText = item.querySelector('.activity-meta').textContent;
            const timeMatch = metaText.match(/(\d+)\s+min\s+ago/);
            const minutesAgo = timeMatch ? parseInt(timeMatch[1]) : (index + 1) * 5;

            const timestamp = now - (minutesAgo * 60000);
            item.dataset.timestamp = timestamp;

            activityItems.push({
                element: item,
                timestamp: timestamp,
                metaElement: item.querySelector('.activity-meta')
            });
        });

        // Update timestamps immediately
        updateTimestamps();
    }

    /**
     * Generate random activity item
     */
    function generateActivity() {
        const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
        const name = template.names[Math.floor(Math.random() * template.names.length)];
        const timestamp = Date.now();

        let metaText;
        if (template.type === 'conversion' && template.flows[0].outcome) {
            const flow = template.flows[Math.floor(Math.random() * template.flows.length)];
            metaText = `${name} • ${flow.name} → ${flow.outcome} • just now`;
        } else if (template.type === 'engagement') {
            const flow = template.flows[Math.floor(Math.random() * template.flows.length)];
            const step = template.steps[Math.floor(Math.random() * template.steps.length)];
            metaText = `${name} • ${flow} • ${step} • just now`;
        } else if (template.type === 'conversion' && template.icon === 'person_add') {
            const flow = template.flows[Math.floor(Math.random() * template.flows.length)];
            metaText = `${name} • ${flow.name} → ${flow.outcome} • just now`;
        } else {
            const flow = template.flows[Math.floor(Math.random() * template.flows.length)];
            metaText = `${name} • ${flow} • just now`;
        }

        return {
            type: template.type,
            icon: template.icon,
            title: template.title,
            meta: metaText,
            timestamp: timestamp
        };
    }

    /**
     * Add new activity item to feed
     */
    function addActivityItem(activity) {
        // Create new item element
        const itemEl = document.createElement('div');
        itemEl.className = 'activity-item new-item';
        itemEl.dataset.timestamp = activity.timestamp;

        itemEl.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <span class="material-symbols-outlined">${activity.icon}</span>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-meta">${activity.meta}</div>
            </div>
        `;

        // Insert at top with slide-in animation
        activityFeed.insertBefore(itemEl, activityFeed.firstChild);

        // Trigger slide-in animation
        requestAnimationFrame(() => {
            itemEl.classList.add('visible');
        });

        // Add to tracked items
        activityItems.unshift({
            element: itemEl,
            timestamp: activity.timestamp,
            metaElement: itemEl.querySelector('.activity-meta')
        });

        // Remove oldest items if exceeding max
        if (activityItems.length > CONFIG.maxItems) {
            const removed = activityItems.pop();
            removed.element.classList.add('removing');
            setTimeout(() => {
                if (removed.element.parentNode) {
                    removed.element.parentNode.removeChild(removed.element);
                }
            }, 300);
        }

        // Remove new-item class after animation
        setTimeout(() => {
            itemEl.classList.remove('new-item');
        }, 500);
    }

    /**
     * Update all relative timestamps
     */
    function updateTimestamps() {
        const now = Date.now();

        activityItems.forEach(item => {
            const elapsed = now - item.timestamp;
            const timeText = formatTimeAgo(elapsed);

            // Update only the time portion of the meta text
            const metaText = item.metaElement.textContent;
            const newMetaText = metaText.replace(/(\d+\s+\w+\s+ago|just now)$/, timeText);
            item.metaElement.textContent = newMetaText;
        });
    }

    /**
     * Format milliseconds to relative time string
     */
    function formatTimeAgo(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 30) return 'just now';
        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    /**
     * Start automatic activity updates
     */
    function startActivityUpdates() {
        updateTimer = setInterval(() => {
            if (!isPaused) {
                const activity = generateActivity();
                addActivityItem(activity);
            }
        }, CONFIG.updateInterval);
    }

    /**
     * Start timestamp updates
     */
    function startTimestampUpdates() {
        timestampTimer = setInterval(() => {
            updateTimestamps();
        }, CONFIG.timestampUpdateInterval);
    }

    /**
     * Setup interaction listeners to pause updates
     */
    function setupInteractionListeners() {
        let pauseTimeout = null;

        const pauseUpdates = () => {
            isPaused = true;
            clearTimeout(pauseTimeout);

            // Resume after 30 seconds of no interaction
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, 30000);
        };

        // Listen for scroll on activity feed
        activityFeed.addEventListener('mouseenter', pauseUpdates);
        activityFeed.addEventListener('scroll', pauseUpdates);

        // Resume on mouse leave
        activityFeed.addEventListener('mouseleave', () => {
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, 5000);
        });
    }

    /**
     * Cleanup timers
     */
    function destroy() {
        if (updateTimer) clearInterval(updateTimer);
        if (timestampTimer) clearInterval(timestampTimer);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', destroy);

})();
