$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.header').addClass('padTop20');
	}
	if(appIndex=='1'){
		$('body').append('<div class="shopgocart" style="opacity:0; position:fixed; bottom:0; left:0; right:0; margin:auto; "></div>')
	}
	//购物车数量
	var cartCount = $(".cart-main ul li").length;

	if(cartCount == 0){
		$(".empty").show();
		$(".cart-main ,.footer").remove();
		$('.command-list').css('margin-bottom','0')
	}

	//数量增加、减少
	$('.rec').click(function(){
		var t = $(this).closest('li');
		var val = Number($(this).siblings('.num').find('em').html());
		$(this).siblings('.num').find('em').html(val-1);
		checkCount(t);

		//操作相应的商品
		var id=t.attr("data-id");
		var spe=t.attr("data-specation");
		glocart.find('li').each(function(){
			var tl = $(this), tid = tl.attr('data-id'), tspe = tl.attr('data-specation');
			if(tid == id && tspe == spe){
				tl.attr("data-count", val-1);
			}
		})
		shopInit.update();
	})

	$('.append').click(function(){
		var t = $(this).closest('li');
		var val = Number($(this).siblings('.num').find('em').html());
		$(this).siblings('.num').find('em').html(val+1);
		checkCount(t,1);

		//操作相应的商品
		var id=t.attr("data-id");
		var spe=t.attr("data-specation");
		glocart.find('li').each(function(){
			var tl = $(this), tid = tl.attr('data-id'), tspe = tl.attr('data-specation');
			if(tid == id && tspe == spe){
				tl.attr("data-count", val+1);
			}
		})
		shopInit.update();
	})

	//全选
	$(".footer .shop-name-circle").on("click",function(){
		var $allSel=$(this),$allSelD=$(".footer .shop-name-circle"),$sjSel=$(".cart-main .shop-name-circle");
		$allSel.hasClass("active") ? ($allSel.removeClass("active"), $allSelD.removeClass("active"), $sjSel.removeClass("active")) : ($allSel.addClass("active"), $allSelD.addClass("active"), $sjSel.addClass("active"));
		getTotalPrice();
	});



	//店铺选择
	$(".shop-name .shop-name-circle").on("click",function(){
		var $nameSel=$(this);
		$nameSel.hasClass("active") ? ($nameSel.removeClass("active"), $nameSel.parents(".shop-name").siblings(".shop-list").find(".shop-name-circle").removeClass("active")) : ($nameSel.addClass("active"), $nameSel.parents(".shop-name").siblings(".shop-list").find(".shop-name-circle").addClass("active"));

		//全选
		var n=$(".cart-list").length;
		if($(".shop-name .active").length==n){
			$(".footer .shop-name-circle").addClass("active");
		}else{
			$(".footer .shop-name-circle").removeClass("active");
		}

		getTotalPrice();

	});

	//单个选择
	$(".shop-list-li .shop-name-circle").on("click",function(){
		var $singleSel=$(this),$t=$singleSel.closest(".shop-list").siblings(".shop-name").find(".shop-name-circle");

		$singleSel.hasClass("active") ? $singleSel.removeClass("active") : $singleSel.addClass("active");

		//店铺
		var m=$singleSel.parents('.shop-list').find(".shop-list-li").length;
		if($singleSel.parents(".shop-list").find("ul .active").length==m){
			$t.addClass("active");
		}else{
			$t.removeClass("active");
		}

		//全选
		var n=$(".cart-list").length;
		if($(".shop-name .active").length==n){
			$(".footer .shop-name-circle").addClass("active");
		}else{
			$(".footer .shop-name-circle").removeClass("active");
		}

		getTotalPrice();
	});

	//单个商品删除
	var ds = 1;
	$(".icon-del").on("click",function(){
		var $delete=$(this),allMoney;

		var confir = ds ? confirm(langData['siteConfig'][20][211]) : 1;
		if(confir){

			if($delete.closest(".shop-list").find(".shop-list-li").length == 1){
				$delete.closest(".cart-list").remove();
			}

			//删除相应的商品
			var id=$delete.parents("li").attr("data-id");
			var spe=$delete.parents("li").attr("data-specation");
			glocart.find('li').each(function(){
				var t = $(this), tid = t.attr('data-id'), tspe = t.attr('data-specation');
				if(tid == id && tspe == spe){
					t.remove();
					return false;
				}
			})
			shopInit.update();

			$delete.closest(".shop-list-li").remove();

			var num=$(".cart-list").length;
			if(num == 0){
				$(".empty").show();
				$(".cart-main").remove();
			}

			getTotalPrice();

		}
	});

	//验证数量
	function checkCount(obj, t){
		var count = obj.find(".num em"), val = Number(count.html());

		var id = obj.data("id"),
				// specation = obj.data("specation"),
				price = Number(obj.data("price")),
				// bearfreight = Number(obj.data("bearfreight")),
				// valuation = Number(obj.data("valuation")),
				// express_start = Number(obj.data("express_start")),
				// express_postage = Number(obj.data("express_postage")),
				// express_plus = Number(obj.data("express_plus")),
				// express_postageplus = Number(obj.data("express_postageplus")),
				// preferentialstandard = Number(obj.data("preferentialstandard")),
				// preferentialmoney = Number(obj.data("preferentialmoney")),
				// weight = Number(obj.data("weight")),
				// volume = Number(obj.data("volume")),
				maxCount = Number(obj.data("limit"));
				inventor = Number(obj.data("inventor"));

		//最小
		if(val < 1){
			count.html(1);
			val = 1;
			alert(langData['shop'][2][12]);


		//最大
		}else if(val > maxCount && maxCount != 0){
			count.html(maxCount);
			val = maxCount;
			alert(langData['shop'][2][13]);


		//超出库存
		}else if((val >= inventor && !t) || (val > inventor && t)){

			count.html(inventor);
			val = inventor;
			alert(langData['shop'][2][13]);

		}else{
			// $('#errmsg').remove();
		}


		//运费

		//计算价格
		obj.find(".total-num em").html((price * val).toFixed(2));

		getTotalPrice();
	}


	//计算总价
	function getTotalPrice(){
		var totalPrice = totalCount = 0;

		$(".shop-list-li").each(function(){

			var t = $(this);
			if(t.find(".shop-name-circle").hasClass("active")){
				var count = t.find(".num em"),
					val = Number(count.html()),
					id = t.data("id"),
					price = Number(t.data("price")),
					express_postage = Number(t.data("express_postage"));

				//运费

				totalCount += val;
				totalPrice += price * val;
			}
		});

		$(".account-btn em").html(totalCount);
		$(".total-num em").html(totalPrice.toFixed(2));

		if(totalCount > 0){
			$(".account-btn a").removeClass("disabled");
		}else{
			$(".account-btn a").addClass("disabled");
		}
	}

	//结算
	$("#js").bind("click", function(){
		var t = $(this);
		if(!t.hasClass("disabled")){

			//验证登录
			var userid = $.cookie(cookiePre+"login_user");
			if(userid == null || userid == ""){
				location.href = masterDomain + '/login.html';
				return false;			}

			//提交
			var data = [], pros = [], fm = $(".cart-main form"), url = fm.data("action");
			$(".shop-list-li").each(function(){
				var dd = $(this), id = dd.data("id"), specation = dd.data("specation"), count = dd.find(".num em").text();
				if(dd.find(".shop-name-circle").hasClass("active")){
					data.push('pros[]='+id+","+specation+","+count);
					pros.push('<input id="pros" type="hidden" name="pros[]" value="'+id+","+specation+","+count+'" />');
				}
			});

			t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");
			$.ajax({
				url: url,
				data: data.join("&"),
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						$("input[name='pros[]']").remove();
						fm.append(pros.join(""));
						fm.submit();
                        setTimeout(function(){
                            $('#pros').remove();
                            t.removeClass("disabled").html(langData['shop'][1][6]);
                        }, 500);

					}else{
						t.removeClass("disabled").html(langData['shop'][1][6]);
						alert(data.info);
					}
				},
				error: function(){
					alert(langData['siteConfig'][20][183])
					t.removeClass("disabled").html(langData['shop'][1][6]);
				}
			});

		}
	});

	$('img').scrollLoading();
})
