$(function(){
	//信息分类导航
	$(".NavList").hover(function(){
		$(this).find("li").show();
		$(this).find(".more").hide();
		$(this).find("li").each(function(){
			var index = $(this).index();
			if(index == 6){
				$(this).removeClass('bbnone');
			}
		});
	}, function(){
		$(this).find("li").each(function(){
			var index = $(this).index();
			if(index > 6){
				$(this).hide();
			}
			if(index == 6){
				$(this).addClass('bbnone');
			}
		});
		$(this).find(".more").show();
	});
	$(".NavList li").hover(function(){
		var t = $(this);
		if(!t.hasClass("active")){
			t.parent().find("li").removeClass("active");
			t.addClass("active");

			// setTimeout(function(){
			// 	if(t.find(".subitem").html() == undefined){
			// 		var dlh = t.find("dl").height(), ddh = dlh - 55, ocount = parseInt(ddh/32), aCount = t.find("dd a").length;
			// 		// t.find("dd").css("height", ddh+"px");
			// 		t.find(".sub-category").css({"width": Math.ceil(aCount/ocount) * 120 + "px"});
			// 		t.find("dd a").each(function(i){ t.find("dd a").slice(i*ocount,i*ocount+ocount).wrapAll("<div class='subitem'>");});
			// 	}
			// }, 1);

		}
	}, function(){
		$(this).removeClass("active");
	});

	// 焦点图
    $(".slideBox").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});


	// 推荐职位tab
	$(".RecoLead ul li").hover(function(){
		var x = $(this),index = x.index();
		x.addClass('active').siblings().removeClass('active');
		$('.PositionList .PositionType').eq(index).show().siblings().hide()
	})

	//导航【鼠标经过】
	$(".nav li").hover(function(){
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
	}, function(){
		$(".nav li").removeClass("active");
		$(".nav ul").find(".curr").addClass("active");
	});

})
