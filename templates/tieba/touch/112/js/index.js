$(function () {
  var device = navigator.userAgent;
    if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {'module': 'tieba'}, function(){});
            });
        });
    }

	// banner轮播图
  	new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});
    // 滑动导航
    var t = $('.swiper-nav .swiper-wrapper');
    var swiperNav = [], mainNavLi = t.find('li');
    for (var i = 0; i < mainNavLi.length; i++) {
        swiperNav.push('<li>'+t.find('li:eq('+i+')').html()+'</li>');
    }

    var liArr = [];
    for(var i = 0; i < swiperNav.length; i++){
        liArr.push(swiperNav.slice(i, i + 10).join(""));
        i += 9;
    }

    t.html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
    new Swiper('.swiper-nav .swiper-container', {pagination: {el:'.swiper-nav .pagination',}, loop: false, grabCursor: true, paginationClickable: true});

    //客户端发帖
	setupWebViewJavascriptBridge(function(bridge) {
		$(".fabu-btn").bind("click", function(event){
			if (device.indexOf('huoniao_Android') > -1) {
				event.preventDefault();
				var userid = $.cookie(cookiePre+"login_user");
				if(userid == null || userid == ""){
					location.href = masterDomain + "/login.html";
					return false;
				}
				bridge.callHandler("postTieba", {}, function(responseData) {});
			}
		});
	});

	getFormat();
  	function getFormat(){
		$.ajax({
	      url: "/include/ajax.php?service=tieba&action=getFormat",
	      type: "GET",
	      dataType: "json",
	      success: function (data) {
	        if(data.state == 100){
				$('.user').text(data.info.memberTotal);
				$('.views').text(data.info.tiziTotal);
				$('.today').text(data.info.tiziTodayTotal);
	        }else{
				$('.user').text(0);
				$('.views').text(0);
				$('.today').text(0);
	        }
	      }
	    });
  	}

//左右导航切换(推荐信息、推荐店铺)
var navbar = $('.recomTab');
var navHeight = navbar.offset().top;
var isload = false;
var tabsSwiper = new Swiper('#tabs-container',{
    speed:350,
    autoHeight: true,
    touchAngle : 35,
    observer: true,
    observeParents: true,
    freeMode : false,
    longSwipesRatio : 0.1,
    on: {
          slideChangeTransitionStart: function(){
          	isload = false;
          	$(".recomTab .active").removeClass('active');
          	$(".recomTab li").eq(tabsSwiper.activeIndex).addClass('active');
          	if (navbar.hasClass('topfixed')) {
            	$(window).scrollTop(navHeight + 2);
          	}

			//$('#tabs-container .swiper-wrapper').css('height', 'auto');
          	$("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

          	// 当模块的数据为空的时候加载数据
          	if($.trim($("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find("ul").html()) == ""){
              $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find('ul').html('<div class="loading">加载中...</div>')
              getList();
          	}

        },
    on:{
    	sliderMove:function(){}
   	  },
   	on:{
   		slideChangeTransitionEnd: function(){}
   	 }
    },

  })


$(".recomTab li").on('touchstart mousedown',function(e){
    e.preventDefault();
    $(".recomTab .active").removeClass('active');
    $(this).addClass('active');
    tabsSwiper.slideTo( $(this).index() );
});

  // 导航吸顶
$(window).on("scroll",function() {
   var sct = $(window).scrollTop();
   if ($(window).scrollTop() > navHeight) {
       $('.recomTab').addClass('topfixed');
   } else {
       $('.recomTab').removeClass('topfixed');
       $('.gotop').hide();
   }
   if (sct + $(window).height() + 50 > $(document).height() && !isload) {
       var page = parseInt($('.recomTab .active').attr('data-page')),
           totalPage = parseInt($('.recomTab .active').attr('data-totalPage'));
       if (page < totalPage) {
           ++page;
           $('.recomTab .active').attr('data-page', page);
           getList();
       }
   }

});

//加载帖子列表
getList();

function getList(){
	  var active = $('.recomTab .active'), action = active.attr('data-action'), url;
    var page = active.attr('data-page');
    if (action == "recomTop") {
        if(page == 1){
           $(".recomlist").html('<div class="loading">加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=tieba&action=tlist&istop=1&page="+page+"&pageSize="+pageSize +"";
    }else if(action == "newFabu"){
        if(page == 1){
           $(".newfblist").html('<div class="loading">加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=tieba&action=tlist&orderby=pubdate&page="+page+"&pageSize="+pageSize +"";
    }else if(action == "imgTie"){
        if(page == 1){
           $(".imglist").html('<div class="loading">加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=tieba&action=tlist&ispic=1&page="+page+"&pageSize="+pageSize +"";
    }else if(action == "videoTie"){
        if(page == 1){
           $(".videolist").html('<div class="loading">加载中...</div>');
        }
    	  url =  masterDomain + "/include/ajax.php?service=tieba&action=tlist&ispic=2&page="+page+"&pageSize="+pageSize +"";
    }

   isload = true;


    $.ajax({
       url: url,
       type: "GET",
       dataType: "jsonp",
       success: function (data) {
              if (data && data.state == 100) {
                  $(".loading").remove();
                  var list = data.info.list, pageInfo = data.info.pageInfo, page = pageInfo.page, html = [];
                  var totalPage = data.info.pageInfo.totalPage;
                  active.attr('data-totalPage', totalPage);
                  for (var i = 0, lr; i < list.length; i++) {
                      lr = list[i];
                      var photo = lr.photo == "" ? staticPath+'images/noPhoto_100.jpg' : lr.photo;
                          html.push('<li class="fn-clear"  data-id="'+lr.id+'">');
                          html.push('<a href="'+lr.url+'">');
                          html.push('<div class="rtop fn-clear">');
                          html.push('<div class="rpic"><img src="'+photo+'" alt=""></div>');
                          html.push('<div class="rinfo">');
                          html.push('<h4>'+lr.username+' <span class="rtime">'+transTimes(lr.pubdate, 1)+'</span></h4>');
                          html.push('<p><span class="rstyle">'+lr.typename+'</span> <span class="rpos">'+lr.ipAddress+'</span></p></div>');
                          html.push('</div>');
                          html.push('<div class="rmain">');
                          html.push('<div class="mtext"><p>'+lr.title+'');
                          if(lr.top == "1"){
                              html.push('<span class="mtop">置顶</span>');
                          }
                          if(lr.jinghua == "1"){
                              html.push('<span class="jinghua">精华</span>');
                          }
                          html.push('</p></div>');
                          // 图集
                          if(lr.imgGroup && lr.imgGroup.length > 0){
                              html.push('<div class="mmpic">');
                              if(lr.imgGroup.length > 3){
                                   html.push('<span class="picNum">'+lr.imgGroup.length+'张</span>');
                              }

                              if(lr.imgGroup.length == 1){
                                html.push('<div class="picbox" style="height:2.5rem;">');
                                for(var g = 0; g < lr.imgGroup.length; g++){
                                   if(g < lr.imgGroup.length){
                                       html.push('<img src="'+lr.imgGroup[g]+'" style="width:60%;height:2.5rem;" alt="">');
                                    }
                                }
                                html.push('</div>');
                              }else if(lr.imgGroup.length == 2){
                                html.push('<div class="picbox" style="height:2rem;">');
                                for(var g = 0; g < lr.imgGroup.length; g++){
                                   if(g < lr.imgGroup.length){
                                       html.push('<img src="'+lr.imgGroup[g]+'" style="width:49%;height:2rem;" alt="">');
                                    }
                                }
                                html.push('</div>');
                              }else{
                                html.push('<div class="picbox" style="height:1.67rem;">');
                                for(var g = 0; g < lr.imgGroup.length; g++){
                                   if(g < lr.imgGroup.length){
                                       html.push('<img src="'+lr.imgGroup[g]+'" style="width:32.3%;height:1.67rem;"  alt="">');
                                    }
                                }
                                html.push('</div>');
                              }
                              html.push('</div>');
                          }else{
                              html.push('<div class="textbox">'+lr.content+'</div>');
                          }

                          // 视频显示
                          // if(lr.video){
                          //     html.push('<video width="100%" height="100%" controls="" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline controlslist="nodownload noremote footbar" src="http://www.weaver.com.cn/mobile/About/Audio/profileld2017.mp4" poster="{#$templets_skin#}upfile/vposter.png"></video>');
                          // }
                          html.push('</div>');
                          html.push('<div class="rbottom fn-clear"><p>'+lr.click+'人阅读</p>');
                          html.push('<p><span class="comNum"><i></i>'+lr.reply+'</span><span class="upNum"><i></i>'+lr.up+'</span></p>');
                          html.push('</div>');
                          html.push('</a></li>');
                  }

                  if (action == "recomTop") {
                      if(page == 1){
                          $(".recomlist").html(html.join(""));
                      }else{
                          $(".recomlist").append(html.join(""));
                      }
                  }else if(action == "newFabu"){
                      if(page == 1){
                          $(".newfblist").html(html.join(""));
                      }else{
                          $(".newfblist").append(html.join(""));
                      }
                  }else if(action == "imgTie"){
                      if(page == 1){
                          $(".imglist").html(html.join(""));
                      }else{
                          $(".imglist").append(html.join(""));
                      }
                  }else if(action == "videoTie"){
                      if(page == 1){
                          $(".videolist").html(html.join(""));
                      }else{
                          $(".videolist").append(html.join(""));
                      }
                  }
                  if(pageInfo && page >= pageInfo.totalPage){
                      	isload = false;
                  }
              }else{
                  $(".loading").remove();
                   if(action == "recomTop"){
                         $(".recomlist").append('<div class="loading">已加载全部数据！</div>');
                   }else if(action == "newFabu"){
                         $(".newfblist").append('<div class="loading">已加载全部数据！</div>');
                   }else if(action == "imgTie"){
                         $(".imglist").append('<div class="loading">已加载全部数据！</div>');
                   }else if(action == "videoTie"){
                         $(".videolist").append('<div class="loading">已加载全部数据！</div>');
                   }
              }
              isload = false;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown){
          isload = false;
          if(page == 1){
            $(".conlist").html("");
          }
          $(".conlist .empty").html('网络错误，加载失败...').show();
       }
    })
}

// 上滑下滑导航隐藏
  var upflag = 1, downflag = 1;
  //scroll滑动,上滑和下滑只执行一次！
  scrollDirect(function (direction) {
    var dom = $('.recomTab').hasClass('topfixed');
    if (direction == "down") {
      if (downflag) {
        // alert(1)
        downflag = 0;
        upflag = 1;
      }
    }
    if (direction == "up") {
      if (upflag) {
        // alert(2)
        downflag = 1;
        upflag = 0;
      }
    }
  });

  /*调起大图 S*/
   var mySwiper = new Swiper('.bigSwiper', {pagination: {el:'.bigPagination',type: 'fraction',},loop: false})
    $(".conlist").delegate('.picbox img', 'click', function() {
        var imgBox = $(this).parents(".picbox").find("img");
        var i = $(imgBox).index(this);
        $(".bigBoxShow .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length; j < c ;j++){
         $(".bigBoxShow .swiper-wrapper").append('<div class="swiper-slide"><div class="swiper-img"><img src="' + imgBox.eq(j).attr("src") + '" / ></div></div>');
        }
        mySwiper.update();
        $(".bigBoxShow").css({
            "z-index": 999999,
            "opacity": "1"
        });
        mySwiper.slideTo(i, 0, false);
        return false;
    });

    $(".bigBoxShow").delegate('.vClose', 'click', function() {
        $(this).closest('.bigBoxShow').css({
            "z-index": "-1",
            "opacity": "0"
        });

    });
  /*调起大图 E*/

})

function transTimes(timestamp, n){
    update = new Date(timestamp*1000);//时间戳要乘1000
    year   = update.getFullYear();
    month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
    day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
    hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
    minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
    second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
    if(n == 1){
      return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
    }else if(n == 2){
      return (year+'-'+month+'-'+day);
    }else if(n == 3){
      return (month+'-'+day);
    }else if(n == 4){
      return (hour+':'+minute);
    }else{
      return 0;
    }
  }
var scrollDirect = function (fn) {
  var beforeScrollTop = document.body.scrollTop;
  fn = fn || function () {
  };
  window.addEventListener("scroll", function (event) {
      event = event || window.event;

      var afterScrollTop = document.body.scrollTop;
      delta = afterScrollTop - beforeScrollTop;
      beforeScrollTop = afterScrollTop;

      var scrollTop = $(this).scrollTop();
      var scrollHeight = $(document).height();
      var windowHeight = $(this).height();
      if (scrollTop + windowHeight > scrollHeight - 10) {
          return;
      }


      if (afterScrollTop < 10 || afterScrollTop > $(document.body).height - 10) {
          fn('up');
      } else {
          if (Math.abs(delta) < 10) {
              return false;
          }
          fn(delta > 0 ? "down" : "up");
      }
  }, false);
}
