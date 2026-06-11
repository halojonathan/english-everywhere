"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

// Event Poster and Documentation Images
import wordPlayPoster from "@/app/images/word-play-poster.png";
import doc1Img from "@/app/images/event-docs-1.png";
import doc2Img from "@/app/images/event-docs-2.png";
import doc3Img from "@/app/images/event-docs-3.png";

// Past event card thumbnail representations
import funnyPhonicsImg from "@/app/images/funny-phonics.png";
import hiKidsImg from "@/app/images/hi-kids.png";

interface EventItem {
  id: string;
  title: string;
  price: string;
  date: string;
  time: string;
  location: string;
  image: StaticImageData;
  isUpcoming: boolean;
}

const eventsData: EventItem[] = [
  // Upcoming Events
  {
    id: "upcoming-1",
    title: "Summer English Camp 2026",
    price: "150K",
    date: "2026-07-15",
    time: "09.00 - 15.00 WIB",
    location: "Center BSD & Alam Sutera",
    image: hiKidsImg,
    isUpcoming: true,
  },
  {
    id: "upcoming-2",
    title: "Speaking Masterclass for Kids",
    price: "FREE",
    date: "2026-08-05",
    time: "14.00 - 16.00 WIB",
    location: "Online via Zoom",
    image: funnyPhonicsImg,
    isUpcoming: true,
  },
  // Past Events (Mockup)
  {
    id: "past-1",
    title: "Test Event",
    price: "25K",
    date: "2026-02-24",
    time: "13.00 - 15.00 WIB",
    location: "Bintaro",
    image: hiKidsImg,
    isUpcoming: false,
  },
  {
    id: "past-2",
    title: "Funtastic Build — Open House English Everywhere",
    price: "FREE",
    date: "2026-01-15",
    time: "19.00 - 20.30 WIB",
    location: "Bintaro",
    image: funnyPhonicsImg,
    isUpcoming: false,
  },
];

const docPhotos = [
  { src: doc1Img, caption: "Keseruan Merakit Bricks & Belajar Phonics" },
  { src: doc2Img, caption: "Anak-anak Menunjukkan Hasil Karya Kreatif" },
  { src: doc3Img, caption: "Foto Bersama Orang Tua, Murid, dan Tutor" },
];

export default function EventsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [selectedUpcomingEvent, setSelectedUpcomingEvent] = useState<EventItem | null>(null);
  const [selectedPastEvent, setSelectedPastEvent] = useState<EventItem | null>(null);
  
  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter Events by Search
  const filteredEvents = eventsData.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter((event) => event.isUpcoming);
  const pastEvents = filteredEvents.filter((event) => !event.isUpcoming);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) return;

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const closeUpcomingModal = () => {
    setSelectedUpcomingEvent(null);
    setIsSuccess(false);
    setRegName("");
    setRegEmail("");
    setRegPhone("");
  };

  const closePastModal = () => {
    setSelectedPastEvent(null);
    setActiveSlide(0);
  };

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
            <Link href="/events" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              Events
            </Link>
            <Link href="/#corner" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
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
              className="block py-2 text-base font-bold text-slate-900"
            >
              Events
            </Link>
            <Link
              href="/#corner"
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

      {/* Main Events Area */}
      <main className="flex-1 w-full bg-white relative overflow-hidden py-16 md:py-20 px-6">
        
        {/* Decorative Green Outline Hexagons (Top Right) */}
        <div className="absolute top-20 right-6 md:right-16 w-24 h-24 sm:w-32 sm:h-32 opacity-20 pointer-events-none select-none z-10 flex items-center gap-1.5">
          <svg className="w-16 h-16 text-emerald-500 fill-none stroke-current" strokeWidth="3" viewBox="0 0 100 100">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
          </svg>
          <svg className="w-10 h-10 text-emerald-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 100 100">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" />
          </svg>
        </div>

        {/* Outer Container */}
        <div className="max-w-7xl mx-auto w-full relative z-20">
          
          {/* Header Row */}
          <div className="text-center max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h1 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1E293B] uppercase">
              LET'S HAVE FUN AND LEARN ENGLISH
            </h1>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search event"
                className="w-full px-6 py-3.5 pl-12 rounded-full border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150 transition-all font-poppins text-sm bg-white"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* 1. Upcoming Events Section */}
          <div className="mt-16 space-y-6">
            <h2 className="font-satoshi text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-slate-400 font-poppins text-sm pt-2 italic">
                Tidak ada upcoming events yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedUpcomingEvent(event)}
                    className="bg-[#F8FAFC] border border-slate-200/60 rounded-[20px] p-6 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-6 cursor-pointer hover:border-indigo-400 group"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-[150px] h-[120px] relative rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="150px"
                      />
                    </div>
                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-satoshi text-base sm:text-lg font-bold text-[#1E293B] leading-snug group-hover:text-indigo-600 transition-colors">
                            {event.title}
                          </h3>
                          <span className="font-satoshi text-sm sm:text-base font-black text-indigo-600 flex-shrink-0">
                            {event.price}
                          </span>
                        </div>
                        
                        <div className="space-y-1 font-poppins text-xs text-slate-500 font-medium">
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">📅</span> {event.date}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">🕒</span> {event.time}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">📍</span> {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Past Events Section */}
          <div className="mt-20 space-y-6">
            <h2 className="font-satoshi text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
              Past Events
            </h2>

            {pastEvents.length === 0 ? (
              <p className="text-slate-400 font-poppins text-sm pt-2 italic">
                Tidak ada past events yang cocok dengan pencarian Anda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedPastEvent(event)}
                    className="bg-[#F8FAFC] border border-slate-200/60 rounded-[20px] p-6 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-6 cursor-pointer hover:border-indigo-400 group"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-[150px] h-[120px] relative rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="150px"
                      />
                    </div>
                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-satoshi text-base sm:text-lg font-bold text-[#1E293B] leading-snug group-hover:text-indigo-600 transition-colors">
                            {event.title}
                          </h3>
                          <span className="font-satoshi text-sm sm:text-base font-black text-slate-500 flex-shrink-0">
                            {event.price}
                          </span>
                        </div>
                        
                        <div className="space-y-1 font-poppins text-xs text-slate-500 font-medium">
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">📅</span> {event.date}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">🕒</span> {event.time}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-slate-400">📍</span> {event.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 1. Modal: Upcoming Event Registration */}
      {selectedUpcomingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl max-w-5xl w-full flex flex-col md:flex-row relative animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={closeUpcomingModal}
              className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 cursor-pointer transition-colors shadow"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Column: Yellow Cartoon Poster */}
            <div className="w-full md:w-[45%] bg-[#FCD34D] min-h-[300px] md:min-h-[500px] relative overflow-hidden flex items-center justify-center p-4">
              <Image
                src={wordPlayPoster}
                alt="Event poster"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>

            {/* Right Column: Copywriting and registration form */}
            <div className="w-full md:w-[55%] p-8 sm:p-10 md:p-12 overflow-y-auto max-h-[85vh] md:max-h-[600px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="font-satoshi text-xl sm:text-2xl lg:text-[26px] font-black text-[#1E293B] leading-tight">
                    🎉 {selectedUpcomingEvent.title} 🎉
                  </h3>
                  <span className="font-satoshi text-base sm:text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                    {selectedUpcomingEvent.price}
                  </span>
                </div>

                {/* Event Information Bulletpoints */}
                <div className="font-poppins text-xs sm:text-sm text-slate-600 space-y-4 mb-8">
                  <p className="font-bold text-slate-800">Hi Ayah & Bunda! 👋</p>
                  <p>Yuk, ajak Ananda ikut seru-seruan di program: 🏫✨</p>
                  
                  <ul className="space-y-2 pl-4 list-disc">
                    <li>Mudah dipahami & menyenangkan 🎓</li>
                    <li>Meningkatkan kelancaran berbicara & kepercayaan diri 💬</li>
                    <li>Kenalan lebih dekat dengan visi English Everywhere 🌟</li>
                  </ul>

                  <p className="font-semibold text-rose-500">🎁 Plus... kuota terbatas, pendaftaran ditutup segera!</p>
                  
                  {/* Time metadata block */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5 font-medium text-xs pt-3">
                    <p className="flex items-center gap-2 text-slate-700">
                      <span>📅 Date:</span> {selectedUpcomingEvent.date}
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <span>🕒 Time:</span> {selectedUpcomingEvent.time}
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <span>📍 Location:</span> {selectedUpcomingEvent.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Form or Success State */}
              <div>
                {isSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2 animate-fade-in">
                    <span className="text-3xl">✅</span>
                    <h4 className="font-satoshi font-bold text-emerald-800 text-lg">Pendaftaran Berhasil!</h4>
                    <p className="font-poppins text-emerald-700 text-xs sm:text-sm">
                      Terima kasih telah mendaftar. Tim admin kami akan segera menghubungi Anda melalui WhatsApp/Email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="font-satoshi font-bold text-slate-800 text-sm tracking-wide uppercase">
                      Pendaftaran Kelas
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Nama Lengkap Orang Tua"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-poppins text-sm"
                      />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Alamat Email Aktif"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-poppins text-sm"
                      />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="Nomor WhatsApp (e.g. 08123...)"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-poppins text-sm"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-3.5 rounded-lg transition-colors cursor-pointer text-sm shadow-md"
                    >
                      {isSubmitting ? "Memproses..." : "Daftar"}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Past Event Documentation Slide Carousel */}
      {selectedPastEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl max-w-4xl w-full relative animate-scale-up p-6 md:p-8 flex flex-col justify-between min-h-[450px]">
            
            {/* Header row */}
            <div className="flex justify-between items-start gap-4 mb-4 pr-10">
              <div>
                <h3 className="font-satoshi text-lg sm:text-xl md:text-2xl font-black text-[#1E293B] leading-tight">
                  📸 Dokumentasi: {selectedPastEvent.title}
                </h3>
                <p className="font-poppins text-xs text-slate-400 mt-1">
                  Diselenggarakan pada {selectedPastEvent.date}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closePastModal}
              className="absolute top-6 right-6 z-30 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full p-2 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Slide Frame */}
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center my-4 group">
              
              <Image
                src={docPhotos[activeSlide].src}
                alt="Documentation slide"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />

              {/* Slider Left Arrow */}
              <button
                onClick={() =>
                  setActiveSlide((prev) => (prev === 0 ? docPhotos.length - 1 : prev - 1))
                }
                className="absolute left-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Slider Right Arrow */}
              <button
                onClick={() =>
                  setActiveSlide((prev) => (prev === docPhotos.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Caption overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 md:p-6 text-white text-center">
                <p className="font-poppins text-xs sm:text-sm font-semibold tracking-wide leading-relaxed">
                  {docPhotos[activeSlide].caption}
                </p>
              </div>
            </div>

            {/* Dots Pagination */}
            <div className="flex justify-center items-center gap-2 mt-2">
              {docPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === index ? "bg-[#4AC9CD] w-5" : "bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      )}

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
                <Link href="/#corner" className="hover:text-[#4AC9CD] transition-colors">
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
