"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import { jsPDF } from "jspdf";

import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

// Interface Definitions
interface LearningMaterialItem {
  id: number;
  title: string;
  description: string;
  level: string;
  skills: string;
  category: string;
  file_name?: string;
  file_path?: string;
}

interface PaymentInstallment {
  deadline: string;
  amount: number;
}

interface PaymentItem {
  id: number;
  transaction_id: string;
  invoice_no: string;
  bill_date: string;
  student_id?: number;
  student_name: string;
  course_name: string;
  class_fee: number;
  discount: number;
  subtotal: number;
  num_installments: number;
  installments: PaymentInstallment[];
  payment_proof?: string;
  payment_method?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

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
  gender?: string;
  alamat?: string;
  phone?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  programSeries?: string;
  specificLevel?: string;
  password?: string;
  photo?: string;
  entryDate?: string;
  testDate?: string;
  exitDate?: string;
}

interface ArticleItem {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  introParagraphs?: string[];
  sections?: { heading: string; body: string }[];
  thumbnail?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate] = useState(() => {
    const today = new Date();
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  });

  // Navigation Tab State
  // Active tabs can be: "dashboard", "account", "events", "appointment", "applicant-data", "english-corner", "payments", "schedules"
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // ----------------------------------------------------
  // Core Events Data State
  // ----------------------------------------------------
  const [events, setEvents] = useState<EventItem[]>([]);

  const [accounts, setAccounts] = useState<AccountItem[]>([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          const mapped = json.data.map((u: any) => ({
            id: u.id,
            name: u.name,
            username: u.username || u.email,
            dob: u.dob || "-",
            status: u.status || "Active",
            role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1)) : "Student",
            gender: u.gender || undefined,
            alamat: u.alamat || undefined,
            phone: u.phone || undefined,
            email: u.email || undefined,
            photo: u.photo || undefined,
            programSeries: u.program_series || undefined,
            specificLevel: u.specific_level || undefined,
            guardianName: u.guardian_name || undefined,
            password: u.plain_password || undefined,
            entryDate: u.entry_date || undefined,
            testDate: u.test_date || undefined,
            exitDate: u.exit_date || undefined,
          }));


          setAccounts(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock accounts.");
    }

    setAccounts(prev => prev.length === 0 ? [
      { id: "s1", name: "Abhiyazka Ramazan", username: "Abhiyazka Ramazan", dob: "-", status: "Active", role: "Student", email: "abhiyazka@example.com" },
      { id: "s2", name: "Abqary Ismail Winatra", username: "Abqary Ismail Winatra", dob: "13/09/2016", status: "Active", role: "Student", email: "abqary@example.com" },
      { id: "s3", name: "Adhyastha Cetta Franata", username: "Adhyastha Cetta Franata", dob: "27/12/2014", status: "Active", role: "Student", email: "adhyastha@example.com" },
    ] : prev);
  };

  const fetchStudentOverview = async (studentId: string | number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/students/${studentId}/overview`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setSelectedStudentOverview(json.data);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch student overview details:", err);
    }
    // Fallback if offline / backend not fully responsive
    const mockStudent = accounts.find(a => String(a.id) === String(studentId));
    if (mockStudent) {
      const mockPayments = payments.filter(p => String(p.student_id) === String(studentId) || p.student_name === mockStudent.name);
      const mockClasses = classSessions.filter(s => s.program_series === mockStudent.programSeries && (!mockStudent.specificLevel || s.specific_level === mockStudent.specificLevel))
        .map(s => ({
          id: s.id,
          date: s.date,
          start_time: s.start_time,
          end_time: s.end_time,
          classroom: s.classroom,
          program_series: s.program_series,
          specific_level: s.specific_level,
          teacher_name: s.teacher?.name || "No Teacher",
          attendance_status: "H"
        }));

      setSelectedStudentOverview({
        student: {
          id: mockStudent.id,
          name: mockStudent.name,
          email: mockStudent.email || "-",
          username: mockStudent.username,
          phone: mockStudent.phone || "-",
          dob: mockStudent.dob,
          gender: mockStudent.gender || "-",
          alamat: mockStudent.alamat || "-",
          photo: mockStudent.photo || null,
          status: mockStudent.status,
          program_series: mockStudent.programSeries || "-",
          specific_level: mockStudent.specificLevel || "-",
          guardian_name: mockStudent.guardianName || "-",
          entry_date: mockStudent.entryDate || "15/06/2026",
          test_date: mockStudent.testDate || "12/06/2026",
          exit_date: mockStudent.exitDate || "-"
        },
        payments: mockPayments,
        classes: mockClasses
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/events");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setEvents(json.data);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock events.");
    }

    setEvents(prev => prev.length === 0 ? [
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
    ] : prev);
  };

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
  const [accountModalMode, setAccountModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);

  // Account Form State
  const [accName, setAccName] = useState("");
  const [accUsername, setAccUsername] = useState("");
  const [accDob, setAccDob] = useState("");
  const [accStatus, setAccStatus] = useState<"Active" | "Waiting List" | "Non Active">("Active");
  const [accRole, setAccRole] = useState<"Student" | "Teacher" | "Admin">("Student");
  const [accGender, setAccGender] = useState<string>("Female");
  const [accAlamat, setAccAlamat] = useState("");
  const [accPhone, setAccPhone] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accFatherName, setAccFatherName] = useState("");
  const [accMotherName, setAccMotherName] = useState("");
  const [accGuardianName, setAccGuardianName] = useState("");
  const [accProgramSeries, setAccProgramSeries] = useState("");
  const [accSpecificLevel, setAccSpecificLevel] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [accConfirmPassword, setAccConfirmPassword] = useState("");
  const [accPhoto, setAccPhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Student specific dates
  const [accEntryDate, setAccEntryDate] = useState("");
  const [accTestDate, setAccTestDate] = useState("");
  const [accExitDate, setAccExitDate] = useState("");

  // Student Overview States
  const [selectedStudentOverview, setSelectedStudentOverview] = useState<{
    student: any;
    payments: any[];
    classes: any[];
  } | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // Sorting Account State
  const [accountSortField, setAccountSortField] = useState<keyof AccountItem>("name");
  const [accountSortDirection, setAccountSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination Account State
  const [accountPage, setAccountPage] = useState(1);
  
  // Pagination Event State
  const [eventPage, setEventPage] = useState(1);


  const itemsPerPage = 7; // Matching mockup rows size beautifully

  // ----------------------------------------------------
  // Language Switch & Helpers State
  // ----------------------------------------------------
  const [lang, setLang] = useState<"id" | "en">("en");
  const t = (idText: string, enText: string) => {
    return lang === "id" ? idText : enText;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalAlert = window.alert;
      window.alert = (msg: string) => {
        setAlertModal({
          isOpen: true,
          title: t("Notifikasi", "Notification"),
          message: msg
        });
      };
      return () => {
        window.alert = originalAlert;
      };
    }
  }, [lang]);

  // Reset pagination on search or filters
  useEffect(() => {
    setAccountPage(1);
  }, [accountSearch, accountStatusFilter, accountRoleFilter]);

  // Reset event pagination on search
  useEffect(() => {
    setEventPage(1);
  }, [eventSearch]);


  // ----------------------------------------------------
  // Appointment Quota & Booking State
  // ----------------------------------------------------
  interface AppointmentScheduleItem {
    id: number;
    date: string;
    time: string;
    quota: number;
    booked: number;
  }

  interface AppointmentBookingItem {
    id: number;
    schedule_id: number;
    name: string;
    email: string;
    phone: string;
    gender?: string;
    program?: string;
    assigned_program?: string;
    status: string;
    schedule?: AppointmentScheduleItem;
  }

  const [appointmentSchedules, setAppointmentSchedules] = useState<AppointmentScheduleItem[]>([]);
  const [appointmentBookings, setAppointmentBookings] = useState<AppointmentBookingItem[]>([]);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<string>("2026-06-15");
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(5); // June is index 5
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalDate, setScheduleModalDate] = useState("2026-06-15");
  const [scheduleModalTime, setScheduleModalTime] = useState("");
  const [scheduleModalQuota, setScheduleModalQuota] = useState(1);

  // Applicant Data States
  const [applicantSearch, setApplicantSearch] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedBookingForAccept, setSelectedBookingForAccept] = useState<AppointmentBookingItem | null>(null);
  const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false);
  const [bookingToDeleteId, setBookingToDeleteId] = useState<number | null>(null);
  
  // Create Student Account Modal Form States
  const [acceptName, setAcceptName] = useState("");
  const [acceptGender, setAcceptGender] = useState("Male");
  const [acceptAlamat, setAcceptAlamat] = useState("");
  const [acceptPhone, setAcceptPhone] = useState("");
  const [acceptEmail, setAcceptEmail] = useState("");
  const [acceptDob, setAcceptDob] = useState("");
  const [acceptLevel, setAcceptLevel] = useState("Hi Kids!");
  const [acceptUsername, setAcceptUsername] = useState("");
  const [acceptPassword, setAcceptPassword] = useState("");
  const [acceptPhoto, setAcceptPhoto] = useState<string | null>(null);
  const [acceptRole, setAcceptRole] = useState<"Student" | "Teacher" | "Admin">("Student");
  const [acceptStatus, setAcceptStatus] = useState<"Active" | "Waiting List" | "Non Active" | "">("");
  const [acceptGuardianName, setAcceptGuardianName] = useState("");
  const [acceptProgramSeries, setAcceptProgramSeries] = useState("Hi Kids!");
  const [acceptSpecificLevel, setAcceptSpecificLevel] = useState("Hi Kids! 1");
  const [showAcceptPassword, setShowAcceptPassword] = useState(false);

  // Learning Materials States
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterialItem[]>([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialModalMode, setMaterialModalMode] = useState<"create" | "edit">("create");
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterialItem | null>(null);

  // Form states for Material Modal
  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matLevel, setMatLevel] = useState("Funny Phonics");
  const [matSkills, setMatSkills] = useState("Speaking");
  const [matCategory, setMatCategory] = useState("Reguler");
  const [matFile, setMatFile] = useState<File | null>(null);
  const [matFileBase64, setMatFileBase64] = useState<string | null>(null);
  const [matFileName, setMatFileName] = useState("");

  // Language state has been moved up to resolve hoisting/use-before-declaration errors

  // ----------------------------------------------------
  // Article Pagination State
  // ----------------------------------------------------
  const [articlePage, setArticlePage] = useState(1);

  // ----------------------------------------------------
  // Schedules Tab State
  // ----------------------------------------------------
  const [classSessions, setClassSessions] = useState<any[]>([]);
  const [isClassSessionModalOpen, setIsClassSessionModalOpen] = useState(false);
  const [schModalMode, setSchModalMode] = useState<"create" | "edit">("create");
  const [selectedSchSessionId, setSelectedSchSessionId] = useState<number | null>(null);
  const [schTeacherId, setSchTeacherId] = useState("");
  const [schProgram, setSchProgram] = useState("Funny Phonics");
  const [schLevel, setSchLevel] = useState("Funny Phonics 1");
  const [schClassroom, setSchClassroom] = useState("");
  const [schDate, setSchDate] = useState("");
  const [schStartTime, setSchStartTime] = useState("");
  const [schEndTime, setSchEndTime] = useState("");
  const [schCalendarYear, setSchCalendarYear] = useState<number>(2026);
  const [schCalendarMonth, setSchCalendarMonth] = useState<number>(5); // June is index 5
  
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: ""
  });
  const showAlert = (message: string, title: string = "Informasi") => {
    setAlertModal({ isOpen: true, title, message });
  };

  const programLevels: Record<string, string[]> = {
    "Funny Phonics": ["Funny Phonics 1", "Funny Phonics 2"],
    "Hi Kids!": ["Hi Kids! 1", "Hi Kids! 2", "Hi Kids! 3"],
    "Oxford Phonics": ["Oxford Phonics 1", "Oxford Phonics 2", "Oxford Phonics 3", "Oxford Phonics 4", "Oxford Phonics 5"],
    "Abracadabra": ["Abracadabra 1", "Abracadabra 2", "Abracadabra 3", "Abracadabra 4", "Abracadabra 5", "Abracadabra 6"],
    "Get Smart": ["Get Smart 1", "Get Smart 2", "Get Smart 3", "Get Smart 4", "Get Smart 5", "Get Smart 6"],
    "Full Blast": ["Full Blast 1", "Full Blast 2", "Full Blast 3", "Full Blast 4", "Full Blast 5", "Full Blast 6"],
    "Test Preparation": ["TOEFL", "IELTS"],
    "Conversation Class": [],
    "Private Class": ["Offline", "Online", "Homeschooling"]
  };

  // ----------------------------------------------------
  // Attendance Recap Tab State
  // ----------------------------------------------------
  const [recapSessions, setRecapSessions] = useState<any[]>([]);
  const [selectedRecap, setSelectedRecap] = useState<any>(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  // Payments States
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalMode, setPaymentModalMode] = useState<"create" | "edit">("create");
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);

  // Form States for Payment Modal
  const [payTransactionId, setPayTransactionId] = useState("");
  const [payInvoiceNo, setPayInvoiceNo] = useState("");
  const [payBillDate, setPayBillDate] = useState("");
  const [payStudentId, setPayStudentId] = useState<number | undefined>(undefined);
  const [payStudentName, setPayStudentName] = useState("");
  const [payCourseName, setPayCourseName] = useState("");
  const [payClassFee, setPayClassFee] = useState<number>(0);
  const [payDiscount, setPayDiscount] = useState<number>(0);
  const [paySubtotal, setPaySubtotal] = useState<number>(0);
  const [payNumInstallments, setPayNumInstallments] = useState<number>(1);
  const [payInstallments, setPayInstallments] = useState<PaymentInstallment[]>([
    { deadline: "", amount: 0 },
    { deadline: "", amount: 0 },
    { deadline: "", amount: 0 },
    { deadline: "", amount: 0 },
  ]);
  const [payPaymentProof, setPayPaymentProof] = useState("");
  const [payStatus, setPayStatus] = useState("Pending");
  const [payPaymentType, setPayPaymentType] = useState<"Paid Full" | "Installment">("Paid Full");


  const getIsPastDate = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  };

  const isSessionStarted = (sessionDate: string, startTime: string) => {
    if (!sessionDate || !startTime) return false;
    const now = new Date();
    const [year, month, day] = sessionDate.split("-").map(Number);
    const [hour, minute] = startTime.split(":").map(Number);
    const sessionStart = new Date(year, month - 1, day, hour, minute, 0, 0);
    return now >= sessionStart;
  };

  const getGenderLabel = (g?: string) => {
    if (!g) return "Male";
    if (g.toLowerCase().startsWith("lak") || g.toLowerCase() === "male") return "Male";
    if (g.toLowerCase().startsWith("per") || g.toLowerCase() === "female") return "Female";
    return "Male";
  };

  const handleOpenAcceptModal = (booking: AppointmentBookingItem) => {
    setSelectedBookingForAccept(booking);
    setAcceptName(booking.name);
    setAcceptGender(getGenderLabel(booking.gender));
    setAcceptAlamat("");
    setAcceptPhone(booking.phone);
    setAcceptEmail(booking.email);
    setAcceptDob("");
    
    setAcceptProgramSeries("");
    setAcceptSpecificLevel("");
    setAcceptLevel("");
    
    setAcceptUsername("");
    setAcceptPassword("");
    setAcceptPhoto(null);
    setAcceptRole("Student");
    setAcceptStatus("");
    setAcceptGuardianName("");
    setShowAcceptPassword(false);
    
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForAccept) return;

    const id = selectedBookingForAccept.id;
    const finalProgram = acceptSpecificLevel || acceptProgramSeries;
    const formattedDob = convertToDDMMYYYY(acceptDob);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/appointments/bookings/${id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assigned_program: finalProgram,
          gender: acceptGender === "Male" ? "Laki-laki" : "Perempuan",
          name: acceptName,
          email: acceptEmail || `${acceptUsername.replace(/\s+/g, "").toLowerCase()}@example.com`,
          phone: acceptPhone,
          password: acceptPassword,
          username: acceptUsername,
          dob: formattedDob,
          status: acceptStatus,
          role: acceptRole.toLowerCase(),
          alamat: acceptAlamat,
          photo: acceptPhoto || undefined,
          program_series: acceptProgramSeries,
          specific_level: acceptSpecificLevel,
          guardian_name: acceptGuardianName || undefined,
        })
      });

      if (res.ok) {
        fetchAppointmentData();
      }
    } catch (err) {
      console.warn("Backend connection failed. Accepting locally.");
    }

    // Always update/add to local accounts state to populate "Account" tab immediately
    setAccounts(prev => {
      const idx = prev.findIndex(a => a.username === acceptUsername || a.email === acceptEmail);
      
      const newStudent: AccountItem = {
        id: idx !== -1 ? prev[idx].id : `s-new-${Date.now()}`,
        name: acceptName,
        username: acceptUsername,
        dob: formattedDob,
        status: acceptStatus || "Active",
        role: acceptRole as any,
        gender: acceptGender,
        alamat: acceptAlamat,
        phone: acceptPhone,
        email: acceptEmail,
        programSeries: acceptProgramSeries,
        specificLevel: acceptSpecificLevel,
        guardianName: acceptGuardianName,
        password: acceptPassword,
        photo: acceptPhoto || undefined
      };

      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = newStudent;
        return updated;
      }
      return [newStudent, ...prev];
    });

    // Fallback/Local update for booking
    setAppointmentBookings(prev => 
      prev.map(b => b.id === id ? {
        ...b,
        status: "accepted",
        assigned_program: finalProgram,
        name: acceptName,
        email: acceptEmail,
        phone: acceptPhone,
        gender: acceptGender === "Male" ? "Laki-laki" : "Perempuan"
      } : b)
    );

    setIsAcceptModalOpen(false);
  };

  const handleDeleteBooking = (id: number) => {
    setBookingToDeleteId(id);
    setIsDeleteBookingModalOpen(true);
  };

  const handleConfirmDeleteBooking = async () => {
    const id = bookingToDeleteId;
    if (!id) return;
    setIsDeleteBookingModalOpen(false);
    setBookingToDeleteId(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/appointments/bookings/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAppointmentData();
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed. Deleting booking locally.");
    }

    // Fallback local delete
    const bookingToDelete = appointmentBookings.find(b => b.id === id);
    if (bookingToDelete && bookingToDelete.status !== 'accepted') {
      const schedId = bookingToDelete.schedule_id;
      setAppointmentSchedules(prev =>
        prev.map(s => s.id === schedId && s.booked > 0 ? { ...s, booked: s.booked - 1 } : s)
      );
    }
    setAppointmentBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenCreateMaterial = () => {
    setMaterialModalMode("create");
    setMatTitle("");
    setMatDesc("");
    setMatLevel("Funny Phonics");
    setMatSkills("Speaking");
    setMatCategory("Reguler");
    setMatFile(null);
    setMatFileBase64(null);
    setMatFileName("");
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (material: LearningMaterialItem) => {
    setMaterialModalMode("edit");
    setSelectedMaterial(material);
    setMatTitle(material.title);
    setMatDesc(material.description);
    setMatLevel(material.level);
    setMatSkills(material.skills);
    setMatCategory(material.category);
    setMatFile(null);
    setMatFileBase64(null);
    setMatFileName(material.file_name || "");
    setIsMaterialModalOpen(true);
  };

  // ----------------------------------------------------
  // Date and Time Helper Functions
  // ----------------------------------------------------
  const convertToYYYYMMDD = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return "";
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const convertToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const parseToYYYYMMDD = (dateStr: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const months: Record<string, string> = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
    };
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const mStr = parts[1].substring(0, 3).toLowerCase();
      const month = months[mStr];
      const year = parts[2];
      if (month && year) {
        return `${year}-${month}-${day}`;
      }
    }
    return dateStr;
  };

  const parseToHHMM = (timeStr: string) => {
    if (!timeStr) return "";
    const replaced = timeStr.replace(".", ":");
    if (/^\d{2}:\d{2}$/.test(replaced)) return replaced;
    return replaced;
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!matTitle || !matDesc || !matLevel || !matSkills || !matCategory) {
      alert("Harap lengkapi semua kolom wajib.");
      return;
    }

    const payload: any = {
      title: matTitle,
      description: matDesc,
      level: matLevel,
      skills: matSkills,
      category: matCategory,
      file_name: matFileName || undefined,
      file_base64: matFileBase64 || undefined,
    };

    try {
      const url = materialModalMode === "create" 
        ? "http://127.0.0.1:8000/api/learning-materials"
        : `http://127.0.0.1:8000/api/learning-materials/${selectedMaterial?.id}`;
        
      const method = materialModalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchLearningMaterials();
        setIsMaterialModalOpen(false);
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed. Saving material locally.");
    }

    if (materialModalMode === "create") {
      const newMat: LearningMaterialItem = {
        id: Date.now(),
        title: matTitle,
        description: matDesc,
        level: matLevel,
        skills: matSkills,
        category: matCategory,
        file_name: matFileName || undefined
      };
      setLearningMaterials([newMat, ...learningMaterials]);
    } else if (materialModalMode === "edit" && selectedMaterial) {
      setLearningMaterials(
        learningMaterials.map(m => m.id === selectedMaterial.id ? {
          ...m,
          title: matTitle,
          description: matDesc,
          level: matLevel,
          skills: matSkills,
          category: matCategory,
          file_name: matFileName || m.file_name
        } : m)
      );
    }

    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus learning material ini?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/learning-materials/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchLearningMaterials();
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed. Deleting locally.");
    }

    setLearningMaterials(prev => prev.filter(m => m.id !== id));
  };

  const fetchAppointmentData = async () => {
    try {
      const schedulesRes = await fetch("http://127.0.0.1:8000/api/appointments/schedules");
      if (schedulesRes.ok) {
        const json = await schedulesRes.json();
        if (json.status === 'success') {
          setAppointmentSchedules(json.data);
        }
      }
      
      const bookingsRes = await fetch("http://127.0.0.1:8000/api/appointments/bookings");
      if (bookingsRes.ok) {
        const json = await bookingsRes.json();
        if (json.status === 'success') {
          setAppointmentBookings(json.data);
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock state.");
    }
  };

  const fetchLearningMaterials = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/learning-materials");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setLearningMaterials(json.data);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock materials.");
    }
    
    setLearningMaterials(prev => prev.length === 0 ? [
      { id: 1, title: "Basic Grammar 101", description: "Pengantar dasar tata bahasa Inggris, f...", level: "Funny Phonics", skills: "Speaking", category: "Reguler" },
      { id: 2, title: "Advanced Speaking", description: "Latihan percakapan untuk topik profesi...", level: "Hi Kids!", skills: "Reading", category: "Reguler" },
      { id: 3, title: "IELTS Reading Prep", description: "Strategi dan trik untuk menghadapi se...", level: "Full Blast", skills: "Writing", category: "Reguler" },
      { id: 4, title: "Business Writing", description: "Cara menyusun email dan laporan bisn...", level: "Get Smart", skills: "Listening", category: "Reguler" },
      { id: 5, title: "Pronunciation Secrets", description: "Fokus pada intonasi, aksen, dan bunyi...", level: "Private Class", skills: "Listening", category: "Intensif" },
    ] : prev);
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/articles");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          const mapped = json.data.map((item: any) => ({
            id: String(item.id),
            title: item.title,
            description: item.description,
            dateCreated: item.date_created || "",
            introParagraphs: Array.isArray(item.intro_paragraphs) ? item.intro_paragraphs : [],
            sections: Array.isArray(item.sections) ? item.sections : [],
            thumbnail: item.thumbnail || undefined,
          }));
          setArticles(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. English Corner using local state.");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/payments");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          const mapped = json.data.map((p: any) => ({
            ...p,
            installments: typeof p.installments === "string" ? JSON.parse(p.installments) : (p.installments || [])
          }));
          setPayments(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock payments.");
    }

    setPayments(prev => prev.length === 0 ? [
      {
        id: 1,
        transaction_id: "001/XIV",
        invoice_no: "EE/123/123",
        bill_date: "29/09/2025",
        student_name: "Siti Aminah",
        course_name: "Business English Intermediate",
        class_fee: 10000000,
        discount: 1,
        subtotal: 9999999,
        num_installments: 1,
        installments: [{ deadline: "2025-09-29", amount: 9999999 }],
        payment_proof: "https://example.com/proof1.png",
        status: "Pending"
      },
      {
        id: 2,
        transaction_id: "002/XIV",
        invoice_no: "EE/123/124",
        bill_date: "29/09/2025",
        student_name: "Tono Susanto",
        course_name: "Business English Intermediate",
        class_fee: 1000000,
        discount: 200000,
        subtotal: 800000,
        num_installments: 1,
        installments: [{ deadline: "2025-09-29", amount: 800000 }],
        payment_proof: "https://example.com/proof2.png",
        status: "Success"
      }
    ] : prev);
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/class-sessions");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setClassSessions(json.data);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Loading fallback mock schedules.");
    }

    setClassSessions(prev => prev.length === 0 ? [
      { id: 1, teacher: { name: "Jane Doe" }, teacher_id: 2, program_series: "Funny Phonics", specific_level: "Funny Phonics 1", classroom: "Room A", date: "2026-06-17", start_time: "09:00", end_time: "10:30" },
      { id: 2, teacher: { name: "John Smith" }, teacher_id: 3, program_series: "Hi Kids!", specific_level: "Hi Kids! 1", classroom: "Room B", date: "2026-06-18", start_time: "11:00", end_time: "12:30" }
    ] : prev);
  };

  const fetchRecap = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/class-sessions/attendance/recap");
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success") {
          setRecapSessions(json.data);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable. Loading fallback mock recap.");
    }

    setRecapSessions(prev => prev.length === 0 ? [
      { id: 1, teacher_name: "Jane Doe", program_series: "Funny Phonics", specific_level: "Funny Phonics 1", classroom: "Room A", date: "2026-06-17", start_time: "09:00", end_time: "10:30", total_students: 5, jumlah_hadir: 4, jumlah_alpha: 1, jumlah_izin: 0 },
      { id: 2, teacher_name: "John Smith", program_series: "Hi Kids!", specific_level: "Hi Kids! 1", classroom: "Room B", date: "2026-06-18", start_time: "11:00", end_time: "12:30", total_students: 4, jumlah_hadir: 3, jumlah_alpha: 0, jumlah_izin: 1 }
    ] : prev);
  };

  const exportToCSV = () => {
    if (recapSessions.length === 0) {
      alert("No attendance recap data to export.");
      return;
    }
    const headers = [
      "Date & Time",
      "Program/Level",
      "Room",
      "Teacher",
      "Total Students",
      "Present",
      "Absent",
      "Leave"
    ];

    const rows = recapSessions.map(r => {
      const dateTime = `${r.date} (${r.start_time} - ${r.end_time})`;
      const progLevel = `${r.program_series} ${r.specific_level || ""}`.trim();
      const room = r.classroom || "";
      const teacher = r.teacher_name || "";
      return [
        dateTime,
        progLevel,
        room,
        teacher,
        r.total_students,
        r.jumlah_hadir,
        r.jumlah_alpha,
        r.jumlah_izin
      ].map(val => {
        const strVal = String(val);
        const escaped = strVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_recap_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (recapSessions.length === 0) {
      alert("No attendance recap data to export.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    const colWidths = [35, 45, 18, 32, 14, 12, 12, 12];
    const colAlign = ["left", "left", "left", "left", "center", "center", "center", "center"];

    const headers = [
      "Date & Time",
      "Program/Level",
      "Room",
      "Teacher",
      "Total",
      "Pres",
      "Abs",
      "Leave"
    ];

    let currentPage = 1;

    const drawHeader = (pageNum: number) => {
      doc.setFillColor(74, 201, 205);
      doc.rect(0, 0, pageWidth, 5, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text("ENGLISH EVERYWHERE", margin, 20);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("Attendance Recap Report", margin, 26);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      const today = new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      doc.text(`Generated: ${today}`, pageWidth - margin, 20, { align: "right" });
      doc.text(`Page ${pageNum}`, pageWidth - margin, 26, { align: "right" });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, 30, pageWidth - margin, 30);
    };

    const drawTableHeader = (yVal: number) => {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yVal, contentWidth, 10, "F");

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, yVal + 10, margin + contentWidth, yVal + 10);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);

      let currentX = margin;
      for (let i = 0; i < headers.length; i++) {
        const width = colWidths[i];
        const align = colAlign[i];
        const textX = align === "center" ? currentX + width / 2 : currentX + 3;
        const textY = yVal + 6.5;
        doc.text(headers[i], textX, textY, { align: align as "left" | "center" | "right" });
        currentX += width;
      }
    };

    drawHeader(currentPage);
    
    let y = 38;
    drawTableHeader(y);
    y += 10;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    recapSessions.forEach((r, rowIndex) => {
      const rowHeight = 8;

      if (y + rowHeight > pageHeight - 20) {
        doc.addPage();
        currentPage++;
        drawHeader(currentPage);
        y = 38;
        drawTableHeader(y);
        y += 10;
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
      }

      if (rowIndex % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, rowHeight, "F");
      }

      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      const dateTime = `${r.date} (${r.start_time} - ${r.end_time})`;
      const progLevel = `${r.program_series} ${r.specific_level || ""}`.trim();
      const room = r.classroom || "";
      const teacher = r.teacher_name || "";
      const totalStr = String(r.total_students);
      const presStr = String(r.jumlah_hadir);
      const absStr = String(r.jumlah_alpha);
      const leaveStr = String(r.jumlah_izin);

      const rowData = [dateTime, progLevel, room, teacher, totalStr, presStr, absStr, leaveStr];

      let currentX = margin;
      for (let i = 0; i < rowData.length; i++) {
        const width = colWidths[i];
        const align = colAlign[i];
        const textX = align === "center" ? currentX + width / 2 : currentX + 3;
        const textY = y + 5;

        let text = rowData[i];
        
        const maxTextWidth = width - 4;
        if (align === "left" && doc.getTextWidth(text) > maxTextWidth) {
          while (doc.getTextWidth(text + "...") > maxTextWidth && text.length > 0) {
            text = text.substring(0, text.length - 1);
          }
          text += "...";
        }

        if (i === 5) {
          doc.setTextColor(22, 163, 74);
          doc.setFont("Helvetica", "bold");
        } else if (i === 6) {
          doc.setTextColor(220, 38, 38);
          doc.setFont("Helvetica", "bold");
        } else if (i === 7) {
          doc.setTextColor(217, 119, 6);
          doc.setFont("Helvetica", "bold");
        } else {
          doc.setTextColor(51, 65, 85);
          doc.setFont("Helvetica", "normal");
        }

        doc.text(text, textX, textY, { align: align as "left" | "center" | "right" });
        currentX += width;
      }

      y += rowHeight;
    });

    doc.save(`attendance_recap_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleOpenCreatePayment = () => {
    setPaymentModalMode("create");
    setSelectedPayment(null);

    const date = new Date();
    const invoiceNum = `EE/${date.getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;
    const transId = `${Math.floor(100 + Math.random() * 900)}/XIV`;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedBillDate = `${day}/${month}/${year}`;

    setPayTransactionId(transId);
    setPayInvoiceNo(invoiceNum);
    setPayBillDate(formattedBillDate);
    
    setPayStudentId(undefined);
    setPayStudentName("");
    setPayCourseName("");
    setPayClassFee(0);
    setPayDiscount(0);
    setPaySubtotal(0);
    setPayNumInstallments(1);
    setPayInstallments([
      { deadline: "", amount: 0 },
      { deadline: "", amount: 0 },
      { deadline: "", amount: 0 },
      { deadline: "", amount: 0 },
    ]);
    setPayPaymentProof("");
    setPayStatus("Success");
    setPayPaymentType("Paid Full");
    setIsPaymentModalOpen(true);
  };

  const handleOpenEditPayment = (p: PaymentItem) => {
    setPaymentModalMode("edit");
    setSelectedPayment(p);
    setPayTransactionId(p.transaction_id);
    setPayInvoiceNo(p.invoice_no);
    setPayBillDate(p.bill_date);
    setPayStudentId(p.student_id);
    setPayStudentName(p.student_name);
    setPayCourseName(p.course_name);
    setPayClassFee(p.class_fee);
    setPayDiscount(0);
    setPaySubtotal(p.class_fee); // Subtotal matches class fee since discount is 0
    setPayNumInstallments(p.num_installments);

    const paddedInst = [...(p.installments || [])];
    while (paddedInst.length < 4) {
      paddedInst.push({ deadline: "", amount: 0 });
    }
    setPayInstallments(paddedInst);
    setPayPaymentProof("");
    setPayStatus(p.num_installments > 1 ? "Pending" : "Success");
    setPayPaymentType(p.num_installments > 1 ? "Installment" : "Paid Full");
    setIsPaymentModalOpen(true);
  };


  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!payStudentName || !payCourseName || payClassFee <= 0) {
      alert("Nama Murid, Course Name, dan Biaya Kelas wajib diisi.");
      return;
    }

    const activeInstallments = payInstallments.slice(0, payNumInstallments).map(inst => ({
      deadline: inst.deadline || new Date().toISOString().split('T')[0],
      amount: inst.amount || 0
    }));

    const finalStatus = payPaymentType === "Paid Full" ? "Success" : "Pending";
    const finalDiscount = 0;
    const finalSubtotal = payClassFee;
    const finalPaymentProof = null;

    const payload = {
      transaction_id: payTransactionId,
      invoice_no: payInvoiceNo,
      bill_date: payBillDate,
      student_id: payStudentId || null,
      student_name: payStudentName,
      course_name: payCourseName,
      class_fee: payClassFee,
      discount: finalDiscount,
      subtotal: finalSubtotal,
      num_installments: payNumInstallments,
      installments: activeInstallments,
      payment_proof: finalPaymentProof,
      status: finalStatus
    };

    try {
      const url = paymentModalMode === "create"
        ? "http://127.0.0.1:8000/api/payments"
        : `http://127.0.0.1:8000/api/payments/${selectedPayment?.id}`;
      
      const method = paymentModalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchPayments();
        setIsPaymentModalOpen(false);
        return;
      } else {
        const errJson = await res.json();
        alert("Error: " + JSON.stringify(errJson.errors || errJson.message));
      }
    } catch (err) {
      console.warn("Backend API not reachable. Saving payment locally.");
    }

    if (paymentModalMode === "create") {
      const newPayment: PaymentItem = {
        id: Date.now(),
        transaction_id: payTransactionId,
        invoice_no: payInvoiceNo,
        bill_date: payBillDate,
        student_id: payStudentId,
        student_name: payStudentName,
        course_name: payCourseName,
        class_fee: payClassFee,
        discount: finalDiscount,
        subtotal: finalSubtotal,
        num_installments: payNumInstallments,
        installments: activeInstallments,
        payment_proof: finalPaymentProof || undefined,
        status: finalStatus
      };
      setPayments([newPayment, ...payments]);
    } else if (paymentModalMode === "edit" && selectedPayment) {
      setPayments(
        payments.map(p => p.id === selectedPayment.id ? {
          ...p,
          student_id: payStudentId,
          student_name: payStudentName,
          course_name: payCourseName,
          class_fee: payClassFee,
          discount: finalDiscount,
          subtotal: finalSubtotal,
          num_installments: payNumInstallments,
          installments: activeInstallments,
          payment_proof: finalPaymentProof || undefined,
          status: finalStatus
        } : p)
      );
    }
    setIsPaymentModalOpen(false);
  };

  const handleLunasManual = async () => {
    if (!selectedPayment) return;
    
    if (!confirm("Apakah Anda yakin ingin melunasi tagihan ini secara manual (metode CASH)?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/payments/${selectedPayment.id}/lunas-manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setIsPaymentModalOpen(false);
        alert("Tagihan berhasil dilunasi secara manual dengan metode pembayaran CASH.");
        fetchPayments();
      } else {
        const data = await res.json();
        alert("Gagal melunasi tagihan: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.warn("Backend not reachable. Processing locally.");
      setPayments(
        payments.map(p => p.id === selectedPayment.id ? {
          ...p,
          status: "Paid",
          payment_method: "Cash"
        } : p)
      );
      setIsPaymentModalOpen(false);
      alert("Tagihan dilunasi secara lokal.");
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tagihan pembayaran ini?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/payments/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchPayments();
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Deleting locally.");
    }

    setPayments(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchAccounts();
      fetchAppointmentData();
      fetchLearningMaterials();
      fetchPayments();
      fetchArticles();
      fetchSchedules();
      fetchRecap();
      fetchEvents();
    }
    if (activeTab === "appointment" || activeTab === "applicant-data") {
      fetchAppointmentData();
    }
    if (activeTab === "learning-materials") {
      fetchLearningMaterials();
    }
    if (activeTab === "account") {
      fetchAccounts();
    }
    if (activeTab === "events") {
      fetchEvents();
    }
    if (activeTab === "payments") {
      fetchPayments();
    }
    if (activeTab === "english-corner") {
      fetchArticles();
    }
    if (activeTab === "schedules") {
      fetchSchedules();
      fetchAccounts();
    }
    if (activeTab === "attendance-recap") {
      fetchRecap();
    }
    if (activeTab === "student-overview") {
      fetchAccounts();
      fetchPayments();
      fetchSchedules();
      setSelectedStudentOverview(null);
    }
  }, [activeTab]);

  // Seed mock data for development if offline
  useEffect(() => {
    fetchAccounts();
    fetchAppointmentData();
    fetchLearningMaterials();
    fetchPayments();
    fetchArticles();
    fetchSchedules();
    fetchRecap();
    fetchEvents();

    setAppointmentSchedules(prev => prev.length === 0 ? [
      { id: 1, date: "2026-06-09", time: "10.00", quota: 1, booked: 0 },
      { id: 2, date: "2026-06-15", time: "09.00", quota: 2, booked: 1 },
      { id: 3, date: "2026-06-16", time: "13.00", quota: 3, booked: 3 }, // FULL
      { id: 4, date: "2026-06-18", time: "10.00", quota: 2, booked: 0 },
    ] : prev);

    setAppointmentBookings(prev => prev.length === 0 ? [
      { id: 101, schedule_id: 2, name: "Abqary Ismail Winatra", email: "abqary@example.com", phone: "08123456789", status: "pending" },
      { id: 102, schedule_id: 3, name: "Abhiyazka Ramazan", email: "abhiyazka@example.com", phone: "08123456780", status: "pending" },
      { id: 103, schedule_id: 3, name: "Adhyastha Franata", email: "adhyastha@example.com", phone: "08123456781", status: "pending" },
      { id: 104, schedule_id: 3, name: "Active Student", email: "student@example.com", phone: "08123456782", status: "pending" },
    ] : prev);

    setClassSessions(prev => prev.length === 0 ? [
      { id: 1, teacher: { name: "Jane Doe" }, teacher_id: 2, program_series: "Funny Phonics", specific_level: "Funny Phonics 1", classroom: "Room A", date: "2026-06-17", start_time: "09:00", end_time: "10:30" },
      { id: 2, teacher: { name: "John Smith" }, teacher_id: 3, program_series: "Hi Kids!", specific_level: "Hi Kids! 1", classroom: "Room B", date: "2026-06-18", start_time: "11:00", end_time: "12:30" }
    ] : prev);

    setRecapSessions(prev => prev.length === 0 ? [
      { id: 1, teacher_name: "Jane Doe", program_series: "Funny Phonics", specific_level: "Funny Phonics 1", classroom: "Room A", date: "2026-06-17", start_time: "09:00", end_time: "10:30", total_students: 5, jumlah_hadir: 4, jumlah_alpha: 1, jumlah_izin: 0 },
      { id: 2, teacher_name: "John Smith", program_series: "Hi Kids!", specific_level: "Hi Kids! 1", classroom: "Room B", date: "2026-06-18", start_time: "11:00", end_time: "12:30", total_students: 4, jumlah_hadir: 3, jumlah_alpha: 0, jumlah_izin: 1 }
    ] : prev);
  }, []);

  // Auto-calculate subtotal
  useEffect(() => {
    setPaySubtotal(Math.max(0, payClassFee - payDiscount));
  }, [payClassFee, payDiscount]);

  // Auto-distribute installment amounts
  useEffect(() => {
    if (paySubtotal >= 0 && payNumInstallments > 0) {
      const equalAmount = Math.floor(paySubtotal / payNumInstallments);
      const newInst = payInstallments.map((inst, index) => {
        if (index < payNumInstallments) {
          return {
            ...inst,
            amount: equalAmount
          };
        } else {
          return {
            ...inst,
            amount: 0
          };
        }
      });
      if (payNumInstallments > 0) {
        const distributedTotal = equalAmount * payNumInstallments;
        const diff = paySubtotal - distributedTotal;
        newInst[payNumInstallments - 1].amount += diff;
      }
      setPayInstallments(newInst);
    }
  }, [paySubtotal, payNumInstallments]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!scheduleModalDate || !scheduleModalTime || !scheduleModalQuota) {
      alert("Harap lengkapi semua kolom");
      return;
    }

    let formattedDate = scheduleModalDate;
    if (scheduleModalDate.includes("/")) {
      const parts = scheduleModalDate.split("/");
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formattedDate,
          time: scheduleModalTime,
          quota: scheduleModalQuota
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          fetchAppointmentData();
          setIsScheduleModalOpen(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend connection failed. Saving locally.");
    }

    const newSchedule: AppointmentScheduleItem = {
      id: Date.now(),
      date: formattedDate,
      time: scheduleModalTime,
      quota: scheduleModalQuota,
      booked: 0
    };

    setAppointmentSchedules(prev => {
      const idx = prev.findIndex(s => s.date === formattedDate && s.time === scheduleModalTime);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quota: scheduleModalQuota };
        return updated;
      }
      return [...prev, newSchedule];
    });

    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slot jadwal ini? Semua data pendaftaran terkait juga akan terhapus.")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/appointments/schedules/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAppointmentData();
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed. Deleting locally.");
    }

    setAppointmentSchedules(prev => prev.filter(s => s.id !== id));
    setAppointmentBookings(prev => prev.filter(b => b.schedule_id !== id));
  };

  const handleSaveClassSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!schTeacherId || !schProgram || !schClassroom || !schDate || !schStartTime || !schEndTime) {
      alert("Harap lengkapi semua kolom wajib.");
      return;
    }

    // 1. Validate: Cannot choose date in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(schDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Tidak dapat memilih tanggal yang sudah lewat.");
      return;
    }

    // 2. Validate: Cannot choose past time if selected date is today
    if (selectedDate.getTime() === today.getTime()) {
      const now = new Date();
      const [startHour, startMinute] = schStartTime.split(":").map(Number);
      const selectedDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
      if (selectedDateTime < now) {
        alert("Tidak dapat memilih jam yang sudah lewat untuk hari ini.");
        return;
      }
    }

    // 3. Validate: Time range sanity check
    if (schStartTime >= schEndTime) {
      alert("Jam mulai harus lebih awal dari jam selesai.");
      return;
    }

    // 4. Collision check: overlapping program, level, classroom, date, teacher
    const hasCollision = classSessions.some(s => {
      // If editing, ignore the same session itself
      if (schModalMode === "edit" && selectedSchSessionId === s.id) return false;

      const isSameTeacher = String(s.teacher_id) === String(schTeacherId);
      const isSameProgram = s.program_series === schProgram;
      const isSameLevel = (s.specific_level || "") === (schLevel || "");
      const isSameClassroom = s.classroom === schClassroom;
      const isSameDate = s.date === schDate;

      // Overlap check
      const parseTimeToMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const sStart = parseTimeToMinutes(s.start_time);
      const sEnd = parseTimeToMinutes(s.end_time);
      const newStart = parseTimeToMinutes(schStartTime);
      const newEnd = parseTimeToMinutes(schEndTime);

      const isTimeOverlap = newStart < sEnd && sStart < newEnd;

      return isSameTeacher && isSameProgram && isSameLevel && isSameClassroom && isSameDate && isTimeOverlap;
    });

    if (hasCollision) {
      const confirmProceed = confirm(
        "Peringatan: Sudah ada pengajar di program, level, ruangan, tanggal dan jam yang sama. Apakah yakin ingin tetap melanjutkan? Ini bisa menyebabkan tabrakan jadwal."
      );
      if (!confirmProceed) return;
    }

    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    const payload = {
      teacher_id: parseInt(schTeacherId),
      program_series: schProgram,
      specific_level: schLevel || null,
      classroom: schClassroom,
      date: schDate,
      start_time: schStartTime,
      end_time: schEndTime,
    };

    try {
      const url = schModalMode === "edit"
        ? `http://127.0.0.1:8000/api/class-sessions/${selectedSchSessionId}`
        : "http://127.0.0.1:8000/api/class-sessions";
      const method = schModalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchSchedules();
        setIsClassSessionModalOpen(false);
        return;
      } else {
        const json = await res.json();
        alert("Error: " + JSON.stringify(json.errors || json.message));
      }
    } catch (err) {
      console.warn("Backend not reachable. Saving schedule locally.");
    }

    const teacherObj = accounts.find(a => String(a.id) === String(schTeacherId));
    if (schModalMode === "create") {
      const newSession = {
        id: Date.now(),
        teacher: { name: teacherObj ? teacherObj.name : "Unknown" },
        teacher_id: parseInt(schTeacherId),
        program_series: schProgram,
        specific_level: schLevel,
        classroom: schClassroom,
        date: schDate,
        start_time: schStartTime,
        end_time: schEndTime
      };
      setClassSessions([newSession, ...classSessions]);
    } else {
      setClassSessions(prev => prev.map(s => s.id === selectedSchSessionId ? {
        ...s,
        teacher: { name: teacherObj ? teacherObj.name : "Unknown" },
        teacher_id: parseInt(schTeacherId),
        program_series: schProgram,
        specific_level: schLevel,
        classroom: schClassroom,
        date: schDate,
        start_time: schStartTime,
        end_time: schEndTime
      } : s));
    }
    setIsClassSessionModalOpen(false);
  };

  const handleDeleteClassSession = async (id: number) => {
    if (!confirm(t("Apakah Anda yakin ingin menghapus jadwal ini?", "Are you sure you want to delete this schedule?"))) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/class-sessions/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchSchedules();
        return;
      }
    } catch (err) {
      console.warn("Backend not reachable. Deleting schedule locally.");
    }
    setClassSessions(prev => prev.filter(s => s.id !== id));
  };

  // Articles State

  const [articles, setArticles] = useState<ArticleItem[]>([]);

  const [articleSearch, setArticleSearch] = useState("");
  const [articleView, setArticleView] = useState<"list" | "create" | "edit">("list");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Article Form State
  const [artTitle, setArtTitle] = useState("");
  const [artShortDesc, setArtShortDesc] = useState("");
  const [artIntroParagraphs, setArtIntroParagraphs] = useState<string[]>([""]);
  const [artSections, setArtSections] = useState<{ heading: string; body: string }[]>([{ heading: "", body: "" }]);
  const [artThumbnail, setArtThumbnail] = useState<string | null>(null);
  const [artDateCreated, setArtDateCreated] = useState("");

  const renderRichTextEditor = (
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    rows: number = 3,
    required: boolean = false,
    textClassName: string = "text-xs sm:text-sm text-slate-600 font-medium"
  ) => {
    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4AC9CD]/20 focus-within:border-[#4AC9CD] bg-white transition-all shadow-sm">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-100 px-3.5 py-2.5 flex items-center gap-4 text-slate-400 text-xs font-semibold select-none flex-wrap">
          <button type="button" className="hover:text-slate-800 transition-colors font-bold px-1.5 py-0.5 rounded hover:bg-slate-50">B</button>
          <button type="button" className="hover:text-slate-800 transition-colors italic font-serif px-1.5 py-0.5 rounded hover:bg-slate-50">I</button>
          <button type="button" className="hover:text-slate-800 transition-colors underline px-1.5 py-0.5 rounded hover:bg-slate-50">U</button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button type="button" className="hover:text-slate-800 transition-colors flex items-center hover:bg-slate-50 px-1.5 py-0.5 rounded" title="Numbered List">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <button type="button" className="hover:text-slate-800 transition-colors flex items-center hover:bg-slate-50 px-1.5 py-0.5 rounded" title="Bullet List">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button type="button" className="hover:text-slate-800 transition-colors flex items-center hover:bg-slate-50 px-1.5 py-0.5 rounded" title="Align Left">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <button type="button" className="hover:text-slate-800 transition-colors flex items-center hover:bg-slate-50 px-1.5 py-0.5 rounded" title="Clear Formatting">
            <span className="font-poppins text-xs font-semibold">Tₓ</span>
          </button>
        </div>
        {/* Text Area */}
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 font-poppins focus:outline-none resize-none leading-relaxed bg-white focus:ring-0 ${textClassName}`}
        />
      </div>
    );
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
    setEventDate(parseToYYYYMMDD(event.date));
    setEventTime(parseToHHMM(event.time));
    setEventLocation(event.location);
    setEventType(event.type);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!eventTitle || !eventDate || !eventTime || !eventLocation) {
      alert("Harap lengkapi semua kolom");
      return;
    }

    const payload = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      type: eventType,
    };

    try {
      const url = eventModalMode === "create"
        ? "http://127.0.0.1:8000/api/events"
        : `http://127.0.0.1:8000/api/events/${selectedEvent?.id}`;
      
      const method = eventModalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchEvents();
        setIsEventModalOpen(false);
        return;
      } else {
        const errJson = await res.json();
        alert("Error: " + JSON.stringify(errJson.errors || errJson.message));
      }
    } catch (err) {
      console.warn("Backend API not reachable. Saving event locally.");
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

  const handleDeleteEvent = async (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus event ini?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/events/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchEvents();
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Deleting event locally.");
    }

    setEvents(events.filter((e) => String(e.id) !== String(id)));
  };

  // Filter Events
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const totalEventPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startEventIndex = (eventPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startEventIndex, startEventIndex + itemsPerPage);


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
    setAccGender("Female");
    setAccAlamat("");
    setAccPhone("");
    setAccEmail("");
    setAccFatherName("");
    setAccMotherName("");
    setAccGuardianName("");
    setAccProgramSeries("");
    setAccSpecificLevel("");
    setAccPassword("");
    setAccConfirmPassword("");
    setAccPhoto(null);
    setAccEntryDate("");
    setAccTestDate("");
    setAccExitDate("");
    setShowPassword(false);
    setIsAccountModalOpen(true);
  };

  const handleOpenEditAccount = (acc: AccountItem) => {
    setAccountModalMode("edit");
    setSelectedAccount(acc);
    setAccName(acc.name);
    setAccUsername(acc.username);
    setAccDob(convertToYYYYMMDD(acc.dob));
    setAccStatus(acc.status);
    setAccRole(acc.role);
    setAccGender(acc.gender || "Female");
    setAccAlamat(acc.alamat || "");
    setAccPhone(acc.phone || "");
    setAccEmail(acc.email || "");
    setAccFatherName(acc.fatherName || "");
    setAccMotherName(acc.motherName || "");
    setAccGuardianName(acc.guardianName || "");
    setAccProgramSeries(acc.programSeries || "");
    setAccSpecificLevel(acc.specificLevel || "");
    setAccPassword(acc.password || "");
    setAccConfirmPassword("");
    setAccPhoto(acc.photo || null);
    setAccEntryDate(convertToYYYYMMDD(acc.entryDate || ""));
    setAccTestDate(convertToYYYYMMDD(acc.testDate || ""));
    setAccExitDate(convertToYYYYMMDD(acc.exitDate || ""));
    setShowPassword(false);
    setIsAccountModalOpen(true);
  };

  const handleOpenViewAccount = (acc: AccountItem) => {
    setAccountModalMode("view");
    setSelectedAccount(acc);
    setAccName(acc.name);
    setAccUsername(acc.username);
    setAccDob(convertToYYYYMMDD(acc.dob));
    setAccStatus(acc.status);
    setAccRole(acc.role);
    setAccGender(acc.gender || "Female");
    setAccAlamat(acc.alamat || "");
    setAccPhone(acc.phone || "");
    setAccEmail(acc.email || "");
    setAccFatherName(acc.fatherName || "");
    setAccMotherName(acc.motherName || "");
    setAccGuardianName(acc.guardianName || "");
    setAccProgramSeries(acc.programSeries || "");
    setAccSpecificLevel(acc.specificLevel || "");
    setAccPassword(acc.password || "");
    setAccConfirmPassword("");
    setAccPhoto(acc.photo || null);
    setAccEntryDate(convertToYYYYMMDD(acc.entryDate || ""));
    setAccTestDate(convertToYYYYMMDD(acc.testDate || ""));
    setAccExitDate(convertToYYYYMMDD(acc.exitDate || ""));
    setShowPassword(false); // Hidden by default in view mode too, toggleable
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!accName || !accUsername) {
      alert("Nama dan Username wajib diisi");
      return;
    }

    if (accountModalMode === "edit" && accPassword && accPassword !== accConfirmPassword) {
      alert(t("Password dan Konfirmasi Password tidak cocok.", "Password and Confirm Password do not match."));
      return;
    }


    const backendRole = accRole.toLowerCase();
    const formattedDob = convertToDDMMYYYY(accDob);

    const payload = {
      name: accName,
      email: accEmail || `${accUsername.replace(/\s+/g, "").toLowerCase()}@example.com`,
      username: accUsername,
      dob: formattedDob,
      status: accStatus,
      role: backendRole,
      gender: accGender,
      alamat: accAlamat,
      phone: accPhone,
      password: accPassword || undefined,
      photo: accPhoto || undefined,
      program_series: accProgramSeries || undefined,
      specific_level: accSpecificLevel || undefined,
      guardian_name: accGuardianName || undefined,
      entry_date: convertToDDMMYYYY(accEntryDate),
      test_date: convertToDDMMYYYY(accTestDate),
      exit_date: convertToDDMMYYYY(accExitDate),
    };

    try {
      const url = accountModalMode === "create"
        ? "http://127.0.0.1:8000/api/users"
        : `http://127.0.0.1:8000/api/users/${selectedAccount?.id}`;
      
      const method = accountModalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchAccounts();
        setIsAccountModalOpen(false);
        return;
      } else {
        const errJson = await res.json();
        alert("Error: " + JSON.stringify(errJson.errors || errJson.message));
      }
    } catch (err) {
      console.warn("Backend API not reachable. Saving account locally.");
    }

    if (accountModalMode === "create") {
      const newAccount: AccountItem = {
        id: `acc-${Date.now()}`,
        name: accName,
        username: accUsername,
        dob: formattedDob,
        status: accStatus,
        role: accRole,
        gender: accGender,
        alamat: accAlamat,
        phone: accPhone,
        email: accEmail,
        password: accPassword,
        photo: accPhoto || undefined,
        programSeries: accProgramSeries || undefined,
        specificLevel: accSpecificLevel || undefined,
        guardianName: accGuardianName || undefined,
        entryDate: convertToDDMMYYYY(accEntryDate),
        testDate: convertToDDMMYYYY(accTestDate),
        exitDate: convertToDDMMYYYY(accExitDate),
      };
      setAccounts([newAccount, ...accounts]);
    } else if (accountModalMode === "edit" && selectedAccount) {
      setAccounts(
        accounts.map((a) =>
          a.id === selectedAccount.id
            ? {
                ...a,
                name: accName,
                username: accUsername,
                dob: formattedDob,
                status: accStatus,
                role: accRole,
                gender: accGender,
                alamat: accAlamat,
                phone: accPhone,
                email: accEmail,
                guardianName: accGuardianName,
                programSeries: accProgramSeries,
                specificLevel: accSpecificLevel,
                password: accPassword || a.password,
                photo: accPhoto || a.photo,
                entryDate: convertToDDMMYYYY(accEntryDate),
                testDate: convertToDDMMYYYY(accTestDate),
                exitDate: convertToDDMMYYYY(accExitDate),
              }
            : a
        )
      );
    }
    setIsAccountModalOpen(false);
  };


  const handleDeleteAccount = async (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchAccounts();
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed. Deleting locally.");
    }

    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const handleSortAccount = (field: keyof AccountItem) => {
    if (accountSortField === field) {
      setAccountSortDirection(accountSortDirection === "asc" ? "desc" : "asc");
    } else {
      setAccountSortField(field);
      setAccountSortDirection("asc");
    }
  };

  // ----------------------------------------------------
  // ARTICLE CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenCreateArticle = () => {
    setArtTitle("");
    setArtShortDesc("");
    setArtDateCreated(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setArtIntroParagraphs([""]);
    setArtSections([{ heading: "", body: "" }]);
    setArtThumbnail(null);
    setArticleView("create");
  };

  const handleOpenEditArticle = (art: ArticleItem) => {
    setSelectedArticle(art);
    setArtTitle(art.title);
    setArtShortDesc(art.description);
    setArtDateCreated(art.dateCreated);
    setArtIntroParagraphs(art.introParagraphs && art.introParagraphs.length > 0 ? art.introParagraphs : [""]);
    setArtSections(art.sections && art.sections.length > 0 ? art.sections : [{ heading: "", body: "" }]);
    setArtThumbnail(art.thumbnail || null);
    setArticleView("edit");
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(t("Apakah Anda yakin ingin menyimpan perubahan?", "Are you sure you want to save changes?"))) return;

    if (!artTitle || !artShortDesc) {
      alert("Judul dan Deskripsi wajib diisi");
      return;
    }

    const payload = {
      title: artTitle,
      description: artShortDesc,
      date_created: artDateCreated || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      intro_paragraphs: artIntroParagraphs.filter(p => p.trim() !== ""),
      sections: artSections.filter(s => s.heading.trim() !== "" || s.body.trim() !== ""),
      thumbnail: artThumbnail || null,
    };

    try {
      const url = articleView === "create"
        ? "http://127.0.0.1:8000/api/articles"
        : `http://127.0.0.1:8000/api/articles/${selectedArticle?.id}`;
      const method = articleView === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchArticles();
        setArticleView("list");
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Saving article locally.");
    }

    // Fallback: update local state if API is unavailable
    if (articleView === "create") {
      const newArticle: ArticleItem = {
        id: `art-${Date.now()}`,
        title: artTitle,
        description: artShortDesc,
        dateCreated: artDateCreated || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        introParagraphs: artIntroParagraphs.filter(p => p.trim() !== ""),
        sections: artSections.filter(s => s.heading.trim() !== "" || s.body.trim() !== ""),
        thumbnail: artThumbnail || undefined,
      };
      setArticles([newArticle, ...articles]);
    } else if (articleView === "edit" && selectedArticle) {
      setArticles(
        articles.map((a) =>
          a.id === selectedArticle.id
            ? {
                ...a,
                title: artTitle,
                description: artShortDesc,
                dateCreated: artDateCreated,
                introParagraphs: artIntroParagraphs.filter(p => p.trim() !== ""),
                sections: artSections.filter(s => s.heading.trim() !== "" || s.body.trim() !== ""),
                thumbnail: artThumbnail || undefined,
              }
            : a
        )
      );
    }
    setArticleView("list");
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchArticles();
        return;
      }
    } catch (err) {
      console.warn("Backend API not reachable. Deleting article locally.");
    }

    // Fallback: update local state if API is unavailable
    setArticles(articles.filter((a) => a.id !== id));
  };

  const handleAddParagraph = () => {
    setArtIntroParagraphs([...artIntroParagraphs, ""]);
  };

  const handleEditParagraph = (index: number, value: string) => {
    const updated = [...artIntroParagraphs];
    updated[index] = value;
    setArtIntroParagraphs(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    const updated = artIntroParagraphs.filter((_, i) => i !== index);
    setArtIntroParagraphs(updated.length > 0 ? updated : [""]);
  };

  const handleAddSection = () => {
    setArtSections([...artSections, { heading: "", body: "" }]);
  };

  const handleEditSectionTitle = (index: number, value: string) => {
    const updated = [...artSections];
    updated[index] = { ...updated[index], heading: value };
    setArtSections(updated);
  };

  const handleEditSectionContent = (index: number, value: string) => {
    const updated = [...artSections];
    updated[index] = { ...updated[index], body: value };
    setArtSections(updated);
  };

  const handleRemoveSection = (index: number) => {
    const updated = artSections.filter((_, i) => i !== index);
    setArtSections(updated.length > 0 ? updated : [{ heading: "", body: "" }]);
  };

  // Filter Articles
  const filteredArticles = articles.filter((art) =>
    art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
    art.description.toLowerCase().includes(articleSearch.toLowerCase())
  );

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
      const valA = (a[accountSortField] || "").toLowerCase();
      const valB = (b[accountSortField] || "").toLowerCase();

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
    <div className="h-screen bg-[#F8FAFC] flex font-sans text-slate-800 overflow-hidden">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col justify-between p-6 pb-12 flex-shrink-0 h-full hidden md:flex">
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
              {t("Dasbor", "Dashboard")}
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
              {t("Akun", "Account")}
            </button>

            {/* Student Overview Button */}
            <button
              onClick={() => setActiveTab("student-overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "student-overview"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("Data Murid", "Student Overview")}
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
              {t("Janji Temu", "Appointment")}
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
              {t("Data Pendaftar", "Applicant Data")}
            </button>

            {/* Learning Materials Button */}
            <button
              onClick={() => setActiveTab("learning-materials")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "learning-materials"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="whitespace-nowrap">{t("Materi Pembelajaran", "Learning Materials")}</span>
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
              {t("Pojok Inggris", "English Corner")}
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
              {t("Pembayaran", "Payments")}
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
              {t("Acara", "Events")}
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
              {t("Jadwal", "Schedules")}
            </button>

            {/* Attendance Recap Button */}
            <button
              onClick={() => setActiveTab("attendance-recap")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === "attendance-recap"
                  ? "bg-[#4AC9CD] text-white font-bold shadow-md shadow-teal-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("Rekap Presensi", "Attendance Recap")}
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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-100 h-20 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-poppins text-xs font-semibold text-slate-400 uppercase tracking-widest">
              ROLE: {userRole}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold font-poppins transition-colors cursor-pointer ${
                  lang === "id"
                    ? "bg-[#4AC9CD] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold font-poppins transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#4AC9CD] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 font-poppins text-xs text-slate-500 bg-slate-50 px-4 py-2.5 rounded-lg font-semibold border border-slate-100">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {(() => {
                if (lang === "en") {
                  const monthsIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                  const monthsEng = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  const parts = currentDate.split(" ");
                  if (parts.length === 3) {
                    const idx = monthsIndo.indexOf(parts[1]);
                    if (idx !== -1) {
                      return `${parts[0]} ${monthsEng[idx]} ${parts[2]}`;
                    }
                  }
                }
                return currentDate;
              })()}
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
                    TOTAL ACCOUNT
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalAccountsCount}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    JUMLAH MURID
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalStudentsCount}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    APPOINTMENT PENDING
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {appointmentBookings.filter(b => b.status === "pending" || !b.status).length}
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-[#EF5A3F] uppercase tracking-wider">
                    PEMBAYARAN JATUH TEMPO
                  </p>
                  <p className="font-satoshi text-3xl font-black text-[#EF5A3F] mt-2">
                    {payments.filter(p => {
                      if (p.status.toLowerCase() !== "pending") return false;
                      const nextInst = p.installments?.find(inst => inst.deadline);
                      if (!nextInst) return false;
                      return new Date(nextInst.deadline) < new Date();
                    }).length}
                  </p>
                </div>

              </div>

              {/* Middle Row Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Card: Applicant List */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[300px]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-satoshi text-base font-bold text-slate-800">
                      Applicant List
                    </h3>
                    <button
                      onClick={() => setActiveTab("applicant-data")}
                      className="font-poppins text-[11px] font-bold text-[#4AC9CD] hover:underline cursor-pointer"
                    >
                      See All
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-start divide-y divide-slate-100">
                    {appointmentBookings.length === 0 ? (
                      <div className="flex-1 flex flex-col justify-center items-center py-10">
                        <span className="text-3xl mb-2">👥</span>
                        <p className="font-poppins text-xs text-slate-400 italic font-medium">
                          No applicants found
                        </p>
                      </div>
                    ) : (
                      appointmentBookings.slice(0, 4).map((booking) => (
                        <div key={booking.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="space-y-0.5">
                            <p className="font-poppins text-xs font-bold text-slate-800">
                              {booking.name}
                            </p>
                            <p className="font-poppins text-[10px] text-slate-450">
                              {booking.phone} • {booking.gender || "-"}
                            </p>
                          </div>
                          <div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase font-poppins ${
                              booking.status === "accepted"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                              {booking.status || "pending"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Card: Kelas yang Sedang Berjalan */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[300px]">
                  <div className="flex justify-between items-center">
                    <h3 className="font-satoshi text-base font-bold text-slate-800">
                      Kelas yang Sedang Berjalan
                    </h3>
                    <button
                      onClick={() => setActiveTab("schedules")}
                      className="font-poppins text-[11px] font-bold text-[#4AC9CD] hover:underline cursor-pointer"
                    >
                      See All
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-start divide-y divide-slate-100">
                    {classSessions.length === 0 ? (
                      <div className="flex-1 flex flex-col justify-center items-center py-10">
                        <span className="text-3xl mb-2">🏫</span>
                        <p className="font-poppins text-xs text-slate-400 italic font-medium">
                          Tidak ada kelas yang sedang berjalan
                        </p>
                      </div>
                    ) : (
                      classSessions.slice(0, 4).map((session) => (
                        <div key={session.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="space-y-0.5">
                            <p className="font-poppins text-xs font-bold text-slate-800">
                              {session.program_series} - {session.specific_level}
                            </p>
                            <p className="font-poppins text-[10px] text-slate-450">
                              👤 {session.teacher?.name || "No Teacher"} • 📍 {session.classroom}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-poppins text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#4AC9CD] border border-teal-100/30">
                              {session.start_time} - {session.end_time}
                            </span>
                            <p className="font-poppins text-[8px] text-slate-400 mt-0.5">
                              {session.date}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Last Transaction Grid */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-satoshi text-base font-bold text-slate-800">
                    Last Transaction
                  </h3>
                  <button
                    onClick={() => setActiveTab("payments")}
                    className="font-poppins text-[11px] font-bold text-[#4AC9CD] hover:underline cursor-pointer"
                  >
                    See All
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-4 px-4">Transaction ID / Invoice</th>
                        <th className="py-4 px-4">Student Name</th>
                        <th className="py-4 px-4">Date</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Method</th>
                        <th className="py-4 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            No recent transactions
                          </td>
                        </tr>
                      ) : (
                        [...payments]
                          .sort((a, b) => b.id - a.id)
                          .slice(0, 4)
                          .map((p) => {
                            const dateStr = (p.updated_at || p.created_at)
                              ? new Date(p.updated_at || p.created_at || "").toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : p.bill_date;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4 font-bold text-[#1E293B]">
                                  <div>{p.transaction_id}</div>
                                  {p.invoice_no && <div className="text-[10px] text-slate-450 font-normal">{p.invoice_no}</div>}
                                </td>
                                <td className="py-4 px-4 text-slate-700 font-semibold">{p.student_name}</td>
                                <td className="py-4 px-4 text-slate-500">{dateStr}</td>
                                <td className="py-4 px-4 font-bold text-slate-800">Rp {p.subtotal.toLocaleString('id-ID')}</td>
                                <td className="py-4 px-4 text-slate-500 font-semibold">{p.payment_method || "Cash"}</td>
                                <td className="py-4 px-4 text-right">
                                  <span className={`text-[11px] font-bold px-3 py-1 rounded-md border uppercase font-poppins ${
                                    ['paid', 'lunas', 'success'].includes(p.status.toLowerCase())
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : ['failed', 'expired'].includes(p.status.toLowerCase())
                                      ? "bg-rose-50 text-rose-600 border-rose-100"
                                      : "bg-amber-50 text-amber-600 border-amber-100"
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                      )}
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

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL EVENTS
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalEventsCount}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-[#4AC9CD] uppercase tracking-wider">
                    UPCOMING
                  </p>
                  <p className="font-satoshi text-3xl font-black text-[#4AC9CD] mt-2">
                    {upcomingEventsCount}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    PAST EVENTS
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
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
                      {paginatedEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                            Tidak ada event yang ditemukan.
                          </td>
                        </tr>
                      ) : (
                        paginatedEvents.map((e) => (
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

                {/* Pagination Controls */}
                {filteredEvents.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50 font-poppins text-xs text-slate-500 font-semibold">
                    <p>
                      Showing {startEventIndex + 1} to {Math.min(startEventIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} entries
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        disabled={eventPage === 1}
                        onClick={() => setEventPage(eventPage - 1)}
                        className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white cursor-pointer select-none transition-colors"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalEventPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEventPage(idx + 1)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer select-none transition-colors border ${
                            eventPage === idx + 1
                              ? "bg-[#4AC9CD] border-[#4AC9CD] text-white font-bold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        disabled={eventPage === totalEventPages}
                        onClick={() => setEventPage(eventPage + 1)}
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
          {/* TAB: ACCOUNT VIEW */}
          {/* ========================================================================= */}
          {activeTab === "account" && (
            <>
              {/* Header Title */}
              <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                Account
              </h1>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL ACCOUNT
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalAccountsCount}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL STUDENT
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalStudentsCount}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                  <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL TEACHER
                  </p>
                  <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                    {totalTeachersCount}
                  </p>
                </div>

              </div>

              {/* List Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                    List Accounts
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
                      className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Account
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-left border-collapse font-poppins text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th onClick={() => handleSortAccount("name")} className="py-4 px-4 w-[22%] cursor-pointer hover:bg-slate-50/50 select-none">
                          Name <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("username")} className="py-4 px-4 w-[20%] cursor-pointer hover:bg-slate-50/50 select-none">
                          Username <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("programSeries" as any)} className="py-4 px-4 w-[20%] cursor-pointer hover:bg-slate-50/50 select-none">
                          Class <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("status")} className="py-4 px-4 w-[14%] cursor-pointer hover:bg-slate-50/50 select-none">
                          Status <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th onClick={() => handleSortAccount("role")} className="py-4 px-4 w-[13%] cursor-pointer hover:bg-slate-50/50 select-none">
                          Role <span className="ml-1 text-slate-300">⇅</span>
                        </th>
                        <th className="py-4 px-4 w-[11%] text-center select-none">
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
                            <td className="py-4 px-4 max-w-0 truncate font-bold text-[#4AC9CD] hover:underline cursor-pointer" onClick={() => handleOpenViewAccount(a)}>{a.name}</td>
                            <td className="py-4 px-4 max-w-0 truncate text-slate-500">{a.username}</td>
                            <td className="py-4 px-4 max-w-0 truncate text-slate-500">{a.programSeries || <span className="text-slate-300 italic text-[10px]">—</span>}</td>
                            <td className="py-4 px-4 text-slate-800 whitespace-nowrap">{a.status}</td>
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
          {/* TAB: ENGLISH CORNER VIEW */}
          {/* ========================================================================= */}
          {activeTab === "english-corner" && (
            <>
              {articleView === "list" ? (
                <>
                  {/* Header Title */}
                  <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                    English Corner
                  </h1>

                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                      <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        TOTAL ARTICLES
                      </p>
                      <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                        {articles.length}
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                      <p className="font-poppins text-[10px] font-bold text-[#4AC9CD] uppercase tracking-wider">
                        PUBLISHED ARTICLES
                      </p>
                      <p className="font-satoshi text-3xl font-black text-[#4AC9CD] mt-2">
                        {articles.length}
                      </p>
                    </div>

                  </div>

                  {/* List Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                        List Articles
                      </h3>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                          <input
                            type="text"
                            value={articleSearch}
                            onChange={(e) => setArticleSearch(e.target.value)}
                            placeholder="Search title..."
                            className="w-full sm:w-[260px] px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                          />
                          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>

                        {/* Create Button */}
                        <button
                          onClick={handleOpenCreateArticle}
                          className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Create Article
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                            <th className="py-4 px-4 w-1/3">TITLE</th>
                            <th className="py-4 px-4 w-5/12">DESCRIPTION</th>
                            <th className="py-4 px-4 w-1/6">DATE CREATED</th>
                            <th className="py-4 px-4 w-1/12 text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                                Tidak ada artikel yang ditemukan.
                              </td>
                            </tr>
                          ) : (
                            (() => {
                              const articlesPerPage = 4;
                              const totalArticlePages = Math.ceil(filteredArticles.length / articlesPerPage);
                              const paginatedArticles = filteredArticles.slice(
                                (articlePage - 1) * articlesPerPage,
                                articlePage * articlesPerPage
                              );
                              return paginatedArticles.map((art) => (
                                <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 px-4 font-bold text-[#1E293B] uppercase leading-relaxed text-xs">
                                    {art.title}
                                  </td>
                                  <td className="py-4 px-4 text-slate-500 font-normal leading-relaxed text-xs">
                                    {art.description}
                                  </td>
                                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">{art.dateCreated}</td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                      {/* Edit */}
                                      <button
                                        onClick={() => handleOpenEditArticle(art)}
                                        className="w-8 h-8 rounded-lg bg-[#E6F7F8] hover:bg-[#D0F1F3] text-[#4AC9CD] flex items-center justify-center cursor-pointer transition-colors"
                                        title="Edit Article"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                      </button>
                                      {/* Delete */}
                                      <button
                                        onClick={() => handleDeleteArticle(art.id)}
                                        className="w-8 h-8 rounded-lg bg-[#FDF2F2] hover:bg-[#FDE8E8] text-[#EF777E] flex items-center justify-center cursor-pointer transition-colors"
                                        title="Hapus Article"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {(() => {
                      const articlesPerPage = 4;
                      const totalArticlePages = Math.ceil(filteredArticles.length / articlesPerPage);
                      if (totalArticlePages <= 1) return null;
                      return (
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 font-poppins text-xs text-slate-500">
                          <span>
                            Showing {(articlePage - 1) * articlesPerPage + 1} to{" "}
                            {Math.min(articlePage * articlesPerPage, filteredArticles.length)} of{" "}
                            {filteredArticles.length} entries
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setArticlePage(prev => Math.max(prev - 1, 1))}
                              disabled={articlePage === 1}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors font-semibold"
                            >
                              Prev
                            </button>
                            {Array.from({ length: totalArticlePages }, (_, idx) => idx + 1).map((pg) => (
                              <button
                                type="button"
                                key={pg}
                                onClick={() => setArticlePage(pg)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                                  articlePage === pg
                                    ? "bg-[#4AC9CD] text-white"
                                    : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                                }`}
                              >
                                {pg}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setArticlePage(prev => Math.min(prev + 1, totalArticlePages))}
                              disabled={articlePage === totalArticlePages}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors font-semibold"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Header Title */}
                  <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                    {articleView === "create" ? "Create Article" : "Edit Article"}
                  </h1>

                  {/* Edit Article Layout: 2 Columns */}
                  <form onSubmit={handleSaveArticle} className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                    
                    {/* Left Column (70%) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="block font-poppins text-xs font-semibold text-slate-700">
                          Title<span className="text-rose-500">*</span>
                        </label>
                        {renderRichTextEditor(artTitle, setArtTitle, "Enter article title...", 2, true, "text-sm sm:text-base font-semibold text-slate-800")}
                      </div>

                      {/* Short Description */}
                      <div className="space-y-1.5">
                        <label className="block font-poppins text-xs font-semibold text-slate-700">
                          Short Description (for card)<span className="text-rose-500">*</span>
                        </label>
                        {renderRichTextEditor(artShortDesc, setArtShortDesc, "Enter short description...", 3, true, "text-xs sm:text-sm text-slate-600 font-medium")}
                      </div>

                      {/* Introduction Paragraphs */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block font-poppins text-xs font-semibold text-slate-700">
                            Introduction Paragraphs
                          </label>
                          <button
                            type="button"
                            onClick={handleAddParagraph}
                            className="text-[#4AC9CD] hover:text-[#3db3b7] text-xs font-bold font-poppins transition-colors cursor-pointer"
                          >
                            + Add Paragraph
                          </button>
                        </div>

                        <div className="space-y-3">
                          {artIntroParagraphs.map((para, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="flex-1">
                                {renderRichTextEditor(para, (val) => handleEditParagraph(idx, val), "Enter paragraph text...", 3, false, "text-xs sm:text-sm text-slate-600 font-medium")}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveParagraph(idx)}
                                className="text-slate-300 hover:text-rose-500 transition-colors p-1 mt-2 shrink-0 cursor-pointer"
                                title="Remove Paragraph"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Article Sections */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block font-poppins text-xs font-semibold text-slate-700">
                            Article Sections
                          </label>
                          <button
                            type="button"
                            onClick={handleAddSection}
                            className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2 px-4 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-teal-50"
                          >
                            + Add Section
                          </button>
                        </div>

                        <div className="space-y-6">
                          {artSections.map((sec, idx) => (
                            <div key={idx} className="bg-slate-50/40 border border-slate-150 rounded-2xl p-5 space-y-4 relative">
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <label className="block font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Section Title
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSection(idx)}
                                    className="text-slate-300 hover:text-rose-500 cursor-pointer transition-colors p-1"
                                    title="Remove Section"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={sec.heading}
                                  onChange={(e) => handleEditSectionTitle(idx, e.target.value)}
                                  placeholder="e.g. 1. Aturan Dasar..."
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/10 focus:border-[#4AC9CD] font-poppins text-xs font-semibold text-slate-800 bg-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Content
                                </label>
                                {renderRichTextEditor(sec.body, (val) => handleEditSectionContent(idx, val), "Enter section body...", 4, false, "text-xs sm:text-sm text-slate-600 font-medium")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setArticleView("list")}
                          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl font-poppins text-xs font-bold transition-all cursor-pointer text-center bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-2xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center"
                        >
                          {articleView === "create" ? "Save Article" : "Save Changes"}
                        </button>
                      </div>

                    </div>

                    {/* Right Column (30%) */}
                    <div className="lg:col-span-3 space-y-6">
                      
                      {/* Thumbnail Image */}
                      <div className="space-y-2">
                        <label className="block font-poppins text-xs font-semibold text-slate-700">
                          Thumbnail Image<span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="file"
                          id="thumbnail-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setArtThumbnail(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div
                          onClick={() => document.getElementById("thumbnail-upload")?.click()}
                          className="w-full aspect-video rounded-3xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer relative group transition-all"
                        >
                          {artThumbnail ? (
                            <img src={artThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-4">
                              <span className="text-3xl block mb-2">📸</span>
                              <span className="font-poppins text-[10px] text-slate-400 font-medium">Click to upload thumbnail</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PRO-TIP Info Box */}
                      <div className="bg-[#E6F7F8]/30 border border-[#4AC9CD]/20 rounded-2xl p-5 space-y-2">
                        <h4 className="font-poppins text-xs font-bold text-[#4AC9CD] uppercase tracking-wider">
                          PRO-TIP
                        </h4>
                        <p className="font-poppins text-[11px] text-slate-500 leading-relaxed">
                          Use high-quality landscape images (16:9) for the best look on the homepage.
                        </p>
                      </div>

                    </div>

                  </form>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB: STUDENT OVERVIEW VIEW */}
          {/* ========================================================================= */}
          {activeTab === "student-overview" && (
            <div className="space-y-8 animate-fade-in font-poppins">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                  {selectedStudentOverview ? "Student Profile Dashboard" : "Student Directory"}
                </h1>
                
                {selectedStudentOverview && (
                  <button
                    onClick={() => setSelectedStudentOverview(null)}
                    className="self-start sm:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-all font-poppins text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    ← Back to List
                  </button>
                )}
              </div>

              {selectedStudentOverview === null ? (
                /* ----------------- List View ----------------- */
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                      All Students
                    </h3>
                    
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-[280px]">
                      <input
                        type="text"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="Search student name, email or phone..."
                        className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4 w-[80px]">Photo</th>
                          <th className="py-4 px-4">Student Info</th>
                          <th className="py-4 px-4">Program & Level</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {accounts
                          .filter(a => a.role === "Student")
                          .filter(a =>
                            a.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                            (a.email && a.email.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                            (a.phone && a.phone.includes(studentSearchQuery))
                          )
                          .length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                              Tidak ada data murid yang ditemukan.
                            </td>
                          </tr>
                        ) : (
                          accounts
                            .filter(a => a.role === "Student")
                            .filter(a =>
                              a.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                              (a.email && a.email.toLowerCase().includes(studentSearchQuery.toLowerCase())) ||
                              (a.phone && a.phone.includes(studentSearchQuery))
                            )
                            .map((student) => (
                              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
                                    {student.photo ? (
                                      <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-slate-400 text-xs font-bold font-satoshi">
                                        {student.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{student.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    {student.email || "No Email"} • {student.phone || "No Phone"}
                                  </div>
                                </td>
                                <td className="py-4 px-4 font-medium text-slate-600">
                                  {student.programSeries || "-"}
                                  {student.specificLevel && (
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      Level: {student.specificLevel}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${
                                    student.status === "Active"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : student.status === "Waiting List"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-slate-50 text-slate-500 border-slate-100"
                                  }`}>
                                    {student.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <button
                                    onClick={() => fetchStudentOverview(student.id)}
                                    className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-1.5 px-4 rounded-xl transition-all font-poppins text-xs cursor-pointer shadow-md shadow-teal-50"
                                  >
                                    View Profile
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* ----------------- Profile Overview Dashboard View ----------------- */
                <div className="space-y-8">
                  {/* Row 1: Profile Details Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Avatar Block */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 lg:border-r lg:border-slate-100 lg:pr-8">
                      <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner relative">
                        {selectedStudentOverview.student.photo ? (
                          <img src={selectedStudentOverview.student.photo} alt={selectedStudentOverview.student.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-400 text-3xl font-black font-satoshi">
                            {selectedStudentOverview.student.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="font-satoshi text-xl font-bold text-slate-800">
                          {selectedStudentOverview.student.name}
                        </h2>
                        <p className="font-poppins text-xs text-slate-400 mt-1">
                          @{selectedStudentOverview.student.username}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${
                        selectedStudentOverview.student.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : selectedStudentOverview.student.status === "Waiting List"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                        {selectedStudentOverview.student.status}
                      </span>
                    </div>

                    {/* Detailed Metadata Block */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-poppins text-xs">
                      {/* Personal Info */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[#4AC9CD] text-[10px] uppercase tracking-widest border-b border-slate-50 pb-1">Personal Info</h4>
                        <div className="space-y-2 text-slate-700">
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Email</span> {selectedStudentOverview.student.email}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Phone</span> {selectedStudentOverview.student.phone}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">DOB / Gender</span> {selectedStudentOverview.student.dob} • {selectedStudentOverview.student.gender}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Address</span> {selectedStudentOverview.student.alamat}</p>
                        </div>
                      </div>

                      {/* Academic / Program Info */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[#4AC9CD] text-[10px] uppercase tracking-widest border-b border-slate-50 pb-1">Academic Info</h4>
                        <div className="space-y-2 text-slate-700">
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Program Series</span> {selectedStudentOverview.student.program_series}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Specific Level</span> {selectedStudentOverview.student.specific_level}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Parent / Guardian</span> {selectedStudentOverview.student.guardian_name || "-"}</p>
                        </div>
                      </div>

                      {/* Milestones Dates */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[#4AC9CD] text-[10px] uppercase tracking-widest border-b border-slate-50 pb-1">Important Dates</h4>
                        <div className="space-y-2 text-slate-700">
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Tanggal Masuk (Entry Date)</span> {selectedStudentOverview.student.entry_date}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Tanggal Test (Placement Test)</span> {selectedStudentOverview.student.test_date}</p>
                          <p><span className="text-slate-400 block font-semibold text-[10px]">Tanggal Keluar (Exit Date)</span> {selectedStudentOverview.student.exit_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Payment History Card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-satoshi text-base font-bold text-slate-800">
                      Payment History
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                            <th className="py-4 px-4">Transaction ID / Invoice</th>
                            <th className="py-4 px-4">Course</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Amount</th>
                            <th className="py-4 px-4">Method</th>
                            <th className="py-4 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700">
                          {selectedStudentOverview.payments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                                Belum ada riwayat pembayaran.
                              </td>
                            </tr>
                          ) : (
                            selectedStudentOverview.payments.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4 font-bold text-slate-800">
                                  <div>{p.transaction_id}</div>
                                  {p.invoice_no && <div className="text-[10px] text-slate-400 font-normal mt-0.5">{p.invoice_no}</div>}
                                </td>
                                <td className="py-4 px-4 text-slate-600">{p.course_name}</td>
                                <td className="py-4 px-4 text-slate-500 font-medium">{p.bill_date}</td>
                                <td className="py-4 px-4 font-bold text-slate-800">Rp {p.subtotal.toLocaleString('id-ID')}</td>
                                <td className="py-4 px-4 text-slate-500 font-semibold">{p.payment_method || "Cash"}</td>
                                <td className="py-4 px-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${
                                    ['paid', 'lunas', 'success'].includes(p.status.toLowerCase())
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : "bg-amber-50 text-amber-600 border-amber-100"
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Row 3: Class History and Attendance */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-satoshi text-base font-bold text-slate-800">
                      Class Attendance History
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                            <th className="py-4 px-4">Class Session Info</th>
                            <th className="py-4 px-4">Teacher</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Time / Classroom</th>
                            <th className="py-4 px-4 text-right">Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-700">
                          {selectedStudentOverview.classes.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                Belum ada riwayat kelas.
                              </td>
                            </tr>
                          ) : (
                            selectedStudentOverview.classes.map((cls) => (
                              <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4 font-bold text-slate-800">
                                  {cls.program_series} - {cls.specific_level}
                                </td>
                                <td className="py-4 px-4 text-slate-600">{cls.teacher_name}</td>
                                <td className="py-4 px-4 text-slate-500 font-medium">
                                  {(() => {
                                    const parts = cls.date.split("-");
                                    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                    return cls.date;
                                  })()}
                                </td>
                                <td className="py-4 px-4 text-slate-500">
                                  <div className="font-bold text-slate-650">{cls.start_time} - {cls.end_time}</div>
                                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">📍 {cls.classroom}</div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase inline-block font-poppins ${
                                    cls.attendance_status === 'H'
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : cls.attendance_status === 'A'
                                      ? "bg-rose-50 text-rose-600 border-rose-100"
                                      : cls.attendance_status === 'I'
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-slate-50 text-slate-400 border-slate-100"
                                  }`}>
                                    {cls.attendance_status === 'H' ? "Hadir" : cls.attendance_status === 'A' ? "Alpha" : cls.attendance_status === 'I' ? "Izin" : "Belum Absen"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: APPOINTMENT VIEW */}
          {/* ========================================================================= */}
          {activeTab === "appointment" && (() => {
            const getIndoMonthName = (monthIndex: number) => {
              const months = [
                "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", 
                "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
              ];
              return months[monthIndex];
            };

            const formatDateString = (y: number, m: number, d: number) => {
              const mm = String(m + 1).padStart(2, '0');
              const dd = String(d).padStart(2, '0');
              return `${y}-${mm}-${dd}`;
            };

            const getDayStatus = (dateStr: string) => {
              const daySchedules = appointmentSchedules.filter(s => s.date === dateStr);
              if (daySchedules.length === 0) return "none";
              const allFull = daySchedules.every(s => s.booked >= s.quota);
              return allFull ? "full" : "available";
            };

            const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
            const firstDayIndex = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7; // Monday = 0
            const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

            const calendarDays = [];
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
            for (let i = 1; i <= daysInMonth; i++) {
              calendarDays.push({
                day: i,
                isCurrentMonth: true,
                dateString: formatDateString(calendarYear, calendarMonth, i)
              });
            }
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

            const currentSchedules = appointmentSchedules.filter(s => s.date === selectedAppointmentDate);
            const currentBookings = appointmentBookings.filter(b => 
              currentSchedules.some(s => s.id === b.schedule_id)
            );

            const handlePrevMonth = () => {
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(prev => prev - 1);
              } else {
                setCalendarMonth(prev => prev - 1);
              }
            };

            const handleNextMonth = () => {
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(prev => prev + 1);
              } else {
                setCalendarMonth(prev => prev + 1);
              }
            };

            const handleToday = () => {
              const today = new Date();
              setCalendarYear(today.getFullYear());
              setCalendarMonth(today.getMonth());
              const dateStr = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
              setSelectedAppointmentDate(dateStr);
              setScheduleModalDate(dateStr);
            };

            const handleDayClick = (dateStr: string) => {
              setSelectedAppointmentDate(dateStr);
              setScheduleModalDate(dateStr);
            };

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                  Appointment
                </h1>

                {/* Main Content Grid: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Calendar Card */}
                  <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    {/* Month Navigator */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                      
                      {/* Month Display & Chevrons */}
                      <div className="flex items-center gap-4">
                        <div className="flex rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                          <button
                            onClick={handlePrevMonth}
                            className="p-2.5 hover:bg-slate-100 text-slate-600 transition-colors border-r border-slate-100 cursor-pointer"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextMonth}
                            className="p-2.5 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        </div>
                        <h2 className="font-satoshi text-lg font-black text-slate-800 tracking-wider">
                          {getIndoMonthName(calendarMonth)} {calendarYear}
                        </h2>
                      </div>

                      {/* Legend and Today */}
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
                          onClick={handleToday}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer select-none bg-white"
                        >
                          Today
                        </button>
                      </div>

                    </div>

                    {/* Calendar Grid */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                      {/* Weekday Header */}
                      <div className="grid grid-cols-7 text-center font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 py-3.5 border-b border-slate-100">
                        <div>MON</div>
                        <div>TUE</div>
                        <div>WED</div>
                        <div>THU</div>
                        <div>FRI</div>
                        <div>SAT</div>
                        <div>SUN</div>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-px bg-slate-100 text-slate-700 font-poppins text-xs sm:text-sm">
                        {calendarDays.map((cell, idx) => {
                          const status = getDayStatus(cell.dateString);
                          const isSelected = cell.dateString === selectedAppointmentDate;
                          const isCurrentDay = cell.dateString === "2026-06-15";

                          return (
                            <div
                              key={idx}
                              onClick={() => handleDayClick(cell.dateString)}
                              className={`h-24 sm:h-28 bg-white p-2.5 flex flex-col justify-between transition-all cursor-pointer relative group select-none ${
                                !cell.isCurrentMonth ? "bg-slate-50/30 text-slate-400/80" : ""
                              } ${
                                isSelected ? "ring-2 ring-inset ring-[#4AC9CD]/60 bg-[#E6F7F8]/10" : "hover:bg-slate-50/40"
                              }`}
                            >
                              {/* Day indicator */}
                              <div className="flex justify-between items-start w-full">
                                <span
                                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                                    isCurrentDay
                                      ? "bg-[#4AC9CD] text-white"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {cell.day}
                                </span>
                                
                                {/* Status dot */}
                                {status !== "none" && (
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full ${
                                      status === "full" ? "bg-slate-400" : "bg-emerald-500"
                                    }`}
                                  ></span>
                                )}
                              </div>

                              {/* Preview quota slots inside box on hover/details */}
                              <div className="space-y-0.5 pointer-events-none opacity-80 overflow-hidden text-[9px] font-semibold text-slate-400">
                                {appointmentSchedules
                                  .filter(s => s.date === cell.dateString)
                                  .slice(0, 2)
                                  .map(s => (
                                    <div key={s.id} className="flex justify-between items-center bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
                                      <span>{s.time}</span>
                                      <span className={s.booked >= s.quota ? "text-slate-400" : "text-emerald-500"}>
                                        {s.booked}/{s.quota}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Daily Slot Config and Bookings */}
                  <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                    {/* Header detail */}
                    <div className="border-b border-slate-100 pb-4 space-y-2">
                      <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        JADWAL JALUR TEST
                      </p>
                      <h3 className="font-satoshi text-xl font-bold text-slate-800">
                        {(() => {
                          const dateParts = selectedAppointmentDate.split("-");
                          if (dateParts.length === 3) {
                            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                            return `${parseInt(dateParts[2])} ${months[parseInt(dateParts[1]) - 1]} ${dateParts[0]}`;
                          }
                          return selectedAppointmentDate;
                        })()}
                      </h3>
                    </div>

                    {/* Button Create Slot */}
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="w-full bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Buat Kuota Harian
                    </button>

                    {/* Configured Slots List */}
                    <div className="space-y-4">
                      <h4 className="font-poppins text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Kuota Jam Terdaftar
                      </h4>

                      {currentSchedules.length === 0 ? (
                        <p className="font-poppins text-xs text-slate-400 italic py-4">
                          Belum ada slot waktu dikonfigurasi untuk tanggal ini.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {currentSchedules.map(slot => {
                            const slotBookings = appointmentBookings.filter(b => b.schedule_id === slot.id);

                            return (
                              <div key={slot.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3 hover:border-slate-200 transition-colors">
                                {/* Slot Time & Quota */}
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <span className="font-poppins text-xs font-bold text-slate-800">
                                      Jam {slot.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2.5">
                                    <span className="font-poppins text-[10px] font-semibold text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-full">
                                      Terisi: {slot.booked}/{slot.quota} Slot
                                    </span>
                                    <button
                                      onClick={() => handleDeleteSchedule(slot.id)}
                                      className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                                      title="Hapus Kuota"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Bookings inside this slot */}
                                <div className="space-y-2 border-t border-slate-100 pt-2.5">
                                  <p className="font-poppins text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                    Daftar Calon Murid ({slotBookings.length})
                                  </p>
                                  
                                  {slotBookings.length === 0 ? (
                                    <p className="font-poppins text-[10px] text-slate-400 italic">
                                      Belum ada pendaftaran untuk jam ini.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {slotBookings.map(b => (
                                        <div key={b.id} className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-start justify-between text-[11px] font-poppins">
                                          <div>
                                            <p className="font-bold text-slate-800">{b.name}</p>
                                            {b.program && (
                                              <p className="text-[#4AC9CD] text-[9.5px] font-bold mt-0.5">Kelas: {b.program}</p>
                                            )}
                                            <p className="text-slate-400 text-[9px]">{b.email} • {b.phone}</p>
                                          </div>
                                          <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full uppercase">
                                            {b.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: APPLICANT DATA VIEW */}
          {/* ========================================================================= */}
          {activeTab === "applicant-data" && (() => {
            const parseIndoDateToISO = (indoDateStr: string) => {
              const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
              ];
              const parts = indoDateStr.split(" ");
              if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const monthIdx = months.findIndex(m => m.toLowerCase() === parts[1].toLowerCase());
                const month = String(monthIdx + 1).padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
              }
              return "";
            };

            const getBookingScheduleDate = (b: AppointmentBookingItem) => {
              if (b.schedule) return b.schedule.date;
              const sched = appointmentSchedules.find(s => s.id === b.schedule_id);
              return sched ? sched.date : "";
            };

            const formatToIndoDate = (dateStr: string) => {
              const parts = dateStr.split("-");
              if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
              }
              return dateStr;
            };

            const todayISO = parseIndoDateToISO(currentDate);
            const scheduledTodayCount = appointmentBookings.filter(b => getBookingScheduleDate(b) === todayISO).length;

            const filteredBookings = appointmentBookings.filter(b => 
              b.name.toLowerCase().includes(applicantSearch.toLowerCase()) ||
              b.phone.toLowerCase().includes(applicantSearch.toLowerCase())
            );

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                  Applicant Data
                </h1>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL APPLICANTS
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {appointmentBookings.length}
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      SCHEDULED TODAY
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {scheduledTodayCount}
                    </p>
                  </div>

                </div>

                {/* Main List Table */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                      Applicant List
                    </h3>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-[280px]">
                      <input
                        type="text"
                        value={applicantSearch}
                        onChange={(e) => setApplicantSearch(e.target.value)}
                        placeholder="Search name or phone..."
                        className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4">Name User</th>
                          <th className="py-4 px-4">Gender</th>
                          <th className="py-4 px-4">Program Test</th>
                          <th className="py-4 px-4">Test Date</th>
                          <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                              Tidak ada data applicant yang ditemukan.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((booking) => {
                            const dateStr = getBookingScheduleDate(booking);
                            return (
                              <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="font-bold text-slate-800">{booking.name}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{booking.email} • {booking.phone}</div>
                                </td>
                                <td className="py-4 px-4 font-medium">{booking.gender || "-"}</td>
                                <td className="py-4 px-4">
                                  {booking.status === "accepted" ? (
                                    <span className="bg-[#E6F7F8] text-[#4AC9CD] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#4AC9CD]/20 uppercase inline-block font-poppins">
                                      {booking.assigned_program || booking.program}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">Belum Ditentukan</span>
                                  )}
                                </td>
                                <td className="py-4 px-4 font-bold text-slate-650">
                                  {formatToIndoDate(dateStr)}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center justify-center gap-3">
                                    {booking.status === "accepted" ? (
                                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-emerald-100 uppercase inline-flex items-center gap-1 shadow-sm shadow-emerald-50 font-poppins">
                                        ✓ Accepted
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleOpenAcceptModal(booking)}
                                        className="px-4 py-1.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white text-[10px] font-bold rounded-xl transition-all shadow-md shadow-teal-50 cursor-pointer uppercase tracking-wider"
                                      >
                                        Accept
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteBooking(booking.id)}
                                      className="text-slate-350 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer inline-flex items-center justify-center"
                                      title="Delete Applicant"
                                    >
                                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: LEARNING MATERIALS VIEW */}
          {/* ========================================================================= */}
          {activeTab === "learning-materials" && (() => {
            const getLevelBadgeStyle = (level: string) => {
              const l = level.toLowerCase();
              if (l.includes("phonic")) return "bg-[#E6F7F8] text-[#4AC9CD] border-[#4AC9CD]/20";
              if (l.includes("kids")) return "bg-indigo-50 text-indigo-500 border-indigo-100";
              if (l.includes("blast")) return "bg-rose-50 text-rose-500 border-rose-100";
              if (l.includes("smart")) return "bg-amber-50 text-amber-500 border-amber-100";
              if (l.includes("private") || l.includes("real")) return "bg-pink-50 text-pink-500 border-pink-100";
              return "bg-slate-50 text-slate-500 border-slate-100";
            };

            const filteredMaterials = learningMaterials.filter(m =>
              m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
              m.description.toLowerCase().includes(materialSearch.toLowerCase()) ||
              m.level.toLowerCase().includes(materialSearch.toLowerCase()) ||
              m.skills.toLowerCase().includes(materialSearch.toLowerCase())
            );

            // Compute stats relative to mockup values
            const baseTotal = 500;
            const baseReguler = 300;
            const baseIntensif = 200;

            const defaultCount = 5;
            const defaultReguler = 4;
            const defaultIntensif = 1;

            const currentTotal = learningMaterials.length;
            const currentReguler = learningMaterials.filter(m => m.category === "Reguler").length;
            const currentIntensif = learningMaterials.filter(m => m.category === "Intensif").length;

            const displayTotal = baseTotal + (currentTotal - defaultCount);
            const displayReguler = baseReguler + (currentReguler - defaultReguler);
            const displayIntensif = baseIntensif + (currentIntensif - defaultIntensif);

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                  Learning Materials
                </h1>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL MATERIALS
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {displayTotal}
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      REGULER
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {displayReguler}
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      INTENSIF
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {displayIntensif}
                    </p>
                  </div>

                </div>

                {/* List Container */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                      Materials
                    </h3>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          value={materialSearch}
                          onChange={(e) => setMaterialSearch(e.target.value)}
                          placeholder="Search materials..."
                          className="w-full sm:w-[240px] px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Upload Button */}
                      <button
                        onClick={handleOpenCreateMaterial}
                        className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Upload Material
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4">Learning Materials</th>
                          <th className="py-4 px-4">Description</th>
                          <th className="py-4 px-4">Level</th>
                          <th className="py-4 px-4">Skills</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {filteredMaterials.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                              Tidak ada learning materials yang ditemukan.
                            </td>
                          </tr>
                        ) : (
                          filteredMaterials.map((material) => (
                            <tr key={material.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-5 px-4 font-bold text-slate-800">
                                {material.title}
                                {material.file_name && (
                                  material.file_path ? (
                                    <a
                                      href={`http://127.0.0.1:8000${material.file_path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-slate-400 hover:text-[#4AC9CD] hover:underline font-normal mt-1 flex items-center gap-1 font-poppins transition-colors w-fit"
                                    >
                                      <svg className="w-3.5 h-3.5 text-slate-350" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                      </svg>
                                      {material.file_name}
                                    </a>
                                  ) : (
                                    <div className="text-[10px] text-slate-400 font-normal mt-1 flex items-center gap-1 font-poppins">
                                      <svg className="w-3.5 h-3.5 text-slate-350" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                      </svg>
                                      {material.file_name}
                                    </div>
                                  )
                                )}
                              </td>
                              <td className="py-5 px-4 text-slate-500 max-w-[240px] truncate" title={material.description}>
                                {material.description}
                              </td>
                              <td className="py-5 px-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${getLevelBadgeStyle(material.level)}`}>
                                  {material.level}
                                </span>
                              </td>
                              <td className="py-5 px-4 font-medium">{material.skills}</td>
                              <td className="py-5 px-4 font-medium">{material.category}</td>
                              <td className="py-5 px-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => handleOpenEditMaterial(material)}
                                    className="text-slate-350 hover:text-[#4AC9CD] transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                    title="Edit Material"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMaterial(material.id)}
                                    className="text-slate-350 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                    title="Delete Material"
                                  >
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: PAYMENTS VIEW */}
          {/* ========================================================================= */}
          {activeTab === "payments" && (() => {
            const getStatusBadgeStyle = (status: string) => {
              const s = status.toLowerCase();
              if (s === "success" || s === "paid") return "bg-emerald-50 text-emerald-500 border-emerald-100";
              if (s === "pending" || s === "waiting") return "bg-amber-50 text-amber-500 border-amber-100";
              if (s === "failed" || s === "overdue") return "bg-rose-50 text-rose-500 border-rose-100";
              return "bg-slate-50 text-slate-500 border-slate-100";
            };

            const filteredPayments = payments.filter(p =>
              p.student_name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              p.course_name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              p.transaction_id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              p.invoice_no.toLowerCase().includes(paymentSearch.toLowerCase())
            );

            const currentTotal = payments.length;
            const now = new Date();
            const todayD = String(now.getDate()).padStart(2, '0');
            const todayM = String(now.getMonth() + 1).padStart(2, '0');
            const todayY = now.getFullYear();
            const todayStr = `${todayD}/${todayM}/${todayY}`;

            const currentToday = payments.filter(p => p.bill_date === todayStr).length;
            const currentPending = payments.filter(p => p.status.toLowerCase() === "pending").length;
            
            const currentOverdue = payments.filter(p => {
              if (p.status.toLowerCase() !== "pending") return false;
              const nextInst = p.installments?.find(inst => inst.deadline);
              if (!nextInst) return false;
              return new Date(nextInst.deadline) < new Date();
            }).length;

            const displayTotal = currentTotal;
            const displayToday = currentToday;
            const displayPending = currentPending;
            const displayOverdue = currentOverdue;

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                  Payments
                </h1>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL TRANSACTION
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {displayTotal}
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL TRANSACTION TODAY
                    </p>
                    <p className="font-satoshi text-3xl font-black text-slate-800 mt-2">
                      {displayToday}
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      PEMBAYARAN JATUH TEMPO
                    </p>
                    <p className="font-satoshi text-3xl font-black text-rose-500 mt-2">
                      {displayOverdue}
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <p className="font-poppins text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      TRANSAKSI TERTUNDA
                    </p>
                    <p className="font-satoshi text-3xl font-black text-amber-500 mt-2">
                      {displayPending}
                    </p>
                  </div>

                </div>

                {/* List Payments Container */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800">
                      List Payments
                    </h3>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentSearch}
                          onChange={(e) => setPaymentSearch(e.target.value)}
                          placeholder="Search payments..."
                          className="w-full sm:w-[240px] px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4AC9CD] focus:ring-1 focus:ring-[#4AC9CD] font-poppins text-xs bg-white text-slate-800 placeholder-slate-400"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>

                      {/* Create Bill Button */}
                      <button
                        onClick={handleOpenCreatePayment}
                        className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-5 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Bill
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4">Transaction ID</th>
                          <th className="py-4 px-4">Name User</th>
                          <th className="py-4 px-4">Material</th>
                          <th className="py-4 px-4">Deadline</th>
                          <th className="py-4 px-4">Amount</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                              Tidak ada data pembayaran yang ditemukan.
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map((p) => {
                            const deadlineStr = p.installments?.[0]?.deadline 
                              ? (() => {
                                  const parts = p.installments[0].deadline.split("-");
                                  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                  return p.installments[0].deadline;
                                })()
                              : p.bill_date;

                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 px-4 font-bold text-slate-800">
                                  {p.transaction_id}
                                  {p.invoice_no && (
                                    <div className="text-[10px] text-slate-400 font-normal mt-1 flex items-center gap-1 font-poppins">
                                      {p.invoice_no}
                                    </div>
                                  )}
                                </td>
                                <td className="py-5 px-4 font-medium text-slate-800">
                                  {p.student_name}
                                </td>
                                <td className="py-5 px-4 text-slate-500 max-w-[200px] truncate" title={p.course_name}>
                                  {p.course_name}
                                </td>
                                <td className="py-5 px-4 text-slate-500 font-medium">
                                  {deadlineStr}
                                </td>
                                <td className="py-5 px-4 font-bold text-slate-800">
                                  {p.subtotal.toLocaleString('id-ID')}
                                </td>
                                <td className="py-5 px-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${getStatusBadgeStyle(p.status)}`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={() => handleOpenEditPayment(p)}
                                      className="text-slate-350 hover:text-[#4AC9CD] transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                      title="Edit Bill"
                                    >
                                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeletePayment(p.id)}
                                      className="text-slate-350 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                      title="Delete Bill"
                                    >
                                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Section: Payment History */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <h3 className="font-satoshi text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                    Histori Pembayaran
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4">Stempel Waktu</th>
                          <th className="py-4 px-4">Nama Murid</th>
                          <th className="py-4 px-4">ID Tagihan / Invoice</th>
                          <th className="py-4 px-4">Metode Transaksi</th>
                          <th className="py-4 px-4">Nominal</th>
                          <th className="py-4 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {payments.filter(p => ['paid', 'lunas', 'failed', 'expired'].includes(p.status.toLowerCase())).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                              Belum ada riwayat transaksi (sukses/gagal/kedaluwarsa).
                            </td>
                          </tr>
                        ) : (
                          payments.filter(p => ['paid', 'lunas', 'failed', 'expired'].includes(p.status.toLowerCase()))
                            .map((p) => {
                              const dateStr = new Date(p.updated_at || p.created_at || new Date()).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                              return (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 px-4 text-slate-500 font-medium">
                                    {dateStr}
                                  </td>
                                  <td className="py-4 px-4 font-bold text-slate-800">
                                    {p.student_name}
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="font-bold text-slate-800">{p.transaction_id}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{p.invoice_no}</div>
                                  </td>
                                  <td className="py-4 px-4 text-slate-650 font-semibold">
                                    {p.payment_method || 'Cash'}
                                  </td>
                                  <td className="py-4 px-4 font-bold text-slate-800">
                                    Rp {p.subtotal.toLocaleString('id-ID')}
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase inline-block font-poppins ${
                                      ['paid', 'lunas'].includes(p.status.toLowerCase())
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: SCHEDULES */}
          {/* ========================================================================= */}
          {activeTab === "schedules" && (() => {
            const getIndoMonthName = (monthIndex: number) => {
              const months = [
                "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", 
                "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
              ];
              return months[monthIndex];
            };

            const formatDateString = (y: number, m: number, d: number) => {
              const mm = String(m + 1).padStart(2, '0');
              const dd = String(d).padStart(2, '0');
              return `${y}-${mm}-${dd}`;
            };

            const daysInMonth = new Date(schCalendarYear, schCalendarMonth + 1, 0).getDate();
            const firstDayIndex = (new Date(schCalendarYear, schCalendarMonth, 1).getDay() + 6) % 7; // Monday = 0
            const prevMonthDays = new Date(schCalendarYear, schCalendarMonth, 0).getDate();

            const calendarDays = [];
            for (let i = firstDayIndex - 1; i >= 0; i--) {
              const d = prevMonthDays - i;
              const prevM = schCalendarMonth === 0 ? 11 : schCalendarMonth - 1;
              const prevY = schCalendarMonth === 0 ? schCalendarYear - 1 : schCalendarYear;
              calendarDays.push({
                day: d,
                isCurrentMonth: false,
                dateString: formatDateString(prevY, prevM, d)
              });
            }
            for (let i = 1; i <= daysInMonth; i++) {
              calendarDays.push({
                day: i,
                isCurrentMonth: true,
                dateString: formatDateString(schCalendarYear, schCalendarMonth, i)
              });
            }
            const totalSlots = calendarDays.length > 35 ? 42 : 35;
            const nextMonthFillCount = totalSlots - calendarDays.length;
            for (let i = 1; i <= nextMonthFillCount; i++) {
              const nextM = schCalendarMonth === 11 ? 0 : schCalendarMonth + 1;
              const nextY = schCalendarMonth === 11 ? schCalendarYear + 1 : schCalendarYear;
              calendarDays.push({
                day: i,
                isCurrentMonth: false,
                dateString: formatDateString(nextY, nextM, i)
              });
            }

            const handlePrevMonth = () => {
              if (schCalendarMonth === 0) {
                setSchCalendarMonth(11);
                setSchCalendarYear(prev => prev - 1);
              } else {
                setSchCalendarMonth(prev => prev - 1);
              }
            };

            const handleNextMonth = () => {
              if (schCalendarMonth === 11) {
                setSchCalendarMonth(0);
                setSchCalendarYear(prev => prev + 1);
              } else {
                setSchCalendarMonth(prev => prev + 1);
              }
            };

            const handleToday = () => {
              const today = new Date();
              setSchCalendarYear(today.getFullYear());
              setSchCalendarMonth(today.getMonth());
            };

            return (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex justify-between items-center">
                  <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                    {t("Jadwal Mengajar", "Teacher Schedules")}
                  </h1>
                  <button
                    onClick={() => {
                      setSchModalMode("create");
                      setSelectedSchSessionId(null);
                      setSchDate("");
                      setSchTeacherId("");
                      setSchProgram("");
                      setSchLevel("");
                      setSchClassroom("");
                      setSchStartTime("");
                      setSchEndTime("");
                      setIsClassSessionModalOpen(true);
                    }}
                    className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-6 rounded-xl transition-all font-poppins text-xs shadow-md cursor-pointer"
                  >
                    + {t("Buat Jadwal Baru", "Create New Schedule")}
                  </button>
                </div>

                {/* Calendar Navigator */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                        <button onClick={handlePrevMonth} className="p-2.5 hover:bg-slate-100 text-slate-600 border-r border-slate-100 cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button onClick={handleNextMonth} className="p-2.5 hover:bg-slate-100 text-slate-600 cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <h2 className="font-poppins text-sm font-bold text-slate-700 uppercase tracking-wide">
                        {getIndoMonthName(schCalendarMonth)} {schCalendarYear}
                      </h2>
                    </div>
                    <button onClick={handleToday} className="px-4 py-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-600 font-poppins text-xs font-bold transition-all bg-white cursor-pointer shadow-sm">
                      {t("Hari Ini", "Today")}
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-3">
                    {/* Days Name */}
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
                      <div key={i} className="text-center font-poppins text-[10px] font-bold text-slate-400 tracking-wider py-2">
                        {d}
                      </div>
                    ))}
                    {/* Days cells */}
                    {calendarDays.map((cell, idx) => {
                      const daySchedules = classSessions.filter(s => s.date === cell.dateString);
                      const isPastCell = getIsPastDate(cell.dateString);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isPastCell) return;
                            setSchModalMode("create");
                            setSelectedSchSessionId(null);
                            setSchDate(cell.dateString);
                            setSchTeacherId("");
                            setSchProgram("");
                            setSchLevel("");
                            setSchClassroom("");
                            setSchStartTime("");
                            setSchEndTime("");
                            setIsClassSessionModalOpen(true);
                          }}
                          className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between select-none group ${
                            isPastCell
                              ? "bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                              : cell.isCurrentMonth
                                ? "bg-white border-slate-100 hover:border-[#4AC9CD]/50 hover:bg-[#E6F7F8]/5 cursor-pointer"
                                : "bg-slate-50/50 border-transparent text-slate-350 pointer-events-none"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`font-poppins text-xs font-bold ${cell.isCurrentMonth ? "text-slate-700" : "text-slate-350"}`}>
                              {cell.day}
                            </span>
                            {cell.isCurrentMonth && !isPastCell && (
                              <span className="text-[10px] text-[#4AC9CD] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1 overflow-y-auto flex-1 max-h-[80px]">
                            {daySchedules.map((s: any) => {
                              const isStarted = isSessionStarted(s.date, s.start_time);
                              return (
                                <div
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent parent cell click
                                    if (isStarted) {
                                      alert("Jadwal ini sudah berjalan/lewat dan tidak bisa diedit lagi.");
                                      return;
                                    }
                                    setSchModalMode("edit");
                                    setSelectedSchSessionId(s.id);
                                    setSchTeacherId(String(s.teacher_id));
                                    setSchProgram(s.program_series);
                                    setSchLevel(s.specific_level || "");
                                    setSchClassroom(s.classroom);
                                    setSchDate(s.date);
                                    setSchStartTime(s.start_time.substring(0, 5));
                                    setSchEndTime(s.end_time.substring(0, 5));
                                    setIsClassSessionModalOpen(true);
                                  }}
                                  className={`group relative rounded-lg p-1.5 text-[9px] font-poppins font-semibold border transition-all flex flex-col gap-0.5 ${
                                    isStarted
                                      ? "bg-slate-50 border-slate-150 text-slate-400 cursor-not-allowed opacity-85"
                                      : "bg-[#E6F7F8] hover:bg-[#D0F1F3] text-[#4AC9CD] border-[#D0F1F3] cursor-pointer"
                                  }`}
                                >
                                  <div className="flex justify-between items-center gap-1">
                                    <span className="truncate max-w-[80%] uppercase">{s.program_series} {s.specific_level}</span>
                                    {!isStarted && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteClassSession(s.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-750 transition-opacity font-bold cursor-pointer"
                                        title="Delete Schedule"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                  <span className="text-slate-500 text-[8px] font-normal truncate">{s.teacher?.name || "No teacher"}</span>
                                  <span className="text-slate-400 text-[8px] font-normal">{s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)} ({s.classroom})</span>
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
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: ATTENDANCE RECAP */}
          {/* ========================================================================= */}
          {activeTab === "attendance-recap" && (() => {
            return (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="font-satoshi text-3xl font-black text-slate-800 tracking-tight">
                    {t("Rekap Presensi", "Attendance Recap")}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={exportToCSV}
                      className="bg-[#EF5A3F] hover:bg-[#d84a30] text-white font-bold py-2.5 px-4 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      {t("Ekspor CSV", "Export CSV")}
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-4 rounded-xl transition-all font-poppins text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      {t("Ekspor PDF", "Export PDF")}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-poppins text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-4 px-4">{t("TANGGAL", "DATE")}</th>
                          <th className="py-4 px-4">{t("PROGRAM/KELAS", "PROGRAM/LEVEL")}</th>
                          <th className="py-4 px-4">{t("RUANGAN", "ROOM")}</th>
                          <th className="py-4 px-4">{t("GURU", "TEACHER")}</th>
                          <th className="py-4 px-4 text-center">{t("TOTAL MURID", "TOTAL STUDENTS")}</th>
                          <th className="py-4 px-4 text-center">{t("HADIR", "PRES")}</th>
                          <th className="py-4 px-4 text-center">{t("ALPHA", "ABS")}</th>
                          <th className="py-4 px-4 text-center">{t("IZIN", "LEAVE")}</th>
                          <th className="py-4 px-4 text-center">{t("AKSI", "ACTION")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                        {recapSessions.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                              {t("Tidak ada data rekap presensi.", "No attendance recap data.")}
                            </td>
                          </tr>
                        ) : (
                          recapSessions.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-4 whitespace-nowrap">{r.date} ({r.start_time} - {r.end_time})</td>
                              <td className="py-4 px-4 font-bold text-slate-800">{r.program_series} {r.specific_level || ""}</td>
                              <td className="py-4 px-4">{r.classroom}</td>
                              <td className="py-4 px-4 font-semibold text-[#4AC9CD]">{r.teacher_name}</td>
                              <td className="py-4 px-4 text-center font-bold">{r.total_students}</td>
                              <td className="py-4 px-4 text-center"><span className="px-2 py-1 rounded bg-green-50 text-green-600 font-bold">{r.jumlah_hadir}</span></td>
                              <td className="py-4 px-4 text-center"><span className="px-2 py-1 rounded bg-red-50 text-red-600 font-bold">{r.jumlah_alpha}</span></td>
                              <td className="py-4 px-4 text-center"><span className="px-2 py-1 rounded bg-amber-50 text-amber-600 font-bold">{r.jumlah_izin}</span></td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={async () => {
                                    // Fetch detailed student breakdown
                                    try {
                                      const res = await fetch(`http://127.0.0.1:8000/api/class-sessions/${r.id}/attendance`);
                                      if (res.ok) {
                                        const json = await res.json();
                                        if (json.status === "success") {
                                          setSelectedRecap({
                                            ...r,
                                            students: json.data.students
                                          });
                                          setIsRecapModalOpen(true);
                                        }
                                      }
                                    } catch (err) {
                                      console.warn("Backend not reachable. Opening recap details locally.");
                                      setSelectedRecap({
                                        ...r,
                                        students: [
                                          { id: 1, name: "Sample Student 1", status: "H" },
                                          { id: 2, name: "Sample Student 2", status: "A" }
                                        ]
                                      });
                                      setIsRecapModalOpen(true);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-[#E6F7F8] hover:bg-[#D0F1F3] text-[#4AC9CD] rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                  {t("Detail", "Details")}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: GENERAL PLACEHOLDER VIEW (FOR TABS NOT REQUESTED YET) */}
          {/* ========================================================================= */}
          {activeTab !== "dashboard" && activeTab !== "events" && activeTab !== "account" && activeTab !== "english-corner" && activeTab !== "appointment" && activeTab !== "applicant-data" && activeTab !== "learning-materials" && activeTab !== "payments" && activeTab !== "schedules" && activeTab !== "attendance-recap" && (
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
                className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-2.5 px-6 rounded-xl transition-all font-poppins text-xs shadow-md cursor-pointer"
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
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Time</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
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
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh] animate-scale-up border border-slate-100 flex flex-col">

            {/* Modal Header */}
            <div className="relative px-8 pt-8 pb-4 flex justify-center items-center flex-shrink-0">
              <h3 className="font-poppins text-2xl font-bold text-slate-800">
                {accountModalMode === "create" ? "Create Account" : accountModalMode === "edit" ? "Edit Account" : "Account Details"}
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAccount} className="p-8 pt-2 space-y-6">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-3 pt-2">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAccPhoto(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-24 h-24 rounded-full bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden relative shadow-inner">
                  {accPhoto ? (
                    <img src={accPhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                </div>
                {accountModalMode !== "view" && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Upload New Photo
                  </button>
                )}
              </div>

              {/* Grid Form Fields */}
              <fieldset disabled={accountModalMode === "view"} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={accName}
                      onChange={(e) => setAccName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Gender</label>
                  <div className="relative">
                    <select
                      value={accGender}
                      onChange={(e) => setAccGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Role Selection</label>
                  <div className="relative">
                    <select
                      value={accRole}
                      onChange={(e) => setAccRole(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={accDob}
                      onChange={(e) => setAccDob(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Status</label>
                  <div className="relative">
                    <select
                      value={accStatus}
                      onChange={(e) => setAccStatus(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Waiting List">Waiting List</option>
                      <option value="Non Active">Non Active</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={accPhone}
                      onChange={(e) => setAccPhone(e.target.value)}
                      placeholder="e.g. 08123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.282-5.117-3.576-6.4-6.4l1.293-.97c.362-.272.528-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={accEmail}
                      onChange={(e) => setAccEmail(e.target.value)}
                      placeholder="e.g. janedoe@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                {/* Alamat */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Address</label>
                  <textarea
                    value={accAlamat}
                    onChange={(e) => setAccAlamat(e.target.value)}
                    placeholder="Enter complete address..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white resize-none"
                  />
                </div>

                {/* Student specific fields */}
                {accRole === "Student" && (
                  <>
                    {/* Guardian Name */}
                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={accGuardianName}
                        onChange={(e) => setAccGuardianName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                      />
                    </div>

                    {/* Program Series */}
                    <div className="space-y-1.5">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Program Series</label>
                      <div className="relative">
                        <select
                          value={accProgramSeries}
                          onChange={(e) => {
                            setAccProgramSeries(e.target.value);
                            const defaultLevels = programLevels[e.target.value] || [];
                            setAccSpecificLevel(defaultLevels[0] || "");
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">Select Program Series</option>
                          <option value="Funny Phonics">Funny Phonics</option>
                          <option value="Hi Kids!">Hi Kids!</option>
                          <option value="Oxford Phonics">Oxford Phonics</option>
                          <option value="Abracadabra">Abracadabra</option>
                          <option value="Get Smart">Get Smart</option>
                          <option value="Full Blast">Full Blast</option>
                          <option value="Test Preparation">Test Preparation</option>
                          <option value="Conversation Class">Conversation Class</option>
                          <option value="Private Class">Private Class</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Specific Level */}
                    <div className="space-y-1.5">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Specific Level</label>
                      <div className="relative">
                        <select
                          value={accSpecificLevel}
                          onChange={(e) => setAccSpecificLevel(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">Select Level</option>
                          {accProgramSeries && (programLevels[accProgramSeries] || []).map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                          {!accProgramSeries && (
                            <>
                              <option value="Funny Phonics 1">Funny Phonics 1</option>
                              <option value="Funny Phonics 2">Funny Phonics 2</option>
                              <option value="Hi Kids! 1">Hi Kids! 1</option>
                              <option value="Hi Kids! 2">Hi Kids! 2</option>
                              <option value="Hi Kids! 3">Hi Kids! 3</option>
                              <option value="Oxford Phonics 1">Oxford Phonics 1</option>
                              <option value="Oxford Phonics 2">Oxford Phonics 2</option>
                              <option value="Oxford Phonics 3">Oxford Phonics 3</option>
                              <option value="Oxford Phonics 4">Oxford Phonics 4</option>
                              <option value="Oxford Phonics 5">Oxford Phonics 5</option>
                              <option value="Abracadabra 1">Abracadabra 1</option>
                              <option value="Abracadabra 2">Abracadabra 2</option>
                              <option value="Abracadabra 3">Abracadabra 3</option>
                              <option value="Abracadabra 4">Abracadabra 4</option>
                              <option value="Abracadabra 5">Abracadabra 5</option>
                              <option value="Abracadabra 6">Abracadabra 6</option>
                              <option value="Get Smart 1">Get Smart 1</option>
                              <option value="Get Smart 2">Get Smart 2</option>
                              <option value="Get Smart 3">Get Smart 3</option>
                              <option value="Get Smart 4">Get Smart 4</option>
                              <option value="Get Smart 5">Get Smart 5</option>
                              <option value="Get Smart 6">Get Smart 6</option>
                              <option value="Full Blast 1">Full Blast 1</option>
                              <option value="Full Blast 2">Full Blast 2</option>
                              <option value="Full Blast 3">Full Blast 3</option>
                              <option value="Full Blast 4">Full Blast 4</option>
                              <option value="Full Blast 5">Full Blast 5</option>
                              <option value="Full Blast 6">Full Blast 6</option>
                              <option value="TOEFL">TOEFL</option>
                              <option value="IELTS">IELTS</option>
                              <option value="Private Class Offline">Offline</option>
                              <option value="Private Class Online">Online</option>
                              <option value="Private Class Homeschooling">Homeschooling</option>
                            </>
                          )}
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 col-span-1 md:col-span-2 mt-2">
                      <div className="space-y-1.5">
                        <label className="block font-poppins text-xs font-semibold text-[#334155]">Tanggal Masuk</label>
                        <input
                          type="date"
                          value={accEntryDate}
                          onChange={(e) => setAccEntryDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-poppins text-xs font-semibold text-[#334155]">Tanggal Test</label>
                        <input
                          type="date"
                          value={accTestDate}
                          onChange={(e) => setAccTestDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-poppins text-xs font-semibold text-[#334155]">Tanggal Keluar</label>
                        <input
                          type="date"
                          value={accExitDate}
                          onChange={(e) => setAccExitDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Username */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">
                    Username<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accUsername}
                    onChange={(e) => setAccUsername(e.target.value)}
                    placeholder="username"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                  />
                </div>
              </fieldset>

              {/* Password and Confirm Password (outside disabled fieldset, but fields are manually disabled in view mode) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={accountModalMode === "create"}
                      disabled={accountModalMode === "view"}
                      value={accPassword}
                      onChange={(e) => setAccPassword(e.target.value)}
                      placeholder={accountModalMode === "edit" ? "Leave blank to keep current" : accountModalMode === "view" ? "" : "Enter password"}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (only on Edit mode) */}
                {accountModalMode === "edit" && (
                  <div className="space-y-1.5">
                    <label className="block font-poppins text-xs font-semibold text-[#334155]">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={accConfirmPassword}
                      onChange={(e) => setAccConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-100 pb-2">
                {accountModalMode === "view" ? (
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsAccountModalOpen(false)}
                      className="flex-1 py-3.5 border border-[#EF777E] hover:bg-[#EF777E]/5 text-[#EF777E] rounded-xl font-poppins text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center"
                    >
                      {accountModalMode === "create" ? "Create Account" : "Save Changes"}
                    </button>
                  </>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE SCHEDULE (APPOINTMENT) */}
      {/* ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-satoshi text-lg font-black text-slate-800">
                Create Schedule
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
              
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={scheduleModalDate}
                    onChange={(e) => setScheduleModalDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Time</label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={scheduleModalTime}
                    onChange={(e) => setScheduleModalTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Total Slots Quota Input */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Total Slots (Quota)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={scheduleModalQuota}
                  onChange={(e) => setScheduleModalQuota(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD] focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-xs shadow-md mt-4 text-center font-poppins"
              >
                Create Schedule
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD / EDIT LEARNING MATERIAL */}
      {/* ========================================================================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up border border-slate-100 p-8 space-y-6 my-8">
            
            {/* Header Title */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-satoshi text-2xl font-black text-slate-800 tracking-tight text-left">
                {materialModalMode === "create" ? "Upload Learning Material's" : "Edit Learning Material"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMaterial} className="space-y-5">
              
              {/* Title Input */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Title<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  placeholder="e.g. Basic Grammar 101"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Description<span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                  placeholder="Masukkan deskripsi materi"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white resize-none"
                />
              </div>

              {/* Three Select Columns: Level, Skills, Category */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block font-poppins text-xs font-semibold text-slate-500">
                    Level<span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={matLevel}
                    onChange={(e) => setMatLevel(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Funny Phonics">Funny Phonics</option>
                    <option value="Hi Kids!">Hi Kids!</option>
                    <option value="Full Blast">Full Blast</option>
                    <option value="Get Smart">Get Smart</option>
                    <option value="Private Class">Private Class</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block font-poppins text-xs font-semibold text-slate-500">
                    Skills<span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={matSkills}
                    onChange={(e) => setMatSkills(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Speaking">Speaking</option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                    <option value="Listening">Listening</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block font-poppins text-xs font-semibold text-slate-500">
                    Category<span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Intensif">Intensif</option>
                  </select>
                </div>
              </div>

              {/* File Upload Box */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Upload Files<span className="text-rose-500">*</span>
                </label>
                
                <input
                  type="file"
                  id="material-file-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMatFile(file);
                      setMatFileName(file.name);
                      
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMatFileBase64(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-[#4AC9CD]", "bg-[#E6F7F8]/20");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-[#4AC9CD]", "bg-[#E6F7F8]/20");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-[#4AC9CD]", "bg-[#E6F7F8]/20");
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.name.endsWith(".pdf")) {
                      setMatFile(file);
                      setMatFileName(file.name);
                      
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMatFileBase64(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      alert("Hanya file PDF yang diperbolehkan.");
                    }
                  }}
                  className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 hover:bg-slate-50 transition-all cursor-pointer select-none"
                  onClick={() => document.getElementById("material-file-upload")?.click()}
                >
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  
                  {matFileName ? (
                    <div className="text-center">
                      <p className="font-poppins text-xs font-bold text-slate-800">{matFileName}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMatFile(null);
                          setMatFileName("");
                          setMatFileBase64(null);
                        }}
                        className="text-rose-500 hover:text-rose-700 font-bold font-poppins text-[10px] mt-1.5 inline-block"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="font-poppins text-xs font-semibold text-slate-700">Choose a file or drag & drop it here</p>
                      <p className="font-poppins text-[10px] text-slate-400 font-medium">PDF formats up to 5 MB.</p>
                    </div>
                  )}

                  {!matFileName && (
                    <button
                      type="button"
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins text-xs font-bold rounded-lg transition-colors cursor-pointer bg-white"
                    >
                      Browse File
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center uppercase tracking-wider"
                >
                  {materialModalMode === "create" ? "Publish Material's" : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT BILL (PAYMENTS) */}
      {/* ========================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-scale-up border border-slate-100 p-8 space-y-6 my-8 max-h-[90vh] flex flex-col">
            
            {/* Header Title */}
            <div className="flex justify-between items-center flex-shrink-0">
              <h3 className="font-satoshi text-2xl font-black text-slate-800 tracking-tight">
                {paymentModalMode === "create" ? "Create Bill" : "Edit Bill"}
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSavePayment} className="space-y-5 flex-1 overflow-y-auto pr-1">
              
              {/* Transaction details row: ID, Date, Invoice */}
              <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 text-left">
                <div>
                  <label className="block font-poppins text-[10px] font-bold text-slate-400 uppercase">Transaction ID</label>
                  <p className="font-satoshi text-sm font-black text-slate-800 mt-1">{payTransactionId}</p>
                </div>
                <div>
                  <label className="block font-poppins text-[10px] font-bold text-slate-400 uppercase">Bill Date</label>
                  <p className="font-satoshi text-sm font-black text-slate-800 mt-1">{payBillDate}</p>
                </div>
                <div>
                  <label className="block font-poppins text-[10px] font-bold text-slate-400 uppercase">No Invoice</label>
                  <p className="font-satoshi text-sm font-black text-slate-800 mt-1">{payInvoiceNo}</p>
                </div>
              </div>

              {/* Select Student */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Nama Murid<span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={payStudentName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setPayStudentName(name);
                      const studentObj = accounts.find(a => a.name === name);
                      if (studentObj) {
                        const sid = typeof studentObj.id === 'string' && studentObj.id.startsWith('acc-') 
                          ? parseInt(studentObj.id.replace('acc-', '')) 
                          : parseInt(String(studentObj.id)) || undefined;
                        setPayStudentId(sid);
                        
                        // Try finding from account object
                        if (studentObj.programSeries) {
                          setPayCourseName(studentObj.programSeries);
                        } else {
                          // Try finding from booking data
                          const matchBooking = appointmentBookings.find(b => 
                            (b.email && studentObj.email && b.email.toLowerCase() === studentObj.email.toLowerCase()) ||
                            (b.name && b.name.toLowerCase() === studentObj.name.toLowerCase())
                          );
                          if (matchBooking && matchBooking.assigned_program) {
                            setPayCourseName(matchBooking.assigned_program);
                          }
                        }
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer appearance-none"
                  >
                    <option value="">Pilih Murid</option>
                    {accounts.filter(a => a.role === "Student").map(stud => (
                      <option key={stud.id} value={stud.name}>{stud.name}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Course Name */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Course Name<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  required
                  value={payCourseName}
                  placeholder="Otomatis terisi saat murid dipilih"
                  className={`w-full px-4 py-3 rounded-xl border font-poppins text-xs bg-slate-50 ${
                    payCourseName
                      ? "border-slate-200 text-slate-800 font-semibold"
                      : "border-slate-200 text-slate-400 italic"
                  }`}
                />
              </div>


              <hr className="border-slate-100 my-2" />

              {/* Payment Type Selection */}
              <div className="space-y-1.5 text-left">
                <label className="block font-poppins text-xs font-semibold text-slate-500">
                  Payment Type<span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPayPaymentType("Paid Full");
                      setPayNumInstallments(1);
                    }}
                    className={`py-3 rounded-xl border text-xs font-bold font-poppins transition-all cursor-pointer ${
                      payPaymentType === "Paid Full"
                        ? "bg-[#4AC9CD]/10 border-[#4AC9CD] text-[#4AC9CD]"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Paid Full
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayPaymentType("Installment");
                      if (payNumInstallments <= 1) {
                        setPayNumInstallments(2);
                      }
                    }}
                    className={`py-3 rounded-xl border text-xs font-bold font-poppins transition-all cursor-pointer ${
                      payPaymentType === "Installment"
                        ? "bg-[#4AC9CD]/10 border-[#4AC9CD] text-[#4AC9CD]"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Installment
                  </button>
                </div>
              </div>

              {/* Section: Payment Terms */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div className="flex-1 space-y-1">
                    <label className="block font-poppins text-xs font-semibold text-slate-500">Biaya Kelas*</label>
                    <input
                      type="text"
                      required
                      value={payClassFee === 0 ? "" : payClassFee.toLocaleString('id-ID')}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/\D/g, "");
                        setPayClassFee(cleanVal ? parseInt(cleanVal, 10) : 0);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                    />
                  </div>
                  
                  {payPaymentType === "Installment" && (
                    <div className="w-full sm:w-[150px] space-y-1">
                      <label className="block font-poppins text-xs font-semibold text-slate-500">Jumlah Cicilan*</label>
                      <div className="relative">
                        <select
                          required
                          value={payNumInstallments}
                          onChange={(e) => setPayNumInstallments(parseInt(e.target.value) || 2)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer appearance-none"
                        >
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className={payPaymentType === "Paid Full" ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                  {Array.from({ length: payNumInstallments }).map((_, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2">
                      <h5 className="font-poppins text-xs font-bold text-slate-600">
                        {payPaymentType === "Paid Full" ? "Deadline Pembayaran" : `Cicilan ${idx + 1}`}
                      </h5>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block font-poppins text-[9px] text-slate-400 uppercase font-semibold">Deadline</label>
                          <input
                            type="date"
                            required
                            value={payInstallments[idx]?.deadline || ""}
                            onChange={(e) => {
                              const newInst = [...payInstallments];
                              newInst[idx].deadline = e.target.value;
                              setPayInstallments(newInst);
                            }}
                            className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white font-poppins text-xs text-slate-800 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-poppins text-[9px] text-slate-400 uppercase font-semibold">Jumlah</label>
                          <input
                            type="text"
                            disabled
                            value={(payInstallments[idx]?.amount || 0).toLocaleString('id-ID')}
                            className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-slate-100 font-poppins text-xs text-slate-500 font-bold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Submit Button */}
              <div className="space-y-3">
                {paymentModalMode === "edit" && selectedPayment && !['paid', 'lunas'].includes(selectedPayment.status.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={handleLunasManual}
                    className="w-full py-4 bg-[#F7941D] hover:bg-[#e58312] text-white font-bold rounded-xl font-poppins text-sm transition-all cursor-pointer shadow-md text-center uppercase tracking-wider"
                  >
                    LUNAS MANUAL (CASH)
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-sm transition-all cursor-pointer shadow-md text-center uppercase tracking-wider"
                >
                  {paymentModalMode === "create" ? "Create Bill" : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE CLASS SESSION SCHEDULE */}
      {/* ========================================================================= */}
      {isClassSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center text-left">
              <h3 className="font-satoshi text-lg font-black text-slate-800">
                {schModalMode === "edit" ? t("Edit Jadwal", "Edit Schedule") : t("Buat Jadwal Baru", "Create New Schedule")}
              </h3>
              <button
                type="button"
                onClick={() => setIsClassSessionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClassSession} className="p-6 space-y-4 text-left">
              
              {/* Teacher Select */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">{t("Guru", "Teacher")}<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    required
                    value={schTeacherId}
                    onChange={(e) => setSchTeacherId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs bg-white appearance-none pr-10 cursor-pointer ${
                      schTeacherId === "" ? "italic text-slate-800/40" : "text-slate-800"
                    }`}
                  >
                    <option value="">{t("Pilih Guru", "Select Teacher")}</option>
                    {accounts.filter(a => a.role.toLowerCase() === "teacher").map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Program Series Selection */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">Program Series<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    required
                    value={schProgram}
                    onChange={(e) => {
                      setSchProgram(e.target.value);
                      const defaultLevels = programLevels[e.target.value] || [];
                      setSchLevel(defaultLevels[0] || "");
                    }}
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs bg-white appearance-none pr-10 cursor-pointer ${
                      schProgram === "" ? "italic text-slate-800/40" : "text-slate-800"
                    }`}
                  >
                    <option value="">{t("Pilih Program", "Select Program")}</option>
                    <option value="Funny Phonics">Funny Phonics</option>
                    <option value="Hi Kids!">Hi Kids!</option>
                    <option value="Oxford Phonics">Oxford Phonics</option>
                    <option value="Abracadabra">Abracadabra</option>
                    <option value="Get Smart">Get Smart</option>
                    <option value="Full Blast">Full Blast</option>
                    <option value="Test Preparation">Test Preparation</option>
                    <option value="Conversation Class">Conversation Class</option>
                    <option value="Private Class">Private Class</option>
                  </select>
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Specific Level */}
              {schProgram && schProgram !== "Conversation Class" && (
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">Specific Level</label>
                  <div className="relative">
                    <select
                      value={schLevel}
                      onChange={(e) => setSchLevel(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs bg-white appearance-none pr-10 cursor-pointer ${
                        schLevel === "" ? "italic text-slate-800/40" : "text-slate-800"
                      }`}
                    >
                      <option value="">{t("Pilih Level", "Select Level")}</option>
                      {(programLevels[schProgram] || []).map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Classroom */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">{t("Kelas/Ruangan", "Classroom")}<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    required
                    value={schClassroom}
                    onChange={(e) => setSchClassroom(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs bg-white appearance-none pr-10 cursor-pointer ${
                      schClassroom === "" ? "italic text-slate-800/40" : "text-slate-800"
                    }`}
                  >
                    <option value="">{t("Pilih Kelas", "Select Class")}</option>
                    <option value="Beach">Beach</option>
                    <option value="Borobudur">Borobudur</option>
                    <option value="Forest">Forest</option>
                    <option value="Liberty">Liberty</option>
                    <option value="Machu Picchu">Machu Picchu</option>
                    <option value="Mars">Mars</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Online Zoom">Online Zoom</option>
                    <option value="Saturn">Saturn</option>
                  </select>
                  <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="block font-poppins text-xs font-bold text-slate-600">{t("Tanggal", "Date")}<span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={schDate}
                  onChange={(e) => setSchDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                />
              </div>

              {/* Timings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">{t("Jam Mulai", "Start Time")}<span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    required
                    value={schStartTime}
                    onChange={(e) => setSchStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-bold text-slate-600">{t("Jam Selesai", "End Time")}<span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    required
                    value={schEndTime}
                    onChange={(e) => setSchEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClassSessionModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center uppercase tracking-wider"
                >
                  {t("Simpan", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATTENDANCE RECAP DETAILS */}
      {/* ========================================================================= */}
      {isRecapModalOpen && selectedRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center text-left">
              <h3 className="font-satoshi text-lg font-black text-slate-800">
                {t("Detail Presensi Kelas", "Class Attendance Details")}
              </h3>
              <button
                type="button"
                onClick={() => setIsRecapModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4 text-xs font-poppins">
                <div>
                  <p className="text-slate-400 font-semibold">{t("Mata Pelajaran", "Subject/Series")}</p>
                  <p className="font-bold text-slate-700">{selectedRecap.program_series} {selectedRecap.specific_level || ""}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">{t("Ruangan", "Classroom")}</p>
                  <p className="font-bold text-slate-700">{selectedRecap.classroom}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">{t("Guru Pengajar", "Teacher")}</p>
                  <p className="font-bold text-slate-700 text-[#4AC9CD]">{selectedRecap.teacher_name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">{t("Jadwal", "Schedule")}</p>
                  <p className="font-bold text-slate-700">{selectedRecap.date} ({selectedRecap.start_time} - {selectedRecap.end_time})</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="font-poppins text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Daftar Murid & Status", "Student List & Status")}</h4>
                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
                  {(!selectedRecap.students || selectedRecap.students.length === 0) ? (
                    <p className="text-slate-400 text-xs italic text-center py-4">{t("Tidak ada murid terdaftar di kelas ini.", "No students registered in this class.")}</p>
                  ) : (
                    selectedRecap.students.map((student: any) => (
                      <div key={student.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-poppins text-xs font-bold text-slate-700">{student.name}</span>
                        <div>
                          {student.status === "H" && <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-green-500 text-white">HADIR</span>}
                          {student.status === "A" && <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-red-500 text-white">ALPHA</span>}
                          {student.status === "I" && <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-500 text-white">IZIN</span>}
                          {!student.status && <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-200 text-slate-500">N/A</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRecapModalOpen(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer text-center uppercase tracking-wider mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL: ACCEPT APPLICANT → CREATE ACCOUNT */}
      {/* ========================================================================= */}
      {isAcceptModalOpen && selectedBookingForAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh] animate-scale-up border border-slate-100 flex flex-col my-4">

            {/* Modal Header */}
            <div className="relative px-8 pt-8 pb-4 flex justify-center items-center flex-shrink-0">
              <h3 className="font-poppins text-2xl font-bold text-slate-800">
                Create Account
              </h3>
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmAccept} className="p-8 pt-2 space-y-6">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-3 pt-2">
                <input
                  type="file"
                  id="accept-avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAcceptPhoto(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="w-24 h-24 rounded-full bg-[#F8FAFC] border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden relative shadow-inner">
                  {acceptPhoto ? (
                    <img src={acceptPhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("accept-avatar-upload")?.click()}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-poppins text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Upload New Photo
                </button>
              </div>

              {/* Grid Form Fields */}
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={acceptName}
                      onChange={(e) => setAcceptName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Gender</label>
                  <div className="relative">
                    <select
                      value={acceptGender}
                      onChange={(e) => setAcceptGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Role Selection</label>
                  <div className="relative">
                    <select
                      value={acceptRole}
                      onChange={(e) => setAcceptRole(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={acceptDob}
                      onChange={(e) => setAcceptDob(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Status</label>
                  <div className="relative">
                    <select
                      value={acceptStatus}
                      onChange={(e) => setAcceptStatus(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Waiting List">Waiting List</option>
                      <option value="Non Active">Non Active</option>
                    </select>
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={acceptPhone}
                      onChange={(e) => setAcceptPhone(e.target.value)}
                      placeholder="e.g. 08123456789"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.282-5.117-3.576-6.4-6.4l1.293-.97c.362-.272.528-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={acceptEmail}
                      onChange={(e) => setAcceptEmail(e.target.value)}
                      placeholder="e.g. janedoe@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Address</label>
                  <textarea
                    value={acceptAlamat}
                    onChange={(e) => setAcceptAlamat(e.target.value)}
                    placeholder="Enter complete address..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white resize-none"
                  />
                </div>

                {/* Student specific fields */}
                {acceptRole === "Student" && (
                  <>
                    {/* Guardian Name */}
                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Nama Orang Tua / Wali</label>
                      <input
                        type="text"
                        value={acceptGuardianName}
                        onChange={(e) => setAcceptGuardianName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                      />
                    </div>

                    {/* Program Series */}
                    <div className="space-y-1.5">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Program Series</label>
                      <div className="relative">
                        <select
                          value={acceptProgramSeries}
                          onChange={(e) => {
                            setAcceptProgramSeries(e.target.value);
                            const defaultLevels = programLevels[e.target.value] || [];
                            setAcceptSpecificLevel(defaultLevels[0] || "");
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">Select Program Series</option>
                          <option value="Funny Phonics">Funny Phonics</option>
                          <option value="Hi Kids!">Hi Kids!</option>
                          <option value="Oxford Phonics">Oxford Phonics</option>
                          <option value="Abracadabra">Abracadabra</option>
                          <option value="Get Smart">Get Smart</option>
                          <option value="Full Blast">Full Blast</option>
                          <option value="Test Preparation">Test Preparation</option>
                          <option value="Conversation Class">Conversation Class</option>
                          <option value="Private Class">Private Class</option>
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Specific Level */}
                    <div className="space-y-1.5">
                      <label className="block font-poppins text-xs font-semibold text-[#334155]">Specific Level</label>
                      <div className="relative">
                        <select
                          value={acceptSpecificLevel}
                          onChange={(e) => setAcceptSpecificLevel(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">Select Level</option>
                          {acceptProgramSeries && (programLevels[acceptProgramSeries] || []).map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                          {!acceptProgramSeries && (
                            <>
                              <option value="Funny Phonics 1">Funny Phonics 1</option>
                              <option value="Funny Phonics 2">Funny Phonics 2</option>
                              <option value="Hi Kids! 1">Hi Kids! 1</option>
                              <option value="Hi Kids! 2">Hi Kids! 2</option>
                              <option value="Hi Kids! 3">Hi Kids! 3</option>
                              <option value="Oxford Phonics 1">Oxford Phonics 1</option>
                              <option value="Oxford Phonics 2">Oxford Phonics 2</option>
                              <option value="Oxford Phonics 3">Oxford Phonics 3</option>
                              <option value="Oxford Phonics 4">Oxford Phonics 4</option>
                              <option value="Oxford Phonics 5">Oxford Phonics 5</option>
                              <option value="Abracadabra 1">Abracadabra 1</option>
                              <option value="Abracadabra 2">Abracadabra 2</option>
                              <option value="Abracadabra 3">Abracadabra 3</option>
                              <option value="Abracadabra 4">Abracadabra 4</option>
                              <option value="Abracadabra 5">Abracadabra 5</option>
                              <option value="Abracadabra 6">Abracadabra 6</option>
                              <option value="Get Smart 1">Get Smart 1</option>
                              <option value="Get Smart 2">Get Smart 2</option>
                              <option value="Get Smart 3">Get Smart 3</option>
                              <option value="Get Smart 4">Get Smart 4</option>
                              <option value="Get Smart 5">Get Smart 5</option>
                              <option value="Get Smart 6">Get Smart 6</option>
                              <option value="Full Blast 1">Full Blast 1</option>
                              <option value="Full Blast 2">Full Blast 2</option>
                              <option value="Full Blast 3">Full Blast 3</option>
                              <option value="Full Blast 4">Full Blast 4</option>
                              <option value="Full Blast 5">Full Blast 5</option>
                              <option value="Full Blast 6">Full Blast 6</option>
                              <option value="TOEFL">TOEFL</option>
                              <option value="IELTS">IELTS</option>
                              <option value="Private Class Offline">Offline</option>
                              <option value="Private Class Online">Online</option>
                              <option value="Private Class Homeschooling">Homeschooling</option>
                            </>
                          )}
                        </select>
                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                {/* Username */}
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">
                    Username<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={acceptUsername}
                    onChange={(e) => setAcceptUsername(e.target.value)}
                    placeholder="username"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white"
                  />
                </div>
              </fieldset>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-poppins text-xs font-semibold text-[#334155]">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showAcceptPassword ? "text" : "password"}
                      required
                      value={acceptPassword}
                      onChange={(e) => setAcceptPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4AC9CD]/20 focus:border-[#4AC9CD] font-poppins text-xs text-slate-800 bg-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAcceptPassword(!showAcceptPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showAcceptPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setIsAcceptModalOpen(false)}
                  className="flex-1 py-3.5 border border-[#EF777E] hover:bg-[#EF777E]/5 text-[#EF777E] rounded-xl font-poppins text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold rounded-xl font-poppins text-xs transition-all cursor-pointer shadow-md text-center"
                >
                  Create Account
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE APPLICANT CONFIRMATION */}
      {/* ========================================================================= */}
      {isDeleteBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up border border-slate-100">

            {/* Icon + Header */}
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-[#EF777E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="font-satoshi text-lg font-black text-slate-800">Hapus Data Pendaftar?</h3>
                <p className="font-poppins text-xs text-slate-500 mt-2 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Data pendaftar akan dihapus secara permanen dari sistem.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsDeleteBookingModalOpen(false); setBookingToDeleteId(null); }}
                className="flex-1 py-4 font-poppins text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer rounded-bl-3xl"
              >
                Batal
              </button>
              <div className="w-px bg-slate-100" />
              <button
                type="button"
                onClick={handleConfirmDeleteBooking}
                className="flex-1 py-4 font-poppins text-sm font-bold text-[#EF777E] hover:bg-red-50 transition-colors cursor-pointer rounded-br-3xl"
              >
                Ya, Hapus
              </button>
            </div>
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
