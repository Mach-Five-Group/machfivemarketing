// Live Conversation Preview Modal
(function() {
    var currentFormat = 'chat-bubble';
    var conversationStep = 0;
    var conversationFlow = [
        { type: 'bot', text: 'Hi! 👋 Thanks for your interest.' },
        { type: 'bot', text: 'What brings you here today?' },
        { type: 'user', text: 'I want to schedule a demo' },
        { type: 'bot', text: 'Great choice! What is your name?' },
        { type: 'user', text: 'Sarah Johnson' },
        { type: 'bot', text: 'Nice to meet you, Sarah! What is your email?' },
        { type: 'user', text: 'sarah@example.com' },
        { type: 'bot', text: '✅ Perfect! You are all set. We will send you a calendar link shortly.' }
    ];
    document.addEventListener('DOMContentLoaded', function() {
        createPreviewModal();
        attachPreviewButtons();
    });
    function createPreviewModal() {
        var modal = document.createElement('div');
        modal.id = 'preview-modal';
        modal.className = 'preview-modal';
        modal.innerHTML = '<div class="preview-modal-overlay"></div><div class="preview-modal-content"><div class="preview-modal-header"><h3>Live Preview</h3><button class="preview-close"><span class="material-symbols-outlined">close</span></button></div><div class="preview-format-selector"><button class="format-tab active" data-format="chat-bubble"><span>💬</span> Chat Bubble</button><button class="format-tab" data-format="embedded"><span>📄</span> Embedded</button><button class="format-tab" data-format="popup"><span>⬜</span> Pop-up</button><button class="format-tab" data-format="slideout"><span>↔️</span> Slide-out</button></div><div class="preview-stage"><div class="preview-browser-mock"><div class="mock-browser-bar"><div class="mock-dots"><span></span><span></span><span></span></div><div class="mock-url">yourwebsite.com</div></div><div class="mock-browser-content" id="preview-container"></div></div></div><div class="preview-controls"><button class="btn-preview-restart"><span class="material-symbols-outlined">replay</span> Restart Conversation</button><button class="btn-preview-next">Continue <span class="material-symbols-outlined">arrow_forward</span></button></div></div>';
        document.body.appendChild(modal);
        modal.querySelector('.preview-close').addEventListener('click', closePreview);
        modal.querySelector('.preview-modal-overlay').addEventListener('click', closePreview);
        modal.querySelector('.btn-preview-restart').addEventListener('click', restartConversation);
        modal.querySelector('.btn-preview-next').addEventListener('click', nextStep);
        var tabs = modal.querySelectorAll('.format-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function() {
                switchFormat(this.dataset.format);
            });
        }
    }
    function attachPreviewButtons() {
        var previewBtns = document.querySelectorAll('.btn-secondary');
        for (var i = 0; i < previewBtns.length; i++) {
            var icon = previewBtns[i].querySelector('.material-symbols-outlined');
            if (icon && icon.textContent === 'visibility') {
                previewBtns[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    openPreview();
                });
            }
        }
    }
    function openPreview() {
        var modal = document.getElementById('preview-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        conversationStep = 0;
        renderPreview();
    }
    function closePreview() {
        var modal = document.getElementById('preview-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    function switchFormat(format) {
        currentFormat = format;
        var tabs = document.querySelectorAll('.format-tab');
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].dataset.format === format) {
                tabs[i].classList.add('active');
            } else {
                tabs[i].classList.remove('active');
            }
        }
        renderPreview();
    }
    function renderPreview() {
        var container = document.getElementById('preview-container');
        container.className = 'mock-browser-content format-' + currentFormat;
        var messages = conversationFlow.slice(0, conversationStep + 1);
        var messagesHTML = '';
        for (var i = 0; i < messages.length; i++) {
            messagesHTML += '<div class="preview-msg ' + messages[i].type + '"><div class="preview-msg-bubble">' + messages[i].text + '</div></div>';
        }
        var inputHTML = conversationStep < conversationFlow.length - 1 ? '<div class="preview-chat-input"><input type="text" placeholder="Type your message..." /><button class="preview-send-btn"><span class="material-symbols-outlined">send</span></button></div>' : '';
        var html = '';
        if (currentFormat === 'chat-bubble') {
            html = '<div class="preview-chat-widget"><div class="preview-chat-messages">' + messagesHTML + '</div>' + inputHTML + '</div><div class="preview-chat-icon"><span class="material-symbols-outlined">chat</span></div>';
        } else if (currentFormat === 'embedded') {
            html = '<div class="preview-embedded-widget"><div class="preview-chat-messages">' + messagesHTML + '</div>' + inputHTML + '</div>';
        } else if (currentFormat === 'popup') {
            container.classList.add('dimmed');
            html = '<div class="preview-popup-modal"><button class="preview-popup-close">×</button><div class="preview-chat-messages">' + messagesHTML + '</div>' + inputHTML + '</div>';
        } else if (currentFormat === 'slideout') {
            html = '<div class="preview-slideout-panel"><button class="preview-panel-close">×</button><div class="preview-chat-messages">' + messagesHTML + '</div>' + inputHTML + '</div>';
        }
        container.innerHTML = html;
        setTimeout(function() {
            var messagesContainer = container.querySelector('.preview-chat-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    }
    function nextStep() {
        if (conversationStep < conversationFlow.length - 1) {
            conversationStep++;
            renderPreview();
        }
    }
    function restartConversation() {
        conversationStep = 0;
        renderPreview();
    }
})();
