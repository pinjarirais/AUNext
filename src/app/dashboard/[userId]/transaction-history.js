import Link from "next/link";
import React from "react";

function TransactionHistory({ transactionData, authuser }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="text-left">
            <tr className="bg-[#D9D9D9]">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Transaction</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactionData?.length > 0 ? (
              transactionData?.map((txn, index) => (
                <tr key={index} className="odd:bg-white even:bg-[#F2F2F2]">
                  <td className="px-4 py-2">{txn.category}</td>
                  <td className="px-4 py-2">{txn.transactionId}</td>
                  <td className="px-4 py-2">
                    {new Date(txn.transactionDateTime).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(txn.transactionDateTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <strong>₹ {txn.amount}</strong>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-col-reverse flex-wrap justify-evenly content-end pt-4">
          {authuser === "CH USER" ? (
            <button className="w-[100px] bg-[#9a48a9] hover:bg-[#6d3078] text-white p-2 border-none rounded-md">
              <Link href="">Billing</Link>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default TransactionHistory;
