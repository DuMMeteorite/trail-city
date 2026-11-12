```javascript
/* =========================================================
   Логика регистрации, входа, выхода и защиты кабинета
   ========================================================= */

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function registerUser(name, email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.email === normalizedEmail)) {
    return { ok: false, error: 'Пользователь с таким email уже зарегистрирован.' };
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return { ok: true, user: newUser };
}

function loginUser(email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const foundUser = users.find(u => u.email === normalizedEmail && u.password === password);

  if (!foundUser) {
    return { ok: false, error: 'Неверный email или пароль.' };
  }

  localStorage.setItem('currentUser', JSON.stringify(foundUser));
  return { ok: true, user: foundUser };
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

/* Обновление состояния шапки на всех страницах */
function syncHeaderAuthState() {
  const user = getCurrentUser();
  const headerName = document.getElementById('headerUserName');

  if (user) {
    document.body.classList.add('logged-in');
    if (headerName) {
      headerName.textContent = user.name;
    }
  } else {
    document.body.classList.remove('logged-in');
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }
}

/* Инициализация бургер-меню */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }
}

/* Инициализация форм на странице auth.html */
function initAuthForms() {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  if (!tabs.length) return;

  // Переключение вкладок Вход / Регистрация
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  // Валидация и отправка формы Входа
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const emailErr = document.getElementById('loginEmailError');
    const passErr = document.getElementById('loginPasswordError');
    const genErr = document.getElementById('loginGeneralError');

    emailErr.textContent = '';
    passErr.textContent = '';
    genErr.textContent = '';

    let valid = true;
    if (!email || !email.includes('@')) {
      emailErr.textContent = 'Введите корректный email.';
      valid = false;
    }
    if (!password) {
      passErr.textContent = 'Введите пароль.';
      valid = false;
    }

    if (!valid) return;

    const res = loginUser(email, password);
    if (!res.ok) {
      genErr.textContent = res.error;
    } else {
      window.location.href = 'cabinet.html';
    }
  });

  // Валидация и отправка формы Регистрации
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;
    const agree = document.getElementById('regAgree').checked;

    const nameErr = document.getElementById('regNameError');
    const emailErr = document.getElementById('regEmailError');
    const passErr = document.getElementById('regPasswordError');
    const confErr = document.getElementById('regPasswordConfirmError');
    const agreeErr = document.getElementById('regAgreeError');
    const genErr = document.getElementById('regGeneralError');

    [nameErr, emailErr, passErr, confErr, agreeErr, genErr].forEach(el => el.textContent = '');

    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      nameErr.textContent = 'Укажите ваше имя.';
      valid = false;
    }
    if (!emailRegex.test(email)) {
      emailErr.textContent = 'Введите корректный адрес электронной почты.';
      valid = false;
    }
    if (password.length < 6) {
      passErr.textContent = 'Пароль должен содержать минимум 6 символов.';
      valid = false;
    }
    if (password !== confirm) {
      confErr.textContent = 'Пароли не совпадают.';
      valid = false;
    }
    if (!agree) {
      agreeErr.textContent = 'Необходимо принять правила проекта.';
      valid = false;
    }

    if (!valid) return;

    const res = registerUser(name, email, password);
    if (!res.ok) {
      genErr.textContent = res.error;
    } else {
      window.location.href = 'cabinet.html';
    }
  });
}

/* Проверка доступа и заполнение данных в cabinet.html */
function initCabinetPage() {
  const deniedBox = document.getElementById('deniedBox');
  const cabinetContent = document.getElementById('cabinetContent');

  if (!deniedBox || !cabinetContent) return;

  const user = getCurrentUser();
  if (!user) {
    deniedBox.hidden = false;
    cabinetContent.hidden = true;
    return;
  }

  deniedBox.hidden = true;
  cabinetContent.hidden = false;

  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('cabUserName').textContent = user.name;
  document.getElementById('cabUserEmail').textContent = user.email;
  document.getElementById('cabUserDate').textContent = new Date(user.createdAt).toLocaleDateString('ru-RU');

  const cabLogoutBtn = document.getElementById('cabLogoutBtn');
  if (cabLogoutBtn) {
    cabLogoutBtn.addEventListener('click', logoutUser);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  syncHeaderAuthState();
  initMobileMenu();
  initAuthForms();
  initCabinetPage();
});