import ChangePinClient from "@/component/change-pin/change-pin-client";
import ChangePinLayout from "@/component/change-pin/change-pin-layout";
import { cookies } from "next/headers";

export default function ChangePinPage() {
  const userId = cookies().get("userId")?.value;
  return (
    <ChangePinLayout>
      <ChangePinClient userId={userId}/>
    </ChangePinLayout>
  );
}
