$(function() {

	var device = navigator.userAgent, isClick = true;
	$('.job-list').css('min-height', $(window).height() - $('.footer').height());

	// 下拉加载
	$(document).ready(function() {
		$(window).scroll(function() {
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - w;
			if ($(window).scrollTop() > scroll - 100 && !isload) {
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
			$(".job-list").html("");
		}

		$(".job-list .loading").remove();
		$(".job-list").append('<div class="loading">加载中...</div>');

		//请求数据
		var data = [];
		data.push("type="+type);
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		$.ajax({
			url: "/include/ajax.php?service=job&action=sentence",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".job-list .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								html.push('<div class="dlist" data-id="'+list[i].id+'">');
								html.push('<div class="tit">'+list[i].title+'</div>');
								html.push('<p>'+list[i].note+'</p>');
								html.push('<div class="b">');
								html.push('<div class="fn-clear">发布人：<em>'+list[i].people+'</em>&nbsp;&nbsp;&nbsp;&nbsp;'+list[i].pubdate+'<a href="tel:'+list[i].contact+'" class="tel">'+list[i].contact+'</a></div>');
								html.push('</div>');
								html.push('</div>');
							}

							$(".job-list").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".job-list").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".job-list").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".job-list .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".job-list .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".job-list .loading").html('网络错误，加载失败！');
			}
		});
	}


	var aid = 0;
	$('.job-list').delegate('.dlist .tit, .dlist p', 'click', function(){
		var t = $(this).closest('.dlist'), id = t.attr('data-id');

		$('.facility li').removeClass('on');
		$('.facility li:eq(0)').addClass('on');

		if(id && id != undefined){
			aid = id;
			var title = t.find('.tit').text(),
					note = t.find('p').text(),
					people = t.find('em').text(),
					contact = t.find('.tel').text();

			$('#title').val(title);
			$('#note').val(note);
			$('#people').val(people);
			$('#contact').val(contact);

			$('.popup-fabu .tit').html('修改一句话'+(type ? '求职' : '招聘')+'信息<s></s>');
			$('#submit').html('提交修改');
			$('.popup-fabu .edit').show();
			$('.sentence').hide();
			$('.gz-address').show();
			$('html').addClass('nos');

		}
	});

	//发布
	$('.fabusentence').bind('click', function(){
		aid = 0;
		$('.popup-fabu .tit').html('快速一句话'+(type ? '求职' : '招聘')+'信息<s></s>');
		$('#submit').html('立即发布');
		$('.popup-fabu .edit').hide();
		$('.sentence').hide();
		$('.gz-address').show();
		$('html').addClass('nos');
		$('.popup-fabu input[type=text], .popup-fabu textarea').val('');
	});

    if(location.hash == '#fabu'){
        $('.fabusentence').click();
    }

	//关闭
	$('.popup-fabu').delegate('.tit s', 'click', function(){
		$('html').removeClass('nos');
		$('.sentence').show();
		$('.gz-address').hide();
	});


	// 选择特色
  $('.facility li').click(function(){
    var t = $(this);
    if (!t.hasClass('on')) {
      $(this).addClass('on').siblings('li').removeClass('on');
    }
  })

	//提交
	$('#submit').bind('click', function(){
		var t = $(this);
		var title = $.trim($('#title').val()),
				note = $.trim($('#note').val()),
				manage = $('.facility[data-type=manage] .on').data('id'),
				people = $.trim($('#people').val()),
				contact = $.trim($('#contact').val()),
				password = $.trim($('#password').val());

		if(title == ''){
			alert('请输入职位名称！');
			return false;
		}

		if(note == ''){
			alert('请输入需求描述！');
			return false;
		}

		if(people == ''){
			alert('请输入联系人！');
			return false;
		}

		if(contact == ''){
			alert('请输入联系电话！');
			return false;
		}

		if(password == ''){
			alert('请输入管理密码！');
			return false;
		}

		t.attr('disabled', true);

		var action = aid ? 'edit' : 'put';

		//删除
		if(manage == '2'){
			$.ajax({
				url: masterDomain + '/include/ajax.php?service=job&action=delSentence&password=' + password + '&id=' + aid,
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						alert('删除成功！');
						location.reload();
					}else{
						alert(data.info);
						t.removeAttr('disabled');
					}
				},
				error: function(){
					alert(langData['siteConfig'][20][183]);
					t.removeAttr('disabled');
				}
			});
			return false;
		}

		$.ajax({
			url: masterDomain + '/include/ajax.php?service=job&action='+action+'Sentence',
			data: {
				'id': aid,
				'type': type,
				'title': title,
				'note': note,
				'people': people,
				'contact': contact,
				'password': password
			},
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){

					var info = data.info.split('|');
					if(info[1] == 1){
						alert(aid ? '修改成功' : '发布成功！');
					}else{
						alert(aid ? '提交成功，请等待管理员审核！' : '发布成功，请等待管理员审核！');
					}
					location.reload();

				}else{
					alert(data.info);
					t.removeAttr('disabled');
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][183]);
				t.removeAttr('disabled');
			}
		});

	});

})
