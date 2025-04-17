"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/use-api";
import { EncryptAES } from "@/utils/crypto";

const formSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card Number must be exactly 16 digits"),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
});

function ChangePinForm1({ setCardNo, setGenerateOtp, setVerifyOtp, toast }) {
  const { request } = useApi();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [expiry, setExpiry] = useState("");

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiry(value);
    setValue("cardExpiry", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    console.log("form1 data >>>>>>>>", data);
    try {
      const payload = EncryptAES(JSON.stringify(data));
      const requestBody = { payload };

      console.log("form1 requestBody >>>>>>>>>>>", requestBody);

      const response = await request({
        endpoint: "api/cardholders/generateOtp/pinGeneration",
        method: "POST",
        payload: requestBody,
      });

      console.log("form1 response >>>>>>>>>>>>", response);

      if (response.error || !response.data) {
        toast.error("Please enter valid card details.");
        return;
      }

      toast.success("OTP Generated Successfully!");

      if (response.status === 200) {
        setGenerateOtp(false);
        setVerifyOtp(true);
        setCardNo(data.cardNumber);
      }
    } catch (err) {
      toast.error("Something went wrong while generating OTP");
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-center text-[24px] my-5 font-bold">Generate OTP</h1>

      {/* Card Number */}
      <div className="field w-full">
        <label className="block text-sm text-gray-700 font-bold">
          Card Number
        </label>
        <input
          {...register("cardNumber")}
          className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
          placeholder="Enter Your Card Number"
          type="text"
          maxLength={16}
        />
        {errors.cardNumber && (
          <small className="text-xs w-full block text-red-500 mt-1">
            {errors.cardNumber.message}
          </small>
        )}
      </div>

      {/* Expiry & CVV */}
      <div className="field w-full">
        <label className="block text-sm text-gray-700 font-bold">
          Card Expiry & CVV
        </label>
        <div className="flex gap-3">
          <div className="w-full">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            />
            {errors.cardExpiry && (
              <small className="text-xs w-full block text-red-500 mt-1">
                {errors.cardExpiry.message}
              </small>
            )}
          </div>

          <div className="w-full">
            <input
              {...register("cvv")}
              type="text"
              placeholder="CVV"
              maxLength={3}
              className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
            />
            {errors.cvv && (
              <small className="text-xs w-full block text-red-500 mt-1">
                {errors.cvv.message}
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="field w-full mx-auto">
        <button
          type="submit"
          disabled={!isValid}
          className={`${
            !isValid
              ? "bg-[#ba76c6] cursor-not-allowed"
              : "bg-[#9a48a9] hover:bg-[#6d3078]"
          } w-full text-white p-2 m-auto border-none rounded-md my-5`}
        >
          {isSubmitting ? "Generating..." : "Generate OTP"}
        </button>
      </div>
    </form>
  );
}

export default ChangePinForm1;
