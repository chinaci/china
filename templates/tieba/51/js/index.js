$(function(){

	//第三方登录
	$("body").delegate(".loginconnect", "click", function(e){
		e.preventDefault();
		var href = $(this).attr("href"), type = href.split("type=")[1];
		loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

		//判断窗口是否关闭
		mtimer = setInterval(function(){
      if(loginWindow.closed){
      	$.cookie(cookiePre+"connect_uid", null, {expires: -10, domain: masterDomain.replace("http://www", ""), path: '/'});
        clearInterval(mtimer);
        huoniao.checkLogin(function(){
          location.reload();
        });
      }else{
        if($.cookie(cookiePre+"connect_uid") && $.cookie(cookiePre+"connect_code") == type){
          loginWindow.close();
          var modal = '<div id="loginconnectInfo"><div class="mask"></div> <div class="layer"> <p class="layer-tit"><span>温馨提示</span></p> <p class="layer-con">为了您的账户安全，请绑定您的手机号<br /><em class="layer_time">3</em>s后自动跳转</p> <p class="layer-btn"><a href="'+masterDomain+'/bindMobile.html?type='+type+'">前往绑定</a></p> </div></div>';

          $("#loginconnectInfo").remove();
          $('body').append(modal);

          var t = 3;
          var timer = setInterval(function(){
            if(t == 1){
              clearTimeout(timer);
              location.href = masterDomain+'/bindMobile.html?type='+type;
            }else{
              $(".layer_time").text(--t);
            }
          },1000)
        }
      }
    }, 1000);

	});

  //相册切换效果
	$('.plist li').click(function(){
		$(this).addClass('on');
		$(this).closest('.carousel').find('.album').show();
	})
	$('.album .close').click(function(){
		$(this).closest('.album').hide();
		$('.plist li').removeClass('on');
	})

	$(".main-list").find(".carousel").each(function(){
		var t = $(this), album = t.find(".album");
		//大图切换
		t.slide({
			titCell: ".plist li",
			mainCell: ".albumlist",
			trigger:"click",
			autoPlay: false,
			delayTime: 0,
			startFun: function(i, p) {
				if (i == 0) {
					t.find(".sprev").click()
				} else if (i % 8 == 0) {
					t.find(".snext").click()
				}
			}
		});
		//小图左滚动切换
		t.find(".thumb").slide({
			mainCell: "ul",
			delayTime: 300,
			vis: 10,
			scroll: 8,
			effect: "left",
			autoPage: true,
			prevCell: ".sprev",
			nextCell: ".snext",
			pnLoop: false
		});
	});
	$(".carousel .thumb li.on").removeClass("on");

	//发布选择分类
	$("#selType").change(function(){
		var t = $(this), id = t.val();
		if(id){

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=tieba&action=type&type="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){

						var option = [], list = data.info;
						for(var i = 0; i < list.length; i++){
							option.push('<option value="'+list[i].id+'">'+list[i].typename+'</option>');
						}
						if(option){
							t.nextAll("select").remove();
							t.parent().append('<select><option value="">请选择分类</option>'+option.join("")+'</select>');
						}

					}
				}
			});

		}else{
			t.nextAll("select").remove();
		}
	});

})
