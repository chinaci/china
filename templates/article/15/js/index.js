$(function(){

	//头部导航鼠标经过重新加载背景图
	$(".nsNav a").on("mouseenter", function(){
		var t = $(this).find("s"), obj = t.closest("li"), img = "jian";
		if(obj.hasClass("n1")){
			img = "xw";
		}else if(obj.hasClass("n3")){
			img = "loc";
		}
		t.attr("style", "background:url('"+masterDomain+"/templates/article/skin1/images/"+img+".gif?v="+Math.random()+"')");
	});

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=5",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".weatherInfo").append(data.info);
			}
		}
	});

	//slideshow_600_320
	var sid = 600320;
	$("#slideshow"+sid).cycle({
		fx: 'scrollHorz',
		speed: 300,
		pager: '#slidebtn'+sid,
		next:	'#slidebtn'+sid+'_next',
		prev:	'#slidebtn'+sid+'_prev',
		pause: true
	});

	//TAB切换
	$(".cutTab li").hover(function(){
		var t = $(this), index = t.index();
		if(!t.hasClass("current")){
			t.siblings("li").removeClass("current");
			t.addClass("current");

			t.parent().siblings(".cutCon").hide();
			t.parent().siblings(".cutCon").eq(index).show();
		}
	});

});
