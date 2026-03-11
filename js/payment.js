// AIcountant Stripe Payment Handler
// 支持信用卡、支付寶、微信支付

class PaymentHandler {
  constructor() {
    // 使用佔位符，實際使用時替換為你的 Publishable Key
    this.stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');
    this.apiUrl = this.getApiUrl();
    this.init();
  }

  getApiUrl() {
    // 自動檢測環境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api/create-checkout-session';
    }
    return '/api/create-checkout-session';
  }

  init() {
    this.bindButtons();
    console.log('Payment Handler initialized');
  }

  bindButtons() {
    const buttons = document.querySelectorAll('.btn-pricing');
    
    buttons.forEach(button => {
      // 跳過沒有 data-service 的按鈕
      if (!button.dataset.service) return;
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePayment(button);
      });
    });
  }

  async handlePayment(button) {
    const service = button.dataset.service;
    const plan = button.dataset.plan;
    
    if (!service || !plan) {
      console.error('Missing service or plan data');
      return;
    }

    // 檢查 Stripe Key 是否已配置
    if (!this.isStripeConfigured()) {
      this.showConfigModal();
      return;
    }

    // 顯示加載狀態
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '處理中...';

    try {
      // 創建 Checkout Session
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: service,
          plan: plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '支付初始化失敗');
      }

      if (data.error) {
        if (data.error === 'Contact required') {
          // 高級版需要聯繫
          alert('此服務需要聯繫我們獲取定制報價，請使用頁面底部表單與我們聯繫。');
          button.disabled = false;
          button.textContent = originalText;
          return;
        }
        throw new Error(data.message);
      }

      // 跳轉到 Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        const result = await this.stripe.redirectToCheckout({
          sessionId: data.id
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('支付初始化失敗: ' + error.message + '\n\n請確保已正確配置 Stripe API Keys。');
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  isStripeConfigured() {
    // 檢查是否還是佔位符
    const key = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
    return !this.stripe._apiKey.includes('YOUR_PUBLISHABLE_KEY');
  }

  showConfigModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-config-modal';
    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content">
          <h3>⚙️ Stripe 配置提示</h3>
          <p>請按以下步驟配置 Stripe 支付：</p>
          <ol>
            <li>去 <a href="https://dashboard.stripe.com/apikeys" target="_blank">Stripe Dashboard</a></li>
            <li>複製 Publishable key (pk_test_...)</li>
            <li>打開 <code>js/payment.js</code></li>
            <li>替換 <code>pk_test_YOUR_PUBLISHABLE_KEY_HERE</code></li>
            <li>在 Vercel 設置環境變量 <code>STRIPE_SECRET_KEY</code></li>
          </ol>
          <button class="btn btn-primary" onclick="this.closest('.payment-config-modal').remove()">明白了</button>
        </div>
      </div>
    `;
    
    // 添加樣式
    const style = document.createElement('style');
    style.textContent = `
      .modal-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
      }
      .modal-content h3 { margin-bottom: 15px; }
      .modal-content ol { margin: 15px 0; padding-left: 20px; }
      .modal-content li { margin: 8px 0; }
      .modal-content code {
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }
}

// 初始化
if (typeof Stripe !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.paymentHandler = new PaymentHandler();
  });
} else {
  console.error('Stripe.js not loaded');
}
