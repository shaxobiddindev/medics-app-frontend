import { BASE_URL } from './config.js'; // config.js dan BASE_URL ni import qilish

// Tokenni tekshirish funksiyasi
async function checkTokenValidity(redirectPath = null) {
  const token = localStorage.getItem('authToken');
  if (!token) {
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
      window.location.href = './pages/main.html';
      return true;
    } else {
      alert("xato" + token);
      localStorage.removeItem('authToken');
      return false;
    }
  } catch (error) {
    alert('Token tekshirishda xato:', error);
    localStorage.removeItem('authToken');
    return false;
  }
}

document.addEventListener('DOMContentLoaded', checkTokenValidity);
