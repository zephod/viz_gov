window.viz ?= {}

# Draw the coinvestment bubble chart
viz.renderBubbleChart = (data,graphSelector,colorFunction) ->
  margin =
    top: 20
    right: 20
    bottom: 30
    left: 40
  width  = 760 - margin.left - margin.right
  height = 300 - margin.top - margin.bottom
  x      = d3.time.scale().range([0,width])
  y      = d3.scale.linear().range([height, 0])
  xAxis  = d3.svg.axis().scale(x).orient("bottom")
  yAxis  = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"))
  svg    = d3.select(graphSelector)\
    .append("svg")\
    .attr("width", width + margin.left + margin.right)\
    .attr("height", height + margin.top + margin.bottom)\
    .append("g")\
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  x.domain [data.points[0].date,data.points[data.points.length-1].date]
  y.domain [0, d3.max(data.points, (d) -> d.cash )]
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
  circle = svg.selectAll(".circle")\
    .data(data.points)\
    .enter()\
    .append("circle")\
    .attr("r", (d) -> d.radius)\
    .attr("transform", (d)->
      _x = x(d.date)
      _y = y(d.cash)
      return 'translate('+_x+','+_y+')'
    )
    .style("fill", colorFunction )
    //.style("stroke", (d) -> d3.rgb(colorFunction(d)).darker 1 )
