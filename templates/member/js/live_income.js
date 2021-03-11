var objId = $("#list");
$(function(){
	 getList(1);
	 // 筛选
	 
	 $(".live_orderby ").click(function(e){
	 	$(".orderby_ul").slideUp();
	 	if($(this).find('.orderby_ul').is(':hidden')){
	 		$(this).find(".orderby_ul").slideDown();
	 		$(document).one("click",function(){
	 			$(".orderby_ul").slideUp();
	 		})
	 	}else{
	 		$(".orderby_ul").slideUp();
	 	}
	 	e.stopPropagation();
	 });
	 
	 $(".orderby_ul li").click(function(){
	 	var t = $(this);
	 	var ul = t.closest('ul');
	 	var txt = t.text();
	 	var val = t.attr('data-value');
	 	input = ul.siblings("input");
	 	input.val(txt).attr('data-val',val);
	 	
	 	var orderby = $("#orderby").attr('data-val');
	 	getList('',orderby)
	 	ul.slideUp();
	 });
	 
	 // 点击搜索按钮
	 $(".search_btn").click(function(){
	 	keywords = $.trim($("#search").val());
	 	getList(1);
	 })
	 
});
function getList(is,orderby){
	
	if(is != 1){
		$('html, body').animate({scrollTop: $(".live_head").offset().top}, 300);
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');  //加载中，请稍候
	$(".pagination").hide();
	$.ajax({
		url: "/include/ajax.php?service=live&action=imgTextList&chatid="+chatid+"&page="+atpage+"&pageSize="+pageSize+"&keywords="+keywords+"&orderby="+(orderby?orderby:''),
		type: "GET",
		dataType: "json",
		success: function (data) {
			if(data && data.state != 200){
				
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  // //暂无相关信息！
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					$(".live_head h3 .all_count span").text(echoCurrency('symbol')+data.info.pageInfo.totalCount)
					//拼接列表
					if(list.length > 0){

						for(var i = 0; i < list.length; i++){
							var item    = [],
								id      = list[i].id,
								img     = list[i].img,
								text    = list[i].text,
								pubdate = list[i].pubdate,
								title   = '';
							html.push('<li class="fn-clear" data-id="'+id+'">');
							html.push('<div class="incomebox fn-clear">');
							html.push('<div class="ic_user fn-clear">');
							html.push('<div class="user_img"><img src="">	</div>');
							html.push('<div class="user_detail">');
							html.push('<h4>这里是礼物名</h4>');
							html.push('<p>ID：12356563</p>');
							html.push('<p>女</p></div></div>');
							html.push('<div class="ic_time"><p>'+pubdate+'</p></div>');
							html.push('<div class="ic_money">'+echoCurrency('symbol')+'<em>1500</em></div></div></li>');
							
						}

						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>"); //暂无相关信息！
					}

					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.gray;
							break;
						case "1":
							totalCount = pageInfo.audit;
							break;
						case "2":
							totalCount = pageInfo.refuse;
							break;
					}
					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>"); //暂无相关信息！
			}
		}
	}); 
}