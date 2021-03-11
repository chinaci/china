$(function() {

	//页面自适应设置
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
		if(screenwidth < criticalPoint){
			$("html").removeClass(criticalClass);
			$("html").addClass('w1000');

		}else{
			$("html").addClass(criticalClass);
			$("html").removeClass('w1000');
		}

	});

	// 爆料
	$('.baoliao-tit .tit-r').hover(function(){
		$('.code').show();
	},function(){
		$('.code').hide();
	})

	// 新闻幻灯片
	jQuery(".news-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "left",
		autoPage: true,
		startFun: function(i) {
			jQuery(".news-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	// 房产幻灯片
	jQuery(".house-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "fade",
		autoPage: true,
		startFun: function(i) {
			jQuery(".house-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	// 房产滚动图片

	jQuery(".w1000 .estate-con .house-img").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		effect: "leftLoop",
		autoPage: true,
		vis: 4,
		scroll: 4,
		prevCell: ".sw-pre",
		nextCell: ".sw-next",
		interTime: 6000,
		delayTime: 500
	});
	jQuery(".house-img").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		effect: "leftLoop",
		autoPage: true,
		vis: 5,
		scroll: 5,
		prevCell: ".sw-pre",
		nextCell: ".sw-next",
		interTime: 6000,
		delayTime: 500
	});
	

	// 家居幻灯片
	jQuery(".jia-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "fade",
		autoPage: true,
		startFun: function(i) {
			jQuery(".jia-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	// 家居图片滚动
	jQuery(".de-img-con").slide({
		mainCell: ".bd ul",
		autoPlay: true,
		effect: "top",
		autoPage: true,
		interTime: 5000,
		delayTime: 500
	});

	//汽车幻灯片
	jQuery(".car-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "fade",
		autoPage: true,
		startFun: function(i) {
			jQuery(".car-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	// 汽车图片滚动
	if (jQuery('.car-con li').length > 2) {
		jQuery(".car-box-img").slide({
			mainCell: ".car-con ul",
			autoPlay: true,
			effect: "top",
			autoPage: true,
			vis: 2,
			scroll: 2,
		});
	}

	// 汽车幻灯片
	jQuery(".food-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "fold",
		autoPage: true,
		startFun: function(i) {
			jQuery(".food-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	//婚嫁幻灯片
	jQuery(".ma-slide").slide({
		mainCell: ".bd .ul-img",
		titCell: ".hd ul",
		autoPlay: true,
		effect: "fold",
		autoPage: true,
		startFun: function(i) {
			jQuery(".ma-slide .txt li").eq(i).animate({
				"bottom": 0
			}).siblings().animate({
				"bottom": -36
			});
		}
	});

	// 婚嫁图片滚动
	if (jQuery('.ma-img .bd li').length > 2) {
		jQuery(".ma-img").slide({
			mainCell: ".bd ul",
			autoPlay: true,
			effect: "top",
			autoPage: true,
			vis: 2,
			scroll: 2,
		});
	}

	//热门图片
	$('.abso').hover(function() {
		$(this).find('.popup').hide();
		$(this).siblings().find('.popup').show();
	}, function() {
		$('.abso').find('.popup').hide();
	})

	// 二手出租房切换
	$('#tesf').click(function() {
		var dom = $("#tczf-table")
		var m = $('#tesf').html();
		var n = $('#tczf').html();
		$('#tczf').html(m);
		$('#tesf').html(n);
		if (dom.css("display") == 'none') {
			dom.show();
			$('#tesf-table').hide();
		} else {
			dom.hide();
			$('#tesf-table').show();
		}
	})
	$('.change').click(function() {
		var dom = $("#tczf-table")
		var m = $('#tesf').html();
		var n = $('#tczf').html();
		$('#tczf').html(m);
		$('#tesf').html(n);

		if (dom.css("display") == 'none') {
			dom.show();
			dom.siblings('.house-table').hide();
		} else {
			dom.hide();
			dom.siblings('.house-table').show();
		}
	})
	$('.choose').click(function() {
		var dom = $("#zxid-con")
		var m = $('#jcid').html();
		var n = $('#zxid').html();
		$('#zxid').html(m);
		$('#jcid').html(n);

		if (dom.css("display") == 'none') {
			dom.show();
			$('#jcid-con').hide();
		} else {
			dom.hide();
			$('#jcid-con').show();
		}
	})
	$('#jcid').hover(function() {
		var dom = $("#zxid-con")
		var m = $('#jcid').html();
		var n = $('#zxid').html();
		$('#zxid').html(m);
		$('#jcid').html(n);

		if (dom.css("display") == 'none') {
			dom.show();
			$('#jcid-con').hide();
		} else {
			dom.hide();
			$('#jcid-con').show();
		}
	}, function() {})

	$('.food-act-lbox').hover(function() {
		$(this).find('.food-act-lbox-bg').show();
		$('.food-act-rt-bg').hide();
		$('#prefeBox-1').show();
		$('#prefeBox-2').hide();
		$('#prefeBox-3').hide();
	}, function() {})

	$('.food-act-rt li div').hover(function() {
		$(this).find('.food-act-rt-bg').show();
		$(this).parent().siblings().find('.food-act-rt-bg').hide();
		$('.food-act-lbox-bg').hide();
		$('#prefeBox-1').hide();
		
	}, function() {})

	$('#rt-2').hover(function() {
		$('#prefeBox-1').hide();
		$('#prefeBox-2').show();
		$('#prefeBox-3').hide();
	}, function() {})
	$('#rt-3').hover(function() {
		$('#prefeBox-1').hide();
		$('#prefeBox-2').hide();
		$('#prefeBox-3').show();
	}, function() {})

	
})

