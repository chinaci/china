/**
 * 会员中心招聘投递职位列表
 * by guozi at: 20160527
 */

var objId = $("#list");
$(function(){

	getList(1);

});

function getList(is){

	if(is != 1){
		$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');  ////加载中 ，请稍后
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=job&action=deliveryList&type=person&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");   //暂无相关信息！
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item = [],
									id   = list[i].aid,
									post = list[i].post,
									date = list[i].date;

							html.push('<tr><td class="fir"></td>');
							html.push('<td><a href="'+post['url']+'" target="_blank" title="'+post['title']+'">'+post['title']+'</a></td>');
							html.push('<td><a href="'+post['domain']+'" target="_blank">'+post['company']+'</a></td>');
							html.push('<td>'+date+'</td>');
							html.push('</tr>');
						}

						objId.html('<table><thead class="thead"><tr><th class="fir"></th><th>'+langData['siteConfig'][19][408]+'</th><th>'+langData['siteConfig'][19][354]+'</th><th>'+langData['siteConfig'][19][409]+'</th></tr></thead><tbody>'+html.join("")+'</tbody></table>');
					//职位名称---公司名称---收藏时间
					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
					}

					totalCount = pageInfo.totalCount;
					$("#total").html(pageInfo.totalCount);
					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
			}
		}
	});
}
