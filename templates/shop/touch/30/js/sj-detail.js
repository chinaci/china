$(function(){
	var device = navigator.userAgent;
	var tabTop = $('.select-box').offset().top;

	$('.select-nav .op-li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.toggle-li').removeClass('active-1 active-2');

		$('.select-drop,.mask').hide();
		$("body").unbind("touchmove");

		getList(1);

		if($(this).index() != 0){
			$('#info-box').css({'visibility': 'hidden'});
			$('.disk').hide();
		}
	})
	// 展开/收起 分类
	$('.chooseType').click(function(){
		if($('#info-box').is(':visible')){
			$('#info-box').css({'visibility': 'visible'});
			$('.disk').show();
		}else{
			$('#info-box').css({'visibility': 'hidden'});
			$('.disk').hide();
		}
	})
	// 选中分类
	$("#info-box li").click(function(){
		var t = $(this), id = t.attr('data-id'), index = t.index(), p = t.closest('.fchoose'), pid = p.attr('id');
		t.addClass('active').siblings().removeClass('active');
		$('.chooseType').attr('data-type', id);
		// 一级
		if(id == 0){
			$('#choose1 .sub_box').hide();
		}else if(pid == "choose0"){
			var obj = $('#choose1 .sub_box').eq((index-1));
			obj.show().siblings().hide();
			return false;
		}

		var typename = t.attr('data-typename');
		$('.chooseType a span').text(typename);
		$('#info-box').css({'visibility': 'hidden'});
		$('.disk').hide();
		getList(1);


	})

	$('.disk').click(function(){
		$('.disk').hide();
		$('#info-box').css({'visibility': 'hidden'});
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

		$('#info-box').css({'visibility': 'hidden'});
		$('.disk').hide();
		
		getList(1);
	})

	// 吸顶
	$(window).scroll(function(){
		var winTop = $(this).scrollTop();
		if (winTop > tabTop) {
			$('.select-box ul, .choose-box').addClass('top');
			if (device.indexOf('huoniao_iOS') > -1) {
        $('.select-box ul').addClass('padTop20');
      }
		}
		else{
			$('.select-box ul, .choose-box').removeClass('top padTop20');
		}
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
			$(".command-list-con ul").html("");
		}

		//自定义筛选内容
		var item = [];
		$(".choose-more-condition ul").each(function(){
			var t = $(this), active = t.find(".active");
			if(active.text() != langData['siteConfig'][22][96]){
			}
		});


		$(".command-list-con .loading").remove();
		$(".command-list-con").append('<div class="loading">'+langData['siteConfig'][20][184]+'...</div>');

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);
		data.push("store="+storeid);
		data.push("storetype="+$('.chooseType').attr('data-type'));

		var orderbyType = $('.select-nav li.active').attr('data-type');
		if(orderbyType != undefined && orderbyType != ''){
			data.push("orderby="+orderbyType);
		}

		$.ajax({
			url: "/include/ajax.php?service=shop&action=slist",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".command-list-con .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){

								var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : list[i].litpic;
								var tejia = list[i].tejia ? '<span class="ter">'+langData['shop'][0][10]+'</span>' : '';
								var qiang = list[i].panic ? '<span class="ter">'+langData['shop'][0][15]+'</span>' : '';
								html.push('<li>');
								html.push('		<a href="'+list[i].url+'">');
								html.push('			<div class="pro-img">');
								html.push('				<img src="'+pic+'" alt="">');
								html.push('			</div>');
								html.push('			<div class="pro-txt">');
								html.push('				<h4 class="mt10">'+list[i].title+'</h4>');
								html.push('				<div class="pro-price mt10">');
								html.push('					<span>'+echoCurrency('symbol')+list[i].price+'</span>');
								html.push('				</div>');
								html.push('				<div class="pro-info">');
								html.push('					<span>'+langData['shop'][3][7].replace('1', '<em class="yellow">'+list[i].sales+'</em>')+'</span>');
								html.push('					'+qiang);
								html.push('					'+tejia);
								html.push('				</div>');
								html.push('			</div>');
								html.push('		</a>');
								html.push('</li>');
							}

							$(".command-list-con ul").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$('.more').show();
							}

						//没有数据
						}else{
							isload = true;
							$(".command-list-con").append('<div class="loading">'+langData['siteConfig'][20][126]+'</div>');
						}

					//请求失败
					}else{
						$(".command-list-con .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".command-list-con .loading").html(langData['siteConfig'][20][462]);
				}
			},
			error: function(){
				isload = false;
				$(".command-list-con .loading").html(langData['siteConfig'][20][227]);
			}
		});
	}

	// 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add", temp = t.attr('data-temp');
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html';
      return false;
    }
    if(type == 'add'){
    	t.html('<i></i>已收藏').addClass('has');
    }else{
    	t.html('<i></i>收藏').removeClass('has');
    }
    $.post("/include/ajax.php?service=member&action=collect&module=shop&temp="+temp+"&type="+type+"&id="+storeid);
  });
})
