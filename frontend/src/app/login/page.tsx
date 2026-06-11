"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Brand Logo & Image
import logoEev from "@/app/images/Navbar/Elements/logo-eev.png";
import fotoLogin from "@/app/images/foto-login.png";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Mock verification
    setTimeout(() => {
      setIsSubmitting(false);
      if (username === "admin" && password === "admin123") {
        setSuccess(true);
        // Redirect to homepage after success
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError("Username atau password salah.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Column: Image (Hidden on mobile) */}
      <div className="hidden md:block md:w-[50%] lg:w-[50%] relative min-h-screen">
        <Image
          src={fotoLogin}
          alt="English Everywhere Camping"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right Column: Form */}
      <div className="w-full md:w-[50%] lg:w-[50%] bg-white flex flex-col justify-center items-center p-8 sm:p-12 relative min-h-screen">
        
        {/* Back Arrow Link (top-left corner of the form pane) */}
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 text-slate-500 hover:text-slate-800 hover:scale-105 transition-all p-2"
          aria-label="Back to Homepage"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        {/* Center Card */}
        <div className="w-full max-w-[400px] flex flex-col items-center text-center space-y-8">
          
          {/* Brand Logo */}
          <div className="w-[140px] h-[45px] relative">
            <Image
              src={logoEev}
              alt="English Everywhere Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-satoshi text-2xl sm:text-3xl font-black text-[#1E293B]">
              Welcome Back!
            </h1>
            <p className="font-poppins text-xs sm:text-sm text-slate-400 font-medium">
              Enter your detail to continue
            </p>
          </div>

          {/* Error and Success notifications */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg py-2.5 px-4 text-xs font-poppins font-medium animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg py-2.5 px-4 text-xs font-poppins font-medium animate-fade-in">
              ✅ Login Berhasil! Mengalihkan ke Beranda...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full text-left space-y-5">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="block font-poppins text-xs font-bold text-slate-600">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full px-4 py-3 rounded-lg border-0 bg-[#EBF2FC] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm placeholder-slate-400"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block font-poppins text-xs font-bold text-slate-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border-0 bg-[#EBF2FC] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins text-sm placeholder-slate-400"
                />
                
                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye Slash Icon
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    // Eye Icon
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-[#EF777E] hover:bg-[#eb5e67] disabled:bg-red-400 text-white font-bold py-3.5 rounded-lg transition-colors cursor-pointer text-sm shadow-md mt-6"
            >
              {isSubmitting ? "Memproses..." : "Login"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
