$(function(){

	var lgform = $('.login-form');
	// 提交
	var err = lgform.find('.text-num');
	var pass = lgform.find('.password');
	lgform.submit(function(e){

		e.preventDefault();
		var nameinp = $('.text-num'),
			name = nameinp.val(),
			psdinp = $('.password'),
			psd = psdinp.val(),
			submit = $(".submit"),
			r = true;
		if(name == ''){
			console.log(name)
			alert('请输入正确的账号！');
			r = false;
		}
		if(r && psd == ''){
            alert('请输入密码！');
			r = false;
		}
		if(r){

			submit.attr("disabled", true).val(langData['siteConfig'][2][5]+"...");
			var data = [];
			data.push("username="+name);
			data.push("password="+psd);

            //异步提交
            $.ajax({
                url: "/loginCheck.html",
                data: data.join("&"),
                type: "POST",
                dataType: "html",
                success: function (data) {
                    if(data){
                        if(data.indexOf("100") > -1){
                            $("body").append('<div style="display:none;">'+data+'</div>');
                            setTimeout(function(){
                                top.location.href = masterDomain;
                            },200)
                        }else if(data.indexOf("201") > -1){
                            pass.html('');

                            var data = data.split("|");
                            alert(data[1]);
                            submit.attr("disabled", false).val(langData['siteConfig'][16][158]);

                        }else if(data.indexOf("202") > -1){
                            var data = data.split("|");
                            alert(data[1]);
                            submit.attr("disabled", false).val(langData['siteConfig'][16][158]);

                        }else{
                            alert(langData['siteConfig'][21][3]);
                            submit.attr("disabled", false).val(langData['siteConfig'][16][158]);
                        }
                    }else{
                        alert(langData['siteConfig'][21][3]);
                        submit.attr("disabled", false).val(langData['siteConfig'][16][158]);
                    }
                },
                error: function(){
                    alert(langData['siteConfig'][20][168]);
                    submit.attr("disabled", false).val(langData['siteConfig'][16][158]);
                }
            });
            return false;

		}
	})
	//获取手机验证码
	


})
