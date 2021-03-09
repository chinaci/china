$(function(){

	$("img").scrollLoading();

	$(".m-t .sta strong").html(totalCount);

	if($(".loupan-history dd").length == 0){
		$(".loupan-history").hide();
	}

	//区域、公交/地铁
	$(".t-fi-item li a").bind("click", function(){
		var t = $(this).parent(), index = t.index();
		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			$(".t-fi .sub-fi").hide();
			$(".t-fi .sub-fi:eq("+index+")").show();
		}else{
			t.removeClass("curr");
			$(".t-fi .sub-fi:eq("+index+")").hide();
		}
	});

	//更多筛选条件
	$(".filter .more .item").hover(function(){
		$(this).find("ul").stop().slideDown(150);
	}, function(){
		$(this).find("ul").stop().slideUp(150);
	});

	//排序
	$(".m-o a").bind("click", function(){
		var t = $(this);

		//筛选
		if(t.hasClass("fi")){
			t.hasClass("on") ? t.removeClass("on") : t.addClass("on");
			return;
		}


		// if(!t.hasClass("curr")){
		// 	t.addClass("curr").siblings("a").removeClass("curr");
		// }else{
		// 	if(t.hasClass("curr") && t.hasClass("ob")){
		// 		t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
		// 	}
		// }

	});

	var house_loupan_plan = $.cookie(cookiePre+"house_loupan_plan");
	if(house_loupan_plan == 1){
		$("#nsplan").addClass("on");
		$(".list .plan").hide();
	}

	//只显示楼盘，隐藏户型
	$("#nsplan").bind("click", function(){
		if($(this).hasClass("on")){
			$(".list .plan").stop().slideUp(150);
			$.cookie(cookiePre+"house_loupan_plan", 1, {expires: 365, domain: masterDomain.replace("http://", ""), path: '/'});
		}else{
			$(".list .plan").stop().slideDown(150);
			$.cookie(cookiePre+"house_loupan_plan", 0, {expires: 365, domain: masterDomain.replace("http://", ""), path: '/'});
		}
	});


	//异步加载户型
	$(".list .item").each(function(){
		var t = $(this), id = t.attr("data-id"), hxcount = Number(t.attr("data-hxcount")), price = t.attr("data-price");
		if(hxcount > 0){

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=house&action=apartmentList&act=loupan&loupanid="+id+"&pageSize=3",
				dataType: "JSONP",
				success: function(data){
					if(data.state == 100){
						var list = data.info.list, html = [];
						for(var i = 0; i < list.length; i++){
							html.push('<li><span class="p-icon" data-img="'+list[i].litpic+'"></span>');
							html.push('<a href="'+list[i].url+'" target="_blank" title="'+list[i].title+'-'+list[i].room+'室'+list[i].hall+'厅'+list[i].guard+'卫">');
							html.push('<span class="p-tit">'+list[i].title+'-'+list[i].room+'室'+list[i].hall+'厅'+list[i].guard+'卫</span>');
							html.push('<span class="p-area">'+list[i].area+' ㎡</span>');
							html.push('<span class="p-face">朝'+list[i].direction+'</span>');

							var totalPrice = price * list[i].area / 10000;
							var pp = '<strong>'+totalPrice.toFixed(2)+'</strong>万'+echoCurrency('short')+'/套';
							if(price == 0){
								pp = '待定';
							}
							html.push('<span class="p-price">'+pp+'</span>');
							html.push('</a></li>');
						}
						t.find(".loading").remove();
						t.find(".plan").prepend(html.join(""));
					}
				}
			})

		}
	});


	//户型缩略图
	$(".list").delegate(".plan .p-icon", "mouseover", function(){
		var t = $(this), img = t.data("img");
		if(t.html() == ""){
			t.html('<img src="'+img+'" />');
		}
	});

});
