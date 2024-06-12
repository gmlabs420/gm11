"use client";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function GmsGrow() {
  const [holdersData, setHoldersData] = useState([0, 100, 500, 1000, 10000, 100000, 1000000]);
  const [holdersChart, setHoldersChart] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (holdersChart) {
      holdersChart.destroy();
    }

    const ctxHolders = document.getElementById("holdersChart").getContext("2d");

    const newHoldersChart = new Chart(ctxHolders, {
      type: "line",
      data: {
        labels: holdersData.map((_, index) => `Data ${index + 1}`),
        datasets: [
          {
            label: "Total Holders",
            data: holdersData,
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString(); // Format y-axis labels
              },
            },
          },
        },
      },
    });

    setHoldersChart(newHoldersChart);

    return () => {
      newHoldersChart.destroy();
    };
  }, [holdersData]);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  return (
    <section className="grow-module">
      <div className="grow-top-container">
        <div className="grow-header-box">
          <h1>GROW</h1>
        </div>
        <div className="grow-info-icon-box">
          <div className="grow-info-icon" onClick={handleInfoClick}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </div>
      </div>

      <div className="info-container">
        <div className="info-box">
          <h3>Total GMs</h3>
          <div className="recessed-field">
            <h3>1000</h3>
          </div>
        </div>
        <div className="info-box">
          <h3>Total Holders</h3>
          <div className="recessed-field">
            <h3>300</h3>
          </div>
        </div>
      </div>

      <div className="chart-box">
        <h3>Total Holders Over Time</h3>
        <canvas id="holdersChart"></canvas>
      </div>

      {showInfo && (
        <div className="grow-info-screen show">
          <div className="grow-info-content">
            <FontAwesomeIcon icon={faCircleXmark} className="grow-info-close" onClick={handleInfoClose} />
            <h2>Information</h2>
            <p>This is the information screen for the Grow module.</p>
          </div>
        </div>
      )}
    </section>
  );
}
