import ChangePinClient from "@/component/changePin/ChangePinClient";
import ChangePinLayout from "@/component/changePin/ChangePinLayout";
import { cookies } from "next/headers";

export default function ChangePinPage() {
  const userId = cookies().get("userId")?.value;
  return (
    <ChangePinLayout>
      <ChangePinClient userId={userId}/>
    </ChangePinLayout>
  );
}
