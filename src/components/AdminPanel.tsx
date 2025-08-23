import React, { useState } from 'react';
import { 
  LogOut, 
  Mail, 
  Edit3, 
  Save, 
  Users, 
  BarChart3,
  Download,
  Trash2,
  Eye,
  Plus,
  Minus,
  Search,
  Globe,
  Navigation,
  FileText,
  Palette,
  Monitor,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { EmailSubscriber, SiteContent, SiteVisitor } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  emails: EmailSubscriber[];
  content: SiteContent;
  onContentUpdate: (content: SiteContent) => void;
  onDeleteEmail: (id: string) => void;
  visitors: SiteVisitor[];
}

export default function AdminPanel({ 
  onLogout, 
  emails, 
  content, 
  onContentUpdate,
  onDeleteEmail,
  visitors 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'emails' | 'visitors' | 'content' | 'seo' | 'navbar' | 'quiz' | 'features' | 'cta' | 'popup' | 'colors' | 'notfound'>('emails');
  const [editingContent, setEditingContent] = useState<SiteContent>(content || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleContentChange = (section: keyof SiteContent, field: string, value: any) => {
    const newContent = { ...editingContent };
    if (!newContent[section]) {
      setEditingContent(content || {});
    } else {
      (newContent[section] as any)[field] = value;
    }
    setEditingContent(newContent);
    setHasChanges(true);
  };

  const handleArrayChange = (section: keyof SiteContent, index: number, field: string, value: any) => {
    const newContent = { ...editingContent };
    if (Array.isArray(newContent[section])) {
      (newContent[section] as any)[index][field] = value;
    }
    setEditingContent(newContent);
    setHasChanges(true);
  };

  const addArrayItem = (section: keyof SiteContent, newItem: any) => {
    const newContent = { ...editingContent };
    if (Array.isArray(newContent[section])) {
      (newContent[section] as any).push(newItem);
    }
    setEditingContent(newContent);
    setHasChanges(true);
  };

  const removeArrayItem = (section: keyof SiteContent, index: number) => {
    const newContent = { ...editingContent };
    if (Array.isArray(newContent[section])) {
      (newContent[section] as any).splice(index, 1);
    }
    setEditingContent(newContent);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onContentUpdate(editingContent);
    setHasChanges(false);
  };

  const exportEmails = () => {
    const csvContent = [
      ['Email', 'Kaynak', 'Tarih', 'Quiz Cevapları'].join(','),
      ...emails.map(email => [
        email.email,
        email.source,
        new Date(email.timestamp).toLocaleDateString('tr-TR'),
        email.quizAnswers ? email.quizAnswers.join(';') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportVisitors = () => {
    const csvContent = [
      ['Tarih', 'Sayfa', 'Referrer', 'User Agent'].join(','),
      ...visitors.map(visitor => [
        new Date(visitor.timestamp).toLocaleDateString('tr-TR'),
        visitor.page,
        visitor.referrer,
        visitor.userAgent
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-visitors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImageUpload = (section: string, field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (section === 'hero') {
            handleContentChange('hero', field, result);
          } else if (section === 'testimonials') {
            // Handle testimonial image upload
            const index = parseInt(field);
            handleArrayChange('testimonials', index, 'image', result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'hero': 'Ana Banner',
      'quiz': 'Quiz',
      'exit-popup': 'Çıkış Pop-up',
      'sticky-bar': 'Yapışkan Çubuk',
      'cta': 'CTA Bölümü'
    };
    return labels[source] || source;
  };

  const filteredEmails = emails.filter(email => 
    email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSourceLabel(email.source).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVisitors = visitors.filter(visitor =>
    visitor.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'emails', label: 'Email Aboneleri', icon: Mail, count: emails.length },
    { id: 'visitors', label: 'Site Ziyaretçileri', icon: Monitor, count: visitors.length },
    { id: 'content', label: 'Ana İçerik', icon: Edit3 },
    { id: 'seo', label: 'SEO Ayarları', icon: Globe },
    { id: 'navbar', label: 'Navbar', icon: Navigation },
    { id: 'quiz', label: 'Quiz Yönetimi', icon: BarChart3 },
    { id: 'features', label: 'Özellikler', icon: Eye },
    { id: 'cta', label: 'CTA Bölümü', icon: FileText },
    { id: 'popup', label: 'Popup Yönetimi', icon: Eye },
    { id: 'colors', label: 'Renk Düzenleme', icon: Palette },
    { id: 'notfound', label: '404 Sayfası', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Keto Diet Admin Paneli</h1>
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <button
                  onClick={saveChanges}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Email Subscribers Tab */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Abone</p>
                    <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {emails.filter(email => {
                        const emailDate = new Date(email.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return emailDate > weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Quiz Tamamlayan</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {emails.filter(email => email.quizAnswers && email.quizAnswers.length > 0).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <button
                  onClick={exportEmails}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV İndir</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Email veya kaynak ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email List */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Email Aboneleri</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kaynak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmails.map((email) => (
                      <tr key={email.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {email.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getSourceLabel(email.source)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(email.timestamp).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {email.quizAnswers && email.quizAnswers.length > 0 ? (
                            <span className="text-green-600">✓ Tamamlandı</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => onDeleteEmail(email.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmails.length === 0 && (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'Arama kriterine uygun email bulunamadı' : 'Henüz email abonesi yok'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Site Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            {/* Visitor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Ziyaret</p>
                    <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bugün</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {visitors.filter(visitor => {
                        const visitDate = new Date(visitor.timestamp);
                        const today = new Date();
                        return visitDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bu Hafta</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {visitors.filter(visitor => {
                        const visitDate = new Date(visitor.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return visitDate > weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <button
                  onClick={exportVisitors}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV İndir</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sayfa veya referrer ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Visitors List */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Site Ziyaretçileri</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sayfa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarayıcı
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisitors.slice(0, 100).map((visitor) => (
                      <tr key={visitor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(visitor.timestamp).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {visitor.page}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {visitor.referrer === 'Direct' ? 'Direkt' : visitor.referrer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {visitor.userAgent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredVisitors.length === 0 && (
                  <div className="text-center py-12">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'Arama kriterine uygun ziyaret bulunamadı' : 'Henüz ziyaretçi yok'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ana Banner (Hero)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ana Başlık
                  </label>
                  <input
                    type="text"
                    value={editingContent.hero.title}
                    onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Başlık
                  </label>
                  <textarea
                    value={editingContent.hero.subtitle}
                    onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ana Buton Metni
                    </label>
                    <input
                      type="text"
                      value={editingContent.hero.ctaText}
                      onChange={(e) => handleContentChange('hero', 'ctaText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İkinci Buton Metni
                    </label>
                    <input
                      type="text"
                      value={editingContent.hero.ctaSecondary}
                      onChange={(e) => handleContentChange('hero', 'ctaSecondary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Resmi
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={editingContent.hero.image}
                      onChange={(e) => handleContentChange('hero', 'image', e.target.value)}
                      placeholder="https://images.pexels.com/..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleImageUpload('hero', 'image')}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Yükle</span>
                    </button>
                  </div>
                  {editingContent.hero.image && (
                    <div className="mt-3">
                      <img 
                        src={editingContent.hero.image} 
                        alt="Hero preview" 
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">İstatistikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanıcı Sayısı
                  </label>
                  <input
                    type="text"
                    value={editingContent.stats.users}
                    onChange={(e) => handleContentChange('stats', 'users', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gün Sayısı
                  </label>
                  <input
                    type="text"
                    value={editingContent.stats.days}
                    onChange={(e) => handleContentChange('stats', 'days', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başarı Oranı
                  </label>
                  <input
                    type="text"
                    value={editingContent.stats.success}
                    onChange={(e) => handleContentChange('stats', 'success', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Başarı Hikayeleri</h3>
                <button
                  onClick={() => addArrayItem('testimonials', {
                    name: 'Yeni Kişi',
                    result: 'Sonuç',
                    story: 'Hikaye...',
                    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
                  })}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yeni Hikaye Ekle</span>
                </button>
              </div>
              <div className="space-y-6">
                {editingContent.testimonials.map((testimonial, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Hikaye #{index + 1}</h4>
                      <button
                        onClick={() => removeArrayItem('testimonials', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İsim
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => handleArrayChange('testimonials', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sonuç
                        </label>
                        <input
                          type="text"
                          value={testimonial.result}
                          onChange={(e) => handleArrayChange('testimonials', index, 'result', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resim
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="url"
                          value={testimonial.image}
                          onChange={(e) => handleArrayChange('testimonials', index, 'image', e.target.value)}
                          placeholder="https://images.pexels.com/..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleImageUpload('testimonials', index.toString())}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Yükle</span>
                        </button>
                      </div>
                      {testimonial.image && (
                        <div className="mt-3">
                          <img 
                            src={testimonial.image} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hikaye
                      </label>
                      <textarea
                        value={testimonial.story}
                        onChange={(e) => handleArrayChange('testimonials', index, 'story', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Ayarları</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sayfa Başlığı (Title)
                </label>
                <input
                  type="text"
                  value={editingContent.seo?.title || ''}
                  onChange={(e) => handleContentChange('seo', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Keto Diet Landing Page - Transform Your Life"
                />
                <p className="text-xs text-gray-500 mt-1">Karakter sayısı: {(editingContent.seo?.title || '').length}/60</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama (Description)
                </label>
                <textarea
                  value={editingContent.seo?.description || ''}
                  onChange={(e) => handleContentChange('seo', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Keto diet rehberi ile 30 günde hayatınızı değiştirin..."
                />
                <p className="text-xs text-gray-500 mt-1">Karakter sayısı: {(editingContent.seo?.description || '').length}/160</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler (Keywords)
                </label>
                <input
                  type="text"
                  value={editingContent.seo?.keywords || ''}
                  onChange={(e) => handleContentChange('seo', 'keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="keto diet, weight loss, meal planning"
                />
                <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yazar (Author)
                  </label>
                  <input
                    type="text"
                    value={editingContent.seo?.author || ''}
                    onChange={(e) => handleContentChange('seo', 'author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={editingContent.seo?.canonical || ''}
                    onChange={(e) => handleContentChange('seo', 'canonical', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navbar Tab */}
        {activeTab === 'navbar' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Navbar Yönetimi</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Metni
                </label>
                <input
                  type="text"
                  value={editingContent.navbar.logo}
                  onChange={(e) => handleContentChange('navbar', 'logo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Menü Öğeleri
                  </label>
                  <button
                    onClick={() => {
                      const newMenuItems = [...editingContent.navbar.menuItems, { label: 'Yeni Menü', href: '#new' }];
                      handleContentChange('navbar', 'menuItems', newMenuItems);
                    }}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ekle</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editingContent.navbar.menuItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const newMenuItems = [...editingContent.navbar.menuItems];
                            newMenuItems[index].label = e.target.value;
                            handleContentChange('navbar', 'menuItems', newMenuItems);
                          }}
                          placeholder="Menü Adı"
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const newMenuItems = [...editingContent.navbar.menuItems];
                            newMenuItems[index].href = e.target.value;
                            handleContentChange('navbar', 'menuItems', newMenuItems);
                          }}
                          placeholder="Link (#section)"
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newMenuItems = editingContent.navbar.menuItems.filter((_, i) => i !== index);
                          handleContentChange('navbar', 'menuItems', newMenuItems);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Management Tab */}
        {activeTab === 'quiz' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Quiz Yönetimi</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.quiz.title}
                  onChange={(e) => handleContentChange('quiz', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Alt Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.quiz.subtitle}
                  onChange={(e) => handleContentChange('quiz', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Quiz Soruları
                  </label>
                  <button
                    onClick={() => {
                      const newQuestions = [...editingContent.quiz.questions, { 
                        question: 'Yeni soru?', 
                        options: ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4'] 
                      }];
                      handleContentChange('quiz', 'questions', newQuestions);
                    }}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Soru Ekle</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {editingContent.quiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Soru #{qIndex + 1}</h4>
                        <button
                          onClick={() => {
                            const newQuestions = editingContent.quiz.questions.filter((_, i) => i !== qIndex);
                            handleContentChange('quiz', 'questions', newQuestions);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Soru Metni
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => {
                            const newQuestions = [...editingContent.quiz.questions];
                            newQuestions[qIndex].question = e.target.value;
                            handleContentChange('quiz', 'questions', newQuestions);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seçenekler
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 w-8">{oIndex + 1}.</span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...editingContent.quiz.questions];
                                  newQuestions[qIndex].options[oIndex] = e.target.value;
                                  handleContentChange('quiz', 'questions', newQuestions);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Özellikler (What's Included?)</h3>
              <button
                onClick={() => addArrayItem('features', {
                  title: 'Yeni Özellik',
                  description: 'Özellik açıklaması...'
                })}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Özellik Ekle</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {editingContent.features.map((feature, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Özellik #{index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('features', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section Tab */}
        {activeTab === 'cta' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">CTA Bölümü (Start Today to Succeed)</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.cta.title}
                  onChange={(e) => handleContentChange('cta', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Alt Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.cta.subtitle}
                  onChange={(e) => handleContentChange('cta', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={editingContent.cta.buttonText}
                  onChange={(e) => handleContentChange('cta', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garanti Metni
                  </label>
                  <input
                    type="text"
                    value={editingContent.cta.guaranteeText}
                    onChange={(e) => handleContentChange('cta', 'guaranteeText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kredi Kartı Metni
                  </label>
                  <input
                    type="text"
                    value={editingContent.cta.noCardText}
                    onChange={(e) => handleContentChange('cta', 'noCardText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    CTA Özellikleri
                  </label>
                  <button
                    onClick={() => {
                      const newFeatures = [...editingContent.cta.features, 'Yeni özellik'];
                      handleContentChange('cta', 'features', newFeatures);
                    }}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Özellik Ekle</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {editingContent.cta.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...editingContent.cta.features];
                          newFeatures[index] = e.target.value;
                          handleContentChange('cta', 'features', newFeatures);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newFeatures = editingContent.cta.features.filter((_, i) => i !== index);
                          handleContentChange('cta', 'features', newFeatures);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup Management Tab */}
        {activeTab === 'popup' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Popup Yönetimi (Exit Intent)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popup Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.popup.title}
                  onChange={(e) => handleContentChange('popup', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popup Alt Başlığı
                </label>
                <textarea
                  value={editingContent.popup.subtitle}
                  onChange={(e) => handleContentChange('popup', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ana Buton Metni
                  </label>
                  <input
                    type="text"
                    value={editingContent.popup.buttonText}
                    onChange={(e) => handleContentChange('popup', 'buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reddetme Metni
                  </label>
                  <input
                    type="text"
                    value={editingContent.popup.dismissText}
                    onChange={(e) => handleContentChange('popup', 'dismissText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Management Tab */}
        {activeTab === 'colors' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Renk Düzenleme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Renk (Primary)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.primary}
                    onChange={(e) => handleContentChange('colors', 'primary', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.primary}
                    onChange={(e) => handleContentChange('colors', 'primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İkincil Renk (Secondary)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.secondary}
                    onChange={(e) => handleContentChange('colors', 'secondary', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.secondary}
                    onChange={(e) => handleContentChange('colors', 'secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vurgu Rengi (Accent)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.accent}
                    onChange={(e) => handleContentChange('colors', 'accent', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.accent}
                    onChange={(e) => handleContentChange('colors', 'accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başarı Rengi (Success)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.success}
                    onChange={(e) => handleContentChange('colors', 'success', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.success}
                    onChange={(e) => handleContentChange('colors', 'success', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uyarı Rengi (Warning)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.warning}
                    onChange={(e) => handleContentChange('colors', 'warning', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.warning}
                    onChange={(e) => handleContentChange('colors', 'warning', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hata Rengi (Error)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.error}
                    onChange={(e) => handleContentChange('colors', 'error', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.error}
                    onChange={(e) => handleContentChange('colors', 'error', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arkaplan Rengi (Background)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.background}
                    onChange={(e) => handleContentChange('colors', 'background', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.background}
                    onChange={(e) => handleContentChange('colors', 'background', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yüzey Rengi (Surface)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.surface}
                    onChange={(e) => handleContentChange('colors', 'surface', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.surface}
                    onChange={(e) => handleContentChange('colors', 'surface', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metin Rengi (Text)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.text}
                    onChange={(e) => handleContentChange('colors', 'text', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.text}
                    onChange={(e) => handleContentChange('colors', 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İkincil Metin Rengi (Text Secondary)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingContent.colors.textSecondary}
                    onChange={(e) => handleContentChange('colors', 'textSecondary', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingContent.colors.textSecondary}
                    onChange={(e) => handleContentChange('colors', 'textSecondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 404 Page Tab */}
        {activeTab === 'notfound' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">404 Sayfa Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  404 Başlığı
                </label>
                <input
                  type="text"
                  value={editingContent.notFound.title}
                  onChange={(e) => handleContentChange('notFound', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  404 Alt Başlığı
                </label>
                <textarea
                  value={editingContent.notFound.subtitle}
                  onChange={(e) => handleContentChange('notFound', 'subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={editingContent.notFound.buttonText}
                  onChange={(e) => handleContentChange('notFound', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}