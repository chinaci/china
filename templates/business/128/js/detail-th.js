// 公司详情切换
$('.intro .view-title span').click(function () {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    var  i = $(this).index();
    $('.intro .shop-view  .content').eq(i).addClass('show').siblings().removeClass('show');
});


// 商家动态切换
$('.view-content .nav span').click(function () {
    //$(this).addClass('active');
    //$(this).siblings().removeClass('active');
    //var  i = $(this).index();
    //$('.view-content .con .con-item').eq(i).addClass('show').siblings().removeClass('show');
});