$(function () {
    // banner轮播图
    new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2500,}});
    
    $(".recomTab li").on('click',function(e){
        $(this).addClass('active').siblings().removeClass('active');
        var i = $(this).index();
        $('.filter .content').eq(i).addClass('show').siblings().removeClass('show');
    });

    //放大图片
    $.fn.bigImage({
        artMainCon:".introBox",  //图片所在的列表标签
    });

    // 轮播图片放大
    var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".topSwiper").delegate('.slideshow-item', 'click', function() {
        var imgBox = $('.topSwiper .slideshow-item');
        var i = $(this).index();
        $(".videoModal .swiper-wrapper").html("");
        for(var j = 0 ,c = imgBox.length-2; j < c ;j++){
            if(j==0){
                if(detail_video!=''){
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><video width="100%" height="100%" controls preload="meta" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline  x5-video-player-fullscreen="true" id="video" src="'+detail_video+'"  poster="' + imgBox.eq(j).find("img").attr("src") + '"></video></div>');
                }else{
                    $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find("img").attr("src") + '" / ></div>');
                }
            }else{
                $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgBox.eq(j).find("img").attr("src") + '" / ></div>');
            }

        }
        videoSwiper.update();
        $(".videoModal").addClass('vshow');
        $('.markBox').toggleClass('show');
        videoSwiper.slideTo(i, 0, false);
        return false;
    });

    $(".reInfo").delegate('.liBox', 'click', function() {
        var videoBox = $('.reInfo .liBox');
        var t = $(this),  i = t.index();
        $(".videoModal .swiper-wrapper").html("");
        for(var j = 0 ,c = videoBox.length; j < c ;j++){
            var videoSource = videoBox.eq(j).find("a").attr("data-url"), imgpath = videoBox.eq(j).find("img").attr("src");
            if(videoSource!=''){
                $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><video width="100%" height="100%" controls preload="meta" x5-video-player-type="h5" x5-playsinline playsinline webkit-playsinline  x5-video-player-fullscreen="true" id="video" src="'+videoSource+'"  poster="' + imgpath + '"></video></div>');
            }else{
                $(".videoModal .swiper-wrapper").append('<div class="swiper-slide"><img src="' + imgpath + '" / ></div>');
            }
        }
        videoSwiper.update();
        $(".videoModal").addClass('vshow');
        $('.markBox').toggleClass('show');
        videoSwiper.slideTo(i, 0, false);
        return false;
    });

    $(".videoModal").delegate('.vClose', 'click', function() {
        var video = $('.videoModal').find('video').attr('id');
        $(video).trigger('pause');
        $(this).closest('.videoModal').removeClass('vshow');
        $('.videoModal').removeClass('vshow');
        $('.markBox').removeClass('show');
    });







});