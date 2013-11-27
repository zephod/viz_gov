window.viz ?= {}

# Document.onload()
# -----------------
$ ->
  d3.json "data/etl_pie1.json", (data) ->
    # Initialise sector colors
    data.forEach (x) -> 
      viz.sector_color x.name
      viz.sector_list.push x.name
    # Render all graphs
    viz.renderSankey()
    viz.renderStackedBar()
    #viz.renderBubbleChart()

  d3.json "data/etl_pie1.json", (data) ->
    viz.renderPieChart(data,'#graph_pie1',viz.sector_color,25,viz.sector_list)
  d3.json "data/etl_pie2.json", (data) ->
    known_colors = []
    pie2_color = (x) ->
        index = known_colors.indexOf(x)
        if index==-1
          known_colors.push x
          index = known_colors.indexOf(x)
        if x=='Loans and facilities - Unsecured'
          return d3.rgb('#74C476').brighter 1
        if x=='Loans and facilities - Partially secured'
          return d3.rgb('#74C476')
        return d3.rgb('#193B79').brighter(index/2)
    viz.renderPieChart(data,'#graph_pie2',pie2_color)

# Util
# ----
viz.trim = (x,maxlen) ->
  if (maxlen>=0) and (x.length>maxlen)
    return x.substr(0,maxlen) + '...'
  return x
viz.money_to_string = (amount) ->
  out = ''
  amount = String(amount)
  while amount.length>3
    out = ',' + amount.substring(amount.length-3) + out
    amount = amount.substring(0,amount.length-3)
  return "<span class=\"poundsign\">£</span>" + amount + out
viz.sector_color = d3.scale.category20c()
viz.sector_list = []

