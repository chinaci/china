/**
 * Created by Administrator on 2018/4/26.
 */


$(function () {
    //APP端取消下拉刷新
    toggleDragRefresh('off');
    
    //首页导航
    $(".menu_list a").click(function () {
        var index=$(this).index();
        $(this).addClass("active").siblings().removeClass("active");
    });

    var distance=100;
    $('.nav_more').on('click',function (){
        $('.menu_list').scrollLeft(distance);
        distance+=100;
    });




    //主播列表切换
    /*$(".nav_tab .tab_title").click(function(){
        var index=$(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".con_list").eq(index).addClass("an_show").siblings().removeClass("an_show");
    });*/


});

//关注切换
$(function () {
	function follow(id){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      window.location.href = masterDomain+'/login.html';
      return false;
    }

		$.post("/include/ajax.php?service=live&action=followMember&id="+id, function(){
			//t.removeClass("disabled");
		});
	}

	function getUp(id,num,uid){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }
        $.ajax({
            url: "/include/ajax.php?service=member&action=getZan&module=live&temp=h_detail"+"&id="+id+"&uid="+uid,
            type: "GET",
            dataType: "json",
            success: function (data) {
                $(".like_img").toggleClass('active');
            }
        });

		/* $.post("/include/ajax.php?service=live&action=getUp&id="+id+'&up='+num, function(){
			//t.removeClass("disabled");
		}); */
	}

	$("body").delegate(".like_img","click", function(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            window.location.href = masterDomain+'/login.html';
            return false;
        }

	    //$(".like_img").click(function(){
        var num = $(".live_like span").text();
        var t = $(this),id=t.attr('data-id'),uid=t.attr('data-uid');
        // num++;
        t.hasClass('active') ? num-- : num++;
        getUp(id,num,uid);
        $(".live_like span").text(num);
    });

	$("body").delegate(".follow","click", function(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      window.location.href = masterDomain+'/login.html';
      return false;
    }

		var t = $(this),id=t.attr('data-id');
		if (t.hasClass('btnCare1')) {
			t.removeClass('btnCare1').addClass('btnCare').text('关注');
			follow(id);
		}else{
			t.removeClass('btnCare').addClass('btnCare1').text('已关注');
			follow(id);
		}
	});
});


//直播详情--刷新页面
$(function(){
    $("#v_refresh").click(function(){
       window.location.reload();
    });

    $("#refresh").click(function(){
        window.location.reload();
    });

});


//发起直播
$(function () {
    //下拉菜单
    if($('.demo-test-select').size() > 0){
      $('.demo-test-select').scroller(
          $.extend({preset: 'select'})
      );
    }

    //年月日
    if($('.demo-test-date').size() > 0){
      $('.demo-test-date').scroller(
          $.extend({preset: 'date', dateFormat: 'yy-mm-dd'})
      );
    }

    //选择横竖屏
    $(".h_live").click(function () {
        $("#h_screen").addClass("active");
        $("#v_screen").removeClass("active");
    });
    $(".v_live").click(function () {
        $("#v_screen").addClass("active");
        $("#h_screen").removeClass("active");
    });

    $('#live_style').change(function(){
        var options=$("#live_style option:selected"); //获取选中的项
        if(options.text()=="加密"){
            $(".li_collect").css("display","none");
            $(".li_pass").css("display","block");
        }else if(options.text()=="收费"){
            $(".li_pass").css("display","none");
            $(".li_collect").css("display","block");
        }else{
            $(".li_pass").css("display","none");
            $(".li_collect").css("display","none");
        }
    });


});

$(function(){
//加的效果
    $(".cAdd").click(function(){
        var n=$(this).prev().val();
        var num=parseInt(n)+1;
        if(num==-1){ return;}
        $(this).prev().val(num);
    });
//减的效果
    $(".cReduce").click(function(){
        var n=$(this).next().val();
        var num=parseInt(n)-1;
        if(num==-1){ return;}
        $(this).next().val(num);
    });
});

//发起直播
$(function () {
	// 错误提示
	function errmsg(obj,str){
		var o = $(".error");
		o.html('<p>'+str+'</p>').show();
		if(obj.is('textarea') || (obj.is('input') && obj.is(':visible') && obj.attr('readonly') != "true")){
			obj.focus();
		}else{
			$('html,body').animate({
			},10);
		}

		obj.closest('label').addClass('haserror');
		setTimeout(function(){o.hide()},1000);
	}
    //--选择封面图
    $(".input_file").click(function () {
        $(".sel_modal").css("display", "block");
    });
    $("#close").click(function () {
        $(".sel_modal").css("display", "none");
    });
    var backgrounds = [
        masterDomain+"/templates/member/images/live/a_banner01.png",
        masterDomain+"/templates/member/images/live/a_banner02.png",
        masterDomain+"/templates/member/images/live/a_banner03.png",
        masterDomain+"/templates/member/images/live/a_banner04.png",
        masterDomain+"/templates/member/images/live/a_banner05.png",
        masterDomain+"/templates/member/images/live/a_banner06.png",
        masterDomain+"/templates/member/images/live/a_banner07.png",
        masterDomain+"/templates/member/images/live/a_banner08.png",
        masterDomain+"/templates/member/images/live/a_banner09.png",
        masterDomain+"/templates/member/images/live/a_banner10.png",
        masterDomain+"/templates/member/images/live/a_banner11.png",
        masterDomain+"/templates/member/images/live/a_banner12.png",
        masterDomain+"/templates/member/images/live/a_banner13.png",
        masterDomain+"/templates/member/images/live/a_banner14.png",
        masterDomain+"/templates/member/images/live/a_banner15.png"
    ];
    $(".modal_main ul li").click(function () {
        $(".modal_main ul li").removeClass('active');
        $(this).addClass('active');
        $(".default_tip").html('');
        $(".live_banner").css({
            'background': 'url(' + backgrounds[$(this).val()] + ') no-repeat center',
            'background-size': 'cover'
        });
        $(".sel_modal").css("display", "none");
    });
    //推流地址
    $("#myform").submit(function(e){
        e.preventDefault();
    })
    $('.btn_create').click(function(){
        var type = $(".live_sel .active").attr("data-id");
        $("#show").val(type);
        var litpic = $('#litpic');
		if(litpic.val() == ''){
			errmsg(litpic,'请上传直播封面');
			$(window).scrollTop(0);
			return false;
		}
		if($('#title').val() == ''){
			errmsg(litpic,'请填写直播标题');
			$(window).scrollTop(0);
			return false;
		}
		if($('#live_class').val() == 0){
			errmsg(litpic,'请选择直播分类');
			$(window).scrollTop(0);
			return false;
		}
		var style = $('#live_style').val();
		if(style == 0){
			//errmsg(litpic,'请选择直播类型');
			//$(window).scrollTop(0);
			//return false;
		}else if(style == 2){
			if($('#password').val() == ''){
				errmsg(litpic,'请填写密码');
				$(window).scrollTop(0);
				return false;
			}
		}else if(style == 3){
			if($('#start_collect').val() ==0 || $('#start_collect').val() == ''){
				errmsg(litpic,'请填写开始收费');
				$(window).scrollTop(0);
				return false;
			}
			if($('#end_collect').val() ==0 || $('#end_collect').val() == ''){
				errmsg(litpic,'请填写结束收费');
				$(window).scrollTop(0);
				return false;
			}
		}
		if($('#live_liuchang').val() == 0){
			errmsg(litpic,'请选择直播流畅度');
			$(window).scrollTop(0);
			return false;
		}
        $.ajax({
            url: masterDomain + "/include/ajax.php?service=live&action=getPushSteam",
            type: 'post',
            dataType: 'jsonp',
            async : false,   //注意：此处是同步，不是异步
            data:$("#myform").serialize(),
            success: function (data) {
                if(data && data.state == 100){
                    //getAddress();
                    window.location.href = userDomain+'?id='+data.info.id;
                }else{
                    alert(data.info)
                }
            },
            error: function(){
                alert("请重新提交表单");
            }
        })

    });
});
//发布直播生成推流地址
function getAddress(){
    $.ajax({
        url: masterDomain + "/include/ajax.php?service=live&action=getPushSteam",
        type: "GET",
        dataType : "jsonp",
        success: function(data){
            if (data && data.state != 200) {
                var url=data.info.pushurl;

                console.log(url);
                return true;
            }
        }
    });
}
//直播详情--点击屏幕显示与隐藏
$(function(){
    $('.empty_box').on('click',function(){
        $('.vPer_box').toggle();
        $('.chat_box').toggle();
        $('.live_like').toggle();
    });
    $('.vLive_con').bind('click', function(){
      $('.empty_box').click();
    });
});
