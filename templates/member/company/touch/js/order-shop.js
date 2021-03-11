/**
 * 会员中心商城订单列表
 * by guozi at: 20151130
 */

var objId = $("#list");
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



	// 下拉加载
	$(window).scroll(function() {
		var h = $('.item').height();
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - h;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});



	getList(1);

	// 删除
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			if(confirm(langData['siteConfig'][20][182])){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=shop&action=delOrder&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							objId.html('');
							getList();

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

	//收货
	objId.delegate(".sh", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
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
							setTimeout(function(){getList(1);}, 1000);

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

	state = $('.tab .curr').attr('data-id') ? $('.tab .curr').attr('data-id') : '';

	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=shop&action=orderList&store=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
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
						case "2":
							totalCount = pageInfo.expired;
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
						case "6,1":
							totalCount = pageInfo.recei1;
							break;
						case "6,2":
							totalCount = pageInfo.recei2;
							break;
						case "7":
							totalCount = pageInfo.closed;
							break;
					}


					$("#unused").html(pageInfo.ongoing);
					$("#used").html(pageInfo.success);
					$("#refund").html(pageInfo.refunded);
					$("#recei1").html(pageInfo.recei1);
					$("#recei2").html(pageInfo.recei2);
					$("#closed").html(pageInfo.closed);

					var msg = totalCount == 0 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][185];


					// $("#total").html(pageInfo.totalCount);
					// $("#unpaid").html(pageInfo.unpaid);
					// $("#unused").html(pageInfo.ongoing);
					// $("#used").html(pageInfo.success);
					// $("#refund").html(pageInfo.refunded);
					// $("#rates").html(pageInfo.rates);
					// $("#recei").html(pageInfo.recei);
					// $("#closed").html(pageInfo.closed);
					// $("#cancel").html(pageInfo.cancel);

					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item       = [],
									id         = list[i].id,
									member     = list[i].member,
									ordernum   = list[i].ordernum,
									orderstate = list[i].orderstate,
									retState   = list[i].retState,
									orderdate  = huoniao.transTimes(list[i].orderdate, 1),
									expDate    = list[i].expDate,
									payurl     = list[i].payurl,
									common     = list[i].common,
									commonUrl  = list[i].commonUrl,
									paytype    = list[i].paytype,
									totalPayPrice  = list[i].totalPayPrice,
									peisongid  = list[i].peisongid,
									songdate   = list[i].songdate,
									member     = list[i].member,
									shipping   = list[i].shipping,
									product    = list[i].product;

							var detailUrl = shopEditUrl.replace("%id%", id);
							var fhUrl = detailUrl.indexOf("?") > -1 ? detailUrl + "&rates=1" : detailUrl + "?rates=1";
							var stateInfo = btn = "";

							switch(orderstate){
								case "1":
                                    if(shipping==1){
                                        stateInfo = "<span class='state'>"+langData['siteConfig'][9][25]+"</span>";
                                        // btn = '<div><a href="'+fhUrl+'">'+langData['siteConfig'][6][154]+'</a></div>';
                                    }else{
                                        stateInfo = "<span class='state'>"+langData['siteConfig'][9][11]+"</span>";//待确认
                                        // btn = '<div><a href="javascript:;" class="print">打印订单</a></div>';
                                    }
									// stateInfo = '<span class="state">'+langData['siteConfig'][9][25]+'</span>';
									//btn = '<a href="'+fhUrl+'" class="sureBtn">'+langData['siteConfig'][6][154]+'</a>';
									break;
								case "11":
									stateInfo = '<span class="state">'+langData['siteConfig'][9][25]+'</span>';
									btn = '<a href="'+fhUrl+'" class="sureBtn">'+langData['siteConfig'][6][154]+'</a>';
									break;
								case "3":
									stateInfo = '<span class="state">'+langData['siteConfig'][9][37]+'</span>';
									break;
								case "4":
									stateInfo = '<span class="state">'+langData['siteConfig'][9][27]+'</span>';
									break;
								case "6":

									//申请退款
									if(retState == 1){

										//还未发货
										if(expDate == 0){
											stateInfo = "<span class='state'>"+langData['siteConfig'][9][43]+"</span>";

										//已经发货
										}else{
											stateInfo = "<span class='state'>"+langData['siteConfig'][9][42]+"</span>";
										}
										btn = '<a href="'+detailUrl+'" class="sureBtn">'+langData['siteConfig'][6][153]+'</a>';

									//未申请退款
									}else{
                                        if(shipping == 1 || shipping == 2){
                                            var shippingName = shipping == 1 ? langData['siteConfig'][9][71] : langData['siteConfig'][9][70];//快递 -- 商家自送
											stateInfo = "<span class='state'>"+langData['siteConfig'][9][26]+"("+shippingName+")</span>";  //待收货
										}else{
											if(peisongid == 0){
												stateInfo = "<span class='state'>"+langData['siteConfig'][44][13]+"</span>";//待分配骑手
											}else{
												if(songdate == 0){
													stateInfo = "<span class='state'>"+langData['siteConfig'][44][14]+"</span>";//待取货
												}else{
													stateInfo = "<span class='state'>"+langData['siteConfig'][16][115]+"</span>";//配送中
												}
											}
										}

                                        // var shippingName = shipping == 1 ? '快递' : '商家自送';
                                        // stateInfo = "<span class='state'>"+langData['siteConfig'][9][26]+"("+shippingName+")</span>";  //待收货
										// stateInfo = "<span class='state'>"+langData['siteConfig'][9][26]+"</span>";
										//btn = '<a href="javascript:;" class="sh">确认收货</a>';
									}
									break;
								case "7":
									stateInfo = "<span class='state'>"+langData['siteConfig'][9][34]+"</span>";
									// btn = '<a href="javascript:;" class="edit">退款去向</a>';
									break;
							}

                          for(var p = 0; p < product.length; p++){
                                cla = p == product.length - 1 ? ' class="lt"' : "";

								html.push('<div class="item" data-id="'+id+'">');
							    html.push('<p class="order-number fn-clear"><span class="fn-left">'+langData['siteConfig'][19][308]+'：'+ordernum+'</span><span class="time">'+orderdate+'</span></p>');
								html.push('<p class="store fn-clear">');
								html.push('<span class="title fn-clear"><em class="sname">'+(list[i].branch ? langData['siteConfig'][45][82]+'：' + list[i].branch.title : '')+'</em></span>'+stateInfo+'</p>');//分店
								html.push('<div class="shop-list">');
								var totalCount = 0;
								for(var p = 0; p < product.length; p++){
									totalCount = totalCount + Number(product[p].count);
									html.push('<div class="shop-item">');
									html.push('<a href="'+detailUrl+'" class="fn-clear">');
									html.push('<div class="imgbox"><img src="'+product[p].litpic+'" alt=""></div>');
									html.push('<div class="txtbox">');
									html.push('<p class="gname">'+product[p].title+'</p>');
									html.push('</div>');
									html.push('<div class="pricebox">');
									html.push('<p class="price">'+(echoCurrency('symbol'))+product[p].price+'</p>');
									html.push('<p class="mprice">×'+product[p].count+'</p>');
									html.push('</div>');
									html.push('</a>');
									html.push('</div>');
								}
								html.push('</div>');
							html.push('<p class="sum">'+langData['siteConfig'][19][689].replace('1', totalCount)+'   '+langData['siteConfig'][19][316]+'：<font class="blue">'+totalPayPrice+'</font></p>');
							html.push('<p class="btns fn-clear" data-action="shop"><a href="'+detailUrl+'" class="blueBtn">'+langData['siteConfig'][19][313]+'</a>'+btn+'</p>');
								html.push('</div>');

							}


						}

						objId.append(html.join(""));
                        $('.loading').remove();
                        isload = false;

					}else{
						$('.loading').remove();
						objId.append("<p class='loading'>"+msg+"</p>");
					}

				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
		}
	});
}
