"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useApi } from "@/hooks/use-api";
import { EncryptAES } from "@/utils/crypto";
import CountdownTimer from "../count-time-func";

function OTP({ mobnum, resMobMessage }) {
  const navigate = useRouter();
  const [isTimer, setIsTimer] = useState(false);
  const [responseError, setResponseError] = useState("");

  const { request } = useApi();

  const otpschema = z.object({
    otpfield: z.string().min(6, {
      message: "OTP must be at least 6 characters.",
    }),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { mobileNumber: mobnum },
    resolver: zodResolver(otpschema),
    mode: "onChange",
  });

  const { errors, isValid } = formState;

  async function postdata(data) {
    console.log("otp page response >>>>>>>>>", data);
    try {
      const payload = JSON.stringify({
        phone: mobnum,
        otp: data.otpfield,
      });

      const encryptedPayload = EncryptAES(payload);
      const requestBody = { payload: encryptedPayload };

      const response = await request({
        endpoint: "api/auth/validate-otp",
        method: "POST",
        payload: requestBody,
      });

      console.log("otp responce >>>>", response);

      if (response.status === 200) {
        let authuser = response.data.roleName;
        let jwtToken = response.data.token;
        let mobileNumber = response.data.mobileNumber;
        let userId = response.data.userId;

        setCookie("authuser", authuser, {
          httpOnly: false,
          //secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setCookie("token", jwtToken, {
          httpOnly: false,
          //secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setCookie("mobileNumber", mobileNumber, {
          httpOnly: false,
          //secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        
          setCookie("userId", userId, {
            httpOnly: false,
            //secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });     

        
        navigate.push("/dashboard");
      }
    } catch (error) {
      console.log("otp page error >>>>>>>>>", error);
      setResponseError(error.response?.data?.message || "Something went wrong");
    }
  }

  const onSubmit = (data) => {
    postdata(data);
    reset();
  };

  const handleResentOTP = () => {
    onSubmit({ mobileNumber: mobnum });
    navigate.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="feild w-full md:max-w-80">
        <label className="block text-sm/6 text-gray-700">
          Register Mobile Number
        </label>
        <input
          className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none opacity-50"
          autoFocus
          placeholder="Enter Your Number"
          readOnly
          {...register("mobileNumber")}
        />

        {resMobMessage && (
          <p className="text-xs w-full block text-green-500 mt-1">
            {resMobMessage}
          </p>
        )}
      </div>

      <div className="feild w-full md:max-w-80 mt-6">
        <label className="text-sm/6 text-gray-700 flex justify-between">
          Enter OTP
          <div>
            <CountdownTimer startTime={300} setIsTimer={setIsTimer} />
          </div>
        </label>
        <input
          className="w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
          autoFocus
          placeholder="Enter OTP"
          {...register("otpfield")}
          maxLength={6}
        />

        {responseError.code && (
          <p className="text-xs w-full block text-red-500 mt-1">
            {responseError.code}
          </p>
        )}

        {errors.otpfield && (
          <p className="text-xs w-full block text-red-500 mt-1">
            {errors.otpfield.message}
          </p>
        )}
      </div>

      <div className="feild w-full md:max-w-80">
        <div className="flex justify-end mt-1">
          <div>
            <button
              disabled={!isTimer}
              type="button"
              onClick={handleResentOTP}
              className="text-xs text-[#6d3078] underline"
            >
              Resend OTP
            </button>
          </div>
        </div>

        <button
          className={
            !isValid
              ? "bg-opacity-35 w-full bg-[#9a48a9] text-white p-2 m-auto border-none rounded-md my-5"
              : "bg-opacity-100 w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md my-5"
          }
          disabled={!isValid}
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default OTP;
