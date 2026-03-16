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
    Home: () => <div data-testid="icon-home" />,
    CreditCard: () => <div data-testid="icon-creditcard" />,
    Monitor: () => <div data-testid="icon-monitor" />,
    Megaphone: () => <div data-testid="icon-megaphone" />,
    CupSoda: () => <div data-testid="icon-cupsoda" />,
    Trophy: () => <div data-testid="icon-trophy" />,
    Banknote: () => <div data-testid="icon-banknote" />,
    LogOut: () => <div data-testid="icon-logout" />,
    LogIn: () => <div data-testid="icon-login" />,
    Menu: () => <div data-testid="icon-menu" />,
    ChevronLeft: () => <div data-testid="icon-chevronleft" />,
    ChevronRight: () => <div data-testid="icon-chevronright" />,
    Calendar: () => <div data-testid="icon-calendar" />,
    CheckCircle2: () => <div data-testid="icon-checkcircle2" />,
    AlertCircle: () => <div data-testid="icon-alertcircle" />,
    Clock: () => <div data-testid="icon-clock" />,
    Plus: () => <div data-testid="icon-plus" />,
    Edit2: () => <div data-testid="icon-edit2" />,
    Trash2: () => <div data-testid="icon-trash2" />,
    X: () => <div data-testid="icon-x" />,
    TrendingDown: () => <div data-testid="icon-trendingdown" />,
    User: () => <div data-testid="icon-user" />,
    Zap: () => <div data-testid="icon-zap" />,
    Cpu: () => <div data-testid="icon-cpu" />,
    Wifi: () => <div data-testid="icon-wifi" />,
    Gamepad2: () => <div data-testid="icon-gamepad2" />,
    Coffee: () => <div data-testid="icon-coffee" />,
    Users: () => <div data-testid="icon-users" />,
    ShieldCheck: () => <div data-testid="icon-shieldcheck" />,
    Rocket: () => <div data-testid="icon-rocket" />,
  };
  return icons;
});

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
