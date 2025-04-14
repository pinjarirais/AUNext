'use client'
import React from "react";
//import EditProfileOtp from "./EditProfileOtp";
import EditProfileForm from "./EditProfileForm";

function EditProfile() {
  return (
    <>
      <div className="form-wrap">
        <div className="login-form w-full p-4 pb-16">
          <div className="form-wrapp mx-auto sm:w-full sm:max-w-sm">
            <EditProfileForm />
            {/* <EditProfileOtp /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
