"use client";
// import React, { useEffect, useRef } from "react";
// import { Chart } from "chart.js/auto";

// export default function UserChart() {
//   const chartRef = useRef<any>(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       if (chartRef.current.chart) {
//         chartRef.current.chart.destroy();
//       }

//       const context = chartRef.current.getContext("2d");

//       const newChart = new Chart(context, {
//         type: "line",
//         data: {
//           labels: ["Jhon", "Doe", "Harry"],
//           datasets: [
//             {
//               label: "info",
//               data: [10, 20, 30],
//               backgroundColor: ["red", "green", "blue"],
//               borderColor: ["orange"],
//               borderWidth: 2,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             x: {
//               type: "category",
//             },
//             y: {
//               beginAtZero: true,
//             },
//           },
//         },
//       });
//       chartRef.current.chart = newChart;
//     }
//   }, []);

//   return (
//     <>
//       <div className='relative h-[40vh]'>
//         <canvas ref={chartRef}></canvas>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

export default function UserChart() {
  const chartRef = useRef<any>(null);
  const [timePeriod, setTimePeriod] = useState<string>("day");

  useEffect(() => {
    const salesData: any = {
      day: {
        labels: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
        data: [1000, 200, 3000, 6000, 1000, 200, 3000],
      },
      week: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [7000, 2000, 2400, 4000],
      },
      month: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        data: [
          11000, 22220, 30730, 10040, 70050, 90060, 79270, 1000, 20907, 18700,
          11110, 16620,
        ],
      },
    };

    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: salesData[timePeriod].labels,
          datasets: [
            {
              label: "Sales",
              data: salesData[timePeriod].data,
              backgroundColor: "#6366f1",
              borderColor: "#6366f1",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "category",
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartRef.current.chart = newChart;
    }
  }, [timePeriod]);

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  return (
    <>
      <div className='relative h-[40vh]'>
        <canvas ref={chartRef}></canvas>
        <div>
          <button onClick={() => handleTimePeriodChange("day")}>Day</button>
          <button onClick={() => handleTimePeriodChange("week")}>Week</button>
          <button onClick={() => handleTimePeriodChange("month")}>Month</button>
        </div>
      </div>
    </>
  );
}
