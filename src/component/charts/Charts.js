"use client";
import React from "react";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import DonutChart from "./DonutChart";
import StackedBarChart from "./StackedBarChart";

function Charts({ 
  lineChartData, 
  pieChartData, 
  barChartData, 
  areaChartData, 
  donutChartData, 
  stackedBarData 
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/2">
          <LineChart categories={lineChartData.categories} data={lineChartData.data} />
        </div>
        <div className="w-full md:w-1/2">
          <PieChart pieData={pieChartData} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/2">
          <BarChart barData={barChartData} />
        </div>
        <div className="w-full md:w-1/2">
          <AreaChart areaData={areaChartData} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/2">
          <DonutChart donutData={donutChartData} />
        </div>
        <div className="w-full md:w-1/2">
          <StackedBarChart stackBarData={stackedBarData} />
        </div>
      </div>
    </div>
  );
}

export default Charts;
