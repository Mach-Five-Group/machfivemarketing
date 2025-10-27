/**
 * Mach Five Magnet Demo - Analytics Charts
 * Visualizes dashboard metrics using Chart.js
 */

(function() {
    'use strict';

    // Brand colors from demo CSS
    const COLORS = {
        brand: '#3498DB',
        brandDark: '#2980B9',
        orange: '#FF6B35',
        green: '#27AE60',
        red: '#E74C3C',
        yellow: '#F39C12',
        purple: '#9B59B6',
        textLight: '#666',
        border: '#E0E0E0'
    };

    let trendChart = null;
    let currentPeriod = 7;

    /**
     * Initialize all charts
     */
    function init() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        // Set Chart.js defaults
        Chart.defaults.font.family = "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif";
        Chart.defaults.color = COLORS.textLight;
        Chart.defaults.plugins.legend.display = true;
        Chart.defaults.plugins.legend.position = 'bottom';

        // Initialize all charts
        initTrendChart();
        initFunnelChart();
        initSourceChart();
        initMagnetChart();

        // Setup period toggle buttons
        setupPeriodToggle();
    }

    /**
     * Line chart showing conversation trends over time
     */
    function initTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const data = getTrendData(7);

        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Conversations Started',
                        data: data.started,
                        borderColor: COLORS.brand,
                        backgroundColor: COLORS.brand + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Conversations Completed',
                        data: data.completed,
                        borderColor: COLORS.green,
                        backgroundColor: COLORS.green + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: COLORS.border
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Bar chart showing flow completion funnel
     */
    function initFunnelChart() {
        const ctx = document.getElementById('funnelChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Started', 'Step 2', 'Step 3', 'Step 4', 'Completed'],
                datasets: [{
                    label: 'Users',
                    data: [1000, 850, 720, 540, 342],
                    backgroundColor: [
                        COLORS.brand,
                        COLORS.brand + 'CC',
                        COLORS.brand + '99',
                        COLORS.brand + '66',
                        COLORS.green
                    ],
                    borderRadius: 6,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.x;
                                const percentage = ((value / 1000) * 100).toFixed(1);
                                return value + ' users (' + percentage + '%)';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: COLORS.border
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Pie/Doughnut chart showing traffic sources
     */
    function initSourceChart() {
        const ctx = document.getElementById('sourceChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Organic Search', 'Direct', 'Social Media', 'Referral', 'Email'],
                datasets: [{
                    data: [42, 28, 15, 10, 5],
                    backgroundColor: [
                        COLORS.brand,
                        COLORS.orange,
                        COLORS.purple,
                        COLORS.green,
                        COLORS.yellow
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 12,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return label + ': ' + value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Horizontal bar chart comparing magnet performance
     */
    function initMagnetChart() {
        const ctx = document.getElementById('magnetChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Homepage Demo',
                    'Blog Newsletter',
                    'Pricing Exit',
                    'Product Quiz'
                ],
                datasets: [
                    {
                        label: 'Interactions',
                        data: [8124, 6678, 1649, 8270],
                        backgroundColor: COLORS.brand + '80',
                        borderRadius: 6
                    },
                    {
                        label: 'Completed',
                        data: [342, 187, 94, 521],
                        backgroundColor: COLORS.green + '80',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: COLORS.border
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Setup period toggle buttons (7 days / 30 days)
     */
    function setupPeriodToggle() {
        const buttons = document.querySelectorAll('.chart-period-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const period = parseInt(this.dataset.period);
                if (period === currentPeriod) return;

                // Update button states
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Update chart
                currentPeriod = period;
                updateTrendChart(period);
            });
        });
    }

    /**
     * Update trend chart with new period data
     */
    function updateTrendChart(period) {
        if (!trendChart) return;

        const data = getTrendData(period);

        trendChart.data.labels = data.labels;
        trendChart.data.datasets[0].data = data.started;
        trendChart.data.datasets[1].data = data.completed;

        trendChart.update('active');
    }

    /**
     * Generate trend data for given period
     */
    function getTrendData(days) {
        const labels = [];
        const started = [];
        const completed = [];

        if (days === 7) {
            // Last 7 days
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date().getDay();

            for (let i = 6; i >= 0; i--) {
                const dayIndex = (today - i + 7) % 7;
                labels.push(dayNames[dayIndex]);
            }

            // Demo data for 7 days
            started.push(32, 45, 52, 48, 61, 55, 49);
            completed.push(22, 31, 35, 33, 42, 37, 32);

        } else {
            // Last 30 days (show every 5 days)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = new Date();

            for (let i = 30; i >= 0; i -= 5) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                labels.push(months[date.getMonth()] + ' ' + date.getDate());
            }

            // Demo data for 30 days (7 points)
            started.push(42, 48, 55, 51, 58, 62, 56);
            completed.push(28, 33, 38, 35, 40, 42, 38);
        }

        return { labels, started, completed };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
