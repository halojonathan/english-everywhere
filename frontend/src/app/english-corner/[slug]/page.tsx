"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

interface ArticleDetail {
  id: string;
  title: string;
  thumbnail: string | null;
  dateCreated: string;
  introParagraphs: string[];
  sections: { heading: string; body: string }[];
}

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/articles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.status === "success") {
          const a = json.data;
          setArticle({
            id: String(a.id),
            title: a.title,
            thumbnail: a.thumbnail || null,
            dateCreated: a.date_created || "",
            introParagraphs: Array.isArray(a.intro_paragraphs) ? a.intro_paragraphs : [],
            sections: Array.isArray(a.sections) ? a.sections : [],
          });
        } else {
          setArticle(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setArticle(null);
        setLoading(false);
      });
  }, [slug]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    setUserName(null);
    window.location.reload();
  };

  if (!loading && !article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative flex flex-col justify-between">
      {/* Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform hover:scale-[1.02]">
            <Image
              src={logoEev}
              alt="English Everywhere Logo"
              width={110}
              height={34}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Homepage
            </Link>
            <Link href="/#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              About Us
            </Link>
            <Link href="/#classes" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Daftar Kelas
            </Link>
            <Link href="/events" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Events
            </Link>
            <Link href="/english-corner" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              English Corner
            </Link>
            {userRole === "teacher" && (
              <Link href="/learning-materials" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Learning Materials
              </Link>
            )}
            {userRole === "student" && (
              <Link href="/payment" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Payment
              </Link>
            )}
          </nav>

          {/* Login/Logout Button (Desktop) */}
          <div className="hidden md:block">
            {userRole ? (
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-block transform hover:-translate-y-0.5 cursor-pointer"
              >
                Logout ({userName})
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-[#EF777E] hover:bg-[#eb5e67] text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 inline-block transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 shadow-inner">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              Homepage
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              About Us
            </Link>
            <Link
              href="/#classes"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              Daftar Kelas
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              Events
            </Link>
            <Link
              href="/english-corner"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-slate-900"
            >
              English Corner
            </Link>
            {userRole === "teacher" && (
              <Link
                href="/learning-materials"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
              >
                Learning Materials
              </Link>
            )}
            {userRole === "student" && (
              <Link
                href="/payment"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
              >
                Payment
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100">
              {userRole ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center bg-slate-700 hover:bg-slate-800 text-white font-semibold text-base py-3 rounded-full transition-colors block shadow-md cursor-pointer"
                >
                  Logout ({userName})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#EF777E] hover:bg-[#eb5e67] text-white font-semibold text-base py-3 rounded-full transition-colors block shadow-md shadow-red-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-white relative overflow-hidden py-10 md:py-16 px-6">
        
        {/* Left Hexagon Accent */}
        <div className="absolute top-1/2 left-[-40px] md:left-[-60px] w-24 h-24 sm:w-32 sm:h-32 opacity-30 pointer-events-none select-none z-10">
          <svg className="w-full h-full text-[#4AC9CD] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 100 100">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
          </svg>
        </div>

        {/* Right Hexagons Accent */}
        <div className="absolute top-1/3 right-4 md:right-12 w-14 h-32 opacity-35 pointer-events-none select-none z-10 flex flex-col items-center gap-1.5">
          <svg className="w-10 h-10 text-[#F7941D] fill-current" viewBox="0 0 100 100">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
          </svg>
          <svg className="w-10 h-10 text-[#F7941D] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 100 100">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
          </svg>
        </div>

        {/* Outer Container */}
        <div className="max-w-4xl mx-auto w-full relative z-20">
          
          {/* Back button */}
          <Link
            href="/english-corner"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 group font-poppins"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Articles
          </Link>

          {/* Article Header */}
          {loading ? (
            <div className="space-y-4 mb-8 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-xl w-3/4 mx-auto sm:mx-0" />
              <div className="h-4 bg-slate-100 rounded w-32" />
            </div>
          ) : (
            <div className="space-y-4 mb-8 text-center sm:text-left">
              <h1 className="font-satoshi text-2xl sm:text-3xl md:text-4xl font-black text-[#1E293B] leading-tight">
                {article!.title}
              </h1>
              {article!.dateCreated && (
                <p className="font-poppins text-xs text-slate-400">
                  Published on {article!.dateCreated}
                </p>
              )}
            </div>
          )}

          {/* Banner Image */}
          <div className="w-full h-[250px] sm:h-[400px] md:h-[450px] relative rounded-[24px] overflow-hidden bg-slate-100 shadow-md mb-8">
            {loading ? (
              <div className="w-full h-full bg-slate-100 animate-pulse" />
            ) : article?.thumbnail ? (
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#4AC9CD] to-indigo-500 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            )}
          </div>

          {/* Article Body */}
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
            </div>
          ) : (
            <article className="font-poppins text-sm sm:text-base text-slate-700 leading-relaxed space-y-6">
              {article!.introParagraphs.map((para, idx) => (
                <p key={idx} className="font-medium text-slate-800">{para}</p>
              ))}
              
              {article!.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2 pt-2">
                  <h2 className="font-satoshi text-lg sm:text-xl font-bold text-[#1E293B]">
                    {sec.heading}
                  </h2>
                  <p className="font-normal text-slate-600 pl-0 sm:pl-4">
                    {sec.body}
                  </p>
                </div>
              ))}
            </article>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white relative z-10 pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-satoshi text-2xl font-black text-[#4AC9CD]">
              English Everywhere
            </h4>
            <p className="font-poppins text-slate-800 font-bold text-base">
              Embrace Your Future With Us!
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-poppins text-xs text-slate-400 font-medium">
              <span>#EnglishCourses</span>
              <span>#KosakataInggris</span>
              <span>#SpeakingWithConfidence</span>
            </div>
          </div>

          {/* Column 2: Features */}
          <div className="space-y-4">
            <h4 className="font-satoshi text-base font-bold text-slate-800 tracking-wider uppercase">
              Features
            </h4>
            <ul className="space-y-2.5 font-poppins text-sm text-slate-500 font-medium">
              <li>
                <Link href="/" className="hover:text-[#4AC9CD] transition-colors">
                  Homepage
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#4AC9CD] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#classes" className="hover:text-[#4AC9CD] transition-colors">
                  Daftar Kelas
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#4AC9CD] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/english-corner" className="hover:text-[#4AC9CD] transition-colors">
                  English Corner
                </Link>
              </li>
              {userRole === "teacher" && (
                <li>
                  <Link href="/learning-materials" className="hover:text-[#4AC9CD] transition-colors">
                    Learning Materials
                  </Link>
                </li>
              )}
              {userRole === "student" && (
                <li>
                  <Link href="/payment" className="hover:text-[#4AC9CD] transition-colors">
                    Payment
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-satoshi text-base font-bold text-slate-800 tracking-wider uppercase">
              Contact
            </h4>
            <div className="space-y-1 font-poppins text-sm text-slate-500">
              <p className="font-bold text-slate-700">Address:</p>
              <p className="leading-relaxed font-normal">
                Cendana Residence Blok H8 No 6,
                <br />
                South Tangerang 15416
              </p>
              <p className="leading-relaxed font-normal pt-2">
                Jl. Soka Indah no. 13 Dukuhwaluh,
                <br />
                Kembaran, Purwokerto 53182
              </p>
            </div>
            <div className="space-y-1 font-poppins text-sm text-slate-500 pt-2">
              <p className="font-bold text-slate-700">Phone number:</p>
              <p className="font-normal hover:text-[#4AC9CD] transition-colors">
                <a href="tel:+628997626888">+628997626888</a>
              </p>
            </div>
            <div className="space-y-2 font-poppins text-sm text-slate-500 pt-2">
              <p className="font-bold text-slate-700">Social Media:</p>
              <div className="flex items-center gap-3 text-slate-600">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4AC9CD] transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4AC9CD] transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="mailto:info@englisheverywhere.com" className="hover:text-[#4AC9CD] transition-colors" aria-label="Email">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
                <a href="tel:+628997626888" className="hover:text-[#4AC9CD] transition-colors" aria-label="Phone Call">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-100/80 text-center font-poppins text-xs text-slate-400">
          <p>© 2025 English Everywhere Ltd. All Rights Reserved.</p>
          <div className="mt-2">
            <Link href="/status" className="hover:text-slate-600 transition-colors">
              Database Connection Status
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.022-.079-.116-.16-.196-.214-1.229-.838-2.145-1.127-2.615-.815-.47.311-.884.774-1.233.725-.333-.047-.723-.231-1.309-.487-1.428-.621-2.457-1.687-2.92-2.316-.328-.445-.246-.669-.039-.938.207-.269.832-1.04 1.115-1.385.285-.345.244-.577.062-.843-.18-.266-.867-2.127-1.192-2.735-.316-.591-.703-.521-.994-.521-.215 0-.462-.02-.705-.02-.744 0-1.295.274-1.666.678-.506.551-1.744 1.702-1.744 4.153s1.782 4.821 2.029 5.15c.247.33 3.51 5.358 8.497 7.51 1.186.512 2.112.818 2.834 1.047 1.196.38 2.284.327 3.145.198.96-.144 2.955-1.208 3.367-2.378.412-1.17.412-2.171.29-2.379zM12.012 2.07c-5.477 0-9.934 4.457-9.934 9.934 0 2.006.593 3.875 1.625 5.434l-1.727 6.302 6.45-1.69a9.882 9.882 0 0 0 5.176 1.458c5.477 0 9.934-4.457 9.934-9.934 0-5.477-4.457-9.934-9.934-9.934zm0 17.986c-1.92 0-3.7-.514-5.234-1.404l-.375-.223-3.889 1.02 1.037-3.785-.244-.389A8.04 8.04 0 0 1 3.992 12c0-4.462 3.63-8.093 8.093-8.093s8.093 3.63 8.093 8.093-3.63 8.093-8.093 8.093z" />
        </svg>
        <span className="absolute right-16 bg-[#0F172A] text-white text-xs font-semibold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-md">
          Chat via WhatsApp
        </span>
      </a>
    </div>
  );
}
