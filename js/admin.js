// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.isLoggedIn = false;
        this.currentTab = 'emails';
        this.hasChanges = false;
        this.editingContent = this.getDefaultContent();
        
        this.init();
    }

    init() {
        this.setupAdminEventListeners();
        this.loadSavedContent();
    }

    getDefaultContent() {
        return {
            seo: {
                title: "Keto Diet Landing Page - Transform Your Life in 30 Days",
                description: "Failed at Keto Diet? Get our 30-day guaranteed keto meal list and guides with proven results! 10,000+ people have already transformed their lives.",
                keywords: "keto diet, weight loss, meal planning, keto recipes, healthy eating, diet plan, nutrition guide",
                author: "KetoMaster",
                canonical: "https://keto-diet-landing-pa-dje0.bolt.host"
            },
            navbar: {
                logo: "KetoMaster",
                menuItems: [
                    { label: "Keto Foods", href: "#keto-foods" },
                    { label: "Shopping List", href: "#shopping-list" },
                    { label: "Guide", href: "#guide" },
                    { label: "Contact", href: "#contact" }
                ]
            },
            hero: {
                title: "Failed at Keto Diet?",
                subtitle: "30-day guaranteed keto meal list and guides with proven results! 10,000+ people have already transformed their lives.",
                ctaText: "Get My Free Keto List",
                ctaSecondary: "How Does It Work?",
                image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            stats: {
                users: "10,000+",
                days: "30 Days",
                success: "95%"
            },
            quiz: {
                title: "Which Keto Foods Are Right for You?",
                subtitle: "Discover your personalized keto plan with a 3-minute test!",
                questions: [
                    {
                        question: "What's your biggest challenge with keto diet?",
                        options: ["Meal planning", "Shopping lists", "Portion control", "Motivation"]
                    },
                    {
                        question: "How many meals do you prefer per day?",
                        options: ["2 meals", "3 meals", "4-5 small meals", "Intermittent fasting"]
                    },
                    {
                        question: "How much time do you like to spend in the kitchen?",
                        options: ["Very little (15 min max)", "Moderate (30 min)", "Enough (45 min)", "A lot (1 hour+)"]
                    }
                ]
            },
            features: [
                { title: "200+ Keto Recipes", description: "Delicious and easy recipes from breakfast to dinner" },
                { title: "Weekly Menus", description: "Ready-made menus to live keto without thinking" },
                { title: "Shopping Lists", description: "Detailed lists that make your grocery shopping easier" },
                { title: "Private Support Group", description: "WhatsApp group where you can get 24/7 support" },
                { title: "Progress Tracking", description: "Special tools to track your goals" },
                { title: "Bonus Content", description: "Additional guides and special tips" }
            ],
            testimonials: [
                {
                    name: "Sarah K.",
                    result: "Lost 26 lbs",
                    story: "I reached my goal in 3 months! Keto lists made shopping and meal planning so easy.",
                    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
                },
                {
                    name: "Mike T.",
                    result: "Lost 18 lbs",
                    story: "I didn't have time to exercise but got amazing results with just nutrition!",
                    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300"
                },
                {
                    name: "Emma M.",
                    result: "Lost 33 lbs",
                    story: "None of the diets I tried for years worked. Keto changed my life!",
                    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
                }
            ],
            cta: {
                title: "Start Today to Succeed in Keto Diet!",
                subtitle: "10,000+ people have already transformed their lives. Your turn!",
                features: [
                    "200+ Keto recipes and menus",
                    "Weekly shopping lists",
                    "WhatsApp support group",
                    "Progress tracking tools"
                ],
                buttonText: "Get It Free Now",
                guaranteeText: "30-day money back guarantee",
                noCardText: "No credit card required"
            },
            popup: {
                title: "Leaving already? 🥺",
                subtitle: "Don't miss out on keto success! Last chance: Get your Free Keto guide and transform your life in 30 days.",
                buttonText: "Use My Last Chance!",
                dismissText: "No thanks, let me leave"
            },
            colors: {
                primary: "#198754",
                secondary: "#fd7e14",
                accent: "#0d6efd",
                success: "#198754",
                warning: "#ffc107",
                error: "#dc3545",
                background: "#ffffff",
                surface: "#f8f9fa",
                text: "#212529",
                textSecondary: "#6c757d"
            },
            notFound: {
                title: "Oops! Page Not Found",
                subtitle: "The page you're looking for doesn't exist. Let's get you back to your keto journey!",
                buttonText: "Back to Home"
            }
        };
    }

    setupAdminEventListeners() {
        // Admin login form
        document.getElementById('admin-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });

        // Save changes button
        document.getElementById('save-changes')?.addEventListener('click', () => {
            this.saveChanges();
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-tab]')) {
                this.switchTab(e.target.dataset.tab);
            }
        });
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        if (username === 'admin' && password === 'admin123') {
            this.isLoggedIn = true;
            this.showAdminPanel();
        } else {
            this.showAdminError('Kullanıcı adı veya şifre hatalı');
        }
    }

    showAdminError(message) {
        const errorDiv = document.getElementById('admin-error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
    }

    showAdminPanel() {
        document.getElementById('admin-login').classList.add('d-none');
        document.getElementById('admin-panel').classList.remove('d-none');
        this.loadAdminData();
        this.switchTab('emails');
    }

    loadAdminData() {
        const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
        const visitors = JSON.parse(localStorage.getItem('keto-visitors') || '[]');
        
        document.getElementById('email-count').textContent = emails.length;
        document.getElementById('visitor-count').textContent = visitors.length;
    }

    loadSavedContent() {
        const savedContent = localStorage.getItem('keto-content');
        if (savedContent) {
            this.editingContent = JSON.parse(savedContent);
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
        this.renderTabContent(tabName);
    }

    renderTabContent(tabName) {
        const contentDiv = document.getElementById('admin-content');
        
        switch(tabName) {
            case 'emails':
                contentDiv.innerHTML = this.renderEmailsTab();
                break;
            case 'visitors':
                contentDiv.innerHTML = this.renderVisitorsTab();
                break;
            case 'content':
                contentDiv.innerHTML = this.renderContentTab();
                break;
            case 'seo':
                contentDiv.innerHTML = this.renderSeoTab();
                break;
            case 'navbar':
                contentDiv.innerHTML = this.renderNavbarTab();
                break;
            case 'quiz':
                contentDiv.innerHTML = this.renderQuizTab();
                break;
            case 'features':
                contentDiv.innerHTML = this.renderFeaturesTab();
                break;
            case 'cta':
                contentDiv.innerHTML = this.renderCtaTab();
                break;
            case 'popup':
                contentDiv.innerHTML = this.renderPopupTab();
                break;
            case 'colors':
                contentDiv.innerHTML = this.renderColorsTab();
                break;
            case 'notfound':
                contentDiv.innerHTML = this.renderNotFoundTab();
                break;
        }
        
        this.setupTabEventListeners();
    }

    renderEmailsTab() {
        const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
        
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3><i class="bi bi-envelope me-2"></i>Email Aboneleri (${emails.length})</h3>
                <button class="btn btn-success" onclick="adminPanel.exportEmails()">
                    <i class="bi bi-download me-1"></i>CSV İndir
                </button>
            </div>
            
            <div class="mb-3">
                <input type="text" class="form-control" placeholder="Email ara..." onkeyup="adminPanel.filterEmails(this.value)">
            </div>
            
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>Kaynak</th>
                            <th>Tarih</th>
                            <th>Quiz Cevapları</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="emails-table">
                        ${emails.map(email => `
                            <tr>
                                <td>${email.email}</td>
                                <td><span class="badge bg-primary">${this.getSourceLabel(email.source)}</span></td>
                                <td>${new Date(email.timestamp).toLocaleDateString('tr-TR')}</td>
                                <td>${email.quizAnswers ? email.quizAnswers.join(', ') : '-'}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteEmail('${email.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderVisitorsTab() {
        const visitors = JSON.parse(localStorage.getItem('keto-visitors') || '[]');
        
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3><i class="bi bi-people me-2"></i>Site Ziyaretçileri (${visitors.length})</h3>
                <button class="btn btn-info" onclick="adminPanel.exportVisitors()">
                    <i class="bi bi-download me-1"></i>CSV İndir
                </button>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stats-card">
                        <h5>Toplam Ziyaret</h5>
                        <h2>${visitors.length}</h2>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h5>Bugün</h5>
                        <h2>${visitors.filter(v => new Date(v.timestamp).toDateString() === new Date().toDateString()).length}</h2>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h5>Bu Hafta</h5>
                        <h2>${visitors.filter(v => this.isThisWeek(new Date(v.timestamp))).length}</h2>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h5>Bu Ay</h5>
                        <h2>${visitors.filter(v => this.isThisMonth(new Date(v.timestamp))).length}</h2>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>Tarih</th>
                            <th>Sayfa</th>
                            <th>Referrer</th>
                            <th>Tarayıcı</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visitors.slice(0, 100).map(visitor => `
                            <tr>
                                <td>${new Date(visitor.timestamp).toLocaleString('tr-TR')}</td>
                                <td><code>${visitor.page}</code></td>
                                <td>${visitor.referrer}</td>
                                <td title="${visitor.userAgent}">${this.getBrowserInfo(visitor.userAgent)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderCtaTab() {
        return `
            <h3><i class="bi bi-megaphone me-2"></i>CTA Bölümü</h3>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Başlık</label>
                        <input type="text" class="form-control" value="${this.editingContent.cta.title}" 
                               onchange="adminPanel.updateContent('cta', 'title', this.value)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Alt Başlık</label>
                        <textarea class="form-control" rows="3" 
                                  onchange="adminPanel.updateContent('cta', 'subtitle', this.value)">${this.editingContent.cta.subtitle}</textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Buton Metni</label>
                        <input type="text" class="form-control" value="${this.editingContent.cta.buttonText}" 
                               onchange="adminPanel.updateContent('cta', 'buttonText', this.value)">
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Garanti Metni</label>
                        <input type="text" class="form-control" value="${this.editingContent.cta.guaranteeText}" 
                               onchange="adminPanel.updateContent('cta', 'guaranteeText', this.value)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Kredi Kartı Metni</label>
                        <input type="text" class="form-control" value="${this.editingContent.cta.noCardText}" 
                               onchange="adminPanel.updateContent('cta', 'noCardText', this.value)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Özellikler</label>
                        ${this.editingContent.cta.features.map((feature, index) => `
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" value="${feature}" 
                                       onchange="adminPanel.updateCtaFeature(${index}, this.value)">
                                <button class="btn btn-outline-danger" onclick="adminPanel.removeCtaFeature(${index})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                        <button class="btn btn-outline-success btn-sm" onclick="adminPanel.addCtaFeature()">
                            <i class="bi bi-plus me-1"></i>Özellik Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderPopupTab() {
        return `
            <h3><i class="bi bi-window me-2"></i>Popup Yönetimi</h3>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Popup Başlığı</label>
                        <input type="text" class="form-control" value="${this.editingContent.popup.title}" 
                               onchange="adminPanel.updateContent('popup', 'title', this.value)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Popup Alt Başlığı</label>
                        <textarea class="form-control" rows="4" 
                                  onchange="adminPanel.updateContent('popup', 'subtitle', this.value)">${this.editingContent.popup.subtitle}</textarea>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Buton Metni</label>
                        <input type="text" class="form-control" value="${this.editingContent.popup.buttonText}" 
                               onchange="adminPanel.updateContent('popup', 'buttonText', this.value)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Reddetme Metni</label>
                        <input type="text" class="form-control" value="${this.editingContent.popup.dismissText}" 
                               onchange="adminPanel.updateContent('popup', 'dismissText', this.value)">
                    </div>
                    
                    <div class="mt-4">
                        <button class="btn btn-warning" onclick="adminPanel.testPopup()">
                            <i class="bi bi-eye me-1"></i>Popup'ı Test Et
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderColorsTab() {
        return `
            <h3><i class="bi bi-palette me-2"></i>Renk Düzenleme</h3>
            
            <div class="row">
                <div class="col-md-6">
                    <h5>Ana Renkler</h5>
                    <div class="mb-3">
                        <label class="form-label">Primary Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.primary}" 
                                   onchange="adminPanel.updateContent('colors', 'primary', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.primary}" 
                                   onchange="adminPanel.updateContent('colors', 'primary', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Secondary Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.secondary}" 
                                   onchange="adminPanel.updateContent('colors', 'secondary', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.secondary}" 
                                   onchange="adminPanel.updateContent('colors', 'secondary', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Accent Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.accent}" 
                                   onchange="adminPanel.updateContent('colors', 'accent', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.accent}" 
                                   onchange="adminPanel.updateContent('colors', 'accent', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Success Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.success}" 
                                   onchange="adminPanel.updateContent('colors', 'success', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.success}" 
                                   onchange="adminPanel.updateContent('colors', 'success', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Warning Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.warning}" 
                                   onchange="adminPanel.updateContent('colors', 'warning', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.warning}" 
                                   onchange="adminPanel.updateContent('colors', 'warning', this.value)">
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h5>Diğer Renkler</h5>
                    <div class="mb-3">
                        <label class="form-label">Error Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.error}" 
                                   onchange="adminPanel.updateContent('colors', 'error', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.error}" 
                                   onchange="adminPanel.updateContent('colors', 'error', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Background Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.background}" 
                                   onchange="adminPanel.updateContent('colors', 'background', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.background}" 
                                   onchange="adminPanel.updateContent('colors', 'background', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Surface Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.surface}" 
                                   onchange="adminPanel.updateContent('colors', 'surface', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.surface}" 
                                   onchange="adminPanel.updateContent('colors', 'surface', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Text Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.text}" 
                                   onchange="adminPanel.updateContent('colors', 'text', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.text}" 
                                   onchange="adminPanel.updateContent('colors', 'text', this.value)">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Secondary Text Color</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="color" value="${this.editingContent.colors.textSecondary}" 
                                   onchange="adminPanel.updateContent('colors', 'textSecondary', this.value)">
                            <input type="text" class="form-control" value="${this.editingContent.colors.textSecondary}" 
                                   onchange="adminPanel.updateContent('colors', 'textSecondary', this.value)">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <button class="btn btn-primary" onclick="adminPanel.previewColors()">
                    <i class="bi bi-eye me-1"></i>Renkleri Önizle
                </button>
                <button class="btn btn-secondary ms-2" onclick="adminPanel.resetColors()">
                    <i class="bi bi-arrow-clockwise me-1"></i>Varsayılana Sıfırla
                </button>
            </div>
        `;
    }

    setupTabEventListeners() {
        // Setup event listeners for current tab
    }

    updateContent(section, field, value) {
        this.editingContent[section][field] = value;
        this.hasChanges = true;
        this.showSaveButton();
    }

    updateCtaFeature(index, value) {
        this.editingContent.cta.features[index] = value;
        this.hasChanges = true;
        this.showSaveButton();
    }

    addCtaFeature() {
        this.editingContent.cta.features.push('New feature');
        this.hasChanges = true;
        this.showSaveButton();
        this.renderTabContent('cta');
    }

    removeCtaFeature(index) {
        this.editingContent.cta.features.splice(index, 1);
        this.hasChanges = true;
        this.showSaveButton();
        this.renderTabContent('cta');
    }

    showSaveButton() {
        document.getElementById('save-changes').classList.remove('d-none');
    }

    saveChanges() {
        localStorage.setItem('keto-content', JSON.stringify(this.editingContent));
        this.hasChanges = false;
        document.getElementById('save-changes').classList.add('d-none');
        
        // Update main page
        if (window.app) {
            window.app.updatePageContent(this.editingContent);
        }
        
        this.showSuccessAlert('Değişiklikler kaydedildi!');
    }

    testPopup() {
        // Update popup content first
        this.updatePopupContent();
        
        // Show the popup
        const modal = new bootstrap.Modal(document.getElementById('exitModal'));
        modal.show();
    }

    updatePopupContent() {
        document.getElementById('popup-title').textContent = this.editingContent.popup.title;
        document.getElementById('popup-subtitle').textContent = this.editingContent.popup.subtitle;
        document.getElementById('popup-button').textContent = this.editingContent.popup.buttonText;
        document.getElementById('popup-dismiss').textContent = this.editingContent.popup.dismissText;
    }

    previewColors() {
        if (window.app) {
            window.app.updateColors(this.editingContent.colors);
        }
        this.showSuccessAlert('Renkler önizlendi! Ana sayfayı kontrol edin.');
    }

    resetColors() {
        this.editingContent.colors = this.getDefaultContent().colors;
        this.hasChanges = true;
        this.showSaveButton();
        this.renderTabContent('colors');
    }

    exportEmails() {
        const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
        const csvContent = [
            ['Email', 'Kaynak', 'Tarih', 'Quiz Cevapları'].join(','),
            ...emails.map(email => [
                email.email,
                email.source,
                new Date(email.timestamp).toLocaleDateString('tr-TR'),
                email.quizAnswers ? email.quizAnswers.join(';') : ''
            ].join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, 'email-aboneleri.csv');
    }

    exportVisitors() {
        const visitors = JSON.parse(localStorage.getItem('keto-visitors') || '[]');
        const csvContent = [
            ['Tarih', 'Sayfa', 'Referrer', 'User Agent'].join(','),
            ...visitors.map(visitor => [
                new Date(visitor.timestamp).toLocaleDateString('tr-TR'),
                `"${visitor.page}"`,
                `"${visitor.referrer}"`,
                `"${visitor.userAgent}"`
            ].join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, 'site-ziyaretcileri.csv');
    }

    downloadCSV(content, filename) {
        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    deleteEmail(id) {
        if (confirm('Bu email adresini silmek istediğinizden emin misiniz?')) {
            const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
            const filtered = emails.filter(email => email.id !== id);
            localStorage.setItem('keto-emails', JSON.stringify(filtered));
            this.renderTabContent('emails');
            this.loadAdminData();
        }
    }

    getSourceLabel(source) {
        const labels = {
            'hero': 'Ana Banner',
            'quiz': 'Quiz',
            'exit-popup': 'Çıkış Pop-up',
            'sticky-bar': 'Yapışkan Çubuk',
            'cta': 'CTA Bölümü',
            'testimonials': 'Başarı Hikayeleri'
        };
        return labels[source] || source;
    }

    getBrowserInfo(userAgent) {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Other';
    }

    isThisWeek(date) {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return date >= weekStart;
    }

    isThisMonth(date) {
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    showSuccessAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-floating fade show';
        alert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Global functions for admin
function logout() {
    document.getElementById('admin-panel').classList.add('d-none');
    document.getElementById('admin-login').classList.add('d-none');
    document.body.style.overflow = 'auto';
    adminPanel.isLoggedIn = false;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});