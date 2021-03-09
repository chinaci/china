$(function () {

    // 关注
    $('.btnCare').click(function(){
        var t = $(this), type = t.hasClass("cared") ? "0" : "1";
        $.ajax({
            url : masterDomain +"/include/ajax.php?service=info&action=follow&vid=" + user_id + '&type=' + type + '&temp=info',
            data : '',
            type : 'get',
            dataType : 'json',
            success : function (data) {
                if(data.state == 100){
                    if(type == '0'){
                        t.removeClass('cared').html('关注');
                    }else{
                        t.addClass('cared').html('已关注');
                    }
                }else{
                    alert(data.info);
                    location.href = masterDomain + '/login.html';

                }
            }
        })

    });




})