(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderGroupedBar = function() {
    var color, height, margin, svg, width, x0, x1, xAxis, y, yAxis;
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    x1 = d3.scale.ordinal();
    y = d3.scale.linear().range([height, 0]);
    color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    xAxis = d3.svg.axis().scale(x0).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
    svg = d3.select("#graph_coinvestment").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return d3.json("data/etl_coinvestment.json", function(data) {
      var legend, state;
      x0.domain(data.series.map(function(d) {
        return d.major;
      }));
      x1.domain(data.legend).rangeRoundBands([0, x0.rangeBand()]);
      y.domain([
        0, d3.max(data.series, function(d) {
          return d3.max(d.ages, function(d) {
            return d.value;
          });
        })
      ]);
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Population");
      state = svg.selectAll(".state").data(data.series).enter().append("g").attr("class", "g").attr("transform", function(d) {
        return "translate(" + x0(d.major) + ",0)";
      });
      state.selectAll("rect").data(function(d) {
        return d.ages;
      }).enter().append("rect").attr("width", x1.rangeBand()).attr("x", function(d) {
        return x1(d.name);
      }).attr("y", function(d) {
        return y(d.value);
      }).attr("height", function(d) {
        return height - y(d.value);
      }).style("fill", function(d) {
        return color(d.name);
      });
      legend = svg.selectAll(".legend").data(data.legend.slice().reverse()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });
      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);
      return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return d;
      });
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderStackedBar = function() {
    var height, margin, svg, width, x0, xAxis, y, yAxis;
    margin = {
      top: 20,
      right: 250,
      bottom: 30,
      left: 40
    };
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    y = d3.scale.linear().range([height, 0]);
    xAxis = d3.svg.axis().scale(x0).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
    svg = d3.select("#graph_yearonyear").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return d3.json("data/etl_yearonyear.json", function(data) {
      var legend, state;
      x0.domain(data.series.map(function(d) {
        return d.major;
      }));
      y.domain([
        0, d3.max(data.series, function(d) {
          return d3.sum(d.ages, function(d) {
            return d.value;
          });
        })
      ]);
      data.series.forEach(function(series) {
        var sumOfPrevious;
        sumOfPrevious = 0;
        return series.ages.forEach(function(d) {
          d.sumOfPrevious = sumOfPrevious;
          return sumOfPrevious += d.value;
        });
      });
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Cash Invested");
      state = svg.selectAll(".state").data(data.series).enter().append("g").attr("class", "g").attr("transform", function(d) {
        return "translate(" + x0(d.major) + ",0)";
      });
      state.selectAll("rect").data(function(d) {
        return d.ages;
      }).enter().append("rect").attr("width", x0.rangeBand()).attr("x", function(d) {
        return x0(d.name);
      }).attr("y", function(d) {
        return y(d.value + d.sumOfPrevious);
      }).attr("height", function(d) {
        return height - y(d.value);
      }).style("fill", function(d) {
        return viz.sector_color(d.name);
      });
      legend = svg.selectAll(".legend").data(viz.sector_list).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(230," + i * 20 + ")";
      });
      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", viz.sector_color).style("stroke", function(d) {
        return '#000';
      });
      return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return viz.trim(d, 35);
      });
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderBubbleChart = function() {
    var color, height, margin, svg, width, x0, xAxis, y, yAxis;
    margin = {
      top: 20,
      right: 250,
      bottom: 30,
      left: 40
    };
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    y = d3.scale.linear().range([height, 0]);
    color = d3.scale.category20c();
    xAxis = d3.svg.axis().scale(x0).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
    svg = d3.select("#graph_yearonyear").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return d3.json("data/etl_coinvestment.json", function(data) {
      var legend, state;
      $('#coinvestment-total').html(viz.money_to_string(data.total));
      return;
      data.legend.forEach(function(x) {
        return color(x);
      });
      x0.domain(data.series.map(function(d) {
        return d.major;
      }));
      y.domain([
        0, d3.max(data.series, function(d) {
          return d3.sum(d.ages, function(d) {
            return d.value;
          });
        })
      ]);
      data.series.forEach(function(series) {
        var sumOfPrevious;
        sumOfPrevious = 0;
        return series.ages.forEach(function(d) {
          d.sumOfPrevious = sumOfPrevious;
          return sumOfPrevious += d.value;
        });
      });
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Cash Invested");
      state = svg.selectAll(".state").data(data.series).enter().append("g").attr("class", "g").attr("transform", function(d) {
        return "translate(" + x0(d.major) + ",0)";
      });
      state.selectAll("rect").data(function(d) {
        return d.ages;
      }).enter().append("rect").attr("width", x0.rangeBand()).attr("x", function(d) {
        return x0(d.name);
      }).attr("y", function(d) {
        return y(d.value + d.sumOfPrevious);
      }).attr("height", function(d) {
        return height - y(d.value);
      }).style("fill", function(d) {
        return color(d.name);
      });
      legend = svg.selectAll(".legend").data(data.legend.slice().reverse()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(230," + i * 20 + ")";
      });
      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color).style("stroke", function(d) {
        return '#000';
      });
      return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return viz.trim(d, 35);
      });
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderPieChart = function(data, containerSelector, colorFunction, trimLegend, legendData) {
    var arc, g, height, legend, pie, radius, svg, width;
    if (trimLegend == null) {
      trimLegend = -1;
    }
    if (legendData == null) {
      legendData = null;
    }
    if (legendData == null) {
      legendData = data.map(function(x) {
        return x.name;
      });
    }
    width = 450;
    height = 300;
    radius = Math.min(width, height) / 2;
    arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
    pie = d3.layout.pie().sort(null).value(function(d) {
      return d.value;
    });
    svg = d3.select(containerSelector).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + radius + "," + height / 2 + ")");
    g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
    g.append("path").attr("d", arc).style("fill", function(d) {
      return colorFunction(d.data.name);
    });
    legend = svg.selectAll(".legend").data(data).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
      return "translate(-150," + (i * 20 - 130) + ")";
    });
    legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function(d) {
      return colorFunction(d.name);
    }).style("stroke", function(d) {
      return '#000';
    });
    return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
      return viz.trim(d.name, trimLegend);
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderSankey = function() {
    var color, format, formatNumber, height, margin, path, sankey, svg, width;
    margin = {
      top: 1,
      right: 1,
      bottom: 6,
      left: 1
    };
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    formatNumber = d3.format(",.0f");
    format = function(d) {
      return formatNumber(d) + " TWh";
    };
    color = d3.scale.category20c();
    svg = d3.select("#graph_sankey").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height]);
    path = sankey.link();
    return d3.json("data/etl_sankey.json", function(energy) {
      var calculateNodeColor, calculateNodeName, dragmove, link, node;
      dragmove = function(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        return link.attr("d", path);
      };
      calculateNodeColor = function(d) {
        var col;
        col = d3.rgb(color(d.x));
        col = col.brighter(d.y / 400);
        return col;
      };
      sankey.nodes(energy.nodes).links(energy.links).layout(32);
      link = svg.append("g").selectAll(".link").data(energy.links).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function(d) {
        return Math.max(1, d.dy);
      }).sort(function(a, b) {
        return b.dy - a.dy;
      });
      link.append("title").text(function(d) {
        return d.source.name + " → " + d.target.name + "\n" + format(d.value);
      });
      node = svg.append("g").selectAll(".node").data(energy.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }).call(d3.behavior.drag().origin(function(d) {
        return d;
      }).on("dragstart", function() {
        return this.parentNode.appendChild(this);
      }).on("drag", dragmove));
      node.append("rect").attr("height", function(d) {
        return d.dy;
      }).attr("width", sankey.nodeWidth()).style("fill", function(d) {
        return d.color = color(d.name.replace(RegExp(" .*"), ""));
      }).style("fill", calculateNodeColor).style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      }).append("title").text(function(d) {
        return d.name + "\n" + format(d.value);
      });
      calculateNodeName = function(d) {
        if (d.name.length > 40) {
          return d.name.substr(0, 40) + '...';
        }
        return d.name;
      };
      return node.append("text").attr("x", -6).attr("y", function(d) {
        return d.dy / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(calculateNodeName).filter(function(d) {
        return d.x < width / 2;
      }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  $(function() {
    d3.json("data/etl_pie1.json", function(data) {
      data.forEach(function(x) {
        viz.sector_color(x.name);
        return viz.sector_list.push(x.name);
      });
      viz.renderSankey();
      return viz.renderStackedBar();
    });
    d3.json("data/etl_pie1.json", function(data) {
      return viz.renderPieChart(data, '#graph_pie1', viz.sector_color, 25, viz.sector_list);
    });
    return d3.json("data/etl_pie2.json", function(data) {
      var known_colors, pie2_color;
      known_colors = [];
      pie2_color = function(x) {
        var index;
        index = known_colors.indexOf(x);
        if (index === -1) {
          known_colors.push(x);
          index = known_colors.indexOf(x);
        }
        if (x === 'Loans and facilities - Unsecured') {
          return d3.rgb('#74C476').brighter(1);
        }
        if (x === 'Loans and facilities - Partially secured') {
          return d3.rgb('#74C476');
        }
        return d3.rgb('#193B79').brighter(index / 2);
      };
      return viz.renderPieChart(data, '#graph_pie2', pie2_color);
    });
  });

  viz.trim = function(x, maxlen) {
    if ((maxlen >= 0) && (x.length > maxlen)) {
      return x.substr(0, maxlen) + '...';
    }
    return x;
  };

  viz.money_to_string = function(amount) {
    var out;
    out = '';
    amount = String(amount);
    while (amount.length > 3) {
      out = ',' + amount.substring(amount.length - 3) + out;
      amount = amount.substring(0, amount.length - 3);
    }
    return "<span class=\"poundsign\">£</span>" + amount + out;
  };

  viz.sector_color = d3.scale.category20c();

  viz.sector_list = [];

}).call(this);
