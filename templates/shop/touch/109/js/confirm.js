$.fn.nextAll = function (selector) {
  var nextEls = [];
  var el = this[0];
  if (!el) return $([]);
  while (el.nextElementSibling) {
    var next = el.nextElementSibling;
    if (selector) {
      if($(next).is(selector)) nextEls.push(next);
    }
    else nextEls.push(next);
    el = next;
  }
  return $(nextEls);
};

$(function(){

    //APP端取消下拉刷新
    toggleDragRefresh('off');

	var gzAddress         = $(".gz-address"),  //选择地址页
			gzAddrHeaderBtn   = $(".gz-addr-header-btn"),  //删除按钮
			gzAddrListObj     = $(".addresslist"),  //地址列表
			gzAddNewObj       = $(".add_list"),   //新增地址页
			gzSelAddr         = $("#gzSelAddr"),     //选择地区页
			gzSelMask         = $(".gz-sel-addr-mask"),  //选择地区遮罩层
			gzAddrSeladdr     = $(".gz-addr-seladdr.chose_area"),  //选择所在地区按钮
			gzSelAddrCloseBtn = $("#gzSelAddrCloseBtn"),  //关闭选择所在地区按钮
			gzSelAddrList     = $(".gz-sel-addr-list"),  //区域列表
			gzSelAddrNav      = $(".gz-sel-addr-nav"),  //区域TAB
			gzSelAddrActive   = "gz-sel-addr-active",  //选择所在地区后页面下沉样式名
			gzSelAddrHide     = "gz-sel-addr-hide",  //选择所在地区浮动层隐藏样式名
			showErrTimer      = null,
			gzAddrEditId      = 0,   //修改地址ID
			delete_btn        = $(".addresslist"),
			gzAddrInit = {

					//错误提示
					showErr: function(txt){
							showErrTimer && clearTimeout(showErrTimer);
					$(".gzAddrErr").remove();
					$("body").append('<div class="gzAddrErr"><p>'+txt+'</p></div>');
					$(".gzAddrErr p").css({"margin-left": -$(".gzAddrErr p").width()/2, "left": "50%"});
					$(".gzAddrErr").css({"visibility": "visible"});
					showErrTimer = setTimeout(function(){
						$(".gzAddrErr").fadeOut(300, function(){
							$(this).remove();
						});
					}, 1500);
					}



					//删除地址
					,delAddr: function(id, obj){
							$.ajax({
									url: masterDomain + "/include/ajax.php?service=member&action=addressDel",
									data: "id="+id,
									type: "GET",
									dataType: "jsonp",
									success: function (data) {
											if(data && data.state == 100){
													obj.hide(300, function(){
															obj.remove();
															if(gzAddrListObj.find(".item").length == 0){
																	gzAddrListObj.html('<div class="empty">'+langData['siteConfig'][20][226]+'</empty>');
															}
															// $('.add_bac').hide();
															//   $('.add_list').hide();
															// $('#p2').show();
													});
											}else{
													alert(data.info);
											}
									},
									error: function(){
											alert(langData['siteConfig'][20][183]);
									}
							});
					}

					//获取区域
					,getAddrArea: function(id){

							//如果是一级区域
							if(!id){
									gzSelAddrNav.html('<li class="gz-curr"><span>'+langData['siteConfig'][7][2]+'</span></li>');
									gzSelAddrList.html('');
							}

							var areaobj = "gzAddrArea"+id;
							if($("#"+areaobj).length == 0){
									gzSelAddrList.append('<ul id="'+areaobj+'"><li class="loading">'+langData['siteConfig'][20][184]+'...</li></ul>');
							}

							gzSelAddrList.find("ul").hide();
							$("#"+areaobj).show();

							$.ajax({
									url: masterDomain + "/include/ajax.php?service=siteConfig&action=area",
									data: "type="+id,
									type: "GET",
									dataType: "jsonp",
									success: function (data) {
											if(data && data.state == 100){
													var list = data.info, areaList = [];
													for (var i = 0, area, lower; i < list.length; i++) {
															area = list[i];
															lower = area.lower == undefined ? 0 : area.lower;
															areaList.push('<li data-id="'+area.id+'" data-lower="'+lower+'"'+(!lower ? 'class="n"' : '')+'>'+area.typename+'</li>');
													}
													$("#"+areaobj).html(areaList.join(""));
											}else{
													$("#"+areaobj).html('<li class="loading">'+data.info+'</li>');
											}
									},
									error: function(){
											$("#"+areaobj).html('<li class="loading">'+langData['siteConfig'][20][183]+'</li>');
									}
							});


					}

					//初始区域
					,gzAddrReset: function(i, ids, addrArr){

							var gid = i == 0 ? 0 : ids[i-1];
							var id = ids[i];
							var addrname = addrArr[i];

							//全国区域
							if(i == 0){
									gzSelAddrNav.html('');
									gzSelAddrList.html('');
							}

							var cla = i == addrArr.length - 1 ? ' class="gz-curr"' : '';
							gzSelAddrNav.append('<li data-id="'+id+'"'+cla+'><span>'+addrname+'</span></li>');

							var areaobj = "gzAddrArea"+id;
							if($("#"+areaobj).length == 0){
									gzSelAddrList.append('<ul class="fn-hide" id="'+areaobj+'"><li class="loading">'+langData['siteConfig'][20][184]+'...</li></ul>');
							}

							$.ajax({
									url: masterDomain + "/include/ajax.php?service=siteConfig&action=area",
									data: "type="+gid,
									type: "GET",
									dataType: "jsonp",
									success: function (data) {
											if(data && data.state == 100){
													var list = data.info, areaList = [];
													for (var i = 0, area, cla, lower; i < list.length; i++) {
															area = list[i];
															lower = area.lower == undefined ? 0 : area.lower;
															cla = "";
															if(!lower){
																	cla += " n";
															}
															if(id == area.id){
																	cla += " gz-curr";
															}
															areaList.push('<li data-id="'+area.id+'" data-lower="'+lower+'"'+(cla != "" ? 'class="'+cla+'"' : '')+'>'+area.typename+'</li>');
													}
													$("#"+areaobj).html(areaList.join(""));
											}else{
													$("#"+areaobj).html('<li class="loading">'+data.info+'</li>');
											}
									},
									error: function(){
											$("#"+areaobj).html('<li class="loading">'+langData['siteConfig'][20][183]+'</li>');
									}
							});

					}

					//隐藏选择地区浮动层&遮罩层
					,hideNewAddrMask: function(){
							gzAddNewObj.removeClass(gzSelAddrActive);
							gzSelMask.fadeOut();
							gzSelAddr.addClass(gzSelAddrHide);
					}

			}



	//选择地址
	gzAddrListObj.delegate("article .gz-linfo", "click", function(){
			var t = $(this), par = t.parent(), id = par.attr("data-id"), people = par.attr("data-people"), contact = par.attr("data-contact"), addrid = par.attr("data-addrid"), addrids = par.attr("data-addrids"), addrname = par.attr("data-addrname"), address = par.attr("data-address"),lnglat = par.attr("data-lnglat"),posi = par.attr("data-posi");
			// par.addClass(gzAddrActive).siblings("article").removeClass(gzAddrActive);

			var data = {
					"id": id,
					"people": people,
					"contact": contact,
					"addrid": addrid,
					"addrids": addrids,
					"addrname": addrname,
					"address": address,
					"lnglat":lnglat,
					"posi":posi
			}
			//业务层需要配合
			// chooseAddressOk(data);

			// gzAddrList.find(gzBackClass).click();
	});
	//编辑
	 gzAddrListObj.delegate(".edit_btn", "click", function(){
			 var t = $(this), par = t.closest(".item").find('a'), id = par.attr("data-id"), people = par.attr("data-name"), contact = par.attr("data-tel"), addrid = par.attr("data-addrid"), addrids = par.attr("data-ids"), addrname = par.attr("data-addr"), address = par.attr("data-address"),lnglat = par.attr("data-lnglat"),posi = par.attr("data-posi"), areaCode = par.attr("data-code");
			 if(id){

                 var addArr = address.split(' ');
                 var posi = addArr[0];
                 var address = address.replace(posi, '');

					 gzAddrEditId = id;
					 $("#person").val(people);
					 $("#mobile").val(contact);
					 $(".gz-addr-seladdr.chose_area dd").text(addrname);
					 $("#addr").val(address);
					 $(".gz-addr-seladdr.chose_area").attr("data-id", addrid);
					 $(".gz-addr-seladdr.chose_area").attr("data-ids", addrids);
					 if(areaCode != '' && areaCode != '86'){
					 	$('.addaddress .edit .areacode_span label').text('+'+areaCode);
					 	$('#areaCode').val(areaCode);
					 }else{
					 	$('.addaddress .edit .areacode_span label').text('+86');
					 	$('#areaCode').val('86');
					 }


					 $('#p2').hide();
					 $('#p3').removeClass('hide').show();
					 $('.add_bac').show();
					 $('#posi').val(posi);
					  $('#lnglat').val(lnglat);
					 $('.gz-addr-seladdr.map_detail').attr('data-lng',lnglat.split(',')[0]);
					 $('.gz-addr-seladdr.map_detail').attr('data-lat',lnglat.split(',')[1])
					 // t.closest(".item").addClass('null');
                 document.title = '选择收货地址';
			 }
	 });

	 //删除按钮
		gzAddrHeaderBtn.bind("click", function(){
				var t = $(this);
				if(t.hasClass("isWrite")){
						delete_btn.find(".edit").removeClass("del").addClass('edit_btn');
						t.removeClass("isWrite").html("删除");
				}else{
						delete_btn.find(".edit").addClass("del").removeClass('edit_btn');
						t.addClass("isWrite").html("取消");
				}
		});

	 //删除
	 gzAddrListObj.delegate(".del", "click", function(){
			 var t = $(this), par = t.closest(".item").find('a'),box = t.closest(".item"), id = par.attr("data-id");
			 if(id && confirm(langData['siteConfig'][20][211])){
					 gzAddrInit.delAddr(id, box);

			 }
	 });


	//选择所在地区
	gzAddrSeladdr.bind("click", function(){
			gzAddNewObj.addClass(gzSelAddrActive);
			gzSelMask.fadeIn();
			gzSelAddr.removeClass(gzSelAddrHide);

			var t = $(this), ids = t.attr("data-ids"), id = t.attr("data-id"), addrname = t.find("dd").text();

			//第一次点击
			if(ids == undefined && id == undefined){
					gzAddrInit.getAddrArea(0);
			//已有默认数据
			}else{

					//初始化区域
					ids = ids.split(" ");
					addrArr = addrname.split(" ");
					for (var i = 0; i < ids.length; i++) {
							gzAddrInit.gzAddrReset(i, ids, addrArr);
					}
					$("#gzAddrArea"+id).show();

			}

	});

	//关闭选择所在地区浮动层
	gzSelAddrCloseBtn.bind("click", function(){
			gzAddrInit.hideNewAddrMask();
	})

	//点击遮罩背景层关闭层
	gzSelMask.bind("click", function(){
			gzAddrInit.hideNewAddrMask();
	});

	//选择区域
	gzSelAddrList.delegate("li", "click", function(){
			var t = $(this), id = t.attr("data-id"), addr = t.text(), lower = t.attr("data-lower"), par = t.closest("ul"), index = par.index();
			if(id && addr){

					t.addClass("gz-curr").siblings("li").removeClass("gz-curr");
					gzSelAddrNav.find("li:eq("+index+")").attr("data-id", id).html("<span>"+addr+"</span>");

					//如果有下级
					if(lower != "0"){

							//把子级清掉
							gzSelAddrNav.find("li:eq("+index+")").nextAll("li").remove();
							gzSelAddrList.find("ul:eq("+index+")").nextAll("ul").remove();

							//新增一组
							gzSelAddrNav.find("li:eq("+index+")").removeClass("gz-curr");
							gzSelAddrNav.append('<li class="gz-curr"><span>'+langData['siteConfig'][7][2]+'</span></li>');

							//获取新的子级区域
							gzAddrInit.getAddrArea(id);

					//没有下级
					}else{

							var addrname = [], ids = [];
							gzSelAddrNav.find("li").each(function(){
									addrname.push($(this).text());
									ids.push($(this).attr("data-id"));
							});

							gzAddrSeladdr.removeClass("gz-no-sel").attr("data-ids", ids.join(" ")).attr("data-id", id).find("dd").html(addrname.join(" "));
							gzAddrInit.hideNewAddrMask();

					}

			}
	});

	//区域切换
	gzSelAddrNav.delegate("li", "click", function(){
			var t = $(this), index = t.index();
			t.addClass("gz-curr").siblings("li").removeClass("gz-curr");
			gzSelAddrList.find("ul").hide();
			gzSelAddrList.find("ul:eq("+index+")").show();
	});
	//新地址表单验证
	var inputVerify = {
		person: function(){
			var t = $("#person"), val = t.val(), par = t.closest("li");
			if(val.length < 2 || val.length > 15){
				alert(langData['shop'][2][15])
				return false;
			}
			return true;
		}
		,mobile: function(){
			var t = $("#mobile"), val = t.val(), par = t.closest("li");
			//var exp = new RegExp("^(12|13|14|15|16|17|18|19)[0-9]{9}$", "img");
			if(val == ""){
				alert(langData['shop'][2][16]);
				return false;
			}else{
				// if(!/^(12|13|14|15|16|17|18|19)[0-9]{9}$/.test(val) && val != ""){
				// 	alert(langData['shop'][2][17])
				// 	return false;
				// }
			}
			return true;
		}
		,addrid: function(){
			if($("#addrlist .gz-addr-seladdr.chose_area").attr("data-id") == undefined){
				$("#addrlist").parents("li").addClass("error");
				alert(langData['shop'][2][18])
				return false;
			}
			return true;
		}
		,address: function(){
			var t = $("#addr"), val = t.val(), par = t.closest("li");
			// if(val.length < 5 || val.length > 60 || /^\d+$/.test(val)){
			// 	alert(langData['shop'][2][19]);
			// 	return false;
			// }
			return true;
		}
	}
	//国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li><span>'+list[i].name+'</span><em class="fn-right">+'+list[i].code+'</em></li>');
                   }
                   $('.layer_list ul').append(phoneList.join(''));
                }else{
                   $('.layer_list ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.layer_list ul').html('<div class="loading">加载失败！</div>');
                    }

        })
    }
    // 打开手机号地区弹出层
    $(".areacode_span").click(function(){
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        console.log(txt)
        $(".areacode_span label").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code, #popupReg-captcha-mobile').hide();
        $('.mask-code').removeClass('show');
    })

	//提交新增/修改
	$("#submit").on("click", function(){

		var t = $(this);

		if(t.hasClass("disabled")) return false;

		//验证表单
		if(inputVerify.person() && inputVerify.mobile() && inputVerify.addrid() && inputVerify.address() ){

			var data = [];
			data.push('id='+ gzAddrEditId);
			data.push('addrid='+$("#addrlist .gz-addr-seladdr.chose_area").attr("data-id"));
			data.push('address='+encodeURIComponent($("#posi").val() + " " + $("#addr").val()));
			data.push('person='+encodeURIComponent($("#person").val()));
			data.push('mobile='+$("#mobile").val());
			data.push('areaCode='+$("#areaCode").val());
			data.push('lnglat='+$('#lnglat').val())
			t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

      		$.ajax({
				url: masterDomain+"/include/ajax.php?service=member&action=addressAdd",
				data: data.join("&"),
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){

						//返回到地址列表
            			$("#p3 .goback1").click();

						//异步加载所有地址
						$.ajax({
							url: masterDomain+"/include/ajax.php?service=member&action=address",
							type: "POST",
							dataType: "jsonp",
							success: function (data) {
								if(data && data.state == 100){

                  					$(".null").remove();
									var list = [], addList = data.info.list;

									for(var i = 0; i < addList.length; i++){
                    					contact = addList[i].mobile != "" && addList[i].tel != "" ? addList[i].mobile : (addList[i].mobile == "" && addList[i].tel != "" ? addList[i].tel : addList[i].mobile);
                    					list.push('<div class="item">');

										list.push('<a src="javascript:;" data-lnglat="'+(addList[i].lng + ',' + addList[i].lat)+'" data-posi="'+(addList[i].posi?addList[i].posi:"")+'" data-id="'+addList[i].id+'" data-ids="'+addList[i].addrids+'" data-addrid="'+addList[i].addrid+'" data-name="'+addList[i].person+'"  data-tel="'+addList[i].mobile+'" data-addr="'+addList[i].addrname+'" data-address="'+addList[i].address+'" data-code="'+addList[i].areaCode+'">');
										var areaCode = addList[i].areaCode;
					                    var code = '';
					                    if(areaCode != '' && areaCode != '86'){
					                      code = "+"+areaCode;
					                    }
					                    list.push('<p><span>'+addList[i].person+'</span><span class="tel_num">'+code+' '+contact+'</span></p>');
					                    list.push('<p>'+addList[i].addrname+'&nbsp;&nbsp;'+addList[i].address+'</p>');
					                    list.push('</a>');
										list.push('<div class="edit edit_btn"></div>');
										list.push('<div class="edit del"></div>');
										list.push('</div>');
									}
									$(".addresslist").html(list.join(""));
									gzAddrEditId = 0;
								}else{
									alert(langData['shop'][2][20]);
								}
							},
							error: function(){
								alert(langData['shop'][2][20]);
							}
						});

            t.removeClass("disabled").html(langData['siteConfig'][6][27]);
            $(".addaddress input").val("");
            $("#addrid option:eq(0)").attr("selected", "selected");
            $("#addrid").siblings("select").remove();

					}else{
						alert(data.info);
						t.removeClass("disabled").html(langData['siteConfig'][6][27]);
					}
				},
				error: function(){
					alert(langData['siteConfig'][20][183]);
					t.removeClass("disabled").html(langData['siteConfig'][6][27]);
				}
			});

		}

	});


	//计算最多可用多少个积分
	if(totalPoint > 0 && totalCoupon > 0){

		var pointMoney = totalPoint / pointRatio, cusePoint = totalPoint;

		//填充可使用的最大值
		$("#cusePoint").html(cusePoint.toFixed(2));
		// $("#usePcount").val(cusePoint.toFixed(2));
		$("#disMoney").html(cusePoint / pointRatio);
	}



	var anotherPay = {

		//使用积分
		usePoint: function(){
			// $("#usePcount").val(cusePoint.toFixed(2));  //重置为最大值

			//判断是否使用余额
			if($("#useBalance").attr("checked")){
				this.useBalance();
			}
		}

		//使用余额
		,useBalance: function(){

			var balanceTotal = totalBalance;

			//判断是否使用积分
			if($("#usePinput").attr("checked")){

				// var pointSelectMoney = Number($("#usePcount").val()) / pointRatio;
				// //如果余额不够支付所有费用，则把所有余额都用上
				// if(totalAmount - pointSelectMoney < totalBalance){
				// 	balanceTotal = totalAmount - pointSelectMoney;
				// }

			//没有使用积分
			}else{

				//如果余额大于订单总额，则将可使用额度重置为订单总额
				if(totalBalance > totalAmount){
					balanceTotal = totalAmount;
				}

			}

			balanceTotal = balanceTotal < 0 ? 0 : balanceTotal;
			balanceTotal = balanceTotal.toFixed(2);
			cuseBalance = balanceTotal;
			$("#useBcount").val(balanceTotal);
			// $("#balMoney, #cuseBalance").html(balanceTotal);  //计算抵扣值
		}

		//重新计算还需支付的值
		,resetTotalMoney: function(){

			var totalPayMoney = totalAmount, usePcountInput = Number($("#usePcount").val()), useBcountInput = Number($("#useBcount").val());

			if($("#usePinput").attr("checked") && usePcountInput > 0){
				totalPayMoney -= usePcountInput / pointRatio;
			}
			if($("#useBalance").attr("checked") && useBcountInput > 0){
				totalPayMoney -= useBcountInput;
			}

			$("#totalPayMoney").html(totalPayMoney.toFixed(2));

			if(totalPayMoney <= 0){
				$(".btmCartWrap .submit").val(langData['shop'][1][7]);
			}else{
				$(".btmCartWrap .submit").val(langData['shop'][1][8]);
			}
		}

	}


	//使用积分抵扣/余额支付
	$("#usePinput, #useBalance").bind("click", function(){
		var t = $(this), ischeck = t.attr("checked"), type = t.attr("name");

		//积分
		if(type == "usePinput"){

			//确定使用
			if(ischeck){
				anotherPay.usePoint();

			//如果不使用积分，重新计算余额
			}else{

				$("#usePcount").val("0");

				//判断是否使用余额
				if($("#useBalance").attr("checked")){
					anotherPay.useBalance();
				}
			}

		//余额
		}else if(type == "useBalance"){

			//确定使用
			if(ischeck){
				anotherPay.useBalance();
				$("#userYue").show();
				$("#paypwd").focus();
			}else{
				$("#useBcount").val("0");
				$("#userYue").hide();
			}
		}

		anotherPay.resetTotalMoney();
	});


	//提交支付
	$(".submit").bind("click", function(event){
		var t = $(this);

		if(t.hasClass("disabled")) return false;

		if($("#pros").val() == ""){
			alert(langData['shop'][2][21]);
			return false;
		}
		if($("#address").val() == 0 || $("#address").val() == ""){
			alert(langData['shop'][2][22]);
			return false;
		}

		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");
		$.ajax({
			url: $("#payform").attr("action"),
			data: $("#payform").serialize(),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){

					//从购物车中删除提交后的商品
					// var cartData = $.cookie(cookiePre+"shop_cart"), prosval = $("#pros").val();
					// if(cartData && prosval){
					// 	var cartDataArr = cartData.split("|"), newCartData = cartDataArr, proArr = prosval.split("|");
					// 	for(var p = 0; p < proArr.length; p++){
					// 		val = proArr[p].split(",");
					// 		for(var i = 0; i < cartDataArr.length; i++){
					// 			var cData = cartDataArr[i].split(",");
					// 			if(val[0] == cData[0] && val[1] == cData[1]){
					// 				newCartData.splice(i,1);
					// 			}
					// 		}
					// 	}

					// 	$.cookie(cookiePre+"shop_cart", newCartData.join("|"), {expires: 7, domain: cookieDomain, path: '/'});
					// }

                    if(device.indexOf('huoniao') > -1) {
                        setupWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('pageClose', {}, function (responseData) {
                            });
                        });
                    }

					var prosval = $("#pros").val();
					if(prosval){
						shopInit.database('get', '', function(cartData){
							var cartDataArr = cartData.split("|"), newCartData = cartDataArr, proArr = prosval.split("|");
							for(var p = 0; p < proArr.length; p++){
								val = proArr[p].split(",");
								for(var i = 0; i < cartDataArr.length; i++){
									var cData = cartDataArr[i].split(",");
									if(val[0] == cData[0] && val[1] == cData[1]){
										newCartData.splice(i,1);
									}
								}
							}
							shopInit.database('update', newCartData.join('|'));
						})
						location.href = data.info;
					}else{
						location.href = data.info;
					}

					setTimeout(function(){
                        t.removeClass("disabled").html(langData['shop'][1][8]);
                    }, 500);
				}else{
					alert(data.info);
					t.removeClass("disabled").html(langData['shop'][1][8]);
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['shop'][1][8]);
			}
		});

	});
	// 关闭提示
	$('.add-tip i').click(function(){
		$(this).parent().remove();
	})


	//选择收货地址
	$(".address .t").bind("click", function(){
		$("#p1, .btmCartWrap").hide();
		$("#p2").css('display','block');
		document.title = '选择收货地址';
	});

	//选择收货地址后退
	$("#p2 .goback1, #p2 .goPrev").bind("click", function(){
		$("#p2").hide();
		$("#p1, .btmCartWrap").show();
        document.title = '确认订单';
	});

	//确定收货地址
	$(".addresslist").delegate("a", "click", function(){
		var t = $(this), id = t.attr("data-id"), name = t.attr("data-name"), tel = t.attr("data-tel"), addr = t.attr("data-addr"), codeNew = t.attr("data-code");
		$("#address").val(id);
		var code = '';
	    if(codeNew != '' && codeNew != '86'){
	      code = "+"+codeNew;
	      $('#areaCode').val(codeNew);
	    }else{
	    	$('#areaCode').val('86');
	    }
		$(".address-info").html('<span class="name">'+name+'</span><span class="tel">'+code+' '+tel+'</span><span class="address-txt">'+addr+'</span>').removeClass('empty');
		$("#p2 .goback1").click();
        document.title = '确认订单';
	});

	//添加收货地址
	$(".addAddress").bind("click", function(){
		$('#person').val('');
		$('#mobile').val('');
		$('.gz-addr-seladdr.chose_area dd').text(langData['shop'][3][18]);
		$('.gz-addr-seladdr.chose_area').attr('data-id','0');
		$('.gz-addr-seladdr.chose_area').attr('data-ids','0');
		$('#addr').val('');
		$("#p2").hide();
		$("#p3").show();
		$('.add_bac').show();
		gzAddrEditId = 0;
        document.title = '新增地址';
        var areaCodeOld = $('.layer_list li:first-child em').text().replace('+','');
        $("#areaCode").val(areaCodeOld);
        $('.addaddress .areacode_span label').text('+'+areaCodeOld);
	});

	//新增收货地址后退
	$("#p3 .goback1, #p3 .goPrev").bind("click", function(){
		$("#p3").hide();
		$("#p3").addClass('hide');
		$("#p2").css('display','block');
		$('.gz-sel-addr-mask').hide();
		$('.add_bac').hide();
		$('.addresslist .item').closest(".item").removeClass('null');
		 gzAddrEditId = 0 ;
        document.title = '选择收货地址';
	});

})
