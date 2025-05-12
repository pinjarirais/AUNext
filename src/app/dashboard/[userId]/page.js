import { cookies } from "next/headers";
import CardDetails from "./card-details";

const cardholders_service = process.env.CARDHOLDER_SERVICE;

export default async function CardDetailsPage() {
  const token = cookies().get("token")?.value;
  const authuser = cookies().get("authuser")?.value;
  const userId = cookies().get("userId")?.value;

  if (!token) {
    return <div className="p-4 text-red-500">Unauthorized: No token found.</div>;
  }

  const apiUrl = `${cardholders_service}/api/cardholders/chUsers/${userId}`;
  let initialCards = [];

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API response error:", res.status, res.statusText);
      return <div className="p-4 text-red-500">Failed to fetch card details.</div>;
    }

    const data = await res.json();
    initialCards = data?.cardHolders || [];

    console.log("initialCards >>>>>>", initialCards)

  } catch (error) {
    console.error("Error fetching cardholder data:", error);
    return <div className="p-4 text-red-500">Error fetching cardholder details.</div>;
  }

  return <CardDetails initialCards={initialCards} userId={userId} token={token} authuser={authuser}/>;
}
