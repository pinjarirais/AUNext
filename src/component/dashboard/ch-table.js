"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { setCookie } from "cookies-next";
import { EncryptAES } from "@/utils/crypto";

function ChTable({ userData }) {
  const [currentpg, setCurrentPg] = useState(0);
  const [ExcelData, setExcelData] = useState([]);

  if (userData) {
    console.log("Dashboard AUS page set cookies >>>>>>>", userData);
    Cookies.set("pfname", userData.name);
    Cookies.set("pfemail", userData.email);
  }

  const datalength = userData?.cardHolders?.length || 0;
  const numberpg = Math.ceil(datalength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];
  const startpg = currentpg * 10;
  const endpg = startpg + 10;

  useEffect(() => {
    if (userData?.cardHolders) {
      const customHeadings = userData.cardHolders.map((item) => ({
        Id: item.id,
        "Card Number": item.cardNumber,
        Name: userData.name,
        "Pancard Number": item.pancardNumber,
        Email: userData.email,
        Phone: userData.phone,
      }));
      setExcelData(customHeadings);
    }
  }, [userData]);

    const handleStoreToken=(item)=>{
      setCookie("ch_token_id",item,{
        httpOnly:false,
      })    
    }

  return (
    <>
      <div className="mt-4">
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Card Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                User Name
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Pancard Number
              </th>

              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.cardHolders?.slice(startpg, endpg).map((item) => {
              console.log("Dashboard CH page set cookies >>>>>>>", item.id);
              const encryptedId = EncryptAES(item.id.toString());
              return (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    {item.cardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link
                      className="text-blue-700 underline"
                      href={`/dashboard/${item.id}`}
                      onClick={()=>handleStoreToken(encodeURIComponent(encryptedId))}
                    >
                      {userData.name}
                    </Link>
                  </td>

                  <td className="border border-gray-300 p-2">
                    {item.pancardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {userData.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {userData.phone}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ChTable;