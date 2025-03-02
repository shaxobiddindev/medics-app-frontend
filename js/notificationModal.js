// notificationModal.js
export function showErrorModal(message) {
  const errorModal = document.createElement('div');
  errorModal.className = 'error-modal';
  errorModal.style.cssText = `
    position: fixed;
    right: 20px;
    width: 300px;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    text-align: center;
    color: red;
    font-size: 16px;
    transition: top 0.3s ease;
    animation: slideIn 0.3s ease;
  `;
  errorModal.innerHTML = `
    <span class="error-close-btn" style="position: absolute; top: 5px; right: 10px; font-size: 20px; cursor: pointer;">×</span>
    <i class="fa fa-exclamation-circle" style="font-size: 30px;"></i>
    <p style="margin-top: 10px;">${message}</p>
  `;

  // Yangi modalni yuqoridan qo‘shish
  errorModal.style.top = '20px';
  document.body.appendChild(errorModal);

  // Mavjud modallarni pastga surish
  const existingModals = Array.from(document.querySelectorAll('.error-modal'));
  adjustModalPositions(existingModals);

  // Yopish tugmasi hodisasi
  const closeBtn = errorModal.querySelector('.error-close-btn');
  closeBtn.addEventListener('click', () => {
    errorModal.remove();
    adjustModalPositions();
  });

  // 5 soniyadan keyin avtomatik yopish
  setTimeout(() => {
    errorModal.remove();
    adjustModalPositions();
  }, 3000);
}

export function showSuccessModal(message) {
  const errorModal = document.createElement('div');
  errorModal.className = 'error-modal';
  errorModal.style.cssText = `
    position: fixed;
    right: 20px;
    width: 300px;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    text-align: center;
    color: green;
    font-size: 16px;
    transition: top 0.3s ease;
    animation: slideIn 0.3s ease;
  `;
  errorModal.innerHTML = `
    <span class="error-close-btn" style="position: absolute; top: 5px; right: 10px; font-size: 20px; cursor: pointer;">×</span>
    <i class="fa fa-check-circle" style="font-size: 30px;"></i>
    <p style="margin-top: 10px;">${message}</p>
  `;

  // Yangi modalni yuqoridan qo‘shish
  errorModal.style.top = '20px';
  document.body.appendChild(errorModal);

  // Mavjud modallarni pastga surish
  const existingModals = Array.from(document.querySelectorAll('.error-modal'));
  adjustModalPositions(existingModals);

  // Yopish tugmasi hodisasi
  const closeBtn = errorModal.querySelector('.error-close-btn');
  closeBtn.addEventListener('click', () => {
    errorModal.remove();
    adjustModalPositions();
  });

  // 5 soniyadan keyin avtomatik yopish
  setTimeout(() => {
    errorModal.remove();
    adjustModalPositions();
  }, 3000);
}

// Modallarni qayta joylashtirish funksiyasi
function adjustModalPositions(modals = document.querySelectorAll('.error-modal')) {
  let topPosition = 20;
  modals.forEach(modal => {
    modal.style.top = `${topPosition}px`;
    topPosition += modal.offsetHeight + 10;
  });
}

// Animatsiya uchun CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
