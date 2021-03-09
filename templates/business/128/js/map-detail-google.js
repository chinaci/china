$(function () {

    // 初始化地图
    init();
    function init(){
        centerPoint = new google.maps.LatLng(parseFloat(pageData.lat), parseFloat(pageData.lng));

        map = new google.maps.Map(document.getElementById('allmap'), {
            zoom: 14,
            center: centerPoint,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        });
        addcenMarker();
    }

    var centerwindow = new google.maps.InfoWindow({
        content: '<div style="font-weight: 700; font-size: 16px;">' + pageData.panName + '</div>' + '<p style="line-height: 3em;">详细地址：' + pageData.address + '</p>'
    });
    // 添加中心点
    function addcenMarker() {
        var marker = new google.maps.Marker({
            position: centerPoint,
            map: map,
            title: pageData.panName,
            icon: cenicon,
        });

        // 中心点点击事件
        marker.addListener('click', function() {
            centerwindow.open(map, marker);
        });


    }


});