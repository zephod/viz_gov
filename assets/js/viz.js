(function() {
  var money_to_string, renderBarDemo, renderGroupedBar, renderPieChart, renderPieChart2, renderSankey, renderSankeyDemo, renderStackedBar, rnd, rnd_col, rnd_list, trim;

  $(function() {
    renderSankey();
    renderStackedBar();
    renderPieChart();
    return renderPieChart2();
  });

  rnd = function(range) {
    return Math.floor(Math.random() * range);
  };

  rnd_list = function(len) {
    var x, _i, _results;
    _results = [];
    for (x = _i = 1; 1 <= len ? _i <= len : _i >= len; x = 1 <= len ? ++_i : --_i) {
      _results.push(rnd(5) + 1);
    }
    return _results;
  };

  rnd_col = function() {
    return 'rgb(' + rnd(255) + ',' + rnd(255) + ',' + rnd(255) + ')';
  };

  trim = function(x, maxlen) {
    if (x.length > maxlen) {
      return x.substr(0, maxlen) + '...';
    }
    return x;
  };

  money_to_string = function(amount) {
    var out;
    out = '';
    amount = String(amount);
    while (amount.length > 3) {
      out = ',' + amount.substring(amount.length - 3) + out;
      amount = amount.substring(0, amount.length - 3);
    }
    return "<span class=\"poundsign\">£</span>" + amount + out;
  };

  renderStackedBar = function() {
    var color, height, margin, svg, width, x0, xAxis, y, yAxis;
    d3.json('data/etl_coinvestment.json', function(data) {
      return $('#coinvestment-total').html(money_to_string(data.total));
    });
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
        return trim(d, 35);
      });
    });
  };

  renderGroupedBar = function() {
    var color, height, margin, svg, width, x0, x1, xAxis, y, yAxis;
    d3.json('data/etl_coinvestment.json', function(data) {
      return $('#coinvestment-total').html(money_to_string(data.total));
    });
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

  renderBarDemo = function() {
    var chart, rects;
    chart = d3.select('#graph_demo').append('svg').attr('height', 210);
    rects = chart.selectAll('rect').data(rnd_list(8)).enter().append('rect').attr('x', 0).attr('y', function(d, i) {
      return 10 + i * 25;
    }).attr('width', function(d, i) {
      return d * 40;
    }).attr('height', 20).attr('stroke', null).attr('fill', rnd_col());
    return rects.on('click', function() {
      var newData, x;
      newData = (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 1; _i <= 8; x = ++_i) {
          _results.push(rnd(5) + 1);
        }
        return _results;
      })();
      return rects.data(newData).transition().delay(200).duration(2000).attr('width', function(d, i) {
        return d * 20;
      }).attr('fill', rnd_col());
    });
  };

  renderSankey = function() {
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

  renderSankeyDemo = function() {
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
    color = d3.scale.category20();
    svg = d3.select("#graph_sankey_demo").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height]);
    path = sankey.link();
    return d3.json("data/energy.json", function(energy) {
      var dragmove, link, node;
      dragmove = function(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        return link.attr("d", path);
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
      }).style("stroke", function(d) {
        return d3.rgb(d.color).darker(2);
      }).append("title").text(function(d) {
        return d.name + "\n" + format(d.value);
      });
      return node.append("text").attr("x", -6).attr("y", function(d) {
        return d.dy / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function(d) {
        return d.name;
      }).filter(function(d) {
        return d.x < width / 2;
      }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");
    });
  };

  renderPieChart = function() {
    var arc, color, height, pie, radius, width;
    width = 450;
    height = 300;
    radius = Math.min(width, height) / 2;
    color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    color = d3.scale.category20c();
    arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
    pie = d3.layout.pie().sort(null).value(function(d) {
      return d.value;
    });
    return d3.json("data/etl_pie1.json", function(data) {
      var g, legend, svg;
      svg = d3.select("#graph_pie1").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(140," + height / 2 + ")");
      g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
      g.append("path").attr("d", arc).style("fill", function(d) {
        return color(d.data.name);
      });
      legend = svg.selectAll(".legend").data(data).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(-150," + (i * 20 - 130) + ")";
      });
      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function(d) {
        return color(d.name);
      }).style("stroke", function(d) {
        return '#000';
      });
      return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return trim(d.name, 25);
      });
    });
  };

  renderPieChart2 = function() {
    var arc, color, height, known_colors, pie, radius, width;
    width = 450;
    height = 300;
    radius = Math.min(width, height) / 2;
    color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    color = d3.scale.category20b();
    known_colors = [];
    color = function(x) {
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
    arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
    pie = d3.layout.pie().sort(null).value(function(d) {
      return d.value;
    });
    return d3.json("data/etl_pie2.json", function(data) {
      var g, legend, svg;
      svg = d3.select("#graph_pie2").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(140," + height / 2 + ")");
      g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
      g.append("path").attr("d", arc).style("fill", function(d) {
        return color(d.data.name);
      });
      legend = svg.selectAll(".legend").data(data).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(-150," + (i * 20 - 130) + ")";
      });
      legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function(d) {
        return color(d.name);
      }).style("stroke", function(d) {
        return '#000';
      });
      return legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return d.name;
      });
    });
  };

}).call(this);
