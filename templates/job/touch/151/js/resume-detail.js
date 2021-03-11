$(function(){



    onefindList();
    function onefindList(){
        $.ajax({
            url : '/include/ajax.php?service=job&action=recommendedResume',
            data : {
                id : id
            },
            type : 'GET',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    var list = data.info;
                    var len = list.length;
                    var html = [];
                    for(var i = 0; i < len; i++){
                        var is_jiesuo;

                        var is_buy = '', is_buy_htm='';
                        if(list[i].is_buy == 1){
                            is_buy_htm = '<span class="label">已购买</span>';
                            is_jiesuo = '';
                            if(list[i].is_refuse == 1){
                                is_buy_htm = '<span class="label">不合适</span>';
                            }
                        }else{
                            is_jiesuo = '<div class="jiesuo fn-clear"><span></span><span class="jsbtn" data-id="'+list[i].id+'">解锁</span></div></div>'
                        }

                        html.push('<li>');
                        html.push('<a href="'+list[i].url+'">');
                        html.push('<div class="list-tit">');

                        html.push('<span class="name man">'+list[i].name+'</span>');

                        html.push(is_buy_htm);
                        html.push('<p class="fn-right list-tit-tag">');
                        html.push('<span class="area">'+list[i].addr[list[i].addr.length-1]+'</span>');
                        html.push('<span class="year">'+list[i].workyear+'年</span>');
                        html.push('<span class="education">'+list[i].educational+'</span>');
                        html.push('</p>');
                        html.push('</div>');
                        html.push('<div class="list-con fn-clear">');
                        html.push('<div class="img-box fn-left"><img src="'+(list[i].photo ? list[i].photo : '/static/images/noPhoto_60.jpg')+'"></div>');
                        html.push('<div class="img-txt fn-clear">');
                        html.push('<div class="zhiwei_main fn-clear"><h3>期望职位<span class="post">'+list[i].professional+'</span></h3>');
                        html.push('<p class="now fn-clear">期望薪资<span>'+(list[i].salary > 0 ? list[i].salary:'面议')+'</span><span class="time">'+list[i].pubdate+'分钟前</span></p>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</a>')
                        html.push(is_jiesuo);
                        html.push('</li>')
                    }
                    $('#maincontent').append(html.join(""));
                }
            }
        })

    };

    // 点击解锁
    $("#maincontent").on('click','.jiesuo',function(){
      $('.unlock').show();
      $('.mask01').show();
        var t = $(this).find(".jsbtn");
        id = t.attr("data-id");

    });

    $(".close").click(function () {
        $('.unlock').hide();
        $('.mask01').hide();
    })
    $(".jiesuo_max").click(function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }
      $('.unlock').show();
      $('.mask01').show();
    });

    // 点击不合适
    $('.btn .no .no_heshi_remark').click(function(){
        var t = $(this);
        if(t.hasClass("disabled")) return false;

        $('.inappropriate').show();
        $('.mask').show();
    });
    $('.inappropriate .no_txt ul li').click(function(){
      var t = $(this);
      if(!t.hasClass('active')){
        t.addClass('active').siblings().removeClass('active');
      }
    });
    $('.inappropriate .close1').click(function(){
      $('.inappropriate').hide();
      $('.mask').hide();
    });
    $('.inappropriate .signout').click(function(){
      $('.inappropriate').hide();
      $('.mask').hide();
    });

    $(".chongzhi").bind('click', function () {
        $.ajax({
            url : "/include/ajax.php?service=job&action=viewResume",
            data:{
                id : id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {

                if(data.state == 100){
					if(!data.info.state){
	                    alert(data.info);
	                    window.location.href = window.location.href;
					}else{
						alert(data.info.info);
						setTimeout(function(){
							location.href = data.info.url;
						}, 1000);
					}
                }else{
                    alert(data.info);
                    window.location.href = window.location.href;
                }
            }
        })
    })

    $(".no_btn_02_btn").bind('click', function () {
        var remark = $(".inappropriate").find('.active').text();
        remark = $.trim(remark);
        if(remark == '其它'){
            remark = $(".Desc1").val();
        }
        $.ajax({
            url : "/include/ajax.php?service=job&action=buyResumeRemark",
            data:{
                rid : id,
                remark : remark
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {

                if(data.state == 100){
                    alert(data.info);
                    window.location.href = window.location.href;
                }else{
                }
            }
        })
    })






    //收藏简历

    $(".like a").click(function () {
        var type = 'add';
        $.ajax({
            url : '/include/ajax.php?service=member&action=collect&module=job&temp=resume&type='+type+'&id='+id,
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(data.info == 'has'){
                        alert("您已收藏");
                    }else if(data.info == 'ok'){
                        window.location.href = window.location.href;
                    }else{
                        alert(data.info);
                    }

                }else{
                    alert("请登录后再试~");
                }
            }


        })
    })
    //取消收藏
    $(".del_like a").click(function () {
        var type = 'del';
        $.ajax({
            url : '/include/ajax.php?service=member&action=collect&module=job&temp=resume&type='+type+'&id='+id,
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                window.location.href = window.location.href;

            }


        })
    })


})
