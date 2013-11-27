
window.viz ?= {}

viz.renderStackedBar = ->
  margin =
    top: 20
    right: 250
    bottom: 30
    left: 40

  width  = 920 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  x0     = d3.scale.ordinal().rangeRoundBands([0, width], .1)
  y      = d3.scale.linear().range([height, 0])
  xAxis  = d3.svg.axis().scale(x0).orient("bottom")
  yAxis  = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"))
  svg    = d3.select("#graph_yearonyear")\
    .append("svg")\
    .attr("width", width + margin.left + margin.right)\
    .attr("height", height + margin.top + margin.bottom)\
    .append("g")\
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  d3.json "data/etl_yearonyear.json", (data) ->
    x0.domain data.series.map((d) -> d.major)
    y.domain [0, d3.max(data.series, (d) -> d3.sum d.ages, (d) -> d.value )]
    # Populate data with offsets
    data.series.forEach (series) ->
      sumOfPrevious = 0
      series.ages.forEach (d) ->
        d.sumOfPrevious = sumOfPrevious
        sumOfPrevious += d.value

    svg.append("g")\
      .attr("class", "x axis")\
      .attr("transform", "translate(0," + height + ")")\
      .call(xAxis)
    svg.append("g")\
      .attr("class", "y axis")\
      .call(yAxis)\
      .append("text")\
      .attr("transform", "rotate(-90)")\
      .attr("y", 6)\
      .attr("dy", ".71em")\
      .style("text-anchor", "end")\
      .text("Cash Invested")
    state = svg.selectAll(".state")\
      .data(data.series)\
      .enter()\
      .append("g")\
      .attr("class", "g")\
      .attr("transform", (d) -> "translate(" + x0(d.major) + ",0)")
    state.selectAll("rect")\
      .data((d) -> d.ages)\
      .enter()\
      .append("rect")\
      .attr("width", x0.rangeBand())\
      .attr("x", (d) -> x0(d.name))\
      .attr("y", (d) -> y(d.value+d.sumOfPrevious))\
      .attr("height", (d) -> height - y(d.value))\
      .style("fill", (d) -> viz.sector_color(d.name))
    legend = svg.selectAll(".legend")\
      .data(viz.sector_list)\
      .enter()\
      .append("g")\
      .attr("class", "legend")\
      .attr("transform", (d, i) -> "translate(230," + i * 20 + ")")
    legend.append("rect")\
      .attr("x", width - 18)\
      .attr("width", 18)\
      .attr("height", 18)\
      .style("fill", viz.sector_color)\
      .style("stroke", (d) -> '#000')
    legend.append("text")\
      .attr("x", width - 24)\
      .attr("y", 9)\
      .attr("dy", ".35em")\
      .style("text-anchor", "end")\
      .text((d) -> viz.trim(d,35))

