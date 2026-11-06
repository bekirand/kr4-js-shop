/* Массив товаров интернет-магазина SoundPulse */
const products = [
  {
    id: 1,
    title: 'SoundPulse Pro Wireless',
    category: 'headphones',
    price: 24990,
    oldPrice: 28900,
    rating: 4.9,
    badge: 'Хит продаж',
    image: 'images/headphones-pro.svg',
    isAvailable: true,
    description: 'Планарно-магнитные беспроводные наушники с активным гибридным шумоподавлением ANC и поддержкой LDAC.'
  },
  {
    id: 2,
    title: 'Studio 5X Active Pair',
    category: 'monitors',
    price: 42500,
    oldPrice: null,
    rating: 4.8,
    badge: 'Новинка',
    image: 'images/studio-monitors.svg',
    isAvailable: true,
    description: 'Двухполосная пара активных студийных мониторов bi-amp 100 Вт с кевларовыми вуферами и акустическим DSP.'
  },
  {
    id: 3,
    title: 'Master DAC & Amp Mini',
    category: 'dacs',
    price: 18900,
    oldPrice: 22990,
    rating: 4.9,
    badge: 'Скидка -18%',
    image: 'images/dac-amp.svg',
    isAvailable: true,
    description: 'Балансный стационарный ЦАП на чипе ESS ES9038PRO с усилителем для наушников и разъемом Pentaconn 4.4 мм.'
  },
  {
    id: 4,
    title: 'Outdoor Hi-Fi 360',
    category: 'speakers',
    price: 12400,
    oldPrice: null,
    rating: 4.7,
    badge: null,
    image: 'images/portable-speaker.svg',
    isAvailable: true,
    description: 'Влагозащищенная портативная акустика IP67 мощностью 60 Вт с объемным звучанием 360 градусов и TWS-стерео.'
  },
  {
    id: 5,
    title: 'Clarity IEM Quad-Driver',
    category: 'earbuds',
    price: 15800,
    oldPrice: 17500,
    rating: 4.8,
    badge: 'Hi-Res',
    image: 'images/earbuds.svg',
    isAvailable: true,
    description: 'Внутриканальные арматурные 4-драйверные мониторы с корпусами из смолы и посеребренным кабелем 8 жил.'
  },
  {
    id: 6,
    title: 'Open Reference 600Ω',
    category: 'headphones',
    price: 31200,
    oldPrice: null,
    rating: 4.9,
    badge: null,
    image: 'images/headphones-pro.svg',
    isAvailable: true,
    description: 'Открытые мониторные наушники аудиофильского класса с велюровыми амбушюрами для студийного мастеринга.'
  },
  {
    id: 7,
    title: 'Studio Sub 8S Bass',
    category: 'monitors',
    price: 36900,
    oldPrice: null,
    rating: 4.7,
    badge: null,
    image: 'images/studio-monitors.svg',
    isAvailable: true,
    description: 'Активный студийный сабвуфер 8 дюймов 150 Вт с фазоинвертором и точной подстройкой частоты среза кроссовера.'
  },
  {
    id: 8,
    title: 'PureStream Balanced DAC',
    category: 'dacs',
    price: 27500,
    oldPrice: 31000,
    rating: 4.9,
    badge: 'Выбор экспертов',
    image: 'images/dac-amp.svg',
    isAvailable: true,
    description: 'Прецизионный цифро-аналоговый преобразователь с двойным моно-трактом, Bluetooth 5.3 и входами USB / Optical.'
  },
  {
    id: 9,
    title: 'Voyager Mini Bluetooth',
    category: 'speakers',
    price: 8900,
    oldPrice: null,
    rating: 4.6,
    badge: null,
    image: 'images/portable-speaker.svg',
    isAvailable: true,
    description: 'Компактная портативная колонка для путешествий с пассивным радиатором и до 18 часов воспроизведения музыки.'
  },
  {
    id: 10,
    title: 'Stage IEM Dual Hybrid',
    category: 'earbuds',
    price: 11500,
    oldPrice: 13900,
    rating: 4.7,
    badge: 'Скидка -17%',
    image: 'images/earbuds.svg',
    isAvailable: true,
    description: 'Гибридные наушники с динамическим басовым драйвером и арматурным твитером для концертного мониторинга.'
  }
];
