"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { EncryptAES } from "@/utils/crypto";
import Cookies from "js-cookie";

// Validation Schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  panCardNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN card format"),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
  email: z.string().email("Invalid email format"),
});

function EditProfileForm ({ userId, token }){
  const router = useRouter();
  const { request } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const clearAllCookies = () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    });
  };

  const onSubmit = async (data) => {
    if (!token) return toast.error("Authorization token not found");
    if (!userId) return toast.error("User ID not found!");

    setIsSubmitting(true);

    try {
      const payload = JSON.stringify({
        name: data.name,
        phone: data.mobileNumber,
        email: data.email,
      });

      const encryptedPayload = EncryptAES(payload);

      const response = await axios.put(
        `http://localhost:8081/api/cardholders/editProfile/${userId}`,
        { payload: encryptedPayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          clearAllCookies();
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      const message = error?.response?.data || "Something went wrong!";
      toast.error(message);
      console.error("Error updating data:", message);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token || !userId) return;

      try {
        const response = await axios.get(
          `http://localhost:8081/api/cardholders/chUsers/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data;

        console.log("userData >>>>>>>>", userData);

        reset({
          name: userData?.name || "",
          panCardNumber: userData?.cardHolders[0]?.pancardNumber || "",
          mobileNumber: userData?.phone || "",
          email: userData?.email || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [reset, token, userId]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-[24px] my-5 font-bold">Edit Profile</h1>

        {/* Name */}
        <div className="field w-full">
          <label className="block text-sm text-gray-700 font-bold">Name</label>
          <input
            {...register("name")}
            className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base"
          />
          {errors.name && (
            <small className="text-xs text-red-500">
              {errors.name.message}
            </small>
          )}
        </div>

        {/* PAN Card */}
        <div className="field w-full">
          <label className="block text-sm text-gray-700 font-bold">
            PAN Card Number
          </label>
          <input
            {...register("panCardNumber")}
            disabled
            className="opacity-35 w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base"
          />
          {errors.panCardNumber && (
            <small className="text-xs text-red-500">
              {errors.panCardNumber.message}
            </small>
          )}
        </div>

        {/* Mobile */}
        <div className="field w-full">
          <label className="block text-sm text-gray-700 font-bold">
            Mobile Number
          </label>
          <input
            {...register("mobileNumber")}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base"
          />
          {errors.mobileNumber && (
            <small className="text-xs text-red-500">
              {errors.mobileNumber.message}
            </small>
          )}
        </div>

        {/* Email */}
        <div className="field w-full">
          <label className="block text-sm text-gray-700 font-bold">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base"
          />
          {errors.email && (
            <small className="text-xs text-red-500">
              {errors.email.message}
            </small>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 rounded-md mt-2 mb-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  );
};

export default EditProfileForm;
