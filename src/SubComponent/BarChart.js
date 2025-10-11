import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current)
                  .attr("width", 500)
                  .attr("height", 300)
                  .style("background", "#f4f4f4")
                  .style("margin-top", "20px");

    const xScale = d3.scaleBand()
                     .domain(data.map((d, i) => i))
                     .range([0, 500])
                     .padding(0.2);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data)])
                     .range([300, 0]);

    svg.selectAll(".bar")
       .data(data)
       .join("rect")
       .attr("class", "bar")
       .attr("x", (d, i) => xScale(i))
       .attr("y", d => yScale(d))
       .attr("width", xScale.bandwidth())
       .attr("height", d => 300 - yScale(d))
       .attr("fill", "teal");
    
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

export default React.memo(BarChart);
