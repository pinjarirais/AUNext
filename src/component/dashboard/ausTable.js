'use client'
import React, { useEffect, useState } from "react";
import Pagination from "../pagination";
import { ExportToExcel } from "../ExportToExcel";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AusTable({ userData, AUStotalLength, currentpg }) {
  const router = useRouter();
  const datalength = userData?.cardHolders?.length;

  const [ExcelData, setExcelData] = useState([]);  
  
  const numberpg = Math.ceil(AUStotalLength / 10);
  const pagenumber = [...Array(numberpg || 1).keys()];

  const handlePageClick = (pg) => {
    router.push(`/dashboard?page=${pg}`);
  };  

  console.log("totalLength >>>>>>>>", datalength);

  const fileName = "CHUsers"; // here enter filename for your excel file
  useEffect(() => {
    // reshaping the array
    const customHeadings = userData?.chUsers?.map((item) => ({
      Id: item.id,
      "Card Number": item.cardHolders[0]?.cardNumber,
      Name: item.name,
      "Pancard Number": item.cardHolders[0]?.pancardNumber,
      Email: item.email,
      Phone: item.phone,
    }));

    setExcelData(customHeadings);
  }, [userData]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex justify-between">
          <div>
            <ExportToExcel apiData={ExcelData} fileName={fileName} />
          </div>
          <div className="ml-4">
            <Link
              className="bg-[#6d3078] inline-flex h-8 text-white px-4 py-1 rounded-md cursor-pointer shadow-md"
              href="/leadgenerate"
            >
              Upload Lead
            </Link>
          </div>
        </div>
        <div>
          <Pagination
            pagenumber={pagenumber}
            currentpg={currentpg}
            onPageChange={handlePageClick}
          />
        </div>
      </div>
      <div>
        <table className="border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 p-2">ID</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Card Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">Name</th>
              <th className="border border-gray-300 bg-gray-200 p-2">
                Pancard Number
              </th>
              <th className="border border-gray-300 bg-gray-200 p-2">Email</th>
              <th className="border border-gray-300 bg-gray-200 p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData?.chUsers &&
              userData?.chUsers?.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">
                    {item?.cardHolders[0]?.cardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Link
                      className="text-blue-700 underline"
                      href={`/dashboard/${item.id}`}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item?.cardHolders[0]?.pancardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">{item.phone}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AusTable;
