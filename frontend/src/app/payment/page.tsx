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

  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: ""
  });

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [activeInstallment, setActiveInstallment] = useState<{paymentId: number, instIdx: number, amount: number, deadline: string} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('virtual_account');
  const [vaNumber, setVaNumber] = useState<string | null>(null);
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<string>('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Fetch payments from Laravel API
  const fetchStudentPayments = async (nameVal: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/payments");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          // Filter payments for this logged-in student
          const studentPayments = json.data.filter((p: any) => 
            p.student_name.toLowerCase() === nameVal.toLowerCase()
          );
          setPayments(studentPayments);
        }
      }
    } catch (err) {
      console.warn("Backend not reachable or error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const roleVal = localStorage.getItem("role");
    const nameVal = localStorage.getItem("username");
    setUserRole(roleVal);
    setUserName(nameVal);
    setIsLoaded(true);

    if (nameVal) {
      fetchStudentPayments(nameVal);
      // Reactive real-time updates: poll payment states every 3 seconds
      const interval = setInterval(() => {
        fetchStudentPayments(nameVal);
      }, 3000);
      return () => clearInterval(interval);
    }

    if (typeof window !== "undefined") {
      const originalAlert = window.alert;
      window.alert = (msg: string) => {
        setAlertModal({
          isOpen: true,
          title: "Notifikasi",
          message: msg
        });
      };
      return () => {
        window.alert = originalAlert;
      };
    }
  }, [userName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstallment) return;

    setIsSubmittingPay(true);
    try {
      const payload: any = {
        method: paymentMethod,
        installment_idx: activeInstallment.instIdx,
        amount: activeInstallment.amount,
      };

      // Manual transfer option removed

      const res = await fetch(`http://127.0.0.1:8000/api/payments/${activeInstallment.paymentId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          if (paymentMethod === 'virtual_account') {
            setVaNumber(json.data.payment_proof);
          } else if (paymentMethod === 'qris') {
            setQrisUrl(json.data.payment_proof);
          } else {
            setPayModalOpen(false);
            alert('Konfirmasi bayar cash berhasil! Silakan lakukan pembayaran di tempat les.');
          }
          if (userName) fetchStudentPayments(userName);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsSubmittingPay(false);
    }
  };

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
            {(() => {
              const totalUnpaid = payments.reduce((acc, bill) => {
                if (!['paid', 'lunas'].includes(bill.status.toLowerCase())) {
                  const insts = typeof bill.installments === 'string' ? JSON.parse(bill.installments) : bill.installments;
                  if (Array.isArray(insts)) {
                    return acc + insts.reduce((sum, inst: any) => sum + (inst.amount || 0), 0);
                  }
                }
                return acc;
              }, 0);
              return (
                <div className="bg-[#EF5A3F] rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12" />
                  <h2 className="font-satoshi text-base sm:text-lg font-bold opacity-90 tracking-wide uppercase">
                    Total Tagihan yang belum di bayar
                  </h2>
                  <p className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-black mt-3 tracking-tight">
                    Rp {totalUnpaid.toLocaleString('id-ID')}
                  </p>
                </div>
              );
            })()}

            {/* Billings Details */}
            <div className="space-y-6">
              <h2 className="font-satoshi text-xl font-black text-slate-800 tracking-tight">
                Rincian Tagihan
              </h2>

              {loading ? (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center font-poppins text-slate-400 italic">
                  Sedang memuat tagihan...
                </div>
              ) : payments.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center font-poppins text-slate-400 italic">
                  Tidak ada tagihan aktif untuk akun Anda saat ini.
                </div>
              ) : (
                payments.map((bill) => {
                  const insts = typeof bill.installments === 'string' ? JSON.parse(bill.installments) : bill.installments;
                  return (
                    <div
                      key={bill.id}
                      className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 relative space-y-6 text-left"
                    >
                      {/* Top line with title and invoice */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="font-satoshi text-base sm:text-lg font-bold text-slate-800">
                            {bill.course_name}
                          </h3>
                          <p className="font-poppins text-[10px] text-slate-400 mt-1 font-medium">
                            Invoice: {bill.invoice_no} | ID: {bill.transaction_id}
                          </p>
                        </div>
                        <span className={`font-poppins text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                          ['paid', 'lunas'].includes(bill.status.toLowerCase())
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : bill.status.toLowerCase().includes('pending')
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : bill.status.toLowerCase().includes('verifying')
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}>
                          Status: {bill.status}
                        </span>
                      </div>

                      {/* Installments Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-satoshi text-xs font-black text-slate-400 uppercase tracking-wider">
                          Detail Pembayaran / Cicilan
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Array.isArray(insts) && insts.map((inst: any, idx: number) => {
                            // Check H-3 for due date to show alert warning if unpaid
                            const deadlineDate = new Date(inst.deadline);
                            const today = new Date();
                            const diffTime = deadlineDate.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const isH3 = diffDays <= 3 && diffDays >= 0 && !['paid', 'lunas'].includes(bill.status.toLowerCase());

                            return (
                              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-poppins text-xs font-bold text-slate-400 uppercase">
                                      Cicilan {idx + 1}
                                    </span>
                                    {isH3 && (
                                      <span className="bg-red-50 text-red-600 border border-red-200 font-poppins text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        Jatuh Tempo H-{diffDays}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-baseline">
                                    <span className="font-satoshi text-lg font-black text-slate-800">
                                      Rp {inst.amount.toLocaleString('id-ID')}
                                    </span>
                                    <span className="font-poppins text-[10px] text-slate-500 font-medium">
                                      Batas: {new Date(inst.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                    </span>
                                  </div>
                                </div>

                                {/* Installment Button */}
                                {(['paid', 'lunas'].includes(bill.status.toLowerCase())) ? (
                                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold font-poppins text-[10px] text-center py-2.5 rounded-xl uppercase tracking-wider">
                                    ✓ Lunas
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveInstallment({
                                        paymentId: bill.id,
                                        instIdx: idx,
                                        amount: inst.amount,
                                        deadline: inst.deadline
                                      });
                                      setVaNumber(null);
                                      setQrisUrl(null);
                                      setPayModalOpen(true);
                                    }}
                                    className="w-full bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold font-poppins text-[10px] text-center py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                                  >
                                    Bayar Cicilan
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
              
              {loading ? (
                <div className="text-center font-poppins text-xs text-slate-400 italic py-4">
                  Memuat riwayat...
                </div>
              ) : payments.filter(p => ['paid', 'lunas'].includes(p.status.toLowerCase())).length === 0 ? (
                <div className="text-center font-poppins text-xs text-slate-400 italic py-4">
                  Belum ada riwayat pembayaran lunas.
                </div>
              ) : (
                payments.filter(p => ['paid', 'lunas'].includes(p.status.toLowerCase())).map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-100 rounded-xl space-y-3 hover:border-slate-200 transition-colors text-left"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-poppins text-xs font-bold text-slate-700 leading-snug">
                          {item.course_name}
                        </p>
                        <p className="font-poppins text-[10px] text-slate-400 mt-1">
                          Metode: {item.payment_method || 'Cash'}
                        </p>
                      </div>
                      <span className="font-poppins text-xs font-bold text-emerald-600 flex-shrink-0">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))
              )}
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

      {/* ========================================================================= */}
      {/* MODAL: CHOOSE TRANSACTION METHOD */}
      {/* ========================================================================= */}
      {payModalOpen && activeInstallment && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center text-left flex-shrink-0">
              <div>
                <h3 className="font-satoshi text-lg font-black text-slate-800">Pilih Metode Pembayaran</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  Nominal: Rp {activeInstallment.amount.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSubmitPay} className="p-6 space-y-6 text-left overflow-y-auto flex-1">
              
              {/* Method Selector */}
              <div className="space-y-3">
                <label className="block font-poppins text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Metode Transaksi
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'virtual_account', label: 'Virtual Account', desc: 'BCA, Mandiri, BNI (Sandbox)' },
                    { id: 'qris', label: 'QRIS', desc: 'Gopay, OVO, Dana (Sandbox)' },
                    { id: 'cash', label: 'Cash / Bayar di Tempat', desc: 'Bayar langsung di tempat les' }
                  ].map(m => (
                    <label
                      key={m.id}
                      className={`p-4 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-all select-none ${
                        paymentMethod === m.id
                          ? "bg-[#4AC9CD]/5 border-[#4AC9CD] ring-1 ring-[#4AC9CD]"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          checked={paymentMethod === m.id}
                          onChange={() => {
                            setPaymentMethod(m.id);
                            setVaNumber(null);
                            setQrisUrl(null);
                          }}
                          className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                        />
                        <span className="font-poppins text-xs font-bold text-slate-700">
                          {m.label}
                        </span>
                      </div>
                      <span className="font-poppins text-[10px] text-slate-400 pl-6 leading-relaxed">
                        {m.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic UI Content based on chosen method */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                
                {/* 1. Virtual Account display */}
                {paymentMethod === 'virtual_account' && (
                  <div className="space-y-4">
                    {vaNumber ? (
                      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-5 text-center space-y-3">
                        <p className="font-poppins text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          Nomor Virtual Account Anda
                        </p>
                        <p className="font-satoshi text-2xl font-black text-[#EF5A3F] tracking-widest select-all">
                          {vaNumber}
                        </p>
                        <p className="font-poppins text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                          Harap lakukan transfer ke nomor Virtual Account di atas. Halaman ini akan otomatis diperbarui secara instan begitu pembayaran Anda berhasil diverifikasi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block font-poppins text-xs font-semibold text-slate-500">Pilih Bank</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 font-poppins text-xs bg-white cursor-pointer">
                          <option>BCA Virtual Account</option>
                          <option>Mandiri Virtual Account</option>
                          <option>BNI Virtual Account</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. QRIS display */}
                {paymentMethod === 'qris' && (
                  <div className="space-y-4 text-center">
                    {qrisUrl ? (
                      <div className="space-y-4">
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 w-48 h-48 mx-auto shadow-sm flex items-center justify-center">
                          <img src={qrisUrl} alt="QRIS Code" className="w-44 h-44 object-contain" />
                        </div>
                        <p className="font-poppins text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                          Pindai kode QRIS di atas menggunakan aplikasi pembayaran digital Anda. Halaman ini mendeteksi status transaksi secara real-time dan akan menutup otomatis ketika transaksi sukses.
                        </p>
                      </div>
                    ) : (
                      <p className="font-poppins text-xs text-slate-400 italic">
                        Kode QRIS dinamis akan di-generate secara otomatis setelah Anda mengklik tombol konfirmasi pembayaran.
                      </p>
                    )}
                  </div>
                )}

                {/* Manual Transfer display removed */}

                {/* 4. Cash display */}
                {paymentMethod === 'cash' && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 font-poppins text-xs text-slate-500 leading-relaxed space-y-2 text-left">
                    <p className="font-bold text-slate-700">Panduan Pembayaran Cash:</p>
                    <p>Silakan serahkan uang tunai/cash secara langsung kepada Admin di meja resepsionis tempat les.</p>
                    <p>Beri tahu Admin nama murid (<span className="font-bold text-slate-800">{userName}</span>) dan nominal tagihan (<span className="font-bold text-slate-800">Rp {activeInstallment.amount.toLocaleString('id-ID')}</span>).</p>
                    <p>Status tagihan di halaman ini akan berubah secara instan begitu Admin menekan tombol **Lunas Manual**.</p>
                  </div>
                )}

              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Batal
                </button>
                {(!vaNumber && !qrisUrl) && (
                  <button
                    type="submit"
                    disabled={isSubmittingPay}
                    className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md text-center uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmittingPay ? 'Memproses...' : 'Konfirmasi Bayar'}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOM ALERT/NOTIFICATION MODAL */}
      {/* ========================================================================= */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up border border-slate-100 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-satoshi text-base font-black text-slate-800">{alertModal.title}</h4>
              <p className="font-poppins text-xs text-slate-500 leading-relaxed">{alertModal.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
              className="w-full py-2.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
