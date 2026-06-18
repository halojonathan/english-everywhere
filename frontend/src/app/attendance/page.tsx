"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ClassSessionItem {
  id: number;
  teacher_id: number;
  program_series: string;
  specific_level?: string;
  classroom: string;
  date: string;
  start_time: string;
  end_time: string;
  teacher?: {
    name: string;
  };
}

interface StudentAttendance {
  id: number;
  name: string;
  status: "H" | "A" | "I" | null;
}

export default function TeacherAttendancePage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  // Schedules state
  const [sessions, setSessions] = useState<ClassSessionItem[]>([]);
  const [sessionAttendanceStatus, setSessionAttendanceStatus] = useState<Record<number, boolean>>({});

  // Active attendance marking session
  const [selectedSession, setSelectedSession] = useState<ClassSessionItem | null>(null);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: ""
  });

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUsername(localStorage.getItem("username"));
    setIsLoaded(true);
    fetchSchedules();

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
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/class-sessions");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setSessions(json.data);
          // Check attendance status for each session
          json.data.forEach((s: ClassSessionItem) => {
            checkSessionAttendance(s.id);
          });
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Loading mock sessions for teacher.");
      const mock = [
        { id: 1, teacher_id: 2, program_series: "Funny Phonics", specific_level: "Funny Phonics 1", classroom: "Room A", date: "2026-06-17", start_time: "09:00", end_time: "10:30" },
        { id: 2, teacher_id: 2, program_series: "Hi Kids!", specific_level: "Hi Kids! 1", classroom: "Room B", date: "2026-06-18", start_time: "11:00", end_time: "12:30" },
        { id: 3, teacher_id: 3, program_series: "Oxford Phonics", specific_level: "Oxford Phonics 2", classroom: "Room C", date: "2026-06-19", start_time: "14:00", end_time: "15:30" }
      ];
      setSessions(mock);
      setSessionAttendanceStatus({
        1: true,
        2: false,
        3: false
      });
    }
  };

  const checkSessionAttendance = async (sessionId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/class-sessions/${sessionId}/attendance`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data.students) {
          const marked = json.data.students.some((std: any) => std.status !== null);
          setSessionAttendanceStatus(prev => ({
            ...prev,
            [sessionId]: marked
          }));
        }
      }
    } catch (err) {
      // Keep fallback status
    }
  };

  const handleOpenAttendance = async (session: ClassSessionItem) => {
    setSelectedSession(session);
    setStudents([]);
    setIsAttendanceModalOpen(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/class-sessions/${session.id}/attendance`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setStudents(json.data.students);
        }
      }
    } catch (err) {
      console.warn("Backend not reachable. Loading mock students.");
      setStudents([
        { id: 11, name: "Abqary Ismail Winatra", status: null },
        { id: 12, name: "Abhiyazka Ramazan", status: null },
        { id: 13, name: "Adhyastha Cetta Franata", status: null }
      ]);
    }
  };

  const handleMarkStatus = (studentId: number, status: "H" | "A" | "I") => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    // Validation: check if all students have status marked
    const unmarked = students.filter(s => s.status === null);
    if (unmarked.length > 0) {
      alert("Harap tentukan status kehadiran untuk semua murid.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menyimpan data presensi ini?")) {
      return;
    }

    setIsSaving(true);
    const payload = {
      attendance: students.map(s => ({
        student_id: s.id,
        status: s.status
      }))
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/class-sessions/${selectedSession.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSessionAttendanceStatus(prev => ({
          ...prev,
          [selectedSession.id]: true
        }));
        setIsAttendanceModalOpen(false);
      }
    } catch (err) {
      console.warn("Backend not reachable. Saving locally.");
      setSessionAttendanceStatus(prev => ({
        ...prev,
        [selectedSession.id]: true
      }));
      setIsAttendanceModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-poppins">
        <p className="text-slate-500 font-medium">Loading portal...</p>
      </div>
    );
  }

  // Filter sessions based on pending vs completed
  const pendingSessions = sessions.filter(s => !sessionAttendanceStatus[s.id]);
  const completedSessions = sessions.filter(s => sessionAttendanceStatus[s.id]);
  const displayedSessions = activeTab === "pending" ? pendingSessions : completedSessions;

  return (
    <div className="min-h-screen bg-slate-50/50 font-poppins text-slate-700">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-slate-800 font-bold text-xs">{username || "Teacher Portal"}</p>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{role || "Guru"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#4AC9CD]/10 text-[#4AC9CD] flex items-center justify-center font-bold text-xs">
            {username ? username.substring(0, 2).toUpperCase() : "TC"}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-[#4AC9CD]/20 via-[#4AC9CD]/5 to-transparent border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
              Portal Presensi Guru
            </h1>
            <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-lg">
              Halo, {username || "Teacher"}. Silakan pilih kelas mengajar Anda hari ini untuk mengisi absensi kehadiran murid.
            </p>
          </div>
          <span className="text-5xl hidden sm:block">📝</span>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-100 pt-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === "pending"
                ? "border-[#4AC9CD] text-[#4AC9CD]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Presensi Menunggu ({pendingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeTab === "completed"
                ? "border-[#4AC9CD] text-[#4AC9CD]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Presensi Selesai ({completedSessions.length})
          </button>
        </div>

        {/* Class Session Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedSessions.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 italic">
              Tidak ada jadwal kelas yang ditemukan.
            </div>
          ) : (
            displayedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-slate-100 hover:border-[#4AC9CD]/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-3">
                  {/* Subject badge & Room */}
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-[#4AC9CD]/10 text-[#4AC9CD] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {session.program_series} {session.specific_level || ""}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {session.classroom}
                    </span>
                  </div>

                  {/* Title & Timing */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {session.program_series} Class
                    </h4>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{session.date} | {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Status: {sessionAttendanceStatus[session.id] ? "Selesai" : "Menunggu"}
                  </span>
                  <button
                    onClick={() => handleOpenAttendance(session)}
                    className={`px-4 py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer uppercase tracking-wider ${
                      sessionAttendanceStatus[session.id]
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        : "bg-[#4AC9CD] hover:bg-[#3db3b7] text-white shadow-sm shadow-teal-50"
                    }`}
                  >
                    {sessionAttendanceStatus[session.id] ? "Lihat Absensi" : "Isi Absensi"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Attendance Sheet Modal */}
      {isAttendanceModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center text-left">
              <div>
                <h3 className="font-satoshi text-lg font-black text-slate-800">
                  {sessionAttendanceStatus[selectedSession.id] ? "Detail Presensi" : "Lembar Presensi"}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  {selectedSession.program_series} {selectedSession.specific_level || ""} | {selectedSession.classroom}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Attendance List Form */}
            <form onSubmit={handleSaveAttendance} className="p-6 space-y-6">
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {students.length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-8">
                    Tidak ada murid yang terdaftar di kelas ini.
                  </p>
                ) : (
                  students.map((student) => (
                    <div
                      key={student.id}
                      className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left"
                    >
                      <span className="font-bold text-slate-700 text-xs truncate max-w-[50%]">
                        {student.name}
                      </span>
                      
                      {/* Attendance Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={sessionAttendanceStatus[selectedSession.id]}
                          onClick={() => handleMarkStatus(student.id, "H")}
                          className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                            student.status === "H"
                              ? "bg-green-500 text-white shadow-sm"
                              : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-150"
                          } ${sessionAttendanceStatus[selectedSession.id] ? "cursor-not-allowed" : "cursor-pointer"}`}
                          title="Hadir"
                        >
                          H
                        </button>
                        <button
                          type="button"
                          disabled={sessionAttendanceStatus[selectedSession.id]}
                          onClick={() => handleMarkStatus(student.id, "A")}
                          className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                            student.status === "A"
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-150"
                          } ${sessionAttendanceStatus[selectedSession.id] ? "cursor-not-allowed" : "cursor-pointer"}`}
                          title="Alpha"
                        >
                          A
                        </button>
                        <button
                          type="button"
                          disabled={sessionAttendanceStatus[selectedSession.id]}
                          onClick={() => handleMarkStatus(student.id, "I")}
                          className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                            student.status === "I"
                              ? "bg-amber-500 text-white shadow-sm"
                              : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-150"
                          } ${sessionAttendanceStatus[selectedSession.id] ? "cursor-not-allowed" : "cursor-pointer"}`}
                          title="Izin"
                        >
                          I
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Tutup
                </button>
                {!sessionAttendanceStatus[selectedSession.id] && (
                  <button
                    type="submit"
                    disabled={isSaving || students.length === 0}
                    className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md text-center uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
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
