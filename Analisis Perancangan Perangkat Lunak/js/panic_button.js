/**
 * Panic Button Flow - Use Case Scenario #1
 * "Meminta Jadwal Konseling Darurat"
 * sesuai dengan SRS Use Case #1
 */

class PanicButtonFlow {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 5;
        this.counselorAvailable = true; // Simulasi
        this.initialize();
    }
    
    initialize() {
        console.log('Panic Button Flow Initialized');
        
        // Elements
        this.elements = {
            panicButton: document.getElementById('panicButton'),
            panicModal: document.getElementById('panicModal'),
            mobilePanic: document.getElementById('mobilePanic'),
            closeModalButtons: document.querySelectorAll('.close-modal'),
            confirmPanic: document.getElementById('confirmPanic'),
            cancelSearch: document.getElementById('cancelSearch'),
            startChat: document.getElementById('startChat'),
            goToChat: document.getElementById('goToChat'),
            requestCallback: document.getElementById('requestCallback'),
            emergencyHotline: document.getElementById('emergencyHotline'),
            viewResources: document.getElementById('viewResources'),
            steps: document.querySelectorAll('.panic-step'),
            stepButtons: document.querySelectorAll('.step-buttons')
        };
        
        // Event Listeners
        this.setupEventListeners();
        
        // Load from URL if emergency mode
        this.checkEmergencyMode();
    }
    
    setupEventListeners() {
        // Open panic modal
        if (this.elements.panicButton) {
            this.elements.panicButton.addEventListener('click', () => this.openPanicModal());
        }
        
        if (this.elements.mobilePanic) {
            this.elements.mobilePanic.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPanicModal();
            });
        }
        
        // Close modal
        this.elements.closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closePanicModal());
        });
        
        // Step 1: Confirm panic
        if (this.elements.confirmPanic) {
            this.elements.confirmPanic.addEventListener('click', () => this.nextStep());
        }
        
        // Step 2: Cancel search
        if (this.elements.cancelSearch) {
            this.elements.cancelSearch.addEventListener('click', () => this.closePanicModal());
        }
        
        // Step 3: Start chat
        if (this.elements.startChat) {
            this.elements.startChat.addEventListener('click', () => this.startCounselingChat());
        }
        
        // Step 5: Go to chat
        if (this.elements.goToChat) {
            this.elements.goToChat.addEventListener('click', () => this.redirectToChat());
        }
        
        // Fallback options
        if (this.elements.requestCallback) {
            this.elements.requestCallback.addEventListener('click', () => this.requestCallback());
        }
        
        if (this.elements.emergencyHotline) {
            this.elements.emergencyHotline.addEventListener('click', () => this.callEmergencyHotline());
        }
        
        if (this.elements.viewResources) {
            this.elements.viewResources.addEventListener('click', () => this.showResources());
        }
        
        // Close modal on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.panicModal.classList.contains('active')) {
                this.closePanicModal();
            }
        });
    }
    
    openPanicModal() {
        // Reset to step 1
        this.resetToStep(1);
        
        // Show modal
        this.elements.panicModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Log emergency request
        this.logEmergencyRequest();
        
        // Show notification
        this.showToast('Membuka mode darurat...', 'warning');
    }
    
    closePanicModal() {
        this.elements.panicModal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetToStep(1);
    }
    
    resetToStep(step) {
        this.currentStep = step;
        
        // Hide all steps
        this.elements.steps.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Hide all step buttons
        this.elements.stepButtons.forEach(b => {
            b.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${step}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.style.display = 'block';
        }
        
        // Show current step buttons
        const currentButtons = document.querySelector(`.step${step}-buttons`);
        if (currentButtons) {
            currentButtons.style.display = 'flex';
        }
    }
    
    nextStep() {
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            
            // Special handling for step 2
            if (this.currentStep === 2) {
                this.searchForCounselor();
                return;
            }
            
            // Special handling for step 4 (fallback)
            if (this.currentStep === 4) {
                // Check counselor availability
                if (!this.counselorAvailable) {
                    this.resetToStep(4);
                } else {
                    this.currentStep = 3; // Skip to counselor found
                }
                return;
            }
            
            this.resetToStep(this.currentStep);
        }
    }
    
    searchForCounselor() {
        this.resetToStep(2);
        
        // Simulate searching for counselor
        this.showToast('Mencari konselor yang tersedia...', 'info');
        
        // Simulate API call delay
        setTimeout(() => {
            // Check counselor availability
            if (this.counselorAvailable) {
                // Counselor found
                this.resetToStep(3);
                this.showToast('Konselor ditemukan!', 'success');
                
                // Log connection
                this.logCounselorConnection();
            } else {
                // No counselor available
                this.resetToStep(4);
                this.showToast('Tidak ada konselor yang tersedia', 'error');
            }
        }, 3000); // 3 second delay to simulate search
    }
    
    startCounselingChat() {
        // Create emergency chat session
        this.createEmergencyChat();
        
        // Move to step 5
        this.resetToStep(5);
        
        // Show success message
        this.showToast('Sesi darurat dibuat!', 'success');
        
        // Auto-redirect after 5 seconds
        setTimeout(() => {
            this.redirectToChat();
        }, 5000);
    }
    
    createEmergencyChat() {
        // In real app, this would call API to create emergency chat
        const emergencySession = {
            id: 'EMERG-' + Date.now(),
            type: 'emergency',
            counselor: {
                id: 'CSL-001',
                name: 'Budi Santoso',
                specialization: 'Crisis Intervention'
            },
            createdAt: new Date().toISOString(),
            priority: 'high'
        };
        
        // Save to localStorage for demo
        localStorage.setItem('emergency_session', JSON.stringify(emergencySession));
        
        console.log('Emergency chat created:', emergencySession);
    }
    
    redirectToChat() {
        // Redirect to chat with emergency parameters
        window.location.href = 'chat.html?emergency=true&session=EMERG';
    }
    
    requestCallback() {
        // Show callback form
        this.showCallbackForm();
    }
    
    callEmergencyHotline() {
        // Simulate calling emergency hotline
        if (confirm('Anda akan menghubungi hotline darurat 119. Lanjutkan?')) {
            // In real app, this would initiate phone call
            window.open('tel:119');
            
            this.showToast('Menghubungi hotline darurat...', 'info');
            this.closePanicModal();
        }
    }
    
    showResources() {
        // Show resources modal
        const resources = [
            { name: 'Layanan Psikologi Darurat', number: '119' },
            { name: 'RS Jiwa Terdekat', number: '112' },
            { name: 'Konseling Online 24/7', url: 'https://sehatjiwa.kemkes.go.id' }
        ];
        
        let resourcesHTML = '<h4>Sumber Bantuan Darurat:</h4><ul class="resources-list">';
        resources.forEach(res => {
            resourcesHTML += `<li>`;
            if (res.number) {
                resourcesHTML += `<strong>${res.name}:</strong> <a href="tel:${res.number}">${res.number}</a>`;
            } else {
                resourcesHTML += `<strong>${res.name}:</strong> <a href="${res.url}" target="_blank">${res.url}</a>`;
            }
            resourcesHTML += `</li>`;
        });
        resourcesHTML += '</ul>';
        
        this.showCustomModal('Sumber Bantuan Lain', resourcesHTML);
    }
    
    showCallbackForm() {
        const formHTML = `
            <div class="form-group">
                <label class="form-label">Nomor Telepon</label>
                <input type="tel" class="form-control" placeholder="08xxxxxxxxxx" id="callbackPhone">
            </div>
            <div class="form-group">
                <label class="form-label">Waktu yang diinginkan</label>
                <select class="form-control" id="callbackTime">
                    <option value="asap">Sesegera mungkin</option>
                    <option value="morning">Pagi (08:00-12:00)</option>
                    <option value="afternoon">Siang (13:00-17:00)</option>
                    <option value="evening">Malam (18:00-21:00)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Catatan (opsional)</label>
                <textarea class="form-control" id="callbackNotes" placeholder="Jelaskan sedikit tentang masalah Anda..."></textarea>
            </div>
        `;
        
        this.showCustomModal('Minta Dihubungi Kembali', formHTML, () => {
            const phone = document.getElementById('callbackPhone').value;
            const time = document.getElementById('callbackTime').value;
            const notes = document.getElementById('callbackNotes').value;
            
            if (!phone) {
                this.showToast('Harap isi nomor telepon', 'error');
                return false;
            }
            
            // Submit callback request
            this.submitCallbackRequest(phone, time, notes);
            return true;
        });
    }
    
    submitCallbackRequest(phone, time, notes) {
        // In real app, this would submit to API
        const callbackRequest = {
            phone: phone,
            preferredTime: time,
            notes: notes,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save to localStorage for demo
        localStorage.setItem('callback_request', JSON.stringify(callbackRequest));
        
        this.showToast('Permintaan callback berhasil dikirim!', 'success');
        this.closePanicModal();
    }
    
    showCustomModal(title, content, onSubmit = null) {
        const modalHTML = `
            <div class="modal-overlay active" id="customModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="btn-icon close-custom-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline close-custom-modal">Batal</button>
                        ${onSubmit ? `<button class="btn btn-primary" id="submitCustom">Kirim</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing custom modal
        const existingModal = document.getElementById('customModal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners
        document.querySelectorAll('.close-custom-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('customModal').remove();
            });
        });
        
        if (onSubmit) {
            document.getElementById('submitCustom').addEventListener('click', () => {
                if (onSubmit()) {
                    document.getElementById('customModal').remove();
                }
            });
        }
    }
    
    checkEmergencyMode() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('emergency') === 'true') {
            this.openPanicModal();
        }
    }
    
    logEmergencyRequest() {
        // In real app, this would log to analytics/backend
        const logEntry = {
            type: 'emergency_request',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            location: window.location.href
        };
        
        console.log('Emergency request logged:', logEntry);
    }
    
    logCounselorConnection() {
        const logEntry = {
            type: 'counselor_connected',
            timestamp: new Date().toISOString(),
            counselorId: 'CSL-001',
            counselorName: 'Budi Santoso'
        };
        
        console.log('Counselor connection logged:', logEntry);
    }
    
    showToast(message, type = 'info') {
        // Use existing toast function from app.js or create new
        if (window.SafeCampusApp && window.SafeCampusApp.showToast) {
            window.SafeCampusApp.showToast(message, type);
        } else {
            // Fallback toast
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <i class="fas fa-${this.getIconForType(type)}"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
    
    getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.panicButtonFlow = new PanicButtonFlow();
});