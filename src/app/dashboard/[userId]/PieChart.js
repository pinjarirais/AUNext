import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({ pieData }) => {
  const hasData = pieData && pieData.length > 0 && pieData.some(item => item.y > 0);

  const options = {
    chart: {
      type: "pie",
    },
    title: { text: "" },
    series: [
      {
        name: "",
        data: hasData ? pieData : [],
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

export default PieChart;
