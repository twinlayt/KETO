import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import { EmailSubscriber, SiteContent, SiteVisitor } from './types';
import { defaultContent } from './data/defaultContent';

// Admin credentials (in production, this should be handled securely)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [emails, setEmails] = useLocalStorage<EmailSubscriber[]>('keto-emails', []);
  const [content, setContent] = useLocalStorage<SiteContent>('keto-content', defaultContent);
  const [visitors, setVisitors] = useLocalStorage<SiteVisitor[]>('keto-visitors', []);

  // Update document title and meta tags when content changes
  useEffect(() => {
    document.title = content.seo.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', content.seo.description);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', content.seo.keywords);

    // Update meta author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.setAttribute('name', 'author');
      document.head.appendChild(metaAuthor);
    }
    metaAuthor.setAttribute('content', content.seo.author);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', content.seo.canonical);
  }, [content.seo]);

  const handleAdminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleEmailSubmit = (email: string, source: string, quizAnswers?: number[]) => {
    const newEmail: EmailSubscriber = {
      id: Date.now().toString(),
      email,
      source,
      timestamp: new Date().toISOString(),
      quizAnswers
    };
    
    setEmails(prev => [newEmail, ...prev]);
    
    // Show success message
    alert('Thank you for subscribing! Check your email for the keto guide.');
  };

  const handleContentUpdate = (newContent: SiteContent) => {
    setContent(newContent);
  };

  const handleDeleteEmail = (id: string) => {
    if (confirm('Bu email adresini silmek istediğinizden emin misiniz?')) {
      setEmails(prev => prev.filter(email => email.id !== id));
    }
  };

  // Track visitor when app loads
  useEffect(() => {
    const visitor: SiteVisitor = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct',
      page: window.location.pathname
    };

    setVisitors(prev => [visitor, ...prev.slice(0, 999)]);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              content={content} 
              onEmailSubmit={handleEmailSubmit} 
            />
          } 
        />
        <Route 
          path="/panel" 
          element={
            isAdminLoggedIn ? (
              <AdminPanel 
                onLogout={handleAdminLogout}
                emails={emails}
                content={content}
                onContentUpdate={handleContentUpdate}
                onDeleteEmail={handleDeleteEmail}
                visitors={visitors}
              />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="*" 
          element={<NotFound content={content} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;