$(function(){

	$(".jmsj .code").each(function(){
        var t = $(this), url = t.data("url");
        t.qrcode({
            render: window.applicationCache ? "canvas" : "table",
            width: 85,
            height: 85,
            text: huoniao.toUtf8(url)
        });
    });


    /*加盟商家*/
	$(".jmsj .sj ul.con li").hover(function(){
		$(this).find(".code").show();
		$(this).find(".logo").css( "visibility","hidden");
	},function(){
		$(this).find(".code").hide();
		$(this).find(".logo").css( "visibility","visible");
	})
    /*免费领取优惠券*/
	$(".mflqyhq .nav a").hover(function(){
		var k=$(this).index();
		$(this).addClass("on").siblings().removeClass("on");
		$(".mflqyhq ul").eq(k).show().siblings().hide();
	})
	// banner 幻灯片
    $(".slide").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"fold",autoPlay:true,autoPage: true,});
	/*外卖*/
	jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:3,pnLoop:false});

	/*今日团购*/
	jQuery(".multipleLine").slide({titCell:".hd ul",mainCell:".bd .ulWrap",autoPage:true,effect:"left",autoPlay:true});

	/* 推荐商品导航 */
	$("ul.tj_nav li").hover(function(){
		$(this).addClass("on").siblings().removeClass("on");
		var i=$(this).index();
		$(".tjsp p").eq(i).show().siblings().hide();
	},function(){
		$(this).removeClass("on");
		$(".tjsp p").hide();
	})
	$(".tjsp p").hover(function(){
		var n=$(this).index();
		$(this).show();
		$("ul.tj_nav li").eq(n).addClass("on").siblings().removeClass("on");
	},function(){
		$(this).hide();
		var n=$(this).index();
		$("ul.tj_nav li").eq(n).removeClass("on");
	})
	/* 二维码*/
	$(".head_con ul li.code").hover(function(){
		$(".sn-qrcode").show();
	},function(){
		$(".sn-qrcode").hide();
	})

	$(".qr_code").hover(function(){
		setTimeout(function(){
			$(".large_qr_code").show();
		},300)

	},function(){
		setTimeout(function(){
			$(".large_qr_code").hide();
		},300)
	})
	/* 幻灯片左侧导航*/
	$("#nav-sub li").hover(function(){
		$(this).addClass("on").siblings().removeClass("on");
		var y=$(this).index();
		$(".firstScreen .floatLayer_text").show().css("width","500px");
		$(".firstScreen .floatLayer_text .text").eq(y).show().siblings(".text").hide();
		$(".firstScreen .floatLayer_text .text").hover(function(){
			$(".firstScreen .floatLayer_text").css("width","500px");
			var x=$(this).index();
			$("#nav-sub li").eq(x).addClass("on").siblings().removeClass("on");
		},function(){
			$("#nav-sub li").removeClass("on");
		})
	},function(){
		$(".firstScreen .floatLayer_text").css("width","0").hide();
		$(".firstScreen .floatLayer_text .text").hover(function(){
			$(".firstScreen .floatLayer_text").css("width","500px").show();
			var x=$(this).index();
			$("#nav-sub li").eq(x).addClass("on").siblings().removeClass("on");
		},function(){
			$(".firstScreen .floatLayer_text").css("width","0").hide();
			$("#nav-sub li").removeClass("on");
		})
		$(this).removeClass("on");
	})
	$("#nav-sub").hover(function(){
		$(".firstScreen .floatLayer_text").stop().animate({width:"500px"},500);
	},function(){
		$(".firstScreen .floatLayer_text").css("width","0")
	})

	/*网站导航*/
	$(".head_con ul li.list").hover(function(){
		$(".menu-bd").show();
		$(this).addClass("on");
		$(".head_con ul li.line").addClass("on");
	},function(){
		$(".menu-bd").hide();
	    $(this).removeClass("on");
		$(".head_con ul li.line").removeClass("on");
	})
	$(".menu-bd").hover(function(){
		$(this).show();
		$(this).addClass("on");
		$(".head_con ul li.line").addClass("on");

	},function(){
		$(this).hide();
		$(this).removeClass("on");
		$(".head_con ul li.line").removeClass("on");
	})

	/* 公告 */
	$(".state ul.title li").hover(function(){
		var t=$(this),n;
		t.addClass("on").siblings().removeClass("on");
		n=t.index();
		$(".state ul.con li.par").eq(n).show().siblings().hide();
	})

})
