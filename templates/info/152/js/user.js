$(function(){

    //大图切换
    $(".sale_slide").slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: true,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {if (i == 0) {$(".sprev").click()} else if (i % 6 == 0) {$(".snext").click()}}});

    //小图左滚动切换
    $(".sale_slide .thumb").slide({mainCell: "ul",delayTime: 300,vis: 6,scroll: 6,effect: "left",autoPage: true,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});

    if($("#qrcode").size() > 0){
        $("#qrcode").qrcode({
            render: window.applicationCache ? "canvas" : "table",
            width: 114,
            height: 114,
            text: huoniao.toUtf8(window.location.href)
        });
    }
    //二维码看
    $(".con_ul .sqcode").hover(function(){
        $(".qrcode").show();
    }, function(){
        $(".qrcode").hide();
    });

    $('.storebox').delegate('.btn_gz', 'click', function(event) {
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            huoniao.login();
            return false;
        }
        var t = $(this), type = t.hasClass("btn_ygz") ? "0" : "1";
        $.ajax({
            url : masterDomain + "/include/ajax.php?service=member&action=followMember&id=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(type == '1'){
                        // 收藏成功
                        t.addClass('btn_ygz').html('已关注');
                    }else{
                        t.removeClass('btn_ygz').html('<i></i>关注');;
                    }
                }else{
                    alert(data.info);
                    window.location.href = masterDomain + '/login.html';

                }
            }
        })

    });

    $.fn.autoHeight = function(){
        function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }
        this.each(function(){
            autoHeight(this);
            $(this).on('keyup', function(){
                autoHeight(this);
            });
        });
    }
    $('textarea[autoHeight]').autoHeight();

})
