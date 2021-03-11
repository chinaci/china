$(function () {
	function follow(id){
		$.post("/include/ajax.php?service=live&action=followMember&id="+id, function(){
			//t.removeClass("disabled");
		});
	}
	//详情关注切换
	$(".follow").click(function () {
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
		}

		var t = $(this),id=t.attr('data-id');
		if (t.hasClass('btn_care1')) {
			t.removeClass('btn_care1').addClass('btn_care').text('关注');
			follow(id);
		}else{
			t.removeClass('btn_care').addClass('btn_care1').text('已关注');
			follow(id);
		}
	});

	$("body").delegate(".isfollow","click", function(){
	//$(".isfollow").click(function () {
		var t = $(this),id=t.attr('data-id');
		if (t.hasClass('fans_care1')) {
			t.removeClass('fans_care1').addClass('fans_care').text('关注');
			follow(id);
		}else{
			t.removeClass('fans_care').addClass('fans_care1').text('已关注');
			follow(id);
		}
	});

	$("#qrcode").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 150,
		height: 150,
		text: h_detail
	});

	//手机看
	$(".smobile").hover(function(){
		$(".qrcode").show();
	}, function(){
		$(".qrcode").hide();
	});

	//分享
	$(".share").hover(function(){
		$(".lshare").show();
	}, function(){
		$(".lshare").hide();
	});

	//举报
	var complain = null;
	$(".report").bind("click", function(){

		var domainUrl = channelDomain.replace(masterDomain, "").indexOf("http") > -1 ? channelDomain : masterDomain;
		complain = $.dialog({
			fixed: true,
			title: "直播举报",
			content: 'url:'+domainUrl+'/complain-live-detail-'+id+'.html',
			width: 500,
			height: 300
		});
	});

	//微信打开
	$('.popup_weixin').click(function(){
		$(".weixin").show();
	});

	$('.close').click(function(){
		$(".weixin").hide();
	});

    $('.money').click(function(){
        $(".money-money").css('display','block');
    });
	//百度分享代码
	var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
	var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"4","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"12"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];

	/*$(".btnCare").click(function () {
		$(".btnCare").removeClass('btnCare').addClass('btnCare1').text('已关注');
	});

	$(".fans_care").click(function(){
		var index=$(this).index();
		$(this).removeClass('fans_care').addClass('fans_care1').text('已关注');
	});

	$(".fans_care1").click(function(){
		var index=$(this).index();
		$(this).removeClass('fans_care1').addClass('fans_care').text('关注');
	});*/


    // 打赏金额
    $('.rewardS-pay-select li').click(function(){
        var t = $(this), li = t.text(), num = parseInt(li);
        $('.rewardS-pay-box .rewardS-pay-money .inp').focus().val(num);
    })

    // 打赏金额验证
    var rewardInput = $('.rewardS-pay-box .rewardS-pay-money .inp');
    rewardInput.blur(function(){
        var t = $(this), val = t.val();

        var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
        var re = new RegExp(regu);
        if (!re.test(val)) {
            t.val(0);
        }
    })

    // 支付方式
    $('.rewardS-pay-way ul li').click(function(){
        $(this).addClass('on').siblings('li').removeClass('on');
    })

    //打开
    $('.start_pay').click(function(){
        $('.rewardS-pay').show(); $('.rewardS-mask').show();
        rewardInput.focus().val(rewardInput.val());
    })

    //关闭
    $('.rewardS-pay-tit .close').click(function(){
        $('.rewardS-pay').hide(); $('.rewardS-mask').hide();
    })

    //立即支付
    $('.rewardS-pay .rewardS-sumbit a').bind("click", function(event){
        var t = $(this);
        var amount = rewardInput.val();
        var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
        var re = new RegExp(regu);
        if (!re.test(amount)) {
            event.preventDefault();
            alert("打赏金额格式错误，最少0.01元！");
        }

        var paytype = $(".rewardS-pay-way .on").data("type");
        if(paytype == "" || paytype == undefined || paytype == null){
            event.preventDefault();
            alert("请选择支付方式！");
        }

        var url = t.data("url").replace("$amount", amount).replace("$paytype", paytype);

        t.attr("href", url);
        $('.rewardS-pay-tit .close').click();

    })



});
