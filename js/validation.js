/* Клиентская валидация форм оформления заказа и обратной связи без использования alert() */

document.addEventListener('DOMContentLoaded', () => {
  // Находим все формы на страницах
  const forms = document.querySelectorAll('.order-form, .feedback-form');
  forms.forEach(form => {
    // Пропускаем форму в модальном окне, так как она обслуживается modal.js
    if (form.closest('.modal')) return;

    const isFeedback = form.closest('.contacts-layout') || form.classList.contains('feedback-form');
    initFormValidation(form, isFeedback ? 'feedback' : 'order');
  });
});

function initFormValidation(form, type) {
  // Отключаем нативную валидацию браузера, чтобы работала наша JS-валидация с DOM-выводом
  form.setAttribute('novalidate', '');

  const fields = {
    fullname: form.querySelector('[name="fullname"], [name="name"]'),
    email: form.querySelector('[name="email"]'),
    phone: form.querySelector('[name="phone"]'),
    consent: form.querySelector('[name="consent"]')
  };

  // Очистка сообщений об ошибках при начале ввода
  Object.values(fields).forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    let isValid = true;

    // 1. Проверка имени
    if (fields.fullname) {
      const val = fields.fullname.value.trim();
      if (!val) {
        setFieldError(fields.fullname, 'Пожалуйста, укажите ваше имя');
        isValid = false;
      } else if (val.length < 2) {
        setFieldError(fields.fullname, 'Имя должно содержать не менее 2 символов');
        isValid = false;
      } else {
        setFieldSuccess(fields.fullname);
      }
    }

    // 2. Проверка Email
    if (fields.email) {
      const val = fields.email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!val) {
        setFieldError(fields.email, 'Пожалуйста, введите адрес электронной почты');
        isValid = false;
      } else if (!emailRegex.test(val)) {
        setFieldError(fields.email, 'Введите корректный e-mail (например, name@mail.ru)');
        isValid = false;
      } else {
        setFieldSuccess(fields.email);
      }
    }

    // 3. Проверка Телефона
    if (fields.phone) {
      const val = fields.phone.value.trim();
      const digitsOnly = val.replace(/\D/g, '');
      if (!val) {
        setFieldError(fields.phone, 'Пожалуйста, укажите контактный телефон');
        isValid = false;
      } else if (digitsOnly.length < 10) {
        setFieldError(fields.phone, 'Номер телефона должен содержать от 10 цифр');
        isValid = false;
      } else {
        setFieldSuccess(fields.phone);
      }
    }

    // 4. Проверка согласия с обработкой персональных данных
    if (fields.consent) {
      if (!fields.consent.checked) {
        setFieldError(fields.consent, 'Необходимо согласие на обработку персональных данных');
        isValid = false;
      } else {
        clearFieldError(fields.consent);
      }
    }

    // Если форма валидна — имитация успешной отправки без alert()
    if (isValid) {
      handleFormSuccess(form, type);
    }
  });
}

// Отображение ошибки под полем через DOM textContent
function setFieldError(input, messageText) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');

  let errorContainer = input.parentElement.querySelector('.form-field-error');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'form-field-error';
    errorContainer.setAttribute('role', 'alert');
    input.parentElement.append(errorContainer);
  }

  errorContainer.textContent = messageText;
}

// Успешная валидация отдельного поля
function setFieldSuccess(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');

  const errorContainer = input.parentElement.querySelector('.form-field-error');
  if (errorContainer) {
    errorContainer.textContent = '';
  }
}

// Очистка ошибки поля
function clearFieldError(input) {
  input.classList.remove('is-invalid');
  const errorContainer = input.parentElement.querySelector('.form-field-error');
  if (errorContainer) {
    errorContainer.textContent = '';
  }
}

// Обработка успешной отправки формы
function handleFormSuccess(form, type) {
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка заявки...';
  }

  setTimeout(() => {
    // Очищаем старые сообщения
    let successBox = form.parentElement.querySelector('.form-success-banner');
    if (!successBox) {
      successBox = document.createElement('div');
      successBox.className = 'form-success-banner';
      successBox.setAttribute('role', 'status');
      form.parentElement.prepend(successBox);
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    const title = document.createElement('h3');
    title.className = 'form-success-title';
    title.textContent = type === 'order' ? '✓ Заявка успешно оформлена!' : '✓ Ваше сообщение отправлено!';

    const desc = document.createElement('p');
    desc.className = 'form-success-desc';
    desc.textContent = type === 'order'
      ? `Заказ №SP-${orderNumber} передан аудиологу. Мы свяжемся с вами в течение 15 минут для подтверждения времени доставки.`
      : 'Спасибо за обращение! Аудиоинженер шоурума свяжется с вами по указанному телефону.';

    successBox.innerHTML = '';
    successBox.append(title, desc);

    // Сброс полей формы
    form.reset();
    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

    // Если был заказ — очищаем корзину в localStorage
    if (type === 'order' && typeof saveCart === 'function') {
      saveCart([]);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = type === 'order' ? 'Оформить заявку' : 'Отправить сообщение';
    }

    // Прокрутка к сообщению об успехе
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 600);
}
