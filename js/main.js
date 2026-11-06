/* Главный файл инициализации скриптов интернет-магазина SoundPulse */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация мобильного бургер-меню
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('site-nav--open');
    });

    // Закрытие меню по нажатию клавиши Escape
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && primaryNav.classList.contains('site-nav--open')) {
        primaryNav.classList.remove('site-nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Закрытие меню при переходе по ссылке
    primaryNav.querySelectorAll('.site-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('site-nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Логика страницы отдельного товара (product.html)
  const productBuyBtn = document.querySelector('.js-product-buy');
  if (productBuyBtn) {
    productBuyBtn.addEventListener('click', () => {
      if (typeof addToCart === 'function') {
        addToCart(1); // Добавляем флагманский товар SoundPulse Pro Wireless (id: 1)
        productBuyBtn.textContent = '✓ Товар в корзине';
        setTimeout(() => {
          productBuyBtn.textContent = 'Добавить в корзину';
        }, 1800);
      }
    });
  }

  // 3. Синхронизация бейджа корзины
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
});
