$(function(){

	$("img").scrollLoading();

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

	$("#totalCount").html(totalCount);
	if(totalPage > 1){
		$(".o-p").show();
		if(atPage == 1){
			$(".o-p .prev").addClass("dis");
		}else{
			$(".o-p .prev").attr("href", pageUrl.replace("%page%", atPage - 1));
		}
		if(atPage == totalPage){
			$(".o-p .next").addClass("dis");
		}else{
			$(".o-p .next").attr("href", pageUrl.replace("%page%", atPage + 1));
		}
	}

});
