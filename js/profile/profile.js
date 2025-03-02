import { showErrorModal, showSuccessModal } from '../notificationModal.js';
import { BASE_URL } from "../config.js";
import { LoadingAnimation } from '../loadingAnimation.js';

const loadingAnimation = new LoadingAnimation();

let user;

// User profile yuklash
async function loadUser() {
  const profilePicture = document.querySelector('.profile-picture');
  const userName = document.querySelector('.user-name');

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      const data = result.data;
      user = data;
      userName.textContent = data.firstName || ' ';
      if (data.imageUrl) profilePicture.src = data.imageUrl;
      document.getElementById('firstName').textContent = data.firstName || ' ';
      document.getElementById('lastName').textContent = data.lastName || ' ';
      document.getElementById('username').textContent = data.username || ' ';
      document.getElementById('email').textContent = data.email || ' ';
      document.getElementById('age').textContent = data.age !== null ? data.age : ' ';
      document.getElementById('gender').textContent = data.gender || ' ';
      return data;
    } else {
      throw new Error(result.message || 'Failed to load user data');
    }
  } catch (error) {
    console.error('User load error:', error);
    showErrorModal('User load error: ' + error.message);
  }
}

// Profile yangilash
async function updateProfile(data) {
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      showSuccessModal('Profile updated successfully!');
      await loadUser();
    } else {
      throw new Error(result.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    showErrorModal('Profile update error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Payment kartalarni yuklash
async function loadPaymentCards() {
  const cardList = document.getElementById('card-list');
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/payment`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      cardList.innerHTML = '';
      if (result.data.length === 0) {
        cardList.innerHTML = '<p>No cards available.</p>';
      } else {
        result.data.forEach(card => {
          const div = document.createElement('div');
          div.className = 'credit-card';
          div.innerHTML = `
            <div class="card-number">${card.number}</div>
            <div class="card-details">
                <div class="card-holder">
                    <label>Card holder</label>
                    <div>${user.firstName + ' '} ${user.lastName}</div>
                </div>
                <div class="card-expiration">
                    <label>Expires</label>
                    <div>${card.expire}</div>
                </div>
            </div>
            <div class="card-balance">
                <label>Balance</label>
                <div>${card.balance}</div>
            </div>
            <button class="delete-card-btn" data-id="${card.id}">Delete</button>
          `;
          cardList.appendChild(div);
        });
      }
    } else {
      throw new Error(result.message || 'Failed to load payment cards');
    }
  } catch (error) {
    console.error('Payment cards load error:', error);
    showErrorModal('Payment cards load error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Yangi karta qo'shish
async function addPaymentCard(cardData) {
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      showSuccessModal('Card added successfully!');
      await loadPaymentCards();
    } else {
      throw new Error(result.message || 'Failed to add card');
    }
  } catch (error) {
    console.error('Add card error:', error);
    showErrorModal('Add card error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Balansni to'ldirish
async function topUpBalance(cardData) {
  if (cardData.amount === '') {
    showErrorModal('Amount cannot be empty');
  }
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/payment/top-up`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cardData),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      showSuccessModal('Balance topped up successfully!');
      await loadPaymentCards();
    } else {
      throw new Error(result.message || 'Failed to top up balance');
    }
  } catch (error) {
    console.error('Top up error:', error);
    showErrorModal('Top up error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Karta o'chirish
async function deletePaymentCard(cardId) {
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/${cardId}/payment`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      showSuccessModal('Card deleted successfully!');
      await loadPaymentCards();
    } else {
      throw new Error(result.message || 'Failed to delete card');
    }
  } catch (error) {
    console.error('Delete card error:', error);
    showErrorModal('Delete card error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Lokatsiyani yuklash
async function loadLocation() {
  const latitude = document.getElementById('latitude');
  const longitude = document.getElementById('longitude');
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/location`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      latitude.textContent = result.data.latitude !== null ? result.data.latitude : 'Not set';
      longitude.textContent = result.data.longitude !== null ? result.data.longitude : 'Not set';
    } else {
      throw new Error(result.message || 'Failed to load location');
    }
  } catch (error) {
    console.error('Location load error:', error);
    showErrorModal('Location load error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// Lokatsiyani yangilash
async function updateLocation(data) {
  loadingAnimation.show();
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${BASE_URL}/user/location`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      showSuccessModal('Location updated successfully!');
      await loadLocation();
    } else {
      throw new Error(result.message || 'Failed to update location');
    }
  } catch (error) {
    console.error('Location update error:', error);
    showErrorModal('Location update error: ' + error.message);
  } finally {
    loadingAnimation.hide();
  }
}

// DOM yuklanganda ishga tushadi
document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.querySelector('.upload-btn');
  const fileInput = document.getElementById('profile-upload');
  const profilePicture = document.querySelector('.profile-picture');
  const menuItems = document.querySelectorAll('.menu-item');
  const sectionContents = document.querySelectorAll('.section-content');

  // Dastlabki yuklash
  loadUser();
  loadPaymentCards();
  loadLocation();

  // Profile rasm yuklash
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        showErrorModal('Error: File size should not exceed 5 MB.');
        return;
      }
      loadingAnimation.show();
      try {
        const formData = new FormData();
        formData.append('file', file);
        const userId = localStorage.getItem('userId') || '29';
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BASE_URL}/image/${userId}/user`, {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          profilePicture.src = result.data;
          showSuccessModal('Profile image uploaded successfully!');
        } else {
          showErrorModal('Image upload failed: ' + result.message);
        }
      } catch (error) {
        console.error('Image upload error:', error);
        showErrorModal('Image upload error: ' + error.message);
      } finally {
        loadingAnimation.hide();
      }
    }
  });

  // Menu tanlash
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('open'));
      item.classList.add('open');
      sectionContents.forEach(content => content.classList.remove('open'));
      document.querySelector(`.section-content.${item.dataset.section}-section-content`).classList.add('open');
    });
  });

  // Profile edit
  const editProfileBtn = document.querySelector('.edit-profile-btn');
  const saveProfileBtn = document.querySelector('.save-profile-btn');
  const cancelEditBtn = document.querySelector('.cancel-edit-btn');
  const editProfileForm = document.querySelector('.edit-profile-form');

  editProfileBtn.addEventListener('click', () => {
    editProfileForm.style.display = 'block';
    editProfileBtn.style.display = 'none';
    document.getElementById('edit-firstName').value = user.firstName || '';
    document.getElementById('edit-lastName').value = user.lastName || '';
    document.getElementById('edit-age').value = user.age || '';
    document.getElementById('edit-gender').value = user.gender || '';
  });
  saveProfileBtn.addEventListener('click', async () => {
    const data = {
      firstName: document.getElementById('edit-firstName').value,
      lastName: document.getElementById('edit-lastName').value,
      age: document.getElementById('edit-age').value,
      gender: document.getElementById('edit-gender').value,
    };
    if (data.age === '') {
      showErrorModal('Age field is required!');
      return;
    } else if (data.age <= 0) {
      showErrorModal('Age cannot be negative!');
      return;
    }
    await updateProfile(data);
    editProfileForm.style.display = 'none';
    editProfileBtn.style.display = 'inline-block';
  });
  cancelEditBtn.addEventListener('click', () => {
    editProfileForm.style.display = 'none';
    editProfileBtn.style.display = 'inline-block';
  });

  // Payment add card
  const addCardToggleBtn = document.querySelector('.add-card-toggle-btn');
  const addCardBtn = document.querySelector('.add-card-btn');
  const cancelAddCardBtn = document.querySelector('.cancel-add-card-btn');
  const addCardForm = document.querySelector('.add-card-form');

  addCardToggleBtn.addEventListener('click', () => {
    addCardForm.style.display = 'block';
    addCardToggleBtn.style.display = 'none';
  });
  addCardBtn.addEventListener('click', async () => {
    const cardData = {
      cardNumber: document.getElementById('card-number').value,
      expireDate: document.getElementById('expire-date').value,
      balance: parseInt(document.getElementById('initial-balance').value) || 0,
    };
    await addPaymentCard(cardData);
    addCardForm.style.display = 'none';
    addCardToggleBtn.style.display = 'inline-block';
  });
  cancelAddCardBtn.addEventListener('click', () => {
    addCardForm.style.display = 'none';
    addCardToggleBtn.style.display = 'inline-block';
  });

  // Payment top up
  const topUpToggleBtn = document.querySelector('.top-up-toggle-btn');
  const topUpBtn = document.querySelector('.top-up-btn');
  const cancelTopUpBtn = document.querySelector('.cancel-top-up-btn');
  const topUpForm = document.querySelector('.top-up-form');

  topUpToggleBtn.addEventListener('click', () => {
    topUpForm.style.display = 'block';
    topUpToggleBtn.style.display = 'none';
  });
  topUpBtn.addEventListener('click', async () => {
    const cardData = {
      cardNumber: document.getElementById('top-up-card-number').value,
      amount: document.getElementById('top-up-amount').value,
    };

    if (cardData.amount <= 0){
      showErrorModal('Money cannot be negative!');
      return
    }

    await topUpBalance(cardData);
    topUpForm.style.display = 'none';
    topUpToggleBtn.style.display = 'inline-block';
  });
  cancelTopUpBtn.addEventListener('click', () => {
    topUpForm.style.display = 'none';
    topUpToggleBtn.style.display = 'inline-block';
  });

  // Delete card with confirmation
  let cardIdToDelete = null;
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-card-btn')) {
      cardIdToDelete = e.target.dataset.id;
      const modal = document.querySelector('.logout-modal');
      const   modalText = modal.querySelector('.logout-modal-content p');
      modalText.textContent = 'Are you sure you want to delete this card?';
      modal.style.display = 'flex';
    }
  });

  document.addEventListener('click', async (e) => {
    const logoutModal = document.querySelector('.logout-modal');
    if (logoutModal.style.display === 'flex') {
      if (e.target.classList.contains('yes')) {
        if (cardIdToDelete) {
          await deletePaymentCard(cardIdToDelete);
          cardIdToDelete = null;
        } else {
          localStorage.removeItem('authToken');
          window.location.href = '../index.html';
        }
        logoutModal.style.display = 'none';
      } else if (e.target.classList.contains('no')) {
        cardIdToDelete = null;
        logoutModal.style.display = 'none';
      }
    }
  });

  // Location edit
  const editLocationBtn = document.querySelector('.edit-location-btn');
  const saveLocationBtn = document.querySelector('.save-location-btn');
  const cancelLocationBtn = document.querySelector('.cancel-location-btn');
  const getCurrentLocationBtn = document.querySelector('.get-current-location-btn');
  const editLocationForm = document.querySelector('.edit-location-form');

  editLocationBtn.addEventListener('click', () => {
    editLocationForm.style.display = 'block';
    editLocationBtn.style.display = 'none';
  });
  getCurrentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.getElementById('edit-latitude').value = position.coords.latitude;
          document.getElementById('edit-longitude').value = position.coords.longitude;
        },
        (error) => showErrorModal('Unable to retrieve your location: ' + error.message)
      );
    } else {
      showErrorModal('Geolocation is not supported by this browser.');
    }
  });
  saveLocationBtn.addEventListener('click', async () => {
    const data = {
      latitude: parseFloat(document.getElementById('edit-latitude').value),
      longitude: parseFloat(document.getElementById('edit-longitude').value),
    };
    await updateLocation(data);
    editLocationForm.style.display = 'none';
    editLocationBtn.style.display = 'inline-block';
  });
  cancelLocationBtn.addEventListener('click', () => {
    editLocationForm.style.display = 'none';
    editLocationBtn.style.display = 'inline-block';
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    const modal = document.querySelector('.logout-modal');
    const modalText = modal.querySelector('.logout-modal-content p');
    modalText.textContent = 'Are you sure you want to log out?';
    modal.style.display = 'flex';
  });
});
