$(function(){


  // 发布
  $('#fabubtn').click(function(){
    var box = $('.fabuBox');
    if (!box.hasClass('open')) {
      $('body,html').bind('touchmove', function(e){e.preventDefault();})
      box.addClass('open');
      $('.bg_1').css({"display":"block"});
    }else {
      $('body,html').unbind('touchmove');
      box.removeClass('open');
    }
  })

  $('.fabuBox .cancel').click(function(){
    $('.fabuBox').addClass('close');
    setTimeout(function(){
      $('body,html').unbind('touchmove');
      $('.fabuBox').removeClass('open close');
      $('.bg_1').css({"display":"none"});
    }, 600)
  })




})
