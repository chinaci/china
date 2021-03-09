$(function(){

    //地图
    var map = new BMap.Map('map_canvas',{enableMapClick:false});
    var poi = new BMap.Point(longitude,latitude);
    map.centerAndZoom(poi, 16);
    var html = ["<div class='infoBoxContent'>",
    "<div class='list'><a target='_blank' href='https://api.map.baidu.com/marker?location="+latitude+','+longitude+"&title=&content="+txt+"&output=html' class='fn-clear'><div class='left_b'><img src='"+ templatePath +"images/region.png'></div><div class='right_b'>"+txt+"</div>"
    ,"</a></div>"
    ,"</div>"];
    var infoBox = new BMapLib.InfoBox(map,html.join(""),{
        boxStyle:{
            width: "270px"
            ,height: "80px"
        }
        ,enableAutoPan: true
        ,align: INFOBOX_AT_TOP
    });

    var marker = new BMap.Marker(poi);
    infoBox.open(marker);
    // marker.enableDragging();

    $('.infoBoxContent').siblings('img').remove();



})
