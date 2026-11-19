import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/lib/i18n";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Every page except Home is loaded on demand, so phones on slow data download only the page they open.
const pages = {
  about: () => import("./pages/About"),
  academics: () => import("./pages/Academics"),
  admissions: () => import("./pages/Admissions"),
  fees: () => import("./pages/Fees"),
  events: () => import("./pages/Events"),
  gallery: () => import("./pages/Gallery"),
  contact: () => import("./pages/Contact"),
  disclosure: () => import("./pages/Disclosure"),
  custom: () => import("./pages/CustomPage"),
};
const About = lazy(pages.about);
const Academics = lazy(pages.academics);
const Admissions = lazy(pages.admissions);
const Fees = lazy(pages.fees);
const Events = lazy(pages.events);
const Gallery = lazy(pages.gallery);
const Contact = lazy(pages.contact);
const Disclosure = lazy(pages.disclosure);
const CustomPage = lazy(pages.custom);
const Admin = lazy(() => import("./pages/Admin"));

// Once the first page has fully loaded and the phone is idle, fetch the other public pages in the
// background so tapping a menu link still opens instantly. Skipped when the visitor turned on
// Data Saver. (The admin panel is never prefetched.)
if (typeof window !== "undefined") {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (!saveData) {
    window.addEventListener("load", () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
      idle(() => Object.values(pages).forEach((load) => load().catch(() => {})));
    });
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mandatory-disclosure" element={<Disclosure />} />
            {/* Pages staff make in Admin > Pages */}
            <Route path="/p/:slug" element={<CustomPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
