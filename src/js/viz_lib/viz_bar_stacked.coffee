
window.viz ?= {}

viz.renderStackedBar = ->
  container = $('#graph_yearonyear')
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
    y.domain [0, d3.max(data.series, (d) -> d3.sum d.elements, (d) -> d.value )]
    # Populate data with offsets
    data.series.forEach (series) ->
      sumOfPrevious = 0
      series.elements.forEach (d) ->
        d.sumOfPrevious = sumOfPrevious
        sumOfPrevious += d.value
      series.sum = sumOfPrevious

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
    state.append('text')\
      .attr('x',30)\
      .attr('y',(d)->y(d.sum)-5)\
      .text((d)->'£'+viz.money_to_string(d.sum))
    state.selectAll("rect")\
      .data((d) -> d.elements)\
      .enter()\
      .append("rect")\
      .attr("class", (d) -> "hoverable hover-"+viz.text_to_css_class(d.name))\
      .attr("width", x0.rangeBand())\
      .attr("x", (d) -> x0(d.name))\
      .attr("y", (d) -> y(d.value+d.sumOfPrevious))\
      .attr("height", (d) -> height - y(d.value))\
      .style("fill", (d) -> viz.sector_color(d.name))\
      .attr('data-col1', (d)->viz.sector_color(d.name))\
      .attr('data-col2', (d)->d3.rgb(viz.sector_color(d.name)).brighter 0.3)

    ul = d3.select("#graph_yearonyear")\
      .append("ul")\
      .attr('class','legend')
    ul.selectAll('li')\
      .data(viz.sector_list)\
      .enter()\
      .append('li')\
      .attr("class", (d) -> "hoverable hover-"+viz.text_to_css_class(d))\
      .text( (d) -> viz.trim(d,34) )
      .append('div')\
      .attr('class','swatch')\
      .style('background-color', viz.sector_color)

    toggleColors = (e) ->
      classes = $(this).attr('class').split(' ')
      # get hover class name eg. hover-foo-bar
      for x in classes
        if x.substring(0,6)=='hover-'
          container.find('.'+x).each (i,el) ->
            el = $(el)
            if el.is('li')
              if e.type=="mouseover"
                el.addClass 'hovering'
              else
                el.removeClass 'hovering'
            else if el.is('rect')
              if e.type=="mouseover"
                el.css('fill',el.attr('data-col2') )
              else
                el.css('fill',el.attr('data-col1') )
    container.find('.hoverable').on 'mouseover', toggleColors
    container.find('.hoverable').on 'mouseout', toggleColors
