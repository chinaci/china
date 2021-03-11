$(function(){

	//大图幻灯
	$("#slide").cycle({
		next : '#next',
		prev : '#prev'
	});

	//区域
	$("#addr1").change(function(){
		var sel = $(this), id = sel.val();
		if(id != 0 && id != ""){
			$.ajax({
				type: "GET",
				url: masterDomain+"/include/ajax.php",
				data: "service=renovation&action=addr&son=0&type="+id,
				dataType: "jsonp",
				success: function(data){
					var i = 0, opt = [];
					if(data instanceof Object && data.state == 100){
						for(var key = 0; key < data.info.length; key++){
							opt.push('<option value="'+data.info[key]['id']+'">'+data.info[key]['typename']+'</option>');
						}
						$("#addr2").html('<option value="">街道</option>'+opt.join("")+'</select>');
					}else{
						$("#addr2").html('<option value="">街道</option>');
					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}else{
			$("#addr2").html('<option value="">街道</option>');
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
    var areaWrap =$(this).closest(".sqfwForm").find('.areaCode_wrap');
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
    var par = t.closest(".sqfwForm");
    var areaIcode = par.find(".areaCode");
    areaIcode.find('i').html('+' + code);
    $('#areaCode').val(code);
  });

  $('body').bind('click', function(){
    $('.areaCode_wrap').fadeOut(300);
  });


	$('.sqfwForm').submit(function(event){
		event.preventDefault();
		var f = $(this);
		f.find('.has-error').removeClass('has-error');
		var str = '',r = true;
		var btn = f.find(".submit");

		if(btn.hasClass("disabled")) return false;

		// 称呼
		var name = f.find('.username');
		var namev = $.trim(name.val());
		if(namev == '') {
			name.focus().addClass('has-error');
			errmsg(name, '请填写您的称呼');
			r = false;
		}

		// 手机号
		var phone = f.find('.userphone');
		var phonev = $.trim(phone.val());
		if(phonev == '') {
			phone.addClass('has-error');
			if (r) {
				phone.focus();
				errmsg(phone, '请输入手机号码');
			}
			r = false;
		} else {
			// var telReg = !!phonev.match(/^(13|14|15|17|18)[0-9]{9}$/);
			// if(!telReg){
			//     phone.addClass('has-error');
			//     if (r) {
			//     	phone.focus();
			//     	errmsg(phone,'请输入正确手机号码');
			//     }
			//     r = false;
			// }
		}

		// 区域
		var addr = 0;
		var addr1 = $('#addr1');
		if(addr1.val() == 0 || addr1.val() == "") {
			addr1.addClass('has-error');
			if (r) {
				errmsg(addr1, '请选择区域');
			}
			r = false;
		}
		addr = addr1.val();

		// 街道
		var addr2 = $('#addr2');
		if(addr2.size() > 0){
			if(addr2.val() == 0 || addr2.val() == "") {
				addr2.addClass('has-error');
				if (r) {
					errmsg(addr2, '请选择街道');
				}
				r = false;
			}
			addr = addr2.val();
		}

		if(!r) {
			return false;
		}

		btn.addClass("disabled").val("申请中...");
		// 称呼
		var areaCode = f.find('#areaCode');
		var areaCodev = $.trim(areaCode.val());

		var data = [];
		data.push("people="+namev);
		data.push("contact="+phonev);
		data.push("areaCode="+areaCodev);
		data.push("addrid="+addr);
		data.push("body="+$("#note").val());

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=sendEntrust",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				btn.removeClass("disabled").val("立即申请");
				if(data && data.state == 100){
					alert("申请成功，工作人员收到您的信息后会第一时间与你联系，请保持您的手机畅通！");
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert("网络错误，请重试！");
				btn.removeClass("disabled").val("申请中...");
			}
		});

		return false;

	});


	scrollTopFn(6, ".scrolldiv li");
	function scrollTopFn(num,selc) {
		var curNum = $(selc).length;
		if(curNum > num) {
			var SD=24,
				myScroll,
				tardiv = document.getElementById('scrolldiv'),
				tardiv1 = document.getElementById('scroll1'),
				tardiv2 = document.getElementById('scroll2');

			tardiv2.innerHTML=tardiv1.innerHTML;
			function Marquee2(){
				if(tardiv2.offsetTop-tardiv.scrollTop<=0)
					tardiv.scrollTop-=tardiv1.offsetHeight;
				else{
					tardiv.scrollTop++;
				}
			}
			myScroll=window.setInterval(Marquee2,24); ;
			tardiv.onmouseover=function() {clearInterval(myScroll)};
			tardiv.onmouseout=function() {myScroll=setInterval(Marquee2,SD)};
		}
	}

});
