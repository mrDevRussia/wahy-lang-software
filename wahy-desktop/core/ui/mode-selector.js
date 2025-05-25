/**
 * Wahy Dual Mode - واجهة اختيار الوضع
 * شاشة اختيار الوضع للمستخدم
 */

class ModeSelector {
    constructor(modeManager) {
        this.modeManager = modeManager;
        this.container = null;
        this.selectedMode = null;
        this.lastUsedMode = this.getLastUsedMode();
    }

    /**
     * إنشاء واجهة اختيار الوضع
     */
    createModeSelectionUI() {
        const container = document.createElement('div');
        container.className = 'mode-selector-container';
        container.innerHTML = `
            <div class="mode-selector-backdrop">
                <div class="mode-selector-modal">
                    <div class="mode-selector-header">
                        <div class="logo-section">
                            <div class="wahy-logo">
                                <span class="logo-icon">🚀</span>
                                <h1>Wahy وَحي</h1>
                                <p class="version">Dual Mode v2.0</p>
                            </div>
                        </div>
                        <h2>اختر وضع العمل المناسب</h2>
                        <p class="subtitle">كل وضع مصمم خصيصاً لنوع مختلف من المشاريع</p>
                    </div>
                    
                    <div class="modes-grid">
                        ${this.createModeCards()}
                    </div>
                    
                    <div class="mode-preview" id="mode-preview">
                        <div class="preview-placeholder">
                            <span class="preview-icon">👆</span>
                            <p>اختر وضعاً لرؤية التفاصيل</p>
                        </div>
                    </div>
                    
                    <div class="mode-selector-footer">
                        <div class="quick-options">
                            <label class="remember-choice">
                                <input type="checkbox" id="remember-mode" ${this.lastUsedMode ? 'checked' : ''}>
                                <span>تذكر اختياري</span>
                            </label>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-secondary" onclick="this.showHelp()">المساعدة</button>
                            <button class="btn-primary" id="start-mode-btn" disabled>بدء العمل</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // إضافة الأنماط
        this.addStyles();
        
        // ربط الأحداث
        this.bindEvents(container);
        
        return container;
    }

    /**
     * إنشاء بطاقات الأوضاع
     */
    createModeCards() {
        const modes = this.modeManager.getAvailableModes();
        
        return modes.map(mode => `
            <div class="mode-card" data-mode-id="${mode.id}" style="--mode-color: ${mode.color}">
                <div class="mode-card-header">
                    <div class="mode-icon">${mode.icon}</div>
                    <div class="mode-badge ${mode.id === this.lastUsedMode ? 'last-used' : ''}">
                        ${mode.id === this.lastUsedMode ? 'آخر استخدام' : 'جديد'}
                    </div>
                </div>
                
                <div class="mode-card-content">
                    <h3>${mode.name}</h3>
                    <p class="mode-name-en">${mode.nameEn}</p>
                    <p class="mode-description">${mode.description}</p>
                    
                    <div class="mode-features">
                        <div class="feature-list">
                            <div class="feature-item">
                                <span class="feature-icon">📝</span>
                                <span>${mode.interpreters.length} مفسر</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📚</span>
                                <span>${mode.libraries.length} مكتبة</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">⚡</span>
                                <span>${Math.round(mode.memoryLimit / 1024 / 1024)} MB</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mode-card-footer">
                    <div class="shortcuts-preview">
                        ${mode.shortcuts.slice(0, 2).map(shortcut => 
                            `<span class="shortcut-key">${shortcut.key}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * إضافة الأنماط CSS
     */
    addStyles() {
        if (document.getElementById('mode-selector-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'mode-selector-styles';
        styles.textContent = `
            .mode-selector-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .mode-selector-backdrop {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .mode-selector-modal {
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                max-width: 1000px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalSlideIn 0.5s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .mode-selector-header {
                text-align: center;
                padding: 40px 40px 20px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 20px 20px 0 0;
            }
            
            .logo-section {
                margin-bottom: 20px;
            }
            
            .wahy-logo {
                display: inline-block;
            }
            
            .logo-icon {
                font-size: 48px;
                display: block;
                margin-bottom: 10px;
            }
            
            .wahy-logo h1 {
                margin: 0;
                font-size: 2.5em;
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
            }
            
            .version {
                color: #666;
                font-size: 0.9em;
                margin: 5px 0 0 0;
            }
            
            .mode-selector-header h2 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.8em;
            }
            
            .subtitle {
                color: #666;
                margin: 0;
                font-size: 1.1em;
            }
            
            .modes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
                padding: 30px 40px;
            }
            
            .mode-card {
                border: 2px solid #e0e0e0;
                border-radius: 15px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                background: white;
            }
            
            .mode-card:hover {
                border-color: var(--mode-color);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            
            .mode-card.selected {
                border-color: var(--mode-color);
                box-shadow: 0 0 0 3px rgba(var(--mode-color), 0.1);
                background: linear-gradient(135deg, var(--mode-color)08, var(--mode-color)03);
            }
            
            .mode-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
            }
            
            .mode-icon {
                font-size: 48px;
                line-height: 1;
            }
            
            .mode-badge {
                background: #f0f0f0;
                color: #666;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: 500;
            }
            
            .mode-badge.last-used {
                background: #e3f2fd;
                color: #1976d2;
            }
            
            .mode-card-content h3 {
                margin: 0 0 5px 0;
                font-size: 1.5em;
                color: #333;
            }
            
            .mode-name-en {
                color: #888;
                font-size: 0.9em;
                margin: 0 0 15px 0;
                font-style: italic;
            }
            
            .mode-description {
                color: #666;
                line-height: 1.6;
                margin: 0 0 20px 0;
            }
            
            .mode-features {
                margin-bottom: 20px;
            }
            
            .feature-list {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 5px;
                background: #f8f9fa;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.85em;
                color: #555;
            }
            
            .feature-icon {
                font-size: 14px;
            }
            
            .mode-card-footer {
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .shortcuts-preview {
                display: flex;
                gap: 8px;
            }
            
            .shortcut-key {
                background: #333;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.75em;
                font-family: monospace;
            }
            
            .mode-preview {
                margin: 0 40px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                min-height: 120px;
                transition: all 0.3s ease;
            }
            
            .preview-placeholder {
                text-align: center;
                color: #999;
                padding: 30px;
            }
            
            .preview-icon {
                font-size: 24px;
                display: block;
                margin-bottom: 10px;
            }
            
            .mode-selector-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30px 40px;
                border-top: 1px solid #eee;
            }
            
            .remember-choice {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #666;
                cursor: pointer;
            }
            
            .action-buttons {
                display: flex;
                gap: 15px;
            }
            
            .btn-primary, .btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 1em;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            
            .btn-primary:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .btn-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            
            .btn-secondary {
                background: #f8f9fa;
                color: #666;
                border: 1px solid #ddd;
            }
            
            .btn-secondary:hover {
                background: #e9ecef;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * ربط الأحداث
     */
    bindEvents(container) {
        // اختيار الوضع
        container.addEventListener('click', (e) => {
            const modeCard = e.target.closest('.mode-card');
            if (modeCard) {
                this.selectMode(modeCard.dataset.modeId);
            }
        });

        // زر البدء
        const startBtn = container.querySelector('#start-mode-btn');
        startBtn.addEventListener('click', () => {
            if (this.selectedMode) {
                this.startSelectedMode();
            }
        });

        this.container = container;
    }

    /**
     * اختيار وضع
     */
    selectMode(modeId) {
        const modes = this.modeManager.getAvailableModes();
        const mode = modes.find(m => m.id === modeId);
        
        if (!mode) return;

        // إزالة التحديد السابق
        this.container.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });

        // تحديد الوضع الجديد
        const selectedCard = this.container.querySelector(`[data-mode-id="${modeId}"]`);
        selectedCard.classList.add('selected');
        
        this.selectedMode = mode;
        
        // تفعيل زر البدء
        const startBtn = this.container.querySelector('#start-mode-btn');
        startBtn.disabled = false;
        startBtn.textContent = `بدء وضع ${mode.name}`;
        
        // عرض معاينة الوضع
        this.showModePreview(mode);
    }

    /**
     * عرض معاينة الوضع
     */
    showModePreview(mode) {
        const preview = this.container.querySelector('#mode-preview');
        
        preview.innerHTML = `
            <div class="mode-preview-content">
                <div class="preview-header">
                    <span class="preview-mode-icon">${mode.icon}</span>
                    <h4>${mode.name} - ${mode.nameEn}</h4>
                </div>
                
                <div class="preview-details">
                    <div class="detail-section">
                        <h5>المفسرات المتاحة:</h5>
                        <div class="interpreter-list">
                            ${mode.interpreters.map(interpreter => 
                                `<span class="interpreter-tag">${interpreter}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>المكتبات المدمجة:</h5>
                        <div class="library-list">
                            ${mode.libraries.map(library => 
                                `<span class="library-tag">${library}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>الاختصارات السريعة:</h5>
                        <div class="shortcuts-list">
                            ${mode.shortcuts.map(shortcut => 
                                `<div class="shortcut-item">
                                    <span class="shortcut-key">${shortcut.key}</span>
                                    <span class="shortcut-action">${shortcut.action}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة أنماط المعاينة
        this.addPreviewStyles();
    }

    /**
     * إضافة أنماط المعاينة
     */
    addPreviewStyles() {
        if (document.getElementById('mode-preview-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'mode-preview-styles';
        styles.textContent = `
            .mode-preview-content {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .preview-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e0e0e0;
            }
            
            .preview-mode-icon {
                font-size: 24px;
            }
            
            .preview-header h4 {
                margin: 0;
                color: #333;
            }
            
            .preview-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }
            
            .detail-section h5 {
                margin: 0 0 10px 0;
                color: #555;
                font-size: 0.9em;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .interpreter-tag, .library-tag {
                display: inline-block;
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                margin: 2px;
                font-family: monospace;
            }
            
            .library-tag {
                background: #f3e5f5;
                color: #7b1fa2;
            }
            
            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .shortcut-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .shortcut-action {
                font-size: 0.8em;
                color: #666;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * بدء الوضع المحدد
     */
    async startSelectedMode() {
        if (!this.selectedMode) return;

        try {
            // حفظ الاختيار إذا كان مطلوباً
            const rememberCheckbox = this.container.querySelector('#remember-mode');
            if (rememberCheckbox.checked) {
                this.saveLastUsedMode(this.selectedMode.id);
            }

            // إخفاء واجهة الاختيار
            this.container.style.display = 'none';
            
            // بدء تحميل الوضع
            await this.modeManager.switchMode(this.selectedMode.id);
            
            // إزالة واجهة الاختيار
            this.container.remove();
            
            console.log(`🚀 تم بدء وضع: ${this.selectedMode.name}`);

        } catch (error) {
            console.error('❌ خطأ في بدء الوضع:', error);
            alert(`خطأ في بدء الوضع: ${error.message}`);
        }
    }

    /**
     * حفظ آخر وضع مستخدم
     */
    saveLastUsedMode(modeId) {
        try {
            localStorage.setItem('wahy-last-mode', modeId);
        } catch (error) {
            console.warn('تعذر حفظ آخر وضع مستخدم:', error);
        }
    }

    /**
     * الحصول على آخر وضع مستخدم
     */
    getLastUsedMode() {
        try {
            return localStorage.getItem('wahy-last-mode');
        } catch (error) {
            return null;
        }
    }

    /**
     * عرض المساعدة
     */
    showHelp() {
        alert('مساعدة Wahy Dual Mode:\n\n' +
              '🌐 وضع تطوير الويب: لإنشاء مواقع وتطبيقات الويب\n' +
              '🔒 وضع الأمن السيبراني: لأدوات التحليل والحماية\n\n' +
              'يمكنك التبديل بين الأوضاع في أي وقت من قائمة العرض.');
    }
}

module.exports = ModeSelector;