/**
 * ONE PLACE TO EDIT SCHOOL INFORMATION
 * ------------------------------------
 * Almost all school-specific content on the website comes from this file.
 *
 * Anything marked `isSample: true` is placeholder content written as an example.
 * Sample items are shown (with a yellow "Sample" tag) while you run `npm run dev`,
 * but they are HIDDEN automatically in the production build (`npm run build`),
 * so made-up data never goes live. Replace them with real data and delete
 * `isSample: true` to make them appear on the live site.
 */

export const SCHOOL = {
  name: "Brilliant Oriental Senior Secondary School",
  nameHi: "ब्रिलियंट ओरिएंटल सीनियर सेकेंडरी स्कूल",
  shortName: "BOSSS",
  board: "CBSE",
  affiliationNo: "2134844",
  founded: 2006,
  phoneDisplay: "+91 95653 13000",
  phone: "+919565313000",
  // Number used for the WhatsApp button (country code + number, digits only)
  whatsapp: "919565313000",
  email: "info@bosfatehpur.in",
  addressLines: ["Pakka Talab", "Fatehpur, Uttar Pradesh 212601", "India"],
  addressShort: "Pakka Talab, Fatehpur, UP",
  mapQuery: "Brilliant Oriental School, Pakka Talab, Fatehpur, Uttar Pradesh",
  logoUrl: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757606989/school-logo_bbjw4m.jpg",
  officeHours: ["Monday to Saturday: 8:00 AM – 2:00 PM", "Sunday: Closed"],
  social: {
    facebook: "https://www.facebook.com/bosfatehpur/",
    youtube: "https://www.youtube.com/@Brilliant_Oriental_School",
    instagram: "https://www.instagram.com/bos_officialaccount",
  },
  chairman: {
    name: "Mr. Wasif Husain",
    // TODO: upload this photo to Cloudinary and replace the URL (it currently loads from the old WordPress site)
    photo: "https://bosfatehpur.in/wp-content/uploads/2024/06/sq1.png",
  },
};

export type Sampleable = { isSample?: boolean };

/** Hides sample items in production builds, keeps them in dev so you can see the layout. */
export const visible = <T extends Sampleable>(items: T[]): T[] =>
  import.meta.env.DEV ? items : items.filter((item) => !item.isSample);

export const yearsRunning = () => new Date().getFullYear() - SCHOOL.founded;

// ---------- Home page stats ----------
export const stats: (Sampleable & { value: number; suffix?: string; labelKey: string })[] = [
  { value: yearsRunning(), suffix: "+", labelKey: "stats.years" },
  { value: 1000, suffix: "+", labelKey: "stats.students", isSample: true }, // TODO: real student count
  { value: 50, suffix: "+", labelKey: "stats.teachers", isSample: true }, // TODO: real teacher count
  { value: 100, suffix: "%", labelKey: "stats.result", isSample: true }, // TODO: latest board pass %
];

// ---------- Board toppers ----------
export const toppers: (Sampleable & {
  name: string;
  className: string;
  year: string;
  percentage: string;
  photo?: string;
})[] = [
  // TODO: add real toppers. photo can be a Cloudinary URL.
  { name: "Student Name", className: "Class XII (Science)", year: "2026", percentage: "95.0%", isSample: true },
  { name: "Student Name", className: "Class XII (Commerce)", year: "2026", percentage: "93.4%", isSample: true },
  { name: "Student Name", className: "Class X", year: "2026", percentage: "96.2%", isSample: true },
];

// ---------- Parent / alumni testimonials ----------
export const testimonials: (Sampleable & { quote: string; name: string; role: string })[] = [
  // TODO: replace with real quotes, with the person's permission.
  {
    quote: "The teachers know every child by name and keep us informed about our daughter's progress.",
    name: "Parent name",
    role: "Parent, Class VI",
    isSample: true,
  },
  {
    quote: "Good discipline, regular tests and caring staff. My son's confidence has grown a lot.",
    name: "Parent name",
    role: "Parent, Class IX",
    isSample: true,
  },
  {
    quote: "The school prepared me well for my board exams and for college.",
    name: "Alumni name",
    role: "Alumnus, Batch of 2024",
    isSample: true,
  },
];

// ---------- Academics ----------
export const stages = [
  {
    level: "Pre-Primary",
    classes: "Nursery, LKG, UKG",
    description: "Activity-based learning that builds language, numbers, and good habits.",
    subjects: ["English", "Hindi", "Numbers", "Environmental awareness", "Art & craft", "Rhymes & stories"],
  },
  {
    level: "Primary",
    classes: "Class I – V",
    description: "Strong foundations in reading, writing, and mathematics as per the CBSE / NCERT curriculum.",
    subjects: ["English", "Hindi", "Mathematics", "EVS", "Urdu / Sanskrit", "Computer", "Art", "Physical Education"],
  },
  {
    level: "Middle",
    classes: "Class VI – VIII",
    description: "Subject-wise teaching with practical work, projects, and regular assessments.",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Urdu / Sanskrit", "Computer"],
  },
  {
    level: "Secondary",
    classes: "Class IX – X",
    description: "Focused preparation for the CBSE Class X board examination.",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Information Technology"],
  },
  {
    level: "Senior Secondary",
    classes: "Class XI – XII",
    description: "Stream-based study preparing students for the CBSE Class XII board and higher education.",
    subjects: ["See streams below"],
  },
];

// TODO: confirm which streams and subject combinations the school actually offers.
export const streams = [
  { name: "Science (PCM)", subjects: ["Physics", "Chemistry", "Mathematics", "English", "Optional: Computer Science / Physical Education"] },
  { name: "Science (PCB)", subjects: ["Physics", "Chemistry", "Biology", "English", "Optional: Mathematics / Physical Education"] },
  { name: "Commerce", subjects: ["Accountancy", "Business Studies", "Economics", "English", "Optional: Mathematics / Informatics Practices"] },
  { name: "Humanities", subjects: ["History", "Political Science", "Geography / Economics", "English", "Optional: Hindi / Urdu"] },
];

export const sessionCalendar = [
  { term: "New session begins", period: "April" },
  { term: "Summer vacation", period: "Mid-May to June" },
  { term: "Half-yearly examinations", period: "September – October" },
  { term: "Winter break", period: "Late December – early January" },
  { term: "Pre-board examinations (X & XII)", period: "December – January" },
  { term: "Annual / CBSE board examinations", period: "February – March" },
];

// ---------- Admissions ----------
export const classOptions = [
  "Nursery", "LKG", "UKG",
  "Class I", "Class II", "Class III", "Class IV", "Class V",
  "Class VI", "Class VII", "Class VIII", "Class IX",
  "Class XI (Science)", "Class XI (Commerce)", "Class XI (Humanities)",
];

export const admissionSteps = [
  { title: "Send an enquiry", description: "Fill in the enquiry form on this page, call, or WhatsApp the school office." },
  { title: "Collect & submit the form", description: "Collect the admission form from the school office and submit it with the documents listed below." },
  { title: "Interaction / entrance test", description: "Classes I and above take a short test in English, Hindi and Mathematics. Nursery to UKG have a simple interaction." },
  { title: "Fee deposit & confirmation", description: "Once selected, deposit the admission fee at the office to confirm the seat." },
];

export const admissionDocuments = [
  "Birth certificate (for Nursery to Class I)",
  "Aadhaar card of the student and parents",
  "Transfer Certificate (TC) from the previous school (Class II onwards)",
  "Report card / marksheet of the last class passed",
  "Class X marksheet (for admission to Class XI)",
  "4 recent passport-size photographs",
  "Address proof",
];

export const ageCriteria = [
  { className: "Nursery", age: "3+ years as on 31st March" },
  { className: "LKG", age: "4+ years as on 31st March" },
  { className: "UKG", age: "5+ years as on 31st March" },
  { className: "Class I", age: "6+ years as on 31st March" },
];

// ---------- Fees & transport ----------
// TODO: replace with the school's real fee structure.
export const fees: (Sampleable & { group: string; admission: string; monthly: string; annual: string })[] = [
  { group: "Nursery – UKG", admission: "₹0,000", monthly: "₹0,000", annual: "₹0,000", isSample: true },
  { group: "Class I – V", admission: "₹0,000", monthly: "₹0,000", annual: "₹0,000", isSample: true },
  { group: "Class VI – VIII", admission: "₹0,000", monthly: "₹0,000", annual: "₹0,000", isSample: true },
  { group: "Class IX – X", admission: "₹0,000", monthly: "₹0,000", annual: "₹0,000", isSample: true },
  { group: "Class XI – XII", admission: "₹0,000", monthly: "₹0,000", annual: "₹0,000", isSample: true },
];

// TODO: replace with real bus routes.
export const transportRoutes: (Sampleable & { route: string; stops: string[]; monthlyFee: string })[] = [
  { route: "Route 1", stops: ["Stop A", "Stop B", "Stop C"], monthlyFee: "₹000", isSample: true },
  { route: "Route 2", stops: ["Stop D", "Stop E", "Stop F"], monthlyFee: "₹000", isSample: true },
];

// ---------- Staff ----------
export const staff: (Sampleable & { name: string; position: string; qualification?: string })[] = [
  { name: SCHOOL.chairman.name, position: "Chairman" },
  // TODO: add the real principal and staff.
  { name: "Principal's name", position: "Principal", qualification: "M.A., B.Ed.", isSample: true },
  { name: "Teacher's name", position: "PGT – Physics", qualification: "M.Sc., B.Ed.", isSample: true },
];

// ---------- Events ----------
export const events: (Sampleable & { title: string; date: string; description: string; category: string })[] = [
  // TODO: replace with the real school calendar.
  { title: "Annual Sports Meet", date: "December 2026", description: "Track and field events and house competitions.", category: "Sports", isSample: true },
  { title: "Science Exhibition", date: "November 2026", description: "Students present working models and projects.", category: "Academic", isSample: true },
  { title: "Parent–Teacher Meeting", date: "After half-yearly exams", description: "Discuss each student's progress with class teachers.", category: "Academic", isSample: true },
];

// ---------- Gallery ----------
export const galleryImages = [
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757605559/BOS17_rjngmh.jpg", alt: "School building", category: "campus" },
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS9_dosdt0.jpg", alt: "Classroom session", category: "academics" },
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604936/BOS10_fqknaj.jpg", alt: "Sports day", category: "events" },
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS5_plhby7.jpg", alt: "Science lab", category: "facilities" },
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604937/BOS16_i4dhvh.jpg", alt: "Annual function", category: "events" },
  { src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757606202/BOS18_eprioe_flgobs.jpg", alt: "Library", category: "facilities" },
];

// Paste YouTube video IDs here (the part after "watch?v=") to embed them in the gallery.
export const youtubeVideoIds: string[] = [];

// ---------- CBSE Mandatory Public Disclosure (Appendix IX, Affiliation Bye-Laws 2018) ----------
// The row names follow CBSE's format. Values start empty: the office fills them in the admin panel
// (Website content > CBSE disclosure). Empty values show as "—" on the website.
const row = (label: string, value = "") => ({ label, value });
const doc = (title: string) => ({ title, url: "" });

export const disclosureGeneral = [
  row("Name of the school", SCHOOL.name),
  row("Affiliation No.", SCHOOL.affiliationNo),
  row("School code"),
  row("Complete address with pin code", SCHOOL.addressLines.join(", ")),
  row("Principal name"),
  row("Principal qualification"),
  row("School email ID", SCHOOL.email),
  row("Contact details (landline / mobile)", SCHOOL.phoneDisplay),
];

export const disclosureDocuments = [
  doc("Copies of affiliation / upgradation letter and recent extension of affiliation, if any"),
  doc("Copies of societies / trust / company registration / renewal certificate, as applicable"),
  doc("Copy of No Objection Certificate (NOC) issued, if applicable, by the State Govt. / UT"),
  doc("Copies of recognition certificate under RTE Act, 2009, and its renewal if applicable"),
  doc("Copy of valid building safety certificate as per the National Building Code"),
  doc("Copy of valid fire safety certificate issued by the competent authority"),
  doc("Copy of the DEO certificate submitted by the school for affiliation / upgradation / extension of affiliation, or self certification by school"),
  doc("Copies of valid water, health and sanitation certificates"),
];

export const disclosureAcademics = [
  doc("Fee structure of the school"),
  doc("Annual academic calendar"),
  doc("List of School Management Committee (SMC)"),
  doc("List of Parents Teachers Association (PTA) members"),
  doc("Last three-year result of the board examination as per applicability"),
];

export const disclosureStaff = [
  row("Principal"),
  row("Total no. of teachers"),
  row("PGT"),
  row("TGT"),
  row("PRT"),
  row("Teachers section ratio"),
  row("Details of special educator"),
  row("Details of counsellor and wellness teacher"),
];

export const disclosureInfrastructure = [
  row("Total campus area of the school (in square metres)"),
  row("No. and size of the classrooms (in square metres)"),
  row("No. and size of laboratories including computer labs (in square metres)"),
  row("Internet facility (Y / N)"),
  row("No. of girls' toilets"),
  row("No. of boys' toilets"),
  row("Link of YouTube video of the inspection of school covering the infrastructure of the school"),
];
