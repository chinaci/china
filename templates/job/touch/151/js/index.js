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
    var typed = 0;
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

		var userid = $.cookie(cookiePre+"login_user");

        $.ajax({
            url: "/include/ajax.php?service=job&action=sentence&pageSize=4&page=1",
            data:'type='+typed,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              console.log(data)
              if(data){
                if(data.state == 100){

                  $(".onefind .onefindList ul .loading").remove();
                  var list = data.info.list, html = [];
                  if(list.length > 0){
                    for(var i = 0; i < list.length; i++){
                      html.push('<li class="fn-clear">');
                      html.push('  <div class="list_num"><a href="'+list[i].url+'" class="li_a"><strong>0'+ (i+1) +'</strong></a></div>');
                      html.push('  <div class="peo_info">');
                      html.push('     <a href="'+($(".onefindList .more a").attr('data-href').replace('##', typed))+'" class="li_a">');
                      if(typed == 0){
                        html.push('       <h2 class="peo_name">'+list[i].title+'</h2><span>');
                        html.push('       <p class="peo_job">'+list[i].note+'</p>');

                      }else{
                        html.push('       <h2 class="peo_name">'+list[i].people+'</h2><span>');
                        html.push('       <p class="peo_job">'+list[i].title+'</p>');
                      }

                      html.push('     </a>');
                      html.push('   </div>');
					  if(userid == null || userid == ""){
	                      html.push('   <div class="list_r"><a href="'+masterDomain+'/login.html" class="phone_a"><i></i><span>打电话</span></a></div> ');
					  }else{
	                      html.push('   <div class="list_r"><a href="tel:'+list[i].contact+'" class="phone_a"><i></i><span>打电话</span></a></div> ');
					  }
                      html.push('</li>');
                    }
                    $(".onefind .onefindList ul").append(html.join(""));
                  }
                }else{
                  $(".onefind .onefindList ul").html('<div class="loading">暂无数据</div>');
                }
              }
            },
            error: function(){
              isload = false;
              $(".onefind .onefindList ul").html('<div class="loading">网络错误，加载失败！</div>');
            }
        })
    };
    //招聘会
    zhaopinList();
    function zhaopinList(){
        $.ajax({
            url: "/include/ajax.php?service=job&action=fairs&pageSize=6&page=1",
            data:'type='+typed,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              if(data){
                if(data.state == 100){
                  var list = data.info.list, html = [];
                  if(list.length > 0){
                    for(var i = 0; i < list.length; i++){
                      html.push('<div class="swiper-slide"> ');
                      html.push('  <a href="'+list[i].url+'" data-url="'+list[i].url+'">');
                      html.push('     <div class="org_img">');
                      html.push('       <img src="'+(list[i]['fairs']['pics'] && list[i]['fairs']['pics'].length > 0 ? list[i]['fairs']['pics'][0]['pic'] : '')+'" onerror="this.src=\'/static/images/404.jpg\'" alt="">');
                      html.push('      </div>');
                      html.push('      <p class="org_title">'+list[i].title+'</p>');
                      html.push('   </a>');
                      html.push('</div>');
                    }
                    $(".org_service .swiper-wrapper").append(html.join(""));
                    //横向滚动
                    var swiper = new Swiper('.org_service .swiper-container', {
                      slidesPerView: 1.6,
                      spaceBetween: 20,
                    });
                  }
                }else{
                  $(".org_service .swiper-wrapper").html('<div class="loading">暂无数据</div>');
                }
              }
            },
            error: function(){
              isload = false;
              $(".org_service .swiper-wrapper").html('<div class="loading">网络错误，加载失败！</div>');
            }
        })
    };


    //热门企业
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
                            html.push('    <div class="txt_user">');
                            html.push('        <div class="txt01 fn-clear"><span>'+list[i].title+'</span></div>');
                            html.push('        <p class="txt02">该企业有<em>'+list[i].pcount+'</em>个在招职位</p>');
                            html.push('        <div class="txt03"><span>'+list[i].addr[list[i].addr.length-1]+'</span><em>·</em><span>'+list[i].scale+'</span><em>·</em><span>'+list[i].nature+'</span><em>·</em><span>'+list[i].industry+'</span></div>');
                            html.push('     </div>');
                            html.push('    <div class="img_user"><img src="'+list[i].logo+'"></div>');
                            html.push('   </a>');
                            html.push(' </li>');
                        }

                        $('.recom_qiye .list ul').append(html.join(""));
                    }else{
                        isload = true;
                        $(".list").append('<div class="loading">暂无相关信息</div>');
                    }
                  }
                }
              }
          })

    };


    //点击变换推荐和最新
    $('.job_txt>div').click(function(){
      var t = $(this);
      var id = t.data("id");
      typed = id;
      if(!t.hasClass('active')){
        t.addClass('active');
        t.siblings().removeClass('active');
      }

      zhiweiList(1);
    });

// 下拉加载
    var isload=false;
    var atpage=1;
  /**
    $(window).scroll(function() {
        var h = $('.list ul li').height();
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w - 10;
        if ($(window).scrollTop() >= scroll && !isload) {
            atpage++;
            zhiweiList();
        };
    });
    **/
  	$('.loadMore').click(function(){
      atpage++;
      zhiweiList();
    })

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
    function getSalaryTxt(salary) {
     // console.log(salary);
      if(salary == '面议') return salary;
      var salaArr = salary.split('～');
      var aNewArr = [];
      for (var i = 0; i < salaArr.length; i++) {
      var salaryLen = salaArr[i].length;
      var aNew;
      var re = /([0-9]+\.[0-9]{2})[0-9]*/;
      if (salaryLen <= 4) {
        aNew = Math.floor((salaArr[i] / 1000) * 10) / 10 + '千';
      } else {
        aNew = Math.floor((salaArr[i] / 10000) * 10) / 10 + '万';
      }
      aNewArr.push(aNew);
      }
      return aNewArr.join('-') + '/月';
    }
     zhiweiList();
     function zhiweiList(tr){
      isload=true;
       if(tr){
         atpage = 1;
         $(".recom_job .list ul").html("");
       }
       $('.recom_job .list ul .loading').remove();
       $('.recom_job .list ul').append('<div class="loading">加载中...</div>')
      $.ajax({
          url: "/include/ajax.php?service=job&action=post&page="+atpage +"&pageSize=10",
          data:'property='+($('.recom_job .job_txt .active').attr('data-id') == '0' ? 'r' : ''),
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
              if(data){
                  if(data.state == 100){
                    $(".recom_job .list .loading").remove();
                      var list = data.info.list, html = [];
                      var totalpage = data.info.pageInfo.totalPage;

                      if(list.length > 0){

                          for(var i = 0; i < list.length; i++){
                              //福利待遇
                              var welfare = list[i]['company'] ? list[i]['company']['welfare'].split(',') : '';
                              var welfare_html = '';
                              if(welfare != ''){
                                  for (var j = 0; j < welfare.length; j++){
                                      welfare_html += '<span>'+welfare[j]+'</span>';
                                  }
                              }
                              //置顶
                              var is_top = '';
                              if(list[i].isbid == 1){
                                  is_top = '<i></i>'
                              }
                              var pic = hideFileUrl ? (list[i]['company'] ? list[i]['company'].logoSource : '') : (list[i]['company'] ? list[i]['company'].logo : '');
                              pic = pic == '' ? '/static/images/blank.gif' : pic;
                              html.push('<li>');
                              html.push('  <a href="'+list[i].url+'">');
                              html.push('    <div class="zhiwei_title">');
                              html.push('          <div class="title_01">'+is_top+'<span>'+list[i].title+'</span><p>'+list[i].salary+'</p></div>');
                              html.push('          <div class="title_02 fn-clear"><span>'+list[i]['addr'][list[i]['addr'].length-1]+'<em>|</em></span><span>'+list[i].experience+'<em>|</em></span><span>'+list[i].educational+'<em>|</em></span>'+getNatureText(list[i].nature)+'<em class="pub_time">'+list[i].timeUpdate+'</em></div>');
                              if(welfare != ''){
                                  html.push('          <div class="title_03 fn-clear">'+welfare_html+'</div>');
                              }

                              html.push('     </div>');
                              if(list[i]['company']) {
                                  html.push('     <div class="title_04 fn-clear">');
                                  html.push('         <div class="img_left"><img src="' + pic + '"></div>');
                                  html.push('         <div class="txt_mid">');
                                  html.push('             <p>' + list[i]['company']['title'] + '</p>');
                                  html.push('             <div><span>' + list[i]['company']['scale'] + '</span><em>·</em><span>' + list[i]['company']['nature'] + '</span><em>·</em><span>' + list[i]['company']['industry'][0] + '</span></div>');
                                  html.push('         </div>');
                                  html.push('         <div class="tou_right yp" >立即投递</div>');
                                  html.push('     </div>');
                              }
                             // html.push(is_top);
                              html.push('   </a>');
                              html.push('</li>');
                          }
                          $('.recom_job .list ul').append(html.join(""));
                          isload = false;

                            //最后一页
                            if(atpage >= totalpage){
                                isload = true;
                                $(".recom_job .list ul").append('<div class="loading">已加载全部</div>');
                                $('.loadMore').hide();
                            }else{
                              	$('.loadMore').show();
                            }

                        //没有数据
                        }else{
                            isload = true;
                          	$('.loadMore').hide();
                            $(".recom_job .list ul").append('<div class="loading">暂无相关信息</div>');
                        }

                    //请求失败
                    }else{
                        $(".recom_job .list .loading").html(data.info);
                        $('.loadMore').hide();
                    }

                //加载失败
                }else{
                    $(".recom_job .list .loading").html('加载失败');
                    $('.loadMore').hide();
                }
            },
            error: function(){
                isload = false;
                $(".recom_job .list .loading").html('网络错误，加载失败！');
                $('.loadMore').hide();
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
                        html2 = '<p><span>招聘现场</span><a href="'+list[i+1].url+'">'+list[i+1].title.substr(0, 17)+' ...</a></p>'
                    }
                    html += '<div class="swiper-slide swiper-no-swiping">' +
                        '<div class="mlBox">' +
                        '<p><span>人才速递</span><a href="'+list[i].url+'">'+list[i].title.substr(0, 17)+' ...</a></p>' +
                        html2 +
                        '</div>' +
                        '</div>';

                }
                obj.html(html);
                new Swiper('.tcNews .swiper-container', {direction: 'vertical', pagination: { el: '.tcNews .swiper-pagination',clickable: true,},loop: true,autoplay:4000,observer: true,observeParents: true });

            }
        }
    });

    //打电话 li样式

    $(".onefindList li .li_a").on('touchstart',function(){

      $(this).parents('li').addClass('active');
    },false);

    $(".onefindList li .li_a").on('touchend',function(){

      $(this).parents('li').removeClass('active');
    },false);


  //立即投递 li样式
  $('.recom_job .list ul').delegate('li','touchstart',function(e){
    if(e.target != $(this).find('.tou_right')[0]){
      console.log(111);
      $(this).addClass('active');
    }else{
      $(this).removeClass('active');
    }
  });
  $('.recom_job .list ul').delegate('li','touchend',function(e){

      $(this).removeClass('active');

  });

 //立即投递
  $('.recom_job').delegate('.tou_right','click',function(e){
    //e.stopPropagation();

    //return false;

    // var t = $(this);
    // if(t.hasClass("disabled")) return false;

    // var userid = $.cookie(cookiePre+"login_user");
    // if(userid == null || userid == ""){
    //   location.href = masterDomain + '/login.html'
    //   return false;
    // }

    // t.addClass("disabled");

    // $.ajax({
    //   url: masterDomain + "/include/ajax.php?service=job&action=delivery&id="+id,
    //   type: "GET",
    //   dataType: "jsonp",
    //   success: function (data) {
    //     t.removeClass("disabled");
    //     if(data.state == 100){
    //       if(data.info.url!=undefined && data.info.url!=null){
    //         location.href = data.info.url;
    //         return false;
    //       }
    //        $('.t_yes').css('display','block');
    //        $('.mask').css('display','block');
    //         setTimeout(function(){
    //           $('.t_yes').css('display','none');
    //         $('.mask').css('display','none');
    //         },2000);
    //     }else{
    //       alert(data.info)
    //     }
    //   },
    //   error: function(){
    //     t.removeClass("disabled");
    //     $('.t_no').css('display','block');
    //      $('.mask').css('display','block');
    //       setTimeout(function(){
    //         $('.t_no').css('display','none');
    //         $('.mask').css('display','none');
    //       },2000);
    //   }
    // });

  })

})
