$(function(){

	$('.select-nav .op-li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.toggle-li').removeClass('active-1 active-2');

		$('.select-drop,.mask').hide();
		$("body").unbind("touchmove");

		getList(1);
	})

	// 价格
	$('.toggle-li').click(function(){
		var t = $(this);
		t.addClass('active').siblings().removeClass('active');
		$('.select-drop,.mask').hide();
		$('.op-drop').removeClass('active');
		$("body").unbind("touchmove");

		if (t.hasClass('active-1')) {
			t.removeClass('active-1').addClass('active-2').attr('data-type','4');
		}else{
			t.removeClass('active-2').addClass('active-1').attr('data-type','3');
		}
		getList(1);
	})

	// 筛选
	$('.op-drop').click(function(){
		var $t = $(this);
		var t = $t.hasClass('active');
		if (!t) {
			// 禁止头部touchmove
			$('html').addClass('unscroll');
			$(this).addClass('active').siblings().removeClass('active');
			$('.toggle-li').removeClass('active-1');
			$('.toggle-li').removeClass('active-2');
			$('.select-drop,.mask').show();
		}
		else{
			$('.select-drop,.mask').hide();
			$t.removeClass('active');
			$('html').removeClass('unscroll');
		}
	})

	$('.select-drop').delegate(".drop-type li","click",function(){
		var li = $(this),p = li.closest('.drop-type'), index = p.index(), len = $('.drop-type').length;
		li.addClass('active').siblings().removeClass('active');
		if(!p.hasClass('drop-typeid')) return;

		$('.drop-type').slice(index+1,len).remove();
		var id = $(this).attr('data-id');

		if(id != undefined && id != ''){
			var parame = 'typeid='+id;

			// 子分类
			getData('getTypeList',"tid="+id,function(data){
				if(data && data.state == 100){
					var info = data.info,html = [];
					html.push('<div class="drop-typeid drop-type drop-more">');
					html.push('	<h3>子类别</h3>');
					html.push('		<ul>');
					html.push('			<li class="active"><a href="javascript:;">全部</a></li>');
					for(var i = 0; i < info.length; i++){
						var list = info[i];
						html.push('<li data-id="'+list['id']+'"><a href="javascript:;">'+list['typename']+'</a></li>')
					}
					html.push('	</ul>');
					html.push('</div>');
					$('.drop-range').before(html.join(""));
				}
			})

			// 属性
			getData('typeItem',parame,function(data){
				if(data && data.state == 100){
					var info = data.info,html = [];
					for(var i = 0; i < info.length; i++){
						var list = info[i],html1 = [];
						var item = list['listItem'];

						html1.push('<div class="drop-type drop-more drop-sx">');
						html1.push('	<h3>'+list['typeName']+'</h3>');
						html1.push('	<ul>');
						var html2 = ['<li class="active"><a href="javascript:;">全部</a></li>'];
						for(var m = 0; m < item.length; m++){
							html2.push('<li data-id="'+list['id']+':'+item[m]['id']+'"><a href="javascript:;">'+item[m]['val']+'</a></li>')
						}
						html1.push('		'+html2.join(""));
						html1.push('	</ul>');
						html1.push('</div>');

						html.push(html1.join(""));
					}
					$('.drop-range').before(html.join(""));
				}
			})

			// 规格
			getData('typeSpecification',parame,function(data){
				if(data && data.state == 100){
					var info = data.info,html = [];
					for(var i = 0; i < info.length; i++){
						var list = info[i],html1 = [];
						var item = list['listItem'];

						html1.push('<div class="drop-type drop-more drop-gg">');
						html1.push('	<h3>'+list['typeName']+'</h3>');
						html1.push('	<ul>');
						var html2 = ['<li class="active"><a href="javascript:;">全部</a></li>'];
						for(var m = 0; m < item.length; m++){
							html2.push('<li data-id="'+(i+1)+':'+item[m]['id']+'"><a href="javascript:;">'+item[m]['val']+'</a></li>')
						}
						html1.push('		'+html2.join(""));
						html1.push('	</ul>');
						html1.push('</div>');

						html.push(html1.join(""));
					}
					$('.drop-range').before(html.join(""));
				}
			})
		}
	})

	function getData(action,data,callback){
		$.ajax({
			url: "/include/ajax.php?service=shop&action="+action,
			data: data,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				callback(data);
			},
			error:function(){
				// console.log('获取失败')
			}
		})
	}

	$('.confirm').click(function(){
		$('.select-drop,.mask').hide();
		$('.op-drop').removeClass('active');
		$('html').removeClass('unscroll');
		getList(1);
	})

	// 遮罩层
	$('.mask').on('click',function(){

		$('.select-drop,.mask').hide();
		$('.op-drop').removeClass('active');
		$("body").unbind("touchmove");

	})

	// 下拉加载
	var isload = false;
	$(document).ready(function() {
		$(window).scroll(function() {
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - w;
			if ($(window).scrollTop() + 50 > scroll && !isload) {
				atpage++;
				getList();
			};
		});
	});


	//初始加载
	getList();

	//数据列表
	function getList(tr){

		isload = true;

		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
			$(".list-box ul").html("");
		}

		//自定义筛选内容
		var item = [];
		$(".choose-more-condition ul").each(function(){
			var t = $(this), active = t.find(".active");
			if(active.text() != "不限"){
			}
		});


		$(".list-box .loading").remove();
		$(".list-box").append('<div class="loading">加载中...</div>');

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		var orderbyType = $('.select-nav li.active').attr('data-type');
		if(orderbyType != undefined && orderbyType != ''){
			data.push("orderby="+orderbyType);
		}

		//更多筛选条件 drop-type
		// 商品类别
		var stypeid1 = $('.drop-typeid').eq(0).find('li.active').attr('data-id');
		if($('.drop-typeid').length > 1){
			var stypeid2 = $('.drop-typeid').eq(1).find('li.active').attr('data-id');
			if(stypeid2 != undefined && stypeid2 != ''){
				data.push("typeid="+stypeid2);
			}else{
				data.push("typeid="+stypeid1);
			}
		}else{
			if(stypeid1 != undefined && stypeid1 != ''){
				data.push("typeid="+stypeid1);
			}else{
				data.push("typeid="+typeid);
			}
		}

		// 属性
		var sx = [];
		$('.drop-sx').each(function(){
			var id = $(this).find('li.active').attr('data-id');
			if(id != undefined && id != ''){
				sx.push(id);
			}
		})
		if(sx.length){
			data.push('item='+sx.join(";"));
		}

		// 规格
		var gg = [];
		$('.drop-gg').each(function(){
			var id = $(this).find('li.active').attr('data-id');
			if(id != undefined && id != ''){
				gg.push(id);
			}
		})
		if(gg.length){
			data.push('specification='+gg.join(";"));
		}

		// 价格
		var price1 = $('.drop-range .price1').val();
		var price2 = $('.drop-range .price2').val();
		if(price1 || price2){
			data.push("price="+price1+','+price2);
		}

		if(keywords != null && keywords != ''){
			data.push("title="+keywords);
		}
		$.ajax({
			url: "/include/ajax.php?service=shop&action=slist",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".list-box .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){

								var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : list[i].litpic;
								var tejia = list[i].tejia ? '<span class="ter">商城特价</span>' : '';
								var qiang = list[i].panic ? '<span class="ter">限时抢</span>' : '';
								html.push('<li>');
								html.push('		<a href="'+list[i].url+'">');
								html.push('			<div class="img-box">');
								html.push('				<img src="'+pic+'" alt="">');
								html.push('			</div>');
								html.push('			<div class="txt-box">');
								html.push('				<h3>'+list[i].title+'</h3>');
								html.push('				<div class="txt-price">');
								html.push('					<span>'+echoCurrency('symbol')+list[i].price+'</span>');
								html.push('					<em>'+echoCurrency('symbol')+list[i].mprice+'</em>');
								html.push('				</div>');
								html.push('				<div class="txt-info">');
								html.push('					<span>售出<em class="yellow">'+list[i].sales+'</em>件</span>');
								html.push('					'+qiang);
								html.push('					'+tejia);
								html.push('				</div>');
								html.push('			</div>');
								html.push('		</a>');
								html.push('</li>');
							}

							$(".list-box ul").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".list-box").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".list-box").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".list-box .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".list-box .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".list-box .loading").html('网络错误，加载失败！');
			}
		});
	}
})
