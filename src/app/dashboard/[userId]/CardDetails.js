"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FadeLoader } from "react-spinners";
import Charts from "../../../component/charts/Charts";
import CardList from "./cardList";
import TransactionHistory from "./transactionHistory";

// Base API URL config
//const BASE_URL = "http://localhost:8082/api";

function CardDetails({ initialCards, userId, authuser }) {
  // State Management
  const [cards, setCards] = useState(initialCards);
  const [selectedCardId, setSelectedCardId] = useState(
    initialCards?.[0]?.id ?? null
  );

  console.log("selectedCardId >>>>>>>>>>>>>>>>>", selectedCardId)

  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [lineChartData, setLineChartData] = useState({
    categories: [],
    data: [],
  });
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [areaChartData, setAreaChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [stackedBarData, setStackedBarData] = useState([]);


  console.log("transactionData >>>>>>>>>", transactionData)
  // Utils
  const getFormattedDate = (date) => date.toISOString().split("T")[0];

  // Initial Date Setup
  useEffect(() => {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    setFromDate(getFormattedDate(threeMonthsAgo));
    setToDate(getFormattedDate(currentDate));
  }, []);


  const {request} = useApi();

  // Fetch Transaction API
  const fetchTransactionDetails = useCallback(
    async (id, fromDate, toDate) => {
      if (!id) return;
  
      setIsLoading(true);
      try {
        const response = await request({
          endpoint: `api/expenses/by-card/${id}/by-date-range?fromDate=${fromDate}&toDate=${toDate}`,
          method: "GET",
        });

        
        if (!response.status) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
  
        //const data = await response.json();

        console.log("cardDetail page data >>>>>>>>>>>", response.data)
  
        if (response.data && response.data.transactions) {
          setTransactionData(response.data.transactions);
        } else {          
          console.warn("No transaction data received.");
        }
  
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
        setTransactionData({ transactions: [] });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  

  // Load initial data on card selection
  useEffect(() => {
    if (selectedCardId && fromDate && toDate) {
      fetchTransactionDetails(selectedCardId, fromDate, toDate);
    }
  }, [selectedCardId, fromDate, toDate]);
  
  


  // Chart Data Transformation
  useEffect(() => {
    if (transactionData?.length > 0) {
      updateChartData(transactionData);
    } else {
      clearChartData();
    }
  }, [transactionData]);

  const updateChartData = (transactions) => {
    transactions.sort(
      (a, b) =>
        new Date(a.transactionDateTime) - new Date(b.transactionDateTime)
    );

    const categories = transactions.map((txn) =>
      new Date(txn.transactionDateTime).toLocaleDateString()
    );
    const data = transactions.map((txn) => txn.amount);

    setLineChartData({ categories, data });
    setAreaChartData({ categories, data });

    const categoryMap = transactions.reduce((acc, txn) => {
      if (!txn.category || typeof txn.amount !== "number") return acc;
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryMap).map(
      ([category, amount]) => ({ name: category, y: amount })
    );

    setPieChartData(categoryData);
    setBarChartData(categoryData);
    setDonutChartData(categoryData);

    const groupedData = transactions.reduce((acc, txn) => {
      const date = new Date(txn.transactionDateTime).toLocaleDateString();
      if (!acc[date]) acc[date] = { date };
      acc[date][txn.category] = (acc[date][txn.category] || 0) + txn.amount;
      return acc;
    }, {});

    setStackedBarData(Object.values(groupedData));
  };

  const clearChartData = () => {
    setLineChartData({ categories: [], data: [] });
    setPieChartData([]);
    setBarChartData([]);
    setAreaChartData([]);
    setDonutChartData([]);
    setStackedBarData([]);
  };

  // Date Filter Submit
  const handleShowClick = () => {
    if (selectedCardId) {
      fetchTransactionDetails(selectedCardId, fromDate, toDate);
    }
  };

  // Custom Date Input
  const CustomDatePickerInput = ({ value, onClick }) => (
    <div className="relative w-full cursor-pointer" onClick={onClick}>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-md bg-white px-3 py-1.5 border border-[#a3a5aa] focus:border-[#6d3078] focus:ring-1 focus:ring-[#6d3078] focus:outline-none text-[12px] md:text-[14px] h-[30px] pr-8"
      />
      <FaCalendarAlt className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );

  // Main Render
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <FadeLoader color="#9a48a9" />
    </div>
  ) : (
    <div className="px-2 lg:px-10">
      <div className="dashboard-wrap flex flex-col md:flex-row justify-between py-3 md:h-[85vh]">
        {/* Card List */}
        <CardList
          handleCardSelection={setSelectedCardId}
          cards={cards}
          selectedCard={selectedCardId}
          transactionData={transactionData}
          ChuserID={userId}
          authuser={authuser}
        />

        {/* Charts + Filters */}
        <div className="w-full md:w-3/4 md:px-5 overflow-y-auto pb-[100px] scrollbar-hide">
          {/* Date Filters */}
          <div className="md:max-w-96 mx-auto mb-10 flex flex-row items-end gap-2 justify-center">
            <div>
              <p>
                <strong>From</strong>
              </p>
              <DatePicker
                selected={fromDate ? new Date(fromDate) : null}
                onChange={(date) => setFromDate(getFormattedDate(date))}
                maxDate={toDate ? new Date(toDate) : new Date()}
                customInput={<CustomDatePickerInput />}
              />
            </div>
            <div>
              <p>
                <strong>To</strong>
              </p>
              <DatePicker
                selected={toDate ? new Date(toDate) : null}
                onChange={(date) => setToDate(getFormattedDate(date))}
                minDate={fromDate ? new Date(fromDate) : null}
                maxDate={new Date()}
                customInput={<CustomDatePickerInput />}
              />
            </div>
            <button
              type="button"
              onClick={handleShowClick}
              className="w-[100px] bg-[#9a48a9] hover:bg-[#6d3078] text-white p-1.5 rounded-md h-[30px]"
            >
              Show
            </button>
          </div>

          <Charts
            lineChartData={lineChartData}
            pieChartData={pieChartData}
            barChartData={barChartData}
            areaChartData={areaChartData}
            donutChartData={donutChartData}
            stackedBarData={stackedBarData}
          />

          {/* Transaction History */}
          <h1 className="text-center text-[24px] my-5 font-bold">
            Transaction History
          </h1>
          <TransactionHistory transactionData={transactionData}  authuser={authuser}/>
        </div>
      </div>
    </div>
  );
}

export default CardDetails;
