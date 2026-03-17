import '@testing-library/jest-dom';

// Global mocks
global.Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock MatchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock lucide-react
jest.mock('lucide-react', () => {
  const icons = {
    Home: (props) => <div data-testid="icon-home" {...props} />,
    CreditCard: (props) => <div data-testid="icon-creditcard" {...props} />,
    Monitor: (props) => <div data-testid="icon-monitor" {...props} />,
    Megaphone: (props) => <div data-testid="icon-megaphone" {...props} />,
    CupSoda: (props) => <div data-testid="icon-cupsoda" {...props} />,
    Trophy: (props) => <div data-testid="icon-trophy" {...props} />,
    Banknote: (props) => <div data-testid="icon-banknote" {...props} />,
    LogOut: (props) => <div data-testid="icon-logout" {...props} />,
    LogIn: (props) => <div data-testid="icon-login" {...props} />,
    Menu: (props) => <div data-testid="icon-menu" {...props} />,
    ChevronLeft: (props) => <div data-testid="icon-chevronleft" {...props} />,
    ChevronRight: (props) => <div data-testid="icon-chevronright" {...props} />,
    Calendar: (props) => <div data-testid="icon-calendar" {...props} />,
    CheckCircle2: (props) => <div data-testid="icon-checkcircle2" {...props} />,
    AlertCircle: (props) => <div data-testid="icon-alertcircle" {...props} />,
    Clock: (props) => <div data-testid="icon-clock" {...props} />,
    Plus: (props) => <div data-testid="icon-plus" {...props} />,
    Edit2: (props) => <div data-testid="icon-edit2" {...props} />,
    Trash2: (props) => <div data-testid="icon-trash2" {...props} />,
    X: (props) => <div data-testid="icon-x" {...props} />,
    TrendingDown: (props) => <div data-testid="icon-trendingdown" {...props} />,
    User: (props) => <div data-testid="icon-user" {...props} />,
    Zap: (props) => <div data-testid="icon-zap" {...props} />,
    Cpu: (props) => <div data-testid="icon-cpu" {...props} />,
    Wifi: (props) => <div data-testid="icon-wifi" {...props} />,
    Gamepad2: (props) => <div data-testid="icon-gamepad2" {...props} />,
    Coffee: (props) => <div data-testid="icon-coffee" {...props} />,
    Users: (props) => <div data-testid="icon-users" {...props} />,
    ShieldCheck: (props) => <div data-testid="icon-shieldcheck" {...props} />,
    Rocket: (props) => <div data-testid="icon-rocket" {...props} />,
    Package: (props) => <div data-testid="icon-package" {...props} />,
    Image: (props) => <div data-testid="icon-image" {...props} />,
    Medal: (props) => <div data-testid="icon-medal" {...props} />,
    Mail: (props) => <div data-testid="icon-mail" {...props} />,
    Settings: (props) => <div data-testid="icon-settings" {...props} />,
    Lock: (props) => <div data-testid="icon-lock" {...props} />,
    Sun: (props) => <div data-testid="icon-sun" {...props} />,
    Moon: (props) => <div data-testid="icon-moon" {...props} />,
  };
  return icons;
});

// Mock Swiper
jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSlideChange }) => {
    return <div data-testid="swiper-mock" onClick={() => onSlideChange && onSlideChange({ activeIndex: 1 })}>{children}</div>;
  },
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide-mock">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Navigation: (props) => null,
  Pagination: (props) => null,
  Autoplay: (props) => null,
  EffectCoverflow: (props) => null,
}));

jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/css/effect-coverflow', () => ({}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const filterMotionProps = (props) => {
    const {
      whileTap,
      whileHover,
      initial,
      animate,
      exit,
      variants,
      transition,
      layout,
      layoutId,
      ...rest
    } = props;
    return rest;
  };

  return {
    motion: {
      div: ({ children, ...props }) => <div {...filterMotionProps(props)}>{children}</div>,
      span: ({ children, ...props }) => <span {...filterMotionProps(props)}>{children}</span>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});
