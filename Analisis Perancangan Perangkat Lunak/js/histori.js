/**
 * History Page with Advanced Filters
 * sesuai dengan SRS requirements untuk tracking dan monitoring
 */

class SafeCampusHistory {
    constructor() {
        this.currentTab = 'reports';
        this.currentFilters = {
            timeRange: 'all',
            status: ['completed', 'processing'],
            type: ['verbal', 'physical', 'cyber', 'social'],
            sortBy: 'newest'
        };
        this.allReports = [];
        this.allCounseling = [];
        this.allSelfChecks = [];
        this.allActivities = [];
        this.initialize();
    }
    
    initialize() {
        console.log('SafeCampus History Initialized');
        
        // Load mock data
        this.loadMockData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial data
        this.renderReports();
        
        // Load other tabs on demand
        this.setupTabLoading();
    }
    
    loadMockData() {
        // Mock reports data
        this.allReports = [
            {
                id: 'RPT-012',
                type: 'cyber',
                title: 'Cyberbullying - Akun Diretas',
                description: 'Akun media sosial saya diretas dan digunakan untuk menyebarkan konten tidak pantas dengan nama saya.',
                status: 'completed',
                date: '2023-12-28',
                time: '14:30',
                counselor: 'Sari Wijaya',
                location: 'Online (Social Media)',
                anonymity: 'anonymous',
                files: 3,
                timeline: [
                    { date: '28 Des', action: 'Laporan diterima dan diverifikasi' },
                    { date: '29 Des', action: 'Investigasi bukti digital' },
                    { date: '30 Des', action: 'Koordinasi dengan pihak kampus' },
                    { date: '31 Des', action: 'Kasus selesai, akun diamankan' }
                ],
                notes: 'Akun telah diamankan dan pelaku telah diidentifikasi. Rekomendasi: ganti password secara berkala dan aktifkan 2FA.',
                priority: 'high'
            },
            {
                id: 'RPT-011',
                type: 'verbal',
                title: 'Verbal Bullying - Grup WhatsApp',
                description: 'Dihina dan diolok-olok di grup WhatsApp kelas karena penampilan fisik.',
                status: 'processing',
                date: '2023-12-26',
                time: '10:15',
                counselor: 'Budi Santoso',
                location: 'Fakultas Teknologi Informasi',
                anonymity: 'anonymous',
                files: 3,
                progress: 75,
                estimatedCompletion: '2024-01-02',
                priority: 'medium'
            },
            {
                id: 'RPT-010',
                type: 'physical',
                title: 'Fisik Bullying - Dijegal di Tangga',
                description: 'Didorong dan dijegal di tangga gedung fakultas oleh sekelompok mahasiswa.',
                status: 'pending',
                date: '2023-12-24',
                time: '16:45',
                counselor: null,
                location: 'Gedung FTI Lantai 3',
                anonymity: 'identified',
                files: 1,
                priority: 'medium'
            },
            {
                id: 'RPT-009',
                type: 'social',
                title: 'Social Bullying - Dikucilkan',
                description: 'Dikucilkan dari kelompok belajar dan disebarkan rumor tidak benar.',
                status: 'rejected',
                date: '2023-12-20',
                time: '09:30',
                counselor: 'Adi Pratama',
                location: 'Fakultas Ekonomi',
                anonymity: 'anonymous',
                files: 0,
                rejectionReason: 'Laporan tidak memiliki bukti yang cukup dan informasi yang jelas. Silakan ajukan ulang dengan bukti konkret seperti screenshot percakapan atau saksi yang bisa diverifikasi.',
                suggestions: [
                    'Kumpulkan bukti berupa screenshot atau rekaman',
                    'Identifikasi saksi yang bersedia memberikan keterangan',
                    'Sebutkan waktu dan lokasi kejadian dengan spesifik',
                    'Ajukan ulang dalam 7 hari'
                ],
                priority: 'low'
            }
        ];
        
        // Mock counseling sessions
        this.allCounseling = [
            {
                id: 'CONS-008',
                type: 'emergency',
                counselor: 'Budi Santoso',
                date: '2023-12-25',
                duration: '45 menit',
                rating: 4.5,
                notes: 'Membahas kasus bullying verbal di grup WhatsApp',
                status: 'completed',
                followUp: '2024-01-08'
            },
            {
                id: 'CONS-007',
                type: 'scheduled',
                counselor: 'Sari Wijaya',
                date: '2023-12-20',
                duration: '60 menit',
                rating: 5.0,
                notes: 'Follow-up untuk perkembangan kasus cyberbullying',
                status: 'completed',
                followUp: null
            }
        ];
        
        // Mock self-check results
        this.allSelfChecks = [
            {
                id: 'SC-015',
                type: 'Stress & Anxiety',
                date: 'Hari ini, 10:30',
                score: 65,
                level: 'Sedang',
                recommendation: 'Disarankan istirahat cukup, bicara dengan teman atau konselor, dan lakukan aktivitas relaksasi.'
            },
            {
                id: 'SC-014',
                type: 'Depression Screening',
                date: '2023-12-20',
                score: 42,
                level: 'Rendah',
                recommendation: 'Pertahankan aktivitas positif yang sudah dilakukan.'
            }
        ];
        
        // Mock activities
        this.allActivities = [
            { type: 'login', description: 'Login ke aplikasi', time: '08:30', date: '2023-12-28' },
            { type: 'article', description: 'Membaca artikel "Mengenal Cyberbullying"', time: '10:15', date: '2023-12-27' },
            { type: 'chat', description: 'Chat dengan Konselor Budi', time: '14:20', duration: '25 menit', date: '2023-12-25' },
            { type: 'report', description: 'Mengirim laporan #RPT-012', time: '14:30', date: '2023-12-28' }
        ];
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Filter modal
        const filterBtn = document.getElementById('filterBtn');
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        const applyFilterBtn = document.getElementById('applyFilterBtn');
        const resetFilterBtn = document.getElementById('resetFilterBtn');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        
        if (filterBtn) filterBtn.addEventListener('click', () => this.openFilterModal());
        if (mobileFilterBtn) mobileFilterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openFilterModal();
        });
        if (applyFilterBtn) applyFilterBtn.addEventListener('click', () => this.applyFilters());
        if (resetFilterBtn) resetFilterBtn.addEventListener('click', () => this.resetFilters());
        
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Custom date range toggle
        const customDateRadio = document.querySelector('input[name="timeRange"][value="custom"]');
        if (customDateRadio) {
            customDateRadio.addEventListener('change', (e) => {
                const customRangeDiv = document.getElementById('customDateRange');
                if (e.target.checked) {
                    customRangeDiv.style.display = 'block';
                } else {
                    customRangeDiv.style.display = 'none';
                }
            });
        }
        
        // View detail buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-detail')) {
                const button = e.target.closest('.view-detail');
                const reportId = button.dataset.id;
                this.showReportDetail(reportId);
            }
            
            if (e.target.closest('.export-btn')) {
                const button = e.target.closest('.export-btn');
                const reportId = button.dataset.id;
                this.exportReport(reportId);
            }
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreReports');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreReports());
        }
        
        // Reset filters button (empty state)
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Print button in detail modal
        const printBtn = document.getElementById('printReportBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }
    }
    
    setupTabLoading() {
        // Load other tabs when clicked
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                if (tabId !== 'reports') {
                    setTimeout(() => {
                        this.loadTabContent(tabId);
                    }, 100);
                }
            });
        });
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update tab UI
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(`${tabId}Tab`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
        
        // Load content if not loaded
        if (tabId !== 'reports') {
            this.loadTabContent(tabId);
        }
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId);
        window.history.pushState({ tab: tabId }, '', url);
    }
    
    loadTabContent(tabId) {
        const tabContent = document.getElementById(`${tabId}Tab`);
        if (!tabContent) return;
        
        // Check if already loaded
        if (tabContent.querySelector('.history-list')) return;
        
        switch(tabId) {
            case 'counseling':
                this.renderCounseling();
                break;
            case 'selfcheck':
                this.renderSelfChecks();
                break;
            case 'activities':
                this.renderActivities();
                break;
        }
    }
    
    renderReports() {
        const container = document.querySelector('#reportsTab .history-list');
        if (!container) return;
        
        // Apply filters
        const filteredReports = this.filterReports(this.allReports);
        
        if (filteredReports.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Hide empty state
        this.hideEmptyState();
        
        // Clear container
        container.innerHTML = '';
        
        // Render each report
        filteredReports.forEach(report => {
            const reportElement = this.createReportElement(report);
            container.appendChild(reportElement);
        });
        
        // Update stats
        this.updateStats();
    }
    
    filterReports(reports) {
        return reports.filter(report => {
            // Filter by status
            if (this.currentFilters.status.length > 0) {
                if (!this.currentFilters.status.includes(report.status)) {
                    return false;
                }
            }
            
            // Filter by type
            if (this.currentFilters.type.length > 0) {
                if (!this.currentFilters.type.includes(report.type)) {
                    return false;
                }
            }
            
            // Filter by time range
            if (this.currentFilters.timeRange !== 'all') {
                const reportDate = new Date(report.date);
                const now = new Date();
                let cutoffDate = new Date();
                
                switch(this.currentFilters.timeRange) {
                    case '7days':
                        cutoffDate.setDate(now.getDate() - 7);
                        break;
                    case '30days':
                        cutoffDate.setDate(now.getDate() - 30);
                        break;
                    case '3months':
                        cutoffDate.setMonth(now.getMonth() - 3);
                        break;
                    case 'custom':
                        const dateFrom = document.getElementById('dateFrom')?.value;
                        const dateTo = document.getElementById('dateTo')?.value;
                        if (dateFrom && dateTo) {
                            const fromDate = new Date(dateFrom);
                            const toDate = new Date(dateTo);
                            if (reportDate < fromDate || reportDate > toDate) {
                                return false;
                            }
                        }
                        break;
                }
                
                if (this.currentFilters.timeRange !== 'custom' && reportDate < cutoffDate) {
                    return false;
                }
            }
            
            return true;
        }).sort((a, b) => {
            // Sort by selected criteria
            switch(this.currentFilters.sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                default:
                    return 0;
            }
        });
    }
    
    createReportElement(report) {
        const statusClass = `badge-${report.status}`;
        const statusText = this.getStatusText(report.status);
        
        let additionalContent = '';
        
        switch(report.status) {
            case 'completed':
                additionalContent = this.createTimelineContent(report.timeline, report.notes);
                break;
            case 'processing':
                additionalContent = this.createProgressContent(report);
                break;
            case 'pending':
                additionalContent = this.createPendingContent();
                break;
            case 'rejected':
                additionalContent = this.createRejectedContent(report);
                break;
        }
        
        return this.createElementFromHTML(`
            <div class="history-card report ${report.status}">
                <div class="card-header">
                    <div class="card-title">
                        <h3>${report.id} - ${this.getTypeText(report.type)}</h3>
                        <span class="badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="card-meta">
                        <span class="date">${this.formatDate(report.date)}</span>
                        <span class="time">${report.time}</span>
                    </div>
                </div>
                
                <div class="card-content">
                    <p class="card-description">"${report.description}"</p>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fas fa-user-tie"></i>
                            <span>${report.counselor || 'Menunggu penugasan'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${report.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Pelapor: ${report.anonymity === 'anonymous' ? 'Anonim' : 'Teridentifikasi'}</span>
                        </div>
                    </div>
                    
                    ${additionalContent}
                </div>
                
                <div class="card-footer">
                    ${this.createFooterButtons(report)}
                </div>
            </div>
        `);
    }
    
    createTimelineContent(timeline, notes) {
        let timelineHTML = '';
        if (timeline && timeline.length > 0) {
            timelineHTML = `
                <div class="timeline">
                    ${timeline.map(item => `
                        <div class="timeline-item completed">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <span class="timeline-date">${item.date}</span>
                                <p>${item.action}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        return `
            ${timelineHTML}
            ${notes ? `
                <div class="card-notes">
                    <h4><i class="fas fa-sticky-note"></i> Catatan Konselor:</h4>
                    <p>"${notes}"</p>
                </div>
            ` : ''}
        `;
    }
    
    createProgressContent(report) {
        return `
            <div class="progress-container">
                <div class="progress-label">
                    <span>Status: Investigasi dan Mediasi</span>
                    <span>${report.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${report.progress}%"></div>
                </div>
                <div class="progress-steps">
                    <span class="step completed">Diterima</span>
                    <span class="step completed">Divestigasi</span>
                    <span class="step current">Mediasi</span>
                    <span class="step">Selesai</span>
                </div>
            </div>
            
            ${report.estimatedCompletion ? `
                <div class="estimated-completion">
                    <i class="fas fa-clock"></i>
                    <span>Estimasi selesai: ${this.formatDate(report.estimatedCompletion)}</span>
                </div>
            ` : ''}
        `;
    }
    
    createPendingContent() {
        return `
            <div class="waiting-reason">
                <h4><i class="fas fa-info-circle"></i> Status:</h4>
                <p>Laporan sedang dalam antrian untuk ditugaskan ke konselor. Rata-rata waktu tunggu: 1-3 hari kerja.</p>
            </div>
        `;
    }
    
    createRejectedContent(report) {
        return `
            <div class="rejection-reason">
                <h4><i class="fas fa-exclamation-circle"></i> Alasan Penolakan:</h4>
                <p>"${report.rejectionReason}"</p>
            </div>
            
            ${report.suggestions && report.suggestions.length > 0 ? `
                <div class="suggestions">
                    <h4><i class="fas fa-lightbulb"></i> Saran Perbaikan:</h4>
                    <ul>
                        ${report.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    }
    
    createFooterButtons(report) {
        const baseButtons = `
            <button class="btn btn-outline btn-sm view-detail" data-id="${report.id}">
                <i class="fas fa-eye"></i> Lihat Detail
            </button>
            <button class="btn btn-outline btn-sm export-btn" data-id="${report.id}">
                <i class="fas fa-download"></i> Ekspor
            </button>
        `;
        
        switch(report.status) {
            case 'completed':
                return baseButtons + `
                    <button class="btn btn-primary btn-sm followup-btn" data-id="${report.id}">
                        <i class="fas fa-redo"></i> Follow-up
                    </button>
                `;
            case 'processing':
                return `
                    <button class="btn btn-outline btn-sm update-status">
                        <i class="fas fa-sync-alt"></i> Perbarui Status
                    </button>
                    <button class="btn btn-outline btn-sm add-evidence">
                        <i class="fas fa-plus-circle"></i> Tambah Bukti
                    </button>
                    <button class="btn btn-primary btn-sm contact-counselor">
                        <i class="fas fa-comment"></i> Hubungi Konselor
                    </button>
                `;
            case 'pending':
                return `
                    <button class="btn btn-outline btn-sm cancel-report">
                        <i class="fas fa-times"></i> Batalkan Laporan
                    </button>
                    <button class="btn btn-outline btn-sm emergency-btn">
                        <i class="fas fa-exclamation-triangle"></i> Eskalasi Darurat
                    </button>
                `;
            case 'rejected':
                return `
                    <button class="btn btn-outline btn-sm resubmit-btn">
                        <i class="fas fa-redo"></i> Ajukan Ulang
                    </button>
                    <button class="btn btn-outline btn-sm help-btn">
                        <i class="fas fa-question-circle"></i> Minta Bantuan
                    </button>
                `;
            default:
                return baseButtons;
        }
    }
    
    renderCounseling() {
        const tabContent = document.getElementById('counselingTab');
        if (!tabContent) return;
        
        tabContent.innerHTML = `
            <div class="history-list">
                ${this.allCounseling.map(session => `
                    <div class="history-card counseling ${session.status}">
                        <div class="card-header">
                            <div class="card-title">
                                <h3>${session.id} - ${session.type === 'emergency' ? 'Konseling Darurat' : 'Konseling Terjadwal'}</h3>
                                <span class="badge ${session.status === 'completed' ? 'badge-completed' : 'badge-processing'}">
                                    ${session.status === 'completed' ? 'Selesai' : 'Berlangsung'}
                                </span>
                            </div>
                            <div class="card-meta">
                                <span class="date">${this.formatDate(session.date)}</span>
                                <span class="time">${session.duration}</span>
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <div class="card-details">
                                <div class="detail-item">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Konselor: ${session.counselor}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-star"></i>
                                    <span>Rating: ${session.rating}/5.0</span>
                                </div>
                                ${session.followUp ? `
                                    <div class="detail-item">
                                        <i class="fas fa-calendar-check"></i>
                                        <span>Follow-up: ${this.formatDate(session.followUp)}</span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="card-notes">
                                <h4><i class="fas fa-sticky-note"></i> Catatan Sesi:</h4>
                                <p>"${session.notes}"</p>
                            </div>
                            
                            ${session.followUp ? `
                                <div class="suggestions">
                                    <h4><i class="fas fa-calendar-alt"></i> Jadwal Follow-up:</h4>
                                    <p>Sesi follow-up dijadwalkan pada ${this.formatDate(session.followUp)}. Persiapkan poin-poin yang ingin didiskusikan.</p>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="card-footer">
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-eye"></i> Lihat Detail
                            </button>
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-download"></i> Unduh Catatan
                            </button>
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-calendar-plus"></i> Jadwalkan Ulang
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="counseling-stats card-teal">
                <h3><i class="fas fa-chart-bar"></i> Statistik Konseling</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <i class="fas fa-comments"></i>
                        <div>
                            <h4>Total Sesi</h4>
                            <p class="stat-number">${this.allCounseling.length}</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h4>Rata-rata Durasi</h4>
                            <p class="stat-number">52 menit</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-star"></i>
                        <div>
                            <h4>Rating Rata-rata</h4>
                            <p class="stat-number">4.8/5.0</p>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar-check"></i>
                        <div>
                            <h4>Follow-up Rate</h4>
                            <p class="stat-number">75%</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSelfChecks() {
        const tabContent = document.getElementById('selfcheckTab');
        if (!tabContent) return;
        
        tabContent.innerHTML = `
            <div class="selfcheck-summary">
                <div class="trend-chart">
                    <h3><i class="fas fa-chart-line"></i> Tren Kesehatan Mental</h3>
                    <div class="chart-container">
                        <canvas id="mentalHealthChart" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <div class="recommendations">
                    <h3><i class="fas fa-lightbulb"></i> Rekomendasi Personal</h3>
                    <p>Berdasarkan hasil self-check Anda, berikut rekomendasi untuk meningkatkan kesehatan mental:</p>
                    <ul>
                        <li>Lakukan meditasi 10 menit setiap pagi</li>
                        <li>Jaga pola tidur 7-8 jam per hari</li>
                        <li>Lakukan aktivitas fisik minimal 30 menit, 3x seminggu</li>
                        <li>Batasi penggunaan media sosial 1 jam sebelum tidur</li>
                    </ul>
                </div>
            </div>
            
            <div class="history-list">
                ${this.allSelfChecks.map(check => {
                    const scoreColor = check.score >= 70 ? 'error' : check.score >= 50 ? 'warning' : 'success';
                    return `
                        <div class="history-card selfcheck">
                            <div class="card-header">
                                <div class="card-title">
                                    <h3>${check.id} - ${check.type}</h3>
                                    <span class="badge badge-${scoreColor}">${check.level}</span>
                                </div>
                                <div class="card-meta">
                                    <span class="date">${check.date}</span>
                                </div>
                            </div>
                            
                            <div class="card-content">
                                <div class="progress-container">
                                    <div class="progress-label">
                                        <span>Skor: ${check.score}/100</span>
                                        <span>${check.score}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${check.score}%"></div>
                                    </div>
                                </div>
                                
                                <div class="card-notes">
                                    <h4><i class="fas fa-stethoscope"></i> Interpretasi:</h4>
                                    <p>${check.recommendation}</p>
                                </div>
                            </div>
                            
                            <div class="card-footer">
                                <button class="btn btn-outline btn-sm">
                                    <i class="fas fa-chart-bar"></i> Lihat Detail
                                </button>
                                <button class="btn btn-outline btn-sm">
                                    <i class="fas fa-redo"></i> Test Ulang
                                </button>
                                <button class="btn btn-primary btn-sm">
                                    <i class="fas fa-comment-medical"></i> Konsultasi
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Initialize chart
        this.initMentalHealthChart();
    }
    
    initMentalHealthChart() {
        const ctx = document.getElementById('mentalHealthChart');
        if (!ctx) return;
        
        // Mock chart data
        const data = {
            labels: ['Nov', 'Des'],
            datasets: [{
                label: 'Tingkat Stres',
                data: [65, 58],
                borderColor: 'var(--accent-emergency)',
                backgroundColor: 'rgba(255, 112, 67, 0.1)',
                tension: 0.4
            }, {
                label: 'Kesehatan Mental',
                data: [70, 75],
                borderColor: 'var(--success)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }]
        };
        
        // In real app, use Chart.js
        console.log('Chart initialized with data:', data);
    }
    
    renderActivities() {
        const tabContent = document.getElementById('activitiesTab');
        if (!tabContent) return;
        
        const groupedActivities = this.groupActivitiesByDate(this.allActivities);
        
        tabContent.innerHTML = `
            <div class="activity-timeline">
                ${Object.entries(groupedActivities).map(([date, activities]) => `
                    <div class="activity-day">
                        <h3 class="day-header">${this.formatActivityDate(date)}</h3>
                        ${activities.map(activity => `
                            <div class="activity-item ${activity.type}">
                                <div class="activity-icon">
                                    ${this.getActivityIcon(activity.type)}
                                </div>
                                <div class="activity-content">
                                    <h4>${activity.description}</h4>
                                    <p class="activity-time">${activity.time} ${activity.duration ? `• ${activity.duration}` : ''}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <div class="activity-summary card-teal">
                <h3><i class="fas fa-chart-pie"></i> Ringkasan Aktivitas</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <i class="fas fa-sign-in-alt"></i>
                        <div>
                            <h4>Login</h4>
                            <p class="summary-number">${this.countActivitiesByType('login')}x</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-comments"></i>
                        <div>
                            <h4>Chat</h4>
                            <p class="summary-number">${this.countActivitiesByType('chat')}x</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-flag"></i>
                        <div>
                            <h4>Laporan</h4>
                            <p class="summary-number">${this.countActivitiesByType('report')}x</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-book-reader"></i>
                        <div>
                            <h4>Edukasi</h4>
                            <p class="summary-number">${this.countActivitiesByType('article')}x</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    groupActivitiesByDate(activities) {
        return activities.reduce((groups, activity) => {
            const date = activity.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
            return groups;
        }, {});
    }
    
    countActivitiesByType(type) {
        return this.allActivities.filter(activity => activity.type === type).length;
    }
    
    getActivityIcon(type) {
        const icons = {
            login: '<i class="fas fa-sign-in-alt"></i>',
            chat: '<i class="fas fa-comments"></i>',
            report: '<i class="fas fa-flag"></i>',
            article: '<i class="fas fa-book-reader"></i>'
        };
        return icons[type] || '<i class="fas fa-circle"></i>';
    }
    
    openFilterModal() {
        const modal = document.getElementById('filterModal');
        if (!modal) return;
        
        // Set current values
        this.setFilterValues();
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    setFilterValues() {
        // Time range
        document.querySelectorAll('input[name="timeRange"]').forEach(radio => {
            radio.checked = radio.value === this.currentFilters.timeRange;
        });
        
        // Status
        document.querySelectorAll('input[name="status"]').forEach(checkbox => {
            checkbox.checked = this.currentFilters.status.includes(checkbox.value);
        });
        
        // Type
        document.querySelectorAll('input[name="type"]').forEach(checkbox => {
            checkbox.checked = this.currentFilters.type.includes(checkbox.value);
        });
        
        // Sort by
        document.querySelectorAll('input[name="sortBy"]').forEach(radio => {
            radio.checked = radio.value === this.currentFilters.sortBy;
        });
        
        // Custom date range
        if (this.currentFilters.timeRange === 'custom') {
            const customRangeDiv = document.getElementById('customDateRange');
            if (customRangeDiv) {
                customRangeDiv.style.display = 'block';
            }
        }
    }
    
    applyFilters() {
        // Get values from form
        const timeRange = document.querySelector('input[name="timeRange"]:checked')?.value || 'all';
        const status = Array.from(document.querySelectorAll('input[name="status"]:checked')).map(cb => cb.value);
        const type = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
        const sortBy = document.querySelector('input[name="sortBy"]:checked')?.value || 'newest';
        
        // Update current filters
        this.currentFilters = {
            timeRange,
            status: status.length > 0 ? status : ['completed', 'processing', 'pending', 'rejected'],
            type: type.length > 0 ? type : ['verbal', 'physical', 'cyber', 'social', 'other'],
            sortBy
        };
        
        // Close modal
        this.closeModal();
        
        // Apply filters
        this.renderReports();
        
        // Show notification
        this.showToast('Filter diterapkan', 'success');
    }
    
    resetFilters() {
        this.currentFilters = {
            timeRange: 'all',
            status: ['completed', 'processing'],
            type: ['verbal', 'physical', 'cyber', 'social'],
            sortBy: 'newest'
        };
        
        // Close modal if open
        this.closeModal();
        
        // Reset UI
        this.setFilterValues();
        
        // Re-render
        this.renderReports();
        
        // Show notification
        this.showToast('Filter direset', 'info');
    }
    
    showReportDetail(reportId) {
        const report = this.allReports.find(r => r.id === reportId);
        if (!report) return;
        
        const modal = document.getElementById('reportDetailModal');
        const title = document.getElementById('detailModalTitle');
        const body = modal.querySelector('.modal-body');
        
        if (!modal || !title || !body) return;
        
        title.textContent = `${report.id} - ${this.getTypeText(report.type)}`;
        
        body.innerHTML = `
            <div class="report-detail">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Informasi Laporan</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Status:</strong>
                            <span class="badge badge-${report.status}">${this.getStatusText(report.status)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Tanggal:</strong>
                            <span>${this.formatDate(report.date)} ${report.time}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Lokasi:</strong>
                            <span>${report.location}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Konselor:</strong>
                            <span>${report.counselor || 'Belum ditugaskan'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Anonimitas:</strong>
                            <span>${report.anonymity === 'anonymous' ? 'Anonim' : 'Teridentifikasi'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Prioritas:</strong>
                            <span>${this.getPriorityText(report.priority)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-align-left"></i> Deskripsi</h4>
                    <div class="description-box">
                        ${report.description}
                    </div>
                </div>
                
                ${report.timeline && report.timeline.length > 0 ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-history"></i> Timeline Penanganan</h4>
                        <div class="timeline-vertical">
                            ${report.timeline.map((item, index) => `
                                <div class="timeline-item ${index === report.timeline.length - 1 ? 'current' : 'completed'}">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <span class="timeline-date">${item.date}</span>
                                        <p>${item.action}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${report.notes ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-sticky-note"></i> Catatan Konselor</h4>
                        <div class="notes-box">
                            ${report.notes}
                        </div>
                    </div>
                ` : ''}
                
                ${report.rejectionReason ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-exclamation-circle"></i> Alasan Penolakan</h4>
                        <div class="rejection-box">
                            ${report.rejectionReason}
                        </div>
                    </div>
                ` : ''}
                
                <div class="detail-section">
                    <h4><i class="fas fa-paperclip"></i> Lampiran</h4>
                    <div class="attachments">
                        ${report.files > 0 ? `
                            <p>${report.files} file terlampir</p>
                            <div class="attachment-list">
                                <div class="attachment-item">
                                    <i class="fas fa-image"></i>
                                    <span>screenshot_evidence_1.png</span>
                                    <button class="btn-icon btn-sm"><i class="fas fa-download"></i></button>
                                </div>
                            </div>
                        ` : '<p>Tidak ada file terlampir</p>'}
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    exportReport(reportId) {
        const report = this.allReports.find(r => r.id === reportId);
        if (!report) return;
        
        // Show export options
        const exportOptions = `
            <div class="export-modal">
                <h4><i class="fas fa-download"></i> Ekspor Laporan ${reportId}</h4>
                <p>Pilih format ekspor:</p>
                
                <div class="export-options">
                    <button class="btn btn-outline btn-block export-option" data-format="pdf">
                        <i class="fas fa-file-pdf"></i> PDF Document
                    </button>
                    <button class="btn btn-outline btn-block export-option" data-format="word">
                        <i class="fas fa-file-word"></i> Word Document
                    </button>
                    <button class="btn btn-outline btn-block export-option" data-format="csv">
                        <i class="fas fa-file-csv"></i> CSV Data
                    </button>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeAttachments" checked>
                        <span>Sertakan lampiran</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeTimeline" checked>
                        <span>Sertakan timeline</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="includeNotes" checked>
                        <span>Sertakan catatan konselor</span>
                    </label>
                </div>
            </div>
        `;
        
        this.showCustomModal('Ekspor Laporan', exportOptions, () => {
            const format = document.querySelector('.export-option.active')?.dataset.format || 'pdf';
            this.performExport(report, format);
            return true;
        });
    }
    
    performExport(report, format) {
        // Simulate export process
        console.log(`Exporting report ${report.id} as ${format}`);
        
        // Show loading
        this.showToast(`Mengekspor laporan sebagai ${format.toUpperCase()}...`, 'info');
        
        // Simulate delay
        setTimeout(() => {
            this.showToast(`Laporan berhasil diekspor sebagai ${format.toUpperCase()}`, 'success');
            
            // In real app, this would trigger download
            // const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            // const url = URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = `laporan-${report.id}.${format}`;
            // a.click();
        }, 1500);
    }
    
    showCustomModal(title, content, onSubmit = null) {
        const modalHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="btn-icon close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline close-modal">Batal</button>
                        ${onSubmit ? `<button class="btn btn-primary" id="submitCustom">Kirim</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing
        const existing = document.querySelector('.modal-overlay:not(#filterModal):not(#reportDetailModal)');
        if (existing) existing.remove();
        
        // Add new
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close handlers
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').remove();
                document.body.style.overflow = '';
            });
        });
        
        // Export option selection
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.export-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Submit handler
        if (onSubmit) {
            document.getElementById('submitCustom').addEventListener('click', () => {
                if (onSubmit()) {
                    document.querySelector('.modal-overlay.active').remove();
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    loadMoreReports() {
        // Simulate loading more reports
        const loadMoreBtn = document.getElementById('loadMoreReports');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            // In real app, this would load more from API
            console.log('Loading more reports...');
            
            loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Tampilkan Lebih Banyak Laporan';
            loadMoreBtn.disabled = false;
            
            this.showToast('Tidak ada data tambahan', 'info');
        }, 1000);
    }
    
    updateStats() {
        const filteredReports = this.filterReports(this.allReports);
        
        // Update tab badge
        const reportsTab = document.querySelector('.tab[data-tab="reports"] .tab-badge');
        if (reportsTab) {
            reportsTab.textContent = filteredReports.length;
        }
        
        // Update stat cards
        const total = this.allReports.length;
        const completed = this.allReports.filter(r => r.status === 'completed').length;
        const processing = this.allReports.filter(r => r.status === 'processing').length;
        const pending = this.allReports.filter(r => r.status === 'pending').length;
        
        document.querySelectorAll('.stat-number').forEach((el, index) => {
            if (index === 0) el.textContent = total;
            if (index === 1) el.textContent = completed;
            if (index === 2) el.textContent = processing;
            if (index === 3) el.textContent = pending;
        });
    }
    
    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const reportsTab = document.getElementById('reportsTab');
        
        if (emptyState && reportsTab) {
            emptyState.style.display = 'block';
            reportsTab.querySelector('.history-list').style.display = 'none';
            reportsTab.querySelector('.load-more').style.display = 'none';
        }
    }
    
    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const reportsTab = document.getElementById('reportsTab');
        
        if (emptyState && reportsTab) {
            emptyState.style.display = 'none';
            reportsTab.querySelector('.history-list').style.display = 'block';
            reportsTab.querySelector('.load-more').style.display = 'block';
        }
    }
    
    // Utility methods
    getStatusText(status) {
        const statusMap = {
            completed: 'Selesai',
            processing: 'Diproses',
            pending: 'Menunggu',
            rejected: 'Ditolak'
        };
        return statusMap[status] || status;
    }
    
    getTypeText(type) {
        const typeMap = {
            verbal: 'Verbal Bullying',
            physical: 'Fisik Bullying',
            cyber: 'Cyberbullying',
            social: 'Social Bullying'
        };
        return typeMap[type] || type;
    }
    
    getPriorityText(priority) {
        const priorityMap = {
            high: 'Tinggi',
            medium: 'Sedang',
            low: 'Rendah'
        };
        return priorityMap[priority] || priority;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    formatActivityDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Hari Ini';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Kemarin';
        } else {
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    showToast(message, type = 'info') {
        if (window.SafeCampusApp && window.SafeCampusApp.showToast) {
            window.SafeCampusApp.showToast(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
    
    createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.historyApp = new SafeCampusHistory();
});