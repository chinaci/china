$(function(){
	var keyWord=$('.keyWords').text();

	$.fn.getAjax({
    		page:1,
			pageSize:5,
			title:keyWord,
			container:'#hidePageLoadId'
    })
})