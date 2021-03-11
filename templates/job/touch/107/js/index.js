$(function(){

    //选择城市
    if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'job'}, function(){});
            });
        });
    }


    var typed = 0;

    // banner轮播图
    new Swiper('.banner .swiper-container', {pagination: '.pagination',slideClass:'slideshow-item',paginationClickable: true, loop: true,autoplay:2000, autoplayDisableOnInteraction : false});

    // 微信引导关注
    $('.wechat-fix').bind('click', function(){
      $('.wechat-popup').show();
      $('.mask').show();
    });

    $('.wechat-popup .close').bind('click', function(){
      $('.wechat-popup').hide();
      $('.mask').hide();
    });

      $(".gotop").click(function() {
        $(window).scrollTop(0);
      });

    //点击变换一句话招聘和一句话求职
    $('.onefind_txt>div').click(function(){
      var t = $(this);
      var id = t.data("id");
      typed = id;
      $(".onefindList .more a").prop("href", $(".onefindList .more a").attr('data-href').replace('##', id));
      if(!t.hasClass('active')){
        t.addClass('active');
        t.siblings().removeClass('active');
      }
      $(".onefind .onefindList ul").html("");
      $(".onefind .onefindList ul").append('<div class="loading">加载中...</div>');
      onefindList();
    });

    // 一句话招聘和一句话求职
    onefindList();
    function onefindList(){
        $.ajax({
            url: "/include/ajax.php?service=job&action=sentence&pageSize=6&page=1",
            data:'type='+typed,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              if(data){
                if(data.state == 100){
                  $(".onefind .onefindList ul .loading").remove();
                  var list = data.info.list, html = [];
                  if(list.length > 0){
                    for(var i = 0; i < list.length; i++){
                      html.push('<li class="fn-clear">');
                      html.push('  <div class="list_left">'+ (i+1) +'</div>');
                      html.push('  <div class="list_right">');
                      html.push('      <div class="fn-clear list_right_title"><span>'+list[i].title+'</span><span>'+list[i].people+'</span></div>');
                      html.push('        <div class="fn-clear list_right_number">');
                      var userid = $.cookie(cookiePre+"login_user");
                      var areaCode = list[i].areaCode;
                      var code = '',code2='';
                      if(areaCode != '' && areaCode != '86'){
                          code = '+'+areaCode+' ';
                          code2 = areaCode;
                      }
                      if(userid == null || userid == ""){
                        html.push('        <a href="'+masterDomain+'/login.html"><div class="onlogin"><span>登录后显示联系方式</span></div></a>');
                      }else{
                        html.push('        <a href="tel:'+code2+list[i].contact+'"><div class="elephone"><span>拨号</span><span>'+code+list[i].contact+'</span></div></a>');
                      }

                      html.push('        <div class="state">'+list[i].pubdate1+'</div>');
                      html.push('          </div>');
                      html.push('          </div>');
                      html.push('          </li>');
                    }
                    $(".onefind .onefindList ul").append(html.join(""));
                  }
                }
              }
            },
            error: function(){
              isload = false;
              $(".onefind .onefindList ul").html('<div class="loading">网络错误，加载失败！</div>');
            }
        })
    };

    //最新推荐企业
    recommendList();
    function recommendList(){
      $.ajax({
            url: "/include/ajax.php?service=job&action=company&property=r&pageSize=5",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data){
                  if(data.state == 100){
                    var list = data.info.list, html = [];
                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){
                            html.push('<li class="fn-clear">');
                            html.push('  <a href="'+list[i].url+'" data-url="'+list[i].url+'" >');
                            html.push('    <div class="img_user"><img src="'+list[i].logo+'"></div>');
                            html.push('    <div class="txt_user">');
                            html.push('        <div class="txt01 fn-clear"><span>'+list[i].title+'</span><span>'+list[i].addr[1]+'</span></div>');
                            html.push('        <p class="txt02">该企业有<em>'+list[i].pcount+'</em>个在招职位</p>');
                            html.push('        <div class="txt03"><span>'+list[i].scale+'</span><em>|</em><span>'+list[i].nature+'</span><em>|</em><span>'+list[i].industry+'</span></div>');
                            html.push('     </div>');
                            // html.push('     <i></i>');
                            html.push('   </a>');
                            html.push(' </li>');
                        }

                        $('.recommend_qiye .list ul').append(html.join(""));
                    }else{
                        isload = true;
                        $(".list-box").append('<div class="loading">暂无相关信息</div>');
                    }
                  }
                }
              }
          })

    };
    function getNatureText(num){
        switch (num){
            case '0' :
                return '全职';
            case '1':
                return '兼职';
            case '2':
                return '临时';
            case '3':
                return '实习';
            default :
                return '未知';
        }
    }
     zhiweiList();
     function zhiweiList(){
      $.ajax({
          url: "/include/ajax.php?service=job&action=post&pageSize=5",
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
              if(data){
                  if(data.state == 100){
                      var list = data.info.list, html = [];
                      if(list.length > 0){
                          for(var i = 0; i < list.length; i++){
                              var welfare = list[i]['company'] ? list[i]['company']['welfare'].split(',') : '';
                              var welfare_html = '';
                              if(welfare != ''){
                                  for (var j = 0; j < welfare.length; j++){
                                      welfare_html += '<span>'+welfare[j]+'</span>';
                                  }
                              }
                              var is_top = '';
                              if(list[i].isbid == 1){
                                  is_top = '<i></i>'
                              }

                              // list[i].pubdate =  new Date(parseInt(list[i].pubdate) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
                              var pic = hideFileUrl ? (list[i]['company'] ? list[i]['company'].logoSource : '') : (list[i]['company'] ? list[i]['company'].logo : '');
                              pic = pic == '' ? '/static/images/blank.gif' : pic;
                              html.push('<li>');
                              html.push('  <a href="'+list[i].url+'">');
                              html.push('    <div class="zhiwei_title">');
                              html.push('          <div class="title_01">'+list[i].title+'</div>');
                              html.push('          <div class="title_02 fn-clear"><span>'+list[i]['addr'][1]+'</span><span>'+list[i].experience+'</span><span>'+list[i].educational+'</span>'+getNatureText(list[i].nature)+'<p>'+list[i].salary+'</p></div>');
                              html.push('          <div class="title_03 fn-clear">'+list[i].type+'<em>'+list[i].timeUpdate+'</em></div>');
                              html.push('     </div>');
                              if(list[i]['company']) {
                                  html.push('     <div class="title_04 fn-clear">');
                                  html.push('         <div class="img_left"><img src="' + pic + '"></div>');
                                  html.push('         <div class="txt_right">');
                                  html.push('             <p>' + list[i]['company']['title'] + '</p>');
                                  html.push('             <div><span>' + list[i]['company']['scale'] + '</span><em>|</em><span>' + list[i]['company']['nature'] + '</span><em>|</em><span>' + list[i]['company']['industry'][1] + '</span></div>');
                                  html.push('         </div>');
                                  html.push('     </div>');
                              }
                              html.push(is_top);
                              html.push('   </a>');
                              html.push('</li>');
                          }
                          $('.recommend_zhiwei .list ul').append(html.join(""));
                      }
                    }
                  }
              }
        })

    };


    //获取头条资讯
    $.ajax({
        url : "/include/ajax.php?service=job&action=news&pageSize=6",
        type : "GET",
        data : {},
        dataType : "json",
        success : function (data) {
            var obj = $(".mBox .swiper-wrapper");
            if(data.state == 100){
                var list = data.info.list;
                var html = '';
                var length = list.length;
                for (var i = 0; i < length; i++){
                    if(i < length){
                        if(i % 2 != 0 ){
                            continue;
                        }
                    }
                    var html2 = '';
                    if(i != length-1){
                        html2 = '<p><span>'+list[i+1].date.substr(0, 10).split('-')[1]+'/'+list[i+1].date.substr(0, 10).split('-')[2]+'</span><a href="'+list[i+1].url+'">'+list[i+1].title.substr(0, 17)+' ...</a></p>'
                    }
                    html += '<div class="swiper-slide swiper-no-swiping">' +
                        '<div class="mlBox">' +
                        '<p><span>'+list[i].date.substr(0, 10).split('-')[1]+'/'+list[i].date.substr(0, 10).split('-')[2]+'</span><a href="'+list[i].url+'">'+list[i].title.substr(0, 17)+' ...</a></p>' +
                        html2 +
                        '</div>' +
                        '</div>';

                }
                obj.html(html);
                new Swiper('.tcNews .swiper-container', {direction: 'vertical', pagination: { el: '.tcNews .swiper-pagination',clickable: true,},loop: true,autoplay:4000,observer: true,observeParents: true });

            }
        }
    });

})
