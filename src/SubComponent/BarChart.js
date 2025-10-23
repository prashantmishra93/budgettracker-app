import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { makeApiRequest, url, respStatus, showMessage } from "../helper/api_helper";

const BarChart = () => {
  const chartRef = useRef();
  const [charts, setCharts] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartYear, setChartYear] = useState([])

  // Fetch all year summary data
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async (year = null) => {
    try {
      setLoading(true);
      const payload = year ? { year } : {}; // pass year only if user selects one
      const response = await makeApiRequest(url.USER_API.entriesSummary, payload, url.API_EXTENSION);

      if (response.status !== respStatus["SUCCESS"]) {
        showMessage(response);
        return;
      }
      setCharts(response.data || []);
      setChartYear(response?.extraData || []);
      if (!selectedYear && response.data.length > 0) {
        setSelectedYear(response.data[0].year); // default to first year
      }
    } catch (error) {
      console.error(error);
      showMessage({ message: "Something went wrong while loading chart!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedYear)
  }, [selectedYear])

  // Filter month data for selected year
  const yearData = charts.find((y) => y.year === selectedYear)?.months || [];

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // clear old chart

    const width = 700;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };

    svg.attr("width", width).attr("height", height);

    // If no data, draw empty background + message
    if (!yearData.length) {
      svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr("fill", "#f4f4f4")
        .attr("stroke", "#ccc");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#888")
        .text("No data available for this year");

      return; // stop further chart drawing
    }

    // ---- existing chart drawing code below ----

    const x0 = d3
      .scaleBand()
      .domain(yearData.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(["income", "expenses", "budget"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const yMax =
      d3.max(yearData, (d) => Math.max(d.income, d.expenses, d.budget || 0)) || 0;

    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(["income", "expenses", "budget"])
      .range(["#16a34a", "#dc2626", "#2563eb"]);

    // Draw grouped bars
    svg
      .append("g")
      .selectAll("g")
      .data(yearData)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.month)},0)`)
      .selectAll("rect")
      .data((d) => ["income", "expenses", "budget"].map((key) => ({ key, value: d[key] || 0 })))
      .join("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.value))
      .attr("fill", (d) => color(d.key));

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .attr("text-anchor", "end");

    // Y Axis
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text(`Income vs Expenses vs Budget (${selectedYear})`);

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 200}, ${margin.top})`);

    ["income", "expenses", "budget"].forEach((key, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(key.charAt(0).toUpperCase() + key.slice(1))
        .style("font-size", "12px");
    });
  }, [yearData, selectedYear]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="mt-3">Yearly Financial Overview</h3>

      {(chartYear.length > 0) && (
        <select
          className="form-select w-auto d-inline-block"
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          value={selectedYear || ""}
          style={{ marginBottom: "15px" }}
        >
          {chartYear.map((y, i) => (
            <option key={i} value={y}>
              {y}
            </option>
          ))}
        </select>
      )}

      {loading ? <p>Loading chart...</p> : <svg ref={chartRef}></svg>}
    </div>
  );
};

export default React.memo(BarChart);