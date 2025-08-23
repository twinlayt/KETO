import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteContent } from '../types';

interface NotFoundProps {
  content: SiteContent;
}

export default function NotFound({ content }: NotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(to bottom right, ${content.colors.surface}, ${content.colors.primary}20)` }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold mb-4" style={{ color: content.colors.primary }}>404</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: content.colors.text }}>
            {content.notFound.title}
          </h1>
          <p className="text-lg mb-8" style={{ color: content.colors.textSecondary }}>
            {content.notFound.subtitle}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: content.colors.primary }}
          >
            <Home className="h-5 w-5" />
            <span>{content.notFound.buttonText}</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-1 hover:opacity-70 transition-colors"
              style={{ color: content.colors.textSecondary }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}