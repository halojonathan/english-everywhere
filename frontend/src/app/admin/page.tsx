"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState("11 Juni 2026");

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username"));
    setIsLoaded(true);

    // Dynamic date formatting option
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    // Let's set default date as screenshot: "11 Juni 2026", but make it fallback/customizable
    setCurrentDate("11 Juni 2026");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    setUserName(null);
    router.push("/");
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  // Guard check: must be admin
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full space-y-6">
          <span className="text-5xl block">🔒</span>
          <h2 className="font-satoshi text-2xl font-black text-slate-800">Akses Dibatasi</h2>
          <p className="font-poppins text-sm text-slate-500 leading-relaxed">
            Halaman ini khusus untuk akun **Admin**. Silakan login kembali dengan akun administrator untuk melihat dashboard.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg transition-colors text-sm"
            >
              Kembali
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-[#EF777E] hover:bg-[#eb5e67] text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-md"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col justify-between p-6 flex-shrink-0 min-h-screen hidden md:flex">
        <div className="space-y-10">
          
          {/* Logo */}
          <div className="w-[140px] h-[45px] relative">
            <Image
              src={logoEev}
              alt="English Everywhere Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 font-poppins text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4AC9CD] text-white font-bold transition-all shadow-md shadow-teal-100"
            >
              <span>📊</span> Dashboard
            </Link>
            <button
              onClick={() => alert("Mengakses menu Account...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>👤</span> Account
            </button>
            <button
              onClick={() => alert("Mengakses menu Appointment...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>📅</span> Appointment
            </button>
            <button
              onClick={() => alert("Mengakses menu Applicant Data...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>🎓</span> Applicant Data
            </button>
            <button
              onClick={() => alert("Mengakses menu English Corner...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>✍️</span> English Corner
            </button>
            <button
              onClick={() => alert("Mengakses menu Payments...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>💳</span> Payments
            </button>
            <button
              onClick={() => alert("Mengakses menu Events...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>🎉</span> Events
            </button>
            <button
              onClick={() => alert("Mengakses menu Schedules...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-left cursor-pointer"
            >
              <span>📅</span> Schedules
            </button>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-bold transition-all text-left font-poppins text-sm cursor-pointer"
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-100 h-20 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-poppins text-xs font-semibold text-slate-400">ROLE: ADMINISTRATOR</h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Date */}
            <div className="flex items-center gap-2 font-poppins text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-lg font-medium">
              <span>📅</span> {currentDate}
            </div>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
              <div className="w-10 h-10 rounded-full bg-[#4AC9CD]/10 text-[#4AC9CD] flex items-center justify-center font-bold text-sm tracking-wide">
                SA
              </div>
              <div className="hidden sm:block font-poppins text-xs text-left">
                <p className="font-bold text-slate-800">System Administrator</p>
                <p className="text-slate-400">admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          {/* Main Title */}
          <h1 className="font-satoshi text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Dashboard
          </h1>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
              <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Account
              </p>
              <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                166
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
              <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Appointment Pending
              </p>
              <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                0
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
              <p className="font-poppins text-[10px] font-bold text-[#EF5A3F] uppercase tracking-wider">
                Pembayaran Jatuh Tempo
              </p>
              <p className="font-satoshi text-3xl font-black text-[#EF5A3F] mt-2">
                0
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
              <p className="font-poppins text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                Transaksi Tertunda
              </p>
              <p className="font-satoshi text-3xl font-black text-amber-500 mt-2">
                0
              </p>
            </div>

          </div>

          {/* Middle Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card: Appointment */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-center">
                <h3 className="font-satoshi text-base font-bold text-slate-800">
                  Appointment
                </h3>
                <span className="font-poppins text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  This Month
                </span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-10">
                <span className="text-3xl mb-2">📅</span>
                <p className="font-poppins text-xs text-slate-400 italic font-medium">
                  No upcoming appointments
                </p>
              </div>
            </div>

            {/* Card: Last Transaction */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[300px]">
              <h3 className="font-satoshi text-base font-bold text-slate-800">
                Last Transaction
              </h3>

              <div className="flex-1 flex flex-col justify-center items-center py-10">
                <span className="text-3xl mb-2">💳</span>
                <p className="font-poppins text-xs text-slate-400 italic font-medium">
                  No recent successful transactions
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Row: Recent Events Grid */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-satoshi text-base font-bold text-slate-800">
              Recent Events
            </h3>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-4">Event Title</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#1E293B] flex items-center gap-2">
                      <span className="text-emerald-500 text-sm">🎫</span> Test Event
                    </td>
                    <td className="py-4 px-4 text-slate-500">24 Feb 2026</td>
                    <td className="py-4 px-4 text-slate-500">Bintaro</td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-[#4AC9CD]/10 text-[#4AC9CD] text-[11px] font-bold px-3 py-1 rounded-md">
                        25K
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#1E293B] flex items-center gap-2">
                      <span className="text-emerald-500 text-sm">🎫</span> English Fun Day 2025
                    </td>
                    <td className="py-4 px-4 text-slate-500">15 Aug 2025</td>
                    <td className="py-4 px-4 text-slate-500">Pamulang</td>
                    <td className="py-4 px-4 text-right">
                      <span className="bg-[#EF777E]/10 text-[#EF777E] text-[11px] font-bold px-3 py-1 rounded-md">
                        Free
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
