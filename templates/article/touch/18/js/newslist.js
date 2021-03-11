$(function(){

    $('img').scrollLoading();

    // 显示/隐藏头部频道导航
    $('.toggleChanels').click(function(){
        $(this).add('.chanels').toggleClass('open');
    })

})