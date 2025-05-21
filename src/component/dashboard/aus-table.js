"use client";
import React, { useEffect, useState } from "react";
import Pagination from "../pagination";
import { ExportToExcel } from "../export-to-excel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setCookie } from "cookies-next";
import { EncryptAES } from "@/utils/crypto";

function AusTable({ userData, AUStotalLength, currentpg }) {
  const router = useRouter();
  const [ExcelData, setExcelData] = useState([]);

  // Set cookies when userData is available
  useEffect(() => {
    if (userData?.ausUser) {
      Cookies.set("pfname", userData.ausUser.name);
      Cookies.set("pfemail", userData.ausUser.email);
    }
  }, [userData]);

  // Prepare Excel export data
  useEffect(() => {
    const customHeadings = userData?.chUsers?.map((item) => ({
      Id: item.id,
      "Card Number": item.cardHolders?.[0]?.cardNumber || "",
      Name: item.name,
      "Pancard Number": item.cardHolders?.[0]?.pancardNumber || "",
      Email: item.email,
      Phone: item.phone,
    }));
    setExcelData(customHeadings || []);
  }, [userData]);

  const handlePageClick = (pg) => {
    router.push(`/dashboard?page=${pg}`);
  };

  // const handleUserClick = (id) => {
  //   setCookie("ch_id", id, {
  //     httpOnly: false,
  //     maxAge: 60 * 60 * 24 * 7,
  //     path: "/",
  //   });
  // };

  const handleStoreToken=(item)=>{
    setCookie("ch_token_id",item,{
      httpOnly:false,
    })    
  }

  const fileName = "CHUsers";
  const numberpg = Math.ceil(AUStotalLength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <ExportToExcel apiData={ExcelData} fileName={fileName} />
          <div className="ml-4">
            <Link
              className="bg-[#6d3078] inline-flex h-8 text-white px-4 py-1 rounded-md cursor-pointer shadow-md"
              href="/lead-generate"
            >
              Upload Lead
            </Link>
          </div>
        </div>
        <Pagination
          pagenumber={pagenumber}
          currentpg={currentpg}
          onPageChange={handlePageClick}
        />
      </div>

      <div>
        <table className="border-collapse border border-gray-400 w-full mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Card Number</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Name</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Pancard Number</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.chUsers?.map((item) => {
              const encryptedId = EncryptAES(item.id.toString()); // <--- HERE

              return (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    {item.cardHolders?.[0]?.cardNumber || ""}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link
                      href={`/dashboard/${item.id}`}
                      className="text-blue-700 underline"
                      onClick={()=>handleStoreToken(encodeURIComponent(encryptedId))}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.cardHolders?.[0]?.pancardNumber || ""}
                  </td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">{item.phone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AusTable;
