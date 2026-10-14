import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * English / Hindi toggle.
 * Covers the site header, menu, footer, home page, forms and buttons.
 * To translate more text: add a key to both `en` and `hi`, then use t("your.key").
 */

export type Lang = "en" | "hi";

const en = {
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.academics": "Academics",
  "nav.admissions": "Admissions",
  "nav.fees": "Fees & Transport",
  "nav.events": "Notices & Events",
  "nav.gallery": "Gallery",
  "nav.contact": "Contact",
  "cta.apply": "Apply Now",
  "cta.enquire": "Send Admission Enquiry",
  "cta.call": "Call the School",
  "cta.whatsapp": "WhatsApp Us",
  "cta.directions": "Get Directions",
  "cta.prospectus": "Download Prospectus",
  "header.affiliated": "Affiliated to CBSE, New Delhi",
  "header.affiliationNo": "Affiliation No.",
  "lang.switch": "हिंदी",
  "lang.switchLabel": "Switch to Hindi",

  "home.badge": "CBSE Affiliated · Nursery to Class XII",
  "home.welcome": "Welcome to",
  "home.tagline":
    "Quality CBSE education from Nursery to Class XII in Fatehpur, with strong academics, good values, and caring teachers.",
  "home.admissionsOpen": "Admissions open. Talk to our office today.",
  "home.visionTitle": "Our Vision & Mission",
  "home.vision": "Vision",
  "home.visionText":
    "To be a leading school in the region that shapes students with strong character, academic excellence, and respect for every culture.",
  "home.mission": "Mission",
  "home.missionText":
    "To give every child a complete education that combines rigorous academics with good values, critical thinking, and creativity.",
  "home.chairmanTitle": "Chairman's Message",
  "home.chairmanP1":
    "It is with great pride that I welcome you to Brilliant Oriental Senior Secondary School. Our school stands for academic excellence and character, nurturing young minds to become the leaders of tomorrow.",
  "home.chairmanP2":
    "We believe in a complete education that combines strong academics with moral values and life skills. Our dedicated teachers create an environment where every student can reach their full potential.",
  "home.chairmanP3":
    "As we grow as a CBSE senior secondary school, we remain committed to shaping well-rounded individuals who will contribute meaningfully to society.",
  "home.chairmanRole": "Chairman",
  "home.whyTitle": "Why parents choose us",
  "home.why1Title": "CBSE curriculum to Class XII",
  "home.why1Text": "Complete schooling on one campus, from Nursery to the Class XII board examinations.",
  "home.why2Title": "Experienced teachers",
  "home.why2Text": "Qualified teachers who give individual attention and track every student's progress.",
  "home.why3Title": "Islamic values & character",
  "home.why3Text": "Education that nurtures faith, good manners, and discipline alongside academics.",
  "home.toppersTitle": "Our board toppers",
  "home.testimonialsTitle": "What parents say",
  "home.ctaTitle": "Looking for admission?",
  "home.ctaText": "Send an enquiry and our admissions office will call you back, or reach us directly on phone or WhatsApp.",

  "stats.years": "Years of education",
  "stats.students": "Students",
  "stats.teachers": "Teachers",
  "stats.result": "Board result",

  "notice.label": "Notices",
  "notice.viewAll": "View all",

  "form.studentName": "Student's name",
  "form.class": "Class applying for",
  "form.selectClass": "Select a class",
  "form.parentName": "Parent's name",
  "form.phone": "Phone number",
  "form.email": "Email (optional)",
  "form.previousSchool": "Previous school (optional)",
  "form.message": "Anything you'd like to ask? (optional)",
  "form.sending": "Sending…",
  "form.enquiryTitle": "Admission enquiry",
  "form.enquiryDesc": "Share a few details and our admissions office will call you back.",

  "footer.about": "Nurturing minds, building futures. Excellence in education since 2006.",
  "footer.quickLinks": "Quick Links",
  "footer.academics": "Academics",
  "footer.connect": "Connect With Us",
  "footer.rights": "All rights reserved.",
  "whatsapp.message": "Hello, I would like information about admission at Brilliant Oriental Senior Secondary School.",
};

type Dict = Record<keyof typeof en, string>;

const hi: Dict = {
  "nav.home": "होम",
  "nav.about": "हमारे बारे में",
  "nav.academics": "शिक्षा",
  "nav.admissions": "प्रवेश",
  "nav.fees": "फीस और परिवहन",
  "nav.events": "सूचनाएं और कार्यक्रम",
  "nav.gallery": "गैलरी",
  "nav.contact": "संपर्क",
  "cta.apply": "प्रवेश के लिए आवेदन",
  "cta.enquire": "प्रवेश पूछताछ भेजें",
  "cta.call": "स्कूल को कॉल करें",
  "cta.whatsapp": "व्हाट्सऐप करें",
  "cta.directions": "रास्ता देखें",
  "cta.prospectus": "प्रॉस्पेक्टस डाउनलोड करें",
  "header.affiliated": "सीबीएसई, नई दिल्ली से संबद्ध",
  "header.affiliationNo": "संबद्धता संख्या",
  "lang.switch": "English",
  "lang.switchLabel": "Switch to English",

  "home.badge": "सीबीएसई संबद्ध · नर्सरी से कक्षा 12 तक",
  "home.welcome": "आपका स्वागत है",
  "home.tagline":
    "फतेहपुर में नर्सरी से कक्षा 12 तक गुणवत्तापूर्ण सीबीएसई शिक्षा, मज़बूत पढ़ाई, अच्छे संस्कार और समर्पित शिक्षकों के साथ।",
  "home.admissionsOpen": "प्रवेश जारी हैं। आज ही हमारे कार्यालय से बात करें।",
  "home.visionTitle": "हमारा दृष्टिकोण और लक्ष्य",
  "home.vision": "दृष्टिकोण",
  "home.visionText":
    "क्षेत्र का अग्रणी विद्यालय बनना, जो विद्यार्थियों में मज़बूत चरित्र, शैक्षणिक उत्कृष्टता और हर संस्कृति के प्रति सम्मान विकसित करे।",
  "home.mission": "लक्ष्य",
  "home.missionText":
    "हर बच्चे को ऐसी संपूर्ण शिक्षा देना जिसमें कठिन परिश्रम वाली पढ़ाई के साथ अच्छे संस्कार, तार्किक सोच और रचनात्मकता हो।",
  "home.chairmanTitle": "अध्यक्ष का संदेश",
  "home.chairmanP1":
    "ब्रिलियंट ओरिएंटल सीनियर सेकेंडरी स्कूल में आपका स्वागत करते हुए मुझे गर्व है। हमारा विद्यालय शैक्षणिक उत्कृष्टता और चरित्र निर्माण का प्रतीक है, जो युवा मन को कल के नेता बनाने के लिए तैयार करता है।",
  "home.chairmanP2":
    "हम ऐसी संपूर्ण शिक्षा में विश्वास रखते हैं जो मज़बूत पढ़ाई को नैतिक मूल्यों और जीवन कौशल से जोड़ती है। हमारे समर्पित शिक्षक ऐसा वातावरण बनाते हैं जहाँ हर विद्यार्थी अपनी पूरी क्षमता तक पहुँच सके।",
  "home.chairmanP3":
    "एक सीबीएसई सीनियर सेकेंडरी विद्यालय के रूप में आगे बढ़ते हुए, हम ऐसे व्यक्तित्व गढ़ने के लिए प्रतिबद्ध हैं जो समाज में सार्थक योगदान दें।",
  "home.chairmanRole": "अध्यक्ष",
  "home.whyTitle": "अभिभावक हमें क्यों चुनते हैं",
  "home.why1Title": "कक्षा 12 तक सीबीएसई पाठ्यक्रम",
  "home.why1Text": "एक ही परिसर में नर्सरी से कक्षा 12 की बोर्ड परीक्षा तक पूरी पढ़ाई।",
  "home.why2Title": "अनुभवी शिक्षक",
  "home.why2Text": "योग्य शिक्षक जो हर विद्यार्थी पर व्यक्तिगत ध्यान देते हैं और उसकी प्रगति पर नज़र रखते हैं।",
  "home.why3Title": "इस्लामी मूल्य और चरित्र",
  "home.why3Text": "पढ़ाई के साथ ईमान, अच्छे व्यवहार और अनुशासन को विकसित करने वाली शिक्षा।",
  "home.toppersTitle": "हमारे बोर्ड टॉपर्स",
  "home.testimonialsTitle": "अभिभावकों की राय",
  "home.ctaTitle": "प्रवेश लेना चाहते हैं?",
  "home.ctaText": "पूछताछ भेजें, हमारा प्रवेश कार्यालय आपको कॉल करेगा। या सीधे फ़ोन या व्हाट्सऐप पर संपर्क करें।",

  "stats.years": "वर्षों से शिक्षा",
  "stats.students": "विद्यार्थी",
  "stats.teachers": "शिक्षक",
  "stats.result": "बोर्ड परिणाम",

  "notice.label": "सूचनाएं",
  "notice.viewAll": "सभी देखें",

  "form.studentName": "विद्यार्थी का नाम",
  "form.class": "किस कक्षा में प्रवेश",
  "form.selectClass": "कक्षा चुनें",
  "form.parentName": "अभिभावक का नाम",
  "form.phone": "फ़ोन नंबर",
  "form.email": "ईमेल (वैकल्पिक)",
  "form.previousSchool": "पिछला विद्यालय (वैकल्पिक)",
  "form.message": "कुछ पूछना चाहते हैं? (वैकल्पिक)",
  "form.sending": "भेजा जा रहा है…",
  "form.enquiryTitle": "प्रवेश पूछताछ",
  "form.enquiryDesc": "कुछ जानकारी दें, हमारा प्रवेश कार्यालय आपको वापस कॉल करेगा।",

  "footer.about": "ज्ञान का पोषण, भविष्य का निर्माण। 2006 से शिक्षा में उत्कृष्टता।",
  "footer.quickLinks": "महत्वपूर्ण लिंक",
  "footer.academics": "शिक्षा",
  "footer.connect": "हमसे जुड़ें",
  "footer.rights": "सर्वाधिकार सुरक्षित।",
  "whatsapp.message": "नमस्ते, मुझे ब्रिलियंट ओरिएंटल सीनियर सेकेंडरी स्कूल में प्रवेश की जानकारी चाहिए।",
};

export type TKey = keyof typeof en;

const dictionaries: Record<Lang, Dict> = { en, hi };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: TKey) => string };

const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => en[k] });

const STORAGE_KEY = "bos-lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable: language just won't be remembered */
    }
  }, [lang]);

  const t = (key: TKey) => dictionaries[lang][key] ?? en[key];

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
