import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Download, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Clock, 
  TrendingUp,
  X,
  Gift
} from 'lucide-react';
import { SiteContent } from '../types';
import { useVisitorTracking } from '../hooks/useVisitorTracking';

interface LandingPageProps {
  content: SiteContent;
  onEmailSubmit: (email: string, source: string, quizAnswers?: number[]) => void;
}

export default function LandingPage({ content, onEmailSubmit }: LandingPageProps) {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState('');
  
  // Track visitors
  useVisitorTracking();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    
    if (quizStep < content.quiz.questions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(-1);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
  };

  const handleEmailSubmit = (source: string, quizData?: number[]) => {
    if (email.trim()) {
      onEmailSubmit(email.trim(), source, quizData);
      setEmail('');
      if (source === 'exit-popup') {
        setShowExitPopup(false);
      }
    }
  };

  const promptForEmail = (source: string) => {
    const emailInput = prompt('Enter your email address:');
    if (emailInput) {
      onEmailSubmit(emailInput, source);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: content.colors.background }}>
      {/* Sticky Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8" style={{ color: content.colors.primary }} />
              <span className="text-xl font-bold" style={{ color: content.colors.text }}>
                {content.navbar.logo}
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {content.navbar.menuItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: content.colors.textSecondary }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: content.colors.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: content.colors.text }}>
                <span style={{ color: content.colors.primary }}>{content.hero.title}</span>
              </h1>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: content.colors.textSecondary }}>
                {content.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => promptForEmail('hero')}
                  className="text-white text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 hover:opacity-90"
                  style={{ backgroundColor: content.colors.secondary }}
                >
                  <Download className="h-5 w-5" />
                  <span>{content.hero.ctaText}</span>
                </button>
                <button 
                  onClick={() => document.getElementById('keto-quiz')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 text-lg px-8 py-4 rounded-lg transition-all flex items-center justify-center space-x-2 hover:text-white"
                  style={{ 
                    borderColor: content.colors.primary, 
                    color: content.colors.primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = content.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{content.hero.ctaSecondary}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center mt-6 space-x-6">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span style={{ color: content.colors.textSecondary }} className="ml-2">4.9/5 (2,847 reviews)</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={content.hero.image} 
                alt="Keto foods" 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 text-white p-4 rounded-lg shadow-lg" style={{ backgroundColor: content.colors.secondary }}>
                <div className="text-2xl font-bold">{content.stats.days}</div>
                <div className="text-sm">Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${content.colors.primary}20` }}>
                <Users className="h-8 w-8" style={{ color: content.colors.primary }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: content.colors.text }}>{content.stats.users}</div>
              <div style={{ color: content.colors.textSecondary }}>Successful Users</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${content.colors.secondary}20` }}>
                <Clock className="h-8 w-8" style={{ color: content.colors.secondary }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: content.colors.text }}>{content.stats.days}</div>
              <div style={{ color: content.colors.textSecondary }}>Average Result Time</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${content.colors.success}20` }}>
                <TrendingUp className="h-8 w-8" style={{ color: content.colors.success }} />
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: content.colors.text }}>{content.stats.success}</div>
              <div style={{ color: content.colors.textSecondary }}>Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="keto-quiz" className="py-20" style={{ backgroundColor: content.colors.surface }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: content.colors.text }}>
              {content.quiz.title}
            </h2>
            <p className="text-xl" style={{ color: content.colors.textSecondary }}>
              {content.quiz.subtitle}
            </p>
          </div>

          {quizStep >= 0 && quizStep < content.quiz.questions.length ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm" style={{ color: content.colors.textSecondary }}>
                    Question {quizStep + 1} / {content.quiz.questions.length}
                  </span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        backgroundColor: content.colors.primary,
                        width: `${((quizStep + 1) / content.quiz.questions.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-6" style={{ color: content.colors.text }}>
                  {content.quiz.questions[quizStep].question}
                </h3>
              </div>
              
              <div className="space-y-3">
                {content.quiz.questions[quizStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg transition-all hover:opacity-80"
                    style={{ 
                      borderColor: 'rgb(229, 231, 235)',
                      color: content.colors.text
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = content.colors.primary;
                      e.currentTarget.style.backgroundColor = `${content.colors.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : quizStep === -1 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: content.colors.success }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: content.colors.text }}>Quiz Completed!</h3>
                <p className="mb-6" style={{ color: content.colors.textSecondary }}>
                  Your personalized keto plan is ready! Enter your email to see the results.
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      focusRingColor: content.colors.primary,
                      color: content.colors.text
                    }}
                  />
                  <button 
                    onClick={() => handleEmailSubmit('quiz', quizAnswers)}
                    className="text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap hover:opacity-90"
                    style={{ backgroundColor: content.colors.success }}
                  >
                    Send Results
                  </button>
                </div>
                <button 
                  onClick={resetQuiz}
                  className="hover:opacity-70 mt-4 text-sm"
                  style={{ color: content.colors.textSecondary }}
                >
                  Retake quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4" style={{ color: content.colors.text }}>
                Take the first step to keto success!
              </h3>
              <button 
                onClick={() => setQuizStep(0)}
                className="text-white text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105"
                style={{ backgroundColor: content.colors.secondary }}
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: content.colors.text }}>
              Success Stories
            </h2>
            <p className="text-xl" style={{ color: content.colors.textSecondary }}>
              Real people, real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((story, index) => (
              <div key={index} className="rounded-2xl p-6" style={{ backgroundColor: content.colors.surface }}>
                <div className="flex items-center mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold" style={{ color: content.colors.text }}>{story.name}</div>
                    <div className="font-medium" style={{ color: content.colors.primary }}>{story.result}</div>
                  </div>
                </div>
                <p className="mb-4" style={{ color: content.colors.textSecondary }}>"{story.story}"</p>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => promptForEmail('hero')}
              className="text-white text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105"
              style={{ backgroundColor: content.colors.success }}
            >
              Your Success Story is Next!
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="guide" className="py-20" style={{ backgroundColor: content.colors.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: content.colors.text }}>
              What's Included?
            </h2>
            <p className="text-xl" style={{ color: content.colors.textSecondary }}>
              Everything you need for keto success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${content.colors.primary}20`, color: content.colors.primary }}>
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: content.colors.text }}>{feature.title}</h3>
                <p style={{ color: content.colors.textSecondary }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: `linear-gradient(to right, ${content.colors.primary}, ${content.colors.primary}dd)` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {content.cta.title}
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            {content.cta.subtitle}
          </p>
          
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
            <div className="mb-6" style={{ color: content.colors.text }}>
              <div className="text-4xl font-bold mb-2">$0</div>
              <div className="text-sm" style={{ color: content.colors.textSecondary }}>Completely Free</div>
            </div>
            
            <div className="space-y-3 text-left mb-6">
              {content.cta.features.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" style={{ color: content.colors.success }} />
                  <span style={{ color: content.colors.textSecondary }}>{item}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => promptForEmail('cta')}
              className="w-full text-white text-lg px-6 py-4 rounded-lg transition-all transform hover:scale-105 mb-4"
              style={{ backgroundColor: content.colors.secondary }}
            >
              {content.cta.buttonText}
            </button>
            <p className="text-xs" style={{ color: content.colors.textSecondary }}>
              {content.cta.guaranteeText} • {content.cta.noCardText}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Email Bar */}
      <div className={`fixed bottom-0 left-0 right-0 text-white p-4 transform transition-transform z-50 ${
        showStickyBar ? 'translate-y-0' : 'translate-y-full'
      }`} style={{ backgroundColor: content.colors.secondary }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gift className="h-6 w-6" />
            <span className="font-medium">10 Secrets of Keto Success - Free PDF</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email..."
              className="px-3 py-2 rounded text-sm w-48 hidden sm:block"
              style={{ color: content.colors.text }}
            />
            <button 
              onClick={() => handleEmailSubmit('sticky-bar')}
              className="bg-white px-4 py-2 rounded font-medium hover:opacity-90 transition-colors"
              style={{ color: content.colors.secondary }}
            >
              Get Now
            </button>
          </div>
        </div>
      </div>

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 hover:opacity-70"
              style={{ color: content.colors.textSecondary }}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${content.colors.secondary}20` }}>
                <Gift className="h-10 w-10" style={{ color: content.colors.secondary }} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4" style={{ color: content.colors.text }}>
                {content.popup.title}
              </h3>
              <p className="mb-6" style={{ color: content.colors.textSecondary }}>
                {content.popup.subtitle}
              </p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ color: content.colors.text }}
                />
                <button 
                  onClick={() => handleEmailSubmit('exit-popup')}
                  className="w-full text-white py-3 rounded-lg font-medium hover:opacity-90"
                  style={{ backgroundColor: content.colors.secondary }}
                >
                  {content.popup.buttonText}
                </button>
                <button 
                  onClick={() => setShowExitPopup(false)}
                  className="w-full text-sm hover:opacity-70"
                  style={{ color: content.colors.textSecondary }}
                >
                  {content.popup.dismissText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}