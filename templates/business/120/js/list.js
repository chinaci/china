$(function(){

    $(".qrcode").each(function(){
        var t = $(this).find(".qr"), url = t.data("url");
        t.qrcode({
            render: window.applicationCache ? "canvas" : "table",
            width: 136,
            height: 136,
            text: huoniao.toUtf8(url)
        });
    });

  // 筛选
  $('.select-item li').click(function(){
    $('.select-item li a').removeClass('curr')
    $(this).find('a').addClass('curr');
  })

  // 二维码
  $('.main-itemR-code .corner').click(function(){
    var t = $(this), parent = t.closest('.main-itemR-code'), box = parent.find('.qrcode');
    if (parent.hasClass('show')) {
      parent.removeClass('show');
    }else {
      parent.addClass('show');
    }
  })


})
