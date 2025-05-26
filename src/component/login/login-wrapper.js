"use client";
import { useState } from "react";
import Mobile from "./mobile";
import OTP from "./otp";
import Cookies from "js-cookie";
import { deleteCookie, getCookies } from "cookies-next";

export default function LoginWrapper() {
  const [isMobileData, setIsMobileData] = useState(false);
  const [mobnum, setMobNum] = useState("");
  const [resMobMessage, setResMobMessage] = useState("");
  const token = Cookies.get("token");

  if (token) {
    Cookies.remove("token");
      const allCookies = getCookies();
      Object.keys(allCookies).forEach((cookieName) => {
        deleteCookie(cookieName);
      });
  }

  const handleMobileSuccess = (mobileData, message) => {
    setIsMobileData(true); // toggle to show OTP
    setMobNum(mobileData);
    setResMobMessage(message);
  };

  console.log("message >>>>>>>>", resMobMessage);

  return (
    <>
      {isMobileData ? (
        <OTP mobnum={mobnum} resMobMessage={resMobMessage} />
      ) : (
        <Mobile onSuccess={handleMobileSuccess} />
      )}
    </>
  );
}
