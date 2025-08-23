export interface EmailSubscriber {
  id: string;
  email: string;
  source: string; // 'hero', 'quiz', 'exit-popup', 'sticky-bar'
  timestamp: string;
  quizAnswers?: number[];
}

export interface SiteVisitor {
  id: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
  page: string;
}

export interface PopupContent {
  title: string;
  subtitle: string;
  buttonText: string;
  dismissText: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface SiteContent {
  seo: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    canonical: string;
  };
  navbar: {
    logo: string;
    menuItems: Array<{
      label: string;
      href: string;
    }>;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaSecondary: string;
    image: string;
  };
  stats: {
    users: string;
    days: string;
    success: string;
  };
  quiz: {
    title: string;
    subtitle: string;
    questions: Array<{
      question: string;
      options: string[];
    }>;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    name: string;
    result: string;
    story: string;
    image: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
    features: string[];
    buttonText: string;
    guaranteeText: string;
    noCardText: string;
  };
  popup: PopupContent;
  colors: ColorScheme;
  notFound: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

export interface AdminUser {
  username: string;
  password: string;
}