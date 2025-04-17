import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function LineChart({ categories, data }){
  console.log("categories",categories)
  const hasData = data && data.length > 0 && data.some(value => value !== null && value !== undefined);

  const options = {
    title: { text: "" },
    xAxis: {  title: { text: "Date" }, categories: categories || []},
    yAxis: { title: { text: "Amount in Rupees" } },
    series: [
      {
        name: "Amount",
        data: hasData ? data : [],
        showInLegend: hasData,
      },
    ],
    lang: {
      noData: "No data available", 
    },
    noData: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#777",
      },
    },
  };

  return hasData ? (
    <HighchartsReact highcharts={Highcharts} options={options} />
  ) : (
    <div className="flex justify-center items-center h-40 text-gray-500 font-semibold">
      No data available
    </div>
  );
};

export default LineChart;
