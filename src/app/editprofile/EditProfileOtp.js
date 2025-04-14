import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    otp: z
        .string()
        .regex(/^[a-zA-Z0-9]{6}$/, "OTP must be exactly 6 alphanumeric characters"),
});

const EditProfileOtp = () => {

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <>
            <form className='space-y-3' onSubmit={handleSubmit(onSubmit)}>
                <div className='feild w-full'>
                    <label className='block text-sm/6 text-gray-700 flex flex-auto justify-between font-bold'>
                        Enter OTP <small className='text-xs'>02 : 00</small>
                    </label>
                    <input
                        {...register("otp")}
                        className='w-full rounded-md bg-white px-3 py-1.5 text-base sm:text-sm/6 border-[1px] border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none'
                        placeholder='Enter OTP'
                        onBlur={() => trigger("otp")}
                        maxLength={6}
                    />
                    <div className='flex flex-auto gap-5'>
                        {/* {errors.otp && (
                            <small className='text-xs w-full block text-red-500 mt-1'>
                                OTP must be 6 alphanumeric characters
                                <span className='text-xs text-[#6d3078] underline text-center float-right'>
                                    Resend OTP
                                </span>
                            </small>
                        )} */}
                        {errors.otp && <small className='text-xs w-full block text-red-500 mt-1'>Invalid OTP <span className='text-xs text-[#6d3078] underline text-center float-right'>Resend OTP</span></small>}
                    </div>
                </div>
                <div className='feild w-full mx-auto'>
                    <button type='submit' className='w-full bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 m-auto border-none rounded-md my-5'>
                        Verify & Update
                    </button>
                </div>
            </form>
        </>
    );
};

export default EditProfileOtp;
