$(function(){

  function getSelectedText(){
      if (window.getSelection) {
          return window.getSelection().toString();
      } else if (document.selection) {
          return document.selection.createRange().text;
      }
      return '';
  }
  var aid = 0,p; //标识符;
  $('.main').delegate('.item .l', 'click', function(){
    var text=getSelectedText();
    if(text) return;
    aid = $(this).parent('.item').attr('data-id')
		$('.passmask').show();
    $('.popup-fabu .tit').html('修改一句话'+(type ? '求职' : '招聘')+'信息<s></s>');
    $('#tj').html('提交修改');
    $('.popup-fabu .edit').show();
    $('html').addClass('nos');
    $('.popup-fabu').show();
  });
//输入管理密码
var pass
$('.pass_send').bind('click',function(){
	 pass=$('#getpass').val();
	 if(pass==''){
	 	 $('.tip-pass').css('display','block');
	 	 return 0;
	 }else if(aid==0){
	 		return;
	 }else{
	 		$.ajax({
          url:'/include/ajax.php?service=job&action=checkPass',
          data:{
              pass : pass,
              id : aid,
          },
          type:'GET',
          dataType:'json',
          success:function (data) {
                if(data.state == 100 && data.info == 'success'){
                	  p=1;
                	  $('.passmask').hide(); //隐藏管理密码的输入框
									  $('#password').parents('dl').hide()
                    $.ajax({
                        url:'/include/ajax.php?service=job&action=getSentence',
                        data:{
                            id : aid,
                        },
                        type:'GET',
                        dataType:'json',
                        success:function (data) {
                            var data_info = data.info;
                            console.log(data_info)

						  $('#title').val(data_info.title);
						  $('#note').val(data_info.note);
						  $('#people').val(data_info.people);
						  $('#contact').val( data_info.contact);
						  $('#password').val(pass);
						  if(data_info.areaCode != '' && data_info.areaCode != '86'){
						  	$('#areaCode').val(data_info.areaCode);
						  	$('.areaCode i').text("+"+data_info.areaCode)
						  }else{
						  	$('.areaCode i').text("+86");
							$("#areaCode").val('86');
						  }
						  
														 
                        }
                    })

                 
                }else{
                  alert(data.info);return;
                }
          }
      })
	 }
})

  //发布
	$('.put').bind('click', function(){
    aid = 0;
    $('.passmask').hide();
    $('#password').parents('dl').show()
		$('.popup-fabu .tit').html('快速发布一句话'+(type ? '求职' : '招聘')+'<s></s>');
		$('#tj').html('立即发布');
		$('.popup-fabu .edit').hide();
		$('html').addClass('nos');
		$('.popup-fabu').show();
		$('.popup-fabu input[type=text], .popup-fabu textarea').val('');
		//区号重置
		
		var codeOld = $('.areaCode_wrap li:first-child').data('code');//区号恢复默认值
		$(".areaCode i").text("+"+codeOld);
		$('#areaCode').val(codeOld);
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
			if(aid !=0&&p!=1){
				$('.pass_send').click();
			}else{
				$('#tj').click();
			}
    }
  });
  //国际手机号获取
  getNationalPhone();
  function getNationalPhone(){
    $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'JSONP',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
                   }
                   $('.areaCode_wrap ul').append(phoneList.join(''));
                }else{
                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
                    }

        })
  }
  //显示区号
  $('.areaCode').bind('click', function(){
    var areaWrap =$(this).closest(".lr").find('.areaCode_wrap');
    if(areaWrap.is(':visible')){
      areaWrap.fadeOut(300)
    }else{
      areaWrap.fadeIn(300);
      return false;
    }
  });

  //选择区号
  $('.areaCode_wrap').delegate('li', 'click', function(){
    var t = $(this), code = t.attr('data-code');
    var par = t.closest(".lr");
    var areaIcode = par.find(".areaCode");
    areaIcode.find('i').html('+' + code);
    $('#areaCode').val(code);
  });

  $('body').bind('click', function(){
    $('.areaCode_wrap').fadeOut(300);
  });

	//提交
	$('#tj').bind('click', function(){
		var t = $(this);
		var title = $.trim($('#title').val()),
				note = $.trim($('#note').val()),
				manage = $('input[name=manage]:checked').val(),
				people = $.trim($('#people').val()),
				contact = $.trim($('#contact').val()),
				password = $.trim($('#password').val()),
				areaCode = $(".areaCode i").text().replace('+', '');

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
				url: masterDomain + '/include/ajax.php?service=job&action=delSentence&password=' + password + '&id=' + aid +'&flag=1',
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
					alert(langData['siteConfig'][20][183]);   //网络错误，请稍候重试！
					t.removeAttr('disabled');
				}
			});
			return false;
		}
		$.ajax({
			url: masterDomain + '/include/ajax.php?service=job&action='+action+'Sentence' +'&flag=1',
			data: {
				'id': aid,
				'type': type,
				'title': title,
				'note': note,
				'people': people,
				'contact': contact,
				'areaCode': areaCode,
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
