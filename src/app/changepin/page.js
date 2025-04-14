"use client";
import React, { useEffect, useState } from "react";
import ChangePinForm1 from "./ChangePinForm1";
import ChangePinForm2 from "./ChangePinForm2";
import ChangePinForm3 from "./ChangePinForm3";
import CryptoJS from "crypto-js";
import toast, { Toaster } from "react-hot-toast";
// import { useLocation } from "react-router-dom";



function ChangePin() {
  // const location = useLocation();
  // const CHuserID = location.state
  // console.log("detail page ID >>>>>", CHuserID)
  const [cardNo, setCardNo] = useState("");
  const [generateOtp, setGenerateOtp] = useState(true);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [pin, setPin] = useState(false);

  console.log(cardNo);

  const SECRET_KEY = "9f6d7e1b2c3a8f4d0e5b6c7d8a9e2f3c"; // 32 chars
  const IV = "MTIzNDU2Nzg5MDEy"; // 16 chars

  // AES Encryption function
  function encryptAES(text) {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  useEffect(() => {
    if (!generateOtp && !verifyOtp && !pin) {
      console.log("All steps are false. Maybe reset?");
    }

    if (!generateOtp && !verifyOtp && !pin) {
      console.log("Process complete or reset state.");
    }
  }, [generateOtp, verifyOtp, pin]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="form-wrap">
        <div className="login-form w-full p-4 pb-16">
          <div className="form-wrapp mx-auto sm:w-full sm:max-w-sm">
            {generateOtp && (
              <ChangePinForm1
                setCardNo={setCardNo}
                setGenerateOtp={setGenerateOtp}
                setVerifyOtp={setVerifyOtp}
                encryptAES={encryptAES}
                toast={toast}
              />
            )}

            {verifyOtp && (
              <ChangePinForm2
                cardNo={cardNo}
                setVerifyOtp={setVerifyOtp}
                setPin={setPin}
                encryptAES={encryptAES}
                toast={toast}
                // CHuserID={CHuserID}
              />
            )}

            {pin && (
              <ChangePinForm3
                cardNo={cardNo}
                encryptAES={encryptAES}
                toast={toast}
                // CHuserID={CHuserID}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePin;
