import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  seo: {
    title: "Keto Diet Landing Page - Transform Your Life in 30 Days",
    description: "Failed at Keto Diet? Get our 30-day guaranteed keto meal list and guides with proven results! 10,000+ people have already transformed their lives.",
    keywords: "keto diet, weight loss, meal planning, keto recipes, healthy eating, diet plan, nutrition guide",
    author: "KetoMaster",
    canonical: "https://keto-diet-landing-pa-dje0.bolt.host"
  },
  navbar: {
    logo: "KetoMaster",
    menuItems: [
      { label: "Keto Foods", href: "#keto-foods" },
      { label: "Shopping List", href: "#shopping-list" },
      { label: "Guide", href: "#guide" },
      { label: "Contact", href: "#contact" }
    ]
  },
  hero: {
    title: "Failed at Keto Diet?",
    subtitle: "30-day guaranteed keto meal list and guides with proven results! 10,000+ people have already transformed their lives.",
    ctaText: "Get My Free Keto List",
    ctaSecondary: "How Does It Work?",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  stats: {
    users: "10,000+",
    days: "30 Days",
    success: "95%"
  },
  quiz: {
    title: "Which Keto Foods Are Right for You?",
    subtitle: "Discover your personalized keto plan with a 3-minute test!",
    questions: [
      {
        question: "What's your biggest challenge with keto diet?",
        options: ["Meal planning", "Shopping lists", "Portion control", "Motivation"]
      },
      {
        question: "How many meals do you prefer per day?",
        options: ["2 meals", "3 meals", "4-5 small meals", "Intermittent fasting"]
      },
      {
        question: "How much time do you like to spend in the kitchen?",
        options: ["Very little (15 min max)", "Moderate (30 min)", "Enough (45 min)", "A lot (1 hour+)"]
      }
    ]
  },
  features: [
    {
      title: "200+ Keto Recipes",
      description: "Delicious and easy recipes from breakfast to dinner"
    },
    {
      title: "Weekly Menus",
      description: "Ready-made menus to live keto without thinking"
    },
    {
      title: "Shopping Lists",
      description: "Detailed lists that make your grocery shopping easier"
    },
    {
      title: "Private Support Group",
      description: "WhatsApp group where you can get 24/7 support"
    },
    {
      title: "Progress Tracking",
      description: "Special tools to track your goals"
    },
    {
      title: "Bonus Content",
      description: "Additional guides and special tips"
    }
  ],
  testimonials: [
    {
      name: "Sarah K.",
      result: "Lost 26 lbs",
      story: "I reached my goal in 3 months! Keto lists made shopping and meal planning so easy.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Mike T.",
      result: "Lost 18 lbs",
      story: "I didn't have time to exercise but got amazing results with just nutrition!",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Emma M.",
      result: "Lost 33 lbs",
      story: "None of the diets I tried for years worked. Keto changed my life!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ],
  cta: {
    title: "Start Today to Succeed in Keto Diet!",
    subtitle: "10,000+ people have already transformed their lives. Your turn!",
    features: [
      "200+ Keto recipes and menus",
      "Weekly shopping lists",
      "WhatsApp support group",
      "Progress tracking tools"
    ],
    buttonText: "Get It Free Now",
    guaranteeText: "30-day money back guarantee",
    noCardText: "No credit card required"
  },
  popup: {
    title: "Leaving already? 🥺",
    subtitle: "Don't miss out on keto success! Last chance: Get your Free Keto guide and transform your life in 30 days.",
    buttonText: "Use My Last Chance!",
    dismissText: "No thanks, let me leave"
  },
  colors: {
    primary: "#16a34a",
    secondary: "#f97316", 
    accent: "#3b82f6",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
    textSecondary: "#6b7280"
  },
  notFound: {
    title: "Oops! Page Not Found",
    subtitle: "The page you're looking for doesn't exist. Let's get you back to your keto journey!",
    buttonText: "Back to Home"
  }
};