# Document.onload()
# -----------------
$ ->
  renderSankey()
  renderStackedBar()
  renderPieChart()
  renderPieChart2()

# Util
# ----
rnd = (range) -> Math.floor(Math.random()*range)
rnd_list = (len) -> ( rnd(5)+1 for x in [1..len] )
rnd_col = -> 'rgb('+rnd(255)+','+rnd(255)+','+rnd(255)+')'
trim = (x,maxlen) ->
  if x.length > maxlen
    return x.substr(0,maxlen) + '...'
  return x
money_to_string = (amount) ->
  out = ''
  amount = String(amount)
  while amount.length>3
    out = ',' + amount.substring(amount.length-3) + out
    amount = amount.substring(0,amount.length-3)
  return "<span class=\"poundsign\">£</span>" + amount + out

# Draw the coinvestment thing
renderStackedBar = ->
  d3.json 'data/etl_coinvestment.json',(data)->
    $('#coinvestment-total').html( money_to_string data.total )

  margin =
    top: 20
    right: 250
    bottom: 30
    left: 40

  width  = 960 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  x0     = d3.scale.ordinal().rangeRoundBands([0, width], .1)
  y      = d3.scale.linear().range([height, 0])
  color  = d3.scale.category20c()
  xAxis  = d3.svg.axis().scale(x0).orient("bottom")
  yAxis  = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"))
  svg    = d3.select("#graph_yearonyear")\
    .append("svg")\
    .attr("width", width + margin.left + margin.right)\
    .attr("height", height + margin.top + margin.bottom)\
    .append("g")\
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  d3.json "data/etl_coinvestment.json", (data) ->
    # Prepare ordered legend colors
    data.legend.forEach (x) -> color(x)
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
      .style("fill", (d) -> color d.name )
    legend = svg.selectAll(".legend")\
      .data(data.legend.slice().reverse())\
      .enter()\
      .append("g")\
      .attr("class", "legend")\
      .attr("transform", (d, i) -> "translate(230," + i * 20 + ")")
    legend.append("rect")\
      .attr("x", width - 18)\
      .attr("width", 18)\
      .attr("height", 18)\
      .style("fill", color)\
      .style("stroke", (d) -> '#000')
    legend.append("text")\
      .attr("x", width - 24)\
      .attr("y", 9)\
      .attr("dy", ".35em")\
      .style("text-anchor", "end")\
      .text((d) -> trim(d,35))


# Draw the coinvestment thing
renderGroupedBar = ->
  d3.json 'data/etl_coinvestment.json',(data)->
    $('#coinvestment-total').html( money_to_string data.total )

  margin =
    top: 20
    right: 20
    bottom: 30
    left: 40

  width  = 960 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  x0     = d3.scale.ordinal().rangeRoundBands([0, width], .1)
  x1     = d3.scale.ordinal()
  y      = d3.scale.linear().range([height, 0])
  color  = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
  xAxis  = d3.svg.axis().scale(x0).orient("bottom")
  yAxis  = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"))
  svg    = d3.select("#graph_coinvestment")\
    .append("svg")\
    .attr("width", width + margin.left + margin.right)\
    .attr("height", height + margin.top + margin.bottom)\
    .append("g")\
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  d3.json "data/etl_coinvestment.json", (data) ->
    x0.domain data.series.map((d) -> d.major)
    x1.domain(data.legend).rangeRoundBands [0, x0.rangeBand()]
    y.domain [0, d3.max(data.series, (d) -> d3.max d.ages, (d) -> d.value )]

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
      .text("Population")
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
      .attr("width", x1.rangeBand())\
      .attr("x", (d) -> x1(d.name))\
      .attr("y", (d) -> y(d.value))\
      .attr("height", (d) -> height - y(d.value))\
      .style("fill", (d) -> color d.name )
    legend = svg.selectAll(".legend")\
      .data(data.legend.slice().reverse())\
      .enter()\
      .append("g")\
      .attr("class", "legend")\
      .attr("transform", (d, i) -> "translate(0," + i * 20 + ")")
    legend.append("rect")\
      .attr("x", width - 18)\
      .attr("width", 18)\
      .attr("height", 18)\
      .style("fill", color)
    legend.append("text")\
      .attr("x", width - 24)\
      .attr("y", 9)\
      .attr("dy", ".35em")\
      .style("text-anchor", "end")\
      .text((d) -> d)



# Demo Bar Chart
# --------------
renderBarDemo = ->
  chart = d3.select('#graph_demo')\
    .append('svg')\
    .attr('height',210)
  rects = chart.selectAll('rect')\
    .data(rnd_list(8))\
    .enter().append('rect')\
    .attr('x',0)\
    .attr('y',(d,i)->10+i*25)\
    .attr('width',(d,i)->d*40)\
    .attr('height',20)\
    .attr('stroke',null)\
    .attr('fill',rnd_col())

  rects.on 'click',->
    newData = ( rnd(5)+1 for x in [1..8] )
    rects.data(newData)\
      .transition().delay(200).duration(2000)\
      .attr('width',(d,i)->d*20)\
      .attr('fill',rnd_col())


# Charity Sankey 
# --------------
renderSankey = ->
  margin =
    top: 1
    right: 1
    bottom: 6
    left: 1

  width = 960 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  formatNumber = d3.format(",.0f")
  format = (d) ->
    formatNumber(d) + " TWh"

  color  = d3.scale.category20c()
  svg    = d3.select("#graph_sankey").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height])
  path   = sankey.link()

  d3.json "data/etl_sankey.json", (energy) ->
    dragmove = (d) ->
      d3.select(this)\
        .attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")")
      sankey.relayout()
      link.attr "d", path

    calculateNodeColor = (d) ->
      col = d3.rgb(color(d.x))
      col = col.brighter(d.y/400)
      return col

    sankey\
      .nodes(energy.nodes)\
      .links(energy.links)\
      .layout(32)
    link = svg\
      .append("g")\
      .selectAll(".link")\
      .data(energy.links)\
      .enter()\
      .append("path")\
      .attr("class", "link")\
      .attr("d", path)\
      .style("stroke-width", (d) -> Math.max 1, d.dy)
      .sort((a, b) -> b.dy - a.dy)
    link.append("title").text( (d) -> d.source.name + " → " + d.target.name + "\n" + format(d.value) )

    node = svg\
      .append("g")\
      .selectAll(".node")\
      .data(energy.nodes)\
      .enter()\
      .append("g")\
      .attr("class", "node")\
      .attr("transform", (d) -> "translate(" + d.x + "," + d.y + ")")\
      .call(\
         d3.behavior.drag().origin((d) -> d)\
        .on("dragstart", -> @parentNode.appendChild this)\
        .on("drag", dragmove)\
      )
    node\
      .append("rect")\
      .attr("height", (d) -> d.dy)\
      .attr("width", sankey.nodeWidth())\
      .style("fill", (d) -> d.color = color(d.name.replace(RegExp(" .*"), "")))\
      .style("fill", calculateNodeColor)\
      .style("stroke", (d) -> d3.rgb(d.color).darker 2)\
      .append("title").text((d) -> d.name + "\n" + format(d.value))
    calculateNodeName = (d) ->
      if d.name.length > 40
        return d.name.substr(0,40) + '...'
      d.name

    node\
      .append("text")\
      .attr("x", -6)\
      .attr("y", (d) -> d.dy / 2)\
      .attr("dy", ".35em")\
      .attr("text-anchor", "end")\
      .attr("transform", null)\
      .text(calculateNodeName)\
      .filter((d) -> d.x < width / 2)\
      .attr("x", 6 + sankey.nodeWidth())\
      .attr("text-anchor", "start")



# Demo Sankey diagram
# -------------------
renderSankeyDemo = ->
  margin =
    top: 1
    right: 1
    bottom: 6
    left: 1

  width = 960 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom
  formatNumber = d3.format(",.0f")
  format = (d) ->
    formatNumber(d) + " TWh"

  color  = d3.scale.category20()
  svg    = d3.select("#graph_sankey_demo").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height])
  path   = sankey.link()

  d3.json "data/energy.json", (energy) ->
    dragmove = (d) ->
      d3.select(this)\
        .attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")")
      sankey.relayout()
      link.attr "d", path
    sankey\
      .nodes(energy.nodes)\
      .links(energy.links)\
      .layout(32)
    link = svg\
      .append("g")\
      .selectAll(".link")\
      .data(energy.links)\
      .enter()\
      .append("path")\
      .attr("class", "link")\
      .attr("d", path)\
      .style("stroke-width", (d) -> Math.max 1, d.dy)
      .sort((a, b) -> b.dy - a.dy)
    link.append("title").text( (d) -> d.source.name + " → " + d.target.name + "\n" + format(d.value) )

    node = svg\
      .append("g")\
      .selectAll(".node")\
      .data(energy.nodes)\
      .enter()\
      .append("g")\
      .attr("class", "node")\
      .attr("transform", (d) -> "translate(" + d.x + "," + d.y + ")")\
      .call(\
         d3.behavior.drag().origin((d) -> d)\
        .on("dragstart", -> @parentNode.appendChild this)\
        .on("drag", dragmove)\
      )
    node\
      .append("rect")\
      .attr("height", (d) -> d.dy)\
      .attr("width", sankey.nodeWidth())\
      .style("fill", (d) -> d.color = color(d.name.replace(RegExp(" .*"), "")))\
      .style("stroke", (d) -> d3.rgb(d.color).darker 2)\
      .append("title").text((d) -> d.name + "\n" + format(d.value))

    node\
      .append("text")\
      .attr("x", -6)\
      .attr("y", (d) -> d.dy / 2)\
      .attr("dy", ".35em")\
      .attr("text-anchor", "end")\
      .attr("transform", null)\
      .text((d) -> d.name)\
      .filter((d) -> d.x < width / 2)\
      .attr("x", 6 + sankey.nodeWidth())\
      .attr("text-anchor", "start")



renderPieChart = ->
    width = 450
    height = 300
    radius = Math.min(width, height) / 2
    color = d3.scale.ordinal()\
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    color  = d3.scale.category20c()
    arc = d3.svg.arc()\
      .outerRadius(radius - 10)\
      .innerRadius(0)
    pie = d3.layout.pie()\
      .sort(null)\
      .value((d) -> d.value)

    d3.json "data/etl_pie1.json", (data) ->
      svg = d3.select("#graph_pie1")\
        .append("svg")\
        .attr("width", width)\
        .attr("height", height)\
        .append("g")\
        .attr("transform", "translate(140," + height / 2 + ")")

      g = svg.selectAll(".arc")\
        .data(pie(data))\
        .enter()\
        .append("g")\
        .attr("class", "arc")
      g.append("path")\
        .attr("d", arc)\
        .style("fill", (d) -> color d.data.name)

      legend = svg.selectAll(".legend")\
        .data(data)\
        .enter()\
        .append("g")\
        .attr("class", "legend")\
        .attr("transform", (d, i) -> "translate(-150," + (i*20 - 130) + ")")
      legend.append("rect")\
        .attr("x", width - 18)\
        .attr("width", 18)\
        .attr("height", 18)\
        .style("fill", (d)->color(d.name))\
        .style("stroke", (d) -> '#000')
      legend.append("text")\
        .attr("x", width - 24)\
        .attr("y", 9)\
        .attr("dy", ".35em")\
        .style("text-anchor", "end")\
        .text((d) -> trim(d.name,25))

      # g.append("text")\
      #   .attr("transform", (d) -> "translate(" + arc.centroid(d) + ")")\
      #   .attr("dy", ".35em")\
      #   .style("text-anchor", "middle")\
      #   .text((d) -> d.data.name)

renderPieChart2 = ->
    width = 450
    height = 300
    radius = Math.min(width, height) / 2
    color = d3.scale.ordinal()\
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    color  = d3.scale.category20b()
    known_colors = []
    color = (x) ->
      index = known_colors.indexOf(x)
      if index==-1
        known_colors.push x
        index = known_colors.indexOf(x)
      if x=='Loans and facilities - Unsecured'
        return d3.rgb('#74C476').brighter 1
      if x=='Loans and facilities - Partially secured'
        return d3.rgb('#74C476')
      return d3.rgb('#193B79').brighter(index/2)

    arc = d3.svg.arc()\
      .outerRadius(radius - 10)\
      .innerRadius(0)
    pie = d3.layout.pie()\
      .sort(null)\
      .value((d) -> d.value)

    d3.json "data/etl_pie2.json", (data) ->
      svg = d3.select("#graph_pie2")\
        .append("svg")\
        .attr("width", width)\
        .attr("height", height)\
        .append("g")\
        .attr("transform", "translate(140," + height / 2 + ")")

      g = svg.selectAll(".arc")\
        .data(pie(data))\
        .enter()\
        .append("g")\
        .attr("class", "arc")
      g.append("path")\
        .attr("d", arc)\
        .style("fill", (d) -> color d.data.name)

      legend = svg.selectAll(".legend")\
        .data(data)\
        .enter()\
        .append("g")\
        .attr("class", "legend")\
        .attr("transform", (d, i) -> "translate(-150," + (i*20 - 130) + ")")
      legend.append("rect")\
        .attr("x", width - 18)\
        .attr("width", 18)\
        .attr("height", 18)\
        .style("fill", (d)->color(d.name))\
        .style("stroke", (d) -> '#000')
      legend.append("text")\
        .attr("x", width - 24)\
        .attr("y", 9)\
        .attr("dy", ".35em")\
        .style("text-anchor", "end")\
        .text((d) -> d.name)

      # g.append("text")\
      #   .attr("transform", (d) -> "translate(" + arc.centroid(d) + ")")\
      #   .attr("dy", ".35em")\
      #   .style("text-anchor", "middle")\
      #   .text((d) -> d.data.name)

