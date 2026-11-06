/* Рендеринг карточек каталога, живой поиск, фильтрация и сортировка */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('catalog-products-grid');
  if (!container || typeof products === 'undefined') return;

  const searchInput = document.getElementById('catalog-search-input');
  const categorySelect = document.getElementById('catalog-category-select');
  const sortSelect = document.getElementById('catalog-sort-select');
  const countElement = document.getElementById('catalog-count');

  // Создание отдельной карточки товара через DOM API
  function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = String(product.id);

    // Контейнер изображения
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'product-card__image-wrapper';

    // Бейдж при наличии
    if (product.badge) {
      const badge = document.createElement('span');
      badge.className = 'product-card__badge';
      badge.textContent = product.badge;
      imgWrapper.append(badge);
    }

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    img.className = 'product-card__image';
    img.loading = 'lazy';
    img.width = 300;
    img.height = 200;
    imgWrapper.append(img);

    // Контейнер описания
    const body = document.createElement('div');
    body.className = 'product-card__body';

    const categoryText = document.createElement('p');
    categoryText.className = 'product-card__category';
    const categoryNames = {
      headphones: 'Полноразмерные наушники',
      monitors: 'Студийные мониторы',
      dacs: 'ЦАП и усилители',
      speakers: 'Портативная акустика',
      earbuds: 'Внутриканальные мониторы'
    };
    categoryText.textContent = categoryNames[product.category] || 'Аудиотехника';

    const title = document.createElement('h3');
    title.className = 'product-card__title';
    title.textContent = product.title;

    const desc = document.createElement('p');
    desc.className = 'product-card__description';
    desc.textContent = product.description;

    // Подвал карточки с ценой и кнопками
    const footer = document.createElement('div');
    footer.className = 'product-card__footer';

    const priceBox = document.createElement('div');
    priceBox.className = 'product-card__price-box';

    const currentPrice = document.createElement('span');
    currentPrice.className = 'product-card__price';
    currentPrice.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    priceBox.append(currentPrice);

    if (product.oldPrice) {
      const oldPrice = document.createElement('span');
      oldPrice.className = 'product-card__old-price';
      oldPrice.textContent = `${product.oldPrice.toLocaleString('ru-RU')} ₽`;
      priceBox.append(oldPrice);
    }

    const actions = document.createElement('div');
    actions.className = 'product-card__actions';

    const detailLink = document.createElement('a');
    detailLink.href = 'product.html';
    detailLink.className = 'button button--sm button--secondary';
    detailLink.textContent = 'Обзор';

    const cartBtn = document.createElement('button');
    cartBtn.type = 'button';
    cartBtn.className = 'button button--sm button--primary js-add-to-cart';
    cartBtn.textContent = 'В корзину';
    cartBtn.setAttribute('aria-label', `Добавить ${product.title} в корзину`);

    cartBtn.addEventListener('click', () => {
      if (typeof addToCart === 'function') {
        addToCart(product.id);
        cartBtn.textContent = '✓ В корзине';
        cartBtn.classList.add('button--success');
        setTimeout(() => {
          cartBtn.textContent = 'В корзину';
          cartBtn.classList.remove('button--success');
        }, 1500);
      }
    });

    actions.append(detailLink, cartBtn);
    footer.append(priceBox, actions);

    body.append(categoryText, title, desc, footer);
    card.append(imgWrapper, body);

    return card;
  }

  // Отрисовка массива товаров или пустого состояния
  function renderProducts(items) {
    container.innerHTML = '';

    if (countElement) {
      countElement.textContent = `Найдено: ${items.length} ${getWordForm(items.length, ['товар', 'товара', 'товаров'])}`;
    }

    if (items.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'catalog-empty';

      const icon = document.createElement('div');
      icon.className = 'catalog-empty__icon';
      icon.textContent = '🔍';
      icon.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h3');
      title.className = 'catalog-empty__title';
      title.textContent = 'Ничего не найдено';

      const text = document.createElement('p');
      text.className = 'catalog-empty__text';
      text.textContent = 'Попробуйте изменить поисковый запрос или сбросить фильтры.';

      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'button button--secondary';
      resetBtn.textContent = 'Сбросить фильтры';
      resetBtn.addEventListener('click', resetFilters);

      emptyState.append(icon, title, text, resetBtn);
      container.append(emptyState);
      return;
    }

    items.forEach(product => {
      const card = createProductCard(product);
      container.append(card);
    });
  }

  // Склонение слов в счетчике
  function getWordForm(number, forms) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 19) return forms[2];
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
  }

  // Применение поиска, фильтрации и сортировки
  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const sortValue = sortSelect ? sortSelect.value : 'default';

    // 1. Фильтрация (создает новый массив без мутации)
    let filtered = products.filter(product => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // 2. Сортировка копии массива
    const sorted = [...filtered];
    if (sortValue === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name-asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    } else if (sortValue === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    renderProducts(sorted);
  }

  // Сброс всех фильтров
  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    applyFilters();
  }

  // Подключение слушателей событий
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  // Начальная отрисовка
  applyFilters();
});
