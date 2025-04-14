'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { deleteCookie, getCookies } from 'cookies-next';

// Safely parse localStorage item
const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : "";
  } catch {
    return "";
  }
};

const getProfileName = () => {
  if (typeof window !== "undefined") {
    return safeParse("profilename");
  }
  return "";
};

const getProfileEmail = () => {
  if (typeof window !== "undefined") {
    return safeParse("profilemail");
  }
  return "";
};

function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [pfname, setPfname] = useState("");
  const [pfemail, setPfemail] = useState("");

  useEffect(() => {
    const handleProfileUpdate = () => {
      setPfname(getProfileName());
      setPfemail(getProfileEmail());
    };

    // Initial load
    handleProfileUpdate();

    // Listen for updates
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  const clearSession = () => {
    localStorage.clear();
    const allCookies = getCookies();
    Object.keys(allCookies).forEach((cookieName) => {
      deleteCookie(cookieName);
    });
    window.dispatchEvent(new Event("profileUpdated"));
    router.push("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-10 flex flex-auto justify-between items-center border-b-[1px] border-[#6d3078]">
      <div className="logo-wrap">
        <Link href="/dashboard">
          <Image 
            src="/images/AU-Bank-logo.png"
            alt="AU Bank Logo"
            width={80}
            height={50}
          />
        </Link>
      </div>

      <div>
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}           
            className="flex items-center gap-2 px-4 py-2 rounded-md"
          >
            <Image 
              src="/images/profile.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
              width={32} 
              height={32}
            />
            <span>{pfname || "User"}</span>
            <Image  
              src="/images/arrow-down-sign-to-navigate.png" 
              className="w-[10px]" 
              alt="dropdown icon" 
              width={10} 
              height={10}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-10">
              <div className="p-3 border-b border-gray-200 break-words">
                <p className="text-gray-700 font-semibold">{pfname || "username"}</p>
                <p className="text-[0.8rem] text-wrap text-gray-500">{pfemail || "example@gmail.com"}</p>
              </div>
              <button
                onClick={clearSession}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
