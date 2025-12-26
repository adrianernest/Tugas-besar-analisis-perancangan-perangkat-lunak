/**
 * Chat Application - Use Case Scenario #3
 * "Chat dengan Konselor"
 * sesuai dengan SRS Use Case #3
 */

class SafeCampusChat {
    constructor() {
        this.currentCounselor = null;
        this.messages = [];
        this.isTyping = false;
        this.socket = null;
        this.currentSessionId = null;
        this.initialize();
    }
    
    initialize() {
        console.log('SafeCampus Chat Initialized');
        
        // Load counselors and setup
        this.loadCounselors();
        this.setupEventListeners();
        this.checkUrlParams();
        
        // Initialize WebSocket connection
        this.initWebSocket();
        
        // Load chat history if any
        this.loadChatHistory();
    }
    
    loadCounselors() {
        // Mock data for counselors
        const counselors = [
            {
                id: 'csl-001',
                name: 'Budi Santoso',
                avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=80CBC4&color=fff',
                specialization: 'Anxiety & Stress Management',
                status: 'online',
                availability: 'available',
                experience: '5 tahun',
                languages: ['Bahasa Indonesia', 'English'],
                bio: 'Spesialis dalam menangani kasus kecemasan dan stres di lingkungan kampus. Pendekatan yang ramah dan empatik.',
                rating: 4.8,
                responseTime: '5 menit'
            },
            {
                id: 'csl-002',
                name: 'Sari Wijaya',
                avatar: 'https://ui-avatars.com/api/?name=Sari+Wijaya&background=FF7043&color=fff',
                specialization: 'Bullying Recovery',
                status: 'online',
                availability: 'busy',
                experience: '7 tahun',
                languages: ['Bahasa Indonesia'],
                bio: 'Berpengalaman dalam menangani korban bullying dan pemulihan trauma. Fokus pada rebuilding self-esteem.',
                rating: 4.9,
                responseTime: '10 menit'
            },
            {
                id: 'csl-003',
                name: 'Adi Pratama',
                avatar: 'https://ui-avatars.com/api/?name=Adi+Pratama&background=546E7A&color=fff',
                specialization: 'Family & Relationship Issues',
                status: 'offline',
                availability: 'offline',
                experience: '8 tahun',
                languages: ['Bahasa Indonesia', 'Javanese'],
                bio: 'Ahli dalam masalah keluarga dan hubungan interpersonal. Pendekatan holistic untuk kesejahteraan mental.',
                rating: 4.7,
                responseTime: '2-3 jam'
            }
        ];
        
        // Render counselor list
        const container = document.getElementById('counselorList');
        if (!container) return;
        
        container.innerHTML = counselors.map(counselor => `
            <div class="counselor-item" data-id="${counselor.id}">
                <div class="counselor-avatar">
                    <img src="${counselor.avatar}" alt="${counselor.name}">
                    <span class="online-status ${counselor.status}"></span>
                </div>
                <div class="counselor-info">
                    <h4>${counselor.name}</h4>
                    <p class="counselor-specialization">${counselor.specialization}</p>
                    <p class="counselor-status ${counselor.availability}">
                        <i class="fas fa-circle"></i>
                        ${this.getStatusText(counselor.status, counselor.availability)}
                    </p>
                </div>
                <span class="unread-badge" style="display: none;">2</span>
            </div>
        `).join('');
        
        // Add click event to counselor items
        document.querySelectorAll('.counselor-item').forEach(item => {
            item.addEventListener('click', () => {
                const counselorId = item.dataset.id;
                const counselor = counselors.find(c => c.id === counselorId);
                if (counselor) {
                    this.selectCounselor(counselor);
                }
            });
        });
    }
    
    getStatusText(status, availability) {
        if (status === 'offline') return 'Offline';
        if (availability === 'busy') return 'Sibuk';
        return 'Tersedia';
    }
    
    selectCounselor(counselor) {
        this.currentCounselor = counselor;
        
        // Update UI
        this.updateChatHeader(counselor);
        
        // Remove active class from all
        document.querySelectorAll('.counselor-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected
        const selectedItem = document.querySelector(`.counselor-item[data-id="${counselor.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        // Clear messages container
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            messagesContainer.classList.remove('empty');
        }
        
        // Hide empty state
        document.querySelector('.empty-chat-state')?.remove();
        
        // Enable message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        if (messageInput && sendBtn) {
            messageInput.disabled = false;
            messageInput.placeholder = `Ketik pesan untuk ${counselor.name}...`;
            sendBtn.disabled = false;
        }
        
        // Update connection time
        this.updateConnectionTime();
        
        // Load messages for this counselor
        this.loadMessages(counselor.id);
        
        // Show notification
        this.showToast(`Terhubung dengan ${counselor.name}`, 'success');
        
        // Start session
        this.startChatSession(counselor.id);
    }
    
    updateChatHeader(counselor) {
        const header = document.getElementById('chatHeader');
        if (!header) return;
        
        // Update elements
        const avatar = document.getElementById('partnerAvatar');
        const name = document.getElementById('partnerName');
        const status = document.getElementById('partnerStatus');
        const onlineStatus = document.getElementById('onlineStatus');
        
        if (avatar) avatar.src = counselor.avatar;
        if (name) name.textContent = counselor.name;
        if (status) {
            status.textContent = counselor.status === 'online' 
                ? (counselor.availability === 'busy' ? '🟡 Sibuk' : '🟢 Online')
                : '⚪ Offline';
        }
        if (onlineStatus) {
            onlineStatus.className = 'online-status';
            onlineStatus.classList.add(counselor.status);
        }
    }
    
    updateConnectionTime() {
        const connectionTime = document.getElementById('connectionTime');
        if (connectionTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const dateString = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            connectionTime.textContent = `${dateString}, ${timeString}`;
        }
    }
    
    loadMessages(counselorId) {
        // Mock messages for demo
        const mockMessages = [
            {
                id: 'msg-1',
                sender: 'counselor',
                text: 'Halo, saya konselor yang akan membantu Anda. Ada yang bisa saya bantu?',
                timestamp: '10:15',
                read: true
            },
            {
                id: 'msg-2',
                sender: 'user',
                text: 'Saya merasa sangat tertekan dengan lingkungan kampus akhir-akhir ini.',
                timestamp: '10:16',
                read: true
            },
            {
                id: 'msg-3',
                sender: 'counselor',
                text: 'Saya mengerti. Bisa ceritakan lebih detail apa yang membuat Anda merasa tertekan?',
                timestamp: '10:17',
                read: true
            }
        ];
        
        this.messages = mockMessages;
        this.renderMessages();
    }
    
    renderMessages() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Add messages
        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            container.appendChild(messageElement);
        });
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    createMessageElement(message) {
        const isUser = message.sender === 'user';
        const isSystem = message.sender === 'system';
        
        if (isSystem) {
            return this.createSystemMessage(message);
        }
        
        const messageRow = document.createElement('div');
        messageRow.className = `message-row ${isUser ? 'user' : 'counselor'}`;
        
        if (!isUser && this.currentCounselor) {
            messageRow.innerHTML = `
                <div class="message-avatar">
                    <img src="${this.currentCounselor.avatar}" alt="${this.currentCounselor.name}">
                </div>
            `;
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isUser ? 'user' : 'counselor'}`;
        
        bubble.innerHTML = `
            <div class="message-text">${this.escapeHtml(message.text)}</div>
            <div class="message-info">
                <span class="message-time">${message.timestamp}</span>
                ${isUser ? `<span class="message-status">${message.read ? '✓✓' : '✓'}</span>` : ''}
            </div>
        `;
        
        messageContent.appendChild(bubble);
        messageRow.appendChild(messageContent);
        
        return messageRow;
    }
    
    createSystemMessage(message) {
        const div = document.createElement('div');
        div.className = 'message-row system';
        div.innerHTML = `
            <div class="message-content">
                <div class="message-bubble system">
                    <div class="message-text">${this.escapeHtml(message.text)}</div>
                    <div class="message-info">
                        <span class="message-time">${message.timestamp}</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    }
    
    setupEventListeners() {
        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        
        if (messageInput && sendBtn) {
            messageInput.addEventListener('input', () => {
                sendBtn.disabled = !messageInput.value.trim();
                this.autoResizeTextarea(messageInput);
            });
            
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (messageInput.value.trim()) {
                        this.sendMessage();
                    }
                }
            });
            
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Counselor info button
        const infoBtn = document.getElementById('counselorInfoBtn');
        if (infoBtn) {
            infoBtn.addEventListener('click', () => this.showCounselorInfo());
        }
        
        // Schedule button
        const scheduleBtn = document.getElementById('scheduleBtn');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => this.showScheduleModal());
        }
        
        // Create report button
        const reportBtn = document.getElementById('createReportBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                window.location.href = 'report.html';
            });
        }
        
        // End session button
        const endSessionBtn = document.getElementById('endSessionBtn');
        if (endSessionBtn) {
            endSessionBtn.addEventListener('click', () => this.endChatSession());
        }
        
        // Emergency button
        const emergencyBtn = document.getElementById('mobileEmergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openEmergencyChat();
            });
        }
        
        // Search counselor
        const searchInput = document.getElementById('searchCounselor');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCounselors(e.target.value);
            });
        }
    }
    
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || !this.currentCounselor) return;
        
        // Create message object
        const message = {
            id: 'msg-' + Date.now(),
            sender: 'user',
            text: text,
            timestamp: this.getCurrentTime(),
            read: false
        };
        
        // Add to messages array
        this.messages.push(message);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Disable send button
        const sendBtn = document.getElementById('sendMessageBtn');
        if (sendBtn) sendBtn.disabled = true;
        
        // Render new message
        this.renderMessages();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Send via WebSocket
        this.sendViaWebSocket(message);
        
        // Simulate counselor response
        setTimeout(() => {
            this.receiveCounselorResponse();
        }, 2000);
    }
    
    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        const typingName = document.getElementById('typingName');
        
        if (typingIndicator && typingName && this.currentCounselor) {
            typingName.textContent = this.currentCounselor.name;
            typingIndicator.classList.add('active');
            this.isTyping = true;
        }
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
            this.isTyping = false;
        }
    }
    
    receiveCounselorResponse() {
        this.hideTypingIndicator();
        
        if (!this.currentCounselor) return;
        
        // Mock responses
        const responses = [
            "Saya memahami perasaan Anda. Mari kita eksplorasi lebih dalam.",
            "Terima kasih sudah berbagi. Itu adalah langkah yang berani.",
            "Bisakah Anda ceritakan lebih detail tentang situasi tersebut?",
            "Bagaimana perasaan Anda tentang hal itu sekarang?",
            "Apa yang menurut Anda bisa membantu situasi ini?",
            "Saya di sini untuk mendengarkan dan mendukung Anda."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const response = {
            id: 'msg-' + Date.now(),
            sender: 'counselor',
            text: randomResponse,
            timestamp: this.getCurrentTime(),
            read: true
        };
        
        this.messages.push(response);
        this.renderMessages();
        
        // Play notification sound
        this.playNotificationSound();
    }
    
    showCounselorInfo() {
        if (!this.currentCounselor) {
            this.showToast('Pilih konselor terlebih dahulu', 'warning');
            return;
        }
        
        const modal = document.getElementById('counselorInfoModal');
        const profileContainer = document.getElementById('counselorProfile');
        
        if (!modal || !profileContainer) return;
        
        const counselor = this.currentCounselor;
        
        profileContainer.innerHTML = `
            <div class="profile-header">
                <img src="${counselor.avatar}" alt="${counselor.name}" class="profile-avatar">
                <h3 class="profile-name">${counselor.name}</h3>
                <p class="profile-title">${counselor.specialization}</p>
                <span class="badge ${counselor.status === 'online' ? 'badge-success' : 'badge-info'}">
                    ${counselor.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                </span>
            </div>
            
            <div class="profile-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <div class="detail-label">Waktu Respon</div>
                        <div class="detail-value">${counselor.responseTime}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-star"></i>
                    <div>
                        <div class="detail-label">Rating</div>
                        <div class="detail-value">${counselor.rating}/5.0</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-briefcase"></i>
                    <div>
                        <div class="detail-label">Pengalaman</div>
                        <div class="detail-value">${counselor.experience}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-language"></i>
                    <div>
                        <div class="detail-label">Bahasa</div>
                        <div class="detail-value">${counselor.languages.join(', ')}</div>
                    </div>
                </div>
            </div>
            
            <div class="profile-bio">
                <h4><i class="fas fa-user"></i> Tentang Konselor</h4>
                <p>${counselor.bio}</p>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close modal buttons
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Start chat button
        const startChatBtn = document.getElementById('startChatWithCounselor');
        if (startChatBtn) {
            startChatBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                // Already chatting with this counselor
            });
        }
    }
    
    showScheduleModal() {
        if (!this.currentCounselor) {
            this.showToast('Pilih konselor terlebih dahulu', 'warning');
            return;
        }
        
        const modal = document.getElementById('scheduleModal');
        const modalBody = modal.querySelector('.modal-body');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = `
            <div class="form-group">
                <label class="form-label">Pilih Tanggal</label>
                <input type="date" class="form-control" id="scheduleDate" min="${this.getTomorrowDate()}">
            </div>
            <div class="form-group">
                <label class="form-label">Pilih Waktu</label>
                <select class="form-control" id="scheduleTime">
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipe Sesi</label>
                <select class="form-control" id="sessionType">
                    <option value="online">Online (Video Call)</option>
                    <option value="phone">Telepon</option>
                    <option value="in-person">Tatap Muka</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Catatan (Opsional)</label>
                <textarea class="form-control" id="scheduleNotes" rows="3" placeholder="Jelaskan topik yang ingin didiskusikan..."></textarea>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-outline close-modal">Batal</button>
                <button class="btn btn-primary" id="submitSchedule">Kirim Permintaan</button>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close modal
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Submit schedule
        const submitBtn = document.getElementById('submitSchedule');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const date = document.getElementById('scheduleDate').value;
                const time = document.getElementById('scheduleTime').value;
                const type = document.getElementById('sessionType').value;
                const notes = document.getElementById('scheduleNotes').value;
                
                if (!date) {
                    this.showToast('Harap pilih tanggal', 'error');
                    return;
                }
                
                this.submitScheduleRequest(date, time, type, notes);
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    submitScheduleRequest(date, time, type, notes) {
        const request = {
            counselorId: this.currentCounselor.id,
            counselorName: this.currentCounselor.name,
            date: date,
            time: time,
            type: type,
            notes: notes,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage for demo
        let schedules = JSON.parse(localStorage.getItem('counselingSchedules') || '[]');
        schedules.push(request);
        localStorage.setItem('counselingSchedules', JSON.stringify(schedules));
        
        this.showToast('Permintaan jadwal berhasil dikirim!', 'success');
        console.log('Schedule requested:', request);
    }
    
    endChatSession() {
        if (!this.currentCounselor) return;
        
        if (confirm('Apakah Anda yakin ingin mengakhiri sesi chat ini?')) {
            // Save chat history
            this.saveChatHistory();
            
            // Reset chat
            this.currentCounselor = null;
            this.messages = [];
            
            // Reset UI
            this.resetChatUI();
            
            // Show notification
            this.showToast('Sesi chat telah diakhiri', 'info');
        }
    }
    
    resetChatUI() {
        // Update header
        const name = document.getElementById('partnerName');
        const status = document.getElementById('partnerStatus');
        const avatar = document.getElementById('partnerAvatar');
        
        if (name) name.textContent = 'Pilih Konselor';
        if (status) status.textContent = 'Pilih konselor untuk memulai chat';
        if (avatar) avatar.src = 'https://ui-avatars.com/api/?name=Konselor&background=80CBC4&color=fff';
        
        // Clear messages
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="empty-chat-state">
                    <i class="fas fa-comments"></i>
                    <h3>Mulai Percakapan</h3>
                    <p>Pilih konselor dari daftar di sebelah kiri untuk memulai chat</p>
                    <div class="empty-chat-tips">
                        <p><i class="fas fa-lightbulb"></i> Tips chat yang efektif:</p>
                        <ul>
                            <li>Jelaskan masalah dengan jelas dan detail</li>
                            <li>Sebutkan apa yang Anda rasakan</li>
                            <li>Jangan ragu bertanya jika tidak mengerti</li>
                            <li>Konselor di sini untuk membantu, bukan menghakimi</li>
                        </ul>
                    </div>
                </div>
            `;
        }
        
        // Disable message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        if (messageInput && sendBtn) {
            messageInput.disabled = true;
            messageInput.placeholder = 'Pilih konselor terlebih dahulu';
            sendBtn.disabled = true;
        }
        
        // Remove active class from counselor items
        document.querySelectorAll('.counselor-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    openEmergencyChat() {
        // Redirect to home with emergency parameter
        window.location.href = 'index.html?emergency=true';
    }
    
    filterCounselors(searchTerm) {
        const items = document.querySelectorAll('.counselor-item');
        const term = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const specialization = item.querySelector('.counselor-specialization').textContent.toLowerCase();
            
            if (name.includes(term) || specialization.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    startChatSession(counselorId) {
        this.currentSessionId = `session-${counselorId}-${Date.now()}`;
        
        // Log session start
        console.log('Chat session started:', this.currentSessionId);
        
        // In real app, this would call API to create session
    }
    
    saveChatHistory() {
        if (!this.currentCounselor || this.messages.length === 0) return;
        
        const chatHistory = {
            sessionId: this.currentSessionId,
            counselorId: this.currentCounselor.id,
            counselorName: this.currentCounselor.name,
            messages: this.messages,
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString()
        };
        
        // Save to localStorage for demo
        let histories = JSON.parse(localStorage.getItem('chatHistories') || '[]');
        histories.push(chatHistory);
        localStorage.setItem('chatHistories', JSON.stringify(histories));
        
        console.log('Chat history saved:', chatHistory);
    }
    
    loadChatHistory() {
        // Load from localStorage for demo
        const histories = JSON.parse(localStorage.getItem('chatHistories') || '[]');
        console.log('Loaded chat histories:', histories);
    }
    
    initWebSocket() {
        // In real app, this would connect to WebSocket server
        console.log('WebSocket initialized (simulated)');
        
        // Simulate incoming messages
        setInterval(() => {
            if (this.currentCounselor && Math.random() > 0.8) {
                this.receiveCounselorResponse();
            }
        }, 30000); // Every 30 seconds
    }
    
    sendViaWebSocket(message) {
        // In real app, this would send via WebSocket
        console.log('Message sent via WebSocket:', message);
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const emergency = urlParams.get('emergency');
        
        if (emergency === 'true') {
            // Auto-select first available counselor
            const firstCounselorItem = document.querySelector('.counselor-item');
            if (firstCounselorItem) {
                firstCounselorItem.click();
            }
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
    
    playNotificationSound() {
        // Play notification sound if enabled
        try {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            console.log('Audio play failed:', e);
        }
    }
    
    showToast(message, type = 'info') {
        if (window.SafeCampusApp && window.SafeCampusApp.showToast) {
            window.SafeCampusApp.showToast(message, type);
        } else {
            // Fallback
            console.log(`${type}: ${message}`);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new SafeCampusChat();
});