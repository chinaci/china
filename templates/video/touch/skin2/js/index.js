$(function(){

    setInterval(function () {
        waterFall();
    }, 500)

var is_load0 = true;
var is_load1 = true;

var tc_nodata = 0;
  //左右滑动时的高度问题
  function height_list(i){
    var content_height = $(".content_p").eq(i).height();
    var slide_height = $(".swiper-slide").eq(i).height(content_height);
    $(".swiper-wrapper").css("height", content_height);
    $(".swiper-container").css("height", content_height);
  }


//左右导航切换(推荐信息、推荐店铺)
var navbar = $('.recomTab');
var navHeight = navbar.offset().top;
var isload = false;
var tabsSwiper = new Swiper('#tabs-container',{
  // effect : 'fade',
    speed:350,
    autoHeight: true,
    touchAngle : 35,
    on: {
          slideChangeTransitionStart: function(){
          $(".recomTab .active").removeClass('active');
          $(".recomTab li").eq(tabsSwiper.activeIndex).addClass('active');
          if (navbar.hasClass('topfixed')) {
            $(window).scrollTop(navHeight + 2);
          }


          // $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

          // 当模块的数据为空的时候加载数据
          if($.trim($(".container .swiper-slide").eq(tabsSwiper.activeIndex).find("ul").html()) == ""){
              // $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find('ul').html('<div class="loading">加载中...</div>')

              getList();
              waterFall();
          }

          var d = tabsSwiper.activeIndex;
          height_list(d);
          // getList();
          //     waterFall();
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

    waterFall();
    var d = $(this).index();
    height_list(d);
      // mySwiper.slideTo(i, 1000, false);
});

// getList();



// 瀑布流
//瀑布流效果
//这里有一个坑（已经修复）：
//因为是动态加载远程图片，在未加载完全无法获取图片宽高
//未加载完全就无法设定每一个item(包裹图片)的top。
//item的top值：第一行：top为0
//            其他行：必须算出图片宽度在item宽度的缩小比例，与获取的图片高度相乘，从而获得item的高度
//                   就可以设置每张图片在瀑布流中每块item的top值（每一行中最小的item高度，数组查找）
//item的left值：第一行：按照每块item的宽度值*块数
//             其他行：与自身上面一块的left值相等
function waterFall() {
    // 1- 确定图片的宽度 - 滚动条宽度
    var pageWidth = getClient().width;
    var columns = 2; //3列
    var itemWidth = $(".tc_list ul li").width(); //得到item的宽度
    // $(".tc_list ul li").width(itemWidth); //设置到item的宽度
    var arr = [];

    $(".tc_list ul li").each(function(i){
        var height = $(this).height();
        var width = $(this).width();
        var bi = itemWidth/width; //获取缩小的比值
        var boxheight = parseInt(height*bi); //图片的高度*比值 = item的高度
        if (i < columns) {
            // 2- 确定第一行
            $(this).css({
                top:0,
                left:(itemWidth) * i
            });
            arr.push(boxheight);
        } else {
            // 其他行
            // 3- 找到数组中最小高度  和 它的索引
            var minHeight = arr[0];
            var index = 0;
            for (var j = 0; j < arr.length; j++) {
                if (minHeight > arr[j]) {
                    minHeight = arr[j];
                    index = j;
                }
            }
            // 4- 设置下一行的第一个盒子位置
            // top值就是最小列的高度
            $(this).css({
                top:arr[index],
                left:$(".tc_list ul li").eq(index).css("left")
            });

            // 5- 修改最小列的高度
            // 最小列的高度 = 当前自己的高度 + 拼接过来的高度
            arr[index] = arr[index] + boxheight;
        }
    });
    $('.tc_list ul').css('height',Math.max.apply(null, arr));
}
//clientWidth 处理兼容性
function getClient() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}
 // 页面尺寸改变时实时触发
window.onresize = function() {
    //重新定义瀑布流
    waterFall();
};




// 点赞
$('.video_list ul').delegate('.dianzan','click',function(){
  var t = $(this);
    var vid = t.attr("data-vid"), uid = t.attr("data-uid");
    var type = 0;

    var b = t.text();
    t.hasClass('active') ? b-- : b++;

    $.ajax({
		url: "/include/ajax.php?service=member&action=getZan&module=video&temp=detail"+"&id="+vid+"&uid="+uid,
		type: "GET",
		dataType: "json",
		success: function (data) {
            t.toggleClass('active');
            t.text(b);
		}
    });

});

$('.tc_list ul').delegate('.tc_dianzan','click',function(){
  var t = $(this);
    var typetc = 0;
    var vid = t.attr("data-vid");
    if(t.hasClass('active')){
      $.ajax({
          url : '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + typetc + '&temp=video',
          data : '',
          type : 'get',
          dataType : 'json',
          success : function (data) {
              if(data.state == 100){
                  t.removeClass('active');
                  var b = t.text();
                  b--;
                  t.text(b)
              }else{
                  alert(data.info);
              }

          }
      })

  }else{
        typetc = 1;
      $.ajax({
          url : '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + typetc + '&temp=video',
          data : '',
          type : 'get',
          dataType : 'json',
          success : function (data) {
              if(data.state == 100){
                  t.addClass('active');
                  var c = t.text();
                  c++;
                  t.text(c);
              }else{
                  alert(data.info);
              }

          }
      })

  }
});

// 点击关注
$('.video_list ul').delegate('.follow','click',function(){
  var t = $(this);
  var vid = t.attr("data-vid");
  var type = 0;
  if(t.hasClass('add_follow')){
      type = 1;
      $.ajax({
          url : '/include/ajax.php?service=video&action=follow&vid=' + vid + '&type=' + type + '&temp=video',
          data : '',
          type : 'get',
          dataType : 'json',
          success : function (data) {
              if(data.state == 100){
                  t.removeClass('add_follow');
                  t.addClass('pitchOn');
                  t.text('已关注');
              }else{
                  alert(data.info);
                  window.location.href = masterDomain + '/login.html';

              }

          }
      })

  }else{
      $.ajax({
          url : '/include/ajax.php?service=video&action=follow&vid=' + vid + '&type=' + type + '&temp=video',
          data : '',
          type : 'get',
          dataType : 'json',
          success : function (data) {
              if(data.state == 100){
                  t.removeClass('pitchOn');
                  t.addClass('add_follow');
                    t.text('关注');
              }else{
                  alert(data.info);
                  window.location.href = masterDomain + '/login.html';
              }

          }
      })
  }
});

// 吸顶
var xiding = $(".pubBox"),chtop = parseInt(xiding.offset().top);
$(window).on("scroll", function() {
    var thisa = $(this);
    var st = thisa.scrollTop();
    var sct = $(window).scrollTop();
    if (st >= chtop) {
      $(".pubBox").addClass('choose-top');
    } else {
      $(".pubBox").removeClass('choose-top');
    }
    if (sct + $(window).height() >= $(document).height()) {
       var page = parseInt($('.pubBox .active').attr('data-page')),
           totalPage = parseInt($('.pubBox .active').attr('data-totalPage'));
       if (page < totalPage) {
           ++page;
           $('.pubBox .active').attr('data-page', page);
           getList();
           waterFall();
       }


    }

  });

// 点击搜索框
$('.search i').click(function(){
  if(!$('.hh').hasClass('btnShow')){
      $('.hh').addClass('btnShow').removeClass('btnHide');
  }
});
$('.hh .cuo').click(function(){
  var t = $(this);
  $('.hh').removeClass('btnShow').addClass('btnHide');
    $(".video_list ul").html('');
  getList();
});


// 数据加载
getList();
function getList(title){
    var page = parseInt($('.pubBox .active').attr('data-page'));
    var active = $('.pubBox .active'), action = active.attr('data-id');
    title = title != undefined ? title : '';
    if(action == 1){
      var html = [];
        if(!is_load0){
            return;
        }

      $.ajax({
          url : '/include/ajax.php?service=video&action=alist&pageSize=10&page=' + page + '&title=' + title + '&orderby=2',
          data : '',
          type : 'get',
          dataType : 'json',
          success : function (data) {
              if(data.state == 100){
                    var list = data.info.list;
                    var len = list.length;
                  for (var i = 0; i < len; i++) {

                      var is_zan = '';
                      var is_follow = 'add_follow';
                      var is_follow_text = '关注';
                      if(list[i].is_zan){
                          is_zan = 'active';
                      }
                      if(list[i].is_follow){
                          is_follow = 'pitchOn';
                          is_follow_text = '已关注';
                      }
                      var username = list[i].user.username;
                      if(username == 'undefined'){
                          username = '管理员';
                      }
                      var is_user = list[i].is_user;
                      html.push('<li>');
                      html.push('  <div class="bg_img">');
                      html.push('<a href="'+list[i].url+'"><img src="'+list[i].litpic+'">');
                      html.push('<p>'+list[i].title+'</p>');
                      html.push('<i></i></a>');
                      html.push('<div class="fn-clear"><span>'+list[i].click+'</span><span>'+list[i].pubdate1+'</span></div>');
                      html.push('</div>');
                      if(is_user){
                          html.push('<div class="bg_content fn-clear">');
                          html.push('<a href="'+list[i].user_url+'">');
                          html.push('  <div class="headPortrait"><img src="'+list[i].user.photo+'"></div>');
                          html.push('  <span class="user_name">'+username+'</span>');
                          html.push('</a>');
                          html.push('  <span class="follow '+is_follow+'" data-vid="'+list[i].id+'">'+is_follow_text+'</span>');
                          html.push('  <span class="dianzan '+is_zan+'" data-uid="'+list[i].user.userid+'" data-vid="'+list[i].id+'">'+list[i].zanCount+'</span>');
                          html.push('  <span class="xinxi">'+list[i].common+'</span>');
                          html.push('</div>');

                      }
                      html.push('</li>');
                  }
                  if(len > 0){

                      $(".video_list ul").append(html.join(""));
                  }else{
                      $(".video_list ul").append("暂无相关内容");
                  }
                  height_list(0);

              }else{
                  is_load0 = true;

                      $(".video_list ul").append("<p style='text-align: center;margin-top: 5px;'>暂无相关内容</p>");
                  height_list(0);

              }

          }
      })


    }else if(action == 2){
        HN_Location.init(function(data){
            if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
                lng = lat = -1;
            }else{
                lng = data.lng;
                lat = data.lat;

                tc_nodata++;
                var html = [];
                if(!is_load1){
                    return;
                }
                $.ajax({
                    url : '/include/ajax.php?service=video&action=alist&pageSize=10&page=' + page + '&title=' + title +'&lnglat=' + lng + ',' + lat + '&tongcheng=1' + '&orderby=4',
                    data : '',
                    type : 'get',
                    dataType : 'json',
                    success : function (data) {
                        if(data.state == 100){
                            var list = data.info.list;
                            var len = list.length;

                            for (var i = 0; i < len; i++) {
                                var is_zan = '';
                                if(list[i].is_zan){
                                    is_zan = 'active';
                                }
                                var is_user = list[i].is_user;

                                html.push('<li>');
                                html.push('  <div class="tc_img">' +
                                    '<a href="'+list[i].url+'"><img src="'+list[i].litpic+'"></a><span>'+list[i].distance_+'km</span></div>');
                                html.push('  <p class="tc_title">'+list[i].title+'</p>');
                                html.push('<div class="tc_txt fn-clear">');
                                if(is_user) {
                                    html.push('<div class="tc_headPortrait"><img src="' + list[i].user.photo + '"></div>');
                                    html.push('<span class="tc_user_name">' + list[i].user.username + '</span>');
                                    html.push('<span class="tc_dianzan ' + is_zan + '" data-vid=' + list[i].id + '>' + list[i].zanCount + '</span>');
                                    html.push('</div>');
                                }
                                html.push('</li>');
                            }
                            $(".tc_list ul").append(html.join(""));

                            waterFall();
                            height_list(1);
                        }else{
                            is_load1 = false;
                            if(tc_nodata == 1){
                                //只有第一次加载的时候没数据才显示
                                $(".tc_list ul").append("<p class='no_data'>暂无相关内容</p>");
                            }
                            waterFall();
                            height_list(1);

                        }

                    }
                })
            }
        })
    }
}




    // 微信引导关注
    $('.wechat-fix').bind('click', function(){
      $('.wechat-popup').show();
      $('.mask').show();
    });

    $('.wechat-popup .close').bind('click', function(){
      $('.wechat-popup').hide();
      $('.mask').hide();
    });



    $.fn.scrollTo =function(options){
        var defaults = {
            toT : 0, //滚动目标位置
            durTime : 500, //过渡动画时间
            delay : 30, //定时器时间
            callback:null //回调函数
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//滚动条当前的位置
            subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };

    $('.gotop').click(function(){
        var dealTop = $("body").offset().top;
            $("html,body").scrollTo({toT:dealTop});
    })


    $(".search_keyword").click(function () {
        var active = $('.pubBox .active'), action = active.attr('data-id');
        if(action == 1){
            $(".video_list ul").html('');
        }else if (action == 2){
            $(".tc_list ul").html('');
        }
        var key = $(".txt_search").val();
        title = key;
        getList(title);

    })



})
