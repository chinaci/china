$(function(){


    $('.info-block .more').click(function () {
        $('.loc_name_box').addClass('show');
        $('.info-block .xInfo_box').addClass('hide');
        $('.wInfo_box').addClass('show');
    });

    $('.info-block .more_active').click(function () {
        $('.loc_name_box').removeClass('show');
        $('.info-block .xInfo_box').removeClass('hide');
        $('.wInfo_box').removeClass('show');
    });



	//导航
  $('.header-r .screen').click(function(){
    var nav = $('.nav'), t = $('.nav').css('display') == "none";
    if (t) {nav.show();}else{nav.hide();}
  });

  (function ($) {
   $.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
   }
  })(jQuery);
   var rates = $.getUrlParam('rates');
   console.log(rates)


   if (rates == 1) {
     $('.common').show();
   }

  // 立即发货
  $('.fahuo').click(function(){
    $('#confirmOrder, .mask').show();
  })

  //选择配送方式
  $("#shipping").bind("change", function(){
      var val = $(this).val();
      if(val == 1){
          $('.exp').show();
      }else{
          $('.exp').hide();
      }
  });

  // 取消发货
  $('#confirmOrder .close, #confirmOrder .cancel').click(function(){
    $('#confirmOrder, .mask').hide();
    $("#exp-company").val('');
    $("#exp-number").val('');
  })

  //提交快递信息
	$("#confirmOrder .cbtn").bind("click", function(){
		var t = $(this),
			shipping = parseInt($("#shipping").val()),
			company = $("#exp-company"),
			number  = $("#exp-number");

        if(typeof shipping === 'number' && !isNaN(shipping)){

		}else{
			alert(langData['siteConfig'][45][83]);//请选择配送方式！
			return false;
		}

        //快递类型
		if(shipping == 1){
    		if($.trim(company.val()) == ""){
    			$('#confirmOrder .wrong').text(langData['siteConfig'][20][405]);
    			return false;
    		}

    		if($.trim(number.val()) == ""){
    			$('#confirmOrder .wrong').text(langData['siteConfig'][20][406]);
    			return false;
    		}
        }

        $('#confirmOrder .wrong').text('');
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
					location.reload();
				}else{
					alert(data.info);
					t.attr("disabled", false).html(langData['siteConfig'][6][0]);
				}
			},
			error: function(){
				alert(langData['siteConfig'][20][183]);
				t.attr("disabled", false).html(langData['siteConfig'][6][0]);
			}
		});

	});




    // 变更门店
    $('.changeBranch').click(function(){
     $('#changeBranch, .mask').show();
    })

    // 取消变更
    $('#changeBranch .close, #changeBranch .cancel').click(function(){
     $('#changeBranch, .mask').hide();
    })

    //提交快递信息
  	$("#changeBranch .cbtn").bind("click", function(){
        var branchVal = $('#brancheSelect').val();
        if(branchVal){

            if(branchVal == branchid){
                alert(langData['shop'][5][111]);  //与当前分店一致，无需变更！
                return false;
            }

            if(confirm(langData['shop'][5][109])){  //确定要变更分店吗？

                $.ajax({
                    url: "/include/ajax.php?service=shop&action=changeBranch",
                    data: "id="+detailID+"&branchid="+branchVal,
                    type: "POST",
                    dataType: "json",
                    success: function (data) {
                        if(data && data.state == 100){
                            
                            alert(data.info);
                            location.reload();

                        }else{
                            $.dialog.alert(data.info);
                        }
                    },
                    error: function(){
                        $.dialog.alert(langData['siteConfig'][20][183]);
                    }
                });

            }

        }else{
            alert(langData['shop'][5][109]);  //请选择要变更到的分店！
        }

  	});


  // 回复退款
  $('.huifu').click(function(){
    var t = $(this);
    $('.layer').addClass('show').animate({"left":"0"},100);
  })

  // 隐藏回复
  $('#typeback').click(function(){
    $('.layer').animate({"left":"100%"},100);
    setTimeout(function(){
      $('.layer').removeClass('show');
    }, 100)
  })

	//确定退款
	$(".tuikuan").bind("click", function(){
		var t = $(this);

		if(t.attr("disabled") == "disabled") return;

		if(confirm(langData['siteConfig'][20][407])){
			t.html(langData['siteConfig'][6][35]+"...").attr("disabled", true);

			$.ajax({
				url: "/include/ajax.php?service=shop&action=refundPay",
				data: "id="+detailID,
				type: "POST",
				dataType: "json",
				success: function (data) {
					if(data && data.state == 100){
						location.reload();
					}else{
						alert(data.info);
						t.attr("disabled", false).html(langData['siteConfig'][6][153]);
					}
				},
				error: function(){
					alert(langData['siteConfig'][20][183]);
					t.attr("disabled", false).html(langData['siteConfig'][6][153]);
				}
			});
  	}
  });

  //提交回复
  $("#submit").bind("click", function(){
    var t      = $(this),
        retnote = $("#textarea").val();

    if(retnote == "" || retnote.length < 15){
      alert(langData['siteConfig'][20][408]);
      return;
    }

    var pics = [];
    $("#fileList li").each(function(){
      var val = $(this).find("img").attr("data-val");
      if(val != ""){
        pics.push(val);
      }
    });

    var data = {
      id: detailID,
      pics: pics.join(","),
      content: retnote
    }

    t.attr("disabled", true).html(langData['siteConfig'][6][35]+"...");

    $.ajax({
      url: masterDomain+"/include/ajax.php?service=shop&action=refundReply",
      data: data,
      type: "POST",
      dataType: "jsonp",
      success: function (data) {
        if(data && data.state == 100){
          location.reload();
        }else{
          alert(data.info);
          t.attr("disabled", false).html(langData['siteConfig'][6][0]);
        }
      },
      error: function(){
        alert(langData['siteConfig'][20][183]);
        t.attr("disabled", false).html(langData['siteConfig'][6][0]);
      }
    });
  });




})
