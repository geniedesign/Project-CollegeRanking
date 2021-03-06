var rankArray=["综合指标（校友会网）_科学研究","综合指标（校友会网）_人才培养","综合指标（校友会网）_综合声誉"];//rankingd初始化
var weightArray=[1/3,1/3,1/3];
var snapArray= [];
var typeFlag = 1;
var regionFlag = 1;
var typeArray=  [];
var regionArray = [];
var snapNum = 0;
var snapId = 0;
var allData = [];

/*
*draw Snap
*/
  function drawSnap(data,snapArray){
    snapNum++;
    snapId++;
 var color = d3.scale.ordinal()
                         .range(["#9e627a","#cc7f9d","#DA8082","#A37772","#DBAE9E","#EEC6AD","#c4bda1","#dfd2ca","#ffd9c2","#509fb4","#74b0c3","#acc3d4","#5aa09f","#95c8b9","#a8ceb7","#517696","#8ea3c5","#a2b3c8","#a99bcb","#b6bbce","#327c9a","#5cb4c8","#9cbece","#149598"]);


    var margin = {top: 20, right: 60, bottom: 20, left: 60},
              snapLineWidth = 100,
              eachgHeight = 30,
              width = 500 - margin.left - margin.right,
              height = 3000 - margin.top - margin.bottom;

    color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "name")&&(key !== "type")&&(key !== "province"); }));

          data.forEach(function(d) {
            var x0 = 0;
            d.param = color.domain().map(function(paramName) {
              var index = snapArray.indexOf(paramName);
              if (index > -1) {
                return {paramName: paramName, x0: x0, x1: x0 += +d[paramName]};
              }
            }).filter(function(d){return d != undefined});
            d.score = d.param[snapArray.length-1].x1;//total points
          });

          data.sort(function(a, b) { return b.score - a.score; });
          var tmp_data = [];
          if (typeFlag && regionFlag){
            tmp_data = data;
          }
          else if (typeFlag && !regionFlag){
            data.forEach(function(d){
              var index = regionArray.indexOf(d.province);
              if (index > -1){
                tmp_data.push(d);
              }
            });
          }
          else if (!typeFlag && regionFlag){
            data.forEach(function(d){
              var index = typeArray.indexOf(d.type);
              if (index > -1){
                tmp_data.push(d);
              }
            });
          }
          else {
            data.forEach(function(d){
              var itype = typeArray.indexOf(d.type);
              var iprov = regionArray.indexOf(d.province);
              if (itype > -1 && iprov > -1){
                tmp_data.push(d);
              }
            })
          }
          var tmp_height = tmp_data.length*eachgHeight;

        var x = d3.scale.linear()
            .rangeRound([0, width-margin.left*2]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, tmp_height]);

          x.domain([0, d3.max(tmp_data, function(d) { return d.score; })]);//bar length
          y.domain(tmp_data.map(function(d) { return d.name; }));//university's name

        var newTranslateX = $("body .content").innerWidth() + margin.left*2;
        d3.select("body").select(".content")
            .style("float","left")
            .attr("width", function(){
              $(this).innerWidth(newTranslateX+width+snapLineWidth);
              return newTranslateX+width+snapLineWidth;
            });
        var snapLine = d3.select("body").select(".content").append("div")
            .attr("id","snapLine"+snapId)
            .attr("class","snapLine")
            .style("float","left")
            .attr("width",function(){
              $(this).innerWidth(snapLineWidth);
              return snapLineWidth;
            })
            .attr("height", function(){
              $(this).innerHeight(winSize.height*0.8);
              return winSize.height*0.8;
            })
            .append("div").append("svg")
            .attr("height", function(){
              $(this).innerHeight(winSize.height*0.8);
              return winSize.height*0.8;
            })
            .attr("width",function(){
              $(this).innerWidth(snapLineWidth);
              return snapLineWidth;
            });
        var snapDiv = d3.select("body").select(".content").append("div")
            .attr("id","snap"+snapId)
            .attr("class","snap")
            .style("float","left")
            .attr("width",function(){
              $(this).innerWidth(width+20);
              return width+20;
            })
            .style("padding","1em")
            .style("border","3px dotted #ccc");//here

       var postBar = snapDiv.append("div").attr("class","postBar");
        postBar.append("div").attr("class","postBarIcons")
                  .append("i").attr("id","deleteSnap").attr("class","fa fa-trash-o");
        postBar.select(".postBarIcons")
                  .append("i").attr("id","resize").attr("class","fa fa-refresh");
/*        postBar.select(".postBarIcons")
                  .append("i").attr("id","snapshot").attr("class","fa fa-files-o");*/
          var tmp=[];
          snapArray.forEach(function(d){
            var index = color.domain().indexOf(d);
            tmp.push({name: d, index : index});
          })
          tmp.sort(function(a,b){return a.index - b.index;});
		  var currentSnap = snapId;
          var category = d3.select("#snap"+currentSnap).select(".postBar")
          .attr("width",width-margin.left*2)
          .attr("height",20)
          .style("display","block")
          .selectAll("span")
         .data(tmp).enter()
          .append("span")
          .attr("class","testdiv")
          .attr("id",function(d){return d.name;})
          .style("width", function(d,i){
              $(this).width((width-margin.left*2)*weightArray[i]);
              return (width-margin.left*2)*weightArray[i];
          })
          .style("height",function(){
            $(this).height(2+"em");
            return 2+"em";
          })
          .style("background",function(d){return color(d.name);})
          .html(function(d){
                if(d.name.length*12>$(this).width()){
                  var t = d.name.split("_");
                  return t[1].slice(0,parseInt($(this).width()/12-1));
                }else{
                  var t = d.name.split("_");
                  return t[1];
                }
          });


		  d3.select("#snap"+currentSnap).select("#deleteSnap")
			  .on("click",function(){
			  d3.select("#snap"+currentSnap).remove();
			  d3.select("#snapLine"+currentSnap).remove();
			  snapNum--;
			  drawLine();
		  });
/*
         $("span.testdiv").resizable({
           handles : "e",
           resize: function(e,ui){
             var size_now = ui.size.width;
             var size_orig = ui.originalSize.width;
             var width_now = width + size_now - size_orig;
             var weight = size_now / (width_now + 1e-4);
             var name = $(this).attr("id");
             var cor = (1 - weight) / (1 - (size_orig / (width + 1e-4)) + 1e-4);
             var index = rankArray.indexOf(name);
             for(var i = 0;i < weightArray.length;i++){
               weightArray[i] *= cor;
             }
             weightArray[index] = weight;
             var sum=0;
             for(var i =0;i<weightArray.length;i++){
              sum += weightArray[i];
             }
             for(var i =0;i<weightArray.length;i++){
              weightArray[i] *= 1/sum;
             }
            drawMainRank(data,rankArray);
            drawRadarMap(data,rankArray);
            drawLine(data);
          }
         });*/

         var posts = snapDiv.append("div")
                .attr("class","posts")
                .attr("height",function(){
                  $(this).height(winSize.height*0.8);
                  return winSize.height*0.8;
                })
                .attr("width",function(){
                  $(this).width(width+20);
                  return width+20;
                })
                .style("overflow-y","scroll")
                .style("overflow-x","hidden")
              .append("svg")
                .attr("height", function(){
                  $(this).innerHeight(tmp_height+eachgHeight);
                  return tmp_height;
                })
                .attr("width",function(){
                  $(this).innerWidth(width);
                  return width;
                })
                .append("g")
                .attr("class","snapRank")
                .attr("transform", "translate(" + margin.left*2 + "," +margin.top+ ")");

                            var item = $("div.posts");

            for(var i=0;i<item.length;i++){
              item[i].onscroll=drawLine;
            }

          var university = posts.selectAll(".university")
              .data(tmp_data)
              .enter().append("g")
              .attr("name",function(d){return d.name;})
              .attr("class", "university")
              .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; })
              .on("mouseover",function(d){
                selectUniversity(d.name);
              })
              .on("mouseout",function () {
                d3.selectAll(".univ_selected").classed("univ_selected",false);
              });

          university.append("rect")
          .attr("x",-120)
          .attr("y",-5)
          .attr("height",eachgHeight)
          .attr("width",width)
          .attr("fill","#ccc")
          .classed("background",true);

          university.append("polygon")
              .attr("points","0,0 600,0 600,20 0,20")//600=width-translateWidth-margin.left*2
              .style("fill","#ccc");
          university.selectAll(".itemRect")
              .data(function(d) {return d.param; })
            .enter().append("rect")
              .attr("class","itemRect")
              .attr("height", /*y.rangeBand()*/20)
              .attr("x", function(d) {return x(d.x0); })
              .attr("width", function(d) { return x(d.x1) - x(d.x0); })
              .style("fill", function(d) {return color(d.paramName); });
          university.append("text")
              .attr("x", -5)
              .attr("y", 10)
              .attr("dy", ".35em")
              .attr("text-anchor", "end")
              .text(function(d) {return d.name; });
          university.selectAll("circle")
              .data(function(d) {return d.param; })
            .enter().append("circle")
              .attr("cx",-110)
              .attr("cy",10)
              .attr("r",10)
              .style("fill","#ccc");
          university.append("text")
              .attr("x", -115)
              .attr("y", 10)
              .attr("dy", ".35em")
              .attr("text-anchor", "center")
              .text(function(d) {return y(d.name)/30+1; })
              .style("fill","#f92572");
          university.append("line")
              .attr("x1", -110)
              .attr("y1", 0)
              .attr("x2", 0)
              .attr("y2", 0)
              .style("stroke","#ccc");
          university.append("line")
              .attr("x1", -110)
              .attr("y1", 20)
              .attr("x2", 0)
              .attr("y2", 20)
              .style("stroke","#ccc");

              drawLine();
  }

/*
*draw main rank
*/
    function drawMainRank(data,rankArray,root){
      drawLine();
      d3.select(".content").select("#mainRankBox").select("i").remove();
      d3.select(".content").select("#mainRankBox").select(".postBar").remove();
      d3.select(".content").select("#mainRankBox").select(".posts").remove();

 var color = d3.scale.ordinal()
                         .range(["#9e627a","#cc7f9d","#DA8082","#A37772","#DBAE9E","#EEC6AD","#c4bda1","#dfd2ca","#ffd9c2","#509fb4","#74b0c3","#acc3d4","#5aa09f","#95c8b9","#a8ceb7","#517696","#8ea3c5","#a2b3c8","#a99bcb","#b6bbce","#327c9a","#5cb4c8","#9cbece","#149598"]);


        var margin = {top: 20, right: 60, bottom: 20, left: 60},
              width = 500 - margin.left - margin.right,
              translateWidth = 120,
              eachgHeight = 30,
              height = 3000 - margin.top - margin.bottom;

        // data/all.csv data
        color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "name")&&(key !== "type")&&(key !== "province"); }));
          data.forEach(function(d) {
            var x0 = 0;
            d.param = color.domain().map(function(paramName) {
              var index = rankArray.indexOf(paramName);
              if (index > -1) {
                return {paramName: paramName, x0: x0, x1: x0 += +(d[paramName]*weightArray[index])};
              }
            }).filter(function(d){return d != undefined});
            d.score = d.param[rankArray.length-1].x1;//total points
          });

          data.sort(function(a, b) { return b.score - a.score; });

          var tmp_data = [];
          if (typeFlag && regionFlag){
            tmp_data = data;
          }
          else if (typeFlag && !regionFlag){
            data.forEach(function(d){
              var index = regionArray.indexOf(d.province);
              if (index > -1){
                tmp_data.push(d);
              }
            });
          }
          else if (!typeFlag && regionFlag){
            data.forEach(function(d){
              var index = typeArray.indexOf(d.type);
              if (index > -1){
                tmp_data.push(d);
              }
            });
          }
          else {
            data.forEach(function(d){
              var itype = typeArray.indexOf(d.type);
              var iprov = regionArray.indexOf(d.province);
              if (itype > -1 && iprov > -1){
                tmp_data.push(d);
              }
            })
          }

      var tmp_height = tmp_data.length*eachgHeight;

        var x = d3.scale.linear()
            .rangeRound([0, width-120]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, tmp_height]);

          x.domain([0, d3.max(tmp_data, function(d) { return d.score; })]);//bar length
          y.domain(tmp_data.map(function(d) { return d.name; }));//university's name

          var tmp=[];
          rankArray.forEach(function(d){
            var index = color.domain().indexOf(d);
            tmp.push({name: d, index : index});
          })
          tmp.sort(function(a,b){return a.index - b.index;});

        var mainRank;
        if(!document.getElementById('mainRankBox')){
        mainRank =d3.select("body").select(".content").style("float","left")
              .append("div")
              .attr("id","mainRankBox")
              .style("float","left")
              .style("padding","1em")
              .style("border","3px dotted #ccc");
        }else{
        mainRank =d3.select("body").select(".content").style("float","left")
              .select("#mainRankBox");
        }

        var postBar = mainRank.append("div").attr("class","postBar");

        postBar.append("div").attr("class","postBarIcons")
                  .append("i").attr("id","deleteAll").attr("class","fa fa-trash-o")
                  .on("click",function(){
/*                    mainRankDelete(data,root);*/
                    d3.select(".content").select("#mainRankBox").select(".postBar").remove();
                    d3.select(".content").select("#mainRankBox").select(".posts").remove();
                    rankArray = [];
                    weightArray = [];
                    drawTreeMap(data,rankArray,root);
                    drawRadarMap(data,rankArray);
                    drawLine();
                    d3.select("#mainRankBox").append("i")
                          .attr("class","fa fa-bar-chart")
                          .style("color","#ccc")
                          .style("font-size","5em")
                          .style("padding","3.5em 1em");
                  });
        postBar.select(".postBarIcons")
                  .append("i").attr("id","snapshotAll").attr("class","fa fa-files-o")
                  .on("click",function(){
                    drawSnap(data,rankArray);
                  });
        postBar.select(".postBarIcons")
                  .append("i").attr("id","resize").attr("class","fa fa-refresh")
                  .on("click", function(){
                    weightAverage(root);
                  });

        var svg = mainRank.append("div").attr("class","posts")
                    .attr("height",function(){
                      $(this).height(winSize.height*0.8);
                      return winSize.height*0.8;
                    })
                    .attr("width",function(){
                      $(this).width(width+20);
                      return width+20;
                    })
                    .style("overflow-y","scroll")
                    .style("overflow-x","hidden")
                  .append("svg")
                    .attr("id","mainRank")
                    .attr("width", width)
                    .attr("height", tmp_height+eachgHeight)
                    .append("g")
                    .attr("transform", "translate(" + margin.left*2 + "," +margin.top+ ")");

            var item = $("div.posts");

            for(var i=0;i<item.length;i++){
              item[i].onscroll=drawLine;
            }
/*          category.append("span")
              .attr("class","testdiv")
              .attr("id",function(d){return d.name;})
              .style("width", function(d,i){
                  $(this).width((width-translateWidth)*weightArray[i]);
                  return (width-translateWidth)*weightArray[i];
              })
              .style("height",20)
              .style("background",function(d){return color(d.name);})
            .append("span")
              .attr("class","tooltip-item")
              .html(function(d){
                    if(d.name.length*12>$(this.parentNode).width()){
                      var t = d.name.split("_");
                      return t[1].slice(0,parseInt($(this.parentNode).width()/12-1));
                    }else{
                      var t = d.name.split("_");
                      return t[1];
                    }
              });*/

          var category = d3.select("#mainRankBox").select(".postBar")
              .attr("width",width-translateWidth)
              .attr("height",20)
              .style("display","block")
              .selectAll("span")
             .data(tmp).enter()
              .append("span")
              .attr("class","categoryspan tooltip tooltip-effect-1")
              .attr("id",function(d){return d.name;});

          category.append("span").attr("class","tooltip-item")
              .attr("id",function(d){return d.name;})
              .style("width", function(d,i){
                  $(this).width((width-translateWidth)*weightArray[i]);
                  return (width-translateWidth)*weightArray[i];
              })
              .style("height",function(){
                $(this).height(2+"em");
                return 2+"em";
              })
              .style("background",function(d){return color(d.name);})
              .style("display","block")
              .html(function(d){
                    if(d.name.length*12>$(this).width()){
                      var t = d.name.split("_");
                      return t[1].slice(0,parseInt($(this).width()/12-1));
                    }else{
                      var t = d.name.split("_");
                      return t[1];
                    }
              });
          category.append("span").attr("class","tooltip-content clearfix iconTooltip")
              .append("i").attr("id","delete").attr("class","fa fa-trash-o")
              .on("click",function(){
                var index = rankArray.indexOf($(this.parentNode.parentNode).attr("id"));
                rankArray.splice(index,1);
                var l = weightArray.length;
                var abored = weightArray[index];
                weightArray.splice(index,1);
                for(var i=0;i<l-1;i++){
                  weightArray[i] *= 1 / (1 - abored + 1e-4 );
                }
                drawMainRank(data,rankArray,root);
                drawRadarMap(data,rankArray);
                drawTreeMap(data,rankArray,root);
              });
          category.select(".tooltip-content")
              .append("i").attr("id","snapshot").attr("class","fa fa-files-o")
              .on("click",function(){
                snapArray = [];
                snapArray.push($(this.parentNode.parentNode).attr("id"));
                var tmp_weight = weightArray;
                weightArray = [1];
                drawSnap(data,snapArray);
                weightArray = tmp_weight;
              });
           category.append("span").attr("class","tooltip-content clearfix resizeTooltip")
              .append("span").attr("id","resizeItem")
              .html("比例<input type='text' placeholder='33%'>");
           category.select(".resizeTooltip").select("input")
               .attr("placeholder",function(d){
                var index = rankArray.indexOf(d.name);
                return parseInt(weightArray[index]*100) + "%";
               });


         $("span.categoryspan").resizable({
           handles : "e",
           resize: function(e,ui){
             var size_now = ui.size.width;
             var size_orig = ui.originalSize.width;
             var width_now = width + size_now - size_orig;
             var weight = size_now / (width_now + 1e-4);
             var name = $(this).attr("id");
             var cor = (1 - weight) / (1 - (size_orig / (width + 1e-4)) + 1e-4);
             var index = rankArray.indexOf(name);
             for(var i = 0;i < weightArray.length;i++){
               weightArray[i] *= cor;
             }
             weightArray[index] = weight;
             var sum=0;
             for(var i =0;i<weightArray.length;i++){
              sum += weightArray[i];
             }
             for(var i =0;i<weightArray.length;i++){
              weightArray[i] *= 1/sum;
             }
            drawMainRank(data,rankArray,root);
            drawRadarMap(data,rankArray);
            drawLine();
          }
         });
/*
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("width",40)
              .attr("dy", ".71em")
              .style("text-anchor", "end");*/

          var university = svg.selectAll(".university")
              .data(tmp_data)
              .enter().append("g")
              .attr("name",function(d){return d.name;})
              .attr("class", "university")
              .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; })
              .on("mouseover",function(d){
                selectUniversity(d.name);
              })
              .on("mouseout",function () {
                d3.selectAll(".univ_selected").classed("univ_selected",false);
              });

          university.append("rect")
          .attr("x",-120)
          .attr("y",-5)
          .attr("height",eachgHeight)
          .attr("width",width)
          .attr("fill","#ccc")
          .classed("background",true);

          university.append("polygon")
              .attr("points","0,0 600,0 600,20 0,20")//600=width-translateWidth-margin.left*2
              .style("fill","#ccc");
          university.selectAll(".itemRect")
              .data(function(d) {return d.param; })
            .enter().append("rect")
              .attr("class","itemRect")
              .attr("height", /*y.rangeBand()*/20)
              .attr("x", function(d) {return x(d.x0); })
              .attr("width", function(d) { return x(d.x1) - x(d.x0); })
              .style("fill", function(d) {return color(d.paramName); });
          university.append("text")
              .attr("x", -5)
              .attr("y", 10)
              .attr("dy", ".35em")
              .attr("text-anchor", "end")
              .text(function(d) {return d.name; });
          university.selectAll("circle")
              .data(function(d) {return d.param; })
            .enter().append("circle")
              .attr("cx",-110)
              .attr("cy",10)
              .attr("r",10)
              .style("fill","#ccc");
          university.append("text")
              .attr("x", -115)
              .attr("y", 10)
              .attr("dy", ".35em")
              .attr("text-anchor", "center")
              .text(function(d) {return y(d.name)/30+1; })
              .style("fill","#f92572");
          university.append("line")
              .attr("x1", -110)
              .attr("y1", 0)
              .attr("x2", 0)
              .attr("y2", 0)
              .style("stroke","#ccc");
          university.append("line")
              .attr("x1", -110)
              .attr("y1", 20)
              .attr("x2", 0)
              .attr("y2", 20)
              .style("stroke","#ccc");
    }//function drawMainRank()



/*
*drawLine
*/
    function drawLine(){
      d3.select(".content").selectAll("line[del=snapline]").remove();

      var sc = $("div.posts");
	  var ids = $(".snapLine");
    for(var i=0;i<allData.length;i++){
        var item=$("g[name="+allData[i].name+"]");
        for(var j=0;j<item.length-1;j++){
          var off1 = $(item[j]).offset().left;
          var off2 = $(item[j+1]).offset().left;
          if (off2-off1 >750){continue;}
            var x1 = 0;
            var x2 = 100;//$("#snapLine1").width();
            var y1 = $(item[j]).position().top;// - $(sc[j]).scrollTop();
            var y2 = $(item[j+1]).position().top;// - $(sc[j+1]).scrollTop();
            var mid_h = winSize.height*0.8;//$("#snapLine1").height();
            var o = 1 - Math.max(Math.abs(y1-mid_h/2), Math.abs(y2-mid_h/2))*2/mid_h;
            o = Math.sqrt(o);
            //动了这里

            var marginTop = 20, eachgHeight = 30;

            y1-= (marginTop+2*eachgHeight);
            y2-= (marginTop+2*eachgHeight);

          if((y1 < 0 || y1 > mid_h) || (y2 < 0 || y2 > mid_h))
            {continue;}

          y1+=eachgHeight;
          y2+=eachgHeight;

            console.log($(ids[j]).attr("id"));
            d3.select("#"+$(ids[j]).attr("id")).select("svg").append("line")
            .attr("del","snapline")
            .attr("name",function(){return allData[i].name;})
                .attr("x1",x1)
                .attr("x2",x2)
                .attr("y1",y1)
                .attr("y2",y2)//到这里，然后是这个y1y2的值取错了，这里取得的是相对浏览器的绝对位置，需要一个相对于自身svg的相对位置
                .attr("opacity",function(){
            if (o>=0.1)
            {
                return o;
            }else{
                return 0.1;
            }
            }).attr("stroke","black");
        }
    }
}

/*
*mainRank Delete
*/
/*function mainRankDelete(data,root){
    d3.select(".postBar").selectAll("span").remove();
    d3.select(".content").select(".posts").select("svg").select("#mainRank").remove();
    rankArray = [];
    weightArray = [];
    drawTreeMap(data,rankArray,root);
    drawMainRank(data,rankArray,root);
    drawRadarMap(data,rankArray);
    drawLine();
}*/


/*
*draw treemap
*/
     function drawTreeMap(data,rankArray,root){
      d3.select("body").select("#layout").select(".selectParam")
          .select(".treemap").select(".selectBoard").remove();

          var treemapColor = d3.scale.ordinal()
                                   .range(["#CC7F9D","#EEC6AD","#76B0BB"])
                                   .domain([" 综合指标（校友会网）_","综合指标（武书连）_","学科排名（武书连）_"]);

          var treemapWidth = 300,
                tooltipHeight = 40,
                treemapHeight = 300+tooltipHeight;

          var treemap = d3.layout.treemap()
              .round(false)
              .size([treemapWidth, treemapHeight])
              .sticky(true)
              .value(function(d) { return d.size; });

          var treemapSvg = d3.select("body").select("#layout").select(".selectParam").select(".treemap")
              .append("div")
                  .attr("class", "selectBoard")
                  .style("position", "relative")
                  .style("float", "left")
                  .style("width", treemapWidth + "px")
                  .style("height", treemapHeight + "px")
              .append("svg:svg")
                  .attr("width", treemapWidth)
                  .attr("height", treemapHeight)
              .append("svg:g")
                  .attr("transform", "translate(0,0)");
              var nodes = treemap.nodes(root)
                  .filter(function(d) {
                   return !d.children; });

              var clientX=0;
              var clientY=0;
              var cell = treemapSvg.selectAll("g")
                  .data(nodes)
                  .enter().append("svg:g")
                  .attr("class", function(d){return d.parent.name + d.name;})
                  .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; })
                  .on("mouseover",function(d){
                            clientX = $(this).offset().left-20;
                            clientY = $(this).offset().top-130;
                            d3.select(this).select("rect")
                               .style("fill","#f92572")
                               .style("stroke-dasharray","0,0");
                           var hoverItem = d3.select(".treemap").select(".selectBoard")
                                                    .append("div")
                                                      .attr("class","hoverItem")
                                                      .style("left",clientX + "px")
                                                      .style("top",clientY+ "px");
                           hoverItem.append("p")
                                .html(d.name);
                           hoverItem.append("span")
                                .attr("class","hoverItemSpan");
/*                        var clientX=event.clientX;
                           var clientY=event.clientY;
                          d3.select(this).append("svg:path")
                               .attr("class","hoverItem")
                               .attr("d",function(d){ return "M "+(d.dx/2-40)+" "+(-40)+" L "+(d.dx/2+40)+" "+(-40)+" L "+(d.dx/2+40)+" "+(-10)+" L "+(d.dx/2+5)+" "+(-10)+" L "+(d.dx/2)+" "+0+" L "+(d.dx/2-5)+" "+(-10)+" L "+(d.dx/2-40)+" "+(-10)+" Z";})
                               .style("fill","#f92572")
                               .style("stroke","#f7fcf0");
                            d3.select(this).append("svg:text")
                                .attr("class","hoverItem")
                                .attr("x", clientY)
                                .attr("y", clientY - 20)
                                .attr("text-anchor", "middle")
                                .style("fill","#f7fcf0")
                                .text(function(d) { return d.name; });*/
                           //"M "+(clientX-40)+" "+(clientY-40)+" L "+(clientX+40)+" "+(clientY-40)+" L "+(clientX+40)+" "+(clientY-10)+" L "+(clientX+5)+" "+(clientY-10)+" L "+(clientX)+" "+(clientY)+" L "+(clientX-5)+" "+(clientY-10)+" L "+(clientX-40)+" "+(clientY-10)+" Z"
                   })
                  .on("mouseout",function(d,i){
                          d3.selectAll(".hoverItem").remove();
                           if(d3.select(this).select("rect").attr("class")=="clickFlagOn"){
                              d3.select(this).select("rect")
                               .style("fill", function(d) {return treemapColor(d.parent.name); })
                               .style("stroke-dasharray","0,0")
                               .style("stroke","#333333");
                            }else{
                              d3.select(this).select("rect")
                               .style("fill","#333333")
                               .style("stroke-dasharray","5,5")
                               .style("stroke",function(d) {return treemapColor(d.parent.name); });
                            }
                     })
                  .on("click", function(d) {
                         if(d3.select(this).select("rect").attr("class")=="clickFlagOn"){
                            d3.select(this).select("rect")
                               .attr("class","clickFlagOff")
                               .style("fill","#333333")
                               .style("stroke-dasharray","5,5")
                               .style("stroke", function(d) { return treemapColor(d.parent.name); });
                            var index = rankArray.indexOf(d3.select(this).attr("class"));
                            rankArray.splice(index,1);
                            var l = weightArray.length;
                            var abored = weightArray[index];
                            weightArray.splice(index,1);
                            for(var i=0;i<l-1;i++){
                              weightArray[i] *= 1 / (1 - abored + 1e-4 );
                            }
                            drawMainRank(data,rankArray,root);
                            drawRadarMap(data,rankArray);
                            drawLine();
                          }else{
                            d3.select(this).select("rect")
                              .attr("class","clickFlagOn")
                              .style("fill",function(d) {return treemapColor(d.parent.name); })
                              .style("stroke-dasharray","0,0")
                              .style("stroke","#333333");
                            //redraw radar and main rank
                            var index = rankArray.indexOf(d3.select(this).attr("class"));
                              if(index<0){
                                rankArray.push(d3.select(this).attr("class"));
                                var l = weightArray.length;
                                for(var i = 0;i<l;i++){
                                  weightArray[i] *= l / (l + 1);
                                }
                                weightArray.push(1 / (l + 1));
                              }
                              drawMainRank(data,rankArray,root);
                              drawRadarMap(data,rankArray);
                              drawLine();
                          }
                  });
                  /*.call(treemapDrag);*/

                  cell.append("svg:rect")
                      .attr("width", function(d) { return d.dx - 1; })
                      .attr("height", function(d) { return d.dy - 1; })
                      .style("fill","#333333")
                      .style("stroke-dasharray", "5,5")
                      .style("stroke", function(d) { return treemapColor(d.parent.name); });

                var maxSize = _.max(nodes, function(node){ return node.size; });

                  cell.append("svg:text")
                      .attr("x", function(d) { return d.dx / 2; })
                      .attr("y", function(d) { return d.dy / 2; })
                      .attr("text-anchor", "middle")
                      .style("overflow","hidden")
                      .style("fill","#f7fcf0")
 /*                     .style("font-size",  14+ "px")
                      .style("-webkit-transform",function(d) {return "scale("+d.size/maxSize.size+")"})*/
                      .text(function(d) {
                        if(d.name.length*12>d.dx){
                          return d.name.slice(0,parseInt(d.dx/12));
                        }else{
                          return d.name;
                        }
                      });

                  cell.attr("alt", function(d){
                         var index = rankArray.indexOf(d.parent.name + d.name);
                          if (index > -1) {
                            d3.select(this).select("rect")
                              .attr("class","clickFlagOn")
                              .style("fill",function(d) { return treemapColor(d.parent.name); })
                              .style("stroke-dasharray","0,0")
                              .style("stroke","#333333");
                          }
                  });
/*                  cell.attr("alt", function(d){
                         var index = rankArray.indexOf(d.parent.name + d.name);
                          if (index > -1) {
                            d3.select(this).append("svg:polygon")
                                  .attr("points", "0,0 0,15 15,0")
                                  .style("fill","#F92572");
                            d3.select(this).select("rect")
                                  .attr("class","clickFlagOn")
                                  .style("fill","#F7FCF0");
                          }
                  });*/

     }//function drawTreeMap()


/*
*radar map
*/
      function drawRadarMap(data,rankArray){
        d3.select(".radar-container").select("svg").remove();
        var a = 0,
              b = 0,
              c = 0;
        for(var i = 0;i<rankArray.length;i++){
          var flag= rankArray[i].split('_');
          if(flag[0]=="综合指标（校友会网）"){
            a++;
          }else if(flag[0]=="综合指标（武书连）"){
            b++;
          }else if(flag[0]=="学科排名（武书连）"){
            c++;
          }else{
            console.log("raderData error");
          }
        }

          var radarData = [
            {
              className: 'paramUsed', // optional can be used for styling
              axes: [
                {axis: "xiaoyouhui", value: a,  yOffset: 10},
                {axis: "wushulianC", value: b,},
                {axis: "wushulianS", value: c,}
              ]
            }
          ];

          var chart = RadarChart.chart();
          var svg = d3.select("#layout").select(".selectParam").select('.radar-container').append('svg')
            .attr('width', 120)
            .attr('height', 110);
          // draw one
          svg.append('g').classed('focus', 1).datum(radarData)
          .attr('transform', function(d, i) { return 'translate(10,10)'; })
          .call(chart);
      }

/*
*classSelect: when select 综合指标（校友会网）|| 综合指标（武书连）|| 学科排名（武书连）
*/
function classSelect(rankArray,root,data){
        var treemapWidth = 300,
            treemapHeight = 300;
        var treemap = d3.layout.treemap()
            .round(false)
            .size([treemapWidth, treemapHeight])
            .sticky(true)
            .value(function(d) { return d.size; });
        var nodes = treemap.nodes(root)
            .filter(function(d) {
             return !d.children; });

        d3.select("#xiaoyouhui").on("click", function(){classSelectDetail($(this).html().split("_"));});
        d3.select("#wushulianC").on("click", function(){classSelectDetail($(this).html().split("_"));});
        d3.select("#wushulianS").on("click", function(){classSelectDetail($(this).html().split("_"));});

        function classSelectDetail(flag){
            /*var flag = $(this).html().split("_");*/
            rankArray = [];
            weightArray = [];
            var numCount = 0;
            for(var i in nodes){
              if(flag[0]+"_" == nodes[i].parent.name){
                var index = rankArray.indexOf(flag[0] + "_" + nodes[i].name);
                 if(index<0){
                    numCount++;
                    //rankArray.push(flag[0] + "_" + nodes[i].name);
                  }
              }
            }
            for(var i in nodes){
              if(flag[0]+"_" == nodes[i].parent.name){
                var index = rankArray.indexOf(flag[0] + "_" + nodes[i].name);
                 if(index<0){
                    rankArray.push(flag[0] + "_" + nodes[i].name);
                    weightArray.push(1 / numCount);
                  }
              }
            }
/*            for(var i =0;i<numCount;i++){
              weightArray.push(1 / numCount);
            }*/
            d3.select(".postBar").selectAll("span").remove();
            drawTreeMap(data,rankArray,root);
            drawMainRank(data,rankArray,root);
        }
}

/*
*selectable type buttons
*/
     function  drawTypeSelectButtons(data,root){
         var univTypeWidth = 300,
                 univTypeHeight = 80,
                 margin = 20;

         var univTypeCount = _.unique(data.map(function(d){return d.type}).sort());

         var univTypeDiv = d3.select("body").select("#layout").select(".universityType").select("#universityTypeContent").select("#type-list")
                      .attr("class", "selectBoard")
                      .style("position", "relative")
                      .style("float", "left")
                      .style("width", univTypeWidth + "px")
                      .style("height", univTypeHeight + "px")
                      .style("margin", margin + "px")
                    .append("form");

            univTypeDiv.append("input")
                    .attr("type", "checkbox")
                    .attr("checked", "true")
                    .attr("class", "region")
                    .attr("id","type-all")
                    .on("click", "false");
            univTypeDiv.append("label")
                    .attr("for","type-all")
                    .attr("id","type-all-lable")
                    .attr("class", "for doubleWidth clickFlagOn")
                    .style("background","#f92572")
                    .text("取消全选")
                    .on("mouseover",function(d,i){
                              d3.select(this)
                                 .style("background","#f92572");
                        })
                        .on("mouseout",function(d,i){
                             if($(this).hasClass("clickFlagOn")){
                                d3.select(this)
                                  .style("background", "#f92572");
                              }else{
                                d3.select(this)
                                  .style("background", "#F7FCF0");
                              }
                        })
                        .on("click",function(d,i){
                             if($(this).hasClass("clickFlagOn")){
                                univTypeDiv.selectAll("label")
                                  .attr("class","for clickFlagOff")
                                  .style("background", "#F7FCF0");
                                d3.select(this)
                                  .attr("class","for doubleWidth clickFlagOff")
                                  .text("全选");
                                  typeFlag = 0;
                                  typeArray = [];
                              }else{
                                univTypeDiv.selectAll("label")
                                  .attr("class","for clickFlagOn")
                                  .style("background", "#f92572");
                                d3.select(this)
                                  .attr("class","for doubleWidth clickFlagOn")
                                  .text("取消全选");
                                  typeFlag = 1;
                              }
                              drawMainRank(data,rankArray,root);
                              drawRadarMap(data,rankArray);
                              drawLine();
                        });

            for(var i = 0; i<univTypeCount.length; i ++){
                univTypeDiv.append("input")
                        .attr("type", "checkbox")
                        .attr("checked", "true")
                        .attr("id",univTypeCount[i])
                        .attr("class", "region")
                        .on("click", "false");
                univTypeDiv.append("label")
                        .attr("for","type"+i)
                        .attr("class", "for clickFlagOn")
                        .style("background","#f92572")
                        .attr("id",univTypeCount[i])
                        .text(univTypeCount[i])
                        .on("mouseover",function(d,i){
                              d3.select(this)
                                 .style("background","#f92572");
                        })
                        .on("mouseout",function(d,i){
                             if($(this).hasClass("clickFlagOn")){
                                d3.select(this)
                                  .style("background", "#f92572");
                              }else{
                                d3.select(this)
                                  .style("background", "#F7FCF0");
                              }
                        })
                        .on("click",function(d,i){
                             if($(this).hasClass("clickFlagOn")&&(typeFlag==1)){
                              //FlagOn同时是全选状态
                               d3.select(this.parentNode).selectAll(".clickFlagOn")
                                  .attr("class","for clickFlagOff")
                                  .style("background","#F7FCF0");
                              d3.select("#type-all-lable")
                                  .attr("class","for doubleWidth clickFlagOff")
                                  .text("全选");
                              d3.select(this)
                                  .attr("class","for clickFlagOn")
                                  .style("background", "#f92572");
                                  typeFlag = 0;
                                  typeArray = [];
                                  var type = d3.select(this).attr("id");
                                  typeArray.push(type);
                              }else if($(this).hasClass("clickFlagOn")&&(typeFlag==0)){
                                d3.select(this)
                                .attr("class","for clickFlagOff")
                                .style("background","#F7FCF0");
                                var type = d3.select(this).attr("id");
                                var index = typeArray.indexOf(type);
                                typeArray.splice(index,1);
                              }else{
                                d3.select(this)
                                  .attr("class","for clickFlagOn")
                                  .style("background", "#f92572");
                                  var type = d3.select(this).attr("id");
                                  typeArray.push(type);
                              }
                                  drawMainRank(data,rankArray,root);
                                  drawRadarMap(data,rankArray);
                                  drawLine();
                        });
            }

     }
/*
*draggable chinamap
*/
      function drawGeoMap(data,rankArray,root){
           var geoUnivCount={};

            for(var i=0; i<data.length;i++){
              if(geoUnivCount[data[i].province]==null){
                geoUnivCount[data[i].province] = {"name":data[i].province,count:0};
              }
              geoUnivCount[data[i].province].count++;
            }//统计了省份中学校的数量

            var geomapWidth  = 300;
            var geomapHeight = 300;

            var geomapDiv = d3.select("body").select("#layout").select(".universityRegion").select("#universityRegionContent").append("div")
                        .attr("class", "selectBoard")
                        .style("position", "relative")
                        .style("float", "left")
                        .style("width", geomapWidth + "px")
                        .style("height", geomapHeight + "px");
            var geomapButton = geomapDiv.append("form");
                        geomapButton.append("input")
                            .attr("type", "checkbox")
                            .attr("checked", "true")
                            .attr("class", "region")
                            .attr("id","region-all")
                            .on("click", "false");
                        geomapButton.append("label")
                            .attr("for","region-all")
                            .attr("id","region-all-lable")
                            .attr("class", "for doubleWidth clickFlagOn")
                            .style("background","#f92572")
                            .text("取消全选")
                            .on("mouseover",function(d,i){
                                      d3.select(this)
                                         .style("background","#f92572");
                            })
                            .on("mouseout",function(d,i){
                                 if($(this).hasClass("clickFlagOn")){
                                    d3.select(this)
                                      .style("background", "#f92572");
                                  }else{
                                    d3.select(this)
                                      .style("background", "#F7FCF0");
                                  }
                            })
                            .on("click",function(d,i){
                                 if($(this).hasClass("clickFlagOn")){//全选状态点击
                                    d3.select(this)
                                      .attr("class","for doubleWidth clickFlagOff")
                                      .text("全选");
                                    unselectAllRegion();
                                    regionFlag = 0;
                                    regionArray = [];
                                    drawMainRank(data,rankArray,root);
                                  }else{//非全选状态点击
                                    d3.select(this)
                                      .attr("class","for doubleWidth clickFlagOn")
                                      .text("取消全选");
                                    selectAllRegion();
                                    regionFlag = 1;
                                    drawMainRank(data,rankArray,root);
                                  }
                                });
            var geomapSvg = geomapDiv.append("svg:svg")
                        .attr("width", geomapWidth)
                        .attr("height", geomapHeight)
                        .append("svg:g")
                        .attr("transform", "translate(.5,.5)");

            var projection = d3.geo.mercator()
                      .center([105, 35])
                      .scale(geomapHeight-20)
                      .translate([geomapWidth/2, geomapHeight/2]);

            var geomapPath = d3.geo.path()
                    .projection(projection);

            d3.json("data/geoChina.json", function(error, root) {
              if (error)
                return console.error(error);

              geomapSvg.selectAll("geomapPath")
                .data( root.features )
                .enter()
                .append("path")
                .attr("id",function(d){return d.properties.name;})
                .attr("class","clickFlagOn")
                .attr("stroke","#333")
                .attr("stroke-width",1)
                .style("fill", "#F92572")
                .attr("d", geomapPath)
                .on("mouseover",function(d,i){
                        d3.select(this)
                             .style("fill","#F92572");
                         d3.select(this.parentNode).select("text").remove();
                         d3.select(this.parentNode)
                            .append("svg:text")
                             .text(d.properties.name)
                             .style("fill","#f7fcf0")
                             .attr("transform", "translate(" + event.clientX + "," + event.clientY/2 + ")");
                 })
                 .on("mouseout",function(d,i){
                         if(d3.select(this).attr("class") == "clickFlagOn"){
                            d3.select(this)
                              .style("fill", "#f92572");
                          }else{
                          d3.select(this).style("fill", function(d,i){
                                  var geoUniv = geoUnivCount[d.properties.name];
                                          if(geoUniv == null){
                                            return "#000";
                                          }else{
                                            if(geoUniv.count*0.1>1){
                                              return "rgba(247,252,240,1.0)";
                                            }
                                            return "rgba(247,252,240," + geoUniv.count*0.1 + ")";
                                          }
                            });
                          }
                   })
                 .on("click",function(d,i){
                             if((d3.select(this).attr("class")  == "clickFlagOn")&&(regionFlag==1)){
                              //FlagOn同时是全选状态
                               d3.select(this.parentNode).selectAll(".clickFlagOn")
                                  .attr("class","clickFlagOff")
                                  .style("fill", function(d,i){
                                  var geoUniv = geoUnivCount[d.properties.name];
                                          if(geoUniv == null){
                                            return "#000";
                                          }else{
                                            if(geoUniv.count*0.1>1){
                                              return "rgba(247,252,240,1.0)";
                                            }
                                            return "rgba(247,252,240," + geoUniv.count*0.1 + ")";
                                          }
                                  });
                              d3.select("#region-all-lable")
                                        .attr("class", "for doubleWidth clickFlagOff")
                                        .style("background","#f7fcf0")
                                        .text("全选");
                              d3.select(this)
                                  .attr("class","clickFlagOn")
                                  .style("fill", "#f92572");
                                  regionFlag = 0;
                                  regionArray = [];
                                  var region = d3.select(this).attr("id");
                                  regionArray.push(region);
                                  drawMainRank(data,rankArray,root);
                              }else if((d3.select(this).attr("class") == "clickFlagOn")&&(regionFlag==0)){
                                d3.select(this)
                                  .attr("class","clickFlagOff")
                                  .style("fill","#F7FCF0");
                                  var region = d3.select(this).attr("id");
                                  var index = regionArray.indexOf(region);
                                  regionArray.splice(index,1);
                                  drawMainRank(data,rankArray,root);
                              }else{
                                d3.select(this)
                                  .attr("class","clickFlagOn")
                                  .style("fill", "#f92572");
                                  var region = d3.select(this).attr("id");
                                  regionArray.push(region);
                                  drawMainRank(data,rankArray,root);
                              }
                 });
            });

            function unselectAllRegion(){
                 geomapSvg.selectAll(".clickFlagOn")
                    .attr("class","clickFlagOff")
                    .style("fill", function(d,i){
                        var geoUniv = geoUnivCount[d.properties.name];
                        if(geoUniv == null){
                          return "#000";
                        }else if(geoUniv.count*0.1>1){
                          return "rgba(247,252,240,1.0)";
                        }else{
                          return "rgba(247,252,240," + geoUniv.count*0.1 + ")";
                        }
                    });
            }

            function selectAllRegion(){
                 geomapSvg.selectAll(".clickFlagOff")
                    .attr("class","clickFlagOn")
                    .style("fill", "#f92572");
            }
      }

            function weightAverage(root){
              var t_weight = 1 / weightArray.length;
              for(var i = 0; i < weightArray.length; i++)
                weightArray[i] = t_weight;
              drawMainRank(allData,rankArray,root);
            }

            function selectUniversity (t_name) {
                d3.selectAll(".univ_selected").classed("univ_selected",false);
                d3.selectAll("[name="+t_name+"]").classed("univ_selected",true);
            }

$(document).ready(function(){
    d3.csv("data/all.csv", function(error, data) {
              allData = data;
            d3.json("data/flare.json", function(error, root) {
                drawMainRank(data,rankArray,root);
                drawTreeMap(data,rankArray,root);
                drawGeoMap(data,rankArray,root);
                drawTypeSelectButtons(data,root);
                drawRadarMap(data,rankArray);
                classSelect(rankArray,root,data);
           });
    });
});



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
*treemap drag
*/
/*var treemapWidth = 300,
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
          drawMainRank(data,rankArray);
          drawRadarMap(data,rankArray);
        });
}
*/
/*
*category&snap drag
*/
/*var categoryDrag = d3.behavior.drag()
    .origin(function(d) { return {x: d.x, y: d.y}; })
    .on("dragstart", snapDragStarted)
    .on("drag", snapDragged)
    .on("dragend", snapDragEnded);

function snapDragStarted(){
}

function snapDragged(){
}

function snapDragEnded(){
      var dragX = d3.event.sourceEvent.x;
      var dragY = d3.event.sourceEvent.y;

      var delX = $("i#delete").offset().left;
      var delY = $("i#delete").offset().top;

      var snapX = $("i#snapshot").offset().left;
      var snapY = $("i#snapshot").offset().top;

      var width = $("i#delete").outerWidth();
      var height = $("i#delete").outerHeight();

      if (dragX >= delX && dragX <= (delX + width) && dragY >= delY && dragY <= (delY + height)){

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
         d3.json("data/flare.json", function(error, root) {
              drawTreeMap(data,rankArray,root);
              drawMainRank(data,rankArray);
              drawRadarMap(data,rankArray);
            });
     });
}

  else if (dragX >= snapX && dragX <= (snapX + width) && dragY >= snapY && dragY <= (snapY + height)){

            snapArray = [];
            var name  = d3.select(this).attr("id");
            console.log(name);
            snapArray.push(name);
            d3.csv("data/all.csv", function(error, data) {
            drawSnap(data,snapArray);
          });
  }
  else{}
}
*/
/*
*geomap drag
*/
/*var geomapWidth  = 500,
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
}*/
