// Stripe Checkout Session API
// 此 API 創建支付會話，支持信用卡、支付寶、微信支付

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS 配置
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5500',
  'https://aicountant-website.vercel.app',
  'https://your-domain.com'
];

// 服務價格配置（單位：港仙，即 HKD * 100）
const SERVICE_PRICES = {
  'company-setup': {
    basic: { 
      amount: 199900, 
      name: '公司註冊 - 基礎版',
      description: '公司名稱核准、營業執照辦理、公章刻製、基礎諮詢服務'
    },
    standard: { 
      amount: 399900, 
      name: '公司註冊 - 標準版',
      description: '包含基礎版所有服務 + 銀行開戶指導、稅務登記、首年記賬'
    },
    premium: { 
      amount: 699900, 
      name: '公司註冊 - 高級版',
      description: '包含標準版所有服務 + 註冊地址、全套公司秘書、1對1顧問'
    }
  },
  'company-secretary': {
    basic: { 
      amount: 19900, 
      name: '公司秘書 - 基礎版（月費）',
      description: '法定文件存檔、年度申報提醒、董事變更備案'
    },
    standard: { 
      amount: 39900, 
      name: '公司秘書 - 標準版（月費）',
      description: '包含基礎版 + 股東大會安排、會議記錄、股權變更'
    },
    premium: { 
      amount: 69900, 
      name: '公司秘書 - 高級版（月費）',
      description: '包含標準版 + 註冊地址服務、商務信函代收、專屬顧問'
    }
  },
  'bookkeeping': {
    basic: { 
      amount: 29900, 
      name: '記賬服務 - 基礎版（月費）',
      description: '每月50筆以內、銀行對賬、基礎報表、AI智能分類'
    },
    standard: { 
      amount: 59900, 
      name: '記賬服務 - 標準版（月費）',
      description: '每月200筆以內、應收應付管理、完整報表、專屬會計師'
    },
    premium: { 
      amount: 99900, 
      name: '記賬服務 - 高級版（月費）',
      description: '不限筆數、庫存管理、多維度分析、CFO級顧問'
    }
  },
  'accounting': {
    basic: { 
      amount: 49900, 
      name: '會計服務 - 基礎版（月費）',
      description: '日常賬務處理、月度財務報表、憑證整理歸檔'
    },
    standard: { 
      amount: 89900, 
      name: '會計服務 - 標準版（月費）',
      description: '包含基礎版 + 成本核算、預算編制、季度經營分析'
    },
    premium: { 
      amount: 149900, 
      name: '會計服務 - 高級版（月費）',
      description: '包含標準版 + 財務預測、內控體系、高級顧問'
    }
  },
  'auditing': {
    basic: { 
      amount: 599900, 
      name: '審計服務 - 基礎版',
      description: '內部審計、財務報表審閱、合規性檢查'
    },
    standard: { 
      amount: 1299900, 
      name: '審計服務 - 標準版',
      description: '年度財務審計、稅務審計、專項審計'
    },
    premium: { 
      amount: 0,
      name: '審計服務 - 高級版',
      description: 'IPO審計、併購審計、集團審計、國際審計標準'
    }
  },
  'taxation': {
    basic: { 
      amount: 39900, 
      name: '稅務服務 - 基礎版（月費）',
      description: '月度納稅申報、增值稅申報、個稅申報'
    },
    standard: { 
      amount: 79900, 
      name: '稅務服務 - 標準版（月費）',
      description: '包含基礎版 + 企業所得稅、稅務籌劃、風險診斷'
    },
    premium: { 
      amount: 199900, 
      name: '稅務服務 - 高級版（月費）',
      description: '包含標準版 + 跨境稅務規劃、稅收優惠申請、稽查應對'
    }
  }
};

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { service, plan, customerEmail } = req.body;
    
    if (!service || !plan) {
      res.status(400).json({ 
        error: 'Missing required parameters',
        message: '請提供 service 和 plan 參數'
      });
      return;
    }
    
    const serviceConfig = SERVICE_PRICES[service];
    if (!serviceConfig) {
      res.status(400).json({ 
        error: 'Invalid service',
        message: `不支持的服務類型: ${service}`
      });
      return;
    }
    
    const planConfig = serviceConfig[plan];
    if (!planConfig) {
      res.status(400).json({ 
        error: 'Invalid plan',
        message: `不支持的計劃類型: ${plan}`
      });
      return;
    }
    
    if (planConfig.amount === 0) {
      res.status(400).json({
        error: 'Contact required',
        message: '此服務需要聯繫我們獲取報價'
      });
      return;
    }
    
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'hkd',
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
            unit_amount: planConfig.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin || 'https://aicountant-website.vercel.app'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin || 'https://aicountant-website.vercel.app'}/cancel.html`,
      metadata: {
        service: service,
        plan: plan,
        service_name: planConfig.name,
      },
    };
    
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    res.status(200).json({
      id: session.id,
      url: session.url,
    });
    
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
};
