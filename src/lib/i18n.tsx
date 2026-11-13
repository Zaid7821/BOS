import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSavedContent } from "@/hooks/useSiteContent";

/**
 * English / Hindi toggle.
 * Covers all text on the public website.
 * To add text: add a key to both `en` and `hi`, use t("your.key"), and list it in EDITABLE_TEXTS
 * so admins can change it (Admin > Website content > Page text).
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
  "notice.new": "NEW",
  "notice.important": "Important",
  "notice.attachment": "Open attachment",

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
  "footer.staffLogin": "Staff login",
  "whatsapp.message": "Hello, I would like information about admission at Brilliant Oriental Senior Secondary School.",

  // Placeholders in {braces} are filled in from School details: {name}, {year}, {affiliationNo}, {session}.
  "about.badge": "About Our School",
  "about.title": "Excellence in education since {year}",
  "about.intro": "Our history, our values, and the people who teach our students.",
  "about.historyTitle": "Our history",
  "about.history":
    "Founded in {year} in Pakka Talab, Fatehpur, Brilliant Oriental School began with a clear aim: to give children of the region a strong education together with good character and values.\n\nOver the years the school has grown steadily, and it is now {name}, affiliated to the Central Board of Secondary Education (CBSE), New Delhi, offering classes from Nursery to Class XII.\n\nOur students are prepared for the CBSE Class X and Class XII board examinations, and for the colleges and careers that follow.",
  "about.affiliationTitle": "CBSE affiliation",
  "about.affiliationBoard": "Central Board of Secondary Education, New Delhi",
  "about.levelLabel": "Level",
  "about.level": "Senior Secondary (up to Class XII)",
  "about.establishedLabel": "Established",
  "about.missionTitle": "Our Mission",
  "about.visionTitle": "Our Vision",
  "about.valuesTitle": "Our Values",
  "about.values": "Excellence in education\nFaith, honesty and good manners\nDiscipline and respect for all\nCuriosity and creativity",
  "about.staffTitle": "Our leadership & faculty",

  "academics.badge": "CBSE Curriculum",
  "academics.title": "Academics",
  "academics.intro": "We follow the CBSE curriculum with NCERT textbooks from Nursery to Class XII. Affiliation No. {affiliationNo}.",
  "academics.stagesTitle": "Stages of schooling",
  "academics.streamsTitle": "Streams in Class XI & XII",
  "academics.streamsIntro": "Students choose a stream after Class X based on their interest and board results.",
  "academics.calendarTitle": "Academic session at a glance",
  "academics.calendarIntro": "The CBSE session runs from April to March. Exact dates are shared on the notice board.",

  "admissions.badge": "Nursery to Class XI",
  "admissions.title": "Admissions",
  "admissions.intro": "Join {name}, a CBSE-affiliated school in Fatehpur. Here is everything you need to apply.",
  "admissions.stepsTitle": "How to apply",
  "admissions.talk": "Prefer to talk?",
  "admissions.documentsTitle": "Documents required",
  "admissions.ageTitle": "Age criteria (early years)",
  "admissions.ageClass": "Class",
  "admissions.ageMin": "Minimum age",
  "admissions.class11Note": "Admission to Class XI is based on Class X board results and seat availability in each stream.",

  "fees.badge": "Session {session}",
  "fees.title": "Fees & Transport",
  "fees.intro": "Fee structure for each class and school bus routes.",
  "fees.structureTitle": "Fee structure",
  "fees.colClasses": "Classes",
  "fees.colAdmission": "Admission fee (one time)",
  "fees.colMonthly": "Monthly tuition fee",
  "fees.colAnnual": "Annual charges",
  "fees.note": "Fees are payable at the school office. Ask the office about sibling concessions and scholarships.",
  "fees.askFees": "For the current fee structure, please contact the school office.",
  "fees.transportTitle": "School transport",
  "fees.perMonth": "/ month",
  "fees.askTransport": "For bus routes and transport fees, please contact the school office.",

  "events.badge": "Stay Updated",
  "events.title": "Notices & Events",
  "events.intro": "Latest announcements from the school office and upcoming events.",
  "events.noticeBoard": "Notice board",
  "events.noNotices": "No notices right now. New announcements from the school office will appear here.",
  "events.upcoming": "Upcoming events",

  "gallery.title": "School Gallery",
  "gallery.intro": "Our campus, classrooms, and events.",
  "gallery.empty": "New photos will appear here soon.",
  "gallery.videosTitle": "Videos",
  "gallery.youtube": "Watch more on our YouTube channel",

  "contact.badge": "Get In Touch",
  "contact.title": "Contact Us",
  "contact.intro": "Call, WhatsApp, or visit us for admissions, campus visits, or any other question.",
  "contact.address": "Address",
  "contact.phone": "Phone & WhatsApp",
  "contact.email": "Email",
  "contact.hours": "Office hours",
  "contact.formTitle": "Send us a message",
  "contact.formDesc": "We reply within one working day. For admissions, the enquiry form is faster:",
  "contact.formLink": "Admission enquiry form",
  "contact.name": "Full name",
  "contact.phoneLabel": "Phone",
  "contact.subject": "Subject",
  "contact.chooseSubject": "Choose a subject",
  "contact.subjectAdmissions": "Admissions",
  "contact.subjectVisit": "Campus visit",
  "contact.subjectFees": "Fees & transport",
  "contact.subjectAcademics": "Academics",
  "contact.subjectGeneral": "General question",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.quickTitle": "Quick answers",
  "contact.quick1Title": "Admission process",
  "contact.quick1Text": "Steps, documents, and age criteria.",
  "contact.quick1Cta": "See admissions",
  "contact.quick2Title": "Fees & transport",
  "contact.quick2Text": "Fee structure and school bus routes.",
  "contact.quick2Cta": "See fees",
  "contact.quick3Title": "Academic programs",
  "contact.quick3Text": "CBSE curriculum and Class XI–XII streams.",
  "contact.quick3Cta": "See academics",
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
  "notice.new": "नया",
  "notice.important": "ज़रूरी",
  "notice.attachment": "अटैचमेंट खोलें",

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
  "footer.staffLogin": "स्टाफ लॉगिन",
  "whatsapp.message": "नमस्ते, मुझे ब्रिलियंट ओरिएंटल सीनियर सेकेंडरी स्कूल में प्रवेश की जानकारी चाहिए।",

  "about.badge": "हमारे विद्यालय के बारे में",
  "about.title": "{year} से शिक्षा में उत्कृष्टता",
  "about.intro": "हमारा इतिहास, हमारे मूल्य, और वे लोग जो हमारे विद्यार्थियों को पढ़ाते हैं।",
  "about.historyTitle": "हमारा इतिहास",
  "about.history":
    "{year} में पक्का तालाब, फतेहपुर में स्थापित ब्रिलियंट ओरिएंटल स्कूल का एक स्पष्ट उद्देश्य था: क्षेत्र के बच्चों को अच्छे चरित्र और संस्कारों के साथ मज़बूत शिक्षा देना।\n\nसमय के साथ विद्यालय लगातार आगे बढ़ा है और आज यह {name} है, जो केंद्रीय माध्यमिक शिक्षा बोर्ड (सीबीएसई), नई दिल्ली से संबद्ध है और नर्सरी से कक्षा 12 तक की कक्षाएं चलाता है।\n\nहमारे विद्यार्थियों को सीबीएसई कक्षा 10 और कक्षा 12 की बोर्ड परीक्षाओं और उसके बाद के कॉलेज व करियर के लिए तैयार किया जाता है।",
  "about.affiliationTitle": "सीबीएसई संबद्धता",
  "about.affiliationBoard": "केंद्रीय माध्यमिक शिक्षा बोर्ड, नई दिल्ली",
  "about.levelLabel": "स्तर",
  "about.level": "सीनियर सेकेंडरी (कक्षा 12 तक)",
  "about.establishedLabel": "स्थापना",
  "about.missionTitle": "हमारा लक्ष्य",
  "about.visionTitle": "हमारा दृष्टिकोण",
  "about.valuesTitle": "हमारे मूल्य",
  "about.values": "शिक्षा में उत्कृष्टता\nईमान, ईमानदारी और अच्छा व्यवहार\nअनुशासन और सबके प्रति सम्मान\nजिज्ञासा और रचनात्मकता",
  "about.staffTitle": "हमारा नेतृत्व और शिक्षकगण",

  "academics.badge": "सीबीएसई पाठ्यक्रम",
  "academics.title": "शिक्षा",
  "academics.intro": "हम नर्सरी से कक्षा 12 तक एनसीईआरटी पुस्तकों के साथ सीबीएसई पाठ्यक्रम पढ़ाते हैं। संबद्धता संख्या {affiliationNo}।",
  "academics.stagesTitle": "विद्यालयी शिक्षा के चरण",
  "academics.streamsTitle": "कक्षा 11 और 12 के संकाय",
  "academics.streamsIntro": "विद्यार्थी कक्षा 10 के बाद अपनी रुचि और बोर्ड परिणाम के आधार पर संकाय चुनते हैं।",
  "academics.calendarTitle": "शैक्षणिक सत्र एक नज़र में",
  "academics.calendarIntro": "सीबीएसई सत्र अप्रैल से मार्च तक चलता है। सही तिथियाँ सूचना पट पर दी जाती हैं।",

  "admissions.badge": "नर्सरी से कक्षा 11 तक",
  "admissions.title": "प्रवेश",
  "admissions.intro": "{name} से जुड़ें, फतेहपुर का सीबीएसई संबद्ध विद्यालय। आवेदन के लिए ज़रूरी सारी जानकारी यहाँ है।",
  "admissions.stepsTitle": "आवेदन कैसे करें",
  "admissions.talk": "बात करना चाहते हैं?",
  "admissions.documentsTitle": "आवश्यक दस्तावेज़",
  "admissions.ageTitle": "आयु मानदंड (प्रारंभिक कक्षाएं)",
  "admissions.ageClass": "कक्षा",
  "admissions.ageMin": "न्यूनतम आयु",
  "admissions.class11Note": "कक्षा 11 में प्रवेश कक्षा 10 के बोर्ड परिणाम और हर संकाय में उपलब्ध सीटों के आधार पर होता है।",

  "fees.badge": "सत्र {session}",
  "fees.title": "फीस और परिवहन",
  "fees.intro": "हर कक्षा की फीस और स्कूल बस के रूट।",
  "fees.structureTitle": "फीस संरचना",
  "fees.colClasses": "कक्षाएं",
  "fees.colAdmission": "प्रवेश शुल्क (एक बार)",
  "fees.colMonthly": "मासिक शिक्षण शुल्क",
  "fees.colAnnual": "वार्षिक शुल्क",
  "fees.note": "फीस स्कूल कार्यालय में जमा होती है। भाई-बहन छूट और छात्रवृत्ति के बारे में कार्यालय से पूछें।",
  "fees.askFees": "वर्तमान फीस संरचना के लिए कृपया स्कूल कार्यालय से संपर्क करें।",
  "fees.transportTitle": "स्कूल परिवहन",
  "fees.perMonth": "/ माह",
  "fees.askTransport": "बस रूट और परिवहन शुल्क के लिए कृपया स्कूल कार्यालय से संपर्क करें।",

  "events.badge": "अपडेट रहें",
  "events.title": "सूचनाएं और कार्यक्रम",
  "events.intro": "स्कूल कार्यालय की ताज़ा घोषणाएं और आने वाले कार्यक्रम।",
  "events.noticeBoard": "सूचना पट",
  "events.noNotices": "अभी कोई सूचना नहीं है। स्कूल कार्यालय की नई घोषणाएं यहाँ दिखेंगी।",
  "events.upcoming": "आने वाले कार्यक्रम",

  "gallery.title": "स्कूल गैलरी",
  "gallery.intro": "हमारा परिसर, कक्षाएं और कार्यक्रम।",
  "gallery.empty": "नई तस्वीरें जल्द ही यहाँ दिखेंगी।",
  "gallery.videosTitle": "वीडियो",
  "gallery.youtube": "हमारे यूट्यूब चैनल पर और देखें",

  "contact.badge": "संपर्क करें",
  "contact.title": "हमसे संपर्क करें",
  "contact.intro": "प्रवेश, परिसर भ्रमण या किसी भी सवाल के लिए हमें कॉल करें, व्हाट्सऐप करें या मिलने आएं।",
  "contact.address": "पता",
  "contact.phone": "फ़ोन और व्हाट्सऐप",
  "contact.email": "ईमेल",
  "contact.hours": "कार्यालय समय",
  "contact.formTitle": "हमें संदेश भेजें",
  "contact.formDesc": "हम एक कार्यदिवस में जवाब देते हैं। प्रवेश के लिए पूछताछ फ़ॉर्म ज़्यादा तेज़ है:",
  "contact.formLink": "प्रवेश पूछताछ फ़ॉर्म",
  "contact.name": "पूरा नाम",
  "contact.phoneLabel": "फ़ोन",
  "contact.subject": "विषय",
  "contact.chooseSubject": "विषय चुनें",
  "contact.subjectAdmissions": "प्रवेश",
  "contact.subjectVisit": "परिसर भ्रमण",
  "contact.subjectFees": "फीस और परिवहन",
  "contact.subjectAcademics": "शिक्षा",
  "contact.subjectGeneral": "सामान्य प्रश्न",
  "contact.message": "संदेश",
  "contact.send": "संदेश भेजें",
  "contact.quickTitle": "त्वरित जानकारी",
  "contact.quick1Title": "प्रवेश प्रक्रिया",
  "contact.quick1Text": "चरण, दस्तावेज़ और आयु मानदंड।",
  "contact.quick1Cta": "प्रवेश देखें",
  "contact.quick2Title": "फीस और परिवहन",
  "contact.quick2Text": "फीस संरचना और स्कूल बस रूट।",
  "contact.quick2Cta": "फीस देखें",
  "contact.quick3Title": "शैक्षणिक कार्यक्रम",
  "contact.quick3Text": "सीबीएसई पाठ्यक्रम और कक्षा 11–12 के संकाय।",
  "contact.quick3Cta": "शिक्षा देखें",
};

export type TKey = keyof typeof en;

const dictionaries: Record<Lang, Dict> = { en, hi };

/** Built-in English and Hindi text, used by the admin editor to show defaults. */
export const DEFAULT_TEXTS = dictionaries;

type EditableGroup = { page: string; group: string; items: { key: TKey; label: string; long?: boolean }[] };

/**
 * Text admins may edit (Admin > Website content > Page text), grouped by page and by where it
 * appears on the page. Labels are shown in the admin panel. Every key used with t() on the public
 * site should be listed here so staff can change it without a developer.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const EDITABLE_TEXTS: EditableGroup[] = [
  {
    page: "Home page",
    group: "Top banner",
    items: [
      { key: "home.badge", label: "Small badge above the school name" },
      { key: "home.welcome", label: "Line above the school name" },
      { key: "home.tagline", label: "Tagline under the school name", long: true },
    ],
  },
  {
    page: "Home page",
    group: "Vision & mission",
    items: [
      { key: "home.visionTitle", label: "Section heading" },
      { key: "home.vision", label: "“Vision” label" },
      { key: "home.visionText", label: "Vision (also on the About page)", long: true },
      { key: "home.mission", label: "“Mission” label" },
      { key: "home.missionText", label: "Mission (also on the About page)", long: true },
    ],
  },
  {
    page: "Home page",
    group: "Numbers bar",
    items: [
      { key: "stats.years", label: "Label under years" },
      { key: "stats.students", label: "Label under students" },
      { key: "stats.teachers", label: "Label under teachers" },
      { key: "stats.result", label: "Label under board result" },
    ],
  },
  {
    page: "Home page",
    group: "Chairman's message",
    items: [
      { key: "home.chairmanTitle", label: "Section heading" },
      { key: "home.chairmanP1", label: "Paragraph 1", long: true },
      { key: "home.chairmanP2", label: "Paragraph 2", long: true },
      { key: "home.chairmanP3", label: "Paragraph 3", long: true },
      { key: "home.chairmanRole", label: "Title under the name" },
    ],
  },
  {
    page: "Home page",
    group: "Why parents choose us",
    items: [
      { key: "home.whyTitle", label: "Section heading" },
      { key: "home.why1Title", label: "Point 1 heading" },
      { key: "home.why1Text", label: "Point 1 text", long: true },
      { key: "home.why2Title", label: "Point 2 heading" },
      { key: "home.why2Text", label: "Point 2 text", long: true },
      { key: "home.why3Title", label: "Point 3 heading" },
      { key: "home.why3Text", label: "Point 3 text", long: true },
    ],
  },
  {
    page: "Home page",
    group: "Other headings",
    items: [
      { key: "home.toppersTitle", label: "Toppers heading" },
      { key: "home.testimonialsTitle", label: "Reviews heading" },
      { key: "home.ctaTitle", label: "Admission box heading" },
      { key: "home.ctaText", label: "Admission box text", long: true },
    ],
  },
  {
    page: "About page",
    group: "Top of the page",
    items: [
      { key: "about.badge", label: "Small badge" },
      { key: "about.title", label: "Page heading ({year} = year founded)" },
      { key: "about.intro", label: "Line under the heading", long: true },
      { key: "about.historyTitle", label: "“Our history” heading" },
    ],
  },
  {
    page: "About page",
    group: "CBSE affiliation box",
    items: [
      { key: "about.affiliationTitle", label: "Box heading" },
      { key: "about.affiliationBoard", label: "Line under the heading" },
      { key: "about.levelLabel", label: "“Level” label" },
      { key: "about.level", label: "Level" },
      { key: "about.establishedLabel", label: "“Established” label" },
    ],
  },
  {
    page: "About page",
    group: "Mission, vision & values",
    items: [
      { key: "about.missionTitle", label: "Mission heading (text is under Home page)" },
      { key: "about.visionTitle", label: "Vision heading (text is under Home page)" },
      { key: "about.valuesTitle", label: "Values heading" },
      { key: "about.values", label: "Values (one per line)", long: true },
      { key: "about.staffTitle", label: "Staff section heading" },
    ],
  },
  {
    page: "Academics page",
    group: "Headings & text",
    items: [
      { key: "academics.badge", label: "Small badge" },
      { key: "academics.title", label: "Page heading" },
      { key: "academics.intro", label: "Line under the heading ({affiliationNo} = affiliation number)", long: true },
      { key: "academics.stagesTitle", label: "Stages heading" },
      { key: "academics.streamsTitle", label: "Streams heading" },
      { key: "academics.streamsIntro", label: "Line under the streams heading", long: true },
      { key: "academics.calendarTitle", label: "Calendar heading" },
      { key: "academics.calendarIntro", label: "Line under the calendar heading", long: true },
    ],
  },
  {
    page: "Admissions page",
    group: "Headings & text",
    items: [
      { key: "admissions.badge", label: "Small badge" },
      { key: "admissions.title", label: "Page heading" },
      { key: "admissions.intro", label: "Line under the heading ({name} = school name)", long: true },
      { key: "admissions.stepsTitle", label: "Steps heading" },
      { key: "admissions.talk", label: "Phone box heading" },
      { key: "admissions.documentsTitle", label: "Documents heading" },
      { key: "admissions.ageTitle", label: "Age table heading" },
      { key: "admissions.ageClass", label: "Age table: first column" },
      { key: "admissions.ageMin", label: "Age table: second column" },
      { key: "admissions.class11Note", label: "Note under the age table", long: true },
    ],
  },
  {
    page: "Fees page",
    group: "Headings & text",
    items: [
      { key: "fees.badge", label: "Small badge ({session} = this year, e.g. 2026–27)" },
      { key: "fees.title", label: "Page heading" },
      { key: "fees.intro", label: "Line under the heading", long: true },
      { key: "fees.structureTitle", label: "Fee table heading" },
      { key: "fees.colClasses", label: "Fee table: classes column" },
      { key: "fees.colAdmission", label: "Fee table: admission fee column" },
      { key: "fees.colMonthly", label: "Fee table: monthly fee column" },
      { key: "fees.colAnnual", label: "Fee table: annual charges column" },
      { key: "fees.note", label: "Note under the fee table", long: true },
      { key: "fees.askFees", label: "Shown when no fees are entered", long: true },
      { key: "fees.transportTitle", label: "Transport heading" },
      { key: "fees.perMonth", label: "Text after the bus fee, e.g. “/ month”" },
      { key: "fees.askTransport", label: "Shown when no bus routes are entered", long: true },
    ],
  },
  {
    page: "Notices & Events page",
    group: "Headings & text",
    items: [
      { key: "events.badge", label: "Small badge" },
      { key: "events.title", label: "Page heading" },
      { key: "events.intro", label: "Line under the heading", long: true },
      { key: "events.noticeBoard", label: "Notices heading" },
      { key: "events.noNotices", label: "Shown when there are no notices", long: true },
      { key: "events.upcoming", label: "Events heading" },
    ],
  },
  {
    page: "Gallery page",
    group: "Headings & text",
    items: [
      { key: "gallery.title", label: "Page heading" },
      { key: "gallery.intro", label: "Line under the heading" },
      { key: "gallery.empty", label: "Shown when there are no photos" },
      { key: "gallery.videosTitle", label: "Videos heading" },
      { key: "gallery.youtube", label: "YouTube button" },
    ],
  },
  {
    page: "Contact page",
    group: "Top of the page",
    items: [
      { key: "contact.badge", label: "Small badge" },
      { key: "contact.title", label: "Page heading" },
      { key: "contact.intro", label: "Line under the heading", long: true },
      { key: "contact.address", label: "“Address” heading" },
      { key: "contact.phone", label: "“Phone” heading" },
      { key: "contact.email", label: "“Email” heading and form label" },
      { key: "contact.hours", label: "“Office hours” heading" },
    ],
  },
  {
    page: "Contact page",
    group: "Message form",
    items: [
      { key: "contact.formTitle", label: "Form heading" },
      { key: "contact.formDesc", label: "Line under the form heading", long: true },
      { key: "contact.formLink", label: "Link to the enquiry form" },
      { key: "contact.name", label: "Name field" },
      { key: "contact.phoneLabel", label: "Phone field" },
      { key: "contact.subject", label: "Subject field" },
      { key: "contact.chooseSubject", label: "Subject placeholder" },
      { key: "contact.subjectAdmissions", label: "Subject choice 1" },
      { key: "contact.subjectVisit", label: "Subject choice 2" },
      { key: "contact.subjectFees", label: "Subject choice 3" },
      { key: "contact.subjectAcademics", label: "Subject choice 4" },
      { key: "contact.subjectGeneral", label: "Subject choice 5" },
      { key: "contact.message", label: "Message field" },
      { key: "contact.send", label: "Send button" },
    ],
  },
  {
    page: "Contact page",
    group: "Quick answers",
    items: [
      { key: "contact.quickTitle", label: "Section heading" },
      { key: "contact.quick1Title", label: "Card 1 heading" },
      { key: "contact.quick1Text", label: "Card 1 text" },
      { key: "contact.quick1Cta", label: "Card 1 button" },
      { key: "contact.quick2Title", label: "Card 2 heading" },
      { key: "contact.quick2Text", label: "Card 2 text" },
      { key: "contact.quick2Cta", label: "Card 2 button" },
      { key: "contact.quick3Title", label: "Card 3 heading" },
      { key: "contact.quick3Text", label: "Card 3 text" },
      { key: "contact.quick3Cta", label: "Card 3 button" },
    ],
  },
  {
    page: "Admission enquiry form",
    group: "Form text (Admissions page)",
    items: [
      { key: "form.enquiryTitle", label: "Form heading" },
      { key: "form.enquiryDesc", label: "Line under the heading", long: true },
      { key: "form.studentName", label: "Student name field" },
      { key: "form.class", label: "Class field" },
      { key: "form.selectClass", label: "Class placeholder" },
      { key: "form.parentName", label: "Parent name field" },
      { key: "form.phone", label: "Phone field" },
      { key: "form.email", label: "Email field" },
      { key: "form.previousSchool", label: "Previous school field" },
      { key: "form.message", label: "Message field" },
      { key: "form.sending", label: "Shown while sending" },
    ],
  },
  {
    page: "Menu, buttons & footer",
    group: "Menu",
    items: [
      { key: "nav.home", label: "Home" },
      { key: "nav.about", label: "About" },
      { key: "nav.academics", label: "Academics" },
      { key: "nav.admissions", label: "Admissions" },
      { key: "nav.fees", label: "Fees & transport" },
      { key: "nav.events", label: "Notices & events" },
      { key: "nav.gallery", label: "Gallery" },
      { key: "nav.contact", label: "Contact" },
    ],
  },
  {
    page: "Menu, buttons & footer",
    group: "Buttons & header",
    items: [
      { key: "cta.apply", label: "“Apply” button" },
      { key: "cta.enquire", label: "“Send enquiry” button" },
      { key: "cta.call", label: "“Call” button" },
      { key: "cta.whatsapp", label: "“WhatsApp” button" },
      { key: "cta.directions", label: "“Directions” button" },
      { key: "cta.prospectus", label: "“Prospectus” button" },
      { key: "header.affiliated", label: "Line under the school name" },
      { key: "header.affiliationNo", label: "“Affiliation No.” label" },
    ],
  },
  {
    page: "Menu, buttons & footer",
    group: "Notice bar, footer & WhatsApp",
    items: [
      { key: "notice.label", label: "Label of the scrolling notice bar" },
      { key: "notice.viewAll", label: "“View all” link in the notice bar" },
      { key: "notice.new", label: "Tag on important notices in the notice bar" },
      { key: "notice.important", label: "Tag on important notices (Notices page)" },
      { key: "notice.attachment", label: "Link to a notice's PDF or page" },
      { key: "footer.about", label: "Footer line under the school name", long: true },
      { key: "footer.quickLinks", label: "Footer: links heading" },
      { key: "footer.academics", label: "Footer: academics heading" },
      { key: "footer.connect", label: "Footer: social media heading" },
      { key: "footer.rights", label: "Footer: copyright line" },
      { key: "footer.staffLogin", label: "Footer: staff login link" },
      { key: "whatsapp.message", label: "Message pre-filled when parents tap WhatsApp", long: true },
    ],
  },
];

/** Pages in the order they appear in the admin "Which page?" picker. */
// eslint-disable-next-line react-refresh/only-export-components
export const EDITABLE_PAGES = [...new Set(EDITABLE_TEXTS.map((g) => g.page))];

export type TextVars = Record<string, string | number>;

/** Fills {placeholders} such as {year} or {name}; unknown ones are left as typed. */
const fill = (text: string, vars?: TextVars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match)) : text;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: TKey, vars?: TextVars) => string };

const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k, vars) => fill(en[k], vars) });

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

  // Text saved by admins wins over the built-in dictionaries.
  const overrides = useSavedContent().data?.texts;
  const t = (key: TKey, vars?: TextVars) => fill(overrides?.[lang]?.[key]?.trim() || dictionaries[lang][key] || en[key], vars);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
