(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };


    var selectParamItem  = document.getElementById('selectParamItem'),
        universityTypeItem  = document.getElementById('universityTypeItem'),
        universityRegionItem  = document.getElementById('universityRegionItem'),
        shareRankItem = document.getElementById('shareRankItem');

    selectParamItem.onclick = function () {
        $("#selectParamContent").toggle("slow");
        $("#selectParamItem .showContentFa").toggle("slow");
        if($("#selectParamItem").hasClass("clickFlagOn")){
            var flag = d3.select("#selectParamItem")
                              .attr("class","pure-menu-link clickFlagOff")
                              .style("background","#191818");
/*            flag.selectAll("i").style("color","#f7fcf0");
            flag.selectAll("span").style("color","#f7fcf0");*/
        }else{
            var flag = d3.select("#selectParamItem")
                              .attr("class","pure-menu-link clickFlagOn")
                              .style("background","#f92572");
/*            flag.selectAll("i").style("color","#f92572");
            flag.selectAll("span").style("color","#f92572");*/
        }
    };
    universityTypeItem.onclick = function () {
        $("#universityTypeContent").toggle("slow");
        $("#universityTypeItem .showContentFa").toggle("slow");
        if($("#universityTypeItem").hasClass("clickFlagOn")){
            var flag = d3.select("#universityTypeItem")
                              .attr("class","pure-menu-link clickFlagOff")
                              .style("background","#191818");
/*            flag.selectAll("i").style("color","#f7fcf0");
            flag.selectAll("span").style("color","#f7fcf0");*/
        }else{
            var flag = d3.select("#universityTypeItem")
                              .attr("class","pure-menu-link clickFlagOn")
                              .style("background","#f92572");
/*            flag.selectAll("i").style("color","#f92572");
            flag.selectAll("span").style("color","#f92572");*/
        }
    };
    universityRegionItem.onclick = function () {
        $("#universityRegionContent").toggle("slow");
        $("#universityRegionItem .showContentFa").toggle("slow");
        if($("#universityRegionItem").hasClass("clickFlagOn")){
            var flag = d3.select("#universityRegionItem")
                              .attr("class","pure-menu-link clickFlagOff")
                              .style("background","#191818");
/*            flag.selectAll("i").style("color","#f7fcf0");
            flag.selectAll("span").style("color","#f7fcf0");*/
        }else{
            var flag = d3.select("#universityRegionItem")
                              .attr("class","pure-menu-link clickFlagOn")
                              .style("background","#f92572");
/*            flag.selectAll("i").style("color","#f92572");
            flag.selectAll("span").style("color","#f92572");*/
        }
    };
    shareRankItem.onclick = function () {
        $("#shareRankContent").toggle("slow");
        $("#shareRankItem .showContentFa").toggle("slow");
        if($("#shareRankItem").hasClass("clickFlagOn")){
            var flag = d3.select("#shareRankItem")
                              .attr("class","pure-menu-link clickFlagOff")
                              .style("background","#191818");
/*            flag.selectAll("i").style("color","#f7fcf0");
            flag.selectAll("span").style("color","#f7fcf0");*/
        }else{
            var flag = d3.select("#shareRankItem")
                              .attr("class","pure-menu-link clickFlagOn")
                              .style("background","#f92572");
/*            flag.selectAll("i").style("color","#f92572");
            flag.selectAll("span").style("color","#f92572");*/
        }
    };
}(this, this.document));
