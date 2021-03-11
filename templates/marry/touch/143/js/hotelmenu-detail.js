$(function () {

    $('.navbox li').click(function(){
        $(this).addClass('curr').siblings().removeClass('curr');
        var i = $(this).index();
        $('.contentBox .content-item').eq(i).addClass('show').siblings().removeClass('show');
    });

});