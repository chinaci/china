$(function() {

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.choose').css('top', 'calc(.9rem + 20px)');
		$('.news-list').css('margin-top', 'calc(1.8rem + 20px)');
	}

	var detailList;
	detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 800);

	var dataInfo = {
			id: '',
			url: '',
			addrid: '',
			addrName: '',
			parAddrid: '',
			center: '',
			centerName: '',
			isBack: true
	};

	$('#maincontent').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url'), id = t.attr('data-id');

		var addrid = $('.tab-area').attr('data-id'),
				addrName = $('.tab-area span').text(),
				parAddrid = $('.tab-area').attr('data-par'),
				center = $('.tab-center').attr('data-id'),
				centerName = $('.tab-center span').text();

		dataInfo.addrid = addrid;
		dataInfo.addrName = addrName;
		dataInfo.parAddrid = parAddrid;
		dataInfo.center = center;
		dataInfo.centerName = centerName;

		detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: atpage});

		setTimeout(function(){location.href = url;}, 500);

	})

	var dom = $('#screen'), mask = $('.mask'), tabTop = $('.choose-tab').offset().top,  // 吸顶
	areaScroll = infoScroll = null, areaArr = infoArr = sortArr = [],
	chooseScroll = function(obj){
		return new iScroll(obj, {vScrollbar: false, mouseWheel: true, click: true});
	},

	init = {

		//区域
		getArea: function(){
			var areaObj = $("#choose-area");
			$.ajax({
		        url: masterDomain + '/include/ajax.php?service=job&action=addr&type='+cityid+'&son=1',
		        dataType: 'jsonp',
		        success: function(data){
		          if(data.state == 100){

		            var list = data.info, html = [], par = $('.tab-area').attr('data-par');
		            html.push('<li data-id="">不限</li>');
		            for(var i = 0; i < list.length; i++){
									var cla = par != "" && par == list[i].id ? " class='active'" : "";
		              html.push('<li data-id="'+list[i].id+'"'+cla+'>'+list[i].typename+'</li>');
		              areaArr[list[i].id] = list[i].lower;
		            }

		            areaObj.html('<ul>'+html.join("")+'</ul>');
		            areaScroll = chooseScroll("choose-area");

		          }else{
		            areaObj.html('<div class="load">'+data.info+'</div>');
		          }
		        },
		        error: function(){
		        	areaObj.html('<div class="load">网络错误！</div>');
		        }
		    });
		},

	}

	// 初始加载列表
	setTimeout(function(){
		init.getArea();
	}, 500);

	// 筛选框
	$('.choose-tab li').click(function(){
		$('body').addClass('fixed');
		var $t = $(this), index = $t.index(), box = $('.choose-box .choose-local').eq(index);

		if (index == 2) {
			if ($t.hasClass('active')) {
				$t.removeClass('active')
			}else {
				$t.addClass('active').siblings('li').removeClass('active');
			}
		 	$('.choose-box .choose-local').hide();mask.hide();
			$('body').removeClass('fixed');
		}else {
		  if (box.css("display")=="none") {

			 	$t.addClass('active').siblings().removeClass('active');
			 	box.show().siblings().hide();dom.hide();

				if (index == 0) {areaScroll.refresh();}
			 	if (index == 1 && infoScroll == null) {infoScroll = chooseScroll("choose-info");}
			 	mask.show();

			}else{
			 	$t.removeClass('active');
			 	box.hide();mask.hide();
				$('body').removeClass('fixed');
			}
		}
	});


	// 工作地点一级
	$('#choose-area').delegate("li", "click", function(){

		var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();
		$('.tab-area').attr('data-par', id);

		if (index == 0 || !areaArr[id].length) {
			var type  = t.attr("data-id"), type = type == undefined ? "" : type;
	 		$(".choose-tab li").eq(index).attr("data-id", type);

			$('#area-box .choose-stage-l').removeClass('choose-stage-l-short');
			t.addClass('active').siblings().removeClass('active');
			t.closest('.choose-local').hide();
			$('#area-box .choose-stage-r').hide();
			$('.choose-tab li').eq(localIndex).removeClass('active').find('span').text(t.text());
			mask.hide();
			getList(1);
			$('body').removeClass('fixed');

		}else{

			t.siblings().removeClass('current');
			t.addClass('active').siblings().removeClass('active');
			$('#area-box .choose-stage-l').addClass('choose-stage-l-short');
			$('#area-box .choose-stage-r').show();

			var lower = areaArr[id], html = [];
			if(lower){
        for(var i = 0; i < lower.length; i++){
          html.push('<li data-id="'+lower[i].id+'">'+lower[i].typename+'</li>');
        }
        $("#choose-area-second").html('<ul>'+html.join("")+'</ul>');
        chooseScroll("choose-area-second");
			}
		}
	})


	// 一级筛选  地址和排序
	$('#choose-area-second,#choose-sort,#choose-info').delegate("li", "click", function(){

		var $t = $(this), val = $(this).html(), local = $t.closest('.choose-local'), index = local.index(),
				type  = $t.attr("data-id"), type = type == undefined ? "" : type;

		$(".choose-tab li").eq(index).attr("data-id", type);
		$t.addClass('on').siblings().removeClass('on');

		$('.choose-tab li').eq(index).removeClass('active').find('span').text(val);

		local.hide();mask.hide();
		getList(1);
		$('body').removeClass('fixed');

	})


	// 遮罩层
	$('.mask').on('touchstart',function(){
		mask.hide();dom.hide();
		$('body').removeClass('fixed');
		$('.choose-local').hide();
		$('.choose-tab li').removeClass('active');
	})

	// 下拉加载
	$(window).scroll(function() {
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});

	//初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
		getList();
	}else {
		getData();
		setTimeout(function(){
			detailList.removeLocalStorage();
		}, 500)
	}

	//数据列表
	function getList(tr){

		isload = true;

		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
			$("#maincontent").html("");
		}

		//自定义筛选内容
		var item = [];
		$(".choose-more-condition ul").each(function(){
			var t = $(this), active = t.find(".active");
			if(active.text() != "不限"){
			}
		});


		$(".news-list .loading").remove();
		$(".news-list").append('<div class="loading">加载中...</div>');

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);

		var addr = $(".tab-area").attr("data-id");
		addr = addr == undefined ? "" : addr;
		if(addr != ""){
			data.push("addr="+addr);
		}

		var center = $(".tab-center").attr("data-id");
		center = center == undefined ? "" : center;
		if(center != ""){
			data.push("center="+center);
		}

		data.push("page="+atpage);

		$.ajax({
			url: "/include/ajax.php?service=job&action=fairs",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".news-list .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								html.push('<li>');
								html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
								html.push('<dl class="fn-clear">');
								html.push('<dt><img src="'+list[i]['fairs']['pics'][0]['pic']+'" alt=""></dt>');
								html.push('<dd class="ml">');

								html.push('<h3>'+list[i].title+'</h3>');

								//区域
								html.push('<p class="grey">');
								html.push('<span class="date">'+list[i].date+'</span>');
								html.push('<span>'+list[i].began+'-'+list[i].end+'</span>');
								html.push('</p>');
								html.push('<p class="grey">'+list[i]['fairs'].addr[0]+' '+list[i]['fairs'].addr[1]+' '+list[i]['fairs'].address+'</p>');
								html.push('</dd>');
								html.push('</dl>');
								html.push('</a>');
								html.push('</li>');

							}

							$("#maincontent").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".news-list").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".news-list").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".news-list .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".news-list .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".news-list .loading").html('网络错误，加载失败！');
			}
		});
	}

	// 本地存储的筛选条件
	function getData() {

		isload = false;
		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		atpage = detailList.getLocalStorage()['extraData'].lastIndex;

		if (filter.addrid != '') {$('.tab-area').attr('data-id', filter.addrid);}
		if (filter.parAddrid != '') {$('.tab-area').attr('data-par', filter.parAddrid);}
		if (filter.addrName != '') {$('.tab-area span').text(filter.addrName);}
		if (filter.center != '') {
			$('.tab-center').attr('data-id', filter.center);
			$('#choose-info li[data-id="'+filter.center+'"]').addClass('on');
		}
		if (filter.centerName != '') {$('.tab-center span').text(filter.centerName);}

	}


})
