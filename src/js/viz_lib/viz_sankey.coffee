window.viz ?= {}

viz.renderSankey = ->
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
