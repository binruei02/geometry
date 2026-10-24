/**
 * 幾何形體任你玩 - App 獨立全螢幕模式管理與安裝引導
 * 支援 Safari 與 Chrome (含 iOS Chrome 與 Android Chrome) 雙瀏覽器分頁切換與精確指引
 */
(function() {
  function isRunningStandalone() {
    return (window.navigator.standalone === true) || 
           (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  }

  function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function detectBrowser() {
    const ua = navigator.userAgent;
    const isIOS = isIOSDevice();
    const isChromeIOS = isIOS && /CriOS/i.test(ua);
    const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua);
    
    if (isChromeIOS) return 'chrome';
    if (isChrome) return 'chrome';
    return 'safari';
  }

  function showAppGuide(customTitle) {
    let modal = document.getElementById('app-mode-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'app-mode-modal';
      document.body.appendChild(modal);
    }

    const currentBrowser = detectBrowser();
    const isIOS = isIOSDevice();

    modal.innerHTML = `
      <div class="app-modal-overlay"></div>
      <div class="app-modal-card">
        <button class="app-modal-close" id="app-modal-close-btn" aria-label="關閉">&times;</button>
        <div class="app-modal-header">
          <div class="app-modal-icon-badge">
            <img src="${window.APP_ASSETS_PATH || ''}icon-192.png" alt="幾何形體任你玩" />
          </div>
          <h3>${customTitle || '以 App 獨立全螢幕模式顯示'}</h3>
          <p class="app-modal-sub">免去網址列與工具列干擾，享受 100% 滿版沉浸體驗！</p>
        </div>

        <!-- 瀏覽器切換分頁 (自動識別 Chrome / Safari，亦可隨時切換) -->
        <div class="app-tab-bar">
          <button class="app-tab-btn ${currentBrowser === 'chrome' ? 'active' : ''}" data-target="tab-chrome">
            🌐 Google Chrome
          </button>
          <button class="app-tab-btn ${currentBrowser === 'safari' ? 'active' : ''}" data-target="tab-safari">
            🍎 Apple Safari
          </button>
        </div>

        <div class="app-modal-body">
          <div class="app-modal-notice">
            💡 <b>為什麼需要這個步驟？</b> 行動瀏覽器因安全性限制無法由網頁直接隱藏上方網址列。只要花 5 秒「<b>加入主畫面</b>」，即可永久變身為 100% 全螢幕 App！
          </div>

          <!-- Chrome 指引內容 -->
          <div class="app-tab-content ${currentBrowser === 'chrome' ? 'active' : ''}" id="tab-chrome">
            <div class="app-steps">
              <div class="app-step-item">
                <div class="app-step-num">1</div>
                <div class="app-step-info">
                  <div class="app-step-title">點擊 Chrome 的【分享】按鈕</div>
                  <div class="app-step-desc">
                    ${isIOS ? '點擊<b>右上角網址列旁</b>的 <span class="app-badge">分享 ⬆️</span> 按鈕（或點右下角選單「…」➔【分享】）' : '點擊<b>右上角選單</b> <span class="app-badge">⋮ 更多</span> 按鈕'}
                  </div>
                </div>
              </div>
              <div class="app-step-item">
                <div class="app-step-num">2</div>
                <div class="app-step-info">
                  <div class="app-step-title">點選【加入主畫面】或【安裝應用程式】</div>
                  <div class="app-step-desc">
                    ${isIOS ? '在彈出的分享選單中<b>往下滑動</b>，點選 <span class="app-badge">➕ 加入主畫面</span>' : '在選單中點選 <span class="app-badge">📲 安裝應用程式</span> 或 <span class="app-badge">➕ 加到主畫面</span>'}
                  </div>
                </div>
              </div>
              <div class="app-step-item">
                <div class="app-step-num">3</div>
                <div class="app-step-info">
                  <div class="app-step-title">從桌面圖示直接開啟</div>
                  <div class="app-step-desc">桌面上將出現專屬圖示，點開即是 <b>100% 滿版無網址列 App</b>！</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Safari 指引內容 -->
          <div class="app-tab-content ${currentBrowser === 'safari' ? 'active' : ''}" id="tab-safari">
            <div class="app-steps">
              <div class="app-step-item">
                <div class="app-step-num">1</div>
                <div class="app-step-info">
                  <div class="app-step-title">點擊 Safari 底部的【分享】按鈕</div>
                  <div class="app-step-desc">點擊瀏覽器底端工具列的 <span class="app-badge">分享 ⬆️</span> 圖示</div>
                </div>
              </div>
              <div class="app-step-item">
                <div class="app-step-num">2</div>
                <div class="app-step-info">
                  <div class="app-step-title">選擇【加入主畫面】</div>
                  <div class="app-step-desc">在彈出選單中往下滑動，點選 <span class="app-badge">➕ 加入主畫面</span></div>
                </div>
              </div>
              <div class="app-step-item">
                <div class="app-step-num">3</div>
                <div class="app-step-info">
                  <div class="app-step-title">從桌面點擊圖示開啟</div>
                  <div class="app-step-desc">桌面上將出現專屬幾何圖示，點開即是 <b>100% 滿版獨立全螢幕</b>！</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="app-modal-footer">
          <button class="app-btn-confirm" id="app-modal-confirm-btn">我知道了，繼續使用</button>
        </div>
      </div>
    `;

    // 綁定頁籤切換
    modal.querySelectorAll('.app-tab-btn').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.app-tab-btn').forEach(b => b.classList.remove('active'));
        modal.querySelectorAll('.app-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        modal.querySelector('#' + target)?.classList.add('active');
      };
    });

    const closeModal = () => modal.classList.remove('show');
    document.getElementById('app-modal-close-btn').onclick = closeModal;
    document.getElementById('app-modal-confirm-btn').onclick = closeModal;
    modal.querySelector('.app-modal-overlay').onclick = closeModal;

    requestAnimationFrame(() => modal.classList.add('show'));
  }

  function injectStyles() {
    if (document.getElementById('app-mode-styles')) return;
    const style = document.createElement('style');
    style.id = 'app-mode-styles';
    style.textContent = `
      #app-mode-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: max(16px, env(safe-area-inset-top, 16px)) max(12px, env(safe-area-inset-right, 12px)) max(24px, env(safe-area-inset-bottom, 24px)) max(12px, env(safe-area-inset-left, 12px));
        box-sizing: border-box;
      }
      #app-mode-modal.show { display: flex; }
      .app-modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(10, 8, 30, 0.82);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
      .app-modal-card {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: linear-gradient(165deg, #1e1b4b 0%, #0f172a 100%);
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-radius: 24px;
        padding: 22px 18px 18px;
        color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255,255,255,0.1) inset;
        box-sizing: border-box;
        animation: appPop 0.25s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes appPop {
        from { transform: scale(0.92); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .app-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        border: 0;
        color: #fff;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: background 0.15s;
      }
      .app-modal-close:hover { background: rgba(255,255,255,0.25); }
      .app-modal-header {
        text-align: center;
        margin-bottom: 14px;
      }
      .app-modal-icon-badge {
        width: 60px;
        height: 60px;
        margin: 0 auto 10px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.2);
        background: #0f172a;
      }
      .app-modal-icon-badge img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }
      .app-modal-header h3 {
        margin: 0 0 4px;
        font-size: 1.25rem;
        font-weight: 900;
        color: #ffffff;
      }
      .app-modal-sub {
        margin: 0;
        color: #94a3b8;
        font-size: 0.8rem;
        line-height: 1.4;
      }
      
      /* 瀏覽器切換分頁 */
      .app-tab-bar {
        display: flex;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 14px;
        padding: 3px;
        margin-bottom: 12px;
        gap: 4px;
      }
      .app-tab-btn {
        flex: 1;
        border: 0;
        background: transparent;
        color: #94a3b8;
        font-weight: 700;
        font-size: 0.82rem;
        padding: 7px 10px;
        border-radius: 11px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
      }
      .app-tab-btn.active {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(99, 102, 241, 0.25));
        border: 1px solid rgba(56, 189, 248, 0.45);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      }
      .app-tab-content { display: none; }
      .app-tab-content.active { display: block; animation: fade 0.2s; }

      .app-modal-notice {
        background: rgba(250, 204, 21, 0.12);
        border: 1px solid rgba(250, 204, 21, 0.35);
        color: #fef08a;
        font-size: 0.76rem;
        line-height: 1.5;
        padding: 9px 12px;
        border-radius: 12px;
        margin-bottom: 12px;
      }
      .app-steps {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .app-step-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 9px 12px;
      }
      .app-step-num {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #facc15, #fb923c);
        color: #0f172a;
        font-weight: 900;
        font-size: 0.8rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .app-step-info { flex: 1; min-width: 0; }
      .app-step-title {
        font-size: 0.86rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 2px;
      }
      .app-step-desc {
        font-size: 0.76rem;
        color: #cbd5e1;
        line-height: 1.45;
      }
      .app-badge {
        display: inline-block;
        background: rgba(255,255,255,0.18);
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 6px;
        padding: 1px 5px;
        font-weight: bold;
        color: #fff;
      }
      .app-modal-footer { margin-top: 14px; }
      .app-btn-confirm {
        width: 100%;
        padding: 11px 18px;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        color: #ffffff;
        font-weight: 800;
        font-size: 0.92rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);
        transition: transform 0.15s;
      }
      .app-btn-confirm:active { transform: scale(0.98); }
    `;
    document.head.appendChild(style);
  }

  window.showAppModeGuide = showAppGuide;
  window.isRunningStandalone = isRunningStandalone;
  window.isIOSDevice = isIOSDevice;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
})();
