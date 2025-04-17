import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function StackedBarChart({ stackBarData }){
//   console.log("stackBarData", stackBarData);

  const hasData = stackBarData && stackBarData.length > 0;
  const categoriesSet = new Set();
  stackBarData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== "date") categoriesSet.add(key);
    });
  });

  const categories = Array.from(categoriesSet);
  const xAxisCategories = stackBarData.map(item => item.date);
  const series = categories.map(category => ({
    name: category,
    data: stackBarData.map(item => item[category] || 0), 
  }));

  const options = {
    chart: { type: "bar" },
    title: { text: "" },
    xAxis: {
      categories: xAxisCategories,
      title: { text: "Date" },
    },
    yAxis: {
      min: 0,
      title: { text: "Amount Spent in Rupees" },
      stackLabels: { enabled: true },
    },
    legend: { reversed: true },
    plotOptions: {
      series: { stacking: "normal" },
    },
    series, 
    lang: { noData: "No data available" },
    noData: {
      style: { fontSize: "16px", fontWeight: "bold", color: "#777" },
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

export default StackedBarChart;
