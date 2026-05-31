import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr' | 'bn' | 'gu';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  welcome: { en: 'Welcome', hi: 'स्वागत है', ta: 'வரவேற்பு', te: 'స్వాగతం', kn: 'ಸ್ವಾಗತ', mr: 'स्वागत आहे', bn: 'স্বাগতম', gu: 'સ્વાગત છે' },
  home: { en: 'Home', hi: 'होम', ta: 'முகப்பு', te: 'హోమ్', kn: 'ಮುಖಪುಟ', mr: 'होम', bn: 'হোম', gu: 'હોમ' },
  marketplace: { en: 'Marketplace', hi: 'मार्केटप्लेस', ta: 'சந்தை', te: 'మార్కెట్', kn: 'ಮಾರ್ಕೆಟ್', mr: 'बाजार', bn: 'বাজার', gu: 'બજાર' },
  sell: { en: 'Sell', hi: 'बेचें', ta: 'விற்பனை', te: 'అమ్మకం', kn: 'ಮಾರಾಟ', mr: 'विक्री', bn: 'বিক্রি', gu: 'વેચાણ' },
  insights: { en: 'Insights', hi: 'जानकारी', ta: 'நுண்ணறிவு', te: 'ఇన్‌సైట్స్', kn: 'ಒಳನೋಟ', mr: 'अंतर्दृष्टी', bn: 'অন্তর্দৃষ্টি', gu: 'ઈન્સાઇટ્સ' },
  community: { en: 'Community', hi: 'समुदाय', ta: 'சமூகம்', te: 'కమ్యూనిటీ', kn: 'ಸಮುದಾಯ', mr: 'समुदाय', bn: 'কমিউনিটি', gu: 'કમ્યુનિટી' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', ta: 'சுயவிவரம்', te: 'ప్రొఫైల్', kn: 'ಪ್ರೊಫೈಲ್', mr: 'प्रोफाइल', bn: 'প্রোফাইল', gu: 'પ્રોફાઇલ' },
  login: { en: 'Login', hi: 'लॉग इन', ta: 'உள்நுழைய', te: 'లాగిన్', kn: 'ಲಾಗಿನ್', mr: 'लॉग इन', bn: 'লগইন', gu: 'લૉગિન' },
  signup: { en: 'Sign Up', hi: 'साइन अप', ta: 'பதிவு செய்ய', te: 'సైన్ అప్', kn: 'ಸೈನ್ ಅಪ್', mr: 'साइन अप', bn: 'সাইন আপ', gu: 'સાઇન અપ' },
  logout: { en: 'Logout', hi: 'लॉग आउट', ta: 'வெளியேறு', te: 'లాగ్ అవుట్', kn: 'ಲಾಗ್ ಔಟ್', mr: 'लॉग आउट', bn: 'লগআউট', gu: 'લૉગિન' },
  weather: { en: 'Weather', hi: 'मौसम', ta: 'வானிலை', te: 'వాతావరణం', kn: 'ಹವಾಮಾನ', mr: 'हवामान', bn: 'আবহাওয়া', gu: 'હવામાન' },
  cropAdvisor: { en: 'Crop Advisor', hi: 'फसल सलाहकार', ta: 'பயிர் ஆலோசகர்', te: 'పంట సలహాదారు', kn: 'ಬೆಳೆ ಸಲಹೆಗಾರ', mr: 'पिक सल्लागार', bn: 'ফসল উপদেষ্টা', gu: 'પાક સલાહકાર' },
  scanCrop: { en: 'Scan Crop', hi: 'फसल स्कैन', ta: 'பயிர் ஸ்கேன்', te: 'పంట స్కాన్', kn: 'ಬೆಳೆ ಸ್ಕ್ಯಾನ್', mr: 'पिक स्कॅन', bn: 'ফসল স্ক্যান', gu: 'પાક સ્કેન' },
  schemes: { en: 'Govt Schemes', hi: 'सरकारी योजनाएं', ta: 'அரசு திட்டங்கள்', te: 'ప్రభుత్వ పథకాలు', kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', mr: 'सरकारी योजना', bn: 'সরকারি স্কিম', gu: 'સરકારી યોજનાઓ' },
  prices: { en: 'Market Prices', hi: 'बाजार भाव', ta: 'சந்தை விலைகள்', te: 'మార్కెట్ ధరలు', kn: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು', mr: 'बाजार भाव', bn: 'বাজার দর', gu: 'બજાર ભાવ' },
  transport: { en: 'Transport', hi: 'परिवहन', ta: 'போக்குவரத்து', te: 'రవాణా', kn: 'ಸಾರಿಗೆ', mr: 'वाहतूक', bn: 'পরিবহন', gu: 'પરિવહન' },
  email: { en: 'Email', hi: 'ईमेल', ta: 'மின்னஞ்சல்', te: 'ఇమెయిల్', kn: 'ಇಮೇಲ್', mr: 'ईमेल', bn: 'ইমেইল', gu: 'ઇમેઇલ' },
  password: { en: 'Password', hi: 'पासवर्ड', ta: 'கடவுச்சொல்', te: 'పాస్‌వర్డ్', kn: 'ಪಾಸ್‌ವರ್ಡ್', mr: 'पासवर्ड', bn: 'পাসওয়ার্ড', gu: 'પાસવર્ડ' },
  name: { en: 'Name', hi: 'नाम', ta: 'பெயர்', te: 'పేరు', kn: 'ಹೆಸರು', mr: 'नाव', bn: 'নাম', gu: 'નામ' },
  farmer: { en: 'Farmer', hi: 'किसान', ta: 'விவசாயி', te: 'రైతు', kn: 'ರೈತ', mr: 'शेतकरी', bn: 'কৃষক', gu: 'ખેડૂત' },
  buyer: { en: 'Buyer', hi: 'खरीदार', ta: 'வாடிக்கையாளர்', te: 'కొనుగోలుదారు', kn: 'ಖರೀದಿದಾರ', mr: 'खरेदीदार', bn: 'ক্রেতা', gu: 'ખરીદનાર' },
  continue: { en: 'Continue', hi: 'जारी रखें', ta: 'தொடரவும்', te: 'కొనసాగించు', kn: 'ಮುಂದುವರಿಸು', mr: 'सुरू ठेवा', bn: 'চালিয়ে যান', gu: 'ચાલુ રાખો' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
