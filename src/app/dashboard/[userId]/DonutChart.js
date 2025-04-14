import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DonutChart = ({ donutData }) => {
//   console.log("donutChartData", donutData);
  const hasData = Array.isArray(donutData) && donutData.length > 0;

  const options = {
    chart: {
      type: "pie",
    },
    title: null, 
    plotOptions: {
      pie: {
        innerSize: "60%", 
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y:.2f}",
        },
      },
    },
    series: [
      {
        name: "Spending",
        data: hasData ? donutData : [],
        colors: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
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

export default DonutChart;
