/**
 * 会员中心招聘面试邀请列表
 * by guozi at: 20160527
 */

var objId = $("#list");
$(function(){

	//类型切换
	lei = 0;
	$(".sel label").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr")){
			lei = id;
			state = "";
			atpage = 1;

			$(".main-sub-tab li:eq(1)").addClass("curr").siblings("li").removeClass("curr");
			t.addClass("curr").siblings("label").removeClass("curr");

			getList();
		}
	});

	getList(1);




	//标记
  objId.delegate(".link", "click", function(){
		var id = $(this).closest("tr").attr("data-id");
		var state = [];
		state.push('<label><input type="radio" name="state" value="0" />'+langData['siteConfig'][9][31]+'</label>');  //待处理
		state.push('<label><input type="radio" name="state" value="1" />'+langData['siteConfig'][9][32]+'</label>');   //已面试
		state.push('<label><input type="radio" name="state" value="2" />'+langData['siteConfig'][9][33]+'</label>');   //不合适

    $.dialog({
			id: "dataInfo",
			fixed: true,
			title: langData['siteConfig'][6][138],   //标记
			content: '<div class="chooseState fn-clear">'+state.join("")+'</div>',
			width: 300,
			height: 120,
			ok: function(){
        var state = $(".chooseState input:checked").val();

				if(state == undefined){
					$.dialog.tips(langData['siteConfig'][20][529], 3, 'error.png');   //请选择要标记的状态！
					return false;
				}

        $.ajax({
          url: masterDomain + "/include/ajax.php?service=job&action=invitationUpdate&id="+id+"&state="+state,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data.state == 100){
              getList();
            }else{
              $.dialog.tips(data.info, 3, 'error.png');
            }
          },
          error: function(){
            $.dialog.tips(langData['siteConfig'][20][530], 3, 'error.png');   //网络错误，邀请失败！
          }
        });

      }
		});

  });


});

function getList(is){

	if(is != 1){
		$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');//加载中 ，请稍后
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=job&action=invitationList&type=person&state="+lei+"&page="+atpage+"&pageSize="+pageSize,
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
									id   = list[i].id,
									post = list[i].post,
									state = list[i].state,
									date = list[i].date;

							html.push('<tr data-id="'+id+'"><td class="fir"></td>');
							html.push('<td><a href="'+post['url']+'" target="_blank" title="'+post['title']+'">'+post['title']+'</a></td>');
							html.push('<td><a href="'+post['domain']+'" target="_blank">'+post['company']+'</a></td>');
							html.push('<td>'+date+'</td>');

							var states = "";
							switch (state) {
								case "0":
									states = langData['siteConfig'][9][31];    //待处理
									break;
								case "1":
									states = langData['siteConfig'][9][32];    //已面试
									break;
								case "2":
									states = langData['siteConfig'][9][33];    //不合适
									break;
							}
							html.push('<td class="state'+state+'">'+states+'</td>');
							html.push('<td><a href="javascript:;" class="link">'+langData['siteConfig'][6][138]+'</a></td>');  //标记
							html.push('</tr>');
						}

						objId.html('<table><thead class="thead"><tr><th class="fir"></th><th>'+langData['siteConfig'][19][408]+'</th><th>'+langData['siteConfig'][19][354]+'</th><th>'+langData['siteConfig'][23][110]+'</th><th>'+langData['siteConfig'][19][307]+'</th><th>'+langData['siteConfig'][6][11]+'</th></tr></thead><tbody>'+html.join("")+'</tbody></table>');
					//职位名称---公司名称---邀请时间---状态---操作
					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
					}

					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.state0;
							break;
						case "1":
							totalCount = pageInfo.state1;
							break;
						case "2":
							totalCount = pageInfo.state2;
							break;
					}

					$("#state0").html(pageInfo.state0);
					$("#state1").html(pageInfo.state1);
					$("#state2").html(pageInfo.state2);
					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  //暂无相关信息！
			}
		}
	});
}
