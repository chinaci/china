$(function(){

    //支付方式
    $("#paytype").val($(".o-p .active:eq(0)").data("type"));
    $(".o-p .bank-icon").bind("click", function(){
		var t = $(this);
		!t.hasClass("active") ? t.addClass("active").siblings("a").removeClass("active") : "";
		$("#paytype").val(t.data("type"));
	});

    //提交
    $("#tj").bind("click", function(){
        var t = $(this), form_id = parseInt($("#id").val()), form_fid = parseInt($("#fid").val());
        if(form_id != id || form_fid != fid){
            alert("数据不匹配，请刷新重试！");
            return false;
        }

        if(t.hasClass("loading")) return false;

        var orderForm = $("#orderForm"), action = orderForm.attr("action"), data = orderForm.serialize();

        t.addClass("loading");
        $.ajax({
            url: action,
            data: data+"&check=1",
            type: "POST",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    orderForm.submit();
                }else{
                    alert(data.info);
                    t.removeClass("loading");
                }
            },
            error: function(){
                alert("网络错误，报名失败，请稍候重试！");
                t.removeClass("loading");
            }
        });

    });


});
