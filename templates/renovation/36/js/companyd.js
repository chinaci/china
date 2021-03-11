$(function(){

	$('#container').waterfall({
		itemCls: 'item',
		prefix: 'container',
		colWidth: 290,
		gutterWidth: 14,
		gutterHeight: 14,
		minCol: 4,
		maxCol: 4,
		loadingMsg: ''
	});

	//立即预约
	$(".connect .sub a").bind("click", function(){
		$('.leaveMsg .k1').click();
	});

	// 条件筛选
	$('.screen dd a').click(function(){
		var a = $(this);
		if(a.hasClass('curr')) return;
		a.addClass('curr').siblings('a').removeClass('curr');
	})

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

	//显示区号
	$('.form .areaCode').bind('click', function(){
		var areaWrap =$(this).closest(".form").find('.areaCode_wrap');
		if(areaWrap.is(':visible')){
			areaWrap.fadeOut(300)
		}else{
			areaWrap.fadeIn(300);
			return false;
		}
	});

	//选择区号
	$('.form .areaCode_wrap').delegate('li', 'click', function(){
		var t = $(this), code = t.attr('data-code');
		var par = t.closest(".form");
		var areaIcode = par.find(".areaCode");
		areaIcode.find('i').html('+' + code);
	});



})
