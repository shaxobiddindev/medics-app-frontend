// loadingAnimation.js
export class LoadingAnimation {
  constructor() {
    // Loader elementi
    this.loader = document.createElement('div');
    this.loader.className = 'loader';
    this.loader.style.cssText = `
      width: 40px;
      height: 40px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      --c: no-repeat linear-gradient(#199A8E 0 0);
      background: var(--c) center/100% 10px, var(--c) center/10px 100%;
      z-index: 1001; /* Loader yuqori qatlamda */
    `;

    // Loader uchun oldingi qism
    this.loaderBefore = document.createElement('div');
    this.loaderBefore.style.cssText = `
      content: '';
      position: absolute;
      inset: 0;
      background: var(--c) 0 0, var(--c) 100% 0, var(--c) 0 100%, var(--c) 100% 100%;
      background-size: 15.5px 15.5px;
      animation: l16 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
    `;
    this.loader.appendChild(this.loaderBefore);

    // Orqa fon (backdrop) elementi
    this.backdrop = document.createElement('div');
    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Yarim o‘shama qora fon */
      z-index: 1000; /* Loader dan pastda, lekin boshqa elementlardan yuqori */
      display: none;
    `;

    // Animatsiya uchun CSS qo‘shish
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes l16 {
        33% { inset: -10px; transform: rotate(0deg); }
        66% { inset: -10px; transform: rotate(90deg); }
        100% { inset: 0; transform: rotate(90deg); }
      }
      @keyframes animatebottom {
        from { bottom: -100px; opacity: 0 }
        to { bottom: 0; opacity: 1 }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // Loading ni ko‘rsatish (backdrop bilan birga)
  show() {
    document.body.appendChild(this.backdrop);
    this.backdrop.style.display = 'block';
    document.body.appendChild(this.loader);
  }

  // Loading ni yashirish (backdrop bilan birga)
  hide() {
    if (document.body.contains(this.loader)) {
      document.body.removeChild(this.loader);
    }
    if (document.body.contains(this.backdrop)) {
      document.body.removeChild(this.backdrop);
    }
  }
}
