$(function(){

  $(".bearFreight span").bind("click", function(){
		var val = $(this).data("id");
		if(val == 1){
			$("#freight").hide();
		}else{
			$("#freight").show();
		}
	});

	$(".valuation span").bind("click", function(){
		var val = $(this).data("id"), i = $("#freight i");
		if(val == 0){
			i.html("件");
		}else if(val == 1){
			i.html("kg");
		}else if(val == 2){
			i.html("m³");
		}
	});

	//提交发布
	$("#submit").bind("click", function(event){
		event.preventDefault();
        var cityid = $('select[name=cityid]').val();

		var t = $(this);
		if(t.hasClass("disabled")) return;

        var offsetTop = 0;

        //验证城市
        // if(cityid == "" || cityid == 0){
        //     var dl = $("#cityid").closest("dl");
        //     dl.find(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+$("#cityid").attr("data-title"));
        //     offsetTop = offsetTop == 0 ? dl.offset().top : offsetTop;
        // }

        if(offsetTop){
            $('.main').animate({scrollTop: offsetTop - 5}, 300);
            return false;
        }

		var form = $("#fabuForm"), action = form.attr("action"), data = form.serialize();
		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					var tip = langData['siteConfig'][20][312];
					if(id != undefined && id != "" && id != 0){
						tip = langData['siteConfig'][20][229];
					}
					$.dialog({
						title: langData['siteConfig'][19][287],
						icon: 'success.png',
						content: tip,
						ok: function(){
							location.href = manageUrl;
						}
					});
				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['shop'][1][7]);
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['shop'][1][7]);
			}
		});

	});

});
