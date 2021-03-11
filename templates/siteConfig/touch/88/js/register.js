$(function(){

	var regType = 'mobile';
	var djs = $('#regForm #djs');
	var dataGeetest = "";

	//倒计时（开始时间、结束时间、显示容器）
	var countDownReg = function(time, obj, func){
		$('#regForm .get-yzm').hide();
		$('#regForm .reget-yzm').show();
		obj.text(time);
		mtimer = setInterval(function(){
			obj.text((--time));
			if(time <= 0) {
				$('#regForm .get-yzm').removeClass("disabled");
				clearInterval(mtimer);
				obj.text('');
				$('#regForm .get-yzm').show();
				$('#regForm .reget-yzm').hide();
				// dsjinfo.hide();
			}
		}, 1000);
	}

	//发送验证码
	function sendVerCode(){
		var btn = $('#regForm .get-yzm');
		if(btn.hasClass("disabled")) return;

		var number   = $('#regForm .number').val();
		var password = $('#regForm .password').val();
		if (number == '') {
			alert('请输入手机号或者邮箱~');
			return false;
		}else{
			var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			var emReg  = !!number.match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
			if (!telReg && !emReg) {
				alert('请输入正确的手机号或者邮箱')
				return false;
			} else {

				var action = emReg ? "getEmailVerify" : "getPhoneVerify";
				var dataName = emReg ? "email" : "phone";

				btn.addClass("disabled");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=siteConfig&action="+action+"&type=signup",
					data: dataName+"="+number+dataGeetest,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {

						$("#maskReg, #popupReg-captcha-mobile").removeClass("show");

						//获取成功
						if(data && data.state == 100){
							countDownReg(60, djs);

						//获取失败
						}else{
							btn.removeClass("disabled");
							alert(data.info);
						}
					},
					error: function(){
						btn.removeClass("disabled");
						alert("网络错误，发送失败！");
					}
				});

			}
		}
	}

	if(geetest){

		//极验验证
		var handlerPopupReg = function (captchaObjReg) {
			captchaObjReg.appendTo("#popupReg-captcha-mobile");

			// 成功的回调
			captchaObjReg.onSuccess(function () {
				var validate = captchaObjReg.getValidate();
				dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;
				sendVerCode();
			});

			window.captchaObjReg = captchaObjReg;
		};

		//获取验证码
		$('#regForm .get-yzm').click(function(){
			var number   = $('#regForm .number').val();
			var password = $('#regForm .password').val();
			if (number == '') {
				alert('请输入手机号或者邮箱~');
				return false;
			}else{
				var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				var emReg  = !!number.match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
				if (!telReg && !emReg) {
					alert('请输入正确的手机号或者邮箱')
					return false;
				} else {
					if (captchaObjReg) {
				        captchaObjReg.refresh();
				    }
					$("#maskReg, #popupReg-captcha-mobile").addClass("show");
				}
			}
		});

		$("#maskReg").click(function () {
	        $("#maskReg, #popupReg-captcha-mobile").removeClass("show");
	    });


	    $.ajax({
	        url: masterDomain+"/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
	        type: "get",
	        dataType: "json",
	        success: function (data) {
	            initGeetest({
	                gt: data.gt,
	                challenge: data.challenge,
	                product: "popup",
	                offline: !data.success
	            }, handlerPopupReg);
	        }
	    });
	}


	if(!geetest){
		$('#regForm .get-yzm').click(function(){
			sendVerCode();
		});
	}

	// 密码可见不可见
	$('#regForm .psw_img').click(function(){
		if ($("#regForm .password").attr("type") == "password") {
			var $t = $(this);
			$t.addClass('show');
			$("#regForm .password").attr("type", "text");
		}else{
			$('#regForm .psw_img').removeClass('show');
			$("#regForm .password").attr("type", "password");
		}
	})


	$("#regForm").submit(function(event){
		event.preventDefault();
		$('#regForm .login-btn input').click();
	});

	$('#regForm .login-btn input').click(function(){
		var btn      = $(this);
		var number   = $('#regForm .number').val();
		var password = $('#regForm .password').val();
		var yzm      = $('#regForm .yzm').val();

		if(number == ''){
			alert('请输入手机号或者邮箱~');
			return false;
		}else{
			var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			var emReg  = !!number.match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
			if (!telReg && !emReg) {
				alert('请输入正确的手机号或者邮箱')
				return false;
			}
		}

		if(yzm == ''){
			alert('请输入验证码~');
			return false;
		}

		if(password == ''){
			alert('请输入密码~');
			return false;
		}


		btn.attr("disabled", true).val('注册中...');

		var mtype = 1;
		var data = [];
		data.push('mtype='+mtype);
		data.push('rtype='+(emReg ? 2 : 3));
		data.push('account='+number);
		data.push('password='+password);
		data.push('vcode='+yzm);

		//异步提交
		$.ajax({
			url: masterDomain+"/registerCheck_v1.html",
			data: data.join("&"),
			type: "POST",
			dataType: "html",
			success: function (data) {
				if(data){
					if(data.indexOf("100") > -1){
						$("body").append('<div style="display:none;">'+data+'</div>');
						top.location.href = userDomain;
					}else{
						var data = data.split("|");
						alert(data[1]);
						btn.removeAttr("disabled").val('注册');
					}
				}else{
					alert("注册失败，请重试！");
					btn.removeAttr("disabled").val('注册');
				}
			},
			error: function(){
				alert("网络错误，注册失败！");
				btn.removeAttr("disabled").val('注册');
			}
		});

	})

})
