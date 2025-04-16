"use client";

import React, { useEffect, useState } from "react";
import ChangePinForm1 from "./ChangePinForm1";
import ChangePinForm2 from "./ChangePinForm2";
import ChangePinForm3 from "./ChangePinForm3";
import toast, { Toaster } from "react-hot-toast";


function ChangePinClient({userId}) {
  const [cardNo, setCardNo] = useState("");
  const [generateOtp, setGenerateOtp] = useState(true);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [pin, setPin] = useState(false);

  useEffect(() => {
    if (!generateOtp && !verifyOtp && !pin) {
      console.log("All steps are false. Maybe reset?");
    }
  }, [generateOtp, verifyOtp, pin]);

  console.log("clientWrapper generate pin cardNo", cardNo)

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {generateOtp && (
        <ChangePinForm1
          setCardNo={setCardNo}
          setGenerateOtp={setGenerateOtp}
          setVerifyOtp={setVerifyOtp}
          toast={toast}
        />
      )}
      {verifyOtp && (
        <ChangePinForm2
          cardNo={cardNo}
          setVerifyOtp={setVerifyOtp}
          setPin={setPin}
          toast={toast}
          userId={userId}
        />
      )}
      {pin && (
        <ChangePinForm3
          cardNo={cardNo}
          toast={toast}
          userId={userId}
        />
      )}
    </>
  );
}

export default ChangePinClient;
