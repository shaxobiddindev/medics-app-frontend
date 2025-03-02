import {BASE_URL} from './config.js'; // config.js dan BASE_URL ni import qilish
import {showErrorModal, showSuccessModal} from './notificationModal.js'; // Success modal funksiyasini import qilish
import {LoadingAnimation} from './loadingAnimation.js'; // Show loading funksiyasini import qilish

const loadingAnimation = new LoadingAnimation();

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
      body: JSON.stringify({token}),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.location.href = './main.html';
      return true;
    } else {
      showErrorModal("Request error: " + token);
      localStorage.removeItem('authToken');
      return false;
    }
  } catch (error) {
    showErrorModal('Token check error: ', error);
    localStorage.removeItem('authToken');
    return false;
  }
}

document.addEventListener('DOMContentLoaded', checkTokenValidity);

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

// Backend API ga ma'lumot yuborish uchun umumiy funksiya (Token qo‘shilmaydi)
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
      return {success: true, data: result};
    } else {
      return {success: false, error: result.message || 'Something went wrong'};
    }
  } catch (error) {
    return {success: false, error: error.message};
  }
}

// Modal va tasdiqlash logikasi
const modal = document.getElementById('verification-modal');
const codeInputs = document.querySelectorAll('.code-digit');
const errorMessage = document.getElementById('error-message');
const timerDisplay = document.getElementById('timer');
let timeLeft = 60;
let timerInterval;
let verificationEmail = '';

function openVerificationModal(email) {
  verificationEmail = email;
  modal.style.display = 'flex';
  startTimer();
  setupCodeInputs();
  errorMessage.style.display = 'none';
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
  }
  clearInterval(timerInterval);
  timeLeft = 60;
  codeInputs.forEach(input => (input.value = ''));
  errorMessage.style.display = 'none';
}

function startTimer() {
  const resendBtn = document.getElementById('resend-code');
  const confirmBtn = document.getElementById('confirm-code');
  resendBtn.disabled = true;
  resendBtn.classList.add('hide-btn');
  confirmBtn.disabled = false;
  confirmBtn.classList.remove('hide-btn');
  clearInterval(timerInterval);
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resendBtn.disabled = false;
      resendBtn.classList.remove('hide-btn');
      confirmBtn.disabled = true;
      confirmBtn.classList.add('hide-btn');
      timerDisplay.textContent = 'Code expired. Resend available.';
    }
  }, 1000);
}

function setupCodeInputs() {
  codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < codeInputs.length - 1) {
        codeInputs[index + 1].focus();
      }
      errorMessage.style.display = 'none';
      codeInputs.forEach(input => input.classList.remove('error'));
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        codeInputs[index - 1].focus();
      }
    });
  });
}

async function resendCode() {
  if (timeLeft > 0) return;
  console.log(`Resending code to ${verificationEmail}`);

  const result = await sendData('/auth/account/resend-code', {email: verificationEmail});
  if (result.success) {
    timeLeft = 60;
    startTimer();
  } else {
    showErrorModal('Failed to resend code: ' + result.error);
  }
}

async function verifyCode() {
  if (timeLeft <= 0) {
    showErrorModal('Verification code expired. Please resend.');
    return;
  }

  const code = Array.from(codeInputs).map(input => input.value).join('');
  console.log('Verification code entered:', code);
  if (code.length !== 4) {
    showError('Please enter a 4-digit code');
    return;
  }

  try {
    const response = await sendData('/auth/account/confirm', {email: verificationEmail, code});
    console.log('Server response:', response);
    if (response.success) {
      showSuccessModal('Email verification successfully!');
      closeModal(); // Modalni yopish
      loadingAnimation.show()
      showForm('signin'); // Signin formani ko‘rsatish
      setTimeout(() => {
        loadingAnimation.hide();
      }, 1000); // 2
    } else {
      showErrorModal(response.error || 'Invalid code');
    }
  } catch (error) {
    console.error('Verification error:', error);
    showErrorModal('Verification failed. Try again.');
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  codeInputs.forEach(input => input.classList.add('error'));
  setTimeout(() => {
    codeInputs.forEach(input => input.classList.remove('error'));
  }, 1000);
}

// Hodisalarni bog‘lash
document.addEventListener('DOMContentLoaded', function () {
  showForm('signin');
  document.getElementById('signin-btn').addEventListener('click', () => showForm('signin'));
  document.getElementById('signup-btn').addEventListener('click', () => showForm('signup'));

  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const inputId = button.previousElementSibling.id;
      togglePassword(inputId);
    });
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => closeModal())

  document.getElementById('signin-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const formContainer = document.querySelector('.form-container');

    const data = {username, password};
    const result = await sendData('/auth/sign-in', data);

    if (result.success) {
      const token = result.data.data;
      localStorage.setItem('authToken', token);
      showSuccessModal('Sign In successful!');
      window.location.href= "./main.html";
    } else {
      showErrorModal('Error: ' + result.error);
    }
  });

  document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-firstname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const formContainer = document.querySelector('.form-container');

    if (password !== confirmPassword) {
      showErrorModal('Passwords do not match!');
      return;
    }

    const data = {username, email, password};
    const result = await sendData('/auth/sign-up', data);

    if (result.success) {
      showSuccessModal('Sign Up successful! \n Please confirm your email!');
      openVerificationModal(email);
    } else {
      showErrorModal('Error: ' + result.error);
    }
  });

  document.getElementById('resend-code').addEventListener('click', resendCode);
  document.getElementById('confirm-code').addEventListener('click', verifyCode);
});
