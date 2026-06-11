"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// Import local images
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";
import sunImg from "@/app/images/sun.png";
import twirlImg from "@/app/images/twirl.png";
import leftKid from "@/app/images/left-kid.png";
import rightKid from "@/app/images/right-kid.png";
import hexaImg from "@/app/images/hexa-1.png";
import starImg from "@/app/images/star-1.png";
import star2Img from "@/app/images/star-2.png";
import twirl2Img from "@/app/images/twirl-2.png";
import leoImg from "@/app/images/leo.png";
import kinImg from "@/app/images/kin.png";
import diraImg from "@/app/images/dira.png";

// Program card images
import funnyPhonicsImg from "@/app/images/funny-phonics.png";
import hiKidsImg from "@/app/images/hi-kids.png";
import oxfordPhonicsImg from "@/app/images/oxford-phonics.png";
import abracadabraImg from "@/app/images/abracadabra.png";
import getSmartImg from "@/app/images/get-smart.png";
import fullBlastImg from "@/app/images/full-blast.png";
import intensiveSpeakingImg from "@/app/images/intensive-speaking.png";
import academicWritingImg from "@/app/images/academic-writing.png";
import toeflPrepImg from "@/app/images/toefl-prep.png";
import privateClassImg from "@/app/images/private-class.png";
import holidayCampImg from "@/app/images/holiday-camp.png";

interface Program {
  title: string;
  info: string;
  desc: string;
  image: StaticImageData;
  badge?: string;
}

const programsData: Record<"regular" | "intensive" | "others", Program[]> = {
  regular: [
    {
      title: "Funny Phonics",
      info: "40xLevel | 2.300.000",
      desc: "Belajar membaca & mengeja seru dengan metode Phonics.",
      image: funnyPhonicsImg,
    },
    {
      title: "Hi Kids!",
      info: "40xLevel | 2.300.000",
      desc: "Kelas dasar untuk anak. Fokus pada Bahasa Inggris sehari-hari.",
      image: hiKidsImg,
    },
    {
      title: "Oxford Phonics",
      info: "40xLevel | 2.300.000",
      desc: "Metode Phonics dari Oxford untuk membaca & menulis handal.",
      image: oxfordPhonicsImg,
    },
    {
      title: "Abracadabra",
      info: "40xLevel | 2.300.000",
      desc: "Program seru untuk kosakata dasar & percakapan anak.",
      image: abracadabraImg,
    },
    {
      title: "Get Smart",
      info: "40xLevel | 2.300.000",
      desc: "Kurikulum dinamis, tingkatkan 4 kemampuan dasar bahasa.",
      image: getSmartImg,
      badge: "9-15 Tahun",
    },
    {
      title: "Full Blast",
      info: "60xLevel | 3.600.000",
      desc: "Program lengkap untuk siswa. Kuasai English level menengah.",
      image: fullBlastImg,
    },
  ],
  intensive: [
    {
      title: "Intensive Speaking",
      info: "20xLevel | 1.800.000",
      desc: "Fokus penuh pada kelancaran berbicara dan pengucapan (pronunciation).",
      image: intensiveSpeakingImg,
    },
    {
      title: "Academic Writing",
      info: "20xLevel | 2.000.000",
      desc: "Kuasai penulisan esai, laporan, dan tata bahasa akademis secara intensif.",
      image: academicWritingImg,
    },
    {
      title: "TOEFL/IELTS Prep",
      info: "30xLevel | 3.200.000",
      desc: "Kelas persiapan intensif untuk meraih skor maksimal dalam ujian IELTS/TOEFL.",
      image: toeflPrepImg,
    },
  ],
  others: [
    {
      title: "Private Class",
      info: "Custom Level | Bespoke",
      desc: "Kelas privat 1-on-1 dengan jadwal dan kurikulum yang disesuaikan kebutuhan.",
      image: privateClassImg,
    },
    {
      title: "Holiday Camp",
      info: "10xLevel | 1.200.000",
      desc: "Program belajar sambil bermain yang seru selama liburan sekolah.",
      image: holidayCampImg,
    },
  ],
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqDataLeft: FAQItem[] = [
  {
    id: "faq-l1",
    question: "Apa saja program khusus yang ditawarkan di English Everywhere?",
    answer: "Kami menawarkan berbagai program mulai dari Phonics untuk pemula, English for Kids, adults, professionals, hingga persiapan tes internasional.",
  },
  {
    id: "faq-l2",
    question: "Bagaimana cara mendaftar kursus di English Everywhere?",
    answer: "Anda bisa mendaftar melalui website ini dengan mengklik tombol \"Daftar Kelas\" atau menghubungi admin kami via WhatsApp.",
  },
  {
    id: "faq-l3",
    question: "Apakah saya akan mendapatkan sertifikat setelah menyelesaikan kursus?",
    answer: "Tentu saja! Setiap siswa yang menyelesaikan level tertentu akan mendapatkan sertifikat resmi dari English Everywhere.",
  },
  {
    id: "faq-l4",
    question: "Apa yang membedakan English Everywhere dari kursus bahasa Inggris lainnya?",
    answer: "Kami fokus pada metode pembelajaran yang interaktif, menyenangkan, dan berpusat pada praktik berbicara (speaking).",
  },
  {
    id: "faq-l5",
    question: "Berapa jumlah siswa dalam satu kelas?",
    answer: "Untuk menjaga kualitas pembelajaran, kami membatasi jumlah siswa maksimal 8-10 orang per kelas.",
  },
  {
    id: "faq-l6",
    question: "Siapa yang bisa saya hubungi jika saya memiliki pertanyaan lebih lanjut?",
    answer: "Anda bisa menghubungi tim customer service kami melalui WhatsApp atau email yang tertera di website.",
  },
];

const faqDataRight: FAQItem[] = [
  {
    id: "faq-r1",
    question: "Bagaimana saya tahu level bahasa Inggris saya yang tepat untuk memulai?",
    answer: "Kami menyediakan placement test gratis untuk menentukan level kemampuan bahasa Inggris Anda sebelum memulai kelas.",
  },
  {
    id: "faq-r2",
    question: "Apakah kelas diadakan secara online atau tatap muka (offline)?",
    answer: "Kami menyediakan kedua opsi tersebut. Anda bisa memilih kelas online via Zoom atau kelas offline di center kami, dan home visit.",
  },
  {
    id: "faq-r3",
    question: "Siapa saja yang bisa mengikuti kursus ini? Apakah ada batasan usia?",
    answer: "Kursus kami terbuka untuk semua usia, mulai dari anak-anak (usia 2,5 tahun) hingga usia dewasa.",
  },
  {
    id: "faq-r4",
    question: "Apakah ada kelas percobaan (trial class) gratis sebelum mendaftar?",
    answer: "Ya, kami menyediakan 1x free trial class agar Anda bisa merasakan pengalaman belajar bersama kami.",
  },
  {
    id: "faq-r5",
    question: "Media pembelajaran apa saja yang akan saya dapatkan?",
    answer: "Anda akan mendapatkan modul pembelajaran, interactive whiteboard, dan materi tambahan berupa video/audio.",
  },
];

interface TestimonialItem {
  heading: string;
  body: string;
  stars: number;
  author: string;
}

const testimonialsData: TestimonialItem[] = [
  {
    heading: "Percaya Diri Bahasa Inggris Yang Tumbuh Pesat.",
    body: "Dulu anak saya malu-malu kalau disuruh bicara bahasa Inggris, takut salah. Setelah ikut English Everywhere, dia jadi berani banget! Sekarang dia sering tiba-tiba menyanyi lagu bahasa Inggris. Metode belajarnya seru, jadi dia tidak merasa tertekan.",
    stars: 5,
    author: "Ibu Dita",
  },
  {
    heading: "Belajar Bahasa Inggris Jadi Sangat Menyenangkan!",
    body: "Anak saya selalu bersemangat setiap kali jadwal kelas tiba. Tutornya ramah dan sabar, serta pembawaan belajarnya sangat seru melalui game dan aktivitas interaktif. Kemampuan speaking-nya meningkat pesat!",
    stars: 5,
    author: "Bapak Budi",
  },
  {
    heading: "Persiapan Ujian Terbaik dan Terpercaya.",
    body: "Saya mengambil program TOEFL prep di English Everywhere. Materinya terstruktur, tips-tips ujiannya sangat praktis, dan tutornya sangat kompeten. Skor TOEFL saya naik lebih dari 100 poin!",
    stars: 5,
    author: "Kak Sarah",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"regular" | "intensive" | "others">("regular");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    setUserName(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative flex flex-col justify-between">
      {/* Dynamic Floating Keyframe Animations */}
      <style jsx global>{`
        @keyframes float-sun {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes float-twirl {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        .animate-float-sun {
          animation: float-sun 6s ease-in-out infinite;
        }
        .animate-float-twirl {
          animation: float-twirl 5s ease-in-out infinite;
        }
      `}</style>

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
            <Link href="/" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              Homepage
            </Link>
            <Link href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              About Us
            </Link>
            <Link href="#classes" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Daftar Kelas
            </Link>
            <Link href="/events" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Events
            </Link>
            <Link href="/english-corner" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
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
              className="block py-2 text-base font-bold text-slate-900"
            >
              Homepage
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              About Us
            </Link>
            <Link
              href="#classes"
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
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
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

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center relative py-12 md:py-20 lg:py-24 px-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-80px-70px)]">
        {/* Decorative Sun (Floating Top-Left) */}
        <div className="absolute top-8 left-6 md:top-12 md:left-16 lg:top-16 lg:left-32 w-16 h-16 md:w-28 md:h-28 lg:w-36 lg:h-36 animate-float-sun pointer-events-none select-none z-10">
          <Image
            src={sunImg}
            alt="Sun Illustration"
            fill
            sizes="(max-width: 768px) 64px, (max-width: 1200px) 112px, 144px"
            className="object-contain"
            priority
          />
        </div>

        {/* Decorative Twirl/Arrow (Floating Top-Right) */}
        <div className="absolute top-10 right-6 md:top-14 md:right-16 lg:top-20 lg:right-32 w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 animate-float-twirl pointer-events-none select-none z-10">
          <Image
            src={twirlImg}
            alt="Twirl Illustration"
            fill
            sizes="(max-width: 768px) 48px, (max-width: 1200px) 80px, 96px"
            className="object-contain"
            priority
          />
        </div>

        {/* Center Container: Text Content */}
        <div className="text-center max-w-2xl mx-auto space-y-6 md:space-y-8 z-20 px-4 mt-6 md:mt-0">
          <h1 className="font-satoshi text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.1] text-[#111111]">
            EMBRACE YOUR
            <br />
            FUTURE WITH US
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-[19px] leading-relaxed max-w-xl mx-auto">
            Our fun and interactive courses are designed for kids to learn English confidently, anytime and anywhere.
          </p>

          <div className="pt-2">
            <Link
              href="#grow"
              className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold text-base md:text-lg px-8 py-3.5 sm:px-10 sm:py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-150 hover:shadow-xl hover:shadow-cyan-250 inline-block transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Grow With Us
            </Link>
          </div>
        </div>

        {/* Graphics: Left Kid & Right Kid */}
        {/* On Large Screens: Absolute aligned bottom-left/right */}
        {/* On Mobile Screens: Grid stack at the bottom */}
        <div className="w-full mt-12 lg:mt-0 flex flex-col sm:flex-row items-center justify-center lg:block select-none pointer-events-none">
          {/* Left Kid (Raising Hand) */}
          <div className="w-[280px] h-[220px] sm:w-[360px] sm:h-[280px] md:w-[420px] md:h-[330px] lg:w-[500px] lg:h-[390px] xl:w-[560px] xl:h-[440px] lg:absolute lg:bottom-0 lg:left-0 z-10 relative">
            <Image
              src={leftKid}
              alt="Left Kid Sitting at Desk"
              fill
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, (max-width: 1280px) 500px, 560px"
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* Right Kid (Writing/Studying) */}
          <div className="w-[280px] h-[220px] sm:w-[360px] sm:h-[280px] md:w-[420px] md:h-[330px] lg:w-[500px] lg:h-[390px] xl:w-[560px] xl:h-[440px] lg:absolute lg:bottom-0 lg:right-0 z-10 relative mt-6 sm:mt-0">
            <Image
              src={rightKid}
              alt="Right Kid Sitting at Desk"
              fill
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, (max-width: 1280px) 500px, 560px"
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative py-20 md:py-28 lg:py-36 px-6 max-w-7xl mx-auto w-full overflow-hidden bg-white">
        {/* Hexagons Illustration (Top Right) */}
        <div className="absolute -top-8 -right-8 w-32 h-24 sm:w-48 sm:h-36 md:w-60 md:h-44 lg:w-72 lg:h-52 pointer-events-none select-none z-10 transition-transform duration-500 hover:scale-105">
          <Image
            src={hexaImg}
            alt="Hexagon Illustration"
            fill
            className="object-contain object-right-top"
            priority
          />
        </div>

        {/* Star Illustration (Bottom Left) */}
        <div className="absolute bottom-6 left-6 w-14 h-14 md:w-20 md:h-20 pointer-events-none select-none z-10 animate-float-sun">
          <Image
            src={starImg}
            alt="Star Illustration"
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="max-w-4xl relative z-20 space-y-6 md:space-y-8 pl-0 md:pl-8 pr-4 sm:pr-8 md:pr-12">
          <div className="space-y-3 md:space-y-4">
            <h2 className="font-satoshi text-base sm:text-lg md:text-xl font-bold tracking-wider text-[#FF9E1B] uppercase">
              ABOUT US
            </h2>
            <h3 className="font-satoshi text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[#111111] leading-[1.15]">
              LET’S SPEAK ENGLISH EVERYWHERE!
            </h3>
            <p className="text-[#111111] text-base md:text-lg lg:text-[20px] font-medium leading-relaxed">
              Karena dunia dimulai dari keberanian untuk berbicara
            </p>
          </div>

          <p className="text-slate-600 text-sm sm:text-base md:text-md lg:text-[17px] leading-[1.8] font-poppins text-justify sm:text-left font-normal">
            Di English Everywhere, Kami meyakini bahwa penguasaan bahasa Inggris membuka akses menuju dunia yang lebih luas. Melalui teknologi terkini dan metode pembelajaran yang komunikatif, Kami menciptakan pengalaman belajar yang hidup, relevan, dan membangkitkan antusiasme. Setiap peserta dibimbing untuk berani mengekspresikan diri, baik dalam percakapan santai maupun konteks profesional. Lebih dari sekadar mengajarkan bahasa, Kami menanamkan kepercayaan diri, menumbuhkan potensi, dan menyiapkan generasi yang siap bersaing secara global.
          </p>
        </div>
      </section>

      {/* Our Programs Section */}
      <section id="classes" className="w-full bg-[#F7941D] relative overflow-hidden py-20 md:py-28 px-6 flex flex-col justify-center items-center">
        {/* Floating Stars Illustration (Top Left) */}
        <div className="absolute top-10 left-6 sm:top-14 sm:left-12 md:top-20 md:left-20 lg:top-24 lg:left-32 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 pointer-events-none select-none z-10 animate-float-sun">
          <Image
            src={star2Img}
            alt="Stars Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Floating Spiral/Twirl Illustration (Bottom Right) */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 pointer-events-none select-none z-10 transition-transform duration-500 hover:scale-105">
          <Image
            src={twirl2Img}
            alt="Twirl Illustration"
            fill
            className="object-contain object-right-bottom"
            priority
          />
        </div>

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto w-full relative z-20">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 sm:mb-16">
            <h2 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              OUR PROGRAMS
            </h2>

            {/* Capsule Tabs */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                onClick={() => setActiveTab("regular")}
                className={`font-satoshi text-xs sm:text-sm font-bold tracking-wider px-6 py-2.5 rounded-full border border-white transition-all duration-300 cursor-pointer shadow-md ${
                  activeTab === "regular"
                    ? "bg-white text-[#F7941D]"
                    : "bg-transparent text-white border-white/80 hover:border-white hover:bg-white/10"
                }`}
              >
                REGULAR
              </button>
              <button
                onClick={() => setActiveTab("intensive")}
                className={`font-satoshi text-xs sm:text-sm font-bold tracking-wider px-6 py-2.5 rounded-full border border-white transition-all duration-300 cursor-pointer shadow-md ${
                  activeTab === "intensive"
                    ? "bg-white text-[#F7941D]"
                    : "bg-transparent text-white border-white/80 hover:border-white hover:bg-white/10"
                }`}
              >
                INTENSIVE
              </button>
              <button
                onClick={() => setActiveTab("others")}
                className={`font-satoshi text-xs sm:text-sm font-bold tracking-wider px-6 py-2.5 rounded-full border border-white transition-all duration-300 cursor-pointer shadow-md ${
                  activeTab === "others"
                    ? "bg-white text-[#F7941D]"
                    : "bg-transparent text-white border-white/80 hover:border-white hover:bg-white/10"
                }`}
              >
                OTHERS
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {programsData[activeTab].map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Program Card Image */}
                <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-slate-50">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Optional Program Badge (e.g. Get Smart "9-15 Tahun") */}
                  {program.badge && (
                    <div className="absolute top-4 right-4 bg-[#0052FF] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md z-10">
                      {program.badge}
                    </div>
                  )}
                </div>

                {/* Card Text Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-satoshi text-xl sm:text-2xl font-bold text-[#111111] leading-snug">
                      {program.title}
                    </h3>
                    <p className="font-poppins text-xs font-semibold text-slate-400 mt-2 mb-4 tracking-wide uppercase">
                      {program.info}
                    </p>
                    <p className="font-poppins text-sm text-slate-600 leading-relaxed font-normal">
                      {program.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full bg-white relative overflow-hidden py-20 md:py-28 px-6 flex flex-col justify-center items-center">
        {/* Koala Illustration (Top Right) */}
        <div className="absolute top-8 right-0 sm:right-4 md:right-8 lg:right-12 w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] pointer-events-none select-none z-10">
          <Image
            src={kinImg}
            alt="Koala Illustration"
            fill
            className="object-contain object-right-top"
            priority
          />
        </div>

        {/* Lion Illustration (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[260px] md:h-[260px] pointer-events-none select-none z-10">
          <Image
            src={leoImg}
            alt="Lion Illustration"
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Content Wrapper */}
        <div className="max-w-6xl mx-auto w-full relative z-20">
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-satoshi text-2xl sm:text-3xl md:text-[38px] font-black tracking-tight text-[#1E293B] leading-tight uppercase">
              MASIH RAGU? YUK, CARI TAHU DI SINI
            </h2>
          </div>

          {/* Accordion Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left Column */}
            <div className="space-y-4">
              {faqDataLeft.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-[16px] p-5 cursor-pointer transition-all duration-300 select-none shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-satoshi text-[#0F172A] font-bold text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                    {/* Animated Plus-Minus Toggle */}
                    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {/* Horizontal Line */}
                      <div className="absolute w-3.5 h-[1.5px] bg-slate-500 rounded-full transition-transform duration-300"></div>
                      {/* Vertical Line */}
                      <div
                        className={`absolute w-[1.5px] h-3.5 bg-slate-500 rounded-full transition-all duration-300 ${
                          openFaq === item.id ? "rotate-90 scale-y-0 opacity-0" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === item.id
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* Divider line and Answer */}
                      <div className="border-t border-slate-100 pt-4">
                        <p className="font-poppins text-slate-500 text-xs sm:text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {faqDataRight.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="bg-white border border-slate-200/70 hover:border-slate-300 rounded-[16px] p-5 cursor-pointer transition-all duration-300 select-none shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-satoshi text-[#0F172A] font-bold text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                    {/* Animated Plus-Minus Toggle */}
                    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {/* Horizontal Line */}
                      <div className="absolute w-3.5 h-[1.5px] bg-slate-500 rounded-full transition-transform duration-300"></div>
                      {/* Vertical Line */}
                      <div
                        className={`absolute w-[1.5px] h-3.5 bg-slate-500 rounded-full transition-all duration-300 ${
                          openFaq === item.id ? "rotate-90 scale-y-0 opacity-0" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === item.id
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* Divider line and Answer */}
                      <div className="border-t border-slate-100 pt-4">
                        <p className="font-poppins text-slate-500 text-xs sm:text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full bg-white py-16 md:py-20 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Testimonials Slider Wrapper */}
        <div className="max-w-4xl mx-auto w-full relative z-20 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Left Navigation Arrow */}
          <button
            onClick={() =>
              setActiveTestimonial((prev) =>
                prev === 0 ? testimonialsData.length - 1 : prev - 1
              )
            }
            className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-700 hidden sm:flex"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div className="bg-white border border-slate-200/80 rounded-[24px] p-8 sm:p-12 flex-1 shadow-sm transition-all duration-500 min-h-[300px] flex flex-col justify-between relative">
            
            {/* Slide Content */}
            <div className="space-y-4">
              <h3 className="font-satoshi text-xl sm:text-2xl font-black text-[#FF9E1B] leading-snug">
                {testimonialsData[activeTestimonial].heading}
              </h3>
              <p className="font-poppins text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                "{testimonialsData[activeTestimonial].body}"
              </p>
            </div>

            {/* Separator and Author Info */}
            <div className="mt-8">
              <div className="border-t border-slate-100 my-4"></div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonialsData[activeTestimonial].stars)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#FFC107] fill-current"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Author Name */}
                <span className="font-satoshi text-sm sm:text-base font-bold text-[#1E293B]">
                  {testimonialsData[activeTestimonial].author}
                </span>
              </div>
            </div>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={() =>
              setActiveTestimonial((prev) =>
                prev === testimonialsData.length - 1 ? 0 : prev + 1
              )
            }
            className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-700 hidden sm:flex"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Slide Controls & Dots */}
        <div className="flex sm:hidden justify-center items-center gap-6 mt-8 relative z-20">
          <button
            onClick={() =>
              setActiveTestimonial((prev) =>
                prev === 0 ? testimonialsData.length - 1 : prev - 1
              )
            }
            className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? "bg-[#FF9E1B] w-4" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setActiveTestimonial((prev) =>
                prev === testimonialsData.length - 1 ? 0 : prev + 1
              )
            }
            className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop Dots Indicator */}
        <div className="hidden sm:flex justify-center items-center gap-2 mt-6 relative z-20">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTestimonial === index ? "bg-[#FF9E1B] w-4" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section id="cta" className="w-full bg-white pb-24 px-6 flex justify-center items-center relative overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Faint Hexagonal Border Details */}
          <div className="bg-[#F7941D] rounded-[24px] overflow-hidden py-12 md:py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 md:pl-48 lg:pl-56 shadow-lg min-h-[180px] relative">
            
            {/* Hexagonal graphical overlay (decorating the right side) */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 md:w-56 md:h-56 opacity-10 pointer-events-none select-none z-10">
              <svg className="w-full h-full text-white fill-none stroke-current" strokeWidth="2" viewBox="0 0 100 100">
                <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
              </svg>
            </div>
            <div className="absolute right-12 -top-6 w-32 h-32 opacity-10 pointer-events-none select-none z-10">
              <svg className="w-full h-full text-white fill-none stroke-current" strokeWidth="2" viewBox="0 0 100 100">
                <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
              </svg>
            </div>

            {/* CTA Copywriter */}
            <div className="text-white text-center md:text-left space-y-2 relative z-20">
              <h3 className="font-satoshi text-2xl sm:text-3xl lg:text-[32px] font-black leading-tight">
                Daftar dan raih kesempatan karier
                <br /> yang lebih baik!
              </h3>
            </div>

            {/* CTA Button */}
            <div className="relative z-20 flex-shrink-0">
              <Link
                href="#classes"
                className="bg-white hover:bg-slate-50 text-[#F7941D] font-bold text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 inline-block transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Browse Class
              </Link>
            </div>
          </div>

          {/* Waving Girl Illustration (Dira) */}
          {/* Placed relative to the container and positioned absolute bottom-0 overflowing the orange box */}
          <div className="absolute bottom-0 left-6 sm:left-12 md:left-8 lg:left-12 w-[130px] h-[180px] sm:w-[150px] sm:h-[200px] md:w-[190px] md:h-[250px] lg:w-[220px] lg:h-[290px] z-20 pointer-events-none select-none transform translate-y-[3%]">
            <Image
              src={diraImg}
              alt="Dira Waving Illustration"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </section>

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
                <Link href="#about" className="hover:text-[#4AC9CD] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#classes" className="hover:text-[#4AC9CD] transition-colors">
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
            
            {/* Address */}
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

            {/* Phone */}
            <div className="space-y-1 font-poppins text-sm text-slate-500 pt-2">
              <p className="font-bold text-slate-700">Phone number:</p>
              <p className="font-normal hover:text-[#4AC9CD] transition-colors">
                <a href="tel:+628997626888">+628997626888</a>
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-2 font-poppins text-sm text-slate-500 pt-2">
              <p className="font-bold text-slate-700">Social Media:</p>
              <div className="flex items-center gap-3 text-slate-600">
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4AC9CD] transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4AC9CD] transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* Email */}
                <a href="mailto:info@englisheverywhere.com" className="hover:text-[#4AC9CD] transition-colors" aria-label="Email">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
                {/* Phone Call */}
                <a href="tel:+628997626888" className="hover:text-[#4AC9CD] transition-colors" aria-label="Phone Call">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright divider and text */}
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
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.022-.079-.116-.16-.196-.214-1.229-.838-2.145-1.127-2.615-.815-.47.311-.884.774-1.233.725-.333-.047-.723-.231-1.309-.487-1.428-.621-2.457-1.687-2.92-2.316-.328-.445-.246-.669-.039-.938.207-.269.832-1.04 1.115-1.385.285-.345.244-.577.062-.843-.18-.266-.867-2.127-1.192-2.735-.316-.591-.703-.521-.994-.521-.215 0-.462-.02-.705-.02-.744 0-1.295.274-1.666.678-.506.551-1.744 1.702-1.744 4.153s1.782 4.821 2.029 5.15c.247.33 3.51 5.358 8.497 7.51 1.186.512 2.112.818 2.834 1.047 1.196.38 2.284.327 3.145.198.96-.144 2.955-1.208 3.367-2.378.412-1.17.412-2.171.29-2.379zM12.012 2.07c-5.477 0-9.934 4.457-9.934 9.934 0 2.006.593 3.875 1.625 5.434l-1.727 6.302 6.45-1.69a9.882 9.882 0 0 0 5.176 1.458c5.477 0 9.934-4.457 9.934-9.934 0-5.477-4.457-9.934-9.934-9.934zm0 17.986c-1.92 0-3.7-.514-5.234-1.404l-.375-.223-3.889 1.02 1.037-3.785-.244-.389A8.04 8.04 0 0 1 3.992 12c0-4.462 3.63-8.093 8.093-8.093s8.093 3.63 8.093 8.093-3.63 8.093-8.093 8.093z" />
        </svg>
        
        {/* Floating tooltip */}
        <span className="absolute right-16 bg-[#0F172A] text-white text-xs font-semibold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-md">
          Chat via WhatsApp
        </span>
      </a>
    </div>
  );
}


