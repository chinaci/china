var winWid = $(window).width(), cc = 6;
cc = winWid > 1240 ? cc : 4;
var page = Math.floor(at/cc);

$(function(){

	//文本框placeholder
	$("html input").placeholder();

	$(".dy .close").bind("click", function(){
		$(".dy").removeClass("popup");
		$(".popup_bg, .dy").hide();
	});


	//左右切换按钮显示、隐藏
	$(".b-album").hover(function(){
		$(this).find(".l, .r").show();
	}, function(){
		$(this).find(".l, .r").hide();
	});

	loadImgList(page);

	//上一页
	$(".sl").bind("click", function(){
		if((page+1) > 1){
			at = page+1;
			page--;

			loadImgList(page);
				
			$(".s-album li").removeClass("curr");
			$(".s-album li:last").addClass("curr");

			var src = $(".s-album li:last").attr("data-big");
			$(".b-album img").attr("src", src);
			$(".pics").attr("href", src);
		}
	});
	
	//下一页
	$(".sr").bind("click", function(){
		if((page+1)*cc < pics.length){
			at = (page+1)*cc;
			page++;
		}else{
			at = 0;
			page = 0;
		}
		loadImgList(page);
	});
	
	//上一张
	$(".prev").bind("click", function(){
		var index = $(".s-album .curr").index();
		if(index == 0){
			$(".sl").click();
		}else{
			$(".s-album .curr").prev("li").click();
		}
	});
	
	//下一张
	$(".next").bind("click", function(){
		var index = $(".s-album .curr").index();
		if(index == $(".s-album li").length-1){
			$(".sr").click();
		}else{
			$(".s-album li.curr").next("li").click();
		}
	});
	
	//左右键盘
	$(document).keydown(function(event){
		if(event.keyCode == 37) {
			$(".prev").click();
			event.preventDefault();
		}else if(event.keyCode == 39) {
			$(".next").click();
			event.preventDefault();
		}
	});	
	
	//点击图集列表
	$(".s-album").delegate("li", "click", function(){
		var t = $(this), src = t.attr("data-big");
		if(src && !t.hasClass("curr")){
			t.siblings("li").removeClass("curr");
			t.addClass("curr");
			$(".b-album img").attr("src", src);
			$(".pics").attr("href", src);
		}
	});

	//加载图片
	function loadImgList(page){
		if(pics && pics.length > 0){
			var f = 0, ul = $(".s-album ul");
			var a = at ? at : 0;
			ul.html("");
			for(i = page*cc; i < pics.length; i++){
				if(f >= cc){
					return;
				}
				var cla = "";
				if(a == i){
					cla = " class='curr'";
					$(".b-album img").attr("src", pics[i]['big']);
					$(".pics").attr("href", pics[i]['big']);
				}
				ul.append('<li'+cla+' data-big="'+pics[i]['big']+'"><s></s><img src="'+pics[i]['small']+'" /></li>');
				f++;
			}
		}
	}

});