$(function(){
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
          console.log(tabsSwiper.activeIndex)
          if($.trim($(".container .swiper-slide").eq(tabsSwiper.activeIndex).find("ul").html()) == ""){
              // $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find('ul').html('<div class="loading">加载中...</div>')
              getList();
              console.log('ss')
          }

          var d = tabsSwiper.activeIndex;
          height_list(d);
          getList();
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
    getList();
    var d = $(this).index();
    console.log(d);
    height_list(d);
      // mySwiper.slideTo(i, 1000, false);
      
});





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
//初始化
window.onload = function(){
    //实现瀑布流
    waterFall();
}


// 点赞
$('.video_list ul').delegate('.dianzan','click',function(){
  var t = $(this);
  if(t.hasClass('active')){
    t.removeClass('active');
    var b = t.text();
    b--;
    t.text(b)
  }else{
    t.addClass('active');
    var c = t.text();
    c++;
    t.text(c);
  }
});
$('.tc_list ul').delegate('.tc_dianzan','click',function(){
  var t = $(this);
  if(t.hasClass('active')){
    t.removeClass('active');
    var b = t.text();
    b--;
    t.text(b)
  }else{
    t.addClass('active');
    var c = t.text();
    c++;
    t.text(c);
  }
});

// 点击关注
$('.video_list ul').delegate('.follow','click',function(){
  var t = $(this);
  if(t.hasClass('add_follow')){
    t.removeClass('add_follow').addClass('pitchOn');
    t.text('已关注');
  }else{
    t.removeClass('pitchOn').addClass('add_follow');
    t.text('关注');
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
       // var page = parseInt($('.pubBox .active').attr('data-page')),
       //     totalPage = parseInt($('.pubBox .active').attr('data-totalPage'));
       // if (page < totalPage) {
       //     ++page;
       //     $('.pubBox .active').attr('data-page', page);
       //     getList();
       // }
       getList();
       waterFall();
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
});


// 数据加载
getList();
function getList(){
    var active = $('.pubBox .active'), action = active.attr('data-id');
    if(action == 1){
      var html = [];
      for (var i = 0; i < 8; i++) {
          html.push('<li>');
          html.push('  <div class="bg_img">');
          html.push('<img src="'+templets_skin+'upfile/videoCover.png">');
          html.push('<p>小数出生后第一次见下雪天,记录每一次成长,让温暖永远陪伴他</p>');
          html.push('<i></i>');
          html.push('<div class="fn-clear"><span>3335</span><span>03:35</span></div>');
          html.push('</div>');
          html.push('<div class="bg_content fn-clear">');
          html.push('  <div class="headPortrait"><img src="'+templets_skin+'upfile/dt1.jpg"></div>');
          html.push('  <span class="user_name">川哥在苏州</span>');
          html.push('  <span class="follow add_follow">关注</span>');
          html.push('  <span class="dianzan">666</span>');
          html.push('  <span class="xinxi">88</span>');
          html.push('</div>');
          html.push('</li>');
      }
      $(".video_list ul").append(html.join(""));
      height_list(0);
    }else if(action == 2){
      var html = [];
      for (var i = 1; i < 6; i++) {
          html.push('<li>');
          html.push('  <div class="tc_img"><img src="'+templets_skin+'upfile/s_0'+i+'.jpg"><span>3.3km</span></div>');
          html.push('  <p class="tc_title">约了朋友，在等等等等等等 等等,快来约我哦</p>');
          html.push('<div class="tc_txt fn-clear">');
          html.push('<div class="tc_headPortrait"><img src="'+templets_skin+'upfile/dt1.jpg"></div>');
          html.push('<span class="tc_user_name">川哥在苏州</span>');
          html.push('<span class="tc_dianzan">666</span>');
          html.push('</div>');
          html.push('</li>');
      }
      $(".tc_list ul").append(html.join(""));
      waterFall();
      height_list(1);
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


    

})