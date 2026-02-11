'use client';

import { useEffect, useCallback, useState } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

const LANGUAGES = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('fr');

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'fr',
            includedLanguages: 'fr,en',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Detect current language from cookie
    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    if (match) {
      setCurrentLang(match[1]);
    }
  }, []);

  const switchLanguage = useCallback((langCode: string) => {
    setCurrentLang(langCode);

    const doSwitch = () => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!doSwitch()) {
      // Google Translate pas encore chargé, on réessaie toutes les 200ms pendant 3s
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (doSwitch() || attempts >= 15) {
          clearInterval(interval);
        }
      }, 200);
    }
  }, []);

  return (
    <>
      {/* Hidden Google Translate container */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Custom switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {LANGUAGES.map((lang, idx) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: currentLang === lang.code ? 700 : 400,
              color: currentLang === lang.code ? '#ffffff' : '#59a498',
              backgroundColor: currentLang === lang.code ? '#59a498' : 'transparent',
              border: '1px solid #59a498',
              borderRadius:
                idx === 0
                  ? '6px 0 0 6px'
                  : idx === LANGUAGES.length - 1
                    ? '0 6px 6px 0'
                    : '0',
              borderLeft: idx > 0 ? 'none' : '1px solid #59a498',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </>
  );
}
