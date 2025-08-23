import React, { useState, useEffect } from 'react';
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
  Menu, 
  X,
  Monitor, 
  Upload, 
  Home,
  Send
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
  const [activeTab, setActiveTab] = useState<'emails' | 'visitors' | 'content' | 'seo' | 'navbar' | 'quiz' | 'features' | 'cta' | 'popup' | 'colors' | 'notfound' | 'smtp' | 'mail-editor'>('emails');
  const [editingContent, setEditingContent] = useState<SiteContent>(content || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: ''
  });
  const [mailContent, setMailContent] = useState({
    subject: 'Keto Diyeti Rehberiniz Hazır!',
    htmlContent: `
      <h2>Merhaba!</h2>
      <p>Keto diyeti rehberiniz hazır. Aşağıdaki linkten indirebilirsiniz:</p>
      <a href="#" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Rehberi İndir</a>
      <p>Başarılar dileriz!</p>
    `,
    textContent: 'Merhaba! Keto diyeti rehberiniz hazır. Başarılar dileriz!'
  });
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setEditingContent(content || {});
  }, [content]);

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

  const handleSendBulkEmail = async () => {
    if (selectedEmails.length === 0) {
      alert('Lütfen email göndermek için en az bir kişi seçin.');
      return;
    }
    
    setIsSending(true);
    // Simulate sending emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`${selectedEmails.length} kişiye email gönderildi!`);
    setSelectedEmails([]);
    setIsSending(false);
  };

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const selectAllEmails = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(email => email.id));
    }
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
    { id: 'smtp', label: 'SMTP Ayarları', icon: Send },
    { id: 'mail-editor', label: 'Mail Düzenleme', icon: Edit3 },
    { id: 'seo', label: 'SEO Ayarları', icon: Globe },
    { id: 'navbar', label: 'Navbar', icon: Navigation },
    { id: 'quiz', label: 'Quiz Yönetimi', icon: BarChart3 },
    { id: 'features', label: 'Özellikler', icon: Eye },
    { id: 'cta', label: 'CTA Bölümü', icon: FileText },
    { id: 'popup', label: 'Popup Yönetimi', icon: Eye },
    { id: 'colors', label: 'Renk Düzenleme', icon: Palette },
    { id: 'notfound', label: '404 Sayfası', icon: FileText }
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  closeSidebar();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Siteyi Görüntüle</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
            </div>
            {hasChanges && (
              <button
                onClick={saveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Değişiklikleri Kaydet</span>
                <span className="sm:hidden">Kaydet</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Email veya kaynak ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={selectAllEmails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedEmails.length === emails.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                  </button>
                  <button
                    onClick={handleSendBulkEmail}
                    disabled={selectedEmails.length === 0 || isSending}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? 'Gönderiliyor...' : `Email Gönder (${selectedEmails.length})`}</span>
                  </button>
                  <button
                    onClick={exportEmails}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>CSV İndir</span>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Abone</p>
                      <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
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
                <div className="bg-white p-6 rounded-lg shadow">
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
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Mail className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bugün</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {emails.filter(email => {
                          const emailDate = new Date(email.timestamp);
                          const today = new Date();
                          return emailDate.toDateString() === today.toDateString();
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="bg-white rounded-lg shadow overflow-hidden w-full">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedEmails.length === emails.length && emails.length > 0}
                            onChange={selectAllEmails}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaynak</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmails.map((email) => (
                        <tr key={email.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedEmails.includes(email.id)}
                              onChange={() => toggleEmailSelection(email.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{email.email}</td>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Sayfa veya referrer ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={exportVisitors}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV İndir</span>
                </button>
              </div>

              {/* Visitor Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Ziyaret</p>
                      <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
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
                <div className="bg-white p-6 rounded-lg shadow">
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
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {visitors.filter(visitor => {
                          const visitDate = new Date(visitor.timestamp);
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return visitDate > monthAgo;
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitors List */}
              <div className="bg-white rounded-lg shadow overflow-hidden w-full">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sayfa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarayıcı</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVisitors.slice(0, 100).map((visitor) => (
                        <tr key={visitor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(visitor.timestamp).toLocaleString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.page}</td>
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
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Ana Banner (Hero)</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ana Başlık</label>
                    <input 
                      type="text"
                      value={editingContent.hero?.title || ''}
                      onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                    <textarea
                      value={editingContent.hero?.subtitle || ''}
                      onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-base"
                      rows={4}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ana Buton Metni</label>
                    <input
                      type="text"
                      value={editingContent.hero?.ctaText || ''}
                      onChange={(e) => handleContentChange('hero', 'ctaText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2">İkinci Buton Metni</label>
                    <input
                      type="text"
                      value={editingContent.hero?.ctaSecondary || ''}
                      onChange={(e) => handleContentChange('hero', 'ctaSecondary', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Resmi</label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={editingContent.hero?.image || ''}
                        onChange={(e) => handleContentChange('hero', 'image', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="Resim URL'si"
                      />
                      <button
                        onClick={() => handleImageUpload('hero', 'image')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Yükle</span>
                      </button>
                    </div>
                    {editingContent.hero?.image && (
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">İstatistikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Sayısı</label>
                    <input
                      type="text"
                      value={editingContent.stats?.users || ''}
                      onChange={(e) => handleContentChange('stats', 'users', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gün Sayısı</label>
                    <input
                      type="text"
                      value={editingContent.stats?.days || ''}
                      onChange={(e) => handleContentChange('stats', 'days', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başarı Oranı</label>
                    <input
                      type="text"
                      value={editingContent.stats?.success || ''}
                      onChange={(e) => handleContentChange('stats', 'success', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
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
                  {editingContent.testimonials?.map((testimonial, index) => (
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => handleArrayChange('testimonials', index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sonuç</label>
                          <input
                            type="text"
                            value={testimonial.result}
                            onChange={(e) => handleArrayChange('testimonials', index, 'result', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resim</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="url"
                            value={testimonial.image}
                            onChange={(e) => handleArrayChange('testimonials', index, 'image', e.target.value)}
                            placeholder="https://images.pexels.com/..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hikaye</label>
                        <textarea
                          value={testimonial.story}
                          onChange={(e) => handleArrayChange('testimonials', index, 'story', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SMTP Settings */}
          {activeTab === 'smtp' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">SMTP Ayarları</h2>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.host}
                      onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.port}
                      onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
                      placeholder="587"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.username}
                      onChange={(e) => setSmtpSettings({...smtpSettings, username: e.target.value})}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <input
                      type="password"
                      value={smtpSettings.password}
                      onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gönderen Email
                    </label>
                    <input
                      type="email"
                      value={smtpSettings.fromEmail}
                      onChange={(e) => setSmtpSettings({...smtpSettings, fromEmail: e.target.value})}
                      placeholder="noreply@yoursite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gönderen İsim
                    </label>
                    <input
                      type="text"
                      value={smtpSettings.fromName}
                      onChange={(e) => setSmtpSettings({...smtpSettings, fromName: e.target.value})}
                      placeholder="KetoMaster"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>SMTP Ayarlarını Kaydet</span>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Gmail SMTP Ayarları:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Host: smtp.gmail.com</li>
                    <li>• Port: 587 (TLS) veya 465 (SSL)</li>
                    <li>• Gmail hesabınızda "Daha az güvenli uygulamalara erişim" açık olmalı</li>
                    <li>• Veya "Uygulama şifresi" kullanın</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mail Editor */}
          {activeTab === 'mail-editor' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Mail İçeriği Düzenleme</h2>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Konusu
                    </label>
                    <input
                      type="text"
                      value={mailContent.subject}
                      onChange={(e) => setMailContent({...mailContent, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML İçerik
                    </label>
                    <textarea
                      value={mailContent.htmlContent}
                      onChange={(e) => setMailContent({...mailContent, htmlContent: e.target.value})}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      placeholder="HTML email içeriğini buraya yazın..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Düz Metin İçerik
                    </label>
                    <textarea
                      value={mailContent.textContent}
                      onChange={(e) => setMailContent({...mailContent, textContent: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Düz metin email içeriğini buraya yazın..."
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Önizleme</span>
                  </button>
                  
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Mail İçeriğini Kaydet</span>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">HTML Email İpuçları:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Inline CSS kullanın (style="...")</li>
                    <li>• Table-based layout tercih edin</li>
                    <li>• Resimler için tam URL kullanın</li>
                    <li>• Alt text ekleyin</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings Tab */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Ayarları</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.seo?.title || ''}
                    onChange={(e) => handleContentChange('seo', 'title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                  <textarea
                    value={editingContent.seo?.description || ''}
                    onChange={(e) => handleContentChange('seo', 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
                  <input
                    type="text"
                    value={editingContent.seo?.keywords || ''}
                    onChange={(e) => handleContentChange('seo', 'keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yazar</label>
                  <input
                    type="text"
                    value={editingContent.seo?.author || ''}
                    onChange={(e) => handleContentChange('seo', 'author', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                  <input
                    type="url"
                    value={editingContent.seo?.canonical || ''}
                    onChange={(e) => handleContentChange('seo', 'canonical', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navbar Tab */}
          {activeTab === 'navbar' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Navbar Yönetimi</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Metni</label>
                  <input
                    type="text"
                    value={editingContent.navbar?.logo || ''}
                    onChange={(e) => handleContentChange('navbar', 'logo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Menü Öğeleri</label>
                    <button
                      onClick={() => {
                        const newMenuItems = [...(editingContent.navbar?.menuItems || []), { label: 'Yeni Menü', href: '#new' }];
                        handleContentChange('navbar', 'menuItems', newMenuItems);
                      }}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ekle</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {editingContent.navbar?.menuItems?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const newMenuItems = [...(editingContent.navbar?.menuItems || [])];
                              newMenuItems[index].label = e.target.value;
                              handleContentChange('navbar', 'menuItems', newMenuItems);
                            }}
                            placeholder="Menü Adı"
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const newMenuItems = [...(editingContent.navbar?.menuItems || [])];
                              newMenuItems[index].href = e.target.value;
                              handleContentChange('navbar', 'menuItems', newMenuItems);
                            }}
                            placeholder="Link (#section)"
                            className="px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newMenuItems = (editingContent.navbar?.menuItems || []).filter((_, i) => i !== index);
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quiz Yönetimi</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.quiz?.title || ''}
                    onChange={(e) => handleContentChange('quiz', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Alt Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.quiz?.subtitle || ''}
                    onChange={(e) => handleContentChange('quiz', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Quiz Soruları</label>
                    <button
                      onClick={() => {
                        const newQuestions = [...(editingContent.quiz?.questions || []), { 
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
                    {editingContent.quiz?.questions?.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Soru #{qIndex + 1}</h4>
                          <button
                            onClick={() => {
                              const newQuestions = (editingContent.quiz?.questions || []).filter((_, i) => i !== qIndex);
                              handleContentChange('quiz', 'questions', newQuestions);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Soru Metni</label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => {
                              const newQuestions = [...(editingContent.quiz?.questions || [])];
                              newQuestions[qIndex].question = e.target.value;
                              handleContentChange('quiz', 'questions', newQuestions);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Seçenekler</label>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 w-8">{oIndex + 1}.</span>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newQuestions = [...(editingContent.quiz?.questions || [])];
                                    newQuestions[qIndex].options[oIndex] = e.target.value;
                                    handleContentChange('quiz', 'questions', newQuestions);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
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
            <div className="bg-white rounded-lg shadow p-6">
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
                {editingContent.features?.map((feature, index) => (
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">CTA Bölümü (Start Today to Succeed)</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.cta?.title || ''}
                    onChange={(e) => handleContentChange('cta', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Alt Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.cta?.subtitle || ''}
                    onChange={(e) => handleContentChange('cta', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buton Metni</label>
                  <input
                    type="text"
                    value={editingContent.cta?.buttonText || ''}
                    onChange={(e) => handleContentChange('cta', 'buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garanti Metni</label>
                    <input
                      type="text"
                      value={editingContent.cta?.guaranteeText || ''}
                      onChange={(e) => handleContentChange('cta', 'guaranteeText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kredi Kartı Metni</label>
                    <input
                      type="text"
                      value={editingContent.cta?.noCardText || ''}
                      onChange={(e) => handleContentChange('cta', 'noCardText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">CTA Özellikleri</label>
                    <button
                      onClick={() => {
                        const newFeatures = [...(editingContent.cta?.features || []), 'Yeni özellik'];
                        handleContentChange('cta', 'features', newFeatures);
                      }}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Özellik Ekle</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {editingContent.cta?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...(editingContent.cta?.features || [])];
                            newFeatures[index] = e.target.value;
                            handleContentChange('cta', 'features', newFeatures);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = (editingContent.cta?.features || []).filter((_, i) => i !== index);
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Popup Yönetimi (Exit Intent)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Popup Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.popup?.title || ''}
                    onChange={(e) => handleContentChange('popup', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Popup Alt Başlığı</label>
                  <textarea
                    value={editingContent.popup?.subtitle || ''}
                    onChange={(e) => handleContentChange('popup', 'subtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ana Buton Metni</label>
                    <input
                      type="text"
                      value={editingContent.popup?.buttonText || ''}
                      onChange={(e) => handleContentChange('popup', 'buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reddetme Metni</label>
                    <input
                      type="text"
                      value={editingContent.popup?.dismissText || ''}
                      onChange={(e) => handleContentChange('popup', 'dismissText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color Management Tab */}
          {activeTab === 'colors' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Renk Düzenleme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Object.entries(editingContent.colors || {}).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex space-x-2">
                      <div className="w-16 h-12 rounded-lg border-2 border-gray-300 shadow-sm" style={{ backgroundColor: value }}></div>
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleContentChange('colors', key, e.target.value)}
                        className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleContentChange('colors', key, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 404 Page Tab */}
          {activeTab === 'notfound' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">404 Sayfası</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">404 Başlığı</label>
                  <input
                    type="text"
                    value={editingContent.notFound?.title || ''}
                    onChange={(e) => handleContentChange('notFound', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">404 Alt Başlığı</label>
                  <textarea
                    value={editingContent.notFound?.subtitle || ''}
                    onChange={(e) => handleContentChange('notFound', 'subtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ana Sayfaya Dön Butonu</label>
                  <input
                    type="text"
                    value={editingContent.notFound?.buttonText || ''}
                    onChange={(e) => handleContentChange('notFound', 'buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}