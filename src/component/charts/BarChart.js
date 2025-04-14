import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BarChart = ({ barData }) => {
//  console.log("barChartData",barData)
  const hasData = barData && barData.length > 0;

  const options = {
    chart: { type: "column" },
    title: null, 
    xAxis: {
      categories: Array.isArray(barData) ? barData.map((item) => item.name) : [],
      title: { text: "Categories" },
    },
    yAxis: {
      min: 0,
      title: { text: "Amount Spent in Rupees" },
    },
    series: [
      {
        name: "Spending",
        data: Array.isArray(barData) ? barData.map((item) => item.y) : [],
        color: "#9a48a9",
      },
    ],
  };
  
  

  return hasData ? (
    <HighchartsReact highcharts={Highcharts} options={options} />
  ) : (
    <div className="flex justify-center items-center h-40 text-gray-500 font-semibold">
      No data available
    </div>
  );
};

export default BarChart;
