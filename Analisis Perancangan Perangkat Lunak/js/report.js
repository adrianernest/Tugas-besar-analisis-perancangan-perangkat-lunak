/**
 * Report Form - Use Case Scenario #2
 * "Laporkan Kasus Bullying"
 * sesuai dengan SRS Use Case #2
 */

class ReportForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.uploadedFiles = [];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mpeg'];
        this.initialize();
    }
    
    initialize() {
        console.log('Report Form Initialized');
        
        // Elements
        this.elements = {
            form: document.getElementById('bullyingReportForm'),
            steps: document.querySelectorAll('.form-step'),
            stepButtons: document.querySelectorAll('.step'),
            nextStep1: document.getElementById('nextStep1'),
            nextStep2: document.getElementById('nextStep2'),
            prevStep2: document.getElementById('prevStep2'),
            prevStep3: document.getElementById('prevStep3'),
            cancelReport: document.getElementById('cancelReport'),
            submitReport: document.getElementById('submitReport'),
            newReport: document.getElementById('newReport'),
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            fileList: document.getElementById('fileList'),
            reviewType: document.getElementById('reviewType'),
            reviewLocation: document.getElementById('reviewLocation'),
            reviewDateTime: document.getElementById('reviewDateTime'),
            reviewDescription: document.getElementById('reviewDescription'),
            reviewFiles: document.getElementById('reviewFiles'),
            reviewAnonymity: document.getElementById('reviewAnonymity'),
            emergencyChatBtn: document.getElementById('emergencyChatBtn'),
            mobilePanicBtn: document.getElementById('mobilePanicBtn')
        };
        
        // Event Listeners
        this.setupEventListeners();
        
        // Initialize file upload
        this.initFileUpload();
    }
    
    setupEventListeners() {
        // Navigation between steps
        if (this.elements.nextStep1) {
            this.elements.nextStep1.addEventListener('click', () => this.validateStep1());
        }
        
        if (this.elements.nextStep2) {
            this.elements.nextStep2.addEventListener('click', () => this.validateStep2());
        }
        
        if (this.elements.prevStep2) {
            this.elements.prevStep2.addEventListener('click', () => this.goToStep(1));
        }
        
        if (this.elements.prevStep3) {
            this.elements.prevStep3.addEventListener('click', () => this.goToStep(2));
        }
        
        // Cancel report
        if (this.elements.cancelReport) {
            this.elements.cancelReport.addEventListener('click', () => this.cancelReport());
        }
        
        // Submit report
        if (this.elements.submitReport) {
            this.elements.submitReport.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitReport();
            });
        }
        
        // New report
        if (this.elements.newReport) {
            this.elements.newReport.addEventListener('click', () => this.resetForm());
        }
        
        // Emergency buttons
        if (this.elements.emergencyChatBtn) {
            this.elements.emergencyChatBtn.addEventListener('click', () => this.openEmergencyChat());
        }
        
        if (this.elements.mobilePanicBtn) {
            this.elements.mobilePanicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openEmergencyChat();
            });
        }
        
        // Form submission
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (e) => e.preventDefault());
        }
    }
    
    initFileUpload() {
        if (!this.elements.uploadArea || !this.elements.fileInput) return;
        
        // Click on upload area triggers file input
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        // Drag and drop
        this.elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.uploadArea.style.borderColor = 'var(--muted-teal)';
            this.elements.uploadArea.style.backgroundColor = 'rgba(128, 203, 196, 0.1)';
        });
        
        this.elements.uploadArea.addEventListener('dragleave', () => {
            this.elements.uploadArea.style.borderColor = 'var(--soft-teal)';
            this.elements.uploadArea.style.backgroundColor = 'var(--white)';
        });
        
        this.elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.uploadArea.style.borderColor = 'var(--soft-teal)';
            this.elements.uploadArea.style.backgroundColor = 'var(--white)';
            
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
        
        // File input change
        this.elements.fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            this.handleFiles(files);
        });
    }
    
    handleFiles(files) {
        for (let file of files) {
            // Validate file
            if (!this.validateFile(file)) continue;
            
            // Add to uploaded files
            this.uploadedFiles.push({
                file: file,
                id: Date.now() + Math.random(),
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type
            });
        }
        
        // Update file list display
        this.updateFileList();
    }
    
    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showToast(`File ${file.name} terlalu besar (maks 10MB)`, 'error');
            return false;
        }
        
        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            this.showToast(`Tipe file ${file.name} tidak didukung`, 'error');
            return false;
        }
        
        // Check for personal information in filename
        const personalInfoPatterns = [/nama/, /nik/, /nim/, /ktp/, /alamat/, /telp/];
        const filename = file.name.toLowerCase();
        
        for (let pattern of personalInfoPatterns) {
            if (pattern.test(filename)) {
                this.showToast('Nama file sebaiknya tidak mengandung informasi pribadi', 'warning');
                break;
            }
        }
        
        return true;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    updateFileList() {
        if (!this.elements.fileList) return;
        
        if (this.uploadedFiles.length === 0) {
            this.elements.fileList.innerHTML = '<p class="no-files">Belum ada file yang diunggah</p>';
            return;
        }
        
        let html = '';
        this.uploadedFiles.forEach((file, index) => {
            const icon = this.getFileIcon(file.type);
            html += `
                <div class="file-item" data-id="${file.id}">
                    <div class="file-info">
                        <i class="fas fa-${icon} file-icon"></i>
                        <div class="file-details">
                            <h5>${file.name}</h5>
                            <small>${file.size} • ${file.type.split('/')[1]?.toUpperCase() || 'File'}</small>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button type="button" class="remove-file" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        this.elements.fileList.innerHTML = html;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove-file').dataset.index);
                this.removeFile(index);
            });
        });
    }
    
    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'file-image';
        if (fileType.startsWith('video/')) return 'file-video';
        if (fileType.startsWith('audio/')) return 'file-audio';
        if (fileType === 'application/pdf') return 'file-pdf';
        return 'file';
    }
    
    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateFileList();
        this.showToast('File dihapus', 'info');
    }
    
    validateStep1() {
        // Check required fields
        const form = this.elements.form;
        const required = form.querySelectorAll('[required]');
        let isValid = true;
        
        for (let field of required) {
            if (!field.value.trim()) {
                isValid = false;
                this.highlightError(field);
            } else {
                this.removeHighlight(field);
            }
        }
        
        // Check at least one bullying type selected
        const bullyingType = form.querySelector('input[name="bullyingType"]:checked');
        if (!bullyingType) {
            isValid = false;
            this.showToast('Pilih jenis bullying', 'error');
        }
        
        if (isValid) {
            this.goToStep(2);
        } else {
            this.showToast('Harap isi semua field yang wajib', 'error');
        }
    }
    
    validateStep2() {
        // No validation needed for step 2 (evidence is optional)
        this.updateReview();
        this.goToStep(3);
    }
    
    updateReview() {
        const form = this.elements.form;
        
        // Bullying type
        const bullyingType = form.querySelector('input[name="bullyingType"]:checked');
        if (bullyingType) {
            const typeLabels = {
                verbal: 'Verbal Bullying',
                physical: 'Fisik Bullying',
                cyber: 'Cyberbullying',
                social: 'Social Bullying'
            };
            this.elements.reviewType.textContent = typeLabels[bullyingType.value] || bullyingType.value;
        }
        
        // Location
        const building = form.querySelector('select[name="building"]').value;
        const room = form.querySelector('input[name="room"]').value;
        this.elements.reviewLocation.textContent = `${this.getBuildingName(building)} • ${room}`;
        
        // Date & Time
        const date = form.querySelector('input[name="incidentDate"]').value;
        const time = form.querySelector('input[name="incidentTime"]').value;
        if (date && time) {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            this.elements.reviewDateTime.textContent = `${formattedDate}, ${time}`;
        }
        
        // Description
        const description = form.querySelector('textarea[name="description"]').value;
        this.elements.reviewDescription.textContent = description || '-';
        
        // Files
        this.elements.reviewFiles.textContent = `${this.uploadedFiles.length} file`;
        
        // Anonymity
        const anonymity = form.querySelector('input[name="anonymity"]:checked');
        if (anonymity) {
            this.elements.reviewAnonymity.textContent = 
                anonymity.value === 'anonymous' ? 'Anonim' : 'Identitas Diketahui';
        }
    }
    
    getBuildingName(code) {
        const buildings = {
            fti: 'Fakultas Teknologi Informasi',
            feb: 'Fakultas Ekonomi dan Bisnis',
            ft: 'Fakultas Teknik',
            other: 'Lainnya'
        };
        return buildings[code] || code;
    }
    
    goToStep(step) {
        // Update steps indicator
        document.querySelectorAll('.step').forEach((s, index) => {
            s.classList.remove('active', 'completed');
            if (index + 1 < step) {
                s.classList.add('completed');
            } else if (index + 1 === step) {
                s.classList.add('active');
            }
        });
        
        // Hide all steps
        this.elements.steps.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        // Show current step
        const currentStep = document.getElementById(`step${step}`);
        if (currentStep) {
            currentStep.classList.add('active');
            currentStep.style.display = 'block';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.currentStep = step;
    }
    
    submitReport() {
        // Check confirmation checkboxes
        const confirmAccuracy = document.getElementById('confirmAccuracy');
        const confirmPrivacy = document.getElementById('confirmPrivacy');
        
        if (!confirmAccuracy.checked || !confirmPrivacy.checked) {
            this.showToast('Harap centang semua konfirmasi', 'error');
            return;
        }
        
        // Collect form data
        const formData = this.collectFormData();
        
        // Show loading
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Generate report number
            const reportNumber = `#RPT-${String(Date.now()).slice(-6)}`;
            document.getElementById('reportNumber').textContent = reportNumber;
            
            // Save to localStorage for demo
            this.saveReport(formData, reportNumber);
            
            // Move to success step
            this.goToStep(4);
            
            // Hide loading
            this.hideLoading();
            
            // Show success message
            this.showToast('Laporan berhasil dikirim!', 'success');
            
            // Log analytics
            this.logReportSubmission(formData);
        }, 2000);
    }
    
    collectFormData() {
        const form = this.elements.form;
        const formData = {
            id: `RPT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            bullyingType: form.querySelector('input[name="bullyingType"]:checked')?.value,
            building: form.querySelector('select[name="building"]').value,
            room: form.querySelector('input[name="room"]').value,
            incidentDate: form.querySelector('input[name="incidentDate"]').value,
            incidentTime: form.querySelector('input[name="incidentTime"]').value,
            description: form.querySelector('textarea[name="description"]').value,
            impacts: Array.from(form.querySelectorAll('input[name="impact[]"]:checked')).map(cb => cb.value),
            anonymity: form.querySelector('input[name="anonymity"]:checked')?.value,
            files: this.uploadedFiles.length,
            status: 'pending',
            userId: 'current-user-id' // In real app, get from auth
        };
        
        return formData;
    }
    
    saveReport(formData, reportNumber) {
        // In real app, this would submit to API
        const report = {
            ...formData,
            reportNumber: reportNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage for demo
        let reports = JSON.parse(localStorage.getItem('safeCampusReports') || '[]');
        reports.unshift(report);
        localStorage.setItem('safeCampusReports', JSON.stringify(reports));
        
        console.log('Report saved:', report);
    }
    
    logReportSubmission(formData) {
        // Analytics/logging
        const logEntry = {
            event: 'report_submitted',
            timestamp: new Date().toISOString(),
            reportType: formData.bullyingType,
            anonymity: formData.anonymity,
            filesCount: formData.files
        };
        
        console.log('Report submission logged:', logEntry);
    }
    
    cancelReport() {
        if (confirm('Apakah Anda yakin ingin membatalkan laporan? Semua data yang sudah diisi akan hilang.')) {
            this.resetForm();
            window.history.back();
        }
    }
    
    resetForm() {
        // Reset form
        this.elements.form.reset();
        this.uploadedFiles = [];
        this.updateFileList();
        
        // Reset to step 1
        this.goToStep(1);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.showToast('Form telah direset', 'info');
    }
    
    openEmergencyChat() {
        // Open panic button modal
        if (window.panicButtonFlow) {
            window.panicButtonFlow.openPanicModal();
        } else {
            // Fallback
            window.location.href = 'chat.html?emergency=true';
        }
    }
    
    highlightError(element) {
        element.style.borderColor = 'var(--error)';
        element.style.boxShadow = '0 0 0 3px rgba(239, 83, 80, 0.2)';
    }
    
    removeHighlight(element) {
        element.style.borderColor = '';
        element.style.boxShadow = '';
    }
    
    showLoading() {
        const submitBtn = this.elements.submitReport;
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        // Store original content for later restoration
        submitBtn.dataset.originalHTML = originalHTML;
    }
    
    hideLoading() {
        const submitBtn = this.elements.submitReport;
        if (submitBtn.dataset.originalHTML) {
            submitBtn.innerHTML = submitBtn.dataset.originalHTML;
        }
        submitBtn.disabled = false;
    }
    
    showToast(message, type = 'info') {
        if (window.SafeCampusApp && window.SafeCampusApp.showToast) {
            window.SafeCampusApp.showToast(message, type);
        } else {
            // Fallback
            alert(message);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reportForm = new ReportForm();
});