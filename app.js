var nislider = document.getElementById("nislider");
var nielement = document.getElementById("nielement");
nielement.innerHTML = nislider.value;
var nsslider = document.getElementById("nsslider");
var nselement = document.getElementById("nselement");
nselement.innerHTML = nsslider.value;
var eslider = document.getElementById("eslider");
var eelement = document.getElementById("eelement");
eelement.innerHTML = eslider.value;
var sslider = document.getElementById("sslider");
var selement = document.getElementById("selement");
selement.innerHTML = sslider.value;
var i1slider = document.getElementById("i1slider");
var i1element = document.getElementById("i1element");
i1element.innerHTML =i1slider.value;
var i2slider = document.getElementById("i2slider");
var i2element = document.getElementById("i2element");
i2element.innerHTML =i2slider.value;
nislider.oninput = function() {
  nielement.innerHTML = this.value;
}
nislider.onchange = replot_itmes
nsslider.oninput = function() {
  nselement.innerHTML = this.value;
}
nsslider.onchange = replot_subjs

eslider.oninput = function() {
  eelement.innerHTML = this.value;
}
eslider.onchange = replot_is
sslider.oninput = function() {
  selement.innerHTML = this.value;
}
sslider.onchange = replot_subjs

i1slider.oninput = function() {
  i1element.innerHTML = this.value;
}
i1slider.onchange = replot_itmes

i2slider.oninput = function() {
  i2element.innerHTML = this.value;
}
i2slider.onchange = replot_itmes

function gen_range(minVal, maxVal, nVals){
    var vals = [...Array(nVals).keys()];
    for (var i = 0; i < vals.length; i++) {
        vals[i] = (vals[i]/((vals.length -1)) * (maxVal-minVal)) + minVal;
        };
    return vals
    };

function gen_norm_plot_data(vals, mean, stdDev){
    data = []
    for (var i = 0; i < vals.length; i++) {
        norm_val = Math.exp((-0.5) * Math.pow((vals[i] - mean) / stdDev, 2))/Math.sqrt(2 * Math.PI * stdDev);
        data.push({x: vals[i],
                   y: norm_val})
        }
    return data
    };

function make_items(items, n, mean, stdDev){
  //inflate new items
  for (var i = 0; i < n; i++) {
    x = rnd() * stdDev + mean
    items[i] = [{x:x,y:0}, {x:x,y:0.00001}]
  }
  //deflate old items
  for (var i = n; i < items.length; i++) {
    items[i] = [{x:x,y:0}, {x:x,y:0}]
  }
  return items
}

function rnd() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3);
}

function draw(n, mean, stddev) {
    var draws = Array(n);
    for (var i = 0; i < n; i++) {
        draws[i] = rnd() * stddev + mean;
    }
  return draws
}

var item_lines = lines()
              .$el(d3.select("#itemline"))
              .height(100) // Set height
              .data1(get_data(0,
                             parseFloat(i1slider.value))) // Set data for line 1
              .data2(get_data(parseFloat(eslider.value),
                              parseFloat(i2slider.value))) // Set data for line 2
              .es(parseFloat(eslider.value))
              .ni(parseInt(nislider.value))
              .i1(parseFloat(i1slider.value))
              .i2(parseFloat(i2slider.value))
              .render();

function sim_data(){
  var re_item1 = [];
  var re_item2 = [];
  var re_subj_slope = [];
  var re_subj_b = [];
  var data = [];
  var object = {};
  var ni = 0;
  var ns = 0;
  var es = parseFloat(eslider.value);

  var object = {};
  object.simulate = function(){
    console.log("start simulating")
    if (ns > 0 && ni > 0) {
      console.log("simulating")
      k = 0
      for (var s = 0; s < ns; s++) {
        re_sm = re_subj_slope[s]
        re_sb = re_subj_slope[b]
        for (var i = 0; s < (2*ni); i++) {
          if (i >= ni) {
            x = 0
            re_i = re_item2[i]
          } else{
            x = 1
            re_i = re_item1[i]
          }
          epsilon = rnd()
          ysi = (re_sm) * x + re_sb + re_si + epsilon
          data.push({
            y: ysi,
            x: x,
            s: s,
            i: i
          });
        };
      }; 
    };
  return object;
  };

  // Getter and setter methods
  object.re_item1 = function(value){
    if (!arguments.length) return re_item1;
    re_item1 = value;
    return object;
  };
  object.re_item2 = function(value){
    if (!arguments.length) return re_item2;
    re_item2 = value;
    return object;
  };
  object.re_subj_slope = function(value){
    if (!arguments.length) return re_subj_slope;
    re_subj_slope = value;
    return object;
  };
  object.re_subj_b = function(value){
    if (!arguments.length) return re_subj_b;
    re_subj_b = value;
    return object;
  };
  object.data = function(value){
    if (!arguments.length) return data;
    data = value;
    return object;
  };
  object.ni = function(value){
    if (!arguments.length) return parseInt(nislider.value);
    ni = parseInt(nislider.value);
    return object;
  };
  object.ns = function(value){
    if (!arguments.length) return parseFloat(nsslider.value);
    ns = parseFloat(nsslider.value);
    return object;
  };
  object.es = function(value){
    if (!arguments.length) return parseFloat(eslider.value);
    es = parseFloat(eslider.value);
    return object;
  };
  return object;
};

var simmed = sim_data()
               .re_item1(item_lines.items1)
               .re_item2(item_lines.items2)

var slines = subj_lines()
              .data1(get_data(
                             parseFloat(eslider.value),
                             parseFloat(sslider.value))) // Set data for line 2
              .es(parseFloat(eslider.value))
              .ns(parseInt(nsslider.value))
              .s(parseFloat(sslider.value))
              .render()

function replot_itmes(){
  item_lines
      .data1(get_data(0,
                       parseFloat(i1slider.value))) // Set data for line 1
        .data2(get_data(
                       parseFloat(eslider.value),
                       parseFloat(i2slider.value))) // Set data for line 2
        .es(parseFloat(eslider.value))
        .ni(parseInt(nislider.value))
        .i1(parseFloat(i1slider.value))
        .i2(parseFloat(i2slider.value))
        .render()
  simmed.re_item1(item_lines.items1())
  simmed.re_item2(item_lines.items2())
};

function replot_is(){
  replot_itmes();
  replot_subjs();
}

function replot_subjs(){
  slines
        .data1(get_data(
                       parseFloat(eslider.value),
                       parseFloat(sslider.value))) // Set data for line 2
        .es(parseFloat(eslider.value))
        .ns(parseInt(nsslider.value))
        .s(parseFloat(sslider.value))
        .render()
  simmed.re_subj_slope(slines.subj_slope_re())
  simmed.re_subj_b(slines.subj_b_re())
};

function get_data(fixed, item_re){
    var use_pxs = gen_range((-4 * item_re )+fixed,(4 * item_re) + fixed,10000);
    item_pd = gen_norm_plot_data(use_pxs, fixed, item_re);
    return item_pd
};

function subj_lines(){
  // Default settings
  var $el = d3.select("#subjline")
  var width = document.getElementsByClassName("chartarea")[0].clientWidth * 0.8; //400;
  var height = 100;
  var color1 = "#2c6bd2";
  var margin = {top: 10, right: 30, bottom: 40, left: 50};
  var data1 = [];
  var svg, y, xAxis, yAxis, line;
  var x = d3.scaleLinear().range([0, width]);
  var subj_slope_re = []
  for (var i = 0; i < 100; i++) {
    subj_slope_re.push(0);
    };
  var subj_b_re = subj_slope_re.slice()

  var object = {};

  // Method for render/refresh graph
  object.render = function(){
    if(!svg){
      // Render first time
      y = d3.scaleLinear()
      .range([height, 0]);

      xAxis = d3.axisBottom()
      .scale(x);

      yAxis = d3.axisLeft()
        .scale(y);

      line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveBasis);

      svg = $el.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", 'chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      x.domain([d3.min(data1, function(d) { return d.x; }),
                   d3.max(data1, function(d) { return d.x; })
                ]);
      ymax = d3.max(data1, function(d) { return d.y; });
      y.domain([0, ymax]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      //x axis label
      svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Effect");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Density");

      svg.append("path")
        .datum(data1)
        .attr("class", "line1")
        .attr("stroke", color1)
        .attr("fill", color1)
        .attr("fill-opacity", 0.5)
        .attr("d", line);

      // Create item elements on chart instanstiation
      for (var i = 0; i < subj_slope_re.length; i++) {
        svg.append("path")
        .datum([{x:0, y:0}, {x:0, y:0}])
        .attr("class", "subjline1_" + String(i))
        .attr("stroke", "#2171b5")
        .attr("stroke-width", 5)
        .attr("d", line);
        }
    }else{ //Refresh
      object.data1(data1);
      object.es(es);
      object.ns(ns);
      object.s(s);
      x.domain([d3.min(data1, function(d) { return d.x; }),
                   d3.max(data1, function(d) { return d.x; })
                ]);
      ymax = d3.max(data1, function(d) { return d.y; });
      y.domain([0, ymax]);

      svg.select("g.y")
        .transition()
        .duration(1000)
        .call(yAxis);

      svg.select("g.x")
        .transition()
        .duration(1000)
        .call(xAxis);

      svg.selectAll("path.line1")
       .datum(data1)
        .transition()
        .duration(1000)
       .attr("d", line);

      // shrink all the existing items
      for (var i = 0; i < subj_slope_re.length; i++) {
        svg.selectAll("path.subjline1_" + String(i))
        .datum([{x:subj_slope_re[i], y:0},
                {x:subj_slope_re[i], y:0}])
        .transition()
        .duration(500)
        .attr("d", line);
      }

      // Move all the items
      for (var i = 0; i < subj_slope_re.length; i++) {
        if (i < ns) {
          subj_slope_re[i] = rnd() * s + es;
          subj_b_re[i] = rnd() * s;
        } else {
          subj_slope_re[i] = 0;
          subj_b_re[i] = 0;
        }
        svg.selectAll("path.subjline1_" + String(i))
        .datum([{x:subj_slope_re[i], y:0},
                {x:subj_slope_re[i], y:0}])
        .attr("d", line);
      }

      // Grow the items
      for (var i = 0; i < subj_slope_re.length; i++) {
        if (i < ns) {
          svg.selectAll("path.subjline1_" + String(i))
          .datum([{x:subj_slope_re[i], y:0 - (ymax / 20)},
                  {x:subj_slope_re[i], y:(ymax / 4)}])
        .transition()
        .duration(500)
        .attr("d", line);
        }
      }

    }
    return object;
  };

  // Getter and setter methods
  object.data1 = function(value){
    if (!arguments.length) return data1;
    data1 = value;
    return object;
  };
  object.subj_slope_re = function(value){
    if (!arguments.length) return subj_slope_re;
    subj_slope_re = value;
    return object;
  };
  object.subj_b_re = function(value){
    if (!arguments.length) return subj_b_re;
    subj_b_re = value;
    return object;
  };
  object.ns = function(value){
    if (!arguments.length) return ns;
    ns = value;
    return object;
  };
  object.s = function(value){
    if (!arguments.length) return s;
    s = value;
    return object;
  };
  object.es = function(value){
    if (!arguments.length) return es;
    es = value;
    return object;
  };

  object.$el = function(value){
    if (!arguments.length) return $el;
    $el = value;
    return object;
  };

  object.width = function(value){
    if (!arguments.length) return width;
    width = value;
    return object;
  };

  object.height = function(value){
    if (!arguments.length) return height;
    height = value;
    return object;
  };

  object.color = function(value){
    if (!arguments.length) return color;
    color = value;
    return object;
  };
  object.x = function(value){
    if (!arguments.length) return x;
    x = value;
    return object;
  }
  return object;
};

function lines(){
  // Default settings
  var $el = d3.select("#item_chart")
  var width = document.getElementsByClassName("chartarea")[0].clientWidth * 0.8; //400;
  var height = 800;
  var color1 = "#2c6bd2";
  var color2 = "#4c8d24";
  var margin = {top: 10, right: 30, bottom: 40, left: 50};
  var data1 = [];
  var data2 = [];
  var svg, y, xAxis, yAxis, line;
  var x = d3.scaleLinear().range([0, width]);
  var items1 = []
  for (var i = 0; i < 100; i++) {
    items1.push(0);
    };
  var items2 = items1.slice()

  var object = {};

  // Method for render/refresh graph
  object.render = function(){
    if(!svg){
      // Render first time
      y = d3.scaleLinear()
      .range([height, 0]);

      xAxis = d3.axisBottom()
      .scale(x);

      yAxis = d3.axisLeft()
        .scale(y);

      line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveBasis);

      svg = $el.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", 'chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      x.domain([d3.min(
                  [d3.min(data1, function(d) { return d.x; }),
                   d3.min(data2, function(d) { return d.x; })]
                  ),
                d3.max(
                  [d3.max(data1, function(d) { return d.x; }),
                   d3.max(data2, function(d) { return d.x; })])
                ]);
      ymax = d3.max(
                  [d3.max(data1, function(d) { return d.y; }),
                   d3.max(data2, function(d) { return d.y; })]);
      y.domain([0, ymax]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      //x axis label
      svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Normalized Response");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Density");

      svg.append("path")
        .datum(data1)
        .attr("class", "line1")
        .attr("stroke", color1)
        .attr("fill", color1)
        .attr("fill-opacity", 0.5)
        .attr("d", line);

      svg.append("path")
        .datum(data2)
        .attr("class", "line2")
        .attr("stroke", color2)
        .attr("fill", color2)
        .attr("fill-opacity", 0.5)
        .attr("d", line);
      // Create item elements on chart instanstiation
      for (var i = 0; i < items1.length; i++) {
        svg.append("path")
        .datum([{x:0, y:0}, {x:0, y:0}])
        .attr("class", "itemline1_" + String(i))
        .attr("stroke", "#2171b5")
        .attr("stroke-width", 5)
        .attr("d", line);
        }
      for (var i = 0; i < items2.length; i++) {
        svg.append("path")
        .datum([{x:0, y:0}, {x:0, y:0}])
        .attr("class", "itemline2_" + String(i))
        .attr("stroke", "#238b45")
        .attr("stroke-width", 3)
        .attr("d", line);
        }
    }else{ //Refresh
      object.data1(data1);
      object.data2(data2);
      object.es(es);
      object.ni(ni);
      object.i1(i1);
      object.i2(i2);
      x.domain([d3.min(
                  [d3.min(data1, function(d) { return d.x; }),
                   d3.min(data2, function(d) { return d.x; })]
                  ),
                d3.max(
                  [d3.max(data1, function(d) { return d.x; }),
                   d3.max(data2, function(d) { return d.x; })])
                ]);
      ymax = d3.max(
                  [d3.max(data1, function(d) { return d.y; }),
                   d3.max(data2, function(d) { return d.y; })]);
      y.domain([0, ymax]);

      svg.select("g.y")
        .transition()
        .duration(1000)
        .call(yAxis);

      svg.select("g.x")
        .transition()
        .duration(1000)
        .call(xAxis);

      svg.selectAll("path.line1")
       .datum(data1)
        .transition()
        .duration(1000)
       .attr("d", line);

      svg.selectAll("path.line2")
       .datum(data2)
        .transition()
        .duration(1000)
       .attr("d", line);
      // shrink all the existing items
      for (var i = 0; i < items1.length; i++) {
        svg.selectAll("path.itemline1_" + String(i))
        .datum([{x:items1[i], y:0},
                {x:items1[i], y:0}])
        .transition()
        .duration(500)
        .attr("d", line);
      }
      for (var i = 0; i < items2.length; i++) {
        svg.selectAll("path.itemline2_" + String(i))
        .datum([{x:items2[i], y:0},
                {x:items2[i], y:0}])
        .transition()
        .duration(500)
        .attr("d", line);
      }

      // Move all the items
      for (var i = 0; i < items1.length; i++) {
        if (i < ni) {
          items1[i] = rnd() * i1;
        } else {
          items1[i] = 0
        }
        svg.selectAll("path.itemline1_" + String(i))
        .datum([{x:items1[i], y:0},
                {x:items1[i], y:0}])
        .attr("d", line);
      }
      for (var i = 0; i < items2.length; i++) {
        if (i < ni) {
          items2[i] = rnd() * i2 + es;
        } else {
          items2[i] = 0
        }
        svg.selectAll("path.itemline2_" + String(i))
        .datum([{x:items2[i], y:0},
                {x:items2[i], y:0}])
        .attr("d", line);
      }

      // Grow the items
      for (var i = 0; i < items1.length; i++) {
        if (i < ni) {
          svg.selectAll("path.itemline1_" + String(i))
          .datum([{x:items1[i], y:0 - (ymax / 20)},
                  {x:items1[i], y:(ymax / 4)}])
        .transition()
        .duration(500)
        .attr("d", line);
        }
      }
      for (var i = 0; i < items2.length; i++) {
        if (i < ni) {
          svg.selectAll("path.itemline2_" + String(i))
          .datum([{x:items2[i], y:0 - (ymax / 20)},
                  {x:items2[i], y:(ymax / 4)}])
        .transition()
        .duration(500)
        .attr("d", line);
        }
      }

    }
    return object;
  };

  // Getter and setter methods
  object.data1 = function(value){
    if (!arguments.length) return data1;
    data1 = value;
    return object;
  };
  object.data2 = function(value){
    if (!arguments.length) return data2;
    data2 = value;
    return object;
  };
  object.items1 = function(value){
    if (!arguments.length) return items1;
    items1 = value;
    return object;
  };
  object.items2 = function(value){
    if (!arguments.length) return items2;
    items2 = value;
    return object;
  };
  object.ni = function(value){
    if (!arguments.length) return ni;
    ni = value;
    return object;
  };
  object.es = function(value){
    if (!arguments.length) return es;
    es = value;
    return object;
  };
  object.i1 = function(value){
    if (!arguments.length) return i1;
    i1 = value;
    return object;
  };
  object.i2 = function(value){
    if (!arguments.length) return i2;
    i2 = value;
    return object;
  };
  object.$el = function(value){
    if (!arguments.length) return $el;
    $el = value;
    return object;
  };

  object.width = function(value){
    if (!arguments.length) return width;
    width = value;
    return object;
  };

  object.height = function(value){
    if (!arguments.length) return height;
    height = value;
    return object;
  };

  object.color = function(value){
    if (!arguments.length) return color;
    color = value;
    return object;
  };
  object.x = function(value){
    if (!arguments.length) return x;
    x = value;
    return object;
  }
  return object;
};
//from: https://jsfiddle.net/Guffa/tvt5K/


function bar() {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40}
  var width = document.getElementsByClassName("chartarea")[0].clientWidth * 0.8; //400;
  var height = 800;
  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);
            
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#fe_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
};

var spareRandom = null;

function rnd() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3);
}

function draw(n, mean, stddev) {
    var draws = Array(n);
    for (var i = 0; i < n; i++) {
        draws[i] = rnd() * stddev + mean;
    }
    return draws
}
