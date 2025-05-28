"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/use-api";
import { EncryptAES } from "@/utils/crypto";
import CountdownTimer from "../count-time-func"; 

function Mobile({ onSuccess }) {
  const [mobError, setMobError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invalidMobNoCount, setInvalidMobNoCount] = useState();

  const [loginAttemptFailed, setLoginAttempt] = useState();
  const [isTimer, setIsTimer] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState();
console.log("invalidMobNoCount",invalidMobNoCount);
console.log("mobError",mobError);
    useEffect(() => {
    const storedCount = Number(localStorage.getItem("invalidMobNoCount")) || 0;
    const startTime=Number(localStorage.getItem("timerStartTime")) || null;
    const loginAttemptFail= JSON.parse(localStorage.getItem("loginAttemptFailed")) || false;
    setLoginAttempt(loginAttemptFail)
    setTimerStartTime(startTime)
    setInvalidMobNoCount(storedCount);
  }, []);


  const { request } = useApi();

  const loginschema = z.object({
    mobileNumber: z
      .string()
      .regex(/^\d+$/, { message: "Only numbers are allowed." })
      .length(10, { message: "Mobile number must be exactly 10 digits." }),
  });

  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: zodResolver(loginschema),
    mode: "onChange",
  });

  const { errors, isValid } = formState;

  async function postdata(data) {
    try {
      setIsLoading(true);
      const payload = JSON.stringify({ phone: data.mobileNumber });
      const encryptedPayload = EncryptAES(payload);
      const requestBody = { payload: encryptedPayload };

      const response = await request({
        endpoint: "api/auth/generate-otp",
        method: "POST",
        payload: requestBody,
      });

      if (response.status === 200) {
        setIsLoading(false);
        setInvalidMobNoCount(0);
        localStorage.setItem("invalidMobNoCount", 0);
        onSuccess(data.mobileNumber, response?.data.message);
        setMobError("");
      }
      else{
      setIsLoading(false);
      const newCount = invalidMobNoCount + 1;
      setInvalidMobNoCount(newCount);
      localStorage.setItem("invalidMobNoCount", newCount);
      if (newCount === 3) {
        console.log("newCount",newCount);
        setLoginAttempt(true);
        localStorage.setItem("loginAttemptFailed", true);
        const startTime = Date.now();
        setIsTimer(true);
        setTimerStartTime(startTime);
        localStorage.setItem("timerStartTime", startTime);
      }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error catch",error);
      setMobError(error.response?.data?.message || "Something went wrong!");
    }
  }

  useEffect(() => {
    const storedStartTime = localStorage.getItem("timerStartTime");
    if (loginAttemptFailed && storedStartTime) {
      const remainingTime = (Date.now() - storedStartTime) / 1000;
      if (remainingTime < 45) {
        setIsTimer(true);
      } else {
        clearBlock();
      }
    }
  }, [loginAttemptFailed]);

  useEffect(() => {
    if (isTimer && timerStartTime) {
      const interval = setInterval(() => {
        const remainingTime = (Date.now() - timerStartTime) / 1000;
        if (remainingTime >= 45) {
          clearBlock();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimer, timerStartTime]);

  const clearBlock = () => {
    setIsTimer(false);
    setLoginAttempt(false);
    setInvalidMobNoCount(0);
    setMobError("");
    localStorage.removeItem("loginAttemptFailed");
    localStorage.removeItem("timerStartTime");
    localStorage.removeItem("invalidMobNoCount");
  };

  const onSubmit = (data) => {
    postdata(data);
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="feild w-full md:max-w-80">
          <label className="block text-sm/6 text-gray-700">
            Register Mobile Number
          </label>
          <input
            type="text"
            className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            autoFocus
            placeholder="Enter Your Number"
            {...register("mobileNumber")}
            maxLength={10}
            disabled={loginAttemptFailed && isTimer}
          />
          {errors.mobileNumber && (
            <p className="text-xs text-red-500 mt-1">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>

        <div className="feild w-full md:max-w-80">
          <button
            className={
              !isValid || (loginAttemptFailed && isTimer)
                ? "w-full bg-[#9a48a9] opacity-50 text-white p-2 m-auto border-none rounded-md my-5"
                : "w-full bg-[#9a48a9] opacity-100 hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md my-5"
            }
            disabled={!isValid || (loginAttemptFailed && isTimer)}
          >
            {isLoading ? "Loading..." : "Generate OTP"}
          </button>
        </div>
        <DevTool control={control} />
      </form>

      {mobError && invalidMobNoCount < 3 && (
        <p className="text-xs text-red-500 mt-1 text-center md:max-w-80">
          {mobError}
        </p>
      )}

      {loginAttemptFailed && isTimer && (
        <div className="bg-[#ff00002e] border-red-500 border-[1px] p-2 mt-5 md:max-w-80">
          <span className="text-xs text-red-500 block">
            <b>Access blocked:</b> Too many failed login attempts. Try again in{" "}
            <b>
              <CountdownTimer
                startTime={Math.max(
                  0,
                  45 - Math.floor((Date.now() - timerStartTime) / 1000)
                )}
                setIsTimer={setIsTimer}
              />
            </b>{" "}
            seconds.
          </span>
        </div>
      )}

      {invalidMobNoCount > 0 && invalidMobNoCount < 3 && (
        <div className="bg-[#ff00002e] border-red-500 border-[1px] p-2 mt-5 md:max-w-80">
          <span className="text-xs text-red-500 block">
            <b>
              Invalid mobile number. Only {3 - invalidMobNoCount} attempt
              remaining.
            </b>
          </span>
        </div>
      )}
    </>
  );
}

export default Mobile;
