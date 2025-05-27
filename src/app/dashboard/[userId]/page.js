import { DecryptAES } from "@/utils/crypto"; // your existing crypto utils
import CardDetails from "./card-details";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CardDetailsPage({ params }) {

   const cookieStore = await cookies();
const ch_id = cookieStore.get("ch_token_id")?.value;
  const authuser = cookieStore.get("authuser")?.value;
  const { userId } = params;
  console.log("card details>>>>>>>", userId);
 
  const encryptedToken = ch_id;
  console.log("encryptedToken>>>>>>>>>>>>     ",encryptedToken);



  // Decrypt the token
  const decryptedId = DecryptAES(decodeURIComponent(encryptedToken));
  console.log("decryptedId>>>>>>>>>>>>",decryptedId);

  // Compare decryptedId with userId param
  if (decryptedId !== userId) {
       redirect('/');
   
  }

  // Fetch auth token from cookies
  const token = cookies().get("token")?.value;
  if (!token) {
    return <div className="p-4 text-red-500">Unauthorized: No token found.</div>;
  }

  const cardholders_service = process.env.CARDHOLDER_SERVICE;
  const apiUrl = `${cardholders_service}/api/cardholders/chUsers/${userId}`;

  // Fetch cardholder data securely
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-4 text-red-500">
        Failed to fetch cardholder details: {res.status} {res.statusText}
      </div>
    );
  }

  const data = await res.json();
  const initialCards = data?.cardHolders || [];

  return <CardDetails authuser={authuser} initialCards={initialCards} userId={userId} />;
}
