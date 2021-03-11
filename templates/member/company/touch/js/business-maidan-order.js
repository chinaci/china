/**
 * 会员中心商家订座
 */

$(function(){

	// getList(1);
	var turnState = 0;
	function getConfig(){
		$.ajax({
			url: '/include/ajax.php?service=business&action=serviceUpdateState&get=1&type='+type,
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
					turnState = 1;
					$(".header-r").html('<a class="totalTurn">'+langData['siteConfig'][6][15]+'<span>'+langData['siteConfig'][16][148]+'</span></a>');
				}else{
					turnState = 0;
					$(".header-r").html('<a class="totalTurn">'+langData['siteConfig'][6][24]+'<span>'+langData['siteConfig'][16][149]+'</span></a>');
				}
			}
		})
	}

	$("body").delegate(".totalTurn", "click", function(){
		var t = $(this);
		if(t.hasClass('disabled')) return;
		t.addClass('disabled');
		$.ajax({
			url: '/include/ajax.php?service=business&action=serviceUpdateState&type='+type,
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
					turnState = turnState == 0 ? 1 : 0;
					if(turnState == 1){
						$(".header-r").html('<a class="totalTurn">'+langData['siteConfig'][6][15]+'<span>'+langData['siteConfig'][16][148]+'</span></a>');
					}else{
						$(".header-r").html('<a class="totalTurn">'+langData['siteConfig'][6][24]+'<span>'+langData['siteConfig'][16][149]+'</span></a>');
					}
				}else{
					alert(data.info);
					t.removeClass('disabled');
				}
			}
		})
	})

	// 展开详情
	objId.delegate(".detail", "click", function(){
		var t = $(this), p = t.closest(".item");
		if(p.hasClass("showDetail")){
			p.removeClass("showDetail");
			t.text(langData['siteConfig'][6][113]);
		}else{
			p.addClass("showDetail");
			t.text(langData['siteConfig'][16][77]);
		}
	})

	// 确认,取消订单
	objId.delegate(".ok, .cancel", "click", function(){
		var t = $(this), id = t.closest(".item").attr("data-id");
		var state = 0;
		if(t.hasClass("ok")){
			state = 1;
		}if(t.hasClass("cancel")){
			state = 2;
		}

		if(state == 1){
			if(confirm(langData['siteConfig'][20][427])){
				updateState(id, state);
			}
		}else if(state == 2){
			var str = prompt(langData['siteConfig'][20][425], langData['siteConfig'][20][428]);
			if(str != undefined){
				updateState(id, state, str);
			}
		}

	})

	function updateState(id, sta, str){
		$.ajax({
			url: '/include/ajax.php?service=business&action=paiduiUpdateState&u=1&state='+sta+'&id='+id+(sta == 2 ? '&cancel_bec='+str : ''),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
					location.reload();
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][183]);
			}
		})
	}

	getConfig();

});



function getList(is){

	objId.html('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

	state = $(".tab-all .curr").attr("data-id");

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=business&action=maidanOrder&u=1&page="+atpage+"&pageSize="+pageSize+"&state="+state,
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
								youhui_value = list[i].youhui_value,
								payamount    = list[i].payamount,
								paytype      = returnPaytype(list[i].paytype),
								orderdate    = huoniao.transTimes(list[i].pubdate, 1),
								paydate      = huoniao.transTimes(list[i].paydate, 1),
								user         = list[i].user;

							var detailUrl = editUrl.replace("%id%", id);
							var fhUrl = detailUrl.indexOf("?") > -1 ? detailUrl + "&rates=1" : detailUrl + "?rates=1";
							var stateInfo = btn = "";

							item.push('<div class="item" data-id="'+id+'">');
							item.push('    <p class="order-number fn-clear">');
							item.push('        <span class="fn-left">'+langData['siteConfig'][19][308]+'：'+ordernum+'</span>');
							item.push('        <span class="time">'+orderdate+'</span></p>');
							item.push('    <p class="store fn-clear">');
							item.push('        <span class="title fn-clear">');
							item.push('            <em class="sname">'+langData['siteConfig'][19][514]+'：'+echoCurrency('symbol')+payamount+'</span></em>');
							item.push('        </span>');
							item.push('        <span class="state">'+stateInfo+'</span>');
							item.push('    </p>');
							item.push('    <div class="detail-con">');
							item.push('    	<div class="box">');
							item.push('        <div class="fn-clear">');
							item.push('            <div class="">');
							item.push('                <p class="gname" style="height:auto;">'+langData['siteConfig'][19][512]+'：<span>'+amount+'</span></p></div>');
							item.push('        </div>');
							item.push('        <div class="fn-clear">');
							item.push('            <div class="">');
							item.push('                <p class="gname" style="height:auto;">'+langData['siteConfig'][19][870]+'：<span>'+(youhui_value  ? (langData['siteConfig'][19][698]+youhui_value+'%') : langData['siteConfig'][13][20]) + '</span></p></div>');
							item.push('        </div>');
							item.push('        <div class="fn-clear">');
							item.push('            <div class="">');
							item.push('                <p class="gname" style="height:auto;">'+langData['siteConfig'][19][513]+'<span>'+amount_alone+'</span></p></div>');
							item.push('        </div>');
							item.push('        <div class="fn-clear">');
							item.push('            <div class="">');
							item.push('                <p class="gname" style="height:auto;">'+langData['siteConfig'][19][53]+'：<span>'+paydate+'</span></p></div>');
							item.push('        </div>');
							item.push('        <div class="fn-clear">');
							item.push('            <div class="">');
							item.push('                <p class="gname" style="height:auto;">'+langData['siteConfig'][19][52]+'：<span>'+paytype+'</span></p></div>');
							item.push('        </div>');
							item.push('    	</div>');
							item.push('    </div>');
							item.push('    <p class="btns fn-clear">');
							item.push('        <a href="javascript:;" class="blueBtn detail">'+langData['siteConfig'][19][313]+'</a>'+btn);
							item.push('    </p>');
							item.push('</div>');

							html.push(item.join(""));
						}


						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
					}

					$("#total").text(pageInfo.totalCount);
					$("#unused").text(pageInfo.totalGray);
					$("#recei").text(pageInfo.totalAudit);
					$("#cancel").text(pageInfo.totalCancel);

					totalCount = pageInfo.totalCount;
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
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
