import { useState, useEffect } from 'react';
import { SiteVisitor } from '../types';

export function useVisitorTracking() {
  const [visitors, setVisitors] = useState<SiteVisitor[]>(() => {
    try {
      const stored = localStorage.getItem('keto-visitors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Track current visit
    const visitor: SiteVisitor = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct',
      page: window.location.pathname
    };

    setVisitors(prev => {
      const updated = [visitor, ...prev.slice(0, 999)]; // Keep last 1000 visitors
      localStorage.setItem('keto-visitors', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return visitors;
}