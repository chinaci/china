$(function(){
	// 判断浏览器是否是ie8
    if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.hot_con ul li:nth-child(3n),.comlist li:nth-child(4n),.zhaoplist li:nth-child(3n),.jobFair li:nth-child(2n)').css('margin-right','0');
    }

	var lens = $(".NavList li").length;
    if(lens<=10){
        $(".moreList").hide();
    }else{
        $(".moreList").show();
    }

    $(".NavList").hover(function(){
        var t = $(this);

        t.find("li:not(.moreList)").show();
        t.find("li").each(function(){
            var index = $(this).index();
            if(index == 18){
                $(this).find(".sub-category").hide();
            }
        });
    });


    $(".NavList li").hover(function(){
		var t = $(this);
		if(!t.hasClass("active")){
			t.parent().find("li").removeClass("active");
			t.addClass("active");
		}
	}, function(){
		$(this).removeClass("active");
	});

	$(".more_list li").hover(function(){
		$(this).find('.sub-category').show();
	},function(){
		$(this).find('.sub-category').hide();
	});



	// 焦点图
    $(".slideBox1").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});


     // 房产资讯内容切换
    var slidebox2 = [],slidebox3 = [];
    $('.zcNews').delegate('.jtab_nav li', 'click', function(event) {
        var t = $(this),i = t.index();
        if(!t.hasClass('active')){
            t.addClass('active').siblings('li').removeClass('active');
            $('.jtab_con').eq(i).addClass('zcshow').siblings().removeClass('zcshow');
        }
        if(!slidebox2[i]){
            console.log(!slidebox2[i])
            slidebox2[i] = $('.slideBox2:eq('+i+')').slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
        }
        if(!slidebox3[i]){
          slidebox3[i] = $('.slideBox3:eq('+i+')').slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
        }
    });
    $('.slideBox2').each(function(index){
	    var t = $(this), ul = t.find('.bd ul');
	    var swiperNav = [], mainNavLi = ul.find('li');
	    for (var i = 0; i < mainNavLi.length; i++) {
	       swiperNav.push(ul.find('li:eq('+i+')').html());
	    }
	    var liArr = [];
	    for(var i = 0; i < swiperNav.length; i++){
	       liArr.push(swiperNav.slice(i, i+1).join(""));
	    }

	    ul.html('<li>'+liArr.join('</li><li>')+'</li>');
	    if(index == 0){
	       slidebox2[index] = t.slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
	    }

    });

    $('.slideBox3').each(function(index){
      var t = $(this), ul = t.find('.bd ul');
      var swiperNav = [], mainNavLi = ul.find('li');
      for (var i = 0; i < mainNavLi.length; i++) {
        swiperNav.push(ul.find('li:eq('+i+')').html());
      }
      var liArr = [];
      for(var i = 0; i < swiperNav.length; i++){
        liArr.push(swiperNav.slice(i, i + 1).join(""));
      }
      ul.html('<li>'+liArr.join('</li><li>')+'</li>');

      if(index == 0){
        slidebox3[index] = t.slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});
      }
    });


	// 推荐职位tab
	$('.hot_tab li').click(function(){
		var t = $(this),index = t.index();
		if(!t.hasClass('active')){
			t.addClass('active').siblings().removeClass('active');
			$('.hot_con').eq(index).removeClass('fn-hide').siblings('.hot_con').addClass('fn-hide');
		}
	})



	// 一句话求职&&招聘
	var aid = 0,type = '';
  $('.zhaoplist').delegate('.btnPut', 'click', function(){
    var t = $(this),par = t.closest('li'),obj = par.closest('ul'),
        title = par.find('.ptit span').text(),
        note = par.find('.ptxt').text(),
        people = par.find('.zpname').text(),
        contact = par.find('.zptel').data('tel'),
        code = par.find('.zptel').data('code');


    aid = par.attr('data-id');
    if(obj.hasClass('zhaopin')){
    	type = 0;
    }else{
    	type = 1;
    }

    $('#title').val(title);
    $('#note').val(note);
    $('#people').val(people);
    $('#contact').val(contact);
    
    $('.popup-fabu .tit').html('修改一句话'+(type ? '求职' : '招聘')+'信息<s></s>');
    $('#tj').html('提交修改');
    $('.popup-fabu .edit').show();
    $('html').addClass('nos');
    $('.popup-fabu').show();
    if(code != '' && code != '86'){
	  	$('#areaCode').val(code);
	  	$('.areaCode i').text("+"+code)
	  }else{
	  	$('.areaCode i').text("+86");
		$("#areaCode").val('86');
	  }
  });

  	//发布
	$('.btnPut').bind('click', function(){
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
  	console.log(333)
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
				areaCode = $.trim($('#areaCode').val()),
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
					alert(langData['siteConfig'][20][183]);
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

})
