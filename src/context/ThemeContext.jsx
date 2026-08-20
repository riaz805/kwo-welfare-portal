import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const ThemeContext = createContext();

const defaultSettings = {
  urName: 'کوزتیراج ویلفیئر آرگنائزیشن',
  enName: 'Koztiraj Welfare Organization',
  shortName: 'KWO',
  logoUrl: '',
  primaryColor: '#059669',
  secondaryColor: '#065f46',
  accentColor: '#f59e0b',
  monthlyFee: 1000,
  cards: [
    { id: 'dastoor', title: 'دستور', visible: true, order: 1, icon: 'BookOpen' },
    { id: 'members', title: 'ممبران', visible: true, order: 2, icon: 'Users' },
    { id: 'funds', title: 'فنڈز', visible: true, order: 3, icon: 'Wallet' },
    { id: 'donations', title: 'عطیات (Donations)', visible: true, order: 4, icon: 'HeartHandshake' },
    { id: 'expenses', title: 'اخراجات', visible: true, order: 5, icon: 'Receipt' },
    { id: 'arrears', title: 'بقایاجات', visible: true, order: 6, icon: 'Clock' },
    { id: 'notices', title: 'نوٹس بورڈ', visible: true, order: 7, icon: 'Bell' },
    { id: 'activities', title: 'سرگرمیاں', visible: true, order: 8, icon: 'Calendar' },
    { id: 'encouragement', title: 'حوصلہ افزائی', visible: true, order: 9, icon: 'Award' },
    { id: 'reports', title: 'رپورٹس', visible: true, order: 10, icon: 'FileText' },
    { id: 'about', title: 'تعارف', visible: true, order: 11, icon: 'Info' },
    { id: 'contact', title: 'رابطہ', visible: true, order: 12, icon: 'Phone' }
  ]
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await dbService.getAll('settings');
      if (data && data.length > 0) {
        const siteConfig = data.find(item => item.id === 'site_config');
        if (siteConfig) setSettings(prev => ({ ...prev, ...siteConfig }));
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newConfig) => {
    const updated = { ...settings, ...newConfig };
    setSettings(updated);
    await dbService.setWithId('settings', 'site_config', updated);
    
    // Apply CSS Variables
    document.documentElement.style.setProperty('--color-primary', updated.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', updated.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', updated.accentColor);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
