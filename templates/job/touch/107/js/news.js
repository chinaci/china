$(function(){

	var dataInfo = {
		isBack: true
	};

	$('#maincontent').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url');
		detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: atpage});
		setTimeout(function(){location.href = url;}, 500);
	})

	$('.tab-info a').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	})

	$('.footer li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
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


	function getList(tr){

		isload = true;

		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
			$(".news-list").html("");
		}
		$(".news-list .loading").remove();
		$(".news-list").append('<div class="loading">加载中...</div>');

		var id = $('.tab-info .active').attr('data-id');
		if (id == undefined) {
			id = 0;
		}

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		$.ajax({
			url: "/include/ajax.php?service=job&action=news&typeid="+id,
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

								if (list[i].litpic != "") {
									html.push('<dt><img src="'+list[i].litpic+'" alt=""></dt>');
								}
								html.push('<dd class="ml">')
								html.push('<h3>'+list[i].title+'</h3>')
								html.push('<p class="grey">'+list[i].click+'人浏览 · '+list[i].pubdate+'</p>')
								html.push('</dd>')
								html.push('</dl>')
								html.push('</a>')
								html.push('</li>')
							}

							$(".news-list ul").append(html.join(""));
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

})
