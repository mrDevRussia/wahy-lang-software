/**
 * Wahy Cybersecurity Mode - Network Scanning Interpreter
 * مفسر فحص الشبكات لوضع الأمن السيبراني
 */

class WahyScanInterpreter {
    constructor() {
        this.scanResults = [];
        this.currentScan = null;
        this.allowedTargets = ['localhost', '127.0.0.1', '192.168.', '10.', '172.16.'];
    }

    /**
     * تهيئة المفسر
     */
    async initialize() {
        console.log('🔒 تم تهيئة مفسر فحص الشبكات لوضع الأمن السيبراني');
        this.reset();
    }

    /**
     * إعادة تعيين المفسر
     */
    reset() {
        this.scanResults = [];
        this.currentScan = null;
    }

    /**
     * تفسير كود وحي للفحص الأمني
     */
    interpret(code) {
        try {
            this.reset();
            const lines = code.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line || line.startsWith('//')) continue;
                
                this.processLine(line, i + 1);
            }

            return {
                success: true,
                html: this.generateSecurityReport(),
                type: 'security-scan',
                interpreter: 'wahy-scan',
                results: this.scanResults
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                type: 'security-scan',
                interpreter: 'wahy-scan'
            };
        }
    }

    /**
     * معالجة سطر واحد
     */
    processLine(line, lineNumber) {
        const parts = this.parseLine(line);
        if (!parts) return;

        const [command, ...args] = parts;

        switch (command) {
            case 'فحص':
            case 'scan':
                this.handleScanCommand(args, lineNumber);
                break;

            case 'تحليل':
            case 'analyze':
                this.handleAnalyzeCommand(args, lineNumber);
                break;

            case 'اختبر':
            case 'test':
                this.handleTestCommand(args, lineNumber);
                break;

            default:
                throw new Error(`أمر غير معروف في السطر ${lineNumber}: ${command}`);
        }
    }

    /**
     * تحليل السطر إلى أجزاء
     */
    parseLine(line) {
        const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
        const parts = [];
        let match;

        while ((match = regex.exec(line)) !== null) {
            parts.push(match[1] || match[2] || match[3]);
        }

        return parts.length > 0 ? parts : null;
    }

    /**
     * معالجة أوامر الفحص
     */
    handleScanCommand(args, lineNumber) {
        const [type, target] = args;
        const cleanTarget = target?.replace(/['"]/g, '');

        if (!this.isValidTarget(cleanTarget)) {
            throw new Error(`هدف غير مسموح للفحص في السطر ${lineNumber}: ${cleanTarget}`);
        }

        switch (type) {
            case 'المنافذ':
            case 'ports':
                this.scanPorts(cleanTarget);
                break;
            case 'الشبكة':
            case 'network':
                this.scanNetwork(cleanTarget);
                break;
            case 'الخدمات':
            case 'services':
                this.scanServices(cleanTarget);
                break;
            default:
                throw new Error(`نوع فحص غير معروف في السطر ${lineNumber}: ${type}`);
        }
    }

    /**
     * التحقق من صحة الهدف
     */
    isValidTarget(target) {
        if (!target) return false;
        
        // السماح فقط بالشبكات المحلية لأغراض التعلم
        return this.allowedTargets.some(allowed => target.startsWith(allowed));
    }

    /**
     * فحص المنافذ (محاكاة تعليمية)
     */
    scanPorts(target) {
        const commonPorts = [
            { port: 22, service: 'SSH', status: 'مفتوح', security: 'آمن' },
            { port: 80, service: 'HTTP', status: 'مفتوح', security: 'غير مشفر' },
            { port: 443, service: 'HTTPS', status: 'مفتوح', security: 'آمن' },
            { port: 21, service: 'FTP', status: 'مغلق', security: 'غير آمن' },
            { port: 3306, service: 'MySQL', status: 'محمي', security: 'آمن' }
        ];

        this.scanResults.push({
            type: 'port-scan',
            target,
            timestamp: new Date().toISOString(),
            results: commonPorts,
            summary: {
                total: commonPorts.length,
                open: commonPorts.filter(r => r.status === 'مفتوح').length,
                closed: commonPorts.filter(r => r.status === 'مغلق').length,
                protected: commonPorts.filter(r => r.status === 'محمي').length
            }
        });
    }

    /**
     * فحص الشبكة (محاكاة تعليمية)
     */
    scanNetwork(target) {
        const networkDevices = [
            { ip: '192.168.1.1', hostname: 'router.local', type: 'Router', status: 'نشط' },
            { ip: '192.168.1.100', hostname: 'pc-admin', type: 'Computer', status: 'نشط' },
            { ip: '192.168.1.101', hostname: 'laptop-user', type: 'Laptop', status: 'نشط' }
        ];

        this.scanResults.push({
            type: 'network-scan',
            target,
            timestamp: new Date().toISOString(),
            results: networkDevices,
            summary: {
                total: networkDevices.length,
                active: networkDevices.filter(d => d.status === 'نشط').length
            }
        });
    }

    /**
     * إنتاج تقرير الأمان
     */
    generateSecurityReport() {
        let html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير الأمان السيبراني - وحي</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #333;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .content {
            padding: 30px;
        }
        .scan-section {
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        .section-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
        }
        .section-content {
            padding: 20px;
        }
        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .results-table th,
        .results-table td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #e0e0e0;
        }
        .results-table th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .status-open { background: #d4edda; color: #155724; }
        .status-closed { background: #f8d7da; color: #721c24; }
        .status-protected { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🔒 تقرير الأمان السيبراني</h1>
        <div>تم إنشاؤه في: ${new Date().toLocaleString('ar-EG')}</div>
    </div>
    
    <div class="content">`;

        this.scanResults.forEach(scan => {
            html += this.generateScanSection(scan);
        });

        if (this.scanResults.length === 0) {
            html += `
                <div class="scan-section">
                    <div class="section-content" style="text-align: center; padding: 50px;">
                        <h3>لم يتم تنفيذ أي فحوصات أمنية</h3>
                        <p>استخدم أوامر الفحص مثل:</p>
                        <code>فحص المنافذ "localhost"</code><br>
                        <code>فحص الشبكة "192.168.1.1"</code>
                    </div>
                </div>`;
        }

        html += `
    </div>
</div>
</body>
</html>`;

        return html;
    }

    /**
     * إنتاج قسم فحص في التقرير
     */
    generateScanSection(scan) {
        const sectionTitles = {
            'port-scan': '🔍 فحص المنافذ',
            'network-scan': '🌐 فحص الشبكة',
            'service-scan': '⚙️ فحص الخدمات'
        };

        let html = `
            <div class="scan-section">
                <div class="section-header">
                    <h3>${sectionTitles[scan.type] || scan.type}</h3>
                    <small>الهدف: ${scan.target} | الوقت: ${new Date(scan.timestamp).toLocaleString('ar-EG')}</small>
                </div>
                <div class="section-content">`;

        // إضافة جدول النتائج
        if (scan.results && scan.results.length > 0) {
            html += '<table class="results-table"><thead><tr>';
            
            if (scan.type === 'port-scan') {
                html += '<th>المنفذ</th><th>الخدمة</th><th>الحالة</th><th>الأمان</th>';
            } else if (scan.type === 'network-scan') {
                html += '<th>عنوان IP</th><th>اسم الجهاز</th><th>النوع</th><th>الحالة</th>';
            }
            
            html += '</tr></thead><tbody>';
            
            scan.results.forEach(result => {
                html += '<tr>';
                if (scan.type === 'port-scan') {
                    const statusClass = result.status === 'مفتوح' ? 'status-open' : 
                                      result.status === 'مغلق' ? 'status-closed' : 'status-protected';
                    html += `<td>${result.port}</td><td>${result.service}</td>`;
                    html += `<td><span class="status-badge ${statusClass}">${result.status}</span></td>`;
                    html += `<td>${result.security}</td>`;
                } else if (scan.type === 'network-scan') {
                    html += `<td>${result.ip}</td><td>${result.hostname}</td><td>${result.type}</td><td>${result.status}</td>`;
                }
                html += '</tr>';
            });
            
            html += '</tbody></table>';
        }

        html += '</div></div>';
        return html;
    }
}

module.exports = WahyScanInterpreter;