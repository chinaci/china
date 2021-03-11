$(function(){

	$("#totalCount").html(totalCount);

	// 选择地区
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
			$("#city").html('<option value="">街道</option>');
		}
	});


	$('.sqfwForm').submit(function(){
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

		var data = [];
		data.push("people="+namev);
		data.push("contact="+phonev);
		data.push("addrid="+addr);
		data.push("area="+$("#area").val());
		data.push("budget="+$("#budget").val());
		data.push("nature="+$("#nature").val());
		data.push("note="+$("#note").val());

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=sendZhaobiao",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				btn.removeClass("disabled").val("提交");
				if(data && data.state == 100){
					alert("申请成功，工作人员收到您的信息后会第一时间与你联系，请保持您的手机畅通！");
					f.find("input, textarea").val("");
					f.find("select option").attr("selected", false);
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert("网络错误，请重试！");
				btn.removeClass("disabled").val("提交中...");
			}
		});

		return false;

	});


	$(".login").bind("click", function(){
		huoniao.login();
	});


});
