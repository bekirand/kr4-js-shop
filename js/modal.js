/* Управление модальным окном быстрого заказа через HTML5 Dialog API */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.js-open-modal');
  const closeButtons = document.querySelectorAll('.js-close-modal');
  const quickForm = modal.querySelector('form');

  // Открытие модального окна
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }

      // Фокусировка на первом инпуте
      const firstInput = modal.querySelector('input:not([type="hidden"])');
      if (firstInput) firstInput.focus();
    });
  });

  // Закрытие модального окна по кнопке крестика
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeModal();
    });
  });

  // Закрытие по клику на backdrop
  modal.addEventListener('click', event => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });

  // Закрытие по клавише Escape
  modal.addEventListener('cancel', () => {
    closeModal();
  });

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

  // Обработка формы быстрого заказа в модальном окне
  if (quickForm) {
    quickForm.addEventListener('submit', event => {
      event.preventDefault();

      const phoneInput = quickForm.querySelector('[name="phone"]');
      if (phoneInput && phoneInput.value.trim().length < 10) {
        let err = quickForm.querySelector('.modal-form-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'modal-form-error form-field-error';
          quickForm.append(err);
        }
        err.textContent = 'Пожалуйста, укажите корректный номер телефона';
        return;
      }

      const modalBody = modal.querySelector('.modal__body') || modal;
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-banner';

      const successTitle = document.createElement('h3');
      successTitle.className = 'form-success-title';
      successTitle.textContent = '✓ Заявка принята!';

      const successText = document.createElement('p');
      successText.className = 'form-success-desc';
      successText.textContent = 'Менеджер свяжется с вами в течение 10 минут для консультации.';

      successMsg.append(successTitle, successText);
      quickForm.replaceWith(successMsg);

      setTimeout(() => {
        closeModal();
      }, 2500);
    });
  }
});
