"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  level: string;
  skill: string;
  topic: string;
}

const mockMaterials: MaterialItem[] = [
  {
    id: "mat-1",
    title: "English Lecture: Hobbies & Activities",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Belajar kosakata hobi.",
    level: "Beginner (A1)",
    skill: "Listening",
    topic: "Hobbies",
  },
  {
    id: "mat-2",
    title: "English Lecture: Food & Culture",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Melatih speaking tentang makanan tradisional.",
    level: "Beginner (A1)",
    skill: "Speaking",
    topic: "Food",
  },
  {
    id: "mat-3",
    title: "English Lecture: Nature & Environment",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Memahami artikel ekosistem hutan.",
    level: "Intermediate (B1)",
    skill: "Reading",
    topic: "Nature",
  },
  {
    id: "mat-4",
    title: "English Lecture: Deep Dive Grammar",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Advanced structures and complex clauses.",
    level: "Advanced (C1)",
    skill: "Grammar",
    topic: "Interest",
  },
];

export default function LearningMaterialsPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

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

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  // Filter Materials
  const filteredMaterials = mockMaterials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkills.length === 0 || selectedSkills.includes(item.skill);
    const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(item.topic);
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(item.level);

    return matchesSearch && matchesSkill && matchesTopic && matchesLevel;
  });

  if (!isLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  // Guard check: must be a teacher
  if (userRole !== "teacher") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full space-y-6">
          <span className="text-5xl block">🔒</span>
          <h2 className="font-satoshi text-2xl font-black text-slate-800">Akses Dibatasi</h2>
          <p className="font-poppins text-sm text-slate-500 leading-relaxed">
            Halaman ini khusus untuk akun **Teacher**. Silakan login kembali dengan akun guru untuk mengakses materi pembelajaran.
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
              Login Guru
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
            <Link href="/learning-materials" className="text-sm font-bold text-slate-900 border-b-2 border-indigo-600 pb-1 pt-0.5 px-0.5">
              Learning Materials
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
            <Link href="/learning-materials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-slate-900">
              Learning Materials
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

      {/* Main Material Finder Content */}
      <main className="flex-1 w-full py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Left Panel: Filters */}
          <aside className="w-full md:w-[280px] bg-white border border-slate-200/60 rounded-2xl p-6 flex-shrink-0 self-start">
            <h2 className="font-satoshi text-lg font-bold text-slate-800 tracking-tight mb-6 pb-2 border-b border-slate-100 uppercase">
              Filters
            </h2>

            {/* Section: Skills */}
            <div className="space-y-3 mb-6">
              <h3 className="font-satoshi text-sm font-bold text-slate-700 uppercase tracking-wider">Skills</h3>
              <div className="space-y-2 font-poppins text-sm text-slate-600">
                {["Speaking", "Listening", "Reading", "Grammar"].map((skill) => (
                  <label key={skill} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section: Topic */}
            <div className="space-y-3 mb-6">
              <h3 className="font-satoshi text-sm font-bold text-slate-700 uppercase tracking-wider">Topic</h3>
              <div className="space-y-2 font-poppins text-sm text-slate-600">
                {["Hobbies", "Food", "Nature", "Interest"].map((topic) => (
                  <label key={topic} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section: Level */}
            <div className="space-y-3">
              <h3 className="font-satoshi text-sm font-bold text-slate-700 uppercase tracking-wider">Level</h3>
              <div className="space-y-2 font-poppins text-sm text-slate-600">
                {[
                  { label: "Beginner (A1)", value: "Beginner (A1)" },
                  { label: "Intermediate (B1)", value: "Intermediate (B1)" },
                  { label: "Advanced (C1)", value: "Advanced (C1)" }
                ].map((level) => (
                  <label key={level.value} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level.value)}
                      onChange={() => toggleLevel(level.value)}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Panel: Content Grid */}
          <section className="flex-1 space-y-6">
            
            {/* Title & Search bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="font-satoshi text-2xl font-black text-slate-800 tracking-tight">
                Learning Materials
              </h1>
              <div className="relative w-full sm:w-[320px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search article"
                  className="w-full px-4 py-2.5 pl-10 rounded-full border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-poppins text-xs bg-white"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Grid of Materials */}
            {filteredMaterials.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-2xl p-10 text-center text-slate-400 font-poppins text-sm italic">
                Tidak ada materi pembelajaran yang cocok dengan filter atau pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-satoshi text-lg font-bold text-slate-800 leading-snug">
                          {mat.title}
                        </h3>
                        <span className="font-satoshi text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {mat.level.replace("Beginner ", "").replace("Intermediate ", "").replace("Advanced ", "")}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="font-poppins text-xs text-slate-500 leading-relaxed mt-3">
                        {mat.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-poppins text-xs font-semibold text-slate-600 bg-slate-100/75 px-3 py-1.5 rounded-full">
                        {mat.skill}
                      </span>
                      <button
                        onClick={() => alert(`Membuka materi: ${mat.title}`)}
                        className="bg-[#4AC9CD] hover:bg-[#3db3b7] text-white font-bold text-xs px-6 py-2 rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

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
              <li><Link href="/learning-materials" className="hover:text-[#4AC9CD] transition-colors">Learning Materials</Link></li>
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
