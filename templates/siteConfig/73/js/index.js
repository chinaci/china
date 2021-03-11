$(function(){

	// 焦点图
	jQuery("#slideBox1").slide({titCell:".hd ul",mainCell:".bd ul",effect:"left",autoPlay:true,autoPage:"<li></li>"});

	// 文字向上滚动
	jQuery(".txtScroll-top").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"top",autoPlay:true,scroll:1,vis:4});

	// 推荐咨询 图片滚动
	jQuery("#slidebox2").slide({mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,vis:3,scroll:3,trigger:"mouseover"});

	// 美食优惠信息
	function youhuiSlideFun(){
		jQuery("#slideBox3").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,autoPage:"<li></li>",vis:3,scroll:3,trigger:"mouseover",delayTime:1000});
	}
	var youhuiSlide = $('#slideBox3').clone();
		youhuiSlideFun();


	// 信息 tab切换
	jQuery(".inBox").slide({ titCell:".inHd li",mainCell:".inBd" });

	// 房产推荐楼盘
	jQuery("#slideBox4").slide({titCell:".hd ul",mainCell:".bd .ulWrap",autoPage:"<li></li>",effect:"leftLoop",autoPlay:true,delayTime:1000,interTime:4000});

	// 文化-人物
	jQuery("#slideBox5").slide({mainCell:".bd .ulWrap",effect:"topLoop",autoPlay:true,delayTime:1000,interTime:4000});

	// 影音-1
	jQuery("#slideBox6").slide({ mainCell:".bd ul",effect:"fade",autoPlay:false });

	// 影音-视频展示
	function videoSlideFun(){
		jQuery("#slideBox7").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:true,autoPage:"<li></li>",vis:4,scroll:4,trigger:"mouseover",delayTime:1000,interTime:4000});
	}
	var videoSlide = $('#slideBox7').clone();
		videoSlideFun();


	$(window).on('winSizeChange',function(obj,now){
		$("#slideBox3").remove();
		$('.module-meishi .youhui').append(youhuiSlide.clone());
		youhuiSlideFun();

		$("#slideBox7").remove();
		$('.module-video .videoshow').append(videoSlide.clone());
		videoSlideFun();
	})

	// 活动
	jQuery("#slideBox8").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true,delayTime:1000,interTime:4000});

	// 品牌联盟
	jQuery("#slideBox9").slide({titCell:".mtitle .pages",mainCell:".listbox",effect:"topLoop",vis:2,scroll:1,autoPlay:true,autoPage:"<li></li>",delayTime:1000,interTime:4000});

	//页面自适应设
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
		var isHaveBig = $("html").hasClass(criticalClass),now;
		if(screenwidth < criticalPoint){
			$("html").removeClass(criticalClass);
			now = false;
		}else{
			$("html").addClass(criticalClass);
			now = true;
		}
		if(isHaveBig && !now || !isHaveBig && now) {
			$(window).trigger('winSizeChange' , now);
		}
	});
})