$(function(){
	// 幻灯
	$("#slide").cycle({
		fx:	'scrollHorz',
		speed:	'fast',
		pause: true,
		pager: '#pagerlist'
	});

	// 窄屏下鼠标移入装修步骤
	$('.process .k2').hover(function(){
		if($('html').hasClass('w1200')) return;
		$(this).addClass('hover')
	},function(){
		$(this).removeClass('hover');
	})
	$("#gl").cycle({
		fx: 'scrollHorz',
		speed: 300,
		next:	'#glnext',
		prev:	'#glprev',
		pause: true
	});
	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		$("#gl").cycle('pause');

		var screenwidth = window.innerWidth || document.body.clientWidth;
		console.log(screenwidth + '===' + criticalPoint)
		if(screenwidth < criticalPoint){
			$("#gl").cycle({fx: 'scrollHorz', speed: 300, width: "1000px"});
			$("#gl").find(".looklist").css({width: "1000px"});
		}else{
			$("#gl").cycle({fx: 'scrollHorz', speed: 300, width: "1200px"});
			$("#gl").find(".looklist").css({width: "1200px"});
		}
	});



});
