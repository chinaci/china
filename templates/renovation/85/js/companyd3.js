$(function(){


	//立即预约
	$(".connect .sub a").bind("click", function(){
		$('.leaveMsg .k1').click();
	});

	//收藏
	$(".collect").bind("click", function(){
		var t = $(this), type = "add", oper = "+1", txt = "已收藏";

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("icon-collect-sel")){
			t.addClass("icon-collect-sel");
		}else{
			type = "del";
			t.removeClass("icon-collect-sel");
			oper = "-1";
			txt = "收藏";
		}

		var $i = $("<b>").text(oper);
		var x = t.offset().left, y = t.offset().top;
		$i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#E94F06"});
		$("body").append($i);
		$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
			$i.remove();
		});

		t.html("<i></i>"+txt);

		$.post("/include/ajax.php?service=member&action=collect&module=renovation&temp=company-detail&type="+type+"&id="+company);

	});

	var comDeser = $('#comDesigenr');
	$(window).scroll(function(){
		var top = $(window).scrollTop();
		comDeser.children('.designer-item').each(function(i){
			var item = $(this);
			if(item.hasClass('fromR') || item.hasClass('fromL')) return;
			var _top = item.offset().top;
			if(top + $(window).height() > _top) {
				var cls = (i + 1) % 2 == 0 ? 'fromR' : 'fromL';
				// item.addClass(cls);
				if(!supportCss3('animation')) {
					cls += '-ie';
					item.addClass(cls);
					var l = $('html').hasClass('w1200') ? 50 : 0;
					item.filter('.fromR-ie').children('.inner').animate({'marginLeft' :  l + 'px','opacity':1},300)
					item.filter('.fromL-ie').children('.inner').animate({'opacity':1},700)
				} else {
					item.addClass(cls);
				}

				if(!comDeser.children('.line').length > 0) {
					comDeser.append('<div class="line"></div>');
				}
				var r = Math.ceil((i + 1) / 2)
				var h = r > 1 ? (281 + 30) * r - 30 : 281;
				comDeser.children('.line').stop().animate({
					'height' : h + 'px'
				},700)
			} else {
				return;
			}
		})
	}).scroll();

});

//是否支持css的某个属性
function supportCss3(style) {
  var prefix = ['webkit', 'Moz', 'ms', 'o'], i,
  humpString = [],
  htmlStyle = document.documentElement.style,
  _toHumb = function(string) {
      return string.replace(/-(\w)/g,
      function($0, $1) {
          return $1.toUpperCase();
      });
  };
  for (i in prefix) humpString.push(_toHumb(prefix[i] + '-' + style));
  humpString.push(_toHumb(style));
  for (i in humpString) if (humpString[i] in htmlStyle) return true;
  return false;
}
