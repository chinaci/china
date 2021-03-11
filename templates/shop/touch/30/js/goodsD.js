$(function() {

	var SKUResult = {};  //保存组合结果
	var mpriceArr = [];  //市场价格集合
	var priceArr = [];   //现价集合
	var totalStock = 0;  //总库存
	var skuObj = $("#skuObj"), priceObj = $("#price"), stockObj = $("#stock"), disabled = "disabled", selected = "active";

	var init = {

		//拼接HTML代码
		start: function(){
			var proDataArr = [], data = sku_conf.property;
			for(var i = 0; i < data.length; i++){
				proDataArr.push('<div class="color-info-ul sys_item_specpara"><h3>'+data[i].name+'：</h3><ul>');
				var options = data[i].options;
				for(var ii = 0; ii < options.length; ii++){
					proDataArr.push('<li class="sku" attr_id="'+options[ii].id+'">'+options[ii].name+'</li>');
				}
				proDataArr.push('</ul></div>');
			}
			skuObj.html(proDataArr.join(""));

			init.initSKU();
		}

		//获得对象的key
		,getObjKeys: function(obj) {
			if (obj !== Object(obj)) throw new TypeError('Invalid object');
			var keys = [];
			for (var key in obj){
				if (Object.prototype.hasOwnProperty.call(obj, key)){
					keys[keys.length] = key;
				}
			}
			return keys;
		}


		//默认值
		,defaultValue: function(){

			//市场价范围
			var maxPrice = Math.max.apply(Math, mpriceArr);
			var minPrice = Math.min.apply(Math, mpriceArr);

			//现价范围
			var maxPrice = Math.max.apply(Math, priceArr);
			var minPrice = Math.min.apply(Math, priceArr);
			priceObj.text(maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice);

			//总库存
			stockObj.html(totalStock);

			//设置属性状态
			$('.sku').each(function() {
				SKUResult[$(this).attr('attr_id')] ? $(this).removeClass(disabled) : $(this).addClass(disabled).removeClass(selected);
			})

		}

		//初始化得到结果集
		,initSKU: function() {
			var i, j, skuKeys = init.getObjKeys(sku_conf.data);
			for(i = 0; i < skuKeys.length; i++) {
				var skuKey = skuKeys[i];  //一条SKU信息key
				var sku = sku_conf.data[skuKey];	//一条SKU信息value
				var skuKeyAttrs = skuKey.split(";");  //SKU信息key属性值数组
				var len = skuKeyAttrs.length;

				//对每个SKU信息key属性值进行拆分组合
				var combArr = init.arrayCombine(skuKeyAttrs);
				for(j = 0; j < combArr.length; j++) {
					init.add2SKUResult(combArr[j], sku);
				}

				mpriceArr.push(sku.mprice);
				priceArr.push(sku.price);
				totalStock += sku.stock;

				//结果集接放入SKUResult
				SKUResult[skuKey] = {
					stock: sku.stock,
					prices: [sku.price],
				};
			}

			init.defaultValue();
		}

		//把组合的key放入结果集SKUResult
		,add2SKUResult: function(combArrItem, sku) {
			var key = combArrItem.join(";");

			//SKU信息key属性
			if(SKUResult[key]) {
				SKUResult[key].stock += sku.stock;
				SKUResult[key].prices.push(sku.price);
			} else {
				SKUResult[key] = {
					stock: sku.stock,
					prices: [sku.price],
				};
			}
		}

		//从数组中生成指定长度的组合
		,arrayCombine: function(targetArr) {
			if(!targetArr || !targetArr.length) {
				return [];
			}

			var len = targetArr.length;
			var resultArrs = [];

			// 所有组合
			for(var n = 1; n < len; n++) {
				var flagArrs = init.getFlagArrs(len, n);
				while(flagArrs.length) {
					var flagArr = flagArrs.shift();
					var combArr = [];
					for(var i = 0; i < len; i++) {
						flagArr[i] && combArr.push(targetArr[i]);
					}
					resultArrs.push(combArr);
				}
			}

			return resultArrs;
		}

		//获得从m中取n的所有组合
		,getFlagArrs: function(m, n) {
			if(!n || n < 1) {
				return [];
			}

			var resultArrs = [],
				flagArr = [],
				isEnd = false,
				i, j, leftCnt;

			for (i = 0; i < m; i++) {
				flagArr[i] = i < n ? 1 : 0;
			}

			resultArrs.push(flagArr.concat());

			while (!isEnd) {
				leftCnt = 0;
				for (i = 0; i < m - 1; i++) {
					if (flagArr[i] == 1 && flagArr[i+1] == 0) {
						for(j = 0; j < i; j++) {
							flagArr[j] = j < leftCnt ? 1 : 0;
						}
						flagArr[i] = 0;
						flagArr[i+1] = 1;
						var aTmp = flagArr.concat();
						resultArrs.push(aTmp);
						if(aTmp.slice(-n).join("").indexOf('0') == -1) {
							isEnd = true;
						}
						break;
					}
					flagArr[i] == 1 && leftCnt++;
				}
			}
			return resultArrs;
		}


	}

	if(sku_conf.property.length > 0){
		init.start();
	}


	//点击事件
	$('.sku').each(function() {
			var self = $(this);
			var attr_id = self.attr('attr_id');
			if(!SKUResult[attr_id]) {
				self.addClass(disabled);
			}
		}).click(function() {

			var self = $(this);


			if(self.hasClass(disabled)) return;

			//选中自己，兄弟节点取消选中
			self.toggleClass(selected).siblings().removeClass(selected);
			var spValue=parseInt($("#stock").text()),
			inputValue=parseInt($(".count").html());
			var n=$(".sys_item_specpara").length;

            if(spValue <= 0){
                alert('该商品已售完！');
                return false;
            }

			if($(".color-info-ul").find("li."+selected).length==n && inputValue<spValue){
				skuObj.removeClass("on");
			}

			//已经选择的节点
			var selectedObjs = $('#skuObj .'+selected);

			if(selectedObjs.length) {
				//获得组合key价格
				var selectedIds = [];
				selectedObjs.each(function() {
					selectedIds.push($(this).attr('attr_id'));
				});
				selectedIds.sort(function(value1, value2) {
					return parseInt(value1) - parseInt(value2);
				});
				var len = selectedIds.length;

				var prices = SKUResult[selectedIds.join(';')].prices;
				var maxPrice = Math.max.apply(Math, prices);
				var minPrice = Math.min.apply(Math, prices);
				priceObj.html((maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));


				var mprices = SKUResult[selectedIds.join(';')].mprices;
				var maxPrice = Math.max.apply(Math, mprices);
				var minPrice = Math.min.apply(Math, mprices);


				stockObj.text(SKUResult[selectedIds.join(';')].stock);

				//获取input的值
				var inputValue=parseInt($(".count").val());
				// var inputTip=$(".singleGoods dd cite");

				if(inputValue>SKUResult[selectedIds.join(';')].stock){
					alert(langData['shop'][2][23])
				}else{
				}


				//用已选中的节点验证待测试节点 underTestObjs
				$(".sku").not(selectedObjs).not(self).each(function() {
					var siblingsSelectedObj = $(this).siblings('.'+selected);
					var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
					if(siblingsSelectedObj.length) {
						var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
						for(var i = 0; i < len; i++) {
							(selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
						}
					} else {
						testAttrIds = selectedIds.concat();
					}
					testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
					testAttrIds.sort(function(value1, value2) {
						return parseInt(value1) - parseInt(value2);
					});
					if(!SKUResult[testAttrIds.join(';')]) {
						$(this).addClass(disabled).removeClass(selected);
					} else {
						$(this).removeClass(disabled);
					}
				});
			} else {

				// init.defautx();

			}
		});

	//商品详情页--数量的加减

	//加
	$('.add').on("click",function(){
		var stockx = parseInt($(".color-info-ul em i").text()),n=$(".sys_item_specpara").length;

		var $c=$(this),value;
		value=parseInt($c.siblings(".count").html());
		if(value<stockx){
			value=value+1;
			$c.siblings(".count").html(value);
			var spValue=parseInt($(".color-info-ul em i").text()),
			inputValue=parseInt($(".count").val());
			if($(".color-info-ul ul").find("li.active").length==n && inputValue<spValue){
				// $(".singleGoods dd.info ul").removeClass("on");
			}
		}else{
			alert(langData['shop'][2][23])
		}
	})

	//减
	$(".reduce").on("click",function(){
		var stockx = parseInt($(".color-info-ul em i").text()),n=$(".sys_item_specpara").length;
		var $c=$(this),value;
		value=parseInt($c.siblings(".count").html());
		if(value>1){
			value=value-1;
			$c.siblings(".count").html(value);
			var spValue=parseInt($(".color-info-ul em i").text()),
			inputValue=parseInt($(".count").val());
			if($(".color-info-ul ul").find("li.active").length==n && inputValue<=spValue){
			}
		}else{
			alert(langData['shop'][2][12])
		}
	})

	// 加入购物车 或 立即购买
	$('.buy-box-cart,.buy-box-once,.add-cart,.buy-cart').click(function(){

		//验证登录
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = '/login.html';
			return false;
		}

		var $btn=$(this),
			$li=$(".sys_item_specpara"),
			// $ul=$(".singleGoods dd.info ul"),
			n=$li.length;
		if($btn.hasClass("disabled")) return false;
		var isBtnCar = $btn.hasClass('buy-box-cart');
		var isBtnBuy = $btn.hasClass('buy-box-once');
		var isBtnCar2 = $btn.hasClass('add-cart');
		var isBtnBuy2 = $btn.hasClass('buy-cart');

		var len=$li.length;
		var spValue=parseInt($("#stock").text()),	// 库存
			inputValue=parseInt($(".color-info-account .count").text());	// 购买数量

		if($(".sys_item_specpara").find(".sku."+selected).length==n && inputValue<=spValue){
			skuObj.removeClass('on');
			// 规格窗口 加入购物车
			$('.color-box').hide();

			var t=''; //该商品的属性编码 以“-”链接个属性
			$(".sys_item_specpara li.active").each(function(){
				var y=$(this).attr("attr_id");
				t=t+"-"+y;
			})
			var t=t.substr(1);

			if(isBtnCar || isBtnCar2){
				var num = parseInt($('.buy-box-num').text());
				$b = $('<b>+'+inputValue+'</b>');
				$('.buy-box-l .bn').append($b);
				$('.buy-box-num').text(inputValue+num);
				$b.animate({
					top:'-.4rem'
				},500,function(){
					setTimeout(function(){
						$b.remove();
					},500)
				})

				var num=parseInt($(".count").text());

				//操作购物车
				var data = [];
				data.id = detailID;
				data.specation = t;
				data.count = num;
				data.title = detailTitle;
				data.url = detailUrl;
				shopInit.add(data);

			}
			// 直接购买
			else{
				var userid = $.cookie(cookiePre+"login_user");
				if(userid == null || userid == ""){
					location.href = masterDomain + '/login.html';
					return false;
				}else{
					$("#pros").val(detailID+","+t+","+inputValue);
					$("#buyForm").submit();
				}
			}

		}else{
			if(isBtnCar || isBtnBuy){
				$('.main-select').click();
				if(isBtnCar){
					$('.color-footer-cart').removeClass('dn').siblings().addClass('dn');
				}else{
					$('.color-footer-once').removeClass('dn').siblings().addClass('dn');
				}
			}
			skuObj.addClass('on');
		}
	})


});
