/**
 * Mach Five Magnet Demo JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Simulate live activity updates
    simulateLiveActivity();
});

/**
 * Simulate new activity items appearing in the feed
 */
function simulateLiveActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    if (!activityFeed) return;

    const activities = [
        {
            type: 'conversion',
            icon: 'check_circle',
            title: 'Flow completed',
            meta: 'Alex Martinez • Homepage Demo Scheduler → Booked • just now'
        },
        {
            type: 'new-lead',
            icon: 'forum',
            title: 'Conversation started',
            meta: 'Rachel Green • Blog Newsletter Capture • just now'
        },
        {
            type: 'conversion',
            icon: 'person_add',
            title: 'Lead captured',
            meta: 'Tom Anderson • Pricing Exit Intent → Email • just now'
        },
        {
            type: 'engagement',
            icon: 'close',
            title: 'Flow abandoned',
            meta: 'Nicole Brown • Product Finder • Step 3/6 • just now'
        }
    ];

    let activityIndex = 0;

    // Add new activity every 8 seconds
    setInterval(() => {
        const activity = activities[activityIndex % activities.length];

        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        newItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <span class="material-symbols-outlined">${activity.icon}</span>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-meta">${activity.meta}</div>
            </div>
        `;

        // Insert at the top
        activityFeed.insertBefore(newItem, activityFeed.firstChild);

        // Animate in
        setTimeout(() => {
            newItem.style.transition = 'all 0.3s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 10);

        // Remove oldest item if more than 6
        const items = activityFeed.querySelectorAll('.activity-item');
        if (items.length > 6) {
            const lastItem = items[items.length - 1];
            lastItem.style.opacity = '0';
            lastItem.style.transform = 'translateY(10px)';
            setTimeout(() => {
                lastItem.remove();
            }, 300);
        }

        activityIndex++;
    }, 8000); // Every 8 seconds
}
