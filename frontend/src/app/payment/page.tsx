"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

interface BillingItem {
  id: string;
  name: string;
  invoiceNo: string;
  dueDate: string;
  fine: string;
  discount: string;
  amount: string;
}

const mockBillings: BillingItem[] = [
  {
    id: "bill-1",
    name: "Business English Registration Fee",
    invoiceNo: "INV/EEV/2026/0101",
    dueDate: "29 September 2025",
    fine: "Tidak Ada",
    discount: "Tidak Ada",
    amount: "1.500.000",
  },
  {
    id: "bill-2",
    name: "Speaking Course Materials & Books",
    invoiceNo: "INV/EEV/2026/0102",
    dueDate: "29 September 2025",
    fine: "Tidak Ada",
    discount: "Tidak Ada",
    amount: "600.000",
  },
];

const mockHistory = [
  { course: "Business English Intermediate", amount: "Rp 450.000" },
  { course: "Business English Intermediate", amount: "Rp 450.000" },
  { course: "Business English Intermediate", amount: "Rp 450.000" },
];

export default function PaymentPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    setUserName(localStorage.getItem("username"));
    setIsLoaded(true);
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

  // Guard check: must be a student
  if (userRole !== "student") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full space-y-6">
          <span className="text-5xl block">🔒</span>
          <h2 className="font-satoshi text-2xl font-black text-slate-800">Akses Dibatasi</h2>
          <p className="font-poppins text-sm text-slate-500 leading-relaxed">
            Halaman ini khusus untuk akun **Student**. Silakan login kembali dengan akun siswa untuk melihat tagihan pembayaran Anda.
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
              Login Siswa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans relative flex flex-col justify-between">
      {/* Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
            <Link href="/english-corner" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              English Corner
            </Link>
            <Link href="/payment" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              Payment
            </Link>
          </nav>

          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-block cursor-pointer"
            >
              Logout ({userName})
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 shadow-inner">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">
              Homepage
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">
              About Us
            </Link>
            <Link href="/#classes" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">
              Daftar Kelas
            </Link>
            <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">
              Events
            </Link>
            <Link href="/english-corner" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-slate-900">
              English Corner
            </Link>
            <Link href="/payment" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-900">
              Payment
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center bg-slate-700 hover:bg-slate-800 text-white font-semibold text-base py-3 rounded-full transition-colors block shadow-md"
              >
                Logout ({userName})
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Payment Content */}
      <main className="flex-1 w-full py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Billings List */}
          <section className="flex-1 space-y-8">
            
            {/* Total Balance Banner */}
            <div className="bg-[#EF5A3F] rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12" />
              <h2 className="font-satoshi text-base sm:text-lg font-bold opacity-90 tracking-wide uppercase">
                Total Tagihan yang belum di bayar
              </h2>
              <p className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black mt-3 tracking-tight">
                Rp 2.100.000
              </p>
            </div>

            {/* Billings Details */}
            <div className="space-y-6">
              <h2 className="font-satoshi text-xl font-black text-slate-800 tracking-tight">
                Rincian Tagihan
              </h2>

              {mockBillings.map((bill) => (
                <div
                  key={bill.id}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-md transition-all duration-300 relative"
                >
                  {/* Top line with title and invoice */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <h3 className="font-satoshi text-base sm:text-lg font-bold text-slate-800">
                      {bill.name}
                    </h3>
                    <span className="font-poppins text-xs text-slate-400 font-semibold">
                      {bill.invoiceNo}
                    </span>
                  </div>

                  {/* Late badge */}
                  <span className="inline-block bg-[#EF5A3F]/10 text-[#EF5A3F] font-poppins text-[10px] font-bold px-2.5 py-1 rounded-full mb-6">
                    Telat 1 Bulan
                  </span>

                  {/* Table details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 font-poppins text-xs text-slate-500">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-400">Jatuh Tempo</p>
                      <p className="font-bold text-slate-700">{bill.dueDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-400">Denda</p>
                      <p className="font-bold text-slate-700">{bill.fine}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-400">Potongan</p>
                      <p className="font-bold text-slate-700">{bill.discount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-400">Tagihan</p>
                      <p className="font-bold text-slate-900 text-sm">Rp {bill.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* Right Column: Payment History Sidebar */}
          <aside className="w-full lg:w-[360px] bg-white border border-slate-200/60 rounded-3xl p-6 self-start space-y-6">
            <h2 className="font-satoshi text-lg font-bold text-slate-800 tracking-tight uppercase">
              History Pembayaran
            </h2>

            <div className="space-y-4">
              <p className="font-satoshi text-xs font-black text-slate-400 uppercase tracking-wider">
                Pembayaran Course
              </p>
              
              {mockHistory.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-100 rounded-xl space-y-3 hover:border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-poppins text-xs font-bold text-slate-400 line-through leading-snug">
                      {item.course}
                    </p>
                    <span className="font-poppins text-xs font-bold text-slate-600 flex-shrink-0">
                      {item.amount}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Membuka Bukti Pembayaran Ke-${index + 1}`)}
                    className="font-poppins text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded transition-all cursor-pointer inline-block"
                  >
                    Bukti Pembayaran
                  </button>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white relative z-10 pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-satoshi text-2xl font-black text-[#4AC9CD]">English Everywhere</h4>
            <p className="font-poppins text-slate-800 font-bold text-base">Embrace Your Future With Us!</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-poppins text-xs text-slate-400 font-medium">
              <span>#EnglishCourses</span>
              <span>#KosakataInggris</span>
              <span>#SpeakingWithConfidence</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-satoshi text-base font-bold text-slate-800 tracking-wider uppercase">Features</h4>
            <ul className="space-y-2.5 font-poppins text-sm text-slate-500 font-medium">
              <li><Link href="/" className="hover:text-[#4AC9CD] transition-colors">Homepage</Link></li>
              <li><Link href="/#about" className="hover:text-[#4AC9CD] transition-colors">About Us</Link></li>
              <li><Link href="/#classes" className="hover:text-[#4AC9CD] transition-colors">Daftar Kelas</Link></li>
              <li><Link href="/events" className="hover:text-[#4AC9CD] transition-colors">Events</Link></li>
              <li><Link href="/english-corner" className="hover:text-[#4AC9CD] transition-colors">English Corner</Link></li>
              <li><Link href="/payment" className="hover:text-[#4AC9CD] transition-colors">Payment</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-satoshi text-base font-bold text-slate-800 tracking-wider uppercase">Contact</h4>
            <div className="space-y-1 font-poppins text-sm text-slate-500">
              <p className="font-bold text-slate-700">Address:</p>
              <p className="leading-relaxed font-normal">Cendana Residence Blok H8 No 6,<br />South Tangerang 15416</p>
              <p className="leading-relaxed font-normal pt-2">Jl. Soka Indah no. 13 Dukuhwaluh,<br />Kembaran, Purwokerto 53182</p>
            </div>
            <div className="space-y-1 font-poppins text-sm text-slate-500 pt-2">
              <p className="font-bold text-slate-700">Phone number:</p>
              <p className="font-normal hover:text-[#4AC9CD] transition-colors"><a href="tel:+628997626888">+628997626888</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
