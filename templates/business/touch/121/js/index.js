$(function () {
    //选择城市
    if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'business'}, function(){});
            });
        });
    }


     // banner轮播图
     new Swiper('.banner .swiper-container', {pagination: '.banner .pagination',slideClass:'slideshow-item',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});


    //导航
    $.ajax({
        type: "POST",
        url: "/include/ajax.php",
        dataType: "json",
        data: 'service=business&action=type',
        success: function (data) {
            if(data && data.state == 100){
                var tcInfoList = [], list = data.info;
                for (var i = 0; i < list.length; i++){
                    if(list[i].code != 'special' && list[i].code != 'paper' && list[i].code != 'website'){
                        tcInfoList.push('<li><a href="'+typeUrl.replace('%id', list[i].id)+'"><span class="icon-circle"><img src="'+(list[i].iconturl ? list[i].iconturl : '/static/images/type_default.png')+'"></span><span class="icon-txt">'+list[i].typename+'</span></a></li>');
                    }
                }

                var liArr = [];
                for(var i = 0; i < tcInfoList.length; i++){
                    liArr.push(tcInfoList.slice(i, i + 10).join(""));
                    i += 9;
                }

                $('.tcInfo .swiper-wrapper').html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
                new Swiper('.tcInfo .swiper-container', {pagination: '.tcInfo .pagination', loop: false, grabCursor: true, paginationClickable: true});

            }else{
                $('.tcInfo').hide();
            }
        },
        error: function(){
            $('.tcInfo').hide();
        }
    });


   // 电话弹框
    $(".tel").on("touchend",function(){
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-telphone').addClass('curr');
        return false;
    });
    // 关闭
    $(".modal-public .modal-main .close").on("touchend",function(){
        $("html, .modal-public").removeClass('curr nos');
        return false;
     })
    $(".bgCover").on("click",function(){
        $("html, .modal-public").removeClass('curr nos');
    })

    var lng = lat = 0;
    var page = 1, isload = false;

    // 获取推荐商家
    function getList(){
      if(isload) return false;
      isload = true;
      var pageSize = 4;
      $.ajax({
        url: masterDomain+'/include/ajax.php?service=business&action=blist&store=2&orderby=3&page='+page+'&pageSize='+pageSize+'&lng='+lng+'&lat='+lat,
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
          if(data && data.state == 100){
            var html = [];

            for(var i = 0; i < data.info.list.length; i++){
              var d = data.info.list[i];

              html.push('<li class="fn-clear">');
              html.push('  <div class="rleft">');
              html.push('    <a href="'+d.url+'"><img src="'+(d.logo ? d.logo : (templets + 'images/fShop.png'))+'" alt=""></a>');
              if(d.face_qj == "1"){
                html.push('    <div class="mark mark1">全景</div>');
              }
              if(d.face_video == "1"){
                html.push('    <div class="mark mark3">视频</div>');
              }
              html.push('  </div>');
              html.push('  <div class="rright">');
              html.push('   <a href="'+d.url+'">');
              html.push('    <div class="rtitle fn-clear">'+(d.top == "1" ? '<i></i>' : '')+'<p>'+d.title+'</p> '+(d.type == "2" ? '<em></em>' : '')+'&nbsp;</div>');
              html.push('    <p class="comment"><span class="starbg"><i class="star" style="width: '+(d.sco1 / 5 * 100)+'%;"></i></span>'+d.comment+'评论</p>');
              html.push('    <p class="addr">'+d.address+'<span>'+d.distance+'</span></p>');
              html.push('   </a>');
              if(d.tel != ""){
                html.push('    <a href="tel:'+d.tel+'" class="tel">');
                html.push('      <img src="'+templets+'images/hPhone.png" alt="">');
                html.push('    </a>');
              }
              html.push('  </div>');
              html.push('</li>');
            }

            if(page == 1){
                $('.recomBus ul').html(html.join(''));
            }else {
                $('.recomBus ul').append(html.join(''));
            }

            if(data.info.pageInfo.totalPage <= page){
              $('.btnMore').text('已加载全部数据').addClass('disabled');
            }else{
              isload = false;
            }

            if(page == 1){
              insertLastJoin(data.info.list);
            }

          }else{
            $('.btnMore').text('暂无相关信息');
            $('.tcNews .swiper-wrapper').html('<p class="load">暂无相关入驻信息！</p>');

            if(page == 1){
                $('.recomBus ul').hide();
            }
          }
        },
        error: function(){
          if(page == 1){
              $('.tcNews .swiper-wrapper').html('<p class="load">网络错误，加载失败！</p>');
              $('.recomBus ul').hide();
          }
          $('.btnMore').text('网络错误，请重试');
          page = page > 1 ? page - 1 : 1;
        }
      })
    }
    function checkLocal(){
      var local = false;
      var localData = utils.getStorage("user_local");
      if(localData){
        var time = Date.parse(new Date());
        time_ = localData.time;
        // 缓存1小时
        if(time - time_ < 3600 * 1000){
          lat = localData.lat;
          lng = localData.lng;
          local = true;
        }

      }

      if(!local){
        HN_Location.init(function(data){
          if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            lat = lng = -1;
            getList();
          }else{
            lng = data.lng;
            lat = data.lat;

            var time = Date.parse(new Date());
            utils.setStorage('user_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': data.address}));

            getList();
          }
        })
      }else{
        getList();
      }

    }

    $('.btnMore').click(function(){
      var t = $(this);
      if(isload || t.hasClass('disabled')) return;
      page++;
      getList();
    })

    checkLocal();

    // 最新入驻
    function insertLastJoin(list){
      var html = [];
      html.push('<div class="swiper-slide">');
      for(var i = 0; i < list.length; i++){
        var d = list[i];
        html.push('<p><a href="'+d.url+'">['+huoniao.transTimes(d.pubdate, 3).replace('-', '月')+'日] 欢迎<span>'+d.title+'</span>成功入驻</a> </p>');
        if((i + 1) % 2 == 0 && i + 1 < list.length){
          html.push('</div>');
          html.push('<div class="swiper-slide swiper-no-swiping">');
        }
      }
      html.push('</div>');
      $('.tcNews .swiper-wrapper').html(html.join(""));
      new Swiper('.tcNews .swiper-container', {pagination: '.tcNews .pagination',direction: 'vertical',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});
    }
})
