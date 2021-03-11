$(function(){

	//头像
	var photo = $(".photo");
	photo.hover(function(){
		$(this).removeClass("hover").addClass("hover");
	}, function(){
		$(this).removeClass("hover");
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
                   var listLen = list.length;
                   var codeArea = list[0].code;
                   if(listLen == 1 && codeArea == 86){//当数据只有一条 并且这条数据是大陆地区86的时候 隐藏区号选择
                        $('.areaCode').hide();
                        $('.w-form .inp#phone').css({'padding-left':'10px','width':'175px'});
                        return false;
                   }
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
    $('.areaCode').bind('click', function(e){
      console.log('codeclick')
        e.stopPropagation();
        var areaWrap =$(this).closest("dd").find('.areaCode_wrap');
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
        var par = t.closest("dd");
        var areaIcode = par.find(".areaCode");
        areaIcode.find('i').html('+' + code);
        $('#areaCode').val(code);
    });

    $('body').bind('click', function(){
        $('.areaCode_wrap').fadeOut(300);
    });

	//上传图片
  function mysub(){

    var data = [];
    data['mod']  = "job";
    data['type'] = "photo";

    var fileId = photo.find("input[type=file]").attr("id");
		photo.find(".loading").show();
		photo.removeClass("hover");

    $.ajaxFileUpload({
      url: "/include/upload.inc.php",
      fileElementId: fileId,
      dataType: "json",
      data: data,
      success: function(m, l) {
        if (m.state == "SUCCESS") {

        	$(".holder").html("<s></s>"+langData['siteConfig'][6][59]);   //重新上传
					photo.find("img").attr("src", huoniao.changeFileSize(m.turl, "middle"));
					$("#litpic").val(m.url);
          photo.find(".loading").hide();

        } else {
          alert(langData['siteConfig'][20][306]);   //上传失败
        }
      },
      error: function() {
				alert(langData['siteConfig'][20][531]);  //网络错误，上传失败！
      }
    });

  }

  $(".Filedata").bind("change", function(){
    if ($(this).val() == '') return;
    mysub();
  });


	//时间
	var selectDate = function(el){
		WdatePicker({
			el: el,
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			qsEnabled: false,
			dateFmt: 'yyyy-MM-dd'
		});
	}

	$("#birth").click(function(){
		selectDate("birth");
	});

	$("#graduation").click(function(){
		selectDate("graduation");
	});

	$("#experience").delegate(".date1, .date2", "click", function(){
		selectDate($(this).attr("id"));
	});


  //选择区域
	$("#selAddr").delegate("a", "click", function(){
		if($(this).text() != langData['siteConfig'][22][96] && $(this).attr("data-id") != $("#addr").val()){   //不限
			var id = $(this).attr("data-id");
			$(this).closest(".sel-group").nextAll(".sel-group").remove();
			getChildAddr(id);
		}
	});

	//获取子级区域
	function getChildAddr(id){
		if(!id) return;
		$.ajax({
			url: "/include/ajax.php?service=job&action=addr&type="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					var list = data.info, html = [];

					html.push('<div class="sel-group">');
					html.push('<button type="button" class="sel">'+langData['siteConfig'][22][96]+'<span class="caret"></span></button>');   //不限
					html.push('<ul class="sel-menu">');
					html.push('<li><a href="javascript:;" data-id="'+id+'">'+langData['siteConfig'][22][96]+'</a></li>');    //不限
					for(var i = 0; i < list.length; i++){
						html.push('<li><a href="javascript:;" data-id="'+list[i].id+'">'+list[i].typename+'</a></li>');
					}
					html.push('</ul>');
					html.push('</div>');

					$("#addr").before(html.join(""));

				}
			}
		});
	}



	var dataInfo;
	var zhinengArr = [];

	//选择职位类型 s
	$("#typename").bind("click", function(){
		var content = [];

		if(zhinengArr.length > 0){
			content.push(createZhineng());
		}else{
			content.push('<p class="loadzhineng" align="center">'+langData['siteConfig'][20][184]+'...</p>');   //加载中，请稍后
		}

		dataInfo = $.dialog({
			id: "dataInfo",
			fixed: false,
			title: langData['siteConfig'][23][111],   //选择职位类型
			content: '<div class="selectType">'+content.join("")+'</div>',
			width: 800,
			height: 450,
			cancel: true
		});

		if(zhinengArr.length <= 0){
			$.ajax({
				url: "/include/ajax.php?service=job&action=type&son=1",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						zhinengArr = data.info;
						$(".selectType").html(createZhineng());

					}else{
						$(".selectType").html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					$(".selectType").html('<p align="center"><font size="3" color="#ff0000">'+langData['siteConfig'][20][532]+'</font></p>');   //加载失败，请稍后访问！
				}
			});
		}

	});

	//创建职能HTML
	function createZhineng(){
		var content = [];
		var data = zhinengArr;
		var url = $("#typename").data("url");
		for(var a = 0; a < data.length; a++){
			content.push('<dl>');
			content.push('<dt><span>'+data[a].typename+'</span><s></s></dt>');
			content.push('<dd class="fn-clear">');

			if(data[a].lower.length > 0){
				var lower1 = data[a].lower;
				var subdata = [], f = 0;

				for(var b = 0; b < lower1.length; b++){
					content.push('<div class="sub-data" data-id="'+b+'" title="'+lower1[b].typename+'"><a href="javascript:;">'+lower1[b].typename+'</a><i></i></div>');
					lower2 = lower1[b].lower;

					subdata.push('<ul class="fn-clear zn'+b+'">');
					for(var c = 0; c < lower2.length; c++){
						subdata.push('<li><a href="javascript:;" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
					}
					subdata.push('</ul>');

					f++;

					if(f == 3 || b == lower1.length-1){
						content.push(subdata.join(""));
						subdata = [];
						f = 0;
					}

				}

			}

			content.push('</dd>');
			content.push('</dl>');
		}

		return content.join("");
	}

	//TAB切换
	$("body").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id"), par = t.closest("dd");
		if(t.hasClass("curr")){
			t.removeClass("curr");
			$(".selectType .sub-data").removeClass("curr");
			$(".selectType ul").stop().slideUp("fast");
		}else{
			$(".selectType .sub-data").removeClass("curr");
			$(".selectType ul").stop().slideUp("fast");

			t.addClass("curr");
			par.find(".zn"+id).stop().slideDown("fast");
		}
	});

	//选择标签
	$("body").delegate(".selectType li a", 'click', function(){
		var t = $(this), id = t.attr("data-id"), name = t.attr("data-name");
		$("#typename")
			.attr("data-id", id)
			.attr("title", name)
			.html(name+'<span class="caret"></span>');
		$("#type").val(id);
		dataInfo.close();
	});

	//选择职位类型 e


	/* 工作经历 */
	var experienceHtml = '<div class="item"><div class="con"><div class="fn-clear"><dl class="fn-clear"><dt>'+langData['siteConfig'][19][354]+'：</dt><dd><input type="text"class="inp company"/></dd></dl><dl class="fn-clear"><dt>'+langData['siteConfig'][19][138]+'：</dt><dd><input type="text"class="inp date1"id="date11"/><em class="fn-left">&nbsp;-&nbsp;</em><input type="text"class="inp date2"id="date22"/></dd></dl></div><div class="fn-clear"><dl class="fn-clear"><dt>'+langData['siteConfig'][19][139]+'：</dt><dd><input type="text"class="inp bumen"/></dd></dl><dl class="fn-clear"><dt>'+langData['siteConfig'][19][140]+'：</dt><dd><input type="text"class="inp zhiwei"/></dd></dl></div><div class="fn-clear"><dl class="single fn-clear"><dt>'+langData['siteConfig'][19][141]+'：</dt><dd><textarea class="inp neirong"></textarea></dd></dl></div></div><div class="col"></div><span class="btn move"title="'+langData['siteConfig'][6][19]+'"><i></i></span><span class="btn del"title="'+langData['siteConfig'][6][8]+'"><i></i></span><span class="btn add"title="'+langData['siteConfig'][6][18]+'"><i></i></span></div>';
//公司名称--工作时间---所在部门---担任职位--移动--删除--添加
	$(".newbtn").bind("click", function(){
		var date1 = new Date().getTime();
		var date2 = new Date().getTime() + 1;
		var html = experienceHtml.replace("date11", date1).replace("date22", date2);
		var newexperience = $(html);
		newexperience.appendTo("#experience");
		newexperience.slideDown(300);
	});
	$("#experience").delegate(".add", "click", function(){
		var t = $(this).closest(".item");
		var date1 = new Date().getTime();
		var date2 = new Date().getTime() + 1;
		var html = experienceHtml.replace("date11", date1).replace("date22", date2);
		var newexperience = $(html);
		newexperience.insertAfter(t);
		newexperience.slideDown(300);
	});

	//删除工作经历
	$("#experience").delegate(".del", "click", function(){
		var t = $(this).closest(".item");
		$.dialog.confirm(langData['siteConfig'][20][211], function(){    //确认要删除吗？
			t.slideUp(300, function(){
				t.remove();
			});
		});
	});

	$("#experience").dragsort({ dragSelector: ".move", placeHolderTemplate: '<div class="drag-item"></div>' });

	//错误提示
	var errmsgtime;
	function errmsg(div,str){
		$('#errmsg').remove();
		clearTimeout(errmsgtime);
		var top = div.offset().top - 33;
		var left = div.offset().left;
		$('html, body').animate({scrollTop:top}, 300);

		var msgbox = '<div id="errmsg" style="position:absolute;top:' + top + 'px;left:' + left + 'px;padding:0 10px;height:30px;line-height:30px;text-align:center;color:#f00;font-size:14px;display:none;z-index:99999;background:#ff0;">' + str + '</div>';
		$('body').append(msgbox);
		$('#errmsg').fadeIn(300);
		errmsgtime = setTimeout(function(){
			$('#errmsg').fadeOut(500, function(){
				$('#errmsg').remove();
			});
		},3000);
	};


	//提交
	$("#submit").bind("click", function(event){
		event.preventDefault();

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		var t = $(this);

		if(t.hasClass("disabled")) return false;
		$('#addr').val($('#selAddr .addrBtn').attr('data-id'));

		var name    = $("#name"),
				birth   = $("#birth"),
				home    = $("#home"),
				address = $("#address"),
				phone   = $("#phone"),
				email   = $("#email"),
				addr    = $("#addr"),
				type    = $("#type"),
				salary  = $("#salary"),
				startwork = $("#startwork"),
				workyear  = $("#workyear"),
				educational = $("#educational");

		var cityid = 0, cityids = $('#selAddr .addrBtn').attr('data-ids');
		if(cityids){
			var cityidArr = cityids.split(' ');
			cityid = cityidArr[0];
		}

		if($.trim(name.val()) == ""){
			errmsg(name, langData['siteConfig'][20][533]);   //请输入您的姓名！
			return false;
		}

		if($.trim(birth.val()) == ""){
			errmsg(birth, langData['siteConfig'][20][283]);   //请选择您的出生日期！
			return false;
		}

		if($.trim(home.val()) == ""){
			errmsg(home, langData['siteConfig'][20][534]);   //请输入您的户籍地址
			return false;
		}

		if($.trim(address.val()) == ""){
			errmsg(address, langData['siteConfig'][20][535]);  //请输入您的现居地址
			return false;
		}

		if($.trim(phone.val()) == ""){
			errmsg(phone, langData['siteConfig'][20][536]);  //请输入您的联系电话
			return false;
		}else{
			// var exp = new RegExp("^1[34578]{1}[0-9]{9}$", "img");
			// if(!exp.test(phone.val())){
			// 	errmsg(phone, "请输入正确的手机号码！");
			// 	return false;
			// }
		}

		if($.trim(email.val()) != ""){
			if(!/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(email.val())){
				errmsg(email, langData['siteConfig'][21][57]);  //请输入正确的邮箱地址！
				return false;
			}
		}

		if(addr.val() == "" || addr.val() == 0){
			errmsg(addr.closest("dd"), langData['siteConfig'][20][284]);  //请选择您的意向工作地点
			return false;
		}

		if(type.val() == "" || type.val() == 0){
			errmsg(type.closest("dd"), langData['siteConfig'][20][285]);  //请选择您的意向职位
			return false;
		}

		if(salary.val() == ""){
			errmsg(salary.closest("dd"), langData['siteConfig'][20][286]);  //请输入您的期望薪资
			return false;
		}

		if(startwork.val() == "" || startwork.val() == 0){
			errmsg(startwork.closest("dd"), langData['siteConfig'][20][287]);//请选择到岗时间
			return false;
		}

		if(workyear.val() == ""){
			errmsg(workyear.closest("dd"), langData['siteConfig'][20][288]);//请输入您的工作年限
			return false;
		}

		if(educational.val() == "" || educational.val() == 0){
			errmsg(educational.closest("dd"), langData['siteConfig'][20][289]);//请选择您的最高学历
			return false;
		}

		var experience = [];
		$("#experience").find(".item").each(function(){
			var t = $(this), company = $.trim(t.find(".company").val()), date1 = t.find(".date1").val(), date2 = t.find(".date2").val(), bumen = $.trim(t.find(".bumen").val()), zhiwei = $.trim(t.find(".zhiwei").val()), neirong = $.trim(t.find(".neirong").val());
			if(company != ""){
				experience.push(company+"$$"+date1+"$$"+date2+"$$"+bumen+"$$"+zhiwei+"$$"+neirong);
			}
		});

		t.addClass("disabled").html(langData['siteConfig'][7][9]+"...");     //保存中

		var url = t.closest("form").attr("action"), data = t.closest("form").serialize() + "&experience=" + experience.join("|||||");

		$.ajax({
			url: url,
			data: data + '&cityid=' + cityid,
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled").html(langData['siteConfig'][6][75]);//保存简历
				if(data.state == 100){

					$.dialog.tips(data.info, 3, 'success.png');  //保存成功


				}else{
					$.dialog.tips(data.info, 3, 'error.png');
				}
			},
			error: function(){
				t.removeClass("disabled").html(langData['siteConfig'][6][75]);   //保存简历
				$.dialog.tips(langData['siteConfig'][20][253], 3, 'error.png');  //网络错误，保存失败！
			}
		});

	});

});
