$(function(){
getList();
  // 吸顶
var xiding = $(".search-box"),chtop = parseInt(xiding.offset().top);
$(window).on("scroll", function() {
    var thisa = $(this);
    var st = thisa.scrollTop();
    var sct = $(window).scrollTop();
    if (st >= chtop) {
      $(".search-box").addClass('choose-top');
    } else {
      $(".search-box").removeClass('choose-top');
    }
    if (sct + $(window).height() >= $(document).height()) {
       getList();
    }

  });





数据加载

function getList(){
  var html = [];
  for (var i = 0; i < 8; i++) {
      html.push('<li>');
      html.push('<div class="tc_img"><img src="'+templets_skin+'upfile/s_01.jpg"></div>');
      html.push('  <div class="zhezhao"></div>');
      html.push('<p class="text">剩下的饺子皮不要丢了，裹着鸡蛋液炸着也很好吃</p>');
      html.push('<p class="ic_list"><span class="ic_01">3335</span><span class="ic_02">152</span><span class="ic_03">26</span></p>');
      html.push('</li>');
  }
  $(".tc_list ul").append(html.join(""));
}

    

})