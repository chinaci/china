$(function(){

	//slideshow_1200_80
	$("#slideshow120080").cycle({ 
		fx: 'turnUp',
		speed: 300,
		pager: '#slidebtn120080',
		pause: true
	});

	$(".slideshow_1200_80 .close").click(function(){
		$(this).parent().remove();
	});

	//分类导航
	$(".shnav").hover(function(){
		$(this).find(".category-popup").show();
	}, function(){
		$(this).find(".category-popup").hide();
	});

	$(".category-popup li").hover(function(){
		var t = $(this);
		if(!t.hasClass("active")){
			t.parent().find("li").removeClass("active");
			t.addClass("active");

			setTimeout(function(){
				if(t.find(".subitem").html() == undefined){
					var dlh = t.find("dl").height(), ddh = dlh - 55, ocount = parseInt(ddh/32), aCount = t.find("dd a").length;
					t.find("dd").css("height", ddh+"px");
					t.find(".sub-category").css({"width": Math.ceil(aCount/ocount) * 120 + "px"});
					t.find("dd a").each(function(i){ t.find("dd a").slice(i*ocount,i*ocount+ocount).wrapAll("<div class='subitem'>");});
				}
			}, 1);
			
		}
	}, function(){
		$(this).removeClass("active");
	});

});