"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

interface AppointmentScheduleItem {
  id: number;
  date: string;
  time: string;
  quota: number;
  booked: number;
}

export default function StudentAppointmentPage() {
  const router = useRouter();

  // Role and Navigation States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Booking Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  // Calendar State
  // Default to March 2026 as in mockup, but fully navigable
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-15");
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(2); // March is index 2

  // Modal dialog popup state for clicked day
  const [popupDate, setPopupDate] = useState<string | null>(null);

  // API Data State
  const [schedules, setSchedules] = useState<AppointmentScheduleItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch Schedules from backend
  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments/schedules");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setSchedules(json.data);
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock schedules.");
      // Seed fallback schedules locally matching screenshot (March 2026)
      setSchedules([
        { id: 1, date: "2026-03-04", time: "20:00", quota: 1, booked: 1 }, // Closed
        { id: 2, date: "2026-03-17", time: "08:00", quota: 2, booked: 2 }, // Closed
        { id: 3, date: "2026-03-18", time: "10:00", quota: 1, booked: 1 }, // Closed
        { id: 4, date: "2026-03-19", time: "10:00", quota: 2, booked: 2 }, // Closed
        { id: 5, date: "2026-03-20", time: "11:00", quota: 1, booked: 1 }, // Closed
        { id: 6, date: "2026-03-23", time: "10:00", quota: 2, booked: 0 }, // Available
        { id: 7, date: "2026-03-25", time: "14:00", quota: 3, booked: 1 }, // Available
      ]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Calendar rendering computations
  const getIndoMonthName = (monthIndex: number) => {
    const months = [
      "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", 
      "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
    ];
    return months[monthIndex];
  };

  const getIndoMonthNameTitle = (monthIndex: number) => {
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    return months[monthIndex];
  };

  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const getDayStatus = (dateStr: string) => {
    const daySchedules = schedules.filter(s => s.date === dateStr);
    if (daySchedules.length === 0) return "none";
    const allFull = daySchedules.every(s => s.booked >= s.quota);
    return allFull ? "full" : "available";
  };

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7; // Monday = 0
  const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

  const calendarDays = [];
  // Fill previous month overlapping days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevM = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const prevY = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    calendarDays.push({
      day: d,
      isCurrentMonth: false,
      dateString: formatDateString(prevY, prevM, d)
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      dateString: formatDateString(calendarYear, calendarMonth, i)
    });
  }
  // Fill next month overlap
  const totalSlots = calendarDays.length > 35 ? 42 : 35;
  const nextMonthFillCount = totalSlots - calendarDays.length;
  for (let i = 1; i <= nextMonthFillCount; i++) {
    const nextM = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const nextY = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      dateString: formatDateString(nextY, nextM, i)
    });
  }

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
    setSelectedScheduleId(null);
    setPopupDate(null);
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
    setSelectedScheduleId(null);
    setPopupDate(null);
  };

  const handleDayClick = (dateStr: string) => {
    const daySchedules = schedules.filter(s => s.date === dateStr);
    if (daySchedules.length > 0) {
      setPopupDate(dateStr);
    }
  };

  // Handle Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !gender || !selectedScheduleId) {
      setError("Semua kolom dan pilihan jam wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: selectedScheduleId,
          name,
          email,
          phone,
          gender
        })
      });

      const json = await res.json();
      if (res.ok && json.status === "success") {
        setSuccess(true);
        setIsSubmitting(false);
        fetchSchedules();
        return;
      } else {
        setError(json.message || "Gagal melakukan pendaftaran test.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using mock submission.");
    }

    // Fallback simulation
    setTimeout(() => {
      setSchedules(prev => 
        prev.map(s => {
          if (s.id === selectedScheduleId) {
            if (s.booked >= s.quota) {
              setError("Jadwal ini sudah terisi penuh.");
              setIsSubmitting(false);
              return s;
            }
            setSuccess(true);
            setIsSubmitting(false);
            return { ...s, booked: s.booked + 1 };
          }
          return s;
        })
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-850 font-sans relative flex flex-col justify-between selection:bg-[#4AC9CD]/25 selection:text-[#4AC9CD]">
      
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
            <Link href="/#classes" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              Daftar Kelas
            </Link>
            <Link href="/events" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Events
            </Link>
            <Link href="/english-corner" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              English Corner
            </Link>
            {userRole === "teacher" && (
              <>
                <Link href="/learning-materials" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  Learning Materials
                </Link>
                <Link href="/attendance" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  Attendance
                </Link>
              </>
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
              className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
            >
              English Corner
            </Link>
            {userRole === "teacher" && (
              <>
                <Link
                  href="/learning-materials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
                >
                  Learning Materials
                </Link>
                <Link
                  href="/attendance"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900"
                >
                  Attendance
                </Link>
              </>
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

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header Title */}
          <div className="space-y-2">
            <h1 className="font-satoshi text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
              MEET APPOINTMENT
            </h1>
            <p className="font-poppins text-slate-500 text-xs sm:text-sm">
              Silakan pilih tanggal dan waktu placement test gratis Anda di bawah ini.
            </p>
          </div>

          {success ? (
            /* Success View */
            <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 text-center shadow-xl max-w-lg mx-auto space-y-6 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="font-satoshi text-2xl font-black text-slate-800">
                  Pendaftaran Berhasil!
                </h2>
                <p className="font-poppins text-sm text-slate-500 leading-relaxed">
                  Terima kasih <strong>{name}</strong>, jadwal placement test Anda telah terkonfirmasi. Tim admin kami akan segera menghubungi Anda melalui WhatsApp di nomor <strong>{phone}</strong> untuk detail selanjutnya.
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left font-poppins text-xs space-y-2.5 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal Test:</span>
                  <span className="font-bold text-slate-700">
                    {(() => {
                      const dateParts = schedules.find(s => s.id === selectedScheduleId)?.date.split("-") || [];
                      if (dateParts.length === 3) {
                        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                        return `${parseInt(dateParts[2])} ${months[parseInt(dateParts[1]) - 1]} ${dateParts[0]}`;
                      }
                      return "";
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jam Test:</span>
                  <span className="font-bold text-slate-700">
                    Jam {schedules.find(s => s.id === selectedScheduleId)?.time || ""}
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setGender("");
                    setSelectedScheduleId(null);
                  }}
                  className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-3 px-8 rounded-full transition-colors cursor-pointer text-xs font-poppins shadow-md shadow-teal-50"
                >
                  Kembali
                </button>
              </div>
            </div>
          ) : (
            /* Booking Flow View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Calendar Card */}
              <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
                
                {/* Month Navigator */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-slate-100 text-slate-600 transition-colors border-r border-slate-100 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="font-satoshi text-base font-black text-slate-800 tracking-wider">
                      {getIndoMonthNameTitle(calendarMonth)} {calendarYear}
                    </h2>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 font-poppins text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-4 select-none">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                        AVAILABLE
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-slate-400 rounded-full inline-block"></span>
                        FULL
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        setCalendarYear(today.getFullYear());
                        setCalendarMonth(today.getMonth());
                        setSelectedDate(formatDateString(today.getFullYear(), today.getMonth(), today.getDate()));
                      }}
                      className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer bg-white"
                    >
                      Today
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                  {/* Grid Header */}
                  <div className="grid grid-cols-7 text-center font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 py-2.5 border-b border-slate-100">
                    <div>MON</div>
                    <div>TUE</div>
                    <div>WED</div>
                    <div>THU</div>
                    <div>FRI</div>
                    <div>SAT</div>
                    <div>SUN</div>
                  </div>

                  {/* Grid Days */}
                  <div className="grid grid-cols-7 gap-px bg-slate-100 text-slate-700 font-poppins text-xs sm:text-sm">
                    {calendarDays.map((cell, idx) => {
                      const status = getDayStatus(cell.dateString);
                      const isSelected = cell.dateString === selectedDate;
                      const daySchedules = schedules.filter(s => s.date === cell.dateString);

                      const cellDate = new Date(cell.dateString);
                      cellDate.setHours(0, 0, 0, 0);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isPast = cellDate < today;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isPast) return;
                            handleDayClick(cell.dateString);
                          }}
                          className={`h-16 sm:h-[72px] p-1 sm:p-1.5 flex flex-col justify-between transition-all select-none ${
                            !cell.isCurrentMonth
                              ? "bg-slate-50/30 text-slate-350 pointer-events-none"
                              : isPast
                              ? "bg-slate-50/50 text-slate-400/50 cursor-not-allowed"
                              : isSelected
                              ? "ring-2 ring-inset ring-[#4AC9CD]/60 bg-[#E6F7F8]/10 cursor-pointer"
                              : "bg-white hover:bg-slate-50/30 cursor-pointer"
                          }`}
                        >
                          <span className={`font-bold text-[10px] sm:text-xs ${
                            !cell.isCurrentMonth
                              ? "text-slate-300"
                              : isPast
                              ? "text-slate-400/50"
                              : "text-slate-700"
                          }`}>{cell.day}</span>
                          
                          {/* Inner list of slots capsules directly in cell as in mockup */}
                          <div className="space-y-0.5 w-full overflow-hidden">
                            {!isPast && daySchedules.map(s => {
                              const isFull = s.booked >= s.quota;
                              return (
                                <div
                                  key={s.id}
                                  className={`text-[7px] sm:text-[8px] font-bold py-0.5 px-1 rounded border text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                                    isFull
                                      ? "bg-slate-100 border-slate-200 text-slate-400"
                                      : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                  }`}
                                >
                                  {s.time} {isFull ? "(Closed)" : ""}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Booking Form Details */}
              <form onSubmit={handleSubmitBooking} className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-satoshi text-base font-black text-slate-800 uppercase tracking-wider border-b border-slate-150 pb-3">
                  Data Diri Calon Murid
                </h3>

                {error && (
                  <p className="font-poppins text-xs text-rose-500 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                    {error}
                  </p>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-xs font-bold text-slate-600">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama calon murid"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-xs font-bold text-slate-600">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-xs font-bold text-slate-600">
                      No. WhatsApp (Aktif)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-xs font-bold text-slate-600">
                      Jenis Kelamin
                    </label>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white animate-fade-in"
                    >
                      <option value="" disabled>Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                {/* Selected Time Slots */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <label className="block font-poppins text-xs font-bold text-slate-600">
                    Jadwal Waktu Terpilih:
                  </label>
                  {selectedScheduleId ? (
                    <div className="bg-[#E6F7F8] border border-[#4AC9CD]/20 text-[#4AC9CD] font-bold p-3 rounded-xl flex justify-between items-center text-xs font-poppins">
                      <span>
                        {(() => {
                          const sched = schedules.find(s => s.id === selectedScheduleId);
                          const dateParts = sched?.date.split("-") || [];
                          const timeVal = sched?.time || "";
                          if (dateParts.length === 3) {
                            return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} pada Jam ${timeVal}`;
                          }
                          return "";
                        })()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedScheduleId(null)}
                        className="text-[#EF777E] hover:text-[#eb5e67] font-bold cursor-pointer"
                      >
                        Ubah
                      </button>
                    </div>
                  ) : (
                    <p className="font-poppins text-xs text-slate-400 italic">
                      *Klik salah satu tanggal berwarna hijau di kalender untuk memilih jam test.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedScheduleId}
                  className="w-full bg-[#EF777E] hover:bg-[#eb5e67] disabled:bg-slate-300 disabled:opacity-70 text-white font-bold py-3.5 rounded-2xl transition-all cursor-pointer text-xs shadow-md text-center font-poppins uppercase tracking-wider"
                >
                  {isSubmitting ? "Memproses..." : "Daftarkan Jadwal Test"}
                </button>
              </form>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DIALOG POPUP: LIST SLOTS OF PRESSED DATE */}
          {/* ========================================================================= */}
          {popupDate && (() => {
            const dateSchedules = schedules.filter(s => s.date === popupDate);
            const dateParts = popupDate.split("-");
            let readableDate = popupDate;
            if (dateParts.length === 3) {
              const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const dObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
              readableDate = `${days[dObj.getDay()]}, ${months[dObj.getMonth()]} ${parseInt(dateParts[2])}`;
            }

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up border border-slate-100 p-6 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-poppins text-xs font-bold text-slate-800">
                      {readableDate}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setPopupDate(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Body Slots */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dateSchedules.map(slot => {
                      const isFull = slot.booked >= slot.quota;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isFull}
                          onClick={() => {
                            setSelectedScheduleId(slot.id);
                            setSelectedDate(popupDate);
                            setPopupDate(null);
                          }}
                          className={`w-full px-4 py-3 rounded-2xl border text-center font-poppins text-xs font-bold transition-all select-none cursor-pointer ${
                            isFull
                              ? "bg-slate-200 border-slate-200 text-slate-600 cursor-not-allowed opacity-80"
                              : "bg-[#4AC9CD] border-[#4AC9CD] hover:bg-[#3db3b7] text-white hover:scale-[1.01] shadow-md shadow-teal-50"
                          }`}
                        >
                          {slot.time} {isFull ? "(Closed)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-slate-100 text-center text-xs text-slate-400 font-poppins">
        <p>© 2026 English Everywhere. All rights reserved.</p>
      </footer>

    </div>
  );
}
