import { BASE_URL } from './config.js'; // config.js dan BASE_URL ni import qilish
import { showErrorModal, showSuccessModal} from "./notificationModal.js";

// Tokenni tekshirish funksiyasi
async function checkTokenValidity(redirectPath = null) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '../pages/registration.html';
    return false;
  }
  try {
    const response = await fetch(`${BASE_URL}/auth/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return true;
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '../pages/registration.html';
      return false;
    }
  } catch (error) {
    showErrorModal('Error: '+error);
    localStorage.removeItem('authToken');
    window.location.href = '../pages/registration.html';
    return false;
  }
}

document.addEventListener('DOMContentLoaded', checkTokenValidity);
