"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Import local images
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";
import sunImg from "@/app/images/sun.png";
import twirlImg from "@/app/images/twirl.png";
import leftKid from "@/app/images/left-kid.png";
import rightKid from "@/app/images/right-kid.png";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              width={160}
              height={50}
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
          <div className="w-[280px] h-[220px] sm:w-[350px] sm:h-[270px] md:w-[400px] md:h-[310px] lg:w-[450px] lg:h-[350px] lg:absolute lg:bottom-0 lg:left-0 z-10 relative">
            <Image
              src={leftKid}
              alt="Left Kid Sitting at Desk"
              fill
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* Right Kid (Writing/Studying) */}
          <div className="w-[280px] h-[220px] sm:w-[350px] sm:h-[270px] md:w-[400px] md:h-[310px] lg:w-[450px] lg:h-[350px] lg:absolute lg:bottom-0 lg:right-0 z-10 relative mt-6 sm:mt-0">
            <Image
              src={rightKid}
              alt="Right Kid Sitting at Desk"
              fill
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 English Everywhere. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/status" className="hover:text-slate-600 transition-colors">
              Database Connection Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


