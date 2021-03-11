/**
 * 会员中心商城订单列表
 * by guozi at: 20151130
 */

$(function(){

	//状态切换
	$(".tab ul li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr") && !t.hasClass("sel")){
			state = id;
			atpage = 1;
			t.addClass("curr").siblings("li").removeClass("curr");
			objId.html('');
			getList();
		}
	});

	// 获取url参数

	function getParam(paramName) {
	    paramValue = "", isFound = !1;
	    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
	        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
	        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
	    }
	    return paramValue == "" && (paramValue = null), paramValue
	}
	if(getParam('state')){
		$(".tab ul li[data-id='"+getParam('state')+"']").click()
	}
	// 下拉加载
	$(window).scroll(function() {
		var h = $('.myitem').height();
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - h;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});

	//收货
	objId.delegate(".sh", "click", function(){
		var t = $(this), par = t.closest(".myitem"), id = par.attr("data-id");
		if(id){
			if(confirm(langData['siteConfig'][20][188])){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=shop&action=receipt&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							t.removeClass("load").html(langData['siteConfig'][6][108]);
							setTimeout(function(){objId.html('');getList();}, 1000);

						}else{
							alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			};
		}
	});

});

function getList(is){

  isload = true;

	if(is != 1){
		// $('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=shop&action=orderList&state="+state+"&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [], durl = $(".tab ul").data("url"), rUrl = $(".tab ul").data("refund"), cUrl = $(".tab ul").data("comment");
					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.unpaid;
							break;
						case "1":
							totalCount = pageInfo.ongoing;
							break;
						case "3":
							totalCount = pageInfo.success;
							break;
						case "4":
							totalCount = pageInfo.refunded;
							break;
						case "5":
							totalCount = pageInfo.rates;
							break;
						case "6":
							totalCount = pageInfo.recei;
							break;
						case "7":
							totalCount = pageInfo.closed;
							break;
						case "10":
							totalCount = pageInfo.cancel;
							break;
					}

					var msg = totalCount == 0 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][185];
					 console.log(list)
					//拼接列表
					if(list.length > 0){
						$('.no-data').hide();
						for(var i = 0; i < list.length; i++){
							var item       = [],
									id         = list[i].id,
									ordernum   = list[i].ordernum,
									orderstate = list[i].orderstate,
									retState   = list[i].retState,
									orderdate  = huoniao.transTimes(list[i].orderdate, 1),
									expDate    = list[i].expDate,
									payurl     = list[i].payurl,
									common     = list[i].common,
									commonUrl  = list[i].commonUrl,
									paytype    = list[i].paytype,
									paytypeold    = list[i].paytypeold,
									totalPayPrice  = list[i].totalPayPrice,
									store      = list[i].branch ? list[i].branch : list[i].store,
									product    = list[i].product;

							var detailUrl = durl.replace("%id%", id);
							var refundlUrl = rUrl.replace("%id%", id);
							var commentUrl = cUrl.replace("%id%", id);
							var stateInfo = btn = "";

							switch(orderstate){
								case "0":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][22]+'</span></p>';  //未付款    //取消订单
									btn = '<a href="javascript:;" class="btn-cancel btn-nobg del">'+langData['siteConfig'][6][65]+'</a><a href="'+payurl+'" class=" btn-pay btn-bg">'+langData['siteConfig'][6][64]+'</a>';  //立即付款
									break;
								case "1":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][25]+'</span></p>';  //代发货
									if(paytypeold != 'delivery'){
										btn = '<a href="'+refundlUrl+'" class="btn-pay btn-bg">'+langData['siteConfig'][6][66]+'</a>';  //申请退款
									}
									break;
								case "11":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][25]+'</span></p>';  //代发货
									if(paytypeold != 'delivery'){
										btn = '<a href="'+refundlUrl+'" class="btn-pay btn-bg">'+langData['siteConfig'][6][66]+'</a>';  //申请退款
									}
									break;
								case "3":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][37]+'</span></p>';  //交易成功
									if(common == 1){
										btn = '<a href="'+commentUrl+'" class="btn-pay btn-bg">'+langData['siteConfig'][8][2]+'</a>';  //修改评价
									}else{
										btn = '<a href="'+commentUrl+'" class="btn-pay btn-bg">'+langData['siteConfig'][19][365]+'</a>';  //评价
									}
									break;
								case "4":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][27]+'</span></p>';   //退款中
									btn = '<a href="#" class="btn-pay btn-bg">'+langData['siteConfig'][45][28]+'</a>'  //退款进度
									break;
								case "6":

									//申请退款
									if(retState == 1){

										//还未发货
										if(expDate == 0){
											stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][43]+'</span></p>';  //未发货  申请退款

										//已经发货
										}else{
											stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][42]+'</span></p>';   //已发货  退款
										}

									//未申请退款
									}else{
										stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][26]+'</span></p>';   //待收货
										btn = '<a href="'+detailUrl+'" class="btn-pay btn-bg sh">'+langData['siteConfig'][6][45]+'</a>';  //确认收货
									}
									break;
								case "7":
									stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][34]+'</span></p>';  //退款成功
									break;
								case "10":
									stateInfo = '<p class="order-state"><span >'+langData['siteConfig'][6][15]+'</span></p>';  //关闭
									break;
							}


							html.push('<dl class="myitem" data-id="'+id+'">');
							html.push('<dt><p class="shop_name"><i></i><span>'+store.title+'</span></p>'+stateInfo+'</dt>')
							html.push('<dd class="order-content">');
							var totalCount = 0;
							for(var p = 0; p < product.length; p++){
								html.push('<a href="'+detailUrl+'"><div class="fn-clear">');
								html.push('<div class="imgbox-l"><img src="'+product[p].litpic+'" alt="" /></div>');
								html.push('<div class="txtbox-c"><p>'+product[p].title+'</p></div>');
								html.push('<div class="pricebox-r"><p class="price"><span>'+(echoCurrency('symbol'))+'</span>'+product[p].price+'</p><p class="mprice">x'+product[p].count+'</p></div>');
								html.push('</div></a>');
							}
							html.push('<div class="shop_price"><p class="pprice"><span>'+langData['siteConfig'][19][689].replace('1',(product.length))+langData['siteConfig'][21][20]+'   ￥</span>'+totalPayPrice+'</p></div>');//共1件商品 -- 合计
							html.push('<div class="btn-group" data-action="shop">'+btn+'</div>');
							html.push('</dd>');
							html.push('</dl>');

						}

						objId.append(html.join(""));
            $('.loading').remove();
            isload = false;

					}else{
						$('.loading').remove();
						if(totalCount==0){
							$('.no-data').show();
						}else{
							objId.append("<p class='loading'>"+msg+"</p>");
						}
					}

					$("#total").html(pageInfo.totalCount);
					$("#unpaid").html(pageInfo.unpaid);
					$("#unused").html(pageInfo.ongoing);
					$("#used").html(pageInfo.success);
					$("#refund").html(pageInfo.refunded);
					$("#rates").html(pageInfo.rates);
					$("#recei").html(pageInfo.recei);
					$("#closed").html(pageInfo.closed);
					$("#cancel").html(pageInfo.cancel);

				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
		}
	});
}
