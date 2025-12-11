

import { Section, SlideData, Language, SlideType, CameraConfig } from './types';
import { Image as ImageIcon, List, Hash, CalendarClock, SplitSquareHorizontal, LayoutGrid, BarChart3, Megaphone, FileText, Quote, Users, ArrowRightCircle, MousePointerClick, Images } from 'lucide-react';

export const FONTS = {
    // Using JSDelivr/@fontsource for reliable, permanent file access. 
    // Direct Google Fonts links (fonts.gstatic.com) can expire or change versions, causing Network Errors in Three.js Text.
    EN_SANS: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.17/files/inter-latin-400-normal.woff',
    EN_SERIF: 'https://cdn.jsdelivr.net/npm/@fontsource/merriweather@5.0.13/files/merriweather-latin-400-normal.woff',
    EN_MONO: 'https://cdn.jsdelivr.net/npm/@fontsource/roboto-mono@5.0.13/files/roboto-mono-latin-400-normal.woff',
    // Vazirmatn for Farsi support
    FA_REGULAR: 'https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/fonts/ttf/Vazirmatn-Regular.ttf',
    FA_BOLD: 'https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/fonts/ttf/Vazirmatn-Bold.ttf'
};

export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
    radius: 8,
    
    // Overview
    overviewDistance: 16,
    overviewHeight: 1.5,
    overviewLookAtY: 0,
    overviewFov: 45,
    overviewAngle: 0,

    // Focus
    focusDistance: 5.5,
    focusHeight: 0,
    focusLookAtY: -0.9,
    focusFov: 45,
    focusAngle: 0,

    // Animation
    transitionDuration: 1.2,
    transitionTension: 0.5
};

export const SLIDE_TYPE_OPTS: { type: SlideType; labelKey: string; icon: any }[] = [
    { type: 'hero', labelKey: 'typeHero', icon: Megaphone },
    { type: 'article', labelKey: 'typeArticle', icon: FileText },
    { type: 'content-image', labelKey: 'typeImageText', icon: ImageIcon },
    { type: 'list', labelKey: 'typeList', icon: List },
    { type: 'process', labelKey: 'typeProcess', icon: ArrowRightCircle },
    { type: 'timeline', labelKey: 'typeTimeline', icon: CalendarClock },
    { type: 'comparison', labelKey: 'typeComparison', icon: SplitSquareHorizontal },
    { type: 'stats', labelKey: 'typeStats', icon: BarChart3 },
    { type: 'big-number', labelKey: 'typeBigStat', icon: Hash },
    { type: 'grid', labelKey: 'typeGrid', icon: LayoutGrid },
    { type: 'quote', labelKey: 'typeQuote', icon: Quote },
    { type: 'team', labelKey: 'typeTeam', icon: Users },
    { type: 'gallery', labelKey: 'typeGallery', icon: Images },
    { type: 'cta', labelKey: 'typeCTA', icon: MousePointerClick },
];

export const SLIDES: SlideData[] = [
  {
    id: 's1',
    sectionId: 'sec1',
    type: 'hero',
    title: 'Introduction',
    content: 'Radikal Vision',
    subtitle: 'Redefining presentations with the power of the **spatial web**.',
    style: {
        fontFamily: 'serif',
        backgroundType: 'gradient',
        gradientColors: ['#0f172a', '#312e81'],
        textColor: '#e0e7ff',
        accentColor: '#6366f1',
        animation: 'fade-in'
    }
  },
  {
    id: 's2',
    sectionId: 'sec1',
    type: 'content-image',
    title: 'Immersive Experiences',
    content: 'Web technologies now allow for **cinema-grade 3D experiences** directly in the browser, accessible on any device without downloads.\n\n- No installation\n- High performance\n- Instant sharing',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    enableImage: true,
    style: {
        imageFit: 'cover'
    }
  },
  {
    id: 's3',
    sectionId: 'sec2',
    type: 'list',
    title: 'Why It Matters',
    bullets: [
        'Engage audiences instantly',
        'Break free from static slides',
        'Data-driven 3D visualizations',
        'Works on all modern devices'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    enableImage: true
  },
  {
    id: 's4',
    sectionId: 'sec2',
    type: 'timeline',
    title: 'Evolution',
    subtitle: 'The journey of presentation tech',
    bullets: [
        '1987: PowerPoint Launched',
        '2006: Google Slides',
        '2011: Prezi Zooming UI',
        '2024: Spatial Web 3D'
    ],
    style: {
        accentColor: '#8b5cf6'
    }
  }
];

export const SECTIONS: Section[] = [
    { id: 'sec1', title: 'Introduction' },
    { id: 'sec2', title: 'Technology' },
    { id: 'sec3', title: 'Impact' }
];

export const DICTIONARY = {
  en: {
    // General
    contents: 'Contents',
    navigateBy: 'Navigate by section',
    slide: 'Slide',
    remaining: 'remaining',
    quickStart: 'Quick Start',
    dragExplore: 'Drag to rotate • Click center to present',
    projectTitle: 'Radikal Presenter',
    exit: 'Exit Presentation',
    theEnd: 'The End',
    pressEsc: 'Press ESC to exit',
    version: 'Radikal v1.0',
    doubleClick: 'Double-click to Present',
    scrollToOverview: 'Scroll to Overview',
    creatorRole: 'Creator & Developer',
    
    // Actions
    undo: 'Undo',
    redo: 'Redo',
    duplicate: 'Duplicate',
    delete: 'Delete',
    reset: 'Factory Reset',
    resetConfirm: 'Are you sure you want to reset everything? This will restore the original template and default camera settings. All changes will be lost.',
    upload: 'Upload',
    twitter: 'Twitter / X',
    github: 'GitHub',
    telegram: 'Telegram',
    
    // Builder - Structure
    outline: 'Outline',
    slides: 'Slides',
    addSlide: 'Add Slide',
    sections: 'Sections',
    addSection: 'Add Section',
    emptySection: 'Empty section',
    untitled: 'Untitled',
    newSlide: 'New Slide',
    newSlideDesc: 'Click to edit description',

    // Builder - Panels
    properties: 'Properties',
    generalInfo: 'General Info',
    mainContent: 'Main Content',
    design: 'Design',
    animation: 'Animation',
    engineConfig: '3D Engine Config',
    items: 'Items',
    selectSlidePrompt: 'Select a slide to edit properties',
    done: 'Done',
    
    // Editor Fields
    section: 'Section',
    slideType: 'Slide Type',
    title: 'Title',
    subtitle: 'Subtitle',
    content: 'Content',
    bullets: 'List Items',
    image: 'Image',
    uploadImage: 'Upload Image',
    url: 'URL',
    clickToUpload: 'Click to Upload',
    currentImage: 'Current Image',
    source: 'Source',
    advancedSettings: 'Advanced Settings',
    
    // Error Handling
    invalidImageType: 'Invalid file type. Please upload an image.',
    uploadError: 'Failed to read file. Please try again.',
    imageLoadError: 'Failed to load image',
    
    // Specialized Editor Labels
    galleryImages: 'Gallery Images',
    teamMembers: 'Team Members',
    comparisonData: 'Comparison Data',
    timelineEvents: 'Timeline Events',
    statistics: 'Statistics',
    processSteps: 'Process Steps',
    actionButtons: 'Action Buttons',
    listItems: 'List Items',
    keyTakeaways: 'Key Takeaways',
    bigStatValue: 'Big Stat Value',
    authorName: 'Author Name',
    authorRole: 'Author Role / Title',
    quoteBody: 'Quote Body',
    headline: 'Headline / Statement',
    description: 'Description',
    articleBody: 'Article Body',
    enableImage: 'Enable Image',
    
    // Markdown Toolbar
    bold: 'Bold',
    italic: 'Italic',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    quote: 'Quote',
    code: 'Code',
    
    // Item Fields
    addItem: 'Add Item',
    item: 'Item',
    addDataPoint: 'Add Data Point',
    optionA: 'Option A (Left)',
    optionB: 'Option B (Right)',
    member: 'Member',
    name: 'Name',
    role: 'Role',
    addMember: 'Add Team Member',
    buttonLabel: 'Button Label',
    stepTitle: 'Step Title',
    value: 'Value',
    label: 'Label',
    yearDate: 'Year/Date',
    eventDesc: 'Event Description',
    
    // Design & Style
    styling: 'Styling',
    font: 'Typography',
    colors: 'Colors',
    background: 'Background',
    layout: 'Layout',
    bgType: 'Type',
    solid: 'Solid',
    gradient: 'Gradient',
    pattern: 'Pattern',
    default: 'Default',
    direction: 'Direction',
    alignment: 'Text Alignment',
    width: 'Content Width',
    opacity: 'Opacity',
    scale: 'Scale',
    fit: 'Fit',
    cover: 'Cover',
    contain: 'Contain',
    text: 'Text',
    accent: 'Accent',
    baseColor: 'Base Color',
    gradientColors: 'Colors (Start/End)',
    angle: 'Angle',
    style: 'Style',
    overlay: 'Overlay',
    frameLayout: 'Frame & Layout',
    border: 'Border',
    cornerRadius: 'Corner Radius',
    duration: 'Duration',
    delay: 'Delay',
    distance: 'Distance',
    height: 'Height',
    
    // 3D Config
    carouselGeometry: 'Carousel Geometry',
    orbitRadius: 'Orbit Radius',
    overview: 'Overview',
    focusState: 'Focus State',
    tilt: 'Tilt',
    fov: 'FOV',
    orbitAngle: 'Orbit Angle',
    focusDistance: 'Focus Distance',
    focusHeight: 'Focus Height',
    focusOffsetY: 'Focus Offset Y',
    focusFOV: 'Focus FOV',
    focusAngle: 'Focus Angle',
    transition: 'Transition',
    
    // Preview Toolbar
    preview: 'Preview',
    view2d: '2D',
    view3d: '3D',
    replay: 'Replay',
    freeCam: 'Free',
    realCam: 'Real',
    present: 'Present',
    
    // Slide Types
    typeHero: 'Hero',
    typeArticle: 'Article',
    typeImageText: 'Image & Text',
    typeList: 'List',
    typeProcess: 'Process',
    typeTimeline: 'Timeline',
    typeComparison: 'Comparison',
    typeStats: 'Stats',
    typeBigStat: 'Big Stat',
    typeGrid: 'Grid',
    typeQuote: 'Quote',
    typeTeam: 'Team',
    typeGallery: 'Gallery',
    typeCTA: 'Call to Action',

    // User Guide
    userGuide: 'User Guide',
    guideIntro: 'Learn how to create stunning presentations.',
    guideTabBasics: 'Getting Started',
    guideTabLibrary: 'Slide Library',
    guideTabBuilder: 'Builder Workflow',
    guideTabDesign: 'Design System',
    guideTab3D: '3D Engine',
    guideTabAdvanced: 'Advanced',
    
    // Guide Content
    welcomeTitle: 'Welcome to Radikal',
    welcomeText: 'Radikal Presenter transforms traditional slide decks into immersive spatial experiences. Navigate a 3D environment to deliver presentations that captive your audience on any device.',
    dashMode: 'Dashboard Mode',
    dashModeText: 'The starting point (Overview). You see the entire carousel of slides in 3D space. Scroll to zoom, drag to rotate, double-click to present.',
    presMode: 'Presentation Mode',
    presModeText: 'The focused view. Distractions are removed, and the slide content takes center stage. Use Arrow Keys to navigate.',
    shortcuts: 'Keyboard Shortcuts',
    libraryIntro: 'Choose from professional layouts. Each type is optimized for both 2D readability and 3D visualization.',
    builderIntro1: '1. Outline & Structure (Left)',
    builderDesc1: 'Manage the presentation skeleton. Group slides into sections, reorder, duplicate, or delete.',
    builderIntro2: '2. Content Editing (Right)',
    builderDesc2: 'The Content Panel is where you type. Supports Markdown for instant formatting.',
    builderIntro3: '3. Items Editor',
    builderDesc3: 'For complex slides like Timeline or Team, use the specialized Items Panel to manage structured data points.',
    designBackgrounds: 'Backgrounds',
    designBgDesc: 'Choose a solid color, a 2-color gradient, or apply procedural patterns like dots, grid, or noise.',
    designStyling: 'Styling',
    designStyleDesc: 'Add borders, rounded corners, or overlays to improve readability on busy backgrounds.',
    camStates: 'Camera States',
    camStatesDesc: 'The engine interpolates between Overview (distant) and Focus (close-up) states.',
    rtlSupport: 'RTL Support',
    rtlDesc: 'Fully supports bidirectional layout. Switching to Farsi mirrors the UI and changes typography.',
    localSave: 'Auto-Save',
    localSaveDesc: 'Your work is saved automatically to your browser storage.',
    factoryReset: 'Factory Reset',
    factoryResetDesc: 'Restore default template. This cannot be undone.'
  },
  fa: {
    // General
    contents: 'فهرست مطالب',
    navigateBy: 'پیمایش بر اساس بخش',
    slide: 'اسلاید',
    remaining: 'باقی‌مانده',
    quickStart: 'شروع سریع',
    dragExplore: 'بکشید تا بچرخد • برای ارائه کلیک کنید',
    projectTitle: 'رادیکال پرزنتر',
    exit: 'خروج از ارائه',
    theEnd: 'پایان',
    pressEsc: 'برای خروج ESC را بزنید',
    version: 'نسخه ۱.۰',
    doubleClick: 'برای ارائه دابل کلیک کنید',
    scrollToOverview: 'اسکرول برای بازگشت به نمای کلی',
    creatorRole: 'طراح و توسعه‌دهنده',

    // Actions
    undo: 'بازگشت',
    redo: 'انجام مجدد',
    duplicate: 'کپی',
    delete: 'حذف',
    reset: 'بازنشانی',
    resetConfirm: 'آیا مطمئن هستید؟ این کار تمام تغییرات را پاک کرده و به حالت اولیه باز می‌گرداند.',
    upload: 'آپلود',
    twitter: 'توییتر / اکس',
    github: 'گیتهاب',
    telegram: 'تلگرام',

    // Builder - Structure
    outline: 'ساختار',
    slides: 'اسلایدها',
    addSlide: 'افزودن اسلاید',
    sections: 'بخش‌ها',
    addSection: 'افزودن بخش',
    emptySection: 'بخش خالی',
    untitled: 'بدون عنوان',
    newSlide: 'اسلاید جدید',
    newSlideDesc: 'برای ویرایش توضیحات کلیک کنید',

    // Builder - Panels
    properties: 'تنظیمات',
    generalInfo: 'اطلاعات کلی',
    mainContent: 'محتوای اصلی',
    design: 'طراحی',
    animation: 'انیمیشن',
    engineConfig: 'پیکربندی موتور سه بعدی',
    items: 'آیتم‌ها',
    selectSlidePrompt: 'برای ویرایش، یک اسلاید انتخاب کنید',
    done: 'اتمام',

    // Editor Fields
    section: 'بخش',
    slideType: 'نوع اسلاید',
    title: 'عنوان',
    subtitle: 'زیرعنوان',
    content: 'محتوا',
    bullets: 'موارد لیست',
    image: 'تصویر',
    uploadImage: 'آپلود تصویر',
    url: 'آدرس اینترنتی',
    clickToUpload: 'برای آپلود کلیک کنید',
    currentImage: 'تصویر فعلی',
    source: 'منبع',
    advancedSettings: 'تنظیمات پیشرفته',

    // Error Handling
    invalidImageType: 'فرمت فایل نامعتبر است. لطفاً یک تصویر آپلود کنید.',
    uploadError: 'خطا در خواندن فایل. لطفاً دوباره تلاش کنید.',
    imageLoadError: 'خطا در بارگذاری تصویر',

    // Specialized Editor Labels
    galleryImages: 'تصاویر گالری',
    teamMembers: 'اعضای تیم',
    comparisonData: 'داده‌های مقایسه',
    timelineEvents: 'رویدادهای زمانی',
    statistics: 'آمار',
    processSteps: 'مراحل فرآیند',
    actionButtons: 'دکمه‌های اقدام',
    listItems: 'موارد لیست',
    keyTakeaways: 'نکات کلیدی',
    bigStatValue: 'مقدار عددی بزرگ',
    authorName: 'نام نویسنده',
    authorRole: 'عنوان / نقش نویسنده',
    quoteBody: 'متن نقل قول',
    headline: 'تیتر / بیانیه',
    description: 'توضیحات',
    articleBody: 'متن مقاله',
    enableImage: 'فعال‌سازی تصویر',
    
    // Markdown Toolbar
    bold: 'ضخیم',
    italic: 'کج',
    heading1: 'تیتر ۱',
    heading2: 'تیتر ۲',
    quote: 'نقل قول',
    code: 'کد',

    // Item Fields
    addItem: 'افزودن مورد',
    item: 'مورد',
    addDataPoint: 'افزودن داده',
    optionA: 'گزینه الف (چپ)',
    optionB: 'گزینه ب (راست)',
    member: 'عضو',
    name: 'نام',
    role: 'نقش',
    addMember: 'افزودن عضو تیم',
    buttonLabel: 'برچسب دکمه',
    stepTitle: 'عنوان مرحله',
    value: 'مقدار',
    label: 'برچسب',
    yearDate: 'سال/تاریخ',
    eventDesc: 'شرح رویداد',

    // Design & Style
    styling: 'استایل‌دهی',
    font: 'تایپوگرافی',
    colors: 'رنگ‌ها',
    background: 'پس‌زمینه',
    layout: 'چیدمان',
    bgType: 'نوع',
    solid: 'تک‌رنگ',
    gradient: 'گرادینت',
    pattern: 'الگو',
    default: 'پیش‌فرض',
    direction: 'جهت',
    alignment: 'تراز متن',
    width: 'عرض محتوا',
    opacity: 'شفافیت',
    scale: 'مقیاس',
    fit: 'تطبیق',
    cover: 'پوشش',
    contain: 'گنجاندن',
    text: 'متن',
    accent: 'تاکید',
    baseColor: 'رنگ پایه',
    gradientColors: 'رنگ‌ها (شروع/پایان)',
    angle: 'زاویه',
    style: 'استایل',
    overlay: 'لایه پوششی',
    frameLayout: 'قاب و چیدمان',
    border: 'حاشیه',
    cornerRadius: 'گردی گوشه',
    duration: 'مدت زمان',
    delay: 'تاخیر',
    distance: 'فاصله',
    height: 'ارتفاع',

    // 3D Config
    carouselGeometry: 'هندسه چرخ‌وفلک',
    orbitRadius: 'شعاع چرخش',
    overview: 'نمای کلی',
    focusState: 'حالت تمرکز',
    tilt: 'شیب',
    fov: 'زاویه دید (FOV)',
    orbitAngle: 'زاویه چرخش',
    focusDistance: 'فاصله تمرکز',
    focusHeight: 'ارتفاع تمرکز',
    focusOffsetY: 'انحراف عمودی تمرکز',
    focusFOV: 'زاویه دید تمرکز',
    focusAngle: 'زاویه تمرکز',
    transition: 'انتقال',

    // Preview Toolbar
    preview: 'پیش‌نمایش',
    view2d: 'دوبعدی',
    view3d: 'سه‌بعدی',
    replay: 'تکرار',
    freeCam: 'آزاد',
    realCam: 'واقعی',
    present: 'ارائه',

    // Slide Types
    typeHero: 'قهرمان',
    typeArticle: 'مقاله',
    typeImageText: 'تصویر و متن',
    typeList: 'لیست',
    typeProcess: 'فرآیند',
    typeTimeline: 'خط زمان',
    typeComparison: 'مقایسه',
    typeStats: 'آمار',
    typeBigStat: 'عدد بزرگ',
    typeGrid: 'شبکه',
    typeQuote: 'نقل قول',
    typeTeam: 'تیم',
    typeGallery: 'گالری',
    typeCTA: 'فراخوان',

    // User Guide
    userGuide: 'راهنمای کاربر',
    guideIntro: 'یاد بگیرید چگونه ارائه‌های زیبا بسازید.',
    guideTabBasics: 'شروع کار',
    guideTabLibrary: 'کتابخانه اسلاید',
    guideTabBuilder: 'جریان کار ساخت',
    guideTabDesign: 'سیستم طراحی',
    guideTab3D: 'موتور سه‌بعدی',
    guideTabAdvanced: 'پیشرفته',

    // Guide Content
    welcomeTitle: 'به رادیکال خوش آمدید',
    welcomeText: 'رادیکال پرزنتر اسلایدهای سنتی را به تجربه‌های فضایی و فراگیر تبدیل می‌کند. در یک محیط سه‌بعدی حرکت کنید تا ارائه‌ای جذاب در هر دستگاهی داشته باشید.',
    dashMode: 'حالت داشبورد',
    dashModeText: 'نقطه شروع (نمای کلی). تمام چرخ‌وفلک اسلایدها را در فضای سه‌بعدی می‌بینید. برای زوم اسکرول کنید، برای چرخش بکشید و برای ارائه دابل کلیک کنید.',
    presMode: 'حالت ارائه',
    presModeText: 'نمای متمرکز. عوامل حواس‌پرتی حذف می‌شوند و محتوای اسلاید در مرکز توجه قرار می‌گیرد. از کلیدهای جهت‌نما برای پیمایش استفاده کنید.',
    shortcuts: 'کلیدهای میانبر',
    libraryIntro: 'از بین طرح‌های حرفه‌ای انتخاب کنید. هر نوع برای خوانایی دوبعدی و تجسم سه‌بعدی بهینه شده است.',
    builderIntro1: '۱. ساختار و کلیات (چپ)',
    builderDesc1: 'مدیریت استخوان‌بندی ارائه. گروه‌بندی اسلایدها در بخش‌ها، تغییر ترتیب، کپی یا حذف.',
    builderIntro2: '۲. ویرایش محتوا (راست)',
    builderDesc2: 'پنل محتوا جایی است که تایپ می‌کنید. از مارک‌داون برای فرمت‌دهی فوری پشتیبانی می‌کند.',
    builderIntro3: '۳. ویرایشگر آیتم‌ها',
    builderDesc3: 'برای اسلایدهای پیچیده مانند خط زمان یا تیم، از پنل تخصصی آیتم‌ها برای مدیریت داده‌های ساختاریافته استفاده کنید.',
    designBackgrounds: 'پس‌زمینه‌ها',
    designBgDesc: 'یک رنگ ثابت، گرادینت دو رنگ انتخاب کنید یا الگوهای رویه‌ای مانند نقاط، شبکه یا نویز را اعمال کنید.',
    designStyling: 'استایل‌دهی',
    designStyleDesc: 'اضافه کردن حاشیه، گوشه‌های گرد یا لایه‌های پوششی برای بهبود خوانایی در پس‌زمینه‌های شلوغ.',
    camStates: 'حالت‌های دوربین',
    camStatesDesc: 'موتور بین حالت‌های نمای کلی (دور) و تمرکز (نزدیک) تغییر وضعیت می‌دهد.',
    rtlSupport: 'پشتیبانی راست‌چین',
    rtlDesc: 'پشتیبانی کامل از چیدمان دوطرفه. تغییر به فارسی رابط کاربری را آینه‌ای کرده و فونت‌ها را تغییر می‌دهد.',
    localSave: 'ذخیره خودکار',
    localSaveDesc: 'کار شما به طور خودکار در حافظه مرورگر ذخیره می‌شود.',
    factoryReset: 'بازنشانی کارخانه',
    factoryResetDesc: 'بازگرداندن قالب پیش‌فرض. این عمل قابل بازگشت نیست.'
  }
};