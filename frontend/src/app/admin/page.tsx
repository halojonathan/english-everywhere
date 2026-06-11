"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

// Interface Definitions
interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "Upcoming" | "Past";
}

interface AccountItem {
  id: string;
  name: string;
  username: string;
  dob: string;
  status: "Active" | "Waiting List" | "Non Active";
  role: "Student" | "Teacher" | "Admin";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate] = useState("11 Juni 2026");

  // Navigation Tab State
  // Active tabs can be: "dashboard", "account", "events", "appointment", "applicant-data", "english-corner", "payments", "schedules"
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // ----------------------------------------------------
  // Core Events Data State
  // ----------------------------------------------------
  const [events, setEvents] = useState<EventItem[]>([
    { id: "e1", title: "Test Event", date: "24 Feb 2026", time: "13.00", location: "Bintaro", type: "Past" },
    { id: "e2", title: "Funtastic Build — Open House English Everywhere", date: "15 Jan 2026", time: "19.00", location: "Bintaro", type: "Past" },
    { id: "e3", title: "English Playdate: Cooking with Friends", date: "15 Jan 2026", time: "19.00", location: "Ciputat", type: "Past" },
    { id: "e4", title: "Holiday Prep: Christmas Carol Karaoke", date: "15 Jan 2026", time: "19.00", location: "Bintaro", type: "Past" },
    { id: "e5", title: "Speaking Club: New Year Resolutions", date: "15 Jan 2026", time: "19.00", location: "Pamulang", type: "Past" },
    { id: "e6", title: "Grammar Masterclass: Present Tense", date: "10 Jan 2026", time: "10.00", location: "Bintaro", type: "Past" },
    { id: "e7", title: "Reading Club: Fantastic Beasts", date: "05 Jan 2026", time: "14.00", location: "Ciputat", type: "Past" },
    { id: "e8", title: "Vocabulary Booster: Everyday Objects", date: "20 Dec 2025", time: "09.00", location: "Pamulang", type: "Past" },
    { id: "e9", title: "Pronunciation Clinic: Accent Training", date: "15 Dec 2025", time: "13.00", location: "Bintaro", type: "Past" },
    { id: "e10", title: "English for Business: Pitching Ideas", date: "10 Dec 2025", time: "16.00", location: "Ciputat", type: "Past" },
    { id: "e11", title: "Writing workshop: Creative Essays", date: "01 Dec 2025", time: "11.00", location: "Pamulang", type: "Past" },
    { id: "e12", title: "Debate Club: Technology & Society", date: "25 Nov 2025", time: "15.00", location: "Bintaro", type: "Past" },
    { id: "e13", title: "Listening practice: Movie Session", date: "18 Nov 2025", time: "18.30", location: "Ciputat", type: "Past" },
    { id: "e14", title: "English Fun Day 2025", date: "15 Aug 2025", time: "09.00", location: "Pamulang", type: "Past" },
    { id: "e15", title: "Summer Camp 2025 Completion Ceremony", date: "10 Aug 2025", time: "10.00", location: "Bintaro", type: "Past" },
  ]);

  // ----------------------------------------------------
  // Core Accounts Data State
  // ----------------------------------------------------
  const [accounts, setAccounts] = useState<AccountItem[]>([]);

  // Initialize accounts with mock data to total 168 (161 Students, 7 Teachers)
  useEffect(() => {
    const baseStudents: AccountItem[] = [
      { id: "s1", name: "Abhiyazka Ramazan", username: "Abhiyazka Ramazan", dob: "-", status: "Active", role: "Student" },
      { id: "s2", name: "Abqary Ismail Winatra", username: "Abqary Ismail Winatra", dob: "13/09/2016", status: "Active", role: "Student" },
      { id: "s3", name: "Adhyastha Cetta Franata", username: "Adhyastha Cetta Franata", dob: "27/12/2014", status: "Active", role: "Student" },
      { id: "s4", name: "Adhyastha R. Kamil", username: "Adhyastha R. Kamil", dob: "18/09/2015", status: "Waiting List", role: "Student" },
      { id: "s5", name: "Adinda Azzahra", username: "Adinda Azzahra", dob: "16/10/2013", status: "Non Active", role: "Student" },
      { id: "s6", name: "Aditya Prihartoko", username: "Aditya", dob: "11/09/1987", status: "Active", role: "Student" },
      { id: "s7", name: "Adnan Rafif Azis", username: "Adnan Rafif Azis", dob: "20/09/2016", status: "Active", role: "Student" },
    ];

    const baseTeachers: AccountItem[] = [
      { id: "t1", name: "English Teacher", username: "teacher", dob: "12/05/1990", status: "Active", role: "Teacher" },
      { id: "t2", name: "Sarah Jenkins", username: "sarah.j", dob: "24/08/1988", status: "Active", role: "Teacher" },
      { id: "t3", name: "Michael Smith", username: "michael.s", dob: "15/02/1985", status: "Active", role: "Teacher" },
      { id: "t4", name: "David Miller", username: "david.m", dob: "10/11/1992", status: "Active", role: "Teacher" },
      { id: "t5", name: "Emma Watson", username: "emma.w", dob: "15/04/1990", status: "Active", role: "Teacher" },
      { id: "t6", name: "James Bond", username: "james.b", dob: "07/07/1980", status: "Active", role: "Teacher" },
      { id: "t7", name: "John Doe", username: "john.d", dob: "01/01/1991", status: "Active", role: "Teacher" },
    ];

    const generatedStudentsCount = 161 - baseStudents.length; // 154
    const generatedStudents: AccountItem[] = [];

    // Names generator helper
    const firstNames = ["Alvaro", "Bima", "Carla", "Daniel", "Evelyn", "Fahri", "Gaby", "Hafiz", "Indah", "Joko", "Keisha", "Lutfi", "Mila", "Naufal", "Olivia", "Putra", "Rania", "Satria", "Talitha", "Yusuf"];
    const lastNames = ["Saputra", "Wibowo", "Kurniawan", "Sari", "Lestari", "Hidayat", "Nugroho", "Pratama", "Wijaya", "Utami", "Putri", "Rahmawati"];

    for (let i = 1; i <= generatedStudentsCount; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const fullName = `${fn} ${ln} ${i}`;
      const username = `${fn.toLowerCase()}.${ln.toLowerCase()}.${i}`;
      
      let status: "Active" | "Waiting List" | "Non Active" = "Active";
      if (i % 18 === 0) status = "Non Active";
      else if (i % 25 === 0) status = "Waiting List";

      generatedStudents.push({
        id: `gen-s-${i}`,
        name: fullName,
        username: username,
        dob: `${(1 + (i % 28)).toString().padStart(2, "0")}/${(1 + (i % 12)).toString().padStart(2, "0")}/${2010 + (i % 8)}`,
        status: status,
        role: "Student",
      });
    }

    setAccounts([...baseStudents, ...generatedStudents, ...baseTeachers]);
  }, []);

  // Sync auth state
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

  // ----------------------------------------------------
  // State for Event Modals / Filters
  // ----------------------------------------------------
  const [eventSearch, setEventSearch] = useState("");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState<"Upcoming" | "Past">("Past");

  // ----------------------------------------------------
  // State for Account Modals / Filters / Sort / Pagination
  // ----------------------------------------------------
  const [accountSearch, setAccountSearch] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("All Status");
  const [accountRoleFilter, setAccountRoleFilter] = useState<string>("All Role");
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<"create" | "edit">("create");
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);

  // Account Form State
  const [accName, setAccName] = useState("");
  const [accUsername, setAccUsername] = useState("");
  const [accDob, setAccDob] = useState("");
  const [accStatus, setAccStatus] = useState<"Active" | "Waiting List" | "Non Active">("Active");
  const [accRole, setAccRole] = useState<"Student" | "Teacher" | "Admin">("Student");

  // Sorting Account State
  const [accountSortField, setAccountSortField] = useState<keyof AccountItem>("name");
  const [accountSortDirection, setAccountSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination Account State
  const [accountPage, setAccountPage] = useState(1);
  const itemsPerPage = 7; // Matching mockup rows size beautifully

  // Reset pagination on search or filters
  useEffect(() => {
    setAccountPage(1);
  }, [accountSearch, accountStatusFilter, accountRoleFilter]);

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

  // ----------------------------------------------------
  // EVENT CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCreateEvent = () => {
    setEventModalMode("create");
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventType("Past");
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: EventItem) => {
    setEventModalMode("edit");
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventLocation(event.location);
    setEventType(event.type);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventTime || !eventLocation) {
      alert("Harap lengkapi semua kolom");
      return;
    }

    if (eventModalMode === "create") {
      const newEvent: EventItem = {
        id: `event-${Date.now()}`,
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        type: eventType,
      };
      setEvents([newEvent, ...events]);
    } else if (eventModalMode === "edit" && selectedEvent) {
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id
            ? { ...e, title: eventTitle, date: eventDate, time: eventTime, location: eventLocation, type: eventType }
            : e
        )
      );
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  // Filter Events
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const totalEventsCount = events.length;
  const upcomingEventsCount = events.filter((e) => e.type === "Upcoming").length;
  const pastEventsCount = events.filter((e) => e.type === "Past").length;

  // ----------------------------------------------------
  // ACCOUNT CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCreateAccount = () => {
    setAccountModalMode("create");
    setAccName("");
    setAccUsername("");
    setAccDob("");
    setAccStatus("Active");
    setAccRole("Student");
    setIsAccountModalOpen(true);
  };

  const handleOpenEditAccount = (acc: AccountItem) => {
    setAccountModalMode("edit");
    setSelectedAccount(acc);
    setAccName(acc.name);
    setAccUsername(acc.username);
    setAccDob(acc.dob);
    setAccStatus(acc.status);
    setAccRole(acc.role);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName || !accUsername) {
      alert("Nama dan Username wajib diisi");
      return;
    }

    if (accountModalMode === "create") {
      const newAccount: AccountItem = {
        id: `acc-${Date.now()}`,
        name: accName,
        username: accUsername,
        dob: accDob || "-",
        status: accStatus,
        role: accRole,
      };
      setAccounts([newAccount, ...accounts]);
    } else if (accountModalMode === "edit" && selectedAccount) {
      setAccounts(
        accounts.map((a) =>
          a.id === selectedAccount.id
            ? { ...a, name: accName, username: accUsername, dob: accDob || "-", status: accStatus, role: accRole }
            : a
        )
      );
    }
    setIsAccountModalOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  const handleSortAccount = (field: keyof AccountItem) => {
    if (accountSortField === field) {
      setAccountSortDirection(accountSortDirection === "asc" ? "desc" : "asc");
    } else {
      setAccountSortField(field);
      setAccountSortDirection("asc");
    }
  };

  // Filter & Sort Accounts
  const filteredAccounts = accounts
    .filter((acc) => {
      const matchesSearch =
        acc.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
        acc.username.toLowerCase().includes(accountSearch.toLowerCase()) ||
        acc.status.toLowerCase().includes(accountSearch.toLowerCase());

      const matchesStatus =
        accountStatusFilter === "All Status" || acc.status === accountStatusFilter;

      const matchesRole =
        accountRoleFilter === "All Role" || acc.role === accountRoleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      const valA = a[accountSortField].toLowerCase();
      const valB = b[accountSortField].toLowerCase();

      if (valA < valB) return accountSortDirection === "asc" ? -1 : 1;
      if (valA > valB) return accountSortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Dynamic Account Statistics
  const totalAccountsCount = accounts.length;
  const totalStudentsCount = accounts.filter((a) => a.role === "Student").length;
  const totalTeachersCount = accounts.filter((a) => a.role === "Teacher").length;

  // Paginated Accounts for Render
  const totalAccountPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (accountPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

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
            
            {/* Dashboard Button */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>

            {/* Account Button */}
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "account"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </button>

            {/* Appointment Button */}
            <button
              onClick={() => setActiveTab("appointment")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "appointment"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Appointment
            </button>

            {/* Applicant Data Button */}
            <button
              onClick={() => setActiveTab("applicant-data")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "applicant-data"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Applicant Data
            </button>

            {/* English Corner Button */}
            <button
              onClick={() => setActiveTab("english-corner")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "english-corner"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              English Corner
            </button>

            {/* Payments Button */}
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "payments"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h.01M11 15h2m0 0a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              Payments
            </button>

            {/* Events Button */}
            <button
              onClick={() => setActiveTab("events")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "events"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Events
            </button>

            {/* Schedules Button */}
            <button
              onClick={() => setActiveTab("schedules")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "schedules"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Schedules
            </button>

          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-bold transition-all text-left font-poppins text-sm cursor-pointer"
        >
          <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-100 h-20 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-poppins text-xs font-semibold text-slate-400 uppercase tracking-widest">
              ROLE: {userRole}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Date */}
            <div className="flex items-center gap-2 font-poppins text-xs text-slate-500 bg-slate-50 px-4 py-2.5 rounded-lg font-semibold border border-slate-100">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {currentDate}
            </div>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
              <div className="w-10 h-10 rounded-full bg-[#4AC9CD]/10 text-[#4AC9CD] flex items-center justify-center font-bold text-sm tracking-wide">
                SA
              </div>
              <div className="hidden sm:block font-poppins text-xs text-left">
                <p className="font-bold text-slate-800">System Administrator</p>
                <p className="text-slate-400 font-semibold">admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          
          {/* ========================================================================= */}
          {/* TAB: DASHBOARD VIEW */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <>
              {/* Main Title */}
              <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
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
                    {totalAccountsCount}
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
                        <th className="py-4 px-4 text-right">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      {events.slice(0, 3).map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-[#1E293B] flex items-center gap-2">
                            <span className="text-[#4AC9CD] text-sm">🎫</span> {e.title}
                          </td>
                          <td className="py-4 px-4 text-slate-500">{e.date}</td>
                          <td className="py-4 px-4 text-slate-500">{e.location}</td>
                          <td className="py-4 px-4 text-right">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-md ${
                              e.type === "Upcoming"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {e.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: EVENTS VIEW */}
          {/* ========================================================================= */}
          {activeTab === "events" && (
            <>
              {/* Header Title */}
              <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                Events
              </h1>

              {/* Stats Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="flex-1 pb-6 md:pb-0 md:pr-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    TOTAL EVENTS
                  </p>
                  <p className="font-satoshi text-4xl font-black text-slate-800 mt-2">
                    {totalEventsCount}
                  </p>
                </div>
                <div className="flex-1 py-6 md:py-0 md:px-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    UPCOMING
                  </p>
                  <p className="font-satoshi text-4xl font-black text-[#4AC9CD] mt-2">
                    {upcomingEventsCount}
                  </p>
                </div>
                <div className="flex-1 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    PAST EVENTS
                  </p>
                  <p className="font-satoshi text-4xl font-black text-slate-800 mt-2">
                    {pastEventsCount}
                  </p>
                </div>
              </div>

              {/* List Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                    List Events
                  </h3>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        placeholder="Search event..."
                        className="w-full sm:w-[260px] px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Create Button */}
                    <button
                      onClick={handleOpenCreateEvent}
                      className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Event
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-4 px-4">TITLE</th>
                        <th className="py-4 px-4">DATE</th>
                        <th className="py-4 px-4">TIME</th>
                        <th className="py-4 px-4">LOCATION</th>
                        <th className="py-4 px-4 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                            Tidak ada event yang ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((e) => (
                          <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-[#1E293B]">
                              {e.title}
                            </td>
                            <td className="py-4 px-4 text-slate-500">{e.date}</td>
                            <td className="py-4 px-4 text-slate-500">{e.time}</td>
                            <td className="py-4 px-4 text-slate-500">{e.location}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEditEvent(e)}
                                  className="w-8 h-8 rounded-lg bg-[#E6F7F8] hover:bg-[#D0F1F3] text-[#4AC9CD] flex items-center justify-center cursor-pointer transition-colors"
                                  title="Edit Event"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteEvent(e.id)}
                                  className="w-8 h-8 rounded-lg bg-[#FDF2F2] hover:bg-[#FDE8E8] text-[#EF777E] flex items-center justify-center cursor-pointer transition-colors"
                                  title="Hapus Event"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: ACCOUNT VIEW */}
          {/* ========================================================================= */}
          {activeTab === "account" && (
            <>
              {/* Header Title */}
              <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                Account
              </h1>

              {/* Stats Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="flex-1 pb-6 md:pb-0 md:pr-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Account
                  </p>
                  <p className="font-satoshi text-4xl font-black text-slate-800 mt-2">
                    {totalAccountsCount}
                  </p>
                </div>
                <div className="flex-1 py-6 md:py-0 md:px-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Student
                  </p>
                  <p className="font-satoshi text-4xl font-black text-slate-800 mt-2">
                    {totalStudentsCount}
                  </p>
                </div>
                <div className="flex-1 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                  <p className="font-poppins text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Teacher
                  </p>
                  <p className="font-satoshi text-4xl font-black text-slate-800 mt-2">
                    {totalTeachersCount}
                  </p>
                </div>
              </div>

              {/* List Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                    List Account's
                  </h3>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-initial">
                      <input
                        type="text"
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        placeholder="Search by name, username or status."
                        className="w-full sm:w-[280px] px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Status Filter */}
                    <select
                      value={accountStatusFilter}
                      onChange={(e) => setAccountStatusFilter(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-700 cursor-pointer"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Waiting List">Waiting List</option>
                      <option value="Non Active">Non Active</option>
                    </select>

                    {/* Role Filter */}
                    <select
                      value={accountRoleFilter}
                      onChange={(e) => setAccountRoleFilter(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-700 cursor-pointer"
                    >
                      <option value="All Role">All Role</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>

                    {/* Create Button */}
                    <button
                      onClick={handleOpenCreateAccount}
                      className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-4 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Account +
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th onClick={() => handleSortAccount("name")} className="py-4 px-4 cursor-pointer hover:bg-slate-50/50 select-none">
                          Name <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("username")} className="py-4 px-4 cursor-pointer hover:bg-slate-50/50 select-none">
                          Username <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("dob")} className="py-4 px-4 cursor-pointer hover:bg-slate-50/50 select-none">
                          Date of Birth <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("status")} className="py-4 px-4 cursor-pointer hover:bg-slate-50/50 select-none">
                          Status <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("role")} className="py-4 px-4 cursor-pointer hover:bg-slate-50/50 select-none">
                          Role <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th className="py-4 px-4 text-center select-none">
                          Action <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      {paginatedAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            Tidak ada akun yang ditemukan.
                          </td>
                        </tr>
                      ) : (
                        paginatedAccounts.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-[#1E293B]">{a.name}</td>
                            <td className="py-4 px-4 text-slate-500">{a.username}</td>
                            <td className="py-4 px-4 text-slate-500">{a.dob}</td>
                            <td className="py-4 px-4 text-slate-800">{a.status}</td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border ${
                                a.role === "Student"
                                  ? "bg-indigo-50/80 text-indigo-600 border-indigo-100"
                                  : a.role === "Teacher"
                                  ? "bg-emerald-50/80 text-emerald-600 border-emerald-100"
                                  : "bg-rose-50/80 text-rose-600 border-rose-100"
                              }`}>
                                {a.role}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEditAccount(a)}
                                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                                  title="Edit Akun"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteAccount(a.id)}
                                  className="w-8 h-8 rounded-lg bg-[#FDF2F2] hover:bg-[#FDE8E8] border border-red-100 text-[#EF777E] flex items-center justify-center cursor-pointer transition-colors"
                                  title="Hapus Akun"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredAccounts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50 font-poppins text-xs text-slate-500 font-semibold">
                    <p>
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} entries
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        disabled={accountPage === 1}
                        onClick={() => setAccountPage(accountPage - 1)}
                        className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white cursor-pointer select-none transition-colors"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalAccountPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAccountPage(idx + 1)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer select-none transition-colors border ${
                            accountPage === idx + 1
                              ? "bg-[#4AC9CD] border-[#4AC9CD] text-white font-bold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        disabled={accountPage === totalAccountPages}
                        onClick={() => setAccountPage(accountPage + 1)}
                        className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white cursor-pointer select-none transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: GENERAL PLACEHOLDER VIEW (FOR TABS NOT REQUESTED YET) */}
          {/* ========================================================================= */}
          {activeTab !== "dashboard" && activeTab !== "events" && activeTab !== "account" && (
            <div className="min-h-[400px] bg-white border border-slate-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
              <span className="text-5xl">🛠️</span>
              <h2 className="font-satoshi text-2xl font-black text-slate-800 uppercase tracking-tight">
                Menu {activeTab.replace("-", " ")}
              </h2>
              <p className="font-poppins text-sm text-slate-400 max-w-md leading-relaxed font-medium">
                Halaman admin ini sedang dalam tahap pengembangan. Fitur ini akan segera tersedia pada pembaruan berikutnya.
              </p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-6 rounded-xl transition-all font-poppins text-xs shadow-md"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT EVENT */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-satoshi text-lg font-black text-slate-800">
                {eventModalMode === "create" ? "Create New Event" : "Edit Event Details"}
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Test Event"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Event Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Date</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. 24 Feb 2026"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Time</label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 13.00"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Event Location */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Location</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Bintaro"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Event Type (Upcoming/Past) */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Event Category</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-poppins text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="eventType"
                      checked={eventType === "Past"}
                      onChange={() => setEventType("Past")}
                      className="text-[#4AC9CD] focus:ring-[#4AC9CD]"
                    />
                    Past Event
                  </label>
                  <label className="flex items-center gap-2 font-poppins text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="eventType"
                      checked={eventType === "Upcoming"}
                      onChange={() => setEventType("Upcoming")}
                      className="text-[#4AC9CD] focus:ring-[#4AC9CD]"
                    />
                    Upcoming Event
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-poppins text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs cursor-pointer shadow-md"
                >
                  Save Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT ACCOUNT */}
      {/* ========================================================================= */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-satoshi text-lg font-black text-slate-800">
                {accountModalMode === "create" ? "Create New Account" : "Edit Account details"}
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAccount} className="p-6 space-y-4">
              
              {/* Account Name */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. Abhiyazka Ramazan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Username</label>
                <input
                  type="text"
                  required
                  value={accUsername}
                  onChange={(e) => setAccUsername(e.target.value)}
                  placeholder="e.g. abhiyazka.ramazan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Date of Birth</label>
                <input
                  type="text"
                  value={accDob}
                  onChange={(e) => setAccDob(e.target.value)}
                  placeholder="e.g. 13/09/2016 or - for none"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Role & Status selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Role</label>
                  <select
                    value={accRole}
                    onChange={(e) => setAccRole(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Status</label>
                  <select
                    value={accStatus}
                    onChange={(e) => setAccStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Waiting List">Waiting List</option>
                    <option value="Non Active">Non Active</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-poppins text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs cursor-pointer shadow-md"
                >
                  Save Account
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
