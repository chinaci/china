$(function(){

  var aid = 0;
  $('.main').delegate('.item', 'click', function(){
    var t = $(this),
        title = t.find('h5').text(),
        note = t.find('.l p').text(),
        people = t.find('.r em').text(),
        contact = t.find('.tel').text();

    aid = t.attr('data-id');

    $('#title').val(title);
    $('#note').val(note);
    $('#people').val(people);
    $('#contact').val(contact);

    $('.popup-fabu .tit').html('修改一句话'+(type ? '求职' : '招聘')+'信息<s></s>');
    $('#tj').html('提交修改');
    $('.popup-fabu .edit').show();
    $('html').addClass('nos');
    $('.popup-fabu').show();
  });

  //发布
	$('.put').bind('click', function(){
    aid = 0;
		$('.popup-fabu .tit').html('快速发布一句话'+(type ? '求职' : '招聘')+'<s></s>');
		$('#tj').html('立即发布');
		$('.popup-fabu .edit').hide();
		$('html').addClass('nos');
		$('.popup-fabu').show();
		$('.popup-fabu input[type=text], .popup-fabu textarea').val('');
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
		var title = $.trim($('#title').val()),
				note = $.trim($('#note').val()),
				manage = $('input[name=manage]:checked').val(),
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
