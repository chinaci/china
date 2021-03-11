$(function(){

  toggleDragRefresh('off');

  // 清除cookie
  $.cookie(cookiePre+'paotui_shop', null);
  $.cookie(cookiePre+'paotui_buyfrom', null);
  $.cookie(cookiePre+'paotui_buyaddress', null);
  $.cookie(cookiePre+'paotui_buyaddress_lng', null);
  $.cookie(cookiePre+'paotui_buyaddress_lat', null);
  // banna轮播图
	var mySwiper1 = new Swiper('.swiper-container1', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true,});
  var activeIndex = 0;
  // tab切换
  var tabsSwiper = new Swiper('#tabs-container',{
    speed:500,
    autoHeight: true,
    onSlideChangeStart: function(){
      activeIndex = tabsSwiper.activeIndex;
      $(".tabs a").eq(activeIndex).addClass('active').siblings().removeClass('active');
      if(activeIndex == 0){
        $('.topMap').removeClass('fn-hide');
        $('.banner').addClass('fn-hide');
      }else{
        $('.topMap').addClass('fn-hide');
        $('.banner').removeClass('fn-hide');
      }
    },
    onSliderMove: function(){
    }
  })
  $(".tabs a").on('touchstart mousedown',function(e){
    e.preventDefault();
    $(".tabs .active").removeClass('active')
    $(this).addClass('active')
    tabsSwiper.slideTo( $(this).index() )
  })
  $(".tabs a").click(function(e){
    e.preventDefault()
  })


  // 帮我买 自定义商品
  $(".buy .submit").click(function(){
    $(this).parent().submit();
  })
  //选择收货取货地址
  $('.song .shoptype li').click(function(){
    var turl = $(this).find('a').attr('data-url1');
    var quLng = $('.gz-addr-seladdr').attr('data-lng'),quLat = $('.gz-addr-seladdr').attr('data-lat');
    var quAdrs = $('.gz-addr-seladdr #addr').val();
    var quAdrr = {'quLng': quLng, 'quLat': quLat,'quAdrs':quAdrs}
    if($(this).index() == 0){
      utils.setStorage('indexquAdress',JSON.stringify(quAdrr));
    }else{
      var quDet = $('.shoptype .qhInfo').html();
      var shouAdrr = {'quLng': quLng, 'quLat': quLat,'quAdrs':quAdrs,'quDet':quDet}
      utils.setStorage('indexshouAdress',JSON.stringify(shouAdrr));
    }

	//if(!wx_miniprogram && !baidu_miniprogram && !qq_miniprogram){
	    window.location.href = turl;
	//}
  })

  $('.header .goBack').click(function(){
    window.location.href = channelDomain;
  })


})
  var quAdrrData = utils.getStorage('indexquAdress');
  // 定位
  var localData = utils.getStorage('waimai_local');
  var localData = '';
  if(localData){
    lat = localData.lat;
    lng = localData.lng;
    address = localData.address;
    //定位点
    stLng = lng;
    stLat = lat;
    stAdress = name;
    if(!qaddress){//取货地址未选择
      if(quAdrrData){//已拖动定位过的情况
        lng = quAdrrData.quLng;
        lat = quAdrrData.quLat;
        address = quAdrrData.quAdrs;
        utils.removeStorage('indexquAdress');
      }
      $('.gz-addr-seladdr').attr('data-lng',lng);
      $('.gz-addr-seladdr').attr('data-lat',lat);
      $('.gz-addr-seladdr').find("input#addr").val(address);
      // 取货默认地址
      $('.shoptype .qhAddress').html(address);
      $('.shoptype .qhInfo').html('填写联系人');
      //中心点坐标
      oldPointLng = lng;
      oldPointLat = lat;
      oldAdress = address;

    }else{//取货地址已选
      oldPointLng = qmylng;
      oldPointLat = qmylat;
      utils.removeStorage('indexquAdress');
    }
    if(oldPointLng && oldPointLat){
      $('.topmap_bg').fadeOut();
      init.createMap();
    }

  }else{
    HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            $(".qsNum").text('定位失败，请刷新页面');
        }else{
          var name = data.name;
          lng = data.lng;
          lat = data.lat;
          city = data.city;
          //定位点
          stLng = lng;
          stLat = lat;
          stAdress = name;
          if(!qaddress){
            if(quAdrrData){//已拖动定位过的情况
              lng = quAdrrData.quLng;
              lat = quAdrrData.quLat;
              address = quAdrrData.quAdrs;
              utils.removeStorage('indexquAdress');
            }
            $('.gz-addr-seladdr').find("input#addr").val(name);
            $('.gz-addr-seladdr').attr('data-lng',lng);
            $('.gz-addr-seladdr').attr('data-lat',lat);
            $('.choseWrap').attr('data-address',name);
            // 取货默认地址
            $('.shoptype .qhAddress').html(name);
            $('.shoptype .qhInfo').html('填写联系人');
            //定位点坐标
            oldPointLng = lng;
            oldPointLat = lat;
            oldAdress = name;

          }else{
            oldPointLng = qmylng;
            oldPointLat = qmylat;
            utils.removeStorage('indexquAdress');
          }

		  if(oldPointLng && oldPointLat){//绘制初始地图
            $('.topmap_bg').fadeOut();
            init.createMap();
          }

        }
    })
  }
