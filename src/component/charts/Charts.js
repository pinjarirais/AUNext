"use client";
import React from "react";
import LineChart from "./line-chart";
import PieChart from "./pie-chart";
import BarChart from "./bar-chart";
import AreaChart from "./area-chart";
import DonutChart from "./donut-chart";
import StackedBarChart from "./stacked-bar-chart";

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
