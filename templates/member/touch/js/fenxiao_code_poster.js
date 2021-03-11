$(function () {

    //成功案例
    var ssFlag = true;
    var slen = $('.topSwiper .swiper-slide').length;
    var hasFlag = true;//后台海报
    if($('.topSwiper .swiper-slide:first-child').hasClass('noLi')){
        hasFlag = false;//默认海报
    }
    var topSwiper = new Swiper('.topSwiper .swiper-container', {
        pagination: {el: '.topSwiper .pagination'} ,
        slideClass:'swiper-slide',
        loop: true,
        grabCursor: true,
        paginationClickable: true,
        slidesPerView :1.4,
        spaceBetween : 35,
        centeredSlides : true,
        on: {
            init: function(swiper){
                this.emit('transitionEnd');
            },
            slideChangeTransitionEnd: function(){
                if(ssFlag && hasFlag){//只生成一次即可
                    setTimeout(function(){
                        codePosition();
                    },200)
                }

            },

          },

    });



    //如果没有菜单内容，则隐藏APP端右上角菜单
    if (device.indexOf('huoniao') > -1 && ($('.dropnav').size() == 0 || $('#navlist').size() == 0)) {
        setTimeout(function(){
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('hideAppMenu', {}, function(){});
            });
        }, 500);
    }
    function codePosition(){
        ssFlag = false;
        var ss = 0,len = $('.topSwiper .swiper-slide').length;
        $('.swiper-slide').each(function(){
            var x = parseInt($(this).attr('data-xAxis')),
                y = parseInt($(this).attr('data-yAxis')),
                codewidth = parseInt($(this).attr('data-codewidth')),//二维码宽度
                codeheight = parseInt($(this).attr('data-codeheight')),//二维码高度
                cropwidth = parseInt($(this).width()),//图片裁剪后宽度--就是这个slide
                imgwidth = parseInt($(this).attr('data-imgwidth')),//原图宽度
                imgheight = parseInt($(this).attr('data-imgheight'));//原图高度
            var ratio1 = imgwidth/cropwidth;
            var sh = (codewidth/ratio1).toFixed(2);
            var st = (codeheight/ratio1).toFixed(2);
            var sx = (x/ratio1).toFixed(2);
            var sy = (y/ratio1).toFixed(2);
            $(this).find('.code-img').css({'display':'block','left':sx+'px','top':sy+'px','width':sh+'px','height':st+'px'})
            ss++;
        })
        if(ss == len){
            setTimeout(function(){
			posterMake();
		},300)
        }


    }
    if(!hasFlag){
      setTimeout(function(){
			posterMake();
		},300)
    }
    function posterMake(){
        $.ajax({
            url: "/include/ajax.php",
            type: "POST",
            data: {
                service: 'siteConfig',
                action: 'getWeixinQrPost',
                module: 'siteConfig',
                type: 'index',
                aid: '0',
                title: postConfig.title,
                description: postConfig.description,
                imgUrl: postConfig.imgUrl,
                link: postConfig.link
            },
            async: false,
            dataType: "json",
            success: function (response) {
                if(response.state == 100){
                    $('.code-img img').attr('src', '/include/qrcode.php?data=' + response.info);
                }

                var i=1;
                for(i=1;i<=slen;i++){
                    getCavas(i);
                }
            },
            error: function (xhr, status, error) {
                var i=1;
                for(i=1;i<=slen;i++){
                    getCavas(i);
                }
            }
        });
    }





    function getCavas(i){
        //生成图片
        html2canvas(document.querySelector(".imgBox"+i), {
            'backgroundColor':null,
            'useCORS':true,
            'taintTest':false,

        }).then(canvas => {
            var a = canvasToImage(canvas);
            $('.drawImg'+i).show();
            $('.drawImg'+i).html(a);
            $('.imgBox'+i).hide();
            // console.log(imgw)
        });
        function canvasToImage(canvas) {
            var image = new Image();
            var imageBase64 = canvas.toDataURL("image/jpeg",1);
            image.src = imageBase64;  //把canvas转换成base64图像保存
            //utils.setStorage("huoniao_poster" , imageBase64);
            return image;
        }
    }
    $(".swiper-slide-active .drawImg").click(function () {
        console.log(11);
    });

    //长按
    var flag=1  //设置长按标识符
    var timeOutEvent=0;
    $(".drawImg").on({
        touchstart: function(e){
            if(flag){
                clearTimeout(timeOutEvent);
                timeOutEvent = setTimeout("longPress()",800);
            }
            // e.preventDefault();
        },
        touchmove:function () {
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
        },
        touchend:function () {
            flag=1;
        }

    });

});


//长按执行的方法
function longPress(){
    var imgsrc = $(".swiper-slide-active .drawImg").find('img').attr('src');
    if(imgsrc==''||imgsrc==undefined){
        alert(langData['siteConfig'][44][94]);//下载失败，请重试
        return 0
    }
    flag=0;
    utils.setStorage("huoniao_poster" , imgsrc);
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(
            'saveImage',
            {'value': 'huoniao_poster'},
            function(responseData){
                if(responseData == "success"){
                    setTimeout(function(){
                        flag=1;
                    }, 200)
                }

            },

        );
    });
}
