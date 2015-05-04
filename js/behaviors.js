/*
*treemap drag
*/
var rankArray=["综合指标（校友会网）_科学研究","综合指标（校友会网）_人才培养","综合指标（校友会网）_综合声誉"];//rankingd初始化
var treemapWidth = 300,
    treemapHeight = 300;

var treemapDrag = d3.behavior.drag()
    .origin(function(d) { return {x: d.x, y: d.y}; })
    .on("dragstart", dragstarted)
    .on("drag", treemapDragged)
    .on("dragend", treemapDragended);

function dragstarted() {
}

function treemapDragged() {
        var dragX = d3.event.x;
        var dragY = d3.event.y;

        this.parentNode.appendChild(this);
        d3.select(".selectParam").select("svg")
              .attr("width", treemapWidth*2)
              .attr("height", treemapHeight*2);

        d3.select(this).select("rect").transition()
            .ease("elastic")
            .duration(500)
            .attr("width", 100)
            .attr("height", 20);
        d3.select(this).select("text").transition()
            .ease("elastic")
            .duration(500)     
            .attr("x", 50)
            .attr("y", 10);

        d3.select(this)
            .attr("transform", "translate(" + dragX + "," + dragY + ")");
}

function treemapDragended(d) {
        d3.select(".selectParam").select("svg")
              .attr("width", treemapWidth)
              .attr("height", treemapHeight);

        d3.select(this).select("rect").transition()
            .attr("width", function(d) { return d.dx - 1; })
            .attr("height", function(d) { return d.dy - 1; });
        d3.select(this).select("text").transition()
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; });

        d3.select(this)
            .attr("transform", "translate(" + d.x + "," + d.y + ")");

        rankArray.push(d3.select(this).attr("class"));
  console.log(d3.select(this).attr("class"));
        d3.csv("data/all.csv", function(error, data) {
          d3.select(".posts").select("svg").remove();
          drawMainRank(data);
        });
}

/*
*treemap drag
*/
var geomapWidth  = 500,
      geomapHeight = 500;

var geomapDrag = d3.behavior.drag()
    .origin(function(d) { return {x: d.x, y: d.y}; })
    .on("dragstart", dragstarted)
    .on("drag", geomapDragged)
    .on("dragend", geomapDragended);

function dragstarted() {
}

function geomapDragged() {
        var dragX = d3.event.x;
        var dragY = d3.event.y;

        this.parentNode.appendChild(this);
        d3.select(".universityRegion").select("svg")
              .attr("width", geomapWidth*2)
              .attr("height", geomapHeight*2);

        d3.select(this)
            .attr("transform", "translate(" + dragX + "," + dragY + ")");
}

function geomapDragended(d) {
        d3.select(".universityRegion").select("svg")
              .attr("width", geomapWidth)
              .attr("height", geomapHeight);

        d3.select(this)
            .attr("transform", "translate(" + d.x + "," + d.y + ")");
}

/*
*tooltip hover
*/
d3.select(".tooltip-content").select(".treemap").append("div")
        .attr("class", "expendSelectArea")
          .style("position", "absolute")
          .style("width", "400px")
          .style("height", "500px")
          .style("opacity", "0 !important;");




/*    function drawMainRank(data){
        var color = d3.scale.ordinal()
                         .range(["#557381","#cc7f9d","#aeafbf","#eec6ad","#746b7e","#76b0bb","#da8082","#bd96cb","#c5bcaf","#b5c1cf","#a1c5ad","#6e99a2","#3b525a","#9e9dba","#dd9d9c"]);
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
              width = 960 - margin.left - margin.right,
              height = 3000 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .rangeRound([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .tickFormat(d3.format(".2s"));//?

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select("body").select(".content").select(".posts").append("svg")
            .attr("width", winSize.width*0.6)
            .attr("height", winSize.height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // data/all.csv data
          color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "name")&&(key !== "type")&&(key !== "province"); }));

          data.forEach(function(d) {
            var x0 = 0;
            d.param = color.domain().map(function(paramName) {return {paramName: paramName, x0: x0, x1: x0 += +d[paramName]}; });
            d.score = d.param[d.param.length - 1].x1;//total points
          });

          data.sort(function(a, b) { return b.score - a.score; });

          x.domain([0, d3.max(data, function(d) { return d.score; })]);//bar length
          y.domain(data.map(function(d) { return d.name; }));//university's name

          svg.append("g")
              .attr("class", "x axis")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("width",20)
              .attr("dy", ".71em")
              .style("text-anchor", "end");

          var university = svg.selectAll(".university")
              .data(data)
              .enter().append("g")
              .attr("class", "university")
              .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

          university.selectAll("rect")
              .data(function(d) { return d.param; })
            .enter().append("rect")
              .attr("height", 20)
              .attr("x", function(d) { return x(d.x0); })
              .attr("width", function(d) { return x(d.x1) - x(d.x0); })
              .style("fill", function(d) { return color(d.paramName); });

          for(var i=0; i<data.length;i++){
            if(geoUnivCount[data[i].province]==null){
              geoUnivCount[data[i].province] = {"name":data[i].province,count:0};   
            }
            geoUnivCount[data[i].province].count++;
          }//统计了省份中学校的数量

    }//function drawMainRank()
*/
