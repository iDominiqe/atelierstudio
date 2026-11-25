import type {
  ArtFilterId,
  BacklightModeId,
  CanvasFinishId,
  FrameStyleId,
  GarmentColorId,
  GarmentCutId,
  GarmentTypeId,
  LanguageCode,
  PrintPlacementId,
} from '../types/studio';

export interface TranslationBundle {
  brandSubtitle: string;
  modeCanvas: string;
  modeApparel: string;
  uploadPhotoBtn: string;
  daylightStudio: string;
  nightSpotlight: string;
  preview3D: string;
  orderNow: string;
  // Left Dock
  artworkStep: string;
  artworkTitle: string;
  uploadTitle: string;
  uploadHint: string;
  customTextureActive: string;
  removeUploadTitle: string;
  textureFitLabel: string;
  fitCover: string;
  fitContain: string;
  curatedPresets: string;
  artStyleLabel: string;
  liveFx: string;
  included: string;
  customSignatureLabel: string;
  customSignaturePlaceholder: string;
  customSignatureHint: string;
  // Right Dock
  wallSpecsStep: string;
  garmentSpecsStep: string;
  wallSpecsTitle: string;
  garmentSpecsTitle: string;
  orientationLabel: string;
  orientationPortrait: string;
  orientationLandscape: string;
  canvasDimensionsLabel: string;
  cmScaleBadge: string;
  customDimensionsTitle: string;
  customDimensionsSub: string;
  widthCmLabel: string;
  heightCmLabel: string;
  areaLabel: string;
  perimeterLabel: string;
  scaleSofa: string;
  scaleHuman: string;
  scaleWall: string;
  frameArchLabel: string;
  canvasFinishLabel: string;
  finishMatteShort: string;
  finishGlossShort: string;
  backlightSectionLabel: string;
  daylightGalleryBtn: string;
  nightSpotlightBtn: string;
  garmentModelLabel: string;
  garmentCutLabel: string;
  fabricColorLabel: string;
  printPlacementLabel: string;
  autoCamBadge: string;
  fineTunePrintLabel: string;
  resetBtn: string;
  printScaleLabel: string;
  verticalOffsetLabel: string;
  livePriceBreakdown: string;
  totalLabel: string;
  pieceSingular: string;
  piecePlural: string;
  previewBtn: string;
  sendToOrderBtn: string;
  // Camera & Fullscreen
  camFront: string;
  camAngle45: string;
  camRear: string;
  camSleeve: string;
  camMacro: string;
  camMacroWeave: string;
  cam360: string;
  camFullscreen: string;
  savePreviewCard: string;
  previewCardSavedToast: string;
  exitPreview: string;
  orderShort: string;
  // Checkout
  checkoutBrandSub: string;
  checkoutTitle: string;
  orderConfirmedTitle: string;
  modeBadgeCanvas: string;
  modeBadgeApparel: string;
  stylePrefix: string;
  selectedSpecsLabel: string;
  fullNameLabel: string;
  phoneTelegramLabel: string;
  deliveryAddressLabel: string;
  productionNotesLabel: string;
  estDispatchLabel: string;
  estDispatchValue: string;
  submitOrderBtn: string;
  orderQueuedTitle: string;
  orderQueuedDescPre: string;
  orderQueuedDescPost: string;
  trackingNumberLabel: string;
  clientLabel: string;
  totalAmountLabel: string;
  deliveryLabel: string;
  specsLabel: string;
  downloadPreviewCard: string;
  createAnotherPiece: string;
  // Preloader
  preloaderSubtitle: string;
  preloaderStages: [string, string, string, string];
  // Catalog labels
  roomRec: Record<'30x40' | '50x70' | '70x100' | '100x150', string>;
  frames: Record<FrameStyleId, { name: string; subtitle: string }>;
  finishes: Record<CanvasFinishId, { name: string; subtitle: string }>;
  filters: Record<ArtFilterId, { name: string; subtitle: string }>;
  backlights: Record<BacklightModeId, { name: string; subtitle: string }>;
  garmentTypes: Record<GarmentTypeId, { name: string; subtitle: string }>;
  garmentCuts: Record<GarmentCutId, { name: string; subtitle: string }>;
  garmentColors: Record<GarmentColorId, string>;
  placements: Record<PrintPlacementId, { name: string; subtitle: string }>;
  presets: Record<string, { title: string; artistTag: string; category: string }>;
  // Price item labels
  priceMuseumCanvas: string;
  priceCustomCanvas: string;
  priceArtStylePrefix: string;
  priceBacklightPrefix: string;
  priceOversizedBoost: string;
  priceCustomSignature: string;
  priceCutPrefix: string;
  dropHintTitle: string;
  dropHintSub: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: {
    brandSubtitle: 'Bespoke Fine-Art Portraits & Custom Apparel',
    modeCanvas: 'Custom Canvas Portraits',
    modeApparel: 'Custom Apparel',
    uploadPhotoBtn: 'Upload Photo',
    daylightStudio: 'Daylight Studio',
    nightSpotlight: 'Night Spotlight',
    preview3D: '3D Preview',
    orderNow: 'Order Now',
    artworkStep: '01 · Artwork Source',
    artworkTitle: 'Portrait / Logo Studio',
    uploadTitle: 'Upload Your Photo / Logo',
    uploadHint: 'JPG, PNG, WEBP · Instant 3D Mapping',
    customTextureActive: 'CUSTOM TEXTURE ACTIVE',
    removeUploadTitle: 'Remove uploaded image',
    textureFitLabel: 'Image Crop / Fit',
    fitCover: 'Fill (Cover)',
    fitContain: 'Fit Whole (Contain)',
    curatedPresets: 'Curated Studio Presets',
    artStyleLabel: 'Artistic Finish Style',
    liveFx: 'LIVE FX',
    included: 'Incl.',
    customSignatureLabel: 'Custom Print Signature',
    customSignaturePlaceholder: 'e.g. ATELIER · MMXXVI',
    customSignatureHint: 'Stamps a serif museum inscription onto your artwork or print.',
    wallSpecsStep: '02 · Wall Art Specs',
    garmentSpecsStep: '02 · Garment Specs',
    wallSpecsTitle: 'Canvas, Frame & Lighting',
    garmentSpecsTitle: 'Apparel, Cut & Print',
    orientationLabel: 'Orientation',
    orientationPortrait: 'Portrait (Vert.)',
    orientationLandscape: 'Landscape (Horiz.)',
    canvasDimensionsLabel: 'Canvas Dimensions',
    cmScaleBadge: 'CM SCALE',
    customDimensionsTitle: 'Custom Dimensions',
    customDimensionsSub: '20 – 200 cm · Area & perimeter pricing',
    widthCmLabel: 'Width',
    heightCmLabel: 'Height',
    areaLabel: 'Area',
    perimeterLabel: 'Perimeter',
    scaleSofa: 'Sofa',
    scaleHuman: '175cm',
    scaleWall: 'Wall Only',
    frameArchLabel: '3D Frame Architecture',
    canvasFinishLabel: 'Canvas Surface Finish',
    finishMatteShort: 'Matte Fine-Art',
    finishGlossShort: 'Satin / Gloss',
    backlightSectionLabel: 'Backlit Halo LED & Room',
    daylightGalleryBtn: 'Daylight Gallery',
    nightSpotlightBtn: 'Night Spotlight',
    garmentModelLabel: '3D Garment Category',
    garmentCutLabel: 'Fit & Silhouette Cut',
    fabricColorLabel: 'Fabric Colorway',
    printPlacementLabel: 'Print / Logo Placement',
    autoCamBadge: 'AUTO-CAM',
    fineTunePrintLabel: 'Fine-Tune Print Geometry',
    resetBtn: 'Reset',
    printScaleLabel: 'Print Scale',
    verticalOffsetLabel: 'Vertical Offset',
    livePriceBreakdown: 'Live Price Breakdown',
    totalLabel: 'Total',
    pieceSingular: 'piece',
    piecePlural: 'pieces',
    previewBtn: 'Preview',
    sendToOrderBtn: 'Send to Order',
    camFront: 'Front',
    camAngle45: '45° Angle',
    camRear: 'Rear',
    camSleeve: 'Sleeve',
    camMacro: 'Macro',
    camMacroWeave: 'Macro Weave',
    cam360: '360° Orbit',
    camFullscreen: 'Fullscreen',
    savePreviewCard: 'Save Preview Card',
    previewCardSavedToast: 'Preview Card Saved (PNG)',
    exitPreview: 'Exit Preview',
    orderShort: 'Order',
    checkoutBrandSub: 'Atelier Lumière · Bespoke Production',
    checkoutTitle: 'Review & Send to Order',
    orderConfirmedTitle: 'Order Confirmed',
    modeBadgeCanvas: 'Custom Canvas Portrait',
    modeBadgeApparel: 'Custom Apparel',
    stylePrefix: 'Style',
    selectedSpecsLabel: 'Selected Studio Specifications',
    fullNameLabel: 'Full Name',
    phoneTelegramLabel: 'Phone / Telegram',
    deliveryAddressLabel: 'Delivery Address',
    productionNotesLabel: 'Atelier Production Notes',
    estDispatchLabel: 'EST. DISPATCH',
    estDispatchValue: '48 Hours Express',
    submitOrderBtn: 'Submit Order',
    orderQueuedTitle: 'Bespoke Commission Queued for Production!',
    orderQueuedDescPre: 'Our master printmaker will verify color calibration and reach out via',
    orderQueuedDescPost: 'before shipping.',
    trackingNumberLabel: 'Order Tracking Number',
    clientLabel: 'Client',
    totalAmountLabel: 'Total Paid / Due',
    deliveryLabel: 'Delivery',
    specsLabel: 'Specs',
    downloadPreviewCard: 'Download Preview Card',
    createAnotherPiece: 'Create Another Piece',
    preloaderSubtitle: '3D Bespoke Portrait & Apparel Engine',
    preloaderStages: [
      'Initializing WebGL2 & ACES Tone Mapping',
      'Synthesizing Linen & Cotton PBR Normal Maps',
      'Compiling Tailored 3D Garment & Frame Meshes',
      'Calibrating HDRI Gallery Lighting & Bloom',
    ],
    roomRec: {
      '30x40': 'Desk / Intimate Alcove',
      '50x70': 'Bedroom / Studio Wall',
      '70x100': 'Living Room Centerpiece',
      '100x150': 'Grand Gallery Statement',
    },
    frames: {
      frameless: { name: 'Frameless Gallery Wrap', subtitle: '4.5 cm museum-wrapped edges' },
      'matte-black': { name: 'Matte Black Aluminum', subtitle: 'Anodized minimalist float profile' },
      'brushed-gold': { name: 'Brushed Gold / Brass', subtitle: 'Satin-burnished architectural brass' },
      'natural-oak': { name: 'Natural Oak Wood', subtitle: 'Nordic white-oak + crisp mat' },
      'ornate-walnut': { name: 'Ornate Dark Walnut', subtitle: 'Sculpted baroque profile + gold fillet' },
    },
    finishes: {
      matte: { name: 'Matte Fine-Art Canvas', subtitle: '0.85 roughness · Zero glare linen weave' },
      'satin-gloss': { name: 'Satin / Gloss Varnish', subtitle: '0.22 roughness · Gallery UV lacquer sheen' },
    },
    filters: {
      original: { name: 'Original Studio HD', subtitle: 'True color archival pigment' },
      'oil-impasto': { name: 'Oil Impasto Brush', subtitle: 'Rich painter strokes & warmth' },
      'pop-neon': { name: 'Cyber Pop Neon', subtitle: 'Electric duotone rim contrast' },
      'noir-charcoal': { name: 'Charcoal Noir', subtitle: 'Editorial silver-gelatin B&W' },
      'renaissance-gold': { name: 'Renaissance Gold', subtitle: 'Chiaroscuro amber & gilt tone' },
    },
    backlights: {
      off: { name: 'No Backlight', subtitle: 'Natural gallery lighting only' },
      'warm-white': { name: 'Warm Halo 2700K', subtitle: 'Soft golden ambient wall glow' },
      'cool-white': { name: 'Gallery White 5500K', subtitle: 'Crisp museum daylight halo' },
      'rgb-sunset': { name: 'Sunset Aura RGB', subtitle: 'Coral & amber ambient LED strip' },
      'rgb-cyber': { name: 'Cyber Studio RGB', subtitle: 'Cyan & ultraviolet perimeter LED' },
    },
    garmentTypes: {
      tshirt: { name: 'Crewneck T-Shirt', subtitle: '280 GSM Combed Cotton' },
      hoodie: { name: 'Hoodie / Sweatshirt', subtitle: '480 GSM Heavy French Terry' },
    },
    garmentCuts: {
      'regular-tshirt': { name: 'Classic Regular Fit', subtitle: 'Balanced everyday tailored cut' },
      'oversized-tshirt': { name: 'Boxy Oversized Drop-Shoulder', subtitle: 'Wide silhouette & elongated sleeves' },
      'slim-tshirt': { name: 'Slim / Athletic Fit', subtitle: 'Contoured waist & fitted sleeves' },
      'classic-hoodie': { name: 'Classic Pullover Hoodie', subtitle: 'Tailored hood, drawstrings & pouch' },
      'oversized-hoodie': { name: 'Oversized Streetwear Hoodie', subtitle: 'Boxy drop-shoulder & stacked cuffs' },
      'crewneck-sweatshirt': { name: 'Crewneck Sweatshirt', subtitle: 'No hood · Ribbed collar & clean front' },
    },
    garmentColors: {
      'optic-white': 'Optic White',
      'jet-black': 'Jet Black',
      'heather-grey': 'Heather Grey',
      'navy-blue': 'Navy Blue',
      'forest-green': 'Forest Green',
      'sand-beige': 'Sand Beige',
      burgundy: 'Burgundy',
    },
    placements: {
      'left-chest': { name: 'Left Chest Pocket', subtitle: 'Subtle badge / crest print' },
      'center-chest': { name: 'Center Chest Print', subtitle: 'Statement front centerpiece' },
      'full-back': { name: 'Full Back Graphic', subtitle: 'Oversized studio back print' },
      sleeve: { name: 'Left Sleeve Emblem', subtitle: 'Signature arm cuff print' },
    },
    presets: {
      'golden-sovereign': { title: 'Golden Sovereign', artistTag: 'Baroque Oil Portrait', category: 'Fine Art' },
      'cyber-botanica': { title: 'Cyberpunk Botanica', artistTag: 'Neon Bioluminescence', category: 'Neo Digital' },
      'atelier-noir': { title: 'Atelier Noir Study', artistTag: 'Architectural Monochrome', category: 'Editorial' },
      'astral-samurai': { title: 'Astral Samurai Crest', artistTag: 'Crimson Sun Emblem', category: 'Street Luxury' },
      'velvet-horizon': { title: 'Velvet Horizon', artistTag: 'Modernist Impasto', category: 'Gallery Abstract' },
    },
    priceMuseumCanvas: 'Museum Canvas',
    priceCustomCanvas: 'Custom Canvas',
    priceArtStylePrefix: 'Art Style',
    priceBacklightPrefix: 'LED Backlight',
    priceOversizedBoost: 'Oversized Print Boost',
    priceCustomSignature: 'Custom Atelier Signature',
    priceCutPrefix: 'Cut',
    dropHintTitle: 'Drop Your Portrait or Logo Here',
    dropHintSub: 'Instant 3D texture projection onto canvas or apparel',
  },

  ru: {
    brandSubtitle: 'Авторские портреты на холсте и одежда с принтом',
    modeCanvas: 'Холсты и Портреты',
    modeApparel: 'Одежда и Принты',
    uploadPhotoBtn: 'Загрузить фото',
    daylightStudio: 'Дневной свет',
    nightSpotlight: 'Ночной софит',
    preview3D: '3D Превью',
    orderNow: 'Заказать',
    artworkStep: '01 · Изображение',
    artworkTitle: 'Студия портрета и лого',
    uploadTitle: 'Загрузить фото / логотип',
    uploadHint: 'JPG, PNG, WEBP · Мгновенная 3D-примерка',
    customTextureActive: 'ВАША КАРТИНКА АКТИВНА',
    removeUploadTitle: 'Удалить загруженное фото',
    textureFitLabel: 'Вписывание фото',
    fitCover: 'Заполнить (Cover)',
    fitContain: 'Целиком (Contain)',
    curatedPresets: 'Готовые арт-пресеты',
    artStyleLabel: 'Художественный стиль',
    liveFx: 'LIVE FX',
    included: 'Вкл.',
    customSignatureLabel: 'Именная подпись / текст',
    customSignaturePlaceholder: 'Напр.: ATELIER · MMXXVI',
    customSignatureHint: 'Наносит музейную надпись на холст или принт.',
    wallSpecsStep: '02 · Параметры холста',
    garmentSpecsStep: '02 · Параметры одежды',
    wallSpecsTitle: 'Холст, рамка и подсветка',
    garmentSpecsTitle: 'Крой, цвет и принт',
    orientationLabel: 'Ориентация холста',
    orientationPortrait: 'Портрет (Верт.)',
    orientationLandscape: 'Пейзаж (Гориз.)',
    canvasDimensionsLabel: 'Размер холста',
    cmScaleBadge: 'В САНТИМЕТРАХ',
    customDimensionsTitle: 'Свой размер (20–200 см)',
    customDimensionsSub: 'Расчёт по площади (см²) и периметру',
    widthCmLabel: 'Ширина',
    heightCmLabel: 'Высота',
    areaLabel: 'Площадь',
    perimeterLabel: 'Периметр',
    scaleSofa: 'Диван',
    scaleHuman: '175 см',
    scaleWall: 'Стена',
    frameArchLabel: '3D Рамка и багет',
    canvasFinishLabel: 'Покрытие холста',
    finishMatteShort: 'Матовый холст',
    finishGlossShort: 'Сатин / Глянец',
    backlightSectionLabel: 'LED-подсветка и свет зала',
    daylightGalleryBtn: 'Дневной зал',
    nightSpotlightBtn: 'Музейный софит',
    garmentModelLabel: 'Тип одежды',
    garmentCutLabel: 'Крой и посадка (Fit / Cut)',
    fabricColorLabel: 'Цвет ткани',
    printPlacementLabel: 'Расположение принта',
    autoCamBadge: 'АВТО-РАКУРС',
    fineTunePrintLabel: 'Размер и позиция принта',
    resetBtn: 'Сброс',
    printScaleLabel: 'Масштаб принта',
    verticalOffsetLabel: 'Смещение по высоте',
    livePriceBreakdown: 'Калькуляция стоимости',
    totalLabel: 'Итого',
    pieceSingular: 'шт.',
    piecePlural: 'шт.',
    previewBtn: 'Превью',
    sendToOrderBtn: 'Оформить заказ',
    camFront: 'Спереди',
    camAngle45: 'Угол 45°',
    camRear: 'Спина',
    camSleeve: 'Рукав',
    camMacro: 'Макро',
    camMacroWeave: 'Текстура',
    cam360: '360° Обзор',
    camFullscreen: 'На весь экран',
    savePreviewCard: 'Сохранить карточку',
    previewCardSavedToast: 'Карточка превью сохранена (PNG)',
    exitPreview: 'Выйти из превью',
    orderShort: 'Заказ',
    checkoutBrandSub: 'Atelier Lumière · Индивидуальное производство',
    checkoutTitle: 'Проверка и отправка заказа',
    orderConfirmedTitle: 'Заказ подтверждён',
    modeBadgeCanvas: 'Портрет на холсте',
    modeBadgeApparel: 'Одежда с принтом',
    stylePrefix: 'Стиль',
    selectedSpecsLabel: 'Выбранная конфигурация',
    fullNameLabel: 'Имя и Фамилия',
    phoneTelegramLabel: 'Телефон / Telegram',
    deliveryAddressLabel: 'Адрес доставки',
    productionNotesLabel: 'Пожелания к заказу',
    estDispatchLabel: 'СРОК ИЗГОТОВЛЕНИЯ',
    estDispatchValue: '48 часов экспресс',
    submitOrderBtn: 'Отправить на заказ',
    orderQueuedTitle: 'Заказ принят в работу!',
    orderQueuedDescPre: 'Наш мастер проверит цветопробу и свяжется с вами через',
    orderQueuedDescPost: 'перед отправкой.',
    trackingNumberLabel: 'Трек-номер заказа',
    clientLabel: 'Клиент',
    totalAmountLabel: 'Сумма заказа',
    deliveryLabel: 'Доставка',
    specsLabel: 'Параметры',
    downloadPreviewCard: 'Скачать превью-карточку',
    createAnotherPiece: 'Создать новый макет',
    preloaderSubtitle: '3D-студия портретов и кастомной одежды',
    preloaderStages: [
      'Инициализация WebGL2 и тональной компрессии ACES',
      'Генерация PBR-текстур льна и хлопка',
      'Компиляция анатомических 3D-лекал одежды и рамок',
      'Калибровка студийного света HDRI и Bloom',
    ],
    roomRec: {
      '30x40': 'Рабочий стол / Ниша',
      '50x70': 'Спальня / Кабинет',
      '70x100': 'Гостиная / Акцент',
      '100x150': 'Большой зал / Галерея',
    },
    frames: {
      frameless: { name: 'Без рамки (Галерейная натяжка)', subtitle: 'Торцы 4.5 см на подрамнике' },
      'matte-black': { name: 'Чёрный матовый алюминий', subtitle: 'Тонкий анодированный профиль' },
      'brushed-gold': { name: 'Матовое золото / Латунь', subtitle: 'Сатинированный металлический багет' },
      'natural-oak': { name: 'Натуральный дуб', subtitle: 'Скандинавский дуб + паспарту' },
      'ornate-walnut': { name: 'Классический тёмный орех', subtitle: 'Резной багет + золотой кант' },
    },
    finishes: {
      matte: { name: 'Матовый арт-холст', subtitle: 'Шероховатость 0.85 · Без бликов' },
      'satin-gloss': { name: 'Сатин / Глянцевый лак', subtitle: 'Шероховатость 0.22 · Защитный UV-блеск' },
    },
    filters: {
      original: { name: 'Оригинал HD', subtitle: 'Точная пигментная цветопередача' },
      'oil-impasto': { name: 'Масляная живопись (Impasto)', subtitle: 'Фактурные мазки кистью и теплота' },
      'pop-neon': { name: 'Кибер-Неон Pop Art', subtitle: 'Яркий дуотон и контраст' },
      'noir-charcoal': { name: 'Угольный Нуар', subtitle: 'Чёрно-белая галерейная классика' },
      'renaissance-gold': { name: 'Золото Ренессанса', subtitle: 'Тёплая патина и светотень' },
    },
    backlights: {
      off: { name: 'Без подсветки', subtitle: 'Только основное освещение зала' },
      'warm-white': { name: 'Тёплая LED 2700K', subtitle: 'Мягкий золотой ореол на стене' },
      'cool-white': { name: 'Белая 5500K', subtitle: 'Чистый музейный дневной контур' },
      'rgb-sunset': { name: 'Закат RGB Aura', subtitle: 'Кораллово-янтарная LED-лента' },
      'rgb-cyber': { name: 'Кибер RGB Studio', subtitle: 'Неоновый бирюзово-фиолетовый ореол' },
    },
    garmentTypes: {
      tshirt: { name: 'Футболка / Майка', subtitle: '280 г/м² гребенной хлопок' },
      hoodie: { name: 'Батник / Худи / Свитшот', subtitle: '480 г/м² плотный футер' },
    },
    garmentCuts: {
      'regular-tshirt': { name: 'Классический крой (Regular)', subtitle: 'Универсальная анатомическая посадка' },
      'oversized-tshirt': { name: 'Оверсайз (Drop-Shoulder)', subtitle: 'Свободный силуэт и спущенное плечо' },
      'slim-tshirt': { name: 'Приталенный (Slim / Athletic)', subtitle: 'Подчёркнутая талия и узкий рукав' },
      'classic-hoodie': { name: 'Классическое худи с капюшоном', subtitle: 'Двойной капюшон, шнурки и кенгуру' },
      'oversized-hoodie': { name: 'Оверсайз стритвир худи', subtitle: 'Спущенное плечо и объёмный рукав' },
      'crewneck-sweatshirt': { name: 'Свитшот (Батник без капюшона)', subtitle: 'Без капюшона · Круглый вырез и манжеты' },
    },
    garmentColors: {
      'optic-white': 'Белоснежный',
      'jet-black': 'Угольно-чёрный',
      'heather-grey': 'Меланж серый',
      'navy-blue': 'Тёмно-синий',
      'forest-green': 'Изумрудный лес',
      'sand-beige': 'Песочный беж',
      burgundy: 'Бордовый',
    },
    placements: {
      'left-chest': { name: 'Слева на груди', subtitle: 'Аккуратный логотип / бейдж' },
      'center-chest': { name: 'По центру груди', subtitle: 'Крупный фронтальный принт' },
      'full-back': { name: 'Во всю спину', subtitle: 'Большая графика на спине' },
      sleeve: { name: 'На левом рукаве', subtitle: 'Фирменный акцент на рукаве' },
    },
    presets: {
      'golden-sovereign': { title: 'Золотой суверен', artistTag: 'Барочный портрет маслом', category: 'Живопись' },
      'cyber-botanica': { title: 'Кибер-Ботаника', artistTag: 'Неоновая биолюминесценция', category: 'Нео-Арт' },
      'atelier-noir': { title: 'Ателье Нуар', artistTag: 'Архитектурный монохром', category: 'Эдиториал' },
      'astral-samurai': { title: 'Астральный самурай', artistTag: 'Эмблема багрового солнца', category: 'Street Luxury' },
      'velvet-horizon': { title: 'Бархатный горизонт', artistTag: 'Модернистское импасто', category: 'Абстракция' },
    },
    priceMuseumCanvas: 'Холст',
    priceCustomCanvas: 'Свой размер холста',
    priceArtStylePrefix: 'Стиль арта',
    priceBacklightPrefix: 'LED-подсветка',
    priceOversizedBoost: 'Увеличенный формат (>120%)',
    priceCustomSignature: 'Именная подпись',
    priceCutPrefix: 'Крой',
    dropHintTitle: 'Перетащите фото или логотип сюда',
    dropHintSub: 'Мгновенная проекция на 3D-холст или одежду',
  },

  ro: {
    brandSubtitle: 'Portrete pe pânză și îmbrăcăminte personalizată',
    modeCanvas: 'Tablouri pe Pânză',
    modeApparel: 'Îmbrăcăminte Custom',
    uploadPhotoBtn: 'Încarcă Foto',
    daylightStudio: 'Lumină de Zi',
    nightSpotlight: 'Reflector Noapte',
    preview3D: 'Previzualizare 3D',
    orderNow: 'Comandă',
    artworkStep: '01 · Sursă Imagine',
    artworkTitle: 'Studio Portret & Logo',
    uploadTitle: 'Încarcă Fotografia / Logo',
    uploadHint: 'JPG, PNG, WEBP · Mapare 3D instant',
    customTextureActive: 'IMAGINE CUSTOM ACTIVĂ',
    removeUploadTitle: 'Elimină imaginea încărcată',
    textureFitLabel: 'Încadrare Imagine',
    fitCover: 'Umple (Cover)',
    fitContain: 'Întreagă (Contain)',
    curatedPresets: 'Modele de Studio HD',
    artStyleLabel: 'Stil Artistic',
    liveFx: 'LIVE FX',
    included: 'Incl.',
    customSignatureLabel: 'Semnătură / Text Custom',
    customSignaturePlaceholder: 'ex. ATELIER · MMXXVI',
    customSignatureHint: 'Adaugă o inscripție de muzeu pe pânză sau print.',
    wallSpecsStep: '02 · Specificații Tablou',
    garmentSpecsStep: '02 · Specificații Haină',
    wallSpecsTitle: 'Pânză, Ramă & Iluminare',
    garmentSpecsTitle: 'Croială, Culoare & Print',
    orientationLabel: 'Orientare',
    orientationPortrait: 'Portret (Vert.)',
    orientationLandscape: 'Peisaj (Oriz.)',
    canvasDimensionsLabel: 'Dimensiuni Pânză',
    cmScaleBadge: 'SCARĂ CM',
    customDimensionsTitle: 'Dimensiuni Custom',
    customDimensionsSub: '20 – 200 cm · Calcul pe arie (cm²) și perimetru',
    widthCmLabel: 'Lățime',
    heightCmLabel: 'Înălțime',
    areaLabel: 'Suprafață',
    perimeterLabel: 'Perimetru',
    scaleSofa: 'Canapea',
    scaleHuman: '175 cm',
    scaleWall: 'Perete',
    frameArchLabel: 'Ramă 3D & Profil',
    canvasFinishLabel: 'Finisaj Suprafață',
    finishMatteShort: 'Mat Fine-Art',
    finishGlossShort: 'Satin / Lucios',
    backlightSectionLabel: 'LED Halo & Lumină Sală',
    daylightGalleryBtn: 'Galerie Zi',
    nightSpotlightBtn: 'Reflector Noapte',
    garmentModelLabel: 'Categorie Haină 3D',
    garmentCutLabel: 'Croială (Fit / Cut)',
    fabricColorLabel: 'Culoare Material',
    printPlacementLabel: 'Poziție Print / Logo',
    autoCamBadge: 'AUTO-CAM',
    fineTunePrintLabel: 'Ajustare Fină Print',
    resetBtn: 'Reset',
    printScaleLabel: 'Scară Print',
    verticalOffsetLabel: 'Deplasare Verticală',
    livePriceBreakdown: 'Calcul Preț Live',
    totalLabel: 'Total',
    pieceSingular: 'buc.',
    piecePlural: 'buc.',
    previewBtn: 'Previz.',
    sendToOrderBtn: 'Trimite Comanda',
    camFront: 'Față',
    camAngle45: 'Unghi 45°',
    camRear: 'Spate',
    camSleeve: 'Mânecă',
    camMacro: 'Macro',
    camMacroWeave: 'Textură',
    cam360: 'Rotire 360°',
    camFullscreen: 'Ecran Complet',
    savePreviewCard: 'Salvează Card PNG',
    previewCardSavedToast: 'Cardul de previzualizare salvat (PNG)',
    exitPreview: 'Ieși din Preview',
    orderShort: 'Comandă',
    checkoutBrandSub: 'Atelier Lumière · Producție la Comandă',
    checkoutTitle: 'Verifică și Trimite Comanda',
    orderConfirmedTitle: 'Comandă Confirmată',
    modeBadgeCanvas: 'Tablou Canvas Custom',
    modeBadgeApparel: 'Îmbrăcăminte Custom',
    stylePrefix: 'Stil',
    selectedSpecsLabel: 'Specificații Selectate',
    fullNameLabel: 'Nume Complet',
    phoneTelegramLabel: 'Telefon / Telegram',
    deliveryAddressLabel: 'Adresa de Livrare',
    productionNotesLabel: 'Note Producție Atelier',
    estDispatchLabel: 'LIVRARE EST.',
    estDispatchValue: '48 Ore Express',
    submitOrderBtn: 'Confirmă Comanda',
    orderQueuedTitle: 'Comanda a fost trimisă în producție!',
    orderQueuedDescPre: 'Maestrul nostru va verifica calibrarea culorilor și vă va contacta pe',
    orderQueuedDescPost: 'înainte de expediere.',
    trackingNumberLabel: 'Cod Urmărire Comandă',
    clientLabel: 'Client',
    totalAmountLabel: 'Total de Plată',
    deliveryLabel: 'Livrare',
    specsLabel: 'Specificații',
    downloadPreviewCard: 'Descarcă Card Previzualizare',
    createAnotherPiece: 'Creează o Nouă Piesă',
    preloaderSubtitle: 'Motor 3D pentru Portrete și Îmbrăcăminte',
    preloaderStages: [
      'Inițializare WebGL2 & ACES Tone Mapping',
      'Generare hărți normale PBR pentru in și bumbac',
      'Compilare modele 3D croite și rame de galerie',
      'Calibrare iluminare HDRI și efect Bloom',
    ],
    roomRec: {
      '30x40': 'Birou / Nișă Intimă',
      '50x70': 'Dormitor / Perete Studio',
      '70x100': 'Living / Piesă Centrală',
      '100x150': 'Galerie Mare / Statement',
    },
    frames: {
      frameless: { name: 'Fără Ramă (Gallery Wrap)', subtitle: 'Margini 4.5 cm pe șasiu de lemn' },
      'matte-black': { name: 'Aluminiu Negru Mat', subtitle: 'Profil minimalist anodizat' },
      'brushed-gold': { name: 'Auriu Periat / Alamă', subtitle: 'Alamă arhitecturală satinată' },
      'natural-oak': { name: 'Stejar Natural', subtitle: 'Stejar nordic + passe-partout' },
      'ornate-walnut': { name: 'Nuc Închis Sculptat', subtitle: 'Profil baroc + bordură aurie' },
    },
    finishes: {
      matte: { name: 'Pânză Mată Fine-Art', subtitle: 'Rugozitate 0.85 · Fără reflexii' },
      'satin-gloss': { name: 'Lac Satin / Lucios', subtitle: 'Rugozitate 0.22 · Luciu UV de galerie' },
    },
    filters: {
      original: { name: 'Original Studio HD', subtitle: 'Pigmenți arhivali fideli' },
      'oil-impasto': { name: 'Pictură Ulei Impasto', subtitle: 'Tușe expresive și tonuri calde' },
      'pop-neon': { name: 'Cyber Pop Neon', subtitle: 'Contrast electric duoton' },
      'noir-charcoal': { name: 'Cărbune Noir', subtitle: 'Alb-negru clasic de galerie' },
      'renaissance-gold': { name: 'Aur Renaștere', subtitle: 'Chiaroscuro cald cu reflexe aurii' },
    },
    backlights: {
      off: { name: 'Fără Iluminare Spate', subtitle: 'Doar lumina naturală a sălii' },
      'warm-white': { name: 'Halo Cald 2700K', subtitle: 'Strălucire aurie pe perete' },
      'cool-white': { name: 'Alb Galerie 5500K', subtitle: 'Halo clar de lumină naturală' },
      'rgb-sunset': { name: 'Apus RGB Aura', subtitle: 'Bandă LED coral & chihlimbar' },
      'rgb-cyber': { name: 'Cyber Studio RGB', subtitle: 'LED perimetral cyan & ultraviolet' },
    },
    garmentTypes: {
      tshirt: { name: 'Tricou Crewneck', subtitle: '280 GSM Bumbac Pieptănat' },
      hoodie: { name: 'Hanorac / Sweatshirt', subtitle: '480 GSM Fleece Dens' },
    },
    garmentCuts: {
      'regular-tshirt': { name: 'Croială Clasică (Regular)', subtitle: 'Croială echilibrată de zi cu zi' },
      'oversized-tshirt': { name: 'Oversized Drop-Shoulder', subtitle: 'Siluetă amplă și umeri căzuți' },
      'slim-tshirt': { name: 'Slim / Athletic Fit', subtitle: 'Conturat pe talie și mâneci ajustate' },
      'classic-hoodie': { name: 'Hanorac Clasic cu Glugă', subtitle: 'Glugă structurată, șnururi și buzunar' },
      'oversized-hoodie': { name: 'Hanorac Oversized Streetwear', subtitle: 'Umeri căzuți și manșete late' },
      'crewneck-sweatshirt': { name: 'Sweatshirt (Fără Glugă)', subtitle: 'Fără glugă · Guler rotund și manșete' },
    },
    garmentColors: {
      'optic-white': 'Alb Optic',
      'jet-black': 'Negru Intens',
      'heather-grey': 'Gri Melanj',
      'navy-blue': 'Bleumarin',
      'forest-green': 'Verde Pădure',
      'sand-beige': 'Bej Nisip',
      burgundy: 'Burgundy',
    },
    placements: {
      'left-chest': { name: 'Piept Stânga', subtitle: 'Emblemă discretă tip badge' },
      'center-chest': { name: 'Centru Piept', subtitle: 'Print principal frontal' },
      'full-back': { name: 'Spate Complet', subtitle: 'Grafică mare pe tot spatele' },
      sleeve: { name: 'Mânecă Stânga', subtitle: 'Emblemă semnătură pe mânecă' },
    },
    presets: {
      'golden-sovereign': { title: 'Suveranul de Aur', artistTag: 'Portret Baroc în Ulei', category: 'Artă Fină' },
      'cyber-botanica': { title: 'Cyberpunk Botanica', artistTag: 'Bioluminescență Neon', category: 'Neo Digital' },
      'atelier-noir': { title: 'Studiu Atelier Noir', artistTag: 'Monocrom Arhitectural', category: 'Editorial' },
      'astral-samurai': { title: 'Blazon Samurai Astral', artistTag: 'Emblemă Soare Purpuriu', category: 'Street Luxury' },
      'velvet-horizon': { title: 'Orizont de Catifea', artistTag: 'Impasto Modernist', category: 'Abstract' },
    },
    priceMuseumCanvas: 'Pânză Muzeu',
    priceCustomCanvas: 'Pânză Custom',
    priceArtStylePrefix: 'Stil Artă',
    priceBacklightPrefix: 'LED Spate',
    priceOversizedBoost: 'Format Extins (>120%)',
    priceCustomSignature: 'Semnătură Atelier',
    priceCutPrefix: 'Croială',
    dropHintTitle: 'Trage fotografia sau logo-ul aici',
    dropHintSub: 'Proiecție 3D instant pe pânză sau haină',
  },
};
