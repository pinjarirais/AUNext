import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CryptoJS from "crypto-js";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

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

const EditProfileForm = () => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const token = JSON.parse(localStorage.getItem("token"));
  // const location = useLocation();
  // const userData = location.state;
  const navigate = useRouter();
  // const { editprofile } = useParams(); 
  const {request} = useApi();

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

  const onSubmit = async (data) => {

    console.log("profile data >>>>>>>", data)

    setIsSubmitting(true);

    try {      
      if (!token) {
        toast.error("Authorization token not found");
        setIsSubmitting(false);
        return;
      }

      //const userId = userData?.cardHolder?.id;
      if (!userId) {
        toast.error("User ID not found!");
        setIsSubmitting(false);
        return;
      }

      const payload = JSON.stringify({
        name: data.name,
        phone: data.mobileNumber,
        email: data.email,
      });

      const encryptedPayload = encryptAES(payload);
      const requestBody = { payload: encryptedPayload };


      const response = await request({
        endpoint: `api/cardholders/editProfile/${userId}`,
        method: "PUT",
        payload: requestBody,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          localStorage.clear();
          navigate.push("/");
        }, 1800);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.errors && typeof data.errors === "object") {
          toast.error(error?.response?.data);
        } else if (status === 403) {
          toast.error(error.response?.data);
        } else {
          toast.error(error?.response?.data);
        }
      } else {
        toast.error(error?.response?.data);
      }
      console.log("Error updating data:", error?.response?.data);
    }

    setIsSubmitting(false);
  };

  // useEffect(() => {
  //   // Runs only on the client
  //   const userId = JSON.parse(localStorage.getItem("userId") || 'null');
  //   const token = JSON.parse(localStorage.getItem("token") || 'null');
    
  //   console.log("userId >>>>>>>>", userId);

  // }, []);


  useEffect(() => {
    //fetch all card details
    const fetchUserdetails = async () => {
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
        const fetchUserData = response.data;       
        console.log("fetchedCards >>>>>>>>>", fetchUserData) 

        reset({
            name: fetchUserData?.name || "",
            panCardNumber: fetchUserData?.cardHolders[0]?.pancardNumber || "",
            mobileNumber: fetchUserData?.phone || "",
            email: fetchUserData?.email || "",
          });

      } catch (error) {        
        console.error("Error fetching cards:", error);
      }
    };
    fetchUserdetails()
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center text-[24px] my-5 font-bold">Edit Profile</h1>

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

        <div className="field w-full">
          <label className="block text-sm text-gray-700 font-bold">
            Mobile Number
          </label>
          <input
            {...register("mobileNumber")}
            type="number"
            className="w-full rounded-md border border-[#a3a5aa] px-3 py-1.5 text-base"
          />
          {errors.mobileNumber && (
            <small className="text-xs text-red-500">
              {errors.mobileNumber.message}
            </small>
          )}
        </div>

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
