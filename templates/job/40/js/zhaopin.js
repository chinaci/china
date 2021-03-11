$(function(){

	//二维码
	$(".job-list").delegate(".ctag", "mouseover", function(){
		var t = $(this), url = t.data("url"), obj = t.find(".ewmbox");
		if(obj.html() == ""){
			obj.qrcode({
				render: window.applicationCache ? "canvas" : "table",
				width: 100,
				height: 100,
				text: url
			});
		}
	});


	// 点击职位
	$('.job-item').click(function(e){
		var i = $(this);
		if(i.hasClass('curr')) {
			i.find('.duties').stop().animate({
				'height' : 42 + 'px'
			},300,function(){
				i.removeClass('curr');
			});
		} else {
			i.addClass('curr');
			var h = i.find('.des').height();
			i.find('.duties').stop().animate({'height' : h + 'px'},300);
		}
	});

	$('.job-item a ,.job-item label').click(function(e){
		e.stopPropagation();
	});

	// 选中职位
	$('.job-check').click(function(){
		var c = $(this);
		var o = c.hasClass('checka') ? $('.job-check') : c;

		if(c.is(':checked')) {
			o.attr('checked' , true).parent('.cklab').addClass('selected');
		} else {
			o.attr('checked' , false).parent('.cklab').removeClass('selected');
		}
	});

	// 搜索
	$('.search form').submit(function(e){
		e.preventDefault();
		var s = $('#search_v').val().replace("请输入职位名称或公司名称", "");
		var url = $(".search form").attr("action");
		location.href = url.replace("%title%", s);
	});

	//关键词模糊搜索
	$('#search_v').autocomplete({
    serviceUrl: '/include/ajax.php?service=job&action=post',
    paramName: 'title',
    dataType: 'jsonp',
    transformResult: function(data){
    	var arr = [];
    	arr['suggestions'] = [];
    	if(data && data.state == 100){
    		var list = data.info.list;
    		for(var i = 0; i < list.length; i++){
    			arr['suggestions'][i] = list[i].title;
    		}
    	}
    	return arr;
    },
    lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
        var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
        return re.test(suggestion.value);
    }
  });

  $('.job-list .yp').bind('click', function(){
	 var t = $(this), par = t.closest('.job-item');

	 $('.job-list').find('.cklab').removeClass('selected');
	 $('.job-list').find('.job-check').attr('checked', false);

	 par.find('.cklab').addClass('selected');
	 par.find('.job-check').attr('checked', true);
  });

	// 应聘、收藏
	$('.yp , .sc').click(function(){

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		var a = $(this), con;
		if(a.hasClass("disabled")) return false;
		var dotp = a.hasClass('yp') ? 'yp' : 'sc';
		var ids = [];

		$(".job-list .job-item").each(function(){
			var th = $(this), check = th.find(".job-check"), id = th.data("id");
			if(check.is(":checked")){
				ids.push(id);
			}
		});

		if(ids.length == 0){
			$.dialog.tips("您还没有选择任何职位！", 3, 'error.png');
			return false;
		}

		con = dotp == 'yp' ? '简历已成功投出去了，请静候佳音！' : '职位收藏成功';

		var url = dotp == "yp" ? masterDomain + "/include/ajax.php?service=job&action=delivery&id="+ids.join(",") : masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=job&type=add&id="+ids.join(",");

		a.addClass("disabled");

		$.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        a.removeClass("disabled");
        if(data.state == 100){
			if(data.info.url!=undefined && data.info.url!=null){
				$.dialog.tips(data.info.info, 3, 'alert.png');
				setTimeout(function(){
					location.href = data.info.url;
				}, 2000);
				return false;
			}
			$.dialog.tips(con, 3, 'success.png');
        }else{
			$.dialog.tips(data.info, 3, 'error.png');
        }
      },
      error: function(){
        a.removeClass("disabled");
				$.dialog.tips('网络错误，操作失败！', 3, 'error.png');
      }
    });




	});

})
