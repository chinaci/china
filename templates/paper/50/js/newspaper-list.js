$(function(){

	// 图片专题
	$('.zhuanti-lead ul li').hover(function(){
		var x = $(this);
		var index = x.index();
		x.addClass('uil');
		x.siblings('li').removeClass('uil');
		$('.zz ul').eq(index).show();
		$('.zz ul').eq(index).siblings().hide();

	})
	// 板块滚动
	$(".front-page").slide({mainCell:".fp-txt"
		,autoPage:true,autoplay:false,
		effect:"top",scroll:1,vis:13,trigger:"click"
		,mouseOverStop:true,pnLoop:false,
		prevCell:".fp-1",nextCell:".fp-2",
	});

	$(".navigation").slide({mainCell:".nav-txt ul"
		,autoPage:true,
		effect:"top",scroll:1,vis:22,trigger:"click"
		,mouseOverStop:true,pnLoop:false,
		prevCell:".na-1",nextCell:".na-2",
	});


	//map area hover
	function mapAreaHover(target_items){
		$(target_items).each(function(i){
			$(this).mouseover(function(){
				var title =$(this).attr("name");
				$("#showRedpops").html(title);
				$("#showRedpops").css({opacity:0.88,"font-family":"arial"}).show();
			}).mousemove(function(kmouse){
				$("#showRedpops").css({left:kmouse.pageX+8, top:kmouse.pageY+15});
			}).mouseout(function(){
				$("#showRedpops").hide();
			});
		});
	}

	mapAreaHover("AREA.areablock");


	//版面目录 hover
	function folderHover(target_items){
		$(target_items).each(function(i){
			$(this).mouseover(function(){
				var img =$(this).attr("data-img");
				$("#showImgpops").html('<img src="'+img+'" />');
				$("#showImgpops").show();
			}).mousemove(function(kmouse){
				$("#showImgpops").css({left:kmouse.pageX+8, top:kmouse.pageY+15});
			}).mouseout(function(){
				$("#showImgpops").hide();
			});
		});
	}

	folderHover(".navigation li p");


	//选择日期
	$(".laydate-icon").bind("click", function(){
		laydate({
			choose: function(dates){
				location.href = searchUrl.replace("%1", dates);
			}
		});
	});


})
