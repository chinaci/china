$(function() {

    toggleDragRefresh('off');

	var detailList;
	detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 800);

	var dataInfo = {
			id: '',
			url: '',
			addrid: '',
			addrName: '',
			parAddrid: '',
			jtype: '',
			jtypeName: '',
			parJtype: '',
			more: '',
			isBack: true
	};
	var resume_id = 0;
	$('#maincontent').delegate('li', 'click', function(e){

	if($(e.target).hasClass("jsbtn")) {
		// 点击解锁
        var t = $(e.target);
			var _name = t.attr('data-name');
			var _types = t.attr('data-types');
			$('.txt_name').html(_name);
			$('.txt_title').html(_types);
			$('.unlock').show();
			$('.mask01').show();


        resume_id = t.attr('data-id');

    }else{
			var t = $(this), a = t.find('a'), url = a.attr('data-url'), id = t.attr('data-id');

			var addrid = $('.tab-area').attr('data-id'),
					addrName = $('.tab-area span').text(),
					parAddrid = $('.tab-area').attr('data-par'),
					jtype = $('.tab-type').attr('data-id'),
					jtypeName = $('.tab-type span').text(),
					parJtype = $('.tab-type').attr('data-par');

			dataInfo.addrid = addrid;
			dataInfo.addrName = addrName;
			dataInfo.parAddrid = parAddrid;
			dataInfo.jtype = jtype;
			dataInfo.jtypeName = jtypeName;
			dataInfo.parJtype = parJtype;
			dataInfo.more = $('#choose-more').html();

			detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: atpage});

			setTimeout(function(){location.href = url;}, 500);
		}

	})
	$('.unlock .close').click(function(){
		$('.unlock').hide();
		$('.mask01').hide();
	});

	var dom = $('#screen'), mask = $('.mask'), tabTop = $('.choose-tab').offset().top,  // 吸顶
		areaScroll = sortScroll = moreScroll = null,
		areaArr = [], sortArr = [], moreArr = [], sortSecondArr = [],
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

			//职位类型
			getSort: function(){
				var sortObj = $("#choose-sort");
				$.ajax({
			        url: masterDomain + '/include/ajax.php?service=job&action=type&son=1',
			        dataType: 'jsonp',
			        success: function(data){
			          if(data.state == 100){

			            var list = data.info, html = [], par = $('.tab-type').attr('data-par');
			            html.push('<li data-id="">不限</li>');
			            for(var i = 0; i < list.length; i++){
										var cla = par != "" && par == list[i].id ? " class='active'" : "";
			              html.push('<li data-id="'+list[i].id+'"'+cla+'>'+list[i].typename+'</li>');
			              lower1 = list[i].lower;
			              sortArr[list[i].id] = lower1;
			            }

			            sortObj.html('<ul>'+html.join("")+'</ul>');
			            sortScroll = chooseScroll("choose-sort");

			          }else{
			            sortObj.html('<div class="load">'+data.sort+'</div>');
			          }
			        },
			        error: function(){
			        	sortObj.html('<div class="load">网络错误！</div>');
			        }
			    });
			},


		}

	// 初始加载列表
	setTimeout(function(){
		init.getArea();
		init.getSort();
	}, 500);

	// 筛选框
	$('.choose-tab li').click(function(){

		var $t = $(this), index = $t.index(), box = $('.choose-box .choose-local').eq(index);

		if (box.css("display")=="none") {

			$t.addClass('active').siblings().removeClass('active');
			box.show().siblings().hide();dom.hide();

			if (index == 0) {areaScroll.refresh();}
			if (index == 1) {sortScroll.refresh();}
			// if (index == 2 && moreScroll == null) {chooseScroll("choose-more");}
			mask.show();

		}else{
			$t.removeClass('active');
			box.hide();mask.hide();
		}

	});


	// 工作地点一级
	$('#choose-area').delegate("li", "click", function(){

		var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();
		$('.tab-area').attr('data-par', id);

		if (index == 0) {
			var type = t.attr("data-id"), type = type == undefined ? "" : type;
	 		$(".choose-tab li").eq(index).attr("data-id", type);

			$('#area-box .choose-stage-l').removeClass('choose-stage-l-short');
			t.addClass('current').siblings().removeClass('active');
			t.closest('.choose-local').hide();
			$('#area-box .choose-stage-r').hide();
			$('.choose-tab li').eq(localIndex).removeClass('active').find('span').text("不限");
			mask.hide();
			getList(1);

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
			}else{
        $('.choose-tab li').eq(localIndex).removeClass('active').attr('data-id', id).find('span').text(t.text());
        t.closest('.choose-local').hide();
        mask.hide();
        getList(1);
      }
		}

	})


	// 职位类型一级
	$('#choose-sort').delegate("li", "click", function(){

		var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index(),
				lower = sortArr[id], html = [];

		$('.tab-type').attr('data-par', id);
		if (index == 0 || !lower) {
			var type = t.attr("data-id"), type = type == undefined ? "" : type;
	 		$(".tab-type").attr("data-id", type);

			var val = $(this).html();
			$(this).addClass('current').siblings().removeClass('current');
			$('#sort-box .choose-stage-l').removeClass('choose-stage-l-short').removeClass('choose-stage-th');
			$('#sort-box .choose-stage-c').removeClass('choose-stage-th');
			t.addClass('current').siblings().removeClass('active');
			t.closest('.choose-local').hide();
			$('#sort-box .choose-stage-c,#sort-box #choose-stage-th').hide();
			$('.choose-tab li').eq(localIndex).removeClass('active').find('span').text(val);
			mask.hide();
			getList(1);

		}else{

			t.siblings().removeClass('current');
			t.addClass('active').siblings().removeClass('active');
			$('#sort-box .choose-stage-l').addClass('choose-stage-l-short').removeClass('choose-stage-th');
			$('#sort-box .choose-stage-c').removeClass('choose-stage-th');
			$('#sort-box .choose-stage-c').show();
			$('#sort-box #choose-stage-th').hide();

      for(var i = 0; i < lower.length; i++){
        html.push('<li data-par="'+id+'" data-id="'+lower[i].id+'">'+lower[i].typename+'</li>');
      }
      $("#choose-sort-second").html('<ul>'+html.join("")+'</ul>');
      chooseScroll("choose-sort-second");
		}

	})

	// 职位类型二级
	$('#choose-sort-second').delegate("li", "click", function(){

		var t = $(this), index = t.index(), par = t.attr('data-par'), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();

		$(this).addClass('active').siblings().removeClass('active');
		$('#sort-box .choose-stage-l').addClass('choose-stage-th');
		$('#sort-box .choose-stage-c').addClass('choose-stage-th');
		$('#sort-box .choose-stage-th').show();


	})

	// 一级筛选  地址和排序
	$('#choose-area-second, #choose-sort-second').delegate("li", "click", function(){
		var $t = $(this), val = $(this).html(), local = $t.closest('.choose-local'), index = local.index(),
				type  = $t.attr("data-id"), type = type == undefined ? "" : type;

 		$(".choose-tab li").eq(index).attr("data-id", type);
		$t.addClass('on').siblings().removeClass('on');
		$('.choose-tab li').eq(index).removeClass('active').find('span').text(val);
		local.hide();mask.hide();
		getList(1);
	})


	// 更多
	$('#choose-more-second span').click(function(){
		var t =$(this), val = t.html(), ul = t.closest('gdList'), index = ul.index();
		t.addClass('active').siblings('span').removeClass('active');
		$('#choose-more span').eq(index).find('span').html(val);
		$('.more-box').hide();
	})

	$('.confirm').click(function(){
		$(this).closest('.choose-local').hide();
		mask.hide();
		$('.choose-tab li').removeClass('active');
		getList(1);
	})
	$('.rest').click(function(){
        var t =$(this);
        $('#choose-more .mainList span').removeClass('active');
    });

	// 遮罩层
	$('.mask').on('touchstart',function(){
		mask.hide();dom.hide();
		$('.choose-local').hide();
		$('.choose-tab li').removeClass('active');
	})

	// 下拉加载
	$(window).scroll(function() {
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w;
		if ($(window).scrollTop() >= scroll && !isload) {
			atpage++;
			getList();
		};
	});

	// 点击解锁
	// $('#maincontent').delegate('li .jiesuo', 'click',function(e){
	// 	$('.unlock').show();
	// 	$('.mask01').hide();
	// });


	//初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
		getList(1);
	}else {
		getData();
		setTimeout(function(){
			detailList.removeLocalStorage();
		}, 500)
	}

	//数据列表
	function getList(tr, search){

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


		$(".list .loading").remove();
		$(".list").append('<div class="loading">加载中...</div>');

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		// data.push("type="+$('#sptype').val());
		if(search){
			data.push("title="+search);
		}
		var addr = $(".tab-area").attr("data-id");
		addr = addr == undefined ? "" : addr;
		if(addr != ""){
			data.push("addr="+addr);
		}

		var jtype = $(".tab-type").attr("data-id");
		jtype = jtype == undefined ? "" : jtype;
		if(jtype != ""){
			data.push("jtype="+jtype);
		}

		var nature = $(".tab-nature").attr("data-id");
		nature = nature == undefined ? "" : nature;
		if(nature != ""){
			data.push("nature="+nature);
		}

    var scale = $(".tab-scale").attr("data-id");
    scale = scale == undefined ? "" : scale;
    if(scale != ""){
      data.push("scale="+scale);
    }

		$("#choose-more-second .gdList").each(function(){
			var t = $(this), type = t.attr("data-type"), val = t.find(".active").attr('data-id');
			if(val != undefined && val != ""){
				data.push(type+"="+val);
			}
		});

		data.push("page="+atpage);

		// var keywords = $('#search_keyword').val();
		// data.push("keywords="+keywords);

		$.ajax({
			url: "/include/ajax.php?service=job&action=resume",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".list .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								var is_jiesuo;
                                var is_buy = '', is_buy_htm='';
                                if(list[i].is_buy == 1){
                                	is_buy_htm = '<span class="label">已购买</span>';
                                    is_jiesuo = '';
                                	if(list[i].is_refuse == 1){
                                        is_buy_htm = '<span class="label">不合适</span>';
                                    }
								}else{
                                    is_jiesuo = '<div class="jiesuo fn-clear"><span></span><span class="jsbtn" data-id="'+list[i].id+'" data-name="'+list[i].name+'" data-types="'+list[i].type+'">解锁</span></div>';
								}
								html.push('<li>');
								html.push('<a href="'+list[i].url+'" data-url="'+list[i].url+'">');
								html.push('<div class="list-tit">');
								// 性别
								if (list[i].sex == 0) {
									html.push('<span class="name man">'+list[i].name+'</span>');
								}else {
									html.push('<span class="name woman">'+list[i].name+'</span>');
								}
								html.push(is_buy_htm);
								html.push('<p class="fn-right list-tit-tag">');
								html.push('<span class="area">'+list[i].addr[0]+'</span>');
								html.push('<span class="year">'+list[i].workyear+'年</span>');
								html.push('<span class="education">'+list[i].educational+'</span>');
								html.push('</p>');
								html.push('</div>');
								html.push('<div class="list-con fn-clear">');
								html.push('<div class="img-box fn-left"><img src="'+list[i].photo+'"></div>');
								html.push('<div class="img-txt fn-clear">');
                                html.push('</a>');
								html.push('<div class="zhiwei_main fn-clear"><h3>期望职位<span class="post">'+list[i].type+'</span></h3>');
								html.push(is_jiesuo);
                                html.push('</div>');
								html.push('<p class="now fn-clear">期望薪资<span>'+list[i].salary+'</span><span class="time">'+list[i].pubdate1+'</span></p>');
								html.push('</div>');
								html.push('</div>');

								html.push('</li>');
							}

							$("#maincontent").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".list").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".list").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".list .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".list .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".list .loading").html('网络错误，加载失败！');
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
		if (filter.jtype != '') {$('.tab-type').attr('data-id', filter.jtype);}
		if (filter.parJtype != '') {$('.tab-type').attr('data-par', filter.parJtype);}
		if (filter.jtypeName != '') {$('.tab-type span').text(filter.jtypeName);}

		if (filter.more) {$('#choose-more').html(filter.more);}

	}

	//解锁付积分
    $(".chongzhi").bind('click', function () {

        $.ajax({
            url : "/include/ajax.php?service=job&action=viewResume",
            data:{
                id : resume_id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
					if(!data.info.state){
	                    alert(data.info);
	                    window.location.href = window.location.href;
					}else{
						alert(data.info.info);
						setTimeout(function(){
							location.href = data.info.url;
						}, 1000);
					}
                }else{
                    alert(data.info);return;
                }
            }
        })
    });


    //搜索
    $(".search-btn").click(function () {
        var key = $(".txt_search").val();
        getList(1, key);
    })


})
