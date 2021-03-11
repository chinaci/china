$(function(){

	//购物车数量
	var cartCount = $(".sum .right em").html().replace('件商品', '');
	$(".state .left i").html(cartCount);

	if(cartCount == 0){
		$(".null").show();
		$(".have").remove();
	}else{
		$(".numm").remove();
	}


	//数量错误提示
	var errmsgtime;
	function errmsg(div,type,num){
		$('#errmsg').remove();
		clearTimeout(errmsgtime);
		var str = type=='max' ? langData['shop'][5][70].replace('1', num) : langData['shop'][5][71];
		var obj = div.find('.t5 div');
		var top = obj.offset().top - 36;
		var left = obj.offset().left - 20;

		var msgbox = '<div id="errmsg" style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:150px;height:36px;line-height:36px;text-align:center;color:#f76120;font-size:14px;display:none;">' + str + '</div>';
		$('body').append(msgbox);
		$('#errmsg').fadeIn();
		errmsgtime = setTimeout(function(){
			$('#errmsg').remove();
		},1500);
	};


	//数量增加、减少
	$(".have").delegate(".t5 a", "click", function(){
		var t = $(this).closest("ul"), type = $(this).attr("class"), inp = t.find("input"), val = Number(inp.val());

		//减少
		if(type == "minus"){
			inp.val(val-1);
			checkCount(t);

		//增加
		}else if(type == "plus"){
			inp.val(val+1);
			checkCount(t, 1);
		}
	});


	//数量输入变化
	$(".have").delegate(".t5 input", "keyup", function(){
		checkCount($(this).closest("ul"));
	});


	//验证数量
	function checkCount(obj, t){
		var count = obj.find("input"), val = Number(count.val());

		var id = obj.data("id"),
				specation = obj.data("specation"),
				price = Number(obj.data("price")),
				bearfreight = Number(obj.data("bearfreight")),
				valuation = Number(obj.data("valuation")),
				express_start = Number(obj.data("express_start")),
				express_postage = Number(obj.data("express_postage")),
				express_plus = Number(obj.data("express_plus")),
				express_postageplus = Number(obj.data("express_postageplus")),
				preferentialstandard = Number(obj.data("preferentialstandard")),
				preferentialmoney = Number(obj.data("preferentialmoney")),
				weight = Number(obj.data("weight")),
				volume = Number(obj.data("volume")),
				maxCount = Number(obj.data("limit")),
				inventor = Number(obj.data("inventor"));

		//最小
		if(val < 1){
			count.val(1);
			val = 1;
			errmsg(obj,'min', 1, count);


		//最大
		}else if(val > maxCount && maxCount != 0){
			count.val(maxCount);
			val = maxCount;
			errmsg(obj,'max', maxCount, count);


		//超出库存
		}else if((val >= inventor && !t) || (val > inventor && t)){

			count.val(inventor);
			val = inventor;
			errmsg(obj,'max', inventor, count);

		}else{
			$('#errmsg').remove();
		}

		//同步更新购物车数量
		cartlist.find("li[data-id="+id+"][data-specation="+specation+"]").attr("data-count", val);
		shopInit.update();


		//运费
		var logistic = getLogisticPrice(bearfreight, valuation, express_start, express_postage, express_plus, express_postageplus, preferentialstandard, preferentialmoney, weight, volume, price, val);
		obj.find(".t6 small").html((logistic == 0 ? langData['shop'][3][2] : langData['shop'][5][9]+"："+logistic));

		//计算价格
		obj.find(".t6 span").html((price * val).toFixed(2));

		getTotalPrice();
	}


	//计算总价
	function getTotalPrice(){
		var totalPrice = totalCount = 0;

		$(".goods ul").each(function(){
			var t = $(this);
			if(!t.hasClass("title") && t.find(".t0 i").hasClass("on")){
				var count = t.find(".t5 input"),
						val = Number(count.val()),
						id = t.data("id"),
						price = Number(t.data("price")),
						bearfreight = Number(t.data("bearfreight")),
						valuation = Number(t.data("valuation")),
						express_start = Number(t.data("express_start")),
						express_postage = Number(t.data("express_postage")),
						express_plus = Number(t.data("express_plus")),
						express_postageplus = Number(t.data("express_postageplus")),
						preferentialstandard = Number(t.data("preferentialstandard")),
						preferentialmoney = Number(t.data("preferentialmoney")),
						weight = Number(t.data("weight")),
						volume = Number(t.data("volume")),
						maxCount = Number(t.data("limit")),
						inventor = Number(t.data("inventor"));

				//运费
				var logistic = getLogisticPrice(bearfreight, valuation, express_start, express_postage, express_plus, express_postageplus, preferentialstandard, preferentialmoney, weight, volume, price, val);

				totalCount += val;
				totalPrice += price * val;
			}
		});

		$(".sum .right em").html(totalCount);
		$(".sum .right font").html((echoCurrency('symbol'))+totalPrice.toFixed(2));

		if(totalCount > 0){
			$("#js").removeClass("disabled");
		}else{
			$("#js").addClass("disabled");
		}
	}


	//单个商品删除
	var ds = 1;
	$(".goods li.t7 a").on("click",function(){
		var $delete=$(this),allMoney;

		var confir = ds ? confirm(langData['siteConfig'][20][211]) : 1;
		if(confir){

			if($delete.closest(".sj").find("ul").length == 1){
				$delete.closest(".sj").remove();
			}

			//删除相应的商品
			var id=$delete.parents("ul").attr("data-id");
			var spe=$delete.parents("ul").attr("data-specation");
			cartlist.find("li[data-id="+id+"][data-specation="+spe+"]").remove();
			shopInit.update();

			$delete.parents("ul").remove();

			var num=$(".sj").find("ul").length;
			if(num == 0){
				$(".null").show();
				$(".have").remove();
			}

			getTotalPrice();

		}
	});


	//删除
	$("#deleteAll").bind("click", function(){
		var checkCount = 0;
		$(".goods ul").each(function(){
			if($(this).find(".t0 i").hasClass("on")){
				checkCount++;
			}
		});
		if(checkCount == 0) return false;
		if(confirm(langData['siteConfig'][20][211])){
			ds = 0;
			$(".goods ul").each(function(){
				if($(this).find(".t0 i").hasClass("on")){
					$(this).find(".t7 a").click();
				}
			});
			ds = 1;
		};
	});


	//全选
	$(".goods ul.title i").on("click",function(){
		var $allSel=$(this),$allSelD=$(".sum i"),$sjSel=$(".sj i");
		$allSel.hasClass("on") ? ($allSel.removeClass("on"), $allSelD.removeClass("on"), $sjSel.removeClass("on")) : ($allSel.addClass("on"), $allSelD.addClass("on"), $sjSel.addClass("on"));
		getTotalPrice();
	});

	$(".sum i").on("click",function(){
		var $allSel=$(this),$allSelD=$(".goods ul.title i"),$sjSel=$(".sj i");
		$allSel.hasClass("on") ? ($allSel.removeClass("on"), $allSelD.removeClass("on"), $sjSel.removeClass("on")) : ($allSel.addClass("on"), $allSelD.addClass("on"), $sjSel.addClass("on"));
		getTotalPrice();
	});

	//店铺选择
	$(".name i").on("click",function(){
		var $nameSel=$(this);
		$nameSel.hasClass("on") ? ($nameSel.removeClass("on"), $nameSel.parents(".name").siblings("ul").find("i").removeClass("on")) : ($nameSel.addClass("on"), $nameSel.parents(".name").siblings("ul").find("i").addClass("on"));

		//全选
		var n=$(".sj").length;
		if($(".sj .name i[class='on']").length==n){
			$(".goods ul.title i,.sum i").addClass("on");
		}else{
			$(".goods ul.title i,.sum i").removeClass("on");
		}

		getTotalPrice();

	});

	//单个选择
	$(".sj ul i").on("click",function(){
		var $singleSel=$(this),$t=$singleSel.parents("ul").siblings(".name").find("i");

		$singleSel.hasClass("on") ? $singleSel.removeClass("on") : $singleSel.addClass("on");

		//店铺
		var m=$singleSel.parents(".sj").find("ul").length;
		if($singleSel.parents(".sj").find("ul i[class='on']").length==m){
			$t.addClass("on");
		}else{
			$t.removeClass("on");
		}

		//全选
		var n=$(".sj").length;
		if($(".sj .name i[class='on']").length==n){
			$(".goods ul.title i,.sum i").addClass("on");
		}else{
			$(".goods ul.title i,.sum i").removeClass("on");
		}

		getTotalPrice();
	});



	//结算
	$("#js").bind("click", function(){
		var t = $(this);
		if(!t.hasClass("disabled")){

			//验证登录
			var userid = $.cookie(cookiePre+"login_user");
			if(userid == null || userid == ""){
				huoniao.login();
				return false;
			}

			//提交
			var data = [], pros = [], fm = t.closest("form"), url = fm.data("action"), action = fm.attr("action");
			$(".sj ul").each(function(){
				var t = $(this), id = t.data("id"), specation = t.data("specation"), count = t.find(".t5 input").val();
				if(t.find(".t0 i").hasClass("on")){
					data.push('pros[]='+id+","+specation+","+count);
					pros.push('<input type="hidden" name="pros[]" value="'+id+","+specation+","+count+'" />');
				}
			});

			t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

			$.ajax({
				url: url,
				data: data.join("&"),
				type: "POST",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){

						fm.append(pros.join(""));
						fm.submit();

					}else{
						alert(data.info);
						t.removeClass("disabled").html(langData['shop'][1][6]);
					}
				},
				error: function(){
					alert(langData['siteConfig'][20][183]);
					t.removeClass("disabled").html(langData['shop'][1][6]);
				}
			});

		}
	});

});
