$(function(){

	var djs = $('#fpwdForm #djs');
	var dataGeetest = "";

	// 切换
	$('.fpwdtab li').click(function(){
		var t = $(this), index = $(this).index();
		t.addClass('curr').siblings('li').removeClass('curr');
		$('#fpwdForm .form-box-item').eq(index).removeClass('dn').siblings('#fpwdForm .form-box-item').addClass('dn');
	})


	//倒计时（开始时间、结束时间、显示容器）
	var countDownFpwd = function(time, obj, func){
		$('#fpwdForm .get-yzm').hide();
		$('#fpwdForm .reget-yzm').show();
		obj.text(time);
		mtimer = setInterval(function(){
			obj.text((--time));
			if(time <= 0) {
				$('#fpwdForm .form-get-phone .get-yzm').removeClass("disabled");
				clearInterval(mtimer);
				obj.text('');
				$('#fpwdForm .get-yzm').show();
				$('#fpwdForm .reget-yzm').hide();
				// dsjinfo.hide();
			}
		}, 1000);
	}


	//发送手机验证码
	function sendPhoneVerCode(){

		var btn = $('#fpwdForm .form-get-phone .get-yzm');
		if(btn.hasClass("disabled")) return;

		var vericode = $("#fpwdForm .vericode").val();
		if(vericode == '' && !geetest){
			alert('请输入图形验证码');
			return false;
		}

		var number   = $('#fpwdForm .form-get-phone .number').val();

		btn.addClass("disabled");

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=fpwd",
			data: "vericode="+vericode+"&phone="+number+dataGeetest,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {

				$("#maskFpwd, #popupFpwd-captcha-mobile").removeClass("show");

				//获取成功
				if(data && data.state == 100){
					countDownFpwd(60, djs);
				}else{
					btn.removeClass("disabled");
					alert(data.info);
				}
			}
		});

	}



	if(!geetest){
		$('#fpwdForm .form-get-phone .get-yzm').click(function(){
			sendPhoneVerCode();
		})
	}else{

		//极验验证
		var handlerPopupFpwd = function (captchaObjFpwd) {
			captchaObjFpwd.appendTo("#popupFpwd-captcha-mobile");

			// 成功的回调
			captchaObjFpwd.onSuccess(function () {
				var validate = captchaObjFpwd.getValidate();
				dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;

				//邮箱找回
				if(!$('#fpwdForm .form-item-email').hasClass('dn')){
					var btn = $("#fpwdForm .login-btn input");
					//异步提交
					$.ajax({
						url: masterDomain+"/include/ajax.php?service=member&action=backpassword",
						data: "type=1&email="+$('#fpwdForm .form-get-email .number').val()+dataGeetest,
						type: "GET",
						dataType: "jsonp",
						success: function (data) {

							$("#maskFpwd, #popupFpwd-captcha-mobile").removeClass("show");

							if(data){
								if(data.state == 100){

									$("#mailNote").html(data.info);
									$(".mask").fadeIn(100);
									btn.removeAttr("disabled").val('确定');

								}else{
									alert(data.info);
									btn.removeAttr("disabled").val('确定');
								}
							}else{
								alert("提交失败，请重试！");
								btn.removeAttr("disabled").val('确定');
							}
						},
						error: function(){
							alert("网络错误，提交失败！");
							btn.removeAttr("disabled").val('确定');
						}
					});


				//获取短信验证码
				}else{

					var number   = $('#fpwdForm .form-get-phone .number').val();
					if (number == '') {
						alert('请输入手机号~');
						return false;
					} else {
						var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
						if (!telReg) {
							alert('请输入正确的手机号')
							return false;
						} else {
							sendPhoneVerCode();
						}
					}

				}
			});

			window.captchaObjFpwd = captchaObjFpwd;
		};

		//获取验证码
		$('#fpwdForm .form-get-phone .get-yzm').click(function(){
			var number   = $('#fpwdForm .form-get-phone .number').val();
			if (number == '') {
				alert('请输入手机号~');
				return false;
			} else {
				var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if (!telReg) {
					alert('请输入正确的手机号')
					return false;
				} else {
					if (captchaObjFpwd) {
				        captchaObjFpwd.refresh();
				    }
					$("#maskFpwd, #popupFpwd-captcha-mobile").addClass("show");
				}
			}
		});


		//邮箱确认找回
		$("#fpwdForm .login-btn input").bind("click", function(){
			if(!$('.form-item-email').hasClass('dn')){

				var number = $('#fpwdForm .form-get-email .number').val();
				if (number == '') {
					alert('请输入邮箱~');
					return false;
				} else {
					var emReg = !!number.match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
					if (!emReg) {
						alert('请输入正确的邮箱')
						return false;
					}
				}

				if (captchaObjFpwd) {
					captchaObjFpwd.refresh();
				}
				$("#maskFpwd, #popupFpwd-captcha-mobile").addClass("show");

			}
		});


		$("#maskFpwd").click(function () {
	        $("#maskFpwd, #popupFpwd-captcha-mobile").removeClass("show");
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
	            }, handlerPopupFpwd);
	        }
	    });

	}

	// 更换验证码
	$('#fpwdForm #verifycode').click(function(){
		var img = $('#fpwdForm #verifycode'),src = img.attr('src') + '?v=' + new Date().getTime();
		img.attr('src',src);
	})


	//我知道了
	$(".know").click(function(){
		$(".mask").fadeOut(100);
	});


	$("#fpwdForm").submit(function(event){
		event.preventDefault();
		$('#fpwdForm .login-btn input').click();
	});

	// 确定
	//没有开启极验，或者开启了但是必须是手机找回时才可用
	$('#fpwdForm .login-btn input').click(function() {
		if(!geetest || (geetest && $('#fpwdForm .form-item-email').hasClass('dn'))){
			var btn = $(this), type = 2, data = [];
			var number = $('#fpwdForm .form-get-email .number').val();

			//邮箱找回
			if (!$('#fpwdForm .form-item-email').hasClass('dn')) {
				type = 1;
				if (number == '') {
					alert('请输入邮箱~');
					return false;
				} else {
					var emReg = !!number.match(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
					if (!emReg) {
						alert('请输入正确的邮箱')
						return false;
					}
				}

				data.push("email="+number);

			//手机找回
			}else{

				var number = $('#fpwdForm .form-get-phone .number').val();
				if (number == '') {
					alert('请输入手机号~');
					return false;
				} else {
					var telReg = !!number.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
					if (!telReg) {
						alert('请输入正确的手机号')
						return false;
					}
				}


				var yzm = $("#fpwdForm .yzm").val();
				if(yzm == ''){
					alert('请输入短信验证码');
					return false;
				}

				data.push("phone="+number);
				data.push("vdimgck="+yzm);

			}

			if(!geetest){
				var vericode = $("#fpwdForm .vericode").val();
				if(vericode == ''){
					alert('请输入验证码');
					return false;
				}
			}

			btn.attr("disabled", true).val('提交中...');
			data.push("type="+type);
			data.push("vericode="+vericode);

			//异步提交
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=member&action=backpassword",
				data: data.join("&"),
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data){
						if(data.state == 100){

							if(type == 1){
								$("#mailNote").html(data.info);
								$(".mask").fadeIn(100);

								$("#fpwdForm #verifycode").click();
								btn.removeAttr("disabled").val('确定');
							}else{
								location.href = data.info;
							}

						}else{
							alert(data.info);
							$("#fpwdForm #verifycode").click();
							btn.removeAttr("disabled").val('确定');
						}
					}else{
						alert("提交失败，请重试！");
						$('#fpwdForm #verifycode').click();
						btn.removeAttr("disabled").val('确定');
					}
				},
				error: function(){
					alert("网络错误，提交失败！");
					$('#fpwdForm #verifycode').click();
					btn.removeAttr("disabled").val('确定');
				}
			});


		}
	})


})
