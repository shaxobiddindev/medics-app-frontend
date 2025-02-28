// js/registration.js
import { BASE_URL } from './config.js'; // config.js dan BASE_URL ni import qilish

// Formani ko‘rsatish va yashirish uchun funksiya
function showForm(formType) {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const signinBtn = document.getElementById('signin-btn');
  const signupBtn = document.getElementById('signup-btn');

  if (formType === 'signin') {
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    signinBtn.classList.add('active');
    signupBtn.classList.remove('active');
  } else {
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    signinBtn.classList.remove('active');
    signupBtn.classList.add('active');
  }
}

// Parolni ko‘rsatish/yashirish funksiyasi
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Backend API ga ma'lumot yuborish uchun umumiy funksiya
async function sendData(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, error: result.message || 'Something went wrong' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Hodisalarni bog‘lash
document.addEventListener('DOMContentLoaded', function () {
  // Dastlabki holatda Sign In formasini ko‘rsatish
  showForm('signin');

  // Sign In va Sign Up tugmalari uchun hodisalar
  document.getElementById('signin-btn').addEventListener('click', () => showForm('signin'));
  document.getElementById('signup-btn').addEventListener('click', () => showForm('signup'));

  // Parol ko‘rsatish/yashirish tugmalari uchun hodisalar
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const inputId = button.previousElementSibling.id;
      togglePassword(inputId);
    });
  });

  // Sign In formasi uchun submit hodisasi
  document.getElementById('signin-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    const data = { email, password };
    const result = await sendData('/sign-in', data);

    if (result.success) {
      alert('Sign In muvaffaqiyatli! Token: ' + result.data.token);
      // window.location.href = '/dashboard';
    } else {
      alert('Xatolik: ' + result.error);
    }
  });

  // Sign Up formasi uchun submit hodisasi
  document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstname = document.getElementById('signup-firstname').value;
    const lastname = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
      alert('Parollar mos emas!');
      return;
    }

    const data = { firstname, lastname, email, password };
    const result = await sendData('/signup', data);

    if (result.success) {
      alert('Sign Up muvaffaqiyatli! ID: ' + result.data.userId);
    } else {
      alert('Xatolik: ' + result.error);
    }
  });
});
