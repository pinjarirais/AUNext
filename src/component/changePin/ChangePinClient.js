"use client";

import React, { useEffect, useState } from "react";
import ChangePinForm1 from "./ChangePinForm1";
import ChangePinForm2 from "./ChangePinForm2";
import ChangePinForm3 from "./ChangePinForm3";
import toast, { Toaster } from "react-hot-toast";
import { encryptAES } from "@/utils/crypto";

function ChangePinClient() {
  const [cardNo, setCardNo] = useState("");
  const [generateOtp, setGenerateOtp] = useState(true);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [pin, setPin] = useState(false);

  useEffect(() => {
    if (!generateOtp && !verifyOtp && !pin) {
      console.log("All steps are false. Maybe reset?");
    }
  }, [generateOtp, verifyOtp, pin]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
        />
      )}
      {pin && (
        <ChangePinForm3
          cardNo={cardNo}
          encryptAES={encryptAES}
          toast={toast}
        />
      )}
    </>
  );
}

export default ChangePinClient;
