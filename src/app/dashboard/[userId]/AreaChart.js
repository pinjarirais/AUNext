import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AreaChart = ({ areaData }) => {
//   console.log("areaChartData", areaData);
  const hasData = areaData?.categories?.length > 0 && areaData?.data?.length > 0;

  const options = {
    chart: { type: "area" },
    title: null,
    xAxis: {
      categories: hasData ? areaData.categories : [],
      title: { text: "Date" },
    },
    yAxis: {
      title: { text: "Amount Spent in Rupees" },
    },
    series: [
      {
        name: "Spending",
        data: hasData ? areaData.data : [],
        color: "#4bc0c0",
        fillOpacity: 0.3,
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

export default AreaChart;
