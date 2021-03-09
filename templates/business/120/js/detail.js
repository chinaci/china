$(function(){

  // banner 幻灯片
  $(".slide").slide({mainCell:".bd",effect:"fold",autoPlay:true});


  // 公司介绍滚动条
	$(".gstxt").mCustomScrollbar({theme:"minimal-dark"});

  $('.gather .tab li').hover(function(){
    var t = $(this), index = t.index(), con = $('.gather .content .con-item');
    t.addClass('curr').siblings('li').removeClass('curr');
    con.hide().eq(index).show();
  })

  // 二手房&租房
  $(".esfslide").slide({mainCell:".bd ul",effect:"left",autoPlay:true,autoPage:true,vis:4});
  $(".zfslide").slide({mainCell:".bd ul",effect:"left",autoPlay:true,autoPage:true,vis:4});

  $('.fctab li').hover(function(){
    var t = $(this), index = t.index();
    t.addClass('curr').siblings('li').removeClass('curr');
    $('.fclist .fcslide').hide().eq(index).show();
  })

})
