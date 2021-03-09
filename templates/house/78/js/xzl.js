$(function(){

	$("img").scrollLoading();

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
