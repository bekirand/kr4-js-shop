/* Управление состоянием корзины, расчетом сумм и localStorage */

const CART_STORAGE_KEY = 'soundpulse_cart';
const PROMO_STORAGE_KEY = 'soundpulse_promo';
const VALID_PROMO_CODE = 'SOUND2026';
const PROMO_DISCOUNT_PERCENT = 10;

// Получение корзины из localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Ошибка чтения корзины из localStorage', e);
    return [];
  }
}

// Сохранение корзины в localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Ошибка записи корзины в localStorage', e);
  }
  updateCartBadge();
}

// Получение активного промокода
function getActivePromo() {
  return localStorage.getItem(PROMO_STORAGE_KEY) || '';
}

// Сохранение промокода
function saveActivePromo(code) {
  if (code) {
    localStorage.setItem(PROMO_STORAGE_KEY, code);
  } else {
    localStorage.removeItem(PROMO_STORAGE_KEY);
  }
}

// Добавление товара в корзину
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }

  saveCart(cart);
  showCartToast('Товар добавлен в корзину');
}

// Удаление товара из корзины
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

// Изменение количества товара
function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

// Получение детального списка корзины с объектами товаров
function getCartDetailed() {
  const cart = getCart();
  if (typeof products === 'undefined') return [];

  return cart
    .map(item => {
      const product = products.find(p => p.id === item.id);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

// Расчет промежуточной суммы через reduce
function calculateSubtotal(cartDetailed) {
  return cartDetailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

// Расчет скидки по промокоду через функцию условий
function calculateDiscount(subtotal, promoCode) {
  if (promoCode && promoCode.trim().toUpperCase() === VALID_PROMO_CODE) {
    return Math.round((subtotal * PROMO_DISCOUNT_PERCENT) / 100);
  }
  return 0;
}

// Обновление бейджа количества товаров в шапке
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((count, item) => count + item.quantity, 0);
  const badges = document.querySelectorAll('.js-cart-count');

  badges.forEach(badge => {
    badge.textContent = totalCount > 0 ? String(totalCount) : '0';
    if (totalCount > 0) {
      badge.classList.remove('visually-hidden');
      badge.classList.remove('is-bumped');
      void badge.offsetWidth;
      badge.classList.add('is-bumped');
    }
  });
}

// Всплывающее уведомление о добавлении товара без alert()
function showCartToast(messageText) {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    document.body.append(toast);
  }

  toast.textContent = messageText;
  toast.classList.add('cart-toast--visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('cart-toast--visible');
  }, 2200);
}

// Отрисовка страницы корзины (cart.html)
function initCartPage() {
  const container = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('cart-summary-container');
  if (!container || !summaryContainer) return;

  function render() {
    const detailed = getCartDetailed();
    container.innerHTML = '';
    summaryContainer.innerHTML = '';

    // Пустая корзина
    if (detailed.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'cart-empty';

      const icon = document.createElement('div');
      icon.className = 'cart-empty__icon';
      icon.textContent = '🛒';
      icon.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h2');
      title.className = 'cart-empty__title';
      title.textContent = 'Ваша корзина пуста';

      const desc = document.createElement('p');
      desc.className = 'cart-empty__desc';
      desc.textContent = 'Выберите аудиофильские наушники или студийную технику в каталоге товаров.';

      const btn = document.createElement('a');
      btn.href = 'catalog.html';
      btn.className = 'button button--primary';
      btn.textContent = 'Перейти в каталог';

      emptyBox.append(icon, title, desc, btn);
      container.append(emptyBox);

      // Скрываем блок заказа в пустом состоянии
      summaryContainer.style.display = 'none';
      return;
    }

    summaryContainer.style.display = 'block';

    // Список товаров в корзине
    const list = document.createElement('div');
    list.className = 'cart-list';

    detailed.forEach(({ product, quantity }) => {
      const row = document.createElement('article');
      row.className = 'cart-item';

      // Изображение
      const imgWrap = document.createElement('div');
      imgWrap.className = 'cart-item__media';
      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.title;
      img.className = 'cart-item__img';
      img.width = 72;
      img.height = 72;
      imgWrap.append(img);

      // Описание
      const info = document.createElement('div');
      info.className = 'cart-item__info';
      const title = document.createElement('h3');
      title.className = 'cart-item__title';
      title.textContent = product.title;
      const priceSingle = document.createElement('div');
      priceSingle.className = 'cart-item__single-price';
      priceSingle.textContent = `${product.price.toLocaleString('ru-RU')} ₽ / шт.`;
      info.append(title, priceSingle);

      // Управление количеством
      const qtyControls = document.createElement('div');
      qtyControls.className = 'cart-item__quantity';

      const btnMinus = document.createElement('button');
      btnMinus.type = 'button';
      btnMinus.className = 'cart-qty-btn';
      btnMinus.textContent = '−';
      btnMinus.setAttribute('aria-label', `Уменьшить количество ${product.title}`);
      btnMinus.addEventListener('click', () => {
        if (quantity > 1) {
          updateQuantity(product.id, quantity - 1);
        } else {
          removeFromCart(product.id);
        }
        render();
      });

      const qtyVal = document.createElement('span');
      qtyVal.className = 'cart-qty-val';
      qtyVal.textContent = String(quantity);

      const btnPlus = document.createElement('button');
      btnPlus.type = 'button';
      btnPlus.className = 'cart-qty-btn';
      btnPlus.textContent = '+';
      btnPlus.setAttribute('aria-label', `Увеличить количество ${product.title}`);
      btnPlus.addEventListener('click', () => {
        updateQuantity(product.id, quantity + 1);
        render();
      });

      qtyControls.append(btnMinus, qtyVal, btnPlus);

      // Итого за строку
      const totalCol = document.createElement('div');
      totalCol.className = 'cart-item__total';
      const totalAmount = product.price * quantity;
      totalCol.textContent = `${totalAmount.toLocaleString('ru-RU')} ₽`;

      // Кнопка удаления
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'cart-item__remove';
      btnDel.textContent = '✕';
      btnDel.setAttribute('aria-label', `Удалить ${product.title} из корзины`);
      btnDel.addEventListener('click', () => {
        removeFromCart(product.id);
        render();
      });

      row.append(imgWrap, info, qtyControls, totalCol, btnDel);
      list.append(row);
    });

    container.append(list);

    // Сводка корзины (Summary)
    const subtotal = calculateSubtotal(detailed);
    const activePromo = getActivePromo();
    const discount = calculateDiscount(subtotal, activePromo);
    const total = subtotal - discount;

    const summaryCard = document.createElement('div');
    summaryCard.className = 'cart-summary-card';

    const cardTitle = document.createElement('h2');
    cardTitle.className = 'cart-summary-card__title';
    cardTitle.textContent = 'Итог заказа';

    // Индикатор прогресса бесплатной доставки
    const freeShippingThreshold = 10000;
    const tracker = document.createElement('div');
    tracker.className = 'free-shipping-tracker';

    const trackerText = document.createElement('div');
    trackerText.className = 'free-shipping-tracker__text';
    if (subtotal >= freeShippingThreshold) {
      trackerText.textContent = '✓ Бесплатная курьерская доставка активна!';
    } else {
      const remaining = freeShippingThreshold - subtotal;
      trackerText.textContent = `До бесплатной доставки: ${remaining.toLocaleString('ru-RU')} ₽`;
    }

    const trackerBar = document.createElement('div');
    trackerBar.className = 'free-shipping-tracker__bar';
    const trackerFill = document.createElement('div');
    trackerFill.className = 'free-shipping-tracker__fill';
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    trackerFill.style.width = `${progressPercent}%`;
    trackerBar.append(trackerFill);

    tracker.append(trackerText, trackerBar);
    summaryCard.append(cardTitle, tracker);

    // Строка товаров
    const rowSubtotal = document.createElement('div');
    rowSubtotal.className = 'cart-summary-row';
    const subtotalLabel = document.createElement('span');
    subtotalLabel.textContent = `Товары (${detailed.reduce((c, i) => c + i.quantity, 0)} шт.):`;
    const subtotalVal = document.createElement('span');
    subtotalVal.className = 'fw-bold';
    subtotalVal.textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    rowSubtotal.append(subtotalLabel, subtotalVal);

    // Строка скидки
    const rowDiscount = document.createElement('div');
    rowDiscount.className = 'cart-summary-row';
    const discountLabel = document.createElement('span');
    discountLabel.textContent = 'Скидка по промокоду:';
    const discountVal = document.createElement('span');
    discountVal.className = 'text-success fw-bold';
    discountVal.textContent = discount > 0 ? `−${discount.toLocaleString('ru-RU')} ₽` : '0 ₽';
    rowDiscount.append(discountLabel, discountVal);

    // Доставка
    const rowDelivery = document.createElement('div');
    rowDelivery.className = 'cart-summary-row';
    const deliveryLabel = document.createElement('span');
    deliveryLabel.textContent = 'Доставка курьером:';
    const deliveryVal = document.createElement('span');
    deliveryVal.className = 'text-success fw-bold';
    deliveryVal.textContent = 'Бесплатно';
    rowDelivery.append(deliveryLabel, deliveryVal);

    // Итого
    const rowTotal = document.createElement('div');
    rowTotal.className = 'cart-summary-row cart-summary-row--total';
    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'К оплате:';
    const totalVal = document.createElement('span');
    totalVal.className = 'cart-summary-total-val';
    totalVal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    rowTotal.append(totalLabel, totalVal);

    // Промокод блок
    const promoForm = document.createElement('form');
    promoForm.className = 'cart-promo-form';
    const promoInput = document.createElement('input');
    promoInput.type = 'text';
    promoInput.placeholder = 'Промокод (SOUND2026)';
    promoInput.className = 'cart-promo-input';
    promoInput.value = activePromo;

    const promoBtn = document.createElement('button');
    promoBtn.type = 'submit';
    promoBtn.className = 'button button--secondary button--sm';
    promoBtn.textContent = 'Применить';

    const promoMsg = document.createElement('div');
    promoMsg.className = 'cart-promo-msg';

    if (activePromo) {
      if (discount > 0) {
        promoMsg.textContent = '✓ Промокод SOUND2026 применен (-10%)';
        promoMsg.classList.add('text-success');
      } else {
        promoMsg.textContent = 'Неверный промокод';
        promoMsg.classList.add('text-danger');
      }
    }

    promoForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = promoInput.value.trim().toUpperCase();
      if (val === VALID_PROMO_CODE) {
        saveActivePromo(val);
      } else if (!val) {
        saveActivePromo('');
      } else {
        saveActivePromo(val);
      }
      render();
    });

    promoForm.append(promoInput, promoBtn);

    // Кнопка оформления
    const checkoutBtn = document.createElement('a');
    checkoutBtn.href = 'order.html';
    checkoutBtn.className = 'button button--primary button--full';
    checkoutBtn.textContent = 'Перейти к оформлению';

    summaryCard.append(cardTitle, rowSubtotal, rowDiscount, rowDelivery, rowTotal, promoForm, promoMsg, checkoutBtn);
    summaryContainer.append(summaryCard);
  }

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initCartPage();
});
