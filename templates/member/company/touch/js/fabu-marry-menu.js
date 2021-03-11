$(function () {
    $('.add-box .btn_add').click(function () {
        var menuname =$('#menu-name').val();
        if(!menuname){
            showErr(''+langData['marry'][4][27]+'');//菜名不能为空！
        }else {
            var list = `
             <li class="fn-clear">
                <input type="text" name="dishname[]" placeholder="" value="`+menuname+`">
                <i class="btn-del"></i>
            </li>
            `;
            $('.info').append(list);
            $('#menu-name').val('');
        }
    });

    $('.info').delegate('.btn-del','click',function () {
        $(this).parent().remove();
    });


    $('.container .fabu_btn .btn').click(function () {
        var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url"), tj = true;

        if($('#comname').val() == ''){
            showErr(''+langData['marry'][4][28]+'');//请输入套菜名称！
            tj = false;
        }else if($('#price').val() == '' && $('#price').val() < 0){
            showErr(''+langData['marry'][4][33]+'');//请输入套餐价格！
            tj = false;
        }else if($('.info li').length <= 1){
            showErr(''+langData['marry'][4][29]+'');//请至少上传一道菜名！
            tj = false;
        }

        if(!tj) return;

        $('.fabu_btn .btn').addClass("disabled").html(langData['siteConfig'][6][35]+"...");	//提交中

        $.ajax({
	        url: action,
	        data: form.serialize(),
	        type: "POST",
	        dataType: "json",
	        success: function (data) {
	            if(data && data.state == 100){
	            	var tip = langData['siteConfig'][20][341];
                    if(id != undefined && id != "" && id != 0){
                        tip = langData['siteConfig'][20][229];
                    }
                    location.href = url;
	            }else{
					showErr(data.info);
	            	t.removeClass("disabled").html(langData['marry'][2][58]);		//立即发布
	            }
	        },
	        error: function(){
				showErr(langData['siteConfig'][20][183]);
	            t.removeClass("disabled").html(langData['marry'][2][58]);		//立即发布
	        }
        });

    });


    //错误提示框
    var showErrTimer;
    function showErr(txt){
        showErrTimer && clearTimeout(showErrTimer);
        $(".popErr").remove();
        $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
        $(".popErr").css({"visibility": "visible"});
        showErrTimer = setTimeout(function(){
            $(".popErr").fadeOut(300, function(){
                $(this).remove();
            });
        }, 1500);
    }


});