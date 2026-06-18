"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

interface ArticleItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  dateCreated: string;
}

export default function EnglishCornerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/articles")
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.status === "success") {
          const mapped = json.data.map((a: any) => ({
            id: String(a.id),
            title: a.title,
            description: a.description,
            thumbnail: a.thumbnail || null,
            dateCreated: a.date_created || "",
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    setUserName(null);
    window.location.reload();
  };

  // Filter Articles
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Main English Corner Area */}
      <main className="flex-1 w-full bg-white relative overflow-hidden py-16 md:py-20 px-6">
        
        {/* Decorative Playful Star (Left) */}
        <div className="absolute top-16 left-6 md:left-12 lg:left-24 w-12 h-12 md:w-16 md:h-16 pointer-events-none select-none z-10 animate-float-sun">
          <svg viewBox="0 0 24 24" className="w-full h-full text-[#4AC9CD]/70 fill-current">
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.4 8.168L12 18.896l-7.334 3.856 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        </div>

        {/* Decorative Playful Star (Right) */}
        <div className="absolute top-16 right-6 md:right-12 lg:right-24 w-12 h-12 md:w-16 md:h-16 pointer-events-none select-none z-10 animate-float-twirl">
          <svg viewBox="0 0 24 24" className="w-full h-full text-[#EF777E]/80 fill-current">
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.4 8.168L12 18.896l-7.334 3.856 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        </div>

        {/* Outer Container */}
        <div className="max-w-7xl mx-auto w-full relative z-20">
          
          {/* Header Row */}
          <div className="text-center max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h1 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1E293B] uppercase">
              ENGLISH CORNER
            </h1>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search article"
                className="w-full px-6 py-3.5 pl-12 rounded-full border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150 transition-all font-poppins text-sm bg-white"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Grid View */}
          <div className="mt-16">
            {filteredArticles.length === 0 ? (
              <p className="text-slate-400 font-poppins text-sm pt-2 italic text-center">
                {articles.length === 0 ? "Memuat artikel..." : "Tidak ada artikel yang cocok dengan pencarian Anda."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {filteredArticles.map((article) => (
                  <Link
                    href={`/english-corner/${article.id}`}
                    key={article.id}
                    className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="w-full h-[220px] relative bg-slate-100 flex-shrink-0 overflow-hidden">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#4AC9CD] to-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <svg className="w-14 h-14 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-satoshi text-base lg:text-lg font-bold text-[#1E293B] leading-snug group-hover:text-indigo-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="font-poppins text-xs lg:text-sm text-slate-500 font-normal leading-relaxed line-clamp-3">
                          {article.description}
                        </p>
                      </div>
                      {article.dateCreated && (
                        <p className="font-poppins text-[10px] text-slate-400">{article.dateCreated}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
