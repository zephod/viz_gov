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

  viz.renderStackedBar = function(data) {
    var container, height, margin, state, svg, trim, width, x0, xAxis, y, yAxis;
    container = $('#graph_yearonyear');
    margin = {
      top: 20,
      right: 250,
      bottom: 30,
      left: 40
    };
    width = 920 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    y = d3.scale.linear().range([height, 0]);
    xAxis = d3.svg.axis().scale(x0).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
    svg = d3.select("#graph_yearonyear").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x0.domain(data.series.map(function(d) {
      return d.major;
    }));
    y.domain([
      0, d3.max(data.series, function(d) {
        return d3.sum(d.elements, function(d) {
          return d.value;
        });
      })
    ]);
    data.series.forEach(function(series) {
      var sumOfPrevious;
      sumOfPrevious = 0;
      series.elements.forEach(function(d) {
        d.sumOfPrevious = sumOfPrevious;
        return sumOfPrevious += d.value;
      });
      return series.sum = sumOfPrevious;
    });
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Cash Invested");
    state = svg.selectAll(".state").data(data.series).enter().append("g").attr("class", "g").attr("transform", function(d) {
      return "translate(" + x0(d.major) + ",0)";
    });
    state.append('text').attr('x', 30).attr('y', function(d) {
      return y(d.sum) - 5;
    }).text(function(d) {
      return '£' + viz.money_to_string(d.sum);
    });
    state.selectAll("rect").data(function(d) {
      return d.elements;
    }).enter().append("rect").attr("class", function(d) {
      return "hoverable hover-" + viz.text_to_css_class(d.name);
    }).attr("width", x0.rangeBand()).attr("x", function(d) {
      return x0(d.name);
    }).attr("y", function(d) {
      return y(d.value + d.sumOfPrevious);
    }).attr("height", function(d) {
      return height - y(d.value);
    }).style("fill", function(d) {
      return viz.sector_color(d.name);
    }).attr('data-col1', function(d) {
      return viz.sector_color(d.name);
    }).attr('data-col2', function(d) {
      return d3.rgb(viz.sector_color(d.name)).brighter(0.3);
    });
    return viz.legend(d3.select('#graph_yearonyear'), viz.sector_list, viz.sector_color, trim = 34);
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderBubbleChart = function(data, graphSelector, colorFunction) {
    var circle, height, margin, max_date, min_date, svg, width, x, xAxis, y, yAxis;
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };
    width = 760 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;
    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);
    xAxis = d3.svg.axis().scale(x).orient("bottom");
    yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
    svg = d3.select(graphSelector).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    min_date = d3.min(data.points, function(d) {
      return d.date;
    });
    max_date = d3.max(data.points, function(d) {
      return d.date;
    });
    x.domain([min_date, max_date]);
    y.domain([
      0, d3.max(data.points, function(d) {
        return d.y;
      })
    ]);
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("(£)   Coinvestment");
    circle = svg.selectAll(".circle").data(data.points).enter().append("circle").attr("r", function(d) {
      return d.radius;
    }).attr("transform", function(d) {
      var _x, _y;
      _x = x(d.date);
      _y = y(d.y);
      return 'translate(' + _x + ',' + _y + ')';
    }).attr('class', function(d) {
      return 'hoverable hover-' + viz.text_to_css_class(d.origin);
    }).style("fill", function(d) {
      return colorFunction(d.origin);
    }).attr("data-col1", function(d) {
      return colorFunction(d.origin);
    }).attr("data-col2", function(d) {
      return d3.rgb(colorFunction(d.origin)).brighter(.5);
    });
    return viz.legend(d3.select(graphSelector), data.legend, colorFunction);
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderPieChart = function(data, containerSelector, colorFunction, trimLegend, legendData) {
    var arc, caption, container, g, height, pie, radius, svg, width;
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
    height = 200;
    radius = Math.min(width, height) / 2;
    arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 50);
    pie = d3.layout.pie().sort(null).value(function(d) {
      return d.value;
    });
    container = $(containerSelector);
    caption = $('<div class="caption"/>').appendTo(container);
    svg = d3.select(containerSelector).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + (15 + radius) + "," + height / 2 + ")");
    g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
    g.append("path").attr("d", arc).style("fill", function(d) {
      return colorFunction(d.data.name);
    }).attr("class", function(d) {
      return "hoverable hover-" + viz.text_to_css_class(d.data.name);
    }).attr("data-col1", function(d) {
      return colorFunction(d.data.name);
    }).attr("data-col2", function(d) {
      return d3.rgb(colorFunction(d.data.name)).brighter(.5);
    }).attr('data-caption', function(d) {
      return '£' + viz.money_to_string(d.value);
    });
    legendData = data.map(function(d) {
      return d.name;
    });
    viz.legend(d3.select(containerSelector), legendData, colorFunction, trimLegend);
    container.find('path').bind('hoverend', function(e) {
      return caption.html('');
    });
    return container.find('path').bind('hoverstart', function(e) {
      return caption.html(this.getAttribute('data-caption'));
    });
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  viz.renderSankey = function(data) {
    var calculateNodeColor, calculateNodeName, color, dragmove, format, formatNumber, height, link, margin, node, path, sankey, svg, width;
    margin = {
      top: 1,
      right: 1,
      bottom: 6,
      left: 1
    };
    width = 900 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    formatNumber = d3.format(",.0f");
    format = function(x) {
      return '£' + viz.money_to_string(x);
    };
    color = d3.scale.category20c();
    svg = d3.select("#graph_sankey").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width, height]);
    path = sankey.link();
    dragmove = function(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      return link.attr("d", path);
    };
    calculateNodeColor = function(d) {
      var base_color, index, palette;
      index = Math.floor(d.x / 230);
      palette = ['#E81308', '#FF04A7', '#5109FF', '#1030FF'];
      base_color = d3.rgb(palette[index]).brighter(2);
      return base_color.darker(d.y / 400);
    };
    sankey.nodes(data.nodes).links(data.links).layout(32);
    link = svg.append("g").selectAll(".link").data(data.links).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function(d) {
      return Math.max(1, d.dy);
    }).sort(function(a, b) {
      return b.dy - a.dy;
    });
    link.append("title").text(function(d) {
      return '"' + d.source.name + "\" → \"" + d.target.name + "\"\n" + format(d.value);
    });
    node = svg.append("g").selectAll(".node").data(data.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
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
    }).style("fill", calculateNodeColor).append("title").style("stroke", function(d) {
      return d3.rgb(d.color).darker(2);
    }).text(function(d) {
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
  };

}).call(this);

(function() {
  if (window.viz == null) {
    window.viz = {};
  }

  $(function() {
    return d3.json("data/graphs.json", function(data) {
      var known_colors, pie2_color;
      data.pie1.forEach(function(x) {
        viz.sector_color(x.name);
        return viz.sector_list.push(x.name);
      });
      viz.renderSankey(data.sankey);
      viz.renderStackedBar(data.bar);
      $('#coinvestment-total').html('<span class="poundsign">£</span>' + viz.money_to_string(data.coinvestment_total));
      $('#investment-total').html('<span class="poundsign">£</span>' + viz.money_to_string(data.investment_total));
      data.bubble.points.forEach(function(d) {
        d.radius = Math.max(5, d.cash / 20000);
        d.y = d.coinvestment;
        return d.date = d3.time.format("%Y-%m-%d").parse(d.date);
      });
      viz.renderBubbleChart(data.bubble, '#graph_bubble', d3.scale.category10());
      viz.renderPieChart(data.pie1, '#graph_pie1', viz.sector_color, 32, viz.sector_list);
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
      viz.renderPieChart(data.pie2, '#graph_pie2', pie2_color);
      return $('.hoverable').on('mouseover', function(e) {
        var classes, elements, x, _i, _len, _results;
        $('li.hoverable').removeClass('hovering');
        $('svg .hoverable').each(function(i, el) {
          return $(el).css({
            'fill': $(el).attr('data-col1'),
            'stroke': 'none'
          });
        });
        $('.hoverable').trigger('hoverend');
        $('circle.hoverable').css('opacity', 0.5);
        classes = $(this).attr('class').split(' ');
        _results = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          x = classes[_i];
          if (x.substring(0, 6) === 'hover-') {
            elements = $('.' + x);
            elements.trigger('hoverstart');
            _results.push(elements.each(function(i, el) {
              el = $(el);
              if (el.is('li')) {
                if (e.type === "mouseover") {
                  return el.addClass('hovering');
                } else {
                  return el.removeClass('hovering');
                }
              } else if (el.is('rect') || el.is('path') || el.is('circle')) {
                if (e.type === "mouseover") {
                  el.css('fill', el.attr('data-col2'));
                  el.css('stroke', '#000');
                } else {
                  el.css('fill', el.attr('data-col1'));
                  el.css('stroke', 'none');
                }
                if (el.is('circle')) {
                  return el.css('opacity', 1);
                }
              }
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
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
    return amount + out;
  };

  viz.sector_color = d3.scale.category20c();

  viz.sector_list = [];

  viz.text_to_css_class = function(x) {
    return x.toLowerCase().replace(/[ ]/g, '-').replace(/[^a-z-]/g, '');
  };

  viz.legend = function(container, elements, colorFunction, trim) {
    var ul;
    if (trim == null) {
      trim = -1;
    }
    ul = container.append("ul").attr('class', 'legend');
    return ul.selectAll('li').data(elements).enter().append('li').attr("class", function(d) {
      return "hoverable hover-" + viz.text_to_css_class(d);
    }).text(function(d) {
      return viz.trim(d, trim);
    }).append('div').attr('class', 'swatch').style('background-color', colorFunction);
  };

}).call(this);
