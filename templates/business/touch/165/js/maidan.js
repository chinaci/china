$(function(){
	getTotalMoney();
	if(state == 0) return;


	// 输入框
	$(".inpbox input[type='text']").focus(function(){
		var t = $(this),inp = t.closest('.inpbox');
		inp.addClass('focus');
	});

	$(".inpbox input[type='text']").blur(function(){
		var t = $(this),inp = t.closest('.inpbox');
		inp.removeClass('focus');
	})


	$(".inpbox input[type='text']").on('input',function(){
		var t = $(this),inp = t.closest('.inpbox');
		var val = t.val().replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
		if(val!=''){
			t.val(echoCurrency('symbol') + val);
		}else{
			t.val(val);
		}
		t.siblings('input[type="hidden"]').val(val.replace(echoCurrency('symbol'),''));
		getTotalMoney();
	});


	// 支付
	$(".btn_pay").click(function(){
		var t = $(this);

		var price = getTotalMoney();

		if(t.hasClass("disabled") ) return;



		if($("#all_money_show").val()==''){
			showErr('请输入总金额');
			return false;
		}
		t.addClass("disabled");
		$.ajax({
			url: '/include/ajax.php?service=business&action=maidanDeal',
			type: 'post',
			data: {
				store  :  shopid,
				amount :  price.amount,
				amount_alone : price.amount_alone
			},
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
					location.href = payUrl.replace('%ordernum%', data.info);
				}else{
					alert(data.info);
					t.removeClass("disabled");
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled");
			}
		})
	})

	// 计算实付金额
	function getTotalMoney(){
		$("#all_money").val($("#all_money_show").val().replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'))
		if($("#out_money_show").size() > 0){
			$("#out_money").val($("#out_money_show").val().replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'))
		}
		var all_money     = $("#all_money").val() ? parseFloat($("#all_money").val()) : 0,
			out_money     = $('#out_money').val() ? parseFloat($('#out_money').val()) : 0;

		var out_money_ =  out_money;
		var money = (all_money) * (100 - (youhui_open ? youhui_value : 0)) / 100 + out_money_;
		money = money.toFixed(2);


		$(".count em").text(money);

		return {amount : all_money, amount_alone : out_money_};

	}

	setTimeout(function(){
		getTotalMoney();
	},500)


	var showErrTimer;
	function showErr(data) {
		showErrTimer && clearTimeout(showErrTimer);
		$(".popErr").remove();
		$("body").append('<div class="popErr"><p>' + data + '</p></div>');
		$(".popErr p").css({
			"margin-left": -$(".popErr p").width() / 2,
			"left": "50%"
		});
		$(".popErr").css({
			"visibility": "visible"
		});
		showErrTimer = setTimeout(function() {
			$(".popErr").fadeOut(300, function() {
				$(this).remove();
			});
		}, 1500);
	 }


})
