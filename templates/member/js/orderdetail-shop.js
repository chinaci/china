$(function(){

	//收货
	$(".sh").bind("click", function(){
		var t = $(this);
		if(t.attr("disabled") == "disabled") return;

		if(confirm(langData['siteConfig'][20][188])){  //确定要收货吗？确定后费用将直接转至卖家账户，请谨慎操作！
			t.html(langData['siteConfig'][6][35]+"...").attr("disabled", true);//提交中

			$.ajax({
				url: "/include/ajax.php?service=shop&action=receipt",
				data: "id="+id,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){
						location.reload();

					}else{
						alert(data.info);
						t.attr("disabled", false).html(langData['siteConfig'][6][45]);  //确认收货
					}
				},
				error: function(){
					$.dialog.alert(langData['siteConfig'][20][183]); //网络错误，请重试！
					t.attr("disabled", false).html(langData['siteConfig'][6][45]);//确认收货
				}
			});

		}

	});



	//选择配送方式
	$("input[name=shipping]").bind("click", function(){
		var val = $(this).val();
		if(val == 1){
			$('.exp').show();
		}else{
			$('.exp').hide();
		}
	});

	//提交快递信息
	$("#expBtn").bind("click", function(){
		var t = $(this),
			shipping = parseInt($("input[name=shipping]:checked").val()),
			company = $("#exp-company"),
			number  = $("#exp-number");

		if(typeof shipping === 'number' && !isNaN(shipping)){

		}else{
			alert(langData['siteConfig'][9][73]+'！');//请选择配送方式！
			return false;
		}

		//快递类型
		if(shipping == 1){
			if($.trim(company.val()) == ""){
				company.parent().addClass("error");
				return false;
			}

			if($.trim(number.val()) == ""){
				number.parent().addClass("error");
				return false;
			}
		}

		var data = [];
		data.push("id="+detailID);
		data.push("shipping="+shipping);

		if(shipping == 1){
			data.push("company="+company.val());
			data.push("number="+number.val());
		}

		t.attr("disabled", true).html(langData['siteConfig'][6][35]+"...");

		$.ajax({
			url: "/include/ajax.php?service=shop&action=delivery",
			data: data.join("&"),
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					$.dialog({
						fixed: true,
						title: langData['siteConfig'][20][244],
						icon: 'success.png',
						content: data.info,
						ok: function(){
							location.reload();
						},
						cancel: false
					});

				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false).html(langData['siteConfig'][6][0]);
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.attr("disabled", false).html(langData['siteConfig'][6][0]);
			}
		});

	});

	//确定退款
	$(".tuikuan").bind("click", function(){
		var t = $(this);

		if(t.attr("disabled") == "disabled") return;

		$.dialog.confirm(langData['siteConfig'][20][407], function(){

			t.html(langData['siteConfig'][6][35]+"...").attr("disabled", true);

			$.ajax({
				url: "/include/ajax.php?service=shop&action=refundPay",
				data: "id="+detailID,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){
						$.dialog({
							fixed: true,
							title: langData['siteConfig'][20][244],
							icon: 'success.png',
							content: data.info,
							ok: function(){
								location.reload();
							},
							cancel: false
						});

					}else{
						$.dialog.alert(data.info);
						t.attr("disabled", false).html(langData['siteConfig'][6][153]);
					}
				},
				error: function(){
					$.dialog.alert(langData['siteConfig'][20][183]);
					t.attr("disabled", false).html(langData['siteConfig'][6][153]);
				}
			});

		});
	});

});
