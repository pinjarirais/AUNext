import { cookies } from "next/headers";
import EditProfileForm from "./edit-profile-form";

function EditProfile() {
  const cookieStore = cookies();
  console.log("cookies >>>>>>>>", cookieStore)
  const token = cookies().get("token")?.value;
  const authuser = cookies().get("authuser")?.value;  
  const userId = cookies().get("userId")?.value;

  console.log("editprofile", userId)

  return (
    <>
      <div className="form-wrap">
        <div className="login-form w-full p-4 pb-16">
          <div className="form-wrapp mx-auto sm:w-full sm:max-w-sm">
            <EditProfileForm token={token}  authuser={authuser} userId={userId}/>            
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
