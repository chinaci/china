$(function(){

// 幻灯片和导航
$(".nav-container ul").each(function(){
    var t = $(this);
    if(t.find("li").length == 0){
        t.closest(".swiper-slide").remove();
    }
});
new Swiper('#slider', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay:2000, autoplayDisableOnInteraction : false});
if ($('.nav-container .swiper-slide').length > 1) {
    new Swiper('.nav-container', {pagination: '.pagination',paginationClickable: true,});
    $('.nav').css('padding-bottom', '.3rem');
}

// 导航条左右切换模块
var navbar = $('.navbar');
var navHeight = navbar.offset().top;
var loadMoreLock = false;
var tabsSwiper = new Swiper('#tabs-container',{
  speed:350,
  autoHeight: true,
  touchAngle : 35,
  onSlideChangeStart: function(){
    loadMoreLock = false;
    $(".navbar .active").removeClass('active');
    $(".navbar li").eq(tabsSwiper.activeIndex).addClass('active');
    if (navbar.hasClass('fixed')) {
      $(window).scrollTop(navHeight + 2);
    }

          $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

          // 当模块的数据为空的时候加载数据
          if($.trim($("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find(".content-slide").html()) == ""){
              $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find('.content-slide').html('<div class="loading"><i class="icon-loading"></i>加载中...</div>')
              getList();
          }

  },
  onSliderMove: function(){
    // isload = true;
  },
  onSlideChangeEnd: function(){
    // isload = false;
  }
})
$(".navbar li").on('touchstart mousedown',function(e){
  e.preventDefault();
  $(".navbar .active").removeClass('active');
  $(this).addClass('active');
  tabsSwiper.slideTo( $(this).index() );

})
// 导航吸顶
$(window).on("scroll",function() {
   var sct = $(window).scrollTop();
   if ($(window).scrollTop() > navHeight) {
       $('.navbar').addClass('fixed');
   } else {
       $('.navbar').removeClass('fixed');
       $('.gotop').hide();
   }
   if (sct + $(window).height() + 50 > $(document).height() && !loadMoreLock) {
       var page = parseInt($('.navbar .active').attr('data-page')),
           totalPage = parseInt($('.navbar .active').attr('data-totalPage'));
       if (page < totalPage) {
           ++page;
           $('.navbar .active').attr('data-page', page);
           getList();
       }
   }

});

getList();
function getList(){
    var active = $('.navbar .active'), action = active.attr('data-id'), url;
    var page = active.attr('data-page');

    if (action == 1) {
        if(page == 1){
            $(".new").html('<div class="loading"><i class="icon-loading"></i>加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=info&action=ilist&orderby="+action+"&page="+page+"&pageSize="+pageSize +"";
    }else if(action == 3){
        if(page == 1){
            $(".recommend").html('<div class="loading"><i class="icon-loading"></i>加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=info&action=ilist&rec=1&page="+page+"&pageSize="+pageSize +"";
    }else if(action == 2){
        if(page == 1){
            $(".hot").html('<div class="loading"><i class="icon-loading"></i>加载中...</div>');
        }
        url =  masterDomain + "/include/ajax.php?service=info&action=ilist&fire=1&page="+page+"&pageSize="+pageSize +"";
    }

    loadMoreLock = true;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            if(data && data.state == 100){
                $(".loading").remove();
                var html = [], list = data.info.list, pageinfo = data.info.pageInfo, page = pageinfo.page;
                var totalPage = data.info.pageInfo.totalPage;
                active.attr('data-totalPage', totalPage);
                for (var i = 0; i < list.length; i++) {
                    html.push('<div class="InfoBox fn-clear"><a href="'+list[i].url+'">');
                    if (list[i].litpic) {
                        var video = '';
                        if(list[i].video){
                          video = '<s></s>';
                        }
                        html.push('<div class="Info_pic"><img src="'+list[i].litpic+'" alt="">'+video+'</div>');
                    }
                    html.push('<div class="Info_title">'+list[i].title+'</div>');
                    if (list[i].price == 0) {
                        html.push('<div class="Info_price">面议</div>');
                    }else{
                        html.push('<div class="Info_price"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</div>');
                    }
                    html.push('<div class="Info_foot fn-clear">');
                    html.push('<div class="Info_member">');
                    var photo = list[i].member.photo == null ? templatePath+'images/noavatar_middle.gif' : list[i].member.photo;
                    html.push('<div class="Info_mpic"><img src="'+photo+'" alt=""></div>');
                    var nickname = list[i].member.nickname == null ? '匿名' : list[i].member.nickname;
                    html.push('<div class="Info_mname">'+nickname+'</div>');
                    html.push('</div>');
                    html.push('<div class="Info_location">'+list[i].address+'</div>');
                    html.push('</div>');
                    html.push('</a></div>');
                }
                if (action == 1) {
                    if(page == 1){
                        $(".new").html(html.join(""));
                    }else{
                        $(".new").append(html.join(""));
                    }
                }else if(action == 3){
                    if(page == 1){
                        $(".recommend").html(html.join(""));
                    }else{
                        $(".recommend").append(html.join(""));
                    }
                }else if(action == 2){
                    if(page == 1){
                        $(".hot").html(html.join(""));
                    }else{
                        $(".hot").append(html.join(""));
                    }
                }
                if(page >= pageinfo.totalPage){
                    loadMoreLock = false;
                }

            }else{
              $(".loading").remove();
              if (action == 1) {
                  $(".new").append('<div class="loading">'+data.info+'</div>');
              }else if(action == 3){
                  $(".recommend").append('<div class="loading">'+data.info+'</div>');
              }else if(action == 2){
                  $(".hot").append('<div class="loading">'+data.info+'</div>');
              }
            }
            loadMoreLock = false;
        },
        error: function(){
            if(page == 1){
                $(".goods-list ul").html("");
            }
            $(".goods-list .empty").html('网络错误，加载失败...').show();
            loadMoreLock = false;
        }

    });

}
// 上滑下滑导航隐藏
var upflag = 1, downflag = 1, fixFooter = $(".fixFooter, .navbar");
//scroll滑动,上滑和下滑只执行一次！
scrollDirect(function (direction) {
    var dom = $('.navbar').hasClass('fixed');
    if (direction == "down" && dom) {
        if (downflag) {
            fixFooter.hide();
            $('.gotop').hide();
            downflag = 0;
            upflag = 1;
        }
    }
    if (direction == "up") {
        if (upflag) {
            fixFooter.show();
            $('.gotop').show();
            downflag = 1;
            upflag = 0;
        }
    }
});

// 回到顶部
$('.gotop').click(function(){
    $(window).scrollTop(navHeight + 2);
})

})


var	scrollDirect = function (fn) {
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
