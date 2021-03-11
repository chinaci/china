/**
 * 会员中心商家点评
 * by guozi at: 20170328
 */

var objId = $("#list"), isload = false;
$(function(){

	getList(1);

	$("#stateCon li").click(function(){
		if(isload) return;
		$(this).addClass("active").siblings().removeClass("active");
		getList(1);
	})

	// 确认,取消订单
	objId.delegate(".ok, .end, .cancel", "click", function(){
		var t = $(this), id = t.closest("table").attr("data-id");
		var state = 0;
		if(t.hasClass("ok")){
			state = 1;
		}else if(t.hasClass("end")){
			state = 2;
		}if(t.hasClass("cancel")){
			state = 3;
		}

		if(state == 1){
			$.dialog.confirm(langData['siteConfig'][27][86], function(){
				updateState(id, state);
			})
		}else if(state == 2){
			$.dialog.confirm(langData['siteConfig'][27][87], function(){
				updateState(id, state);
			})
		}else if(state == 3){
			$.dialog.prompt(langData['siteConfig'][20][425], function(str){
				updateState(id, state, str);
			}, langData['siteConfig'][20][428])
		}

	})

	function updateState(id, sta, str){
		$.ajax({
			url: '/include/ajax.php?service=business&action=paiduiUpdateState&state='+sta+'&id='+id+(sta == 3 ? '&cancel_bec='+str : ''),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
					location.reload();
				}else{
					$.dialog.alert(data.info);
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
			}
		})
	}

});



function getList(is){

	if(isload) return;

	$('.main').animate({scrollTop: 0}, 300);

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	var state = $("#stateCon li.active").attr("data-id");

	isload = true;
	$.ajax({
		url: masterDomain+"/include/ajax.php?service=business&action=maidanOrder&u=1&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {

			// return;
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item         = [],
								id           = list[i].id,
								ordernum     = list[i].ordernum,
								orderstate   = list[i].state,
								amount       = list[i].amount,
								amount_alone = list[i].amount_alone,
								payamount    = list[i].payamount,
								paytype      = returnPaytype(list[i].paytype),
								orderdate    = huoniao.transTimes(list[i].pubdate, 1),
								paydate      = huoniao.transTimes(list[i].paydate, 1),
								user         = list[i].user;

							var detailUrl = editUrl.replace("%id%", id);
							var fhUrl = detailUrl.indexOf("?") > -1 ? detailUrl + "&rates=1" : detailUrl + "?rates=1";
							var stateInfo = btn = "";

							html.push('<table data-id="'+id+'" style="margin-top:0;border:none;"><colgroup><col style="width:20%;"><col style="width:16%;"><col style="width:16%;"><col style="width:16%;"><col style="width:16%;"></colgroup>');
							html.push('<tbody>');

							cla = "";
							html.push('<tr'+cla+'>');
							html.push('<td class="nb">'+ordernum+'</td>');
							html.push('<td class="nb">'+amount+'</td>');
							html.push('<td class="nb">'+amount_alone+'</td>');
							html.push('<td class="nb">'+payamount+'</td>');
							html.push('<td class="nb">'+paytype+'</td>');
							html.push('<td class="bf" rowspan="1"><div>'+paydate+'</td>');

							html.push('</tr>');

							html.push('</tbody>');

						}


						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
					}

					$("#total").html(pageInfo.totalCount);
					totalCount = pageInfo.totalCount;

					showPageInfo();

					$("#total").text(pageInfo.totalCount);
					$("#unused").text(pageInfo.totalGray);
					$("#eating").text(pageInfo.totalEat);
					$("#recei").text(pageInfo.totalAudit);
					$("#cancel").text(pageInfo.totalCancel);

				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}

			isload = false;

		}
	});
}

function returnPaytype(type){
  var paytypeArr = [];
	paytypeArr['alipay'] = langData['siteConfig'][19][699];
  paytypeArr['wxpay'] = langData['siteConfig'][19][700];
  paytypeArr['money'] = langData['siteConfig'][19][328];
  paytypeArr['point'] = langData['siteConfig'][19][701];
  paytypeArr['unionpay'] = langData['siteConfig'][19][702];
  paytypeArr['paypal'] = langData['siteConfig'][19][703];
  paytypeArr['tenpay'] = langData['siteConfig'][19][704];

  var r = [];
  var typeArr = type.split(',');
  for(var m = 0; m < typeArr.length; m++){
    for(var i in paytypeArr){
      if(i == typeArr[m]){
        r.push(paytypeArr[i]);
        break;
      }
    }
  }
  return r.join(",");
}
