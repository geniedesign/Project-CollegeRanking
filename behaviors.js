var rankArray=["综合指标（校友会网）_科学研究","综合指标（校友会网）_人才培养","综合指标（校友会网）_综合声誉"];//rankingd初始化
/*
*treemap drag
*/
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
            .attr("height", function(d) { return d.dy - 1; })
            .attr("class","clickFlagOn");
        d3.select(this).select("text").transition()
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; });

        d3.select(this)
            .attr("transform", "translate(" + d.x + "," + d.y + ")")
          .append("svg:polygon")
            .attr("points", "0,0 0,20 20,0")
            .style("fill","#F92572");

        var index = rankArray.indexOf(d3.select(this).attr("class"));
        if(index<0){
          rankArray.push(d3.select(this).attr("class"));
		  var l = weightArray.length;
		  for(var i = 0;i<l;i++){
			  weightArray[i] *= l / (l + 1);
		  }
		  weightArray.push(1 / (l + 1));
        }
        d3.csv("data/all.csv", function(error, data) {
        console.log(rankArray);
          d3.select(".posts").select("svg").remove();
          d3.select(".radar-container").select("svg").remove();
          drawMainRank(data,rankArray);
          drawRadarMap(data,rankArray);
        });
}

var categoryDrag = d3.behavior.drag()
    .origin(function(d) { return {x: d.x, y: d.y}; })
    .on("dragstart", snapDragStarted)
    .on("drag", snapDragged)
    .on("dragend", snapDragEnded);

function snapDragStarted(){
}

function snapDragged(){
}

function snapDragEnded(){
	var name = d3.select(this).attr("id");
	var index = rankArray.indexOf(name);
	rankArray.splice(index,1);
	var l = weightArray.length;
	var abored = weightArray[index];
	weightArray.splice(index,1);
	for(var i=0;i<l-1;i++){
		weightArray[i] *= 1 / (1 - abored + 1e-4 );
	}
	d3.csv("data/all.csv", function(error, data) {
          d3.select(".posts").select("svg").remove();
          d3.select(".radar-container").select("svg").remove();
		  d3.select(".postBar").selectAll("span").remove();
          drawMainRank(data,rankArray);
          drawRadarMap(data,rankArray);
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
        // var dragX = d3.event.x;
        // var dragY = d3.event.y;

      
        var dragX = d3.event.sourceEvent.x;
        var dragY = d3.event.sourceEvent.y;

        this.parentNode.appendChild(this);
        d3.select(".universityRegion").select("svg")
              .attr("width", geomapWidth*2)
              .attr("height", geomapHeight*2);

        d3.select(this)
            .attr("transform", function(d){
              d.x+=d3.event.dx;
              d.y+=d3.event.dy;
              return "translate(" + d.x + "," + d.y + ")"
            });

        // d3.select(this)
        //     .attr("transform", "translate(" + dragX + "," + dragY + ")");
}

function geomapDragended(d) {

        d3.select(".universityRegion").select("svg")
              .attr("width", geomapWidth)
              .attr("height", geomapHeight);

        d3.select(this)
              .attr("transform",function(d){
                d.x =0;
                d.y =0;
                return "translate(0,0)"
              })
              .style("fill","#f7fcf0");
//            .attr("transform", "translate(" + d.x + "," + d.y + ")");
}

/*
*tooltip hover
*/
/*d3.select(".tooltip-content").select(".treemap").append("div")
        .attr("class", "expendSelectArea")
          .style("position", "absolute")
          .style("width", "400px")
          .style("height", "500px")
          .style("opacity", "0 !important;");*/


/*
*tooltip hover
*/
