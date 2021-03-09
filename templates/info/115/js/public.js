$(function(){
    // 判断浏览器是否是ie8
    if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.recom_box:last-child,.toptab li:last-child,.bInfoCon .bIbox:last-child').css('margin-right','0');
        $('.bmain ul li:nth-child(5n),.care_fans ul li:nth-child(5n)').css('margin-right','0');
        $('.main ul.recTop li:last-child, .main ul.recCom li:last-child').css('margin-bottom','0');
        $('.albumBox .slideBox .bd ul li .slide:nth-child(4n)').css('margin-right','0');
        $('.fixedwrap .search .type dd a:last-child').css('border-bottom','none');
    }

    // 手机端、微信端
    $('.app-con .icon-box.app').hover(function(){
        $('.app-down').show();
    },function(){
        $('.app-down').hide();
    });
    $('.app-con .icon-box.wx').hover(function(){
        $('.wx-down').show();
    },function(){
        $('.wx-down').hide();
    });

    $(".search dd a").bind("click", function(){
        var val = $(this).text(), id = $(this).attr("data-id");
        $(".keytype").attr("data-id", id).html(val);
        $(".search dd").hide();
        $(this).addClass('active').siblings().removeClass('active');
        if(val == '信息'){
            $(".form").eq(1).show();
            $(".form").eq(0).hide();
        }else{
            $(".form").eq(1).show();
            $(".form").eq(0).hide();
        }
    });


    $('.search .type').hover(function(){
        $(this).find('dd').show();
    },function(){
        $(this).find('dd').hide();
    })

    // 搜索
    $(".search-btn").bind("click", function(){
          var keywords = $(".searchkey"), txt = $.trim(keywords.val()),
              type = $('.search .active').attr('data-type');

          if(txt != ""){
                  location.href = masterDomain +"/info/"+type+".html?keywords="+txt;

          }else{
              keywords.focus();
          }
    }); 

    $('.pub').delegate('.box_collect', 'click', function(event) {
        var t = $(this), type = t.hasClass("collected") ? "del" : "add";
        var detail_id = t.attr("data-id");
        var coll_type = t.attr("data-type");
        $.ajax({
            url : "/include/ajax.php?service=member&action=collect",
            data : {
                'type' : type,
                'module' : 'info',
                'temp' : coll_type,
                'id' : detail_id,
            },
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(data.info == 'has'){
                        alert("您已收藏");
                    }else if(data.info == 'ok'){
                        if(type == 'add'){
                            // 收藏成功
                            t.addClass('collected');
                        }else{
                            t.removeClass('collected');
                        }
                    }
                }else{
                    alert("请登录！");
                    window.location.href = masterDomain + '/login.html';
                }


            }
        })
    });



    $('.main_list,.lmain').delegate('li,.telphone', 'hover', function(event) {
        var type = event.type;
        if(type == "mouseenter"){
            $(this).find('.box_collect').css("display","block");
            $(this).next('.c_telphone').css("display","block");
        }else{
            $(this).find('.box_collect').css("display","none");
            $(this).next('.c_telphone').css("display","none");
        }
    });





    $('.searchkeys').delegate('a', 'click', function() {
        var t = $(this);
        var text = t.text();
        $(".searchkey").val(text);
        $(".form").submit();
    })



})