$(function(){

	$(".inp_clearAutocomplete").each(function(){
		var t = $(this), cfg = t.attr("data-cfg").split(":");
		var type = cfg[0], name = cfg[1], cls = cfg[2] ? cfg[2] : "inp";
		var $inp = $('<input type="'+type+'" class="'+cls+'" name="'+name+'" id="'+name+'" readonly />');
		t.after($inp).remove();
		setTimeout(function(){
			$inp.attr("readonly", false);
		},500)
	})
	
	var transferCount = 0;

	//表单验证
	$(".inp").bind("input click focus", function(){
		$(this).removeClass("error").siblings(".tip-inline").removeClass().addClass("tip-inline").show();
	});


	//对方用户名
	$("#user").bind("blur", function(){
		var t = $(this), val = t.val(), tip = t.siblings(".tip-inline");
		if(val == ""){
			tip.removeClass().addClass("tip-inline error").show();
			t.addClass("error");
		}else{
			t.removeClass("error");
			tip.removeClass().addClass("tip-inline ok").show();
		}
	});

	//最多可赠送的积分
	var canPoint = totalPoint / ((100 + pointFee) / 100);
	var resPoint = Math.floor(canPoint*100)/100;//取小数点后两位
	$('#canTrans').html(resPoint);


	//数量验证
	$("#amountp").bind("blur", function(){
		var t = $(this), val = t.val(), tip = t.siblings(".tip-inline");
		var fee = val * pointFee / 100;
		console.log(val,fee)
		var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
		var re = new RegExp(regu);
		if (!re.test(val)) {

			tip.removeClass().addClass("tip-inline error").html('<s></s>'+langData['siteConfig'][20][218]).show();  //数量必须为整数或小数，小数点后不超过2位。
			t.addClass("error");
			$("#fee").html(0);
			$("#amount").val(0);
			transferCount = 0;

		}else if(val > canPoint){

			tip.removeClass().addClass("tip-inline error").html('<s></s>'+langData['siteConfig'][20][579].replace('1', pointName)).show(); //可用1不足
			t.addClass("error");
			$("#fee").html(0);
			$("#amount").val(0);
			transferCount = 0;

		}else{
			t.removeClass("error");
			tip.removeClass().addClass("tip-inline ok").html('<s></s>'+langData['siteConfig'][20][218]).show();  //数量必须为整数或小数，小数点后不超过2位。
			var feeP = Math.floor(fee*100)/100;
			$("#fee").html(feeP);
			var allP = parseFloat(val) + parseFloat(fee);
			var allMo = Math.floor(allP*100)/100;
			$("#amount").val(allMo);
			transferCount = val;
		}

	});


	//支付密码
	$("#paypwd").bind("blur", function(){
		var t = $(this), val = t.val(), tip = t.siblings(".tip-inline");
		if(val == ""){
			tip.removeClass().addClass("tip-inline error").show();
			t.addClass("error");
		}else{
			t.removeClass("error");
			tip.removeClass().addClass("tip-inline ok").show();
		}
	});


	//提交支付
	$("#tj").bind("click", function(event){
		var t = $(this);

		if($("#user").val() == ""){
			alert(langData['siteConfig'][20][220]);//请输入对方用户名
			$("#user").focus();
			return false;
		}
		if(transferCount == 0){
			alert(langData['siteConfig'][20][221]);  //请输入需要转赠的数量！
			$("#amount").focus();
			return false;
		}
		if(transferCount > totalPoint){
			alert(langData['siteConfig'][20][222]);//您输入的转赠数量大于您的总数量，请充值后重试！
			$("#amount").focus();
			return false;
		}
		if($("#paypwd").val() == ""){
			alert(langData['siteConfig'][20][213]);//请输入支付密码
			$("#paypwd").focus();
			return false;
		}
		if(!$("#agree").is(":checked")){
			alert(langData['siteConfig'][20][580]);  //您必须同意并接受《现金与福券转赠服务协议》
			return false;
		}

		var action = $("#payform").attr("action"), data = $("#payform").serialize();

		t.attr("disabled", true).html(langData['siteConfig'][6][35]+"...");  //提交中

		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){

					$.dialog({
						title: langData['siteConfig'][19][287],  //提示消息
						icon: 'success.png',
						content: langData['siteConfig'][21][97],  //转赠成功！
						ok: function(){
							location.reload();
						}
					});

				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false).html(langData['siteConfig'][6][46]);//确认转赠
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);  //网络错误，请稍候重试！
				t.attr("disabled", false).html(langData['siteConfig'][6][46]);//确认转赠
			}
		});


	});

});
