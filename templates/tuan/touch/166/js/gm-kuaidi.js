$(function(){
	total();
	$('.num-rec').click(function(){
		var account = Number($('.num-account').val());
		if (account>1) {
			account --;
			$('.num-account').val(account);
			total();
		}
	});

	$('.num-add').click(function(){
		var account = Number($('.num-account').val());
		if (account < max) {
			account++;
			$('.num-account').val(account);
			total();
		}else{
			$('.num-account').val(max);
			alert('最多可购买'+max+"份");
		}
	});

	$('.num-account').bind('input propertychange', function(){
		total();
	});

	function total(){
		var num = Number($('.num-account').val()), frei = 0;

		if(tuantype == 2){
			if(num <= freeshi){
				frei = freight;
				$(".order-fare .name-r").html("含运费 "+freight);
			}else{
				frei = 0;
				$(".order-fare .name-r").html("免运费");
			}
		}
		if(type!=''){
			var total = Number(num*pinprice+frei).toFixed(2);
		}else{
			var total = Number(num*price+frei).toFixed(2);
		}
		$('.order-price .name-r em').html(total);
	}

	$("#orderForm").submit(function(){
		$("#submit").click();
	});

	//提交
	$("#submit").bind("click", function(){

		//验证登录
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain+'/login.html';
			return false;
		}

		var t = $(this), data = [], isaddr = 0, action = t.closest("form").attr("action"), num = Number($('.num-account').val());

		if(t.hasClass("disabled")) return false;

		data.push('pros[]='+id+","+num);
		data.push('type='+type);
		data.push('pinid='+pinid);
		data.push('voucher='+voucher);

		if(tuantype == 2){
			var addressid = $("#addressid").val();
			if(addressid == undefined || addressid == 0 || addressid == null){
				alert("请选择收货地址！");
				return false;
			}else{
				data.push("addrid="+addressid);
				data.push("deliveryType="+$("#deliveryType").val());
				data.push("comment="+encodeURIComponent($("#comment").val()));
			}
		}

		t.addClass("disabled").html("提交中...");

		$.ajax({
			url: action,
			data: data.join("&"),
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					if(device.indexOf('huoniao_Android') > -1) {
                        setupWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler('pageClose', {}, function (responseData) {
                            });
                        });
                        location.href = data.info;
                    }else{
                        location.href = data.info + (data.info.indexOf('?') > -1 ? '&' : '?') + 'currentPageOpen=1';
                    }
				}else{
					alert(data.info);
					t.removeClass("disabled").html("提交订单");
				}
			},
			error: function(){
				alert("网络错误，请重试！");
				t.removeClass("disabled").html("提交订单");
			}
		});

	})


})


//地址选择成功
function chooseAddressOk(addrArr){
	$("#addressid").val(addrArr.id);
	$(".chooseAddress").html('<div class="name-l"><p><span>'+addrArr.people+'</span><span>'+addrArr.contact+'</span></p><p>'+addrArr.addrname+' '+addrArr.address+'</p></div><div class="name-r">＞</div><div class="clear"></div>');
}
