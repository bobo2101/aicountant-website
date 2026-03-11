// ==================== 
// 多语言翻译数据
// ==================== 
const translations = {
    // 简体中文
    'zh': {
        'nav.home': '首页',
        'nav.about': '关于我们',
        'nav.services': '服务',
        'nav.contact': '联系我们',
        'hero.title': '智能会计，轻松管理',
        'hero.subtitle': 'AIcountant 结合人工智能与专业会计服务，为您的企业提供高效、准确的财务解决方案',
        'hero.cta': '查看服务',
        'badges.ai': '7×24小时AI助手',
        'badges.refund': '30天不满意退款',
        'badges.security': '银行级数据加密',
        'badges.experts': '注册会计师团队',
        'process.title': '简单三步，开始使用',
        'process.step1.title': '在线咨询',
        'process.step1.desc': '预约免费咨询，了解您的需求',
        'process.step2.title': '方案定制',
        'process.step2.desc': '为您量身定制服务方案',
        'process.step3.title': '开始服务',
        'process.step3.desc': 'AI+专家全程为您服务',
        'services.title': '全方位企业服务',
        'services.subtitle': '从公司注册到财税审计，一站式解决您的所有需求',
        
        // Pricing labels
        'pricing.basic': '基础版',
        'pricing.standard': '标准版',
        'pricing.premium': '高级版',
        'pricing.popular': '推荐',
        'pricing.month': '/月',
        'pricing.once': '/一次性',
        'pricing.select': '选择方案',
        'pricing.contact': '联系我们',
        
        // Service 1: Company Setup
        'services.setup.title': '公司注册',
        'services.setup.desc': '快速、专业的公司注册服务，让您轻松开启创业之旅',
        'services.setup.basic.1': '公司名称核准',
        'services.setup.basic.2': '营业执照办理',
        'services.setup.basic.3': '公章刻制',
        'services.setup.basic.4': '基础咨询服务',
        'services.setup.standard.1': '包含基础版所有服务',
        'services.setup.standard.2': '银行开户指导',
        'services.setup.standard.3': '税务登记办理',
        'services.setup.standard.4': '首年记账服务',
        'services.setup.premium.1': '包含标准版所有服务',
        'services.setup.premium.2': '注册地址提供',
        'services.setup.premium.3': '全套公司秘书服务',
        'services.setup.premium.4': '专属顾问1对1',
        
        // Service 2: Company Secretary
        'services.secretary.title': '公司秘书',
        'services.secretary.desc': '专业公司秘书服务，确保您的企业合规运营',
        'services.secretary.basic.1': '法定文件存档',
        'services.secretary.basic.2': '年度申报提醒',
        'services.secretary.basic.3': '董事变更备案',
        'services.secretary.basic.4': '邮件通知服务',
        'services.secretary.standard.1': '包含基础版所有服务',
        'services.secretary.standard.2': '年度股东大会安排',
        'services.secretary.standard.3': '会议记录起草',
        'services.secretary.standard.4': '股权变更处理',
        'services.secretary.premium.1': '包含标准版所有服务',
        'services.secretary.premium.2': '注册地址服务',
        'services.secretary.premium.3': '商务信函代收',
        'services.secretary.premium.4': '专属秘书顾问',
        
        // Service 3: Bookkeeping
        'services.bookkeeping.title': '记账服务',
        'services.bookkeeping.desc': '智能化记账，让您的财务清晰透明',
        'services.bookkeeping.basic.1': '每月50笔以内',
        'services.bookkeeping.basic.2': '银行对账',
        'services.bookkeeping.basic.3': '基础报表',
        'services.bookkeeping.basic.4': 'AI智能分类',
        'services.bookkeeping.standard.1': '每月200笔以内',
        'services.bookkeeping.standard.2': '应收应付管理',
        'services.bookkeeping.standard.3': '完整财务报表',
        'services.bookkeeping.standard.4': '专属会计师',
        'services.bookkeeping.premium.1': '不限笔数',
        'services.bookkeeping.premium.2': '库存管理',
        'services.bookkeeping.premium.3': '多维度分析',
        'services.bookkeeping.premium.4': 'CFO级顾问',
        
        // Service 4: Accounting
        'services.accounting.title': '会计服务',
        'services.accounting.desc': '专业会计团队，为您的企业保驾护航',
        'services.accounting.basic.1': '日常账务处理',
        'services.accounting.basic.2': '月度财务报表',
        'services.accounting.basic.3': '凭证整理归档',
        'services.accounting.basic.4': '在线咨询支持',
        'services.accounting.standard.1': '包含基础版所有服务',
        'services.accounting.standard.2': '成本核算分析',
        'services.accounting.standard.3': '预算编制服务',
        'services.accounting.standard.4': '季度经营分析',
        'services.accounting.premium.1': '包含标准版所有服务',
        'services.accounting.premium.2': '财务预测建模',
        'services.accounting.premium.3': '内控体系建立',
        'services.accounting.premium.4': '高级财务顾问',
        
        // Service 5: Auditing
        'services.auditing.title': '审计服务',
        'services.auditing.desc': '独立、客观的审计服务，提升企业公信力',
        'services.auditing.basic.1': '内部审计',
        'services.auditing.basic.2': '财务报表审阅',
        'services.auditing.basic.3': '合规性检查',
        'services.auditing.basic.4': '审计报告',
        'services.auditing.standard.1': '年度财务审计',
        'services.auditing.standard.2': '税务审计',
        'services.auditing.standard.3': '专项审计',
        'services.auditing.standard.4': '审计意见书',
        'services.auditing.premium.1': 'IPO审计',
        'services.auditing.premium.2': '并购审计',
        'services.auditing.premium.3': '集团审计',
        'services.auditing.premium.4': '国际审计标准',
        
        // Service 6: Taxation
        'services.taxation.title': '税务服务',
        'services.taxation.desc': '专业税务规划，合法节税，合规申报',
        'services.taxation.basic.1': '月度纳税申报',
        'services.taxation.basic.2': '增值税申报',
        'services.taxation.basic.3': '个税申报',
        'services.taxation.basic.4': '税务提醒',
        'services.taxation.standard.1': '包含基础版所有服务',
        'services.taxation.standard.2': '企业所得税申报',
        'services.taxation.standard.3': '税务筹划建议',
        'services.taxation.standard.4': '税务风险诊断',
        'services.taxation.premium.1': '包含标准版所有服务',
        'services.taxation.premium.2': '跨境税务规划',
        'services.taxation.premium.3': '税收优惠申请',
        'services.taxation.premium.4': '税务稽查应对',
        
        'about.title': '关于 AIcountant',
        'about.whoWeAre': '我们是谁',
        'about.whoWeAreDesc': 'AIcountant 是一家融合人工智能技术的现代会计服务公司，拥有超过10年的行业经验。我们的团队由专业会计师和AI技术专家组成，致力于为客户提供智能化的财务管理服务。',
        'about.mission': '我们的使命',
        'about.missionDesc': '通过AI技术革新传统会计服务，帮助企业实现财务自动化，降低成本，提高效率，让企业管理更轻松。',
        'stats.clients': '服务企业',
        'stats.experience': '年行业经验',
        'stats.team': '专业团队',
        'testimonials.title': '客户好评',
        'testimonials.1.content': '"用了AIcountant后，每个月的记账报税再也不头疼了。AI助手响应很快，有问题随时能解答。"',
        'testimonials.1.name': '张先生',
        'testimonials.1.title': '某科技公司创始人',
        'testimonials.2.content': '"作为外资企业，中国的税务规定很复杂。AIcountant的团队非常专业，帮我们解决了很多问题。"',
        'testimonials.2.name': 'Sarah Chen',
        'testimonials.2.title': '外资企业CFO',
        'testimonials.3.content': '"从公司注册到日常记账，一站式服务非常方便。价格透明，没有隐藏费用。"',
        'testimonials.3.name': '李女士',
        'testimonials.3.title': '电商创业者',
        'contact.title': '联系我们',
        'contact.subtitle': '获取免费咨询',
        'contact.desc': '留下您的联系方式，我们的专家将在24小时内与您联系',
        'contact.address': '北京市朝阳区建国路88号',
        'form.name': '姓名',
        'form.email': '邮箱',
        'form.phone': '电话',
        'form.service': '感兴趣的服务',
        'form.service.placeholder': '请选择...',
        'form.service.startup': '创业起步套餐',
        'form.service.operations': '日常运营服务',
        'form.service.growth': '企业升级方案',
        'form.service.other': '其他咨询',
        'form.message': '留言',
        'form.submit': '提交咨询',
        'footer.rights': '版权所有',
        'notification.success': '感谢您的咨询！我们将在24小时内与您联系。',
        'notification.error': '请填写姓名和邮箱！',
        'notification.emailError': '请输入有效的邮箱地址！'
    },
    // 英文
    'en': {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.services': 'Services',
        'nav.contact': 'Contact',
        'hero.title': 'Smart Accounting, Easy Management',
        'hero.subtitle': 'AIcountant combines artificial intelligence with professional accounting services to provide efficient and accurate financial solutions for your business',
        'hero.cta': 'View Services',
        'badges.ai': '7×24 AI Assistant',
        'badges.refund': '30-Day Money Back',
        'badges.security': 'Bank-Grade Security',
        'badges.experts': 'Certified Accountants',
        'process.title': 'Get Started in 3 Simple Steps',
        'process.step1.title': 'Consultation',
        'process.step1.desc': 'Book a free consultation to discuss your needs',
        'process.step2.title': 'Custom Plan',
        'process.step2.desc': 'We tailor a service plan just for you',
        'process.step3.title': 'Start Service',
        'process.step3.desc': 'AI + experts serve you throughout',
        'services.title': 'Comprehensive Business Services',
        'services.subtitle': 'From company registration to tax & audit, one-stop solution for all your needs',
        
        // Pricing labels
        'pricing.basic': 'Basic',
        'pricing.standard': 'Standard',
        'pricing.premium': 'Premium',
        'pricing.popular': 'Popular',
        'pricing.month': '/month',
        'pricing.once': '/one-time',
        'pricing.select': 'Select Plan',
        'pricing.contact': 'Contact Us',
        
        // Service 1: Company Setup
        'services.setup.title': 'Company Setup',
        'services.setup.desc': 'Fast and professional company registration service to kickstart your business journey',
        'services.setup.basic.1': 'Company name reservation',
        'services.setup.basic.2': 'Business license application',
        'services.setup.basic.3': 'Company chop engraving',
        'services.setup.basic.4': 'Basic consultation',
        'services.setup.standard.1': 'All Basic features included',
        'services.setup.standard.2': 'Bank account guidance',
        'services.setup.standard.3': 'Tax registration',
        'services.setup.standard.4': 'First year bookkeeping',
        'services.setup.premium.1': 'All Standard features included',
        'services.setup.premium.2': 'Registered office address',
        'services.setup.premium.3': 'Full company secretary service',
        'services.setup.premium.4': 'Dedicated 1-on-1 consultant',
        
        // Service 2: Company Secretary
        'services.secretary.title': 'Company Secretary',
        'services.secretary.desc': 'Professional company secretarial services to ensure your business stays compliant',
        'services.secretary.basic.1': 'Statutory records maintenance',
        'services.secretary.basic.2': 'Annual filing reminders',
        'services.secretary.basic.3': 'Director changes filing',
        'services.secretary.basic.4': 'Email notifications',
        'services.secretary.standard.1': 'All Basic features included',
        'services.secretary.standard.2': 'Annual general meeting arrangement',
        'services.secretary.standard.3': 'Minutes drafting',
        'services.secretary.standard.4': 'Share transfer handling',
        'services.secretary.premium.1': 'All Standard features included',
        'services.secretary.premium.2': 'Registered address service',
        'services.secretary.premium.3': 'Business correspondence handling',
        'services.secretary.premium.4': 'Dedicated secretary advisor',
        
        // Service 3: Bookkeeping
        'services.bookkeeping.title': 'Bookkeeping',
        'services.bookkeeping.desc': 'Intelligent bookkeeping for clear and transparent finances',
        'services.bookkeeping.basic.1': 'Up to 50 entries/month',
        'services.bookkeeping.basic.2': 'Bank reconciliation',
        'services.bookkeeping.basic.3': 'Basic reports',
        'services.bookkeeping.basic.4': 'AI auto-categorization',
        'services.bookkeeping.standard.1': 'Up to 200 entries/month',
        'services.bookkeeping.standard.2': 'AR/AP management',
        'services.bookkeeping.standard.3': 'Complete financial reports',
        'services.bookkeeping.standard.4': 'Dedicated accountant',
        'services.bookkeeping.premium.1': 'Unlimited entries',
        'services.bookkeeping.premium.2': 'Inventory management',
        'services.bookkeeping.premium.3': 'Multi-dimensional analysis',
        'services.bookkeeping.premium.4': 'CFO-level advisor',
        
        // Service 4: Accounting
        'services.accounting.title': 'Accounting',
        'services.accounting.desc': 'Professional accounting team to safeguard your business',
        'services.accounting.basic.1': 'Daily accounting processing',
        'services.accounting.basic.2': 'Monthly financial statements',
        'services.accounting.basic.3': 'Voucher organization',
        'services.accounting.basic.4': 'Online support',
        'services.accounting.standard.1': 'All Basic features included',
        'services.accounting.standard.2': 'Cost analysis',
        'services.accounting.standard.3': 'Budget preparation',
        'services.accounting.standard.4': 'Quarterly business analysis',
        'services.accounting.premium.1': 'All Standard features included',
        'services.accounting.premium.2': 'Financial forecasting',
        'services.accounting.premium.3': 'Internal control setup',
        'services.accounting.premium.4': 'Senior financial advisor',
        
        // Service 5: Auditing
        'services.auditing.title': 'Auditing',
        'services.auditing.desc': 'Independent and objective auditing services to enhance credibility',
        'services.auditing.basic.1': 'Internal audit',
        'services.auditing.basic.2': 'Financial statement review',
        'services.auditing.basic.3': 'Compliance check',
        'services.auditing.basic.4': 'Audit report',
        'services.auditing.standard.1': 'Annual financial audit',
        'services.auditing.standard.2': 'Tax audit',
        'services.auditing.standard.3': 'Special audit',
        'services.auditing.standard.4': 'Audit opinion letter',
        'services.auditing.premium.1': 'IPO audit',
        'services.auditing.premium.2': 'M&A audit',
        'services.auditing.premium.3': 'Group audit',
        'services.auditing.premium.4': 'International standards',
        
        // Service 6: Taxation
        'services.taxation.title': 'Taxation',
        'services.taxation.desc': 'Professional tax planning for legal tax savings and compliant filing',
        'services.taxation.basic.1': 'Monthly tax filing',
        'services.taxation.basic.2': 'VAT filing',
        'services.taxation.basic.3': 'Individual income tax',
        'services.taxation.basic.4': 'Tax reminders',
        'services.taxation.standard.1': 'All Basic features included',
        'services.taxation.standard.2': 'Corporate income tax filing',
        'services.taxation.standard.3': 'Tax planning advice',
        'services.taxation.standard.4': 'Tax risk assessment',
        'services.taxation.premium.1': 'All Standard features included',
        'services.taxation.premium.2': 'Cross-border tax planning',
        'services.taxation.premium.3': 'Tax incentive application',
        'services.taxation.premium.4': 'Tax audit defense',
        
        'about.title': 'About AIcountant',
        'about.whoWeAre': 'Who We Are',
        'about.whoWeAreDesc': 'AIcountant is a modern accounting service company that integrates AI technology, with over 10 years of industry experience. Our team consists of professional accountants and AI technology experts, dedicated to providing intelligent financial management services for our clients.',
        'about.mission': 'Our Mission',
        'about.missionDesc': 'To revolutionize traditional accounting services through AI technology, helping businesses achieve financial automation, reduce costs, improve efficiency, and make business management easier.',
        'stats.clients': 'Clients Served',
        'stats.experience': 'Years Experience',
        'stats.team': 'Professional Team',
        'testimonials.title': 'Client Testimonials',
        'testimonials.1.content': '"Since using AIcountant, monthly bookkeeping and tax filing are no longer headaches. The AI assistant responds quickly and answers questions anytime."',
        'testimonials.1.name': 'Mr. Zhang',
        'testimonials.1.title': 'Tech Startup Founder',
        'testimonials.2.content': '"As a foreign enterprise, China\'s tax regulations are complex. The AIcountant team is very professional and has helped us solve many problems."',
        'testimonials.2.name': 'Sarah Chen',
        'testimonials.2.title': 'CFO, Foreign Enterprise',
        'testimonials.3.content': '"From company registration to daily bookkeeping, the one-stop service is very convenient. Transparent pricing with no hidden fees."',
        'testimonials.3.name': 'Ms. Li',
        'testimonials.3.title': 'E-commerce Entrepreneur',
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Get Free Consultation',
        'contact.desc': 'Leave your contact information and our experts will contact you within 24 hours',
        'contact.address': 'No. 88 Jianguo Road, Chaoyang District, Beijing',
        'form.name': 'Name',
        'form.email': 'Email',
        'form.phone': 'Phone',
        'form.service': 'Service Interest',
        'form.service.placeholder': 'Please select...',
        'form.service.startup': 'Startup Package',
        'form.service.operations': 'Operations Service',
        'form.service.growth': 'Growth Solutions',
        'form.service.other': 'Other Inquiry',
        'form.message': 'Message',
        'form.submit': 'Submit Inquiry',
        'footer.rights': 'All rights reserved',
        'notification.success': 'Thank you for your inquiry! We will contact you within 24 hours.',
        'notification.error': 'Please fill in name and email!',
        'notification.emailError': 'Please enter a valid email address!'
    },
    // 繁体中文
    'zh-TW': {
        'nav.home': '首頁',
        'nav.about': '關於我們',
        'nav.services': '服務',
        'nav.contact': '聯繫我們',
        'hero.title': '智能會計，輕鬆管理',
        'hero.subtitle': 'AIcountant 結合人工智能與專業會計服務，為您的企業提供高效、準確的財務解決方案',
        'hero.cta': '查看服務',
        'badges.ai': '7×24小時AI助手',
        'badges.refund': '30天不滿意退款',
        'badges.security': '銀行級數據加密',
        'badges.experts': '註冊會計師團隊',
        'process.title': '簡單三步，開始使用',
        'process.step1.title': '在線諮詢',
        'process.step1.desc': '預約免費諮詢，了解您的需求',
        'process.step2.title': '方案定製',
        'process.step2.desc': '為您量身定製服務方案',
        'process.step3.title': '開始服務',
        'process.step3.desc': 'AI+專家全程為您服務',
        'services.title': '全方位企業服務',
        'services.subtitle': '從公司註冊到財稅審計，一站式解決您的所有需求',
        
        // Pricing labels
        'pricing.basic': '基礎版',
        'pricing.standard': '標準版',
        'pricing.premium': '高級版',
        'pricing.popular': '推薦',
        'pricing.month': '/月',
        'pricing.once': '/一次性',
        'pricing.select': '選擇方案',
        'pricing.contact': '聯繫我們',
        
        // Service 1: Company Setup
        'services.setup.title': '公司註冊',
        'services.setup.desc': '快速、專業的公司註冊服務，讓您輕鬆開啟創業之旅',
        'services.setup.basic.1': '公司名稱核准',
        'services.setup.basic.2': '營業執照辦理',
        'services.setup.basic.3': '公章刻製',
        'services.setup.basic.4': '基礎諮詢服務',
        'services.setup.standard.1': '包含基礎版所有服務',
        'services.setup.standard.2': '銀行開戶指導',
        'services.setup.standard.3': '稅務登記辦理',
        'services.setup.standard.4': '首年記賬服務',
        'services.setup.premium.1': '包含標準版所有服務',
        'services.setup.premium.2': '註冊地址提供',
        'services.setup.premium.3': '全套公司秘書服務',
        'services.setup.premium.4': '專屬顧問1對1',
        
        // Service 2: Company Secretary
        'services.secretary.title': '公司秘書',
        'services.secretary.desc': '專業公司秘書服務，確保您的企業合規運營',
        'services.secretary.basic.1': '法定文件存檔',
        'services.secretary.basic.2': '年度申報提醒',
        'services.secretary.basic.3': '董事變更備案',
        'services.secretary.basic.4': '郵件通知服務',
        'services.secretary.standard.1': '包含基礎版所有服務',
        'services.secretary.standard.2': '年度股東大會安排',
        'services.secretary.standard.3': '會議記錄起草',
        'services.secretary.standard.4': '股權變更處理',
        'services.secretary.premium.1': '包含標準版所有服務',
        'services.secretary.premium.2': '註冊地址服務',
        'services.secretary.premium.3': '商務信函代收',
        'services.secretary.premium.4': '專屬秘書顧問',
        
        // Service 3: Bookkeeping
        'services.bookkeeping.title': '記賬服務',
        'services.bookkeeping.desc': '智能化記賬，讓您的財務清晰透明',
        'services.bookkeeping.basic.1': '每月50筆以內',
        'services.bookkeeping.basic.2': '銀行對賬',
        'services.bookkeeping.basic.3': '基礎報表',
        'services.bookkeeping.basic.4': 'AI智能分類',
        'services.bookkeeping.standard.1': '每月200筆以內',
        'services.bookkeeping.standard.2': '應收應付管理',
        'services.bookkeeping.standard.3': '完整財務報表',
        'services.bookkeeping.standard.4': '專屬會計師',
        'services.bookkeeping.premium.1': '不限筆數',
        'services.bookkeeping.premium.2': '庫存管理',
        'services.bookkeeping.premium.3': '多維度分析',
        'services.bookkeeping.premium.4': 'CFO級顧問',
        
        // Service 4: Accounting
        'services.accounting.title': '會計服務',
        'services.accounting.desc': '專業會計團隊，為您的企業保駕護航',
        'services.accounting.basic.1': '日常賬務處理',
        'services.accounting.basic.2': '月度財務報表',
        'services.accounting.basic.3': '憑證整理歸檔',
        'services.accounting.basic.4': '在線諮詢支持',
        'services.accounting.standard.1': '包含基礎版所有服務',
        'services.accounting.standard.2': '成本核算分析',
        'services.accounting.standard.3': '預算編制服務',
        'services.accounting.standard.4': '季度經營分析',
        'services.accounting.premium.1': '包含標準版所有服務',
        'services.accounting.premium.2': '財務預測建模',
        'services.accounting.premium.3': '內控體系建立',
        'services.accounting.premium.4': '高級財務顧問',
        
        // Service 5: Auditing
        'services.auditing.title': '審計服務',
        'services.auditing.desc': '獨立、客觀的審計服務，提升企業公信力',
        'services.auditing.basic.1': '內部審計',
        'services.auditing.basic.2': '財務報表審閱',
        'services.auditing.basic.3': '合規性檢查',
        'services.auditing.basic.4': '審計報告',
        'services.auditing.standard.1': '年度財務審計',
        'services.auditing.standard.2': '稅務審計',
        'services.auditing.standard.3': '專項審計',
        'services.auditing.standard.4': '審計意見書',
        'services.auditing.premium.1': 'IPO審計',
        'services.auditing.premium.2': '併購審計',
        'services.auditing.premium.3': '集團審計',
        'services.auditing.premium.4': '國際審計標準',
        
        // Service 6: Taxation
        'services.taxation.title': '稅務服務',
        'services.taxation.desc': '專業稅務規劃，合法節稅，合規申報',
        'services.taxation.basic.1': '月度納稅申報',
        'services.taxation.basic.2': '增值稅申報',
        'services.taxation.basic.3': '個稅申報',
        'services.taxation.basic.4': '稅務提醒',
        'services.taxation.standard.1': '包含基礎版所有服務',
        'services.taxation.standard.2': '企業所得稅申報',
        'services.taxation.standard.3': '稅務籌劃建議',
        'services.taxation.standard.4': '稅務風險診斷',
        'services.taxation.premium.1': '包含標準版所有服務',
        'services.taxation.premium.2': '跨境稅務規劃',
        'services.taxation.premium.3': '稅收優惠申請',
        'services.taxation.premium.4': '稅務稽查應對',
        
        'about.title': '關於 AIcountant',
        'about.whoWeAre': '我們是誰',
        'about.whoWeAreDesc': 'AIcountant 是一家融合人工智能技術的現代會計服務公司，擁有超過10年的行業經驗。我們的團隊由專業會計師和AI技術專家組成，致力於為客戶提供智能化的財務管理服務。',
        'about.mission': '我們的使命',
        'about.missionDesc': '通過AI技術革新傳統會計服務，幫助企業實現財務自動化，降低成本，提高效率，讓企業管理更輕鬆。',
        'stats.clients': '服務企業',
        'stats.experience': '年行業經驗',
        'stats.team': '專業團隊',
        'testimonials.title': '客戶好評',
        'testimonials.1.content': '"用了AIcountant後，每個月的記賬報稅再也不頭疼了。AI助手響應很快，有問題隨時能解答。"',
        'testimonials.1.name': '張先生',
        'testimonials.1.title': '某科技公司創始人',
        'testimonials.2.content': '"作為外資企業，中國的稅務規定很複雜。AIcountant的團隊非常專業，幫我們解決了很多問題。"',
        'testimonials.2.name': 'Sarah Chen',
        'testimonials.2.title': '外資企業CFO',
        'testimonials.3.content': '"從公司註冊到日常記賬，一站式服務非常方便。價格透明，沒有隱藏費用。"',
        'testimonials.3.name': '李女士',
        'testimonials.3.title': '電商創業者',
        'contact.title': '聯繫我們',
        'contact.subtitle': '獲取免費諮詢',
        'contact.desc': '留下您的聯繫方式，我們的專家將在24小時內與您聯繫',
        'contact.address': '北京市朝陽區建國路88號',
        'form.name': '姓名',
        'form.email': '郵箱',
        'form.phone': '電話',
        'form.service': '感興趣的服務',
        'form.service.placeholder': '請選擇...',
        'form.service.startup': '創業起步套餐',
        'form.service.operations': '日常運營服務',
        'form.service.growth': '企業升級方案',
        'form.service.other': '其他諮詢',
        'form.message': '留言',
        'form.submit': '提交諮詢',
        'footer.rights': '版權所有',
        'notification.success': '感謝您的諮詢！我們將在24小時內與您聯繫。',
        'notification.error': '請填寫姓名和郵箱！',
        'notification.emailError': '請輸入有效的郵箱地址！'
    }
};

// 当前语言
let currentLang = localStorage.getItem('aicountant-lang') || 'zh';

// ==================== 
// 语言切换功能
// ==================== 
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('aicountant-lang', lang);
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // 更新页面语言属性
    document.documentElement.lang = lang === 'zh-TW' ? 'zh-TW' : (lang === 'en' ? 'en' : 'zh-CN');
    
    // 更新页面标题
    const titles = {
        'zh': 'AIcountant - 智能会计服务',
        'en': 'AIcountant - Smart Accounting Services',
        'zh-TW': 'AIcountant - 智能會計服務'
    };
    document.title = titles[lang];
}

// 语言按钮点击事件
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// 页面加载时应用保存的语言
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
});

// ==================== 
// 移动端菜单切换
// ==================== 
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 点击导航链接后关闭菜单
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ==================== 
// 导航栏滚动效果
// ==================== 
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 向下滚动超过100px时添加阴影
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ==================== 
// 数字动画效果（统计区域）
// ==================== 
const animateNumbers = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000; // 2秒
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateNumber();
    });
};

// 使用 Intersection Observer 检测元素是否进入视口
const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ==================== 
// 联系表单提交
// ==================== 
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // 简单验证
    if (!data.name || !data.email) {
        showNotification(translations[currentLang]['notification.error'], 'error');
        return;
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification(translations[currentLang]['notification.emailError'], 'error');
        return;
    }
    
    // 模拟提交（实际项目中这里会发送到后端API）
    console.log('表单数据：', data);
    
    // 显示成功提示
    showNotification(translations[currentLang]['notification.success'], 'success');
    
    // 清空表单
    contactForm.reset();
});

// ==================== 
// 通知提示功能
// ==================== 
function showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // 添加关闭按钮样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-close {
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            margin-left: 8px;
            flex-shrink: 0;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 关闭按钮事件
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// ==================== 
// 平滑滚动到锚点
// ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 
// 页面加载完成后的初始化
// ==================== 
document.addEventListener('DOMContentLoaded', () => {
    console.log('AIcountant 网站已加载完成！');
    console.log('当前语言：' + currentLang);
});
