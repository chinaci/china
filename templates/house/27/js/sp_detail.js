$(function() {
	$("img").scrollLoading();

  $(".slide").slide({
      titCell: ".imgctrl li",
      mainCell: ".bigimg",
      effect: "fold",
      switchLoad: "_src",
      autoPlay: true,
      delayTime: 200,
      startFun: function(i, p) {
          if (i == 0) {
              $(".slide .tprev").click()
          } else if (i % 4 == 0) {
              $(".slide .tnext").click()
          }
      }
  });
  $(".slide .imgctrl").slide({
      mainCell: ".thumb",
      delayTime: 100,
      vis: 4,
      scroll: 4,
      effect: "left",
      autoPage: true,
      prevCell: ".tprev",
      nextCell: ".tnext",
      pnLoop: false
  });



  //房源照片
  baguetteBox.run('.gallery', {
    animation: 'fadeIn',
  });



  //内容导航
  var win = $(window), modList = $(".container"), fixnav = modList.find(".sub-nav");
  $(window).scroll(function() {
    var stop = win.scrollTop();
    stop > modList.offset().top && stop < modList.offset().top + modList.height() - 100 ? fixnav.addClass("fixed") : fixnav.removeClass("fixed");
  });

  var isClick = 0; //是否点击跳转至锚点，如果是则不监听滚动
  //左侧导航点击
  $(".fixnav a").bind("click", function(){
    isClick = 1; //关闭滚动监听
    var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".sub-title:eq("+index+")").offset().top - 5;
    parent.addClass("curr").siblings("li").removeClass("curr");
    $('html, body').animate({
          scrollTop: theadTop
      }, 300, function(){
        isClick = 0; //开启滚动监听
      });
  });

  //滚动监听
  $(window).scroll(function(){
    if(isClick) return false;  //判断是否点击中转中...
    var scroH = $(this).scrollTop();
    var theadLength = $(".sub-title").length;
    $(".fixnav li").removeClass("curr");

    $(".sub-title").each(function(index, element){
      var offsetTop = $(this).offset().top;
      if(index != theadLength-1){
        var offsetNextTop = $(".sub-title:eq("+(index+1)+")").offset().top - 30;
        if(scroH < offsetNextTop){
          $(".fixnav li:eq("+index+")").addClass("curr");
          return false;
        }
      }else{
        $(".fixnav li:last").addClass("curr");
        return false;
      }
    });
  });


  //分享
  var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":["tsina","tqq","qzone","weixin","sqq","renren"],"bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];


  $(".report").bind("click", function(){

		var domainUrl = masterDomain;
    $.dialog({
      fixed: false,
      title: "房源举报",
      content: 'url:'+domainUrl+'/complain-house-sp-'+id+'.html',
      width: 460,
      height: 300
    });
  });

  // 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add";
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      huoniao.login();
      return false;
    }
    if(type == "add"){
      t.addClass("has").html("<i></i>已收藏");
    }else{
      t.removeClass("has").html("<i></i>收藏");
    }
    $.post("/include/ajax.php?service=member&action=collect&module=house&temp=sp_detail&type="+type+"&id="+id);
  });

});
