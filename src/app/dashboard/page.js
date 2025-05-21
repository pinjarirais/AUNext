"use server";
import { cookies } from "next/headers";
import AusTable from "@/component/dashboard/aus-table";
import ChTable from "@/component/dashboard/ch-table";

const cardholders_service = process.env.CARDHOLDER_SERVICE;


export default async function Page({searchParams}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const authuser = cookieStore.get("authuser")?.value;
  const userId = cookieStore.get("userId")?.value;

  const currentpg = parseInt(searchParams?.page || "0");

  const AUS = `${cardholders_service}/api/cardholders/ausUsers/${userId}/chUsers?page=${currentpg}&size=10`;
  const CH = `${cardholders_service}/api/cardholders/chUsers/${userId}`;

  const endpoint = authuser === "AUS USER" ? AUS : CH;
  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const userData = await res.json();
  const AUStotalLength = userData?.totalElements;  

  

  console.log("Dashboard API Call >>>>>>", userData)

  return (
    <div className="px-10">
      <div className="dashboard-wrap">
        <div className="flex flex-auto justify-between border-b-[1px] py-5 align-middle">
          <div>
            <h1 className="text-[24px] font-bold">DASHBOARD</h1>
          </div>
          <div className="top-search">
            {/* This could be extracted as a client component if it handles interaction */}
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6d3078]-500 focus:border-[#6d3078]-500"
            />
          </div>
        </div>

        <div className="pb-16 pt-4 mx-auto">
          {authuser === "AUS USER" ? (
            <AusTable userData={userData} AUStotalLength={AUStotalLength} currentpg={currentpg}/>
          ) : (
            <ChTable userData={userData} />
          )}
        </div>
      </div>
    </div>
  );
}
