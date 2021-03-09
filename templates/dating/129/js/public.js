$(function(){
  // 手机端、微信端
  $('.app-con .icon-box.app').hover(function(){
     $('.app-down').show();
  },function(){
     $('.app-down').hide();
  });
  $('.app-con .icon-box.wx').hover(function(){
     $('.wx-down').show();
  },function(){
     $('.wx-down').hide();
  })
  //搜索
  $('.search-top li').click(function(){
    var t = $(this), action = t.data('action');
    t.addClass('active').siblings().removeClass('active');
    $('.search-con form').attr('action', action);
  });
})