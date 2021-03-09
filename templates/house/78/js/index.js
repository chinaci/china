$(function(){
		// 右侧看房团报名表单多选
		$('.choice_box input').click(function(){
			var x = $(this),
				find = x.closest('label ').find('span');
			if (x.is(':checked')) {
				find.addClass('sure')
			}else{
				find.removeClass('sure')
			};
		})

		// 右侧求租求购tab切换
		$('.Rent_lead ul li').hover(function(){
			var x = $(this),
				index = x.index();
			x.addClass('Rent_bc').siblings().removeClass('Rent_bc');
			$('.Rent_list .Rent_txt').eq(index).show().siblings().hide();
		})
	//获取服务器当前时间
	var nowStamp = 0;
	$.ajax({
		"url": masterDomain+"/include/ajax.php?service=system&action=getSysTime",
		"dataType": "jsonp",
		"success": function(data){
			if(data){
				nowStamp = data.now;
			}
		}
	});
		//获取时间段
	function time_tran(time) {
	    var dur = nowStamp - time;
	    if (dur < 0) {
	        return transTimes(time, 2);
	    } else {
	        if (dur < 60) {
	            return dur+'秒前';
	        } else {
	            if (dur < 3600) {
	                return parseInt(dur / 60)+'分钟前';
	            } else {
	                if (dur < 86400) {
	                    return parseInt(dur / 3600)+'小时前';
	                } else {
	                    if (dur < 259200) {//3天内
	                        return parseInt(dur / 86400)+'天前';
	                    } else {
	                        return transTimes(time, 2);
	                    }
	                }
	            }
	        }
	    }
	}


	//异步加载房产列表
	var page = 1, isload;
	var ajaxhouse = function() {
		var id = $(".NewsNav .on a:eq(0)").attr("data-id"),
			href = $(".NewsNav .on a:eq(0)").attr("href");
		var objId = "NewList" + id;
		if ($("#" + objId).html() == undefined) {
			$("#NewList").append('<div id="' + objId + '" class="slide-box"></div>');
			// if (isload && $('.pane').hasClass('fixed')) {
			// 	$(window).scrollTop(paneHeight);
			// }
		}
		isload = true;

		$("#" + objId).find(".load-more").remove();

		$("#" + objId)
			.append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
			.show()
			.siblings(".slide-box").hide();

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=house&action=" + id + "&pageSize=15&page="+page,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				if (data && data.state != 200) {
					if (data.state == 101) {
						$("#" + objId).html("<p class='loading'>" + data.info + "</p>");
					} else {
						var list = data.info.list,
							pageInfo = data.info.pageInfo,
							html = [];
						for (var i = 0; i < list.length; i++) {
							var item = [],
								id = list[i].id,
								title = list[i].title,
								typeName = list[i].typeName,
								url = list[i].url,
								common = list[i].common,
								litpic = list[i].litpic,
								keywords = list[i].keywords,
								description = list[i].description,
								buildtype = list[i].buildtype,
								houseaction = $(".NewsNav .on a").attr("data-id") ,
								name = $(".NewsNav .on a:eq(0)").attr("data-id");


							if (name == "loupanList") {

								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead new_house">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								if (list[i].salestate == 0) {
									item.push('<em class="sale">待售</em>');
								}else if(list[i].salestate == 1){
									item.push('<em class="sale">在售</em>');
								}else if(list[i].salestate == 2){
									item.push('<em class="sale">尾盘</em>');
								}else if(list[i].salestate == 3){
									item.push('<em class="sale">售完</em>');
								}
								if (list[i].ptype != 0) {
									if (list[i].price == 0) {
										item.push('</div><div class="House_price"><em>待定</em></div></div>');
									}else{
										var ptype = echoCurrency('short')+"/㎡";
										if(list[i].ptype != 1){
											ptype = "万"+echoCurrency('short')+"/套";
										}
										item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+''+list[i].price+'</em> '+ptype+'</div></div>');
									}
								}else{
									item.push('</div><div class="House_price"><em>待定</em></div></div>');
								}
								item.push('<div class="House_tips">');
								for (var b = 0; b < buildtype.length; b++) {
									item.push('<em>'+buildtype[b]+'</em>');
								}
								item.push('</div>');
								item.push('<div class="House_type">户型:'+list[i].protype+'</div>');
								item.push('<div class="House_location"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');

							} else if (name == "zjUserList"){
								item.push('<div class="broker fn-clear">');
								item.push('<div class="broker_pic"><img src="'+list[i].litpic+'" alt=""></div>');
								item.push('<div class="broker_name"><a target="_blank" href="'+list[i].url+'">'+list[i].nickname+' </a></div>');
								item.push('<div class="broker_tel">');
								if (list[i].phone != "") {
									item.push('<span><i></i>'+list[i].phone+'</span>');
								}
								item.push('</div>');
								item.push('<div class="broker_infor">');
								item.push('<ul>');
								item.push('<li>所属公司：<a href="javasc:;">'+list[i].zjcomName+' </a></li>');
								item.push('<li>公司所属地：'+list[i].store+'</li>');
								item.push('</ul>');
								item.push('</div>');
								item.push('</div>');
							}else if (name == "zuList"){
								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+''+list[i].price+'</em> '+echoCurrency('short')+'/月</div></div>');
								item.push('<div class="House_tips">');
								item.push('</div>');
								item.push('<div class="House_type2">'+list[i].room+'<em>|</em>'+list[i].rentype+'<em>|</em>'+list[i].zhuangxiu+'<em>|</em>第'+list[i].bno+'层 / 共'+list[i].floor+'层</div>');
								item.push('<div class="House_location2"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');
							}else if (name == "saleList"){
								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+' '+list[i].unitprice+'</em> 万</div></div>');
								item.push('<div class="House_tips">');
								item.push('</div>');
								item.push('<div class="House_type2">'+list[i].room+'<em>|</em>'+list[i].protype+'<em>|</em>'+list[i].zhuangxiu+'<em>|</em>第'+list[i].bno+'层 / 共'+list[i].floor+'层</div>');
								item.push('<div class="House_location2"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');

							}else if (name == "xzlList"){
								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+''+list[i].price+'</em> '+echoCurrency('short')+'/m²•月</div></div>');
								item.push('<div class="House_tips">');
								item.push('</div>');
								item.push('<div class="House_type2">'+list[i].config[0]+'<em>|</em>'+list[i].protype+'<em>|</em>'+list[i].zhuangxiu+'<em>|</em>'+list[i].loupan+'</div>');
								item.push('<div class="House_location2"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');

							}else if (name == "spList"){
								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+' '+list[i].price+'</em> 万/月</div></div>');
								item.push('<div class="House_tips">');
								item.push('</div>');
								item.push('<div class="House_type2">'+list[i].protype+'<em>|</em>'+list[i].zhuangxiu+'<em>|</em>'+list[i].area+'㎡(建筑面积)</div>');
								item.push('<div class="House_location2"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');

							}else{
								item.push('<div class="House_detail fn-clear">');
								item.push('<div class="House_pic"><a target="_blank" href="'+list[i].url+'"><img src="'+litpic+'" alt=""></a></div>');
								item.push('<div class="House_title"><div class="House_lead">');
								item.push('<a target="_blank" href="'+list[i].url+'">'+title+'</a>');
								item.push('</div><div class="House_price"><em>'+echoCurrency('symbol')+' '+list[i].price+'</em> 万/月</div></div>');
								item.push('<div class="House_tips">');
								item.push('</div>');
								item.push('<div class="House_type2">'+list[i].protype+'<em>|</em>'+list[i].area+'㎡(建筑面积)</div>');
								item.push('<div class="House_location2"><span><i></i>'+list[i].address+'</span></div>');
								// item.push('<div class="House_Tel"><i></i>13839874091</div>');
								item.push('</div>');

							}
							html.push(item.join(""));
						}

						$("#" + objId).find(".loading").remove();
						$("#" + objId).append(html.join(""));
						if (page < pageInfo.totalPage) {
							$("#" + objId).append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$("#" + objId).append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}

					}
				} else {
					$("#" + objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$("#" + objId).html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	ajaxhouse();
	// 点击加载更多
	$("#NewList").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		ajaxhouse();
	});

	// 切换信息tab
	$(".NewsNav ul li").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.find("a").attr("data-id");
			if(!t.hasClass("on")){
				t.siblings("li").removeClass("on").removeClass('NewsNav_bc');
				t.closest(".NewsNav").find('.more_list ul li').removeClass("on").removeClass('NewsNav_bc');
				$('.slide-2 .hd .more').removeClass('on');
				t.addClass("on").addClass('NewsNav_bc');
				if ($("#NewList" + id).html() == undefined) {
					page = 1;
					ajaxhouse();
				}else{
					$("#NewList" + id).show().siblings(".slide-box").hide();
				}

			}
	});

	// 切换信息 更多列表
	$(".more_list ul li a").bind("click", function(event){
		event.preventDefault();
		var t = $(this), id = t.attr("data-id"), url = t.attr("href"), txt = t.text(), parent = t.closest("span");
		$('.pane .hd li:first').addClass('cur').siblings('li').removeClass('cur').removeClass('on');
		parent.siblings("ul").find("li").removeClass("on").removeClass('NewsNav_bc');
		parent
			.addClass("on")
			.find("a:eq(0)")
				.attr("data-id", id)
				.attr("href", url);

		page = 1;
		ajaxhouse();
	});



	var djObj = $('.second'),info = djObj.find('.info');

	djObj.find('.loupan1').focus(function(){
		validation.loupan1();
	}).blur(function(){
		validation.loupan1(1);
	})

	djObj.find('.price').focus(function(){
		validation.price();
	}).blur(function(){
		validation.price(1);
	})

	djObj.find('.name').focus(function(){
		validation.name();
	}).blur(function(){
		validation.name(1);
	})

	djObj.find('.phone').focus(function(){
		validation.phone();
	}).blur(function(){
		validation.phone(1);
	})

	$(document).on('change','#addrlist select',function(){
		validation.addr();
	})

	var validation = {
		loupan1 : function(type){
			var o = djObj.find('.loupan1'),v = o.val();
			if(v == '') {
				layer.tips('请填写楼盘', '.loupan1', {
				  tips: [1, '#0FA6D8']
				});
				return false;
			} else {
				return true;
			}
		},
		price : function(type){
			var o = djObj.find('.price'),v = o.val();
			if(v == '') {
				layer.tips('请填写价格', '.price', {
				  tips: [1, '#0FA6D8']
				});
				return false;
			} else {
				return true;
			}
		},
		name : function(type){
			var o = djObj.find('.name'),v = o.val();
			if(v == '') {
				layer.tips('填写您的姓名', '.name', {
				  tips: [1, '#0FA6D8']
				});
				return false;
			} else {
				return true;
			}
		},
		phone : function(type){
			var a = this ,o = djObj.find('.phone'),v = o.val();
			if(v == '') {
				layer.tips('填写您的电话', '.phone', {
				  tips: [1, '#0FA6D8']
				});
				return false;
			} else {
					return true;
				}
		},
		check :function(){
		}
	}
	$('.Information form').submit(function(e){
		if(validation.loupan1(1) && validation.price(1) && validation.name(1) && validation.phone(1)) {
				var huxing = [];
				djObj.find("input[type='checkbox']:checked").each(function(){
            huxing.push($(this).val());
        });
				var data = [];
				data.push("type=1");
				data.push("loupan="+djObj.find('.loupan1').val());
				data.push("amount="+djObj.find('.price').val());
				data.push("huxing="+huxing.join(","));
				data.push("name="+djObj.find('.name').val());
				data.push("mobile="+djObj.find('.phone').val());

				$.ajax({
						url: "/include/ajax.php?service=house&action=booking&"+data.join("&"),
						type: "POST",
						dataType: "jsonp",
						success: function (data) {
								if(data.state == 100){
										layer.msg('提交成功，我们会尽快与您取得联系');
								}else{
										layer.msg(data.info);
								}
						},
						error: function(){
								layer.msg('网络错误，提交失败！');
							}
				});
				return false;
		} else {
			e.preventDefault();
			return false;
		}
	})

});
