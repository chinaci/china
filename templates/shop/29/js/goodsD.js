$(function(){

	var loadComm = 0;

	 //商品列表--商品放大镜
	$(".jqzoom").imagezoom();

	$("#thumblist li a").click(function(){
		$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
		$(".jqzoom").attr('src',$(this).find("img").attr("mid"));
		$(".jqzoom").attr('rel',$(this).find("img").attr("big"));
	});

	//商品列表--商品详情页--商品评价的好评中评差评的选择
	$(".detailComment .left a").on("click",function(){
		var $a=$(this), i=$a.index();
		$a.addClass("on").siblings("a").removeClass("on");
		$(".allCon .con").eq(i).show().siblings(".con").hide();
		if(i == 1 && !loadComm){
			getComments();
		}
	})


	var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
  var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
  window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];


	//---------------------------异步加载评价列表------------------------------------------

	var atpage = 1, totalCount = 0, pageSize = 20;
	var ratelist = $(".all-comment"), loading = $(".loading"), ul = $("#comment-list");

	$(".all-comment .commentSel a").on("click",function(){
		$(this).addClass("on").siblings("a").removeClass("on");
		atpage = 1;
		getComments();
	})

	//初始点击定位当前位置
	$("html").delegate(".carousel .thumb li", "click", function(){
		var t = $(this), carousel = t.closest(".carousel"), album = carousel.find(".album");
		if(album.is(":hidden")){
			t.addClass("on");
			$('html, body').animate({scrollTop: carousel.offset().top - 45}, 300);
			album.show();
		}
	});

	//收起图集
	$("html").delegate(".carousel .close", "click", function(){
		var t = $(this), carousel = t.closest(".carousel"), thumb = carousel.find(".thumb"), album = carousel.find(".album");
		album.hide();
		thumb.find(".on").removeClass("on");
	});

	//获取评价
	function getComments(){

		loading.show();
		ul.html("");
		loadComm = 1;

		var data = [];
		data.push('aid='+detailID);
		data.push('page='+atpage);
		data.push('pageSize='+pageSize);
		data.push('filter='+$(".all-comment .commentSel .on").data("filter"));

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=member&action=getComment&type=shop-order",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {

				loading.hide();
				if(data && data.state == 100){

					var list = data.info.list,
							pageinfo = data.info.pageInfo,
							html = [];

					totalCount = pageinfo.totalCount;
					for(var i = 0; i < list.length; i++){
						html.push('<li class="rate-item clearfix">');
						html.push('<div class="user-info">');

						var photo = list[i].user.photo == "" ? staticPath+'images/noPhoto_40.jpg' : list[i].user.photo;

						html.push('<a href="'+masterDomain+'/user/'+list[i].user.id+'"><img class="avatar" src="'+photo+'" /></a>');
						html.push('<p><a href="'+masterDomain+'/user/'+list[i].user.id+'">'+list[i].user.nickname+'</a></p>');
						html.push('</div>');
						html.push('<div class="review">');
						html.push('<div class="info">');

						rat = parseInt(list[i].rating);
						rating = "";
						switch (rat) {
							case 1:
								rating = langData['siteConfig'][18][6];
								break;
							case 2:
								rating = langData['siteConfig'][19][368];
								break;
							case 3:
								rating = langData['siteConfig'][19][369];
								break;
						}
						html.push('<span class="rating rating'+rat+'">'+rating+'</span>');
						html.push('<span class="time">'+huoniao.transTimes(list[i].dtime, 2)+'</span>');
						html.push('<span class="specation">'+list[i].specation+'</span>');
						html.push('</div>');
						html.push('<div class="view">');
						html.push('<p>'+list[i].content+'</p>');

						//图集
						var pics = list[i].pics;
						if(pics.length > 0){
							var thumbArr = [], albumArr = [];
							for(var p = 0; p < pics.length; p++){
								thumbArr.push('<li><a href="javascript:;"><img src="'+huoniao.changeFileSize(pics[p], "small")+'" /></a></li>');
								albumArr.push('<div class="aitem"><i></i><img src="'+pics[p]+'" /></div>');
							}

							html.push('<div class="carousel">');
							html.push('<div class="thumb">');
							html.push('<div class="plist">');
							html.push('<ul>'+thumbArr.join("")+'<ul>');
							html.push('</div>');

							if(pics.length > 7){
								html.push('<a href="javascript:;" class="sprev"><i></i></a>');
								html.push('<a href="javascript:;" class="snext"><i></i></a>');
							}
							html.push('</div>');
							html.push('<div class="album">');
							html.push('<a href="javascript:;" hidefocus="true" class="prev"></a>');
							html.push('<a href="javascript:;" hidefocus="true" class="close"></a>');
							html.push('<a href="javascript:;" hidefocus="true" class="next"></a>');
							html.push('<div class="albumlist">'+albumArr.join("")+'</div>');
							html.push('</div>');
							html.push('</div>');
						}

						html.push('</div>');
						html.push('</div>');
						html.push('</li>');
					}

					ul.html(html.join(""));
					showPageInfo();

					//切换效果
					ul.find(".carousel").each(function(){
						var t = $(this), album = t.find(".album");
						//大图切换
						t.slide({
							titCell: ".plist li",
							mainCell: ".albumlist",
							trigger:"click",
							autoPlay: false,
							delayTime: 0,
							startFun: function(i, p) {
								if (i == 0) {
									t.find(".sprev").click()
								} else if (i % 8 == 0) {
									t.find(".snext").click()
								}
							}
						});
						//小图左滚动切换
						t.find(".thumb").slide({
							mainCell: "ul",
							delayTime: 300,
							vis: 10,
							scroll: 8,
							effect: "left",
							autoPage: true,
							prevCell: ".sprev",
							nextCell: ".snext",
							pnLoop: false
						});
					});
					$(".carousel .thumb li.on").removeClass("on");

				}else{
					ul.html('<li class="empty">'+data.info+'</li>');
				}
			},
			error: function(){
				loading.hide();
				ul.html('<li class="empty">'+langData['siteConfig'][20][227]+'</li>');
			}
		});
	}



	//分页
	function showPageInfo() {
		var info = $(".comment-list .pagination");
		var nowPageNum = atpage;
		var allPageNum = Math.ceil(totalCount/pageSize);
		var pageArr = [];

		info.html("").hide();

		var pages = document.createElement("div");
		pages.className = "pagination-pages fn-clear";
		info.append(pages);

		//拼接所有分页
		if (allPageNum > 1) {

			//上一页
			if (nowPageNum > 1) {
				var prev = document.createElement("a");
				prev.className = "prev";
				prev.innerHTML = langData['siteConfig'][6][33];
				prev.onclick = function () {
					atpage = nowPageNum - 1;
					getComments();
				}
				info.find(".pagination-pages").append(prev);
			}

			//分页列表
			if (allPageNum - 2 < 1) {
				for (var i = 1; i <= allPageNum; i++) {
					if (nowPageNum == i) {
						var page = document.createElement("span");
						page.className = "curr";
						page.innerHTML = i;
					} else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getComments();
						}
					}
					info.find(".pagination-pages").append(page);
				}
			} else {
				for (var i = 1; i <= 2; i++) {
					if (nowPageNum == i) {
						var page = document.createElement("span");
						page.className = "curr";
						page.innerHTML = i;
					}
					else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getComments();
						}
					}
					info.find(".pagination-pages").append(page);
				}
				var addNum = nowPageNum - 4;
				if (addNum > 0) {
					var em = document.createElement("span");
					em.className = "interim";
					em.innerHTML = "...";
					info.find(".pagination-pages").append(em);
				}
				for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
					if (i > allPageNum) {
						break;
					}
					else {
						if (i <= 2) {
							continue;
						}
						else {
							if (nowPageNum == i) {
								var page = document.createElement("span");
								page.className = "curr";
								page.innerHTML = i;
							}
							else {
								var page = document.createElement("a");
								page.innerHTML = i;
								page.onclick = function () {
									atpage = Number($(this).text());
									getComments();
								}
							}
							info.find(".pagination-pages").append(page);
						}
					}
				}
				var addNum = nowPageNum + 2;
				if (addNum < allPageNum - 1) {
					var em = document.createElement("span");
					em.className = "interim";
					em.innerHTML = "...";
					info.find(".pagination-pages").append(em);
				}
				for (var i = allPageNum - 1; i <= allPageNum; i++) {
					if (i <= nowPageNum + 1) {
						continue;
					}
					else {
						var page = document.createElement("a");
						page.innerHTML = i;
						page.onclick = function () {
							atpage = Number($(this).text());
							getComments();
						}
						info.find(".pagination-pages").append(page);
					}
				}
			}

			//下一页
			if (nowPageNum < allPageNum) {
				var next = document.createElement("a");
				next.className = "next";
				next.innerHTML = langData['siteConfig'][6][34];
				next.onclick = function () {
					atpage = nowPageNum + 1;
					getComments();
				}
				info.find(".pagination-pages").append(next);
			}

			//输入跳转
			var insertNum = Number(nowPageNum + 1);
			if (insertNum >= Number(allPageNum)) {
				insertNum = Number(allPageNum);
			}

			var redirect = document.createElement("div");
			redirect.className = "redirect";
				redirect.innerHTML = '<i>'+langData['siteConfig'][13][51]+'</i><input id="prependedInput" type="number" placeholder="'+langData['siteConfig'][26][174]+'" min="1" max="'+allPageNum+'" maxlength="4"><i>'+langData['siteConfig'][13][54]+'</i><button type="button" id="pageSubmit">'+langData['siteConfig'][6][1]+'</button>';
			info.find(".pagination-pages").append(redirect);

			//分页跳转
			info.find("#pageSubmit").bind("click", function(){
				var pageNum = $("#prependedInput").val();
				if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
					atpage = Number(pageNum);
					getComments();
				} else {
					$("#prependedInput").focus();
				}
			});

			info.show();

		}else{
			info.hide();
		}
	}





	//倒计时
	var now = date[0], stime = date[1], etime = date[2], state = 1, summary = $(".singleGoods"), btns = summary.find(".cartBuy"), expiry = summary.find(".expiry");
	//还未开始
	if(now < stime){
		state = 2;
		btns.find(".buyNow").html(langData['shop'][5][72]);

	//已结束
	}else if(now > etime){
		state = 3;
		btns.find(".buyNow").html(langData['siteConfig'][19][507]);
	}
	if(state > 1)	btns.find("a").addClass("disabled"),btns.find(".cart").hide();

	var timeCompute = function (a, b) {
		if (this.time = a, !(0 >= a)) {
			for (var c = [86400 / b, 3600 / b, 60 / b, 1 / b], d = .1 === b ? 1 : .01 === b ? 2 : .001 === b ? 3 : 0, e = 0; d > e; e++) c.push(b * Math.pow(10, d - e));
			for (var f, g = [], e = 0; e < c.length; e++) f = Math.floor(a / c[e]),
			g.push(f),
			a -= f * c[e];
			return g
		}
	}
	,CountDown =	function(a) {
		this.time = a,
		this.countTimer = null,
		this.run = function(a) {
			var b, c = this;
			this.countTimer = setInterval(function() {
				b = timeCompute.call(c, c.time - 1, 1);
				b || (clearInterval(c.countTimer), c.countTimer = null);
				"function" == typeof a && a(b || [0, 0, 0, 0, 0], !c.countTimer)
			}, 1000);
		}
	};

	var begin = stime - now;
	var end   = etime - now;
	var time  = begin > 0 ? begin : end > 0 ? end : 0;

	var timeTypeText = langData['shop'][5][73];
	if(begin < 0 && end < 0 ){
		timeTypeText = langData['shop'][5][74];
	}else if (begin > 0 && end > 0) {
		timeTypeText = langData['shop'][5][73];
	} else if(begin < 0 && end > 0) {
		timeTypeText = langData['shop'][5][74];
	}
	var countDown = new CountDown(time);
	if(date.length > 0){
		countDownRun();
	}

	function countDownRun(time) {
		time && (countDown.time = time);
		countDown.run(function(times, complete) {
			var html = ''+timeTypeText + ' ' + times[0] +	' 天 ' + times[1] + ' 小时 ' + times[2] + ' 分 ' + times[3] + ' 秒';
			expiry.html(html);
			if (complete) {
				if(begin < 0 && end < 0 ){
					btns.find("a").addClass("disabled"),btns.find(".cart").hide();
					btns.find(".buyNow").html(langData['siteConfig'][19][507]);
				}else if (begin > 0) {
					btns.find("a").removeClass("disabled"),btns.find(".cart").show();
					btns.find(".buyNow").html(langData['shop'][5][75]);
					timeTypeText = langData['shop'][5][74];
					countDownRun(etime - stime);
					begin = null;
				} else {
					btns.find("a").addClass("disabled"),btns.find(".cart").hide();
					if( begin === null || begin <= 0 ){
						btns.find(".buyNow").html(langData['siteConfig'][19][507]);
					}else{
						btns.find(".buyNow").html(langData['shop'][5][72]);
					}
				}
			}
		});
	}




		//商品详情页--数量的加减

		//加
		$(".singleGoods li .num i.up").on("click",function(){
			var stockx = parseInt($(".singleGoods .count var b").text()),n=$(".sys_item_specpara").length;

			var $c=$(this),value;
			value=parseInt($c.siblings("input").val());
			if(value<maxCount || maxCount == 0){
				value=value+1;
				$c.siblings("input").val(value);
				if(value>stockx){
					$(".singleGoods .count cite").show();
				}
				var spValue=parseInt($(".singleGoods dd var b").text()),
				inputValue=parseInt($(".singleGoods dd input").val());
				if($(".singleGoods .pro").find("a.selected").length==n && inputValue<spValue){
					$(".singleGoods dd.info ul").removeClass("on");
				}
			}
		})

		//减
		$(".singleGoods li .num i.down").on("click",function(){
			var stockx = parseInt($(".singleGoods .count var b").text()),n=$(".sys_item_specpara").length;
			var $c=$(this),value;
			value=parseInt($c.siblings("input").val());
			if(value>1){
				value=value-1;
				$c.siblings("input").val(value);
				if(value<=stockx){
					$(".singleGoods .count cite").hide();
				}
				var spValue=parseInt($(".singleGoods dd var b").text()),
				inputValue=parseInt($(".singleGoods dd input").val());
				if($(".singleGoods .pro").find("a.selected").length==n && inputValue<=spValue){
					$(".singleGoods dd.info ul").removeClass("on");
				}
			}
		})




		//商品属性选择
		var SKUResult = {};  //保存组合结果
		var mpriceArr = [];  //市场价格集合
		var priceArr = [];   //现价集合
		var totalStock = 0;  //总库存
		var skuObj = $(".singleGoods dd.info li.count"),
			mpriceObj = $(".singleGoods dd.info li s"),          //原价
			priceObj = $(".singleGoods dd.info li font"),        //现价
			stockObj = $(".singleGoods .count var b"),           //库存
			disabled = "disabled",                               //不可选
			selected = "selected";                               //已选

		var init = {

			//拼接HTML代码
			start: function(){
				var proDataArr = [], data = sku_conf.property;
				for(var i = 0; i < data.length; i++){
					proDataArr.push('<li class="sys_item_specpara"><span class="left">'+data[i].name+'：</span><div class="pro">');
					var options = data[i].options;
					for(var ii = 0; ii < options.length; ii++){
						proDataArr.push('<a href="javascript:;" class="sku" attr_id="'+options[ii].id+'">'+options[ii].name+'</a>');
					}
					proDataArr.push('</div></li>');
				}
				skuObj.before(proDataArr.join(""));

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
			,defautx: function(){

				//市场价范围
				var maxPrice = Math.max.apply(Math, mpriceArr);
				var minPrice = Math.min.apply(Math, mpriceArr);
				mpriceObj.html((echoCurrency('symbol'))+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));

				//现价范围
				var maxPrice = Math.max.apply(Math, priceArr);
				var minPrice = Math.min.apply(Math, priceArr);
				priceObj.html((echoCurrency('symbol'))+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));

				//总库存

				stockObj.text(totalStock);

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
						mprices: [sku.mprice]
					}
				}

				init.defautx();
			}

			//把组合的key放入结果集SKUResult
			,add2SKUResult: function(combArrItem, sku) {
				var key = combArrItem.join(";");
				//SKU信息key属性
				if(SKUResult[key]) {
					SKUResult[key].stock += sku.stock;
					SKUResult[key].prices.push(sku.price);
					SKUResult[key].mprices.push(sku.mprice);
				} else {
					SKUResult[key] = {
						stock: sku.stock,
						prices: [sku.price],
						mprices: [sku.mprice]
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
			self.toggleClass(selected).siblings("a").removeClass(selected);
			var spValue=parseInt($(".singleGoods dd var b").text()),
			inputValue=parseInt($(".singleGoods dd input").val());
			var n=$(".sys_item_specpara").length;

			if($(".singleGoods .pro").find("a.selected").length==n && inputValue<spValue){

				$(".singleGoods dd.info ul").removeClass("on");
			}

			//已经选择的节点
			var selectedObjs = $('.'+selected);

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
				priceObj.html((echoCurrency('symbol'))+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));


				var mprices = SKUResult[selectedIds.join(';')].mprices;
				var maxPrice = Math.max.apply(Math, mprices);
				var minPrice = Math.min.apply(Math, mprices);
				mpriceObj.html((echoCurrency('symbol'))+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));


				stockObj.text(SKUResult[selectedIds.join(';')].stock);

				//获取input的值
				var inputValue=parseInt($(".singleGoods dd .num input").val());
				var inputTip=$(".singleGoods dd cite");

				if(inputValue>SKUResult[selectedIds.join(';')].stock){
					inputTip.show();
				}else{
					inputTip.hide();
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

				init.defautx();

			}
		});


		//加入购物车及加入购物车判断
		$(".singleGoods dd.cartBuy a.cart").on("click",function(event){
			//验证登录
			var userid = $.cookie(cookiePre+"login_user");
			if(userid == null || userid == ""){
				huoniao.login();
				return false;
			}

			var $buy=$(this),$li=$(".sys_item_specpara"),$ul=$(".singleGoods dd.info ul"),n=$li.length;
			if($buy.hasClass("disabled")) return false;
			var len=$li.length;
			var spValue=parseInt($(".singleGoods dd var b").text()),
					inputValue=parseInt($(".singleGoods dd input").val());

			if($(".singleGoods .pro").find("a.selected").length==n && inputValue<=spValue){

				//加入购物车动画
	 			$(".singleGoods dd.info ul").removeClass("on");
   			var offset = $(".topcart .cart-btn .icon").offset();
        var flyer = $('<img class="flyer-img" src="' + detailThumb + '">'); //抛物体对象
       	var t = $(this).offset();
				var scH = $(window).scrollTop();

        flyer.fly({
          start: {
              left: t.left+50,//抛物体起点横坐标
              top: t.top-scH-20 //抛物体起点纵坐标
          },
          end: {
              left: offset.left + 12,//抛物体终点横坐标
              top: offset.top-scH, //抛物体终点纵坐标
              width:20,
              height:20,
              borderRadius:10
          },
          onEnd: function() {
          	var $i = $("<b class='flyend'>").text("+1");
						var x =22, y = 0;

						setTimeout(function(){
							$(".topcart").append($i);
							$i.animate({top: y - 50, opacity: 0}, 500, function(){
								$i.remove();
							});
						}, 300);

            this.destroy(); //销毁抛物体
          }
        });

				var $dl=$(this).parents("dl");
				var t=''; //该商品的属性编码 以“-”链接个属性
				$(".sys_item_specpara").each(function(){
					var $t=$(this),y=$t.find("a.selected").attr("attr_id");
					 t=t+"-"+y;
				})
				t=t.substr(1);

				glocart.find(".empty").hide();
				$(".cartlist").show();

				var num=parseInt($(".singleGoods dd .num input").val());

				//操作购物车
				var data = [];
				data.id = detailID;
				data.specation = t;
				data.count = num;
				data.title = detailTitle;
				data.url = detailUrl;
				shopInit.add(data);

			}else{
				$ul.addClass("on");
			}

		});


		function addCart(t,num){
			if($(".cartlist ul li[data-pro="+t+"]").length>0){
				var n=parseInt($(".cartlist ul li[data-pro="+t+"]").find("strong.c").text());
				n+=num;
				$(".cartlist ul li[data-pro="+t+"]").attr("data-count",n);
			}else{
				$(".cartlist ul").append("<li id="+detailID+" data-pro="+t+" data-count="+num+"></li>");
			}
		}


		//立即购买判断
		$(".singleGoods dd.cartBuy a.buyNow").on("click",function(event){
			var $buy=$(this),$li=$(".sys_item_specpara"),$ul=$(".singleGoods dd.info ul"),n=$li.length;
			if($buy.hasClass("disabled")) return false;
			var len=$li.length;
			var spValue=parseInt($(".singleGoods dd var b").text()),
			inputValue=parseInt($(".singleGoods dd input").val());

			//验证登录
			var userid = $.cookie(cookiePre+"login_user");
			if(userid == null || userid == ""){
				huoniao.login();
				return false;
			}


			if($(".singleGoods").find("a.selected").length==n && inputValue<=spValue){
				var t=''; //该商品的属性编码 以“-”链接个属性
				$(".sys_item_specpara").each(function(){
					var $t=$(this),y=$t.find("a.selected").attr("attr_id");
					 t=t+"-"+y;
				})
				t=t.substr(1);
				$("#pros").val(detailID+","+t+","+inputValue);
				$("#buyForm").submit();
			}else{
				$ul.addClass("on");
			}
		})


	//商家列表详情
	$(".hot ul li").hover(function(){
		var $li=$(this);
		$li.find("p").addClass("on");
		$li.siblings("li").find("p").removeClass("on");
		$li.find("dl").addClass("on");
		$li.siblings("li").find("dl").removeClass("on");
	})

	
  // 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add";
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      huoniao.login();
      return false;
    }
    t.toggleClass('has');
    $.post("/include/ajax.php?service=member&action=collect&module=shop&temp=detail&type="+type+"&id="+detailID);
  });

});
