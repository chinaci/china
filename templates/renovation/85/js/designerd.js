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


	$(".baseinfo .sub a").bind("click", function(){
		$(".leaveMsg .k1").click();
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

		$.post("/include/ajax.php?service=member&action=collect&module=renovation&temp=designer-detail&type="+type+"&id="+designer);

	});



})
