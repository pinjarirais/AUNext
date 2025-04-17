"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { deleteCookie, getCookies } from "cookies-next";
import Cookies from "js-cookie";

export default function HeaderClient() {
  const [pfname, setPfname] = useState("");
  const [pfemail, setPfemail] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const clearSession = () => {
    const allCookies = getCookies();
    Object.keys(allCookies).forEach((cookieName) => {
      deleteCookie(cookieName);
    });
    router.push("/");
  };

  // Sync state with cookies
  useEffect(() => {
    const updateProfileInfo = () => {
      setPfname(Cookies.get("pfname") || "User");
      setPfemail(Cookies.get("pfemail") || "example@gmail.com");
    };

    // Initial load
    updateProfileInfo();

    // Listen for manual 'profileUpdated' event
    window.addEventListener("profileUpdated", updateProfileInfo);

    return () => {
      window.removeEventListener("profileUpdated", updateProfileInfo);
    };
  }, []);

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
            <p className="text-gray-700 font-semibold">{pfname}</p>
            <p className="text-[0.8rem] text-wrap text-gray-500">{pfemail}</p>
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
  );
}
