$(function(){

    // 个人列表
    $(".tab").click(function(){
        if( $(".lead .tab-list").css("display")=='none' ) {
            $(".lead .tab-list").show();
        }else{
            $(".lead .tab-list").hide();
        }
    });

    // 搜索
    $('.search_btn').click(function(){
        var keywords = $('#keywords'), val = keywords.val();
        if($.trim(val) == ''){
            alert('请输入关键词');
            keywords.focus();
            return false;
        }else{
            $('.search_form').submit();
        }
    })
})