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
        $("#selectParamContent").toggle();
        $("#selectParamItem .showContentFa").toggle();
    };
    universityTypeItem.onclick = function () {
        $("#universityTypeContent").toggle();
        $("#universityTypeItem .showContentFa").toggle();
    };
    universityRegionItem.onclick = function () {
        $("#universityRegionContent").toggle();
        $("#universityRegionItem .showContentFa").toggle();
    };
    shareRankItem.onclick = function () {
        $("#shareRankContent").toggle();
        $("#shareRankItem .showContentFa").toggle();
    };

}(this, this.document));
