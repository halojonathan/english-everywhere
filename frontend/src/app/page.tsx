"use client";

import { useState } from "react";
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
    answer: "English Everywhere menawarkan berbagai program mulai dari Funny Phonics, Hi Kids!, Oxford Phonics, hingga kelas intensif TOEFL/IELTS Prep dan kelas privat 1-on-1 yang disesuaikan dengan kebutuhan belajar Anda.",
  },
  {
    id: "faq-l2",
    question: "Bagaimana cara mendaftar kursus di English Everywhere?",
    answer: "Anda dapat mendaftar dengan mudah dengan mengklik tombol pendaftaran, mengisi formulir online, atau menghubungi tim admin kami via WhatsApp untuk mendapatkan bantuan panduan pendaftaran langsung.",
  },
  {
    id: "faq-l3",
    question: "Apakah saya akan mendapatkan sertifikat setelah menyelesaikan kursus?",
    answer: "Ya! Setiap siswa yang berhasil menyelesaikan seluruh level program dan lulus ujian akhir akan menerima sertifikat resmi kelulusan dari English Everywhere.",
  },
  {
    id: "faq-l4",
    question: "Apa yang membedakan English Everywhere dari kursus bahasa Inggris lainnya?",
    answer: "Kami fokus pada metode komunikatif yang interaktif dan menyenangkan untuk melatih keberanian berbicara. Kurikulum kami didesain modern dengan dukungan teknologi terkini dan tutor profesional yang suportif.",
  },
  {
    id: "faq-l5",
    question: "Berapa jumlah siswa dalam satu kelas?",
    answer: "Untuk menjaga keefektifan belajar dan interaksi interaktif, setiap kelas reguler kami batasi maksimal hanya 6-8 siswa saja.",
  },
  {
    id: "faq-l6",
    question: "Siapa yang bisa saya hubungi jika saya memiliki pertanyaan lebih lanjut?",
    answer: "Anda dapat menghubungi layanan Customer Service kami langsung melalui tombol WhatsApp mengambang di pojok kanan bawah halaman ini atau mengirim email ke support@englisheverywhere.com.",
  },
];

const faqDataRight: FAQItem[] = [
  {
    id: "faq-r1",
    question: "Bagaimana saya tahu level bahasa Inggris saya yang tepat untuk memulai?",
    answer: "Kami menyediakan layanan Placement Test gratis sebelum Anda memulai kelas untuk menentukan tingkat kemampuan bahasa Inggris Anda dengan tepat.",
  },
  {
    id: "faq-r2",
    question: "Apakah kelas diadakan secara online atau tatap muka (offline)?",
    answer: "Kami menyediakan fleksibilitas penuh dengan menawarkan kedua opsi kelas: kelas tatap muka (offline) interaktif di cabang kami, serta kelas online yang dinamis dan bisa diakses dari mana saja.",
  },
  {
    id: "faq-r3",
    question: "Siapa saja yang bisa mengikuti kursus ini? Apakah ada batasan usia?",
    answer: "Program kami dirancang secara komprehensif mulai dari anak-anak (usia 4-12 tahun), remaja (usia 13-18 tahun), hingga kelas persiapan ujian untuk usia dewasa.",
  },
  {
    id: "faq-r4",
    question: "Apakah ada kelas percobaan (trial class) gratis sebelum mendaftar?",
    answer: "Tentu saja! Anda bisa mendaftar program Trial Class gratis untuk merasakan langsung keseruan metode pembelajaran kami sebelum memutuskan untuk bergabung.",
  },
  {
    id: "faq-r5",
    question: "Media pembelajaran apa saja yang akan saya dapatkan?",
    answer: "Anda akan mendapatkan akses ke modul pembelajaran digital (e-book), buku latihan fisik, materi video interaktif, serta akses ke platform belajar online kami yang bisa diakses kapan saja.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"regular" | "intensive" | "others">("regular");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden relative flex flex-col justify-between">
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
            <Link href="#events" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Events
            </Link>
            <Link href="#corner" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
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
              href="#events"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              Events
            </Link>
            <Link
              href="#corner"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
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
                  className={`bg-white border rounded-[16px] p-5 cursor-pointer transition-all duration-300 select-none shadow-sm hover:shadow-md hover:border-slate-300 ${
                    openFaq === item.id ? "border-[#FF9E1B]" : "border-slate-200/70"
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-satoshi text-[#0F172A] font-bold text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                    <span
                      className={`text-[#FF9E1B] font-bold text-xl sm:text-2xl transition-transform duration-300 ${
                        openFaq === item.id ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === item.id
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-poppins text-slate-500 text-xs sm:text-sm leading-relaxed pt-1">
                        {item.answer}
                      </p>
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
                  className={`bg-white border rounded-[16px] p-5 cursor-pointer transition-all duration-300 select-none shadow-sm hover:shadow-md hover:border-slate-300 ${
                    openFaq === item.id ? "border-[#FF9E1B]" : "border-slate-200/70"
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="font-satoshi text-[#0F172A] font-bold text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                    <span
                      className={`text-[#FF9E1B] font-bold text-xl sm:text-2xl transition-transform duration-300 ${
                        openFaq === item.id ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === item.id
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-poppins text-slate-500 text-xs sm:text-sm leading-relaxed pt-1">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-50 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 English Everywhere. All rights reserved.</p>
          <div className="flex gap-4">
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


