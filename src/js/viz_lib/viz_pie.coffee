
window.viz ?= {}

viz.renderPieChart = (data, containerSelector, colorFunction, trimLegend=-1, legendData=null) ->
    legendData ?= data.map (x) -> x.name
    width = 450
    height = 200
    radius = Math.min(width, height) / 2
    arc = d3.svg.arc()\
      .outerRadius(radius - 10)\
      .innerRadius(radius - 50)
    pie = d3.layout.pie()\
      .sort(null)\
      .value((d) -> d.value)

    svg = d3.select(containerSelector)\
      .append("svg")\
      .attr("width", width)\
      .attr("height", height)\
      .append("g")\
      .attr("transform", "translate("+(15+radius)+"," + height / 2 + ")")

    g = svg.selectAll(".arc")\
      .data(pie(data))\
      .enter()\
      .append("g")\
      .attr("class", "arc")
    g.append("path")\
      .attr("d", arc)\
      .style("fill", (d) -> colorFunction(d.data.name))

    legend = svg.selectAll(".legend")\
      .data(data)\
      .enter()\
      .append("g")\
      .attr("class", "legend")\
      .attr("transform", (d, i) -> "translate(-150," + (i*18 - 90) + ")")
    legend.append("rect")\
      .attr("x", width - 18)\
      .attr("width", 18)\
      .attr("height", 18)\
      .style("fill", (d)->colorFunction(d.name))\
      .style("stroke", (d) -> '#000')
    legend.append("text")\
      .attr("x", width - 24)\
      .attr("y", 9)\
      .attr("dy", ".35em")\
      .style("text-anchor", "end")\
      .text((d) -> viz.trim(d.name,trimLegend))

