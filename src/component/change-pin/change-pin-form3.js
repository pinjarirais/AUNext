"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { EncryptAES } from "@/utils/crypto";

// Validation Schema for PINs
const pinSchema = z.object({
  currentPin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
  newPin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
  confirmPin: z
    .string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
}).refine((data) => data.newPin === data.confirmPin, {
  message: "PIN does not match",
  path: ["confirmPin"],
});

function ChangePinForm3({ cardNo, toast, userId }){  
  const navigate = useRouter();
  const { request } = useApi();
  const [showPassword, setShowPassword] = useState({
    currentPin: false,
    newPin: false,
    confirmPin: false,
  });
  const [expired, setExpired] = useState(false);

  // Initialize Form Methods
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(pinSchema),
    mode: "onChange",
  });

  // Session Expiry Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setExpired(true);
      setTimeout(() => {
        if (window.confirm("Session expired! Please try again later.")) {
          navigate.push(`/cardDetails/${userId}`);
        }
      }, 100);
    }, 120000); // 2 minutes expiry time

    return () => clearTimeout(timer);
  }, [navigate, userId]);

  // Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Handle Input Change
  const handleInputChange = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue(fieldName, value, { shouldValidate: true });
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    if (expired) {
      toast.error("Session expired! Please start again.");
      return;
    }

    const payload = JSON.stringify({
      cardNumber: cardNo,
      currentPin: data.currentPin,
      newPin: data.newPin,
      confirmPin: data.confirmPin,
    });

    const encryptedPayload = EncryptAES(payload);
    const requestBody = { payload: encryptedPayload };

    try {
      const res = await request({
        endpoint: "api/cardholders/updatePin",
        method: "POST",
        payload: requestBody,
      });

      if (res.status === 200) {
        toast.success(res.data || "PIN updated successfully!");
        setTimeout(() => navigate.push(`/dashboard/${userId}`), 3000);
      } else {
        toast.error(res.data || "Invalid credentials.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Error updating PIN.";
      toast.error(message);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Form Header */}
      <h1 className="text-center text-[24px] my-5 font-bold">Change PIN</h1>

      {/* Current PIN */}
      <InputField
        label="Enter Current PIN"
        type={showPassword.currentPin ? "text" : "password"}
        {...register("currentPin")}
        error={errors.currentPin}
        showPassword={showPassword.currentPin}
        onTogglePassword={() => togglePasswordVisibility("currentPin")}
        onChange={(e) => handleInputChange(e, "currentPin")}
      />

      {/* New PIN */}
      <InputField
        label="Enter New PIN"
        type={showPassword.newPin ? "text" : "password"}
        {...register("newPin")}
        error={errors.newPin}
        showPassword={showPassword.newPin}
        onTogglePassword={() => togglePasswordVisibility("newPin")}
        onChange={(e) => handleInputChange(e, "newPin")}
      />

      {/* Confirm New PIN */}
      <InputField
        label="Confirm New PIN"
        type={showPassword.confirmPin ? "text" : "password"}
        {...register("confirmPin")}
        error={errors.confirmPin}
        showPassword={showPassword.confirmPin}
        onTogglePassword={() => togglePasswordVisibility("confirmPin")}
        onChange={(e) => handleInputChange(e, "confirmPin")}
      />

      {/* Submit Button */}
      <div className="field w-full mx-auto">
        <button
          type="submit"
          disabled={!isValid || expired}
          className={`${
            !isValid || expired ? "bg-[#ba76c6] cursor-not-allowed" : "bg-[#9a48a9] hover:bg-[#6d3078]"
          } w-full text-white p-2 m-auto border-none rounded-md my-5`}
        >
          {expired ? "Session Expired" : isSubmitting ? "Updating..." : "Update PIN"}
        </button>
      </div>
    </form>
  );
};

// InputField Component for Reusability
const InputField = ({
  label,
  type,
  error,
  showPassword,
  onTogglePassword,
  onChange,
  ...props
}) => (
  <div className="field w-full">
    <label className="block text-sm text-gray-700 font-bold">{label}</label>
    <div className="relative">
      <input
        {...props}
        type={type}
        className="w-full rounded-md bg-white px-3 py-1.5 text-base border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none"
        maxLength={6}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-2 text-gray-500"
        onClick={onTogglePassword}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {error && <small className="text-xs text-red-500 mt-1">{error.message}</small>}
  </div>
);

export default ChangePinForm3;
