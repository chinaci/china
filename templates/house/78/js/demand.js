$(function(){

	//管理按钮
	$('.l-item').hover(function(){
		$(this).find('.f a').show();
	}, function(){
		$(this).find('.f a').hide();
	});

	//数量显示
	$('.statistics strong').html(totalCount);

	var aid = 0;
	$('#list').delegate('.manage', 'click', function(){
		var t = $(this), id = t.attr('data-id');

		if(t.hasClass('disabled')) return false;

		if(id && id != undefined){
			aid = id;

			t.addClass('disabled');

			//获取信息详细信息
			$.ajax({
				url: masterDomain + '/include/ajax.php?service=house&action=demandDetail&id=' + aid,
				dataType: "jsonp",
				success: function (data) {
					t.removeClass('disabled');
					if(data && data.state == 100){
						var info = data.info;

						$('#title').val(info.title);
						$('#note').val(info.note);
						$('input[name=act][value='+info.action+']').attr('checked', true);
						$('input[name=type][value='+info.type+']').attr('checked', true);
						$('.popup-fabu .addrBtn').attr('data-ids', info.addrIds.join(' ')).attr('data-id', info.addrid).html(info.addrName.join('/'));
						$('#person').val(info.person);
						$('#contact').val(info.contact);

						$('.popup-fabu .tit').html('修改求租求购信息<s></s>');
						$('#tj').html('提交修改');
						$('.popup-fabu .edit').show();
						$('html').addClass('nos');
						$('.popup-fabu').show();
					}else{
						alert(data.info);
					}
				},
				error: function(){
					t.removeClass('disabled');
					alert(langData['siteConfig'][20][183]);
				}
			});

		}
	});

	//发布
	$('#put').bind('click', function(){
		$('.popup-fabu .tit').html('快速发布求租求购<s></s>');
		$('#tj').html('立即发布');
		$('.popup-fabu .edit').hide();
		$('html').addClass('nos');
		$('.popup-fabu').show();
		$('.popup-fabu input[type=text], .popup-fabu textarea').val('');
		$('.addrBtn').attr('data-ids', '').attr('data-id', '').html('请选择');
	});

	//关闭
	$('.popup-fabu').delegate('.tit s', 'click', function(){
		$('html').removeClass('nos');
		$('.popup-fabu').hide();
	});

	//回车提交
  $('.popup-fabu input').keyup(function (e) {
    if (!e) {
      var e = window.event;
    }
    if (e.keyCode) {
      code = e.keyCode;
    }
    else if (e.which) {
      code = e.which;
    }
    if (code === 13) {
      $('#tj').click();
    }
  });

	//提交
	$('#tj').bind('click', function(){
		var t = $(this);
		var ids = $('.popup-fabu .addrBtn').attr('data-ids');
		var idsArr = ids.split(' ');
		var title = $.trim($('#title').val()),
				note = $.trim($('#note').val()),
				act = $('input[name=act]:checked').val(),
				type = $('input[name=type]:checked').val(),
				manage = $('input[name=manage]:checked').val(),
				cityid = idsArr[0],
				addr = idsArr[idsArr.length-1],
				person = $.trim($('#person').val()),
				contact = $.trim($('#contact').val()),
				password = $.trim($('#password').val());

		if(title == ''){
			alert('请输入标题！');
			return false;
		}

		if(note == ''){
			alert('请输入需求描述！');
			return false;
		}

		if(act == '' || act == 0 || act == undefined){
			alert('请选择类别！');
			return false;
		}

		if(type == '' || type == undefined){
			alert('请选择供求！');
			return false;
		}

		if(addr == '' || addr == 0){
			alert('请选择位置！');
			return false;
		}

		if(person == ''){
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
				url: masterDomain + '/include/ajax.php?service=house&action=del&type=demand&password=' + password + '&id=' + aid,
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
			url: masterDomain + '/include/ajax.php?service=house&action='+action+'&type=demand',
			data: {
				'id': aid,
				'title': title,
				'note': note,
				'category': type,
				'lei': act,
				'cityid': cityid,
				'addrid': addr,
				'person': person,
				'contact': contact,
				'password': password
			},
			type: "POST",
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

});
