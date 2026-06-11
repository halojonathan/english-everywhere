"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

// Article Images
import businessEnglishImg from "@/app/images/business-english.png";
import englishAtHomeImg from "@/app/images/english-at-home.png";
import usingAAnImg from "@/app/images/using-a-an.png";

interface ArticleDetail {
  title: string;
  image: any;
  date: string;
  intro: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

const articlesDetailData: Record<string, ArticleDetail> = {
  "mastering-business-english": {
    title: "Mastering Business English: A Practical Guide for Global Success",
    image: businessEnglishImg,
    date: "2026-06-10",
    intro: "Di era globalisasi saat ini, bahasa Inggris bukan lagi sekadar nilai tambah, melainkan kebutuhan utama—khususnya dalam dunia profesional. Menguasai Business English membantu Anda berkomunikasi secara efektif dengan klien internasional, menulis email formal dengan percaya diri, dan memimpin presentasi dengan lancar.",
    sections: [
      {
        heading: "1. Fokus pada Kosakata Profesional (Professional Vocabulary)",
        body: "Hindari bahasa gaul (slang) dan mulailah menggunakan terminologi bisnis yang tepat. Misalnya, gunakan kata 'collaborate' daripada 'work together', atau 'schedule' daripada 'make a time' untuk memancarkan aura profesional.",
      },
      {
        heading: "2. Pelajari Struktur Email Bisnis yang Sopan dan Jelas",
        body: "Email adalah komunikasi bisnis yang paling sering digunakan. Pastikan subjek email ditulis dengan jelas, gunakan salam formal seperti 'Dear Mr. Smith', langsung sampaikan poin utama, dan akhiri dengan penutup yang sopan seperti 'Sincerely' atau 'Best regards'.",
      },
      {
        heading: "3. Latih Kemampuan Aktif Mendengarkan (Active Listening)",
        body: "Saat rapat dengan rekan kerja global, jangan hanya fokus pada apa yang ingin Anda katakan selanjutnya. Dengarkan baik-baik intonasi, istilah yang mereka gunakan, dan berikan konfirmasi seperti 'Just to clarify, you mean...' untuk menghindari kesalahpahaman.",
      },
      {
        heading: "4. Sederhanakan Komunikasi Anda",
        body: "Business English yang baik tidak harus rumit dengan kosakata yang sulit dimengerti. Lebih baik menggunakan kalimat yang pendek, jelas, dan langsung ke tujuan agar pesan Anda mudah dipahami oleh semua orang dari berbagai latar belakang budaya.",
      },
    ],
  },
  "5-tips-belajar-di-rumah": {
    title: "5 Tips Seru untuk Belajar Bahasa Inggris di Rumah",
    image: englishAtHomeImg,
    date: "2026-06-08",
    intro: "Belajar Bahasa Inggris tidak harus selalu membosankan dengan buku tebal atau hafalan grammar. Dengan sedikit kreativitas, Anda bisa mengubah rumah menjadi sekolah Bahasa Inggris pribadi yang menyenangkan.",
    sections: [
      {
        heading: "1. Ubah Media Hiburan Anda Menjadi Kelas Bahasa Inggris",
        body: "Alihkan kebiasaan menonton atau mendengarkan Anda sepenuhnya ke dalam Bahasa Inggris. Ini adalah cara paling efektif untuk melatih listening skill dan memperkaya kosakata secara kontekstual.",
      },
      {
        heading: "2. Labeli Benda-Benda di Rumah",
        body: "Tempelkan sticky note pada benda-benda di sekitar rumah dengan nama bahasa Inggrisnya. Misalnya 'Refrigerator', 'Mirror', 'Wardrobe'. Ini membantu mengingat vocabulary sehari-hari tanpa terasa sedang belajar.",
      },
      {
        heading: "3. Biasakan Self-Talk dalam Bahasa Inggris",
        body: "Cobalah untuk menarasikan kegiatan Anda sehari-hari dalam bahasa Inggris. 'I am making coffee now', 'I need to find my keys'. Ini melatih kelancaran berbicara dan berpikir dalam bahasa Inggris.",
      },
      {
        heading: "4. Buat Game Word Scavenger Hunt",
        body: "Sembunyikan benda-benda di sekitar rumah dan berikan petunjuk sederhana dalam bahasa Inggris kepada si kecil. Ini melatih kemampuan membaca, mendengarkan, serta pemahaman instruksi.",
      },
      {
        heading: "5. Praktikkan Roleplay Sederhana bersama Keluarga",
        body: "Gunakan skenario kehidupan sehari-hari untuk bermain peran dalam Bahasa Inggris, misalnya memesan makanan di kafe atau menjadi kasir swalayan. Ini meningkatkan rasa percaya diri anak dalam berbicara.",
      },
    ],
  },
  "kapan-menggunakan-a-dan-an": {
    title: "Kapan Menggunakan 'A' dan 'An'?",
    image: usingAAnImg,
    date: "2026-06-05",
    intro: "Mengajarkan grammar dasar kepada anak-anak terkadang menantang. Salah satu materi paling dasar yang wajib dikuasai sejak dini adalah penggunaan Articles (kata sandang) 'A' dan 'An'. Meskipun terlihat sederhana, banyak yang masih sering salah menggunakannya.",
    sections: [
      {
        heading: "1. Aturan Dasar: Perhatikan Bunyi, Bukan Huruf!",
        body: "Kunci utama penggunaan 'A' dan 'An' bukan terletak pada huruf pertama kata tersebut, melainkan pada bunyi pengucapannya. Gunakan 'A' sebelum kata yang berbunyi konsonan (seperti b, c, d, f, g, dst), dan gunakan 'An' sebelum kata yang berbunyi vokal (a, i, u, e, o).",
      },
      {
        heading: "2. Contoh Kata dengan Bunyi Vokal (Menggunakan 'An')",
        body: "Misalnya 'an apple' (bunyi vokal 'a'), 'an egg' (bunyi vokal 'e'), atau 'an umbrella' (bunyi vokal 'u'). Perhatikan juga kata seperti 'an hour', meskipun diawali dengan huruf 'h', cara pengucapannya berbunyi vokal 'our', sehingga kita harus menggunakan 'an'.",
      },
      {
        heading: "3. Contoh Kata dengan Bunyi Konsonan (Menggunakan 'A')",
        body: "Misalnya 'a book' (bunyi konsonan 'b'), 'a car' (bunyi konsonan 'k'), atau 'a dog' (bunyi konsonan 'd'). Perhatikan juga kata seperti 'a university', meskipun diawali dengan huruf 'u', cara pengucapannya berbunyi konsonan 'yu-ni-ver-si-ti', sehingga kita menggunakan 'a'.",
      },
      {
        heading: "4. Latihan Seru untuk Si Kecil",
        body: "Ajak si kecil bermain dengan menunjuk benda-benda di rumah dan menanyakan apakah harus menggunakan 'A' atau 'An'. Berikan pujian setiap kali mereka menjawab dengan benar untuk membangun rasa percaya diri mereka!",
      },
    ],
  },
};

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const article = articlesDetailData[slug];

  if (!article) {
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
          </nav>

          {/* Login Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="bg-[#EF777E] hover:bg-[#eb5e67] text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 inline-block transform hover:-translate-y-0.5"
            >
              Login
            </Link>
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
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#EF777E] hover:bg-[#eb5e67] text-white font-semibold text-base py-3 rounded-full transition-colors block shadow-md shadow-red-200"
              >
                Login
              </Link>
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
          <div className="space-y-4 mb-8 text-center sm:text-left">
            <h1 className="font-satoshi text-2xl sm:text-3xl md:text-4xl font-black text-[#1E293B] leading-tight">
              {article.title}
            </h1>
            <p className="font-poppins text-xs text-slate-400">
              Published on {article.date}
            </p>
          </div>

          {/* Banner Image */}
          <div className="w-full h-[250px] sm:h-[400px] md:h-[450px] relative rounded-[24px] overflow-hidden bg-slate-100 shadow-md mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>

          {/* Article Body */}
          <article className="font-poppins text-sm sm:text-base text-slate-700 leading-relaxed space-y-6">
            <p className="font-medium text-slate-800">{article.intro}</p>
            
            {article.sections.map((sec, idx) => (
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
