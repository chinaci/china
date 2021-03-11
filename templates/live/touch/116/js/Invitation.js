$(function(){

    $('.module .module-list li').click(function(){
        var t = $(this),index = t.index();
        if(!t.hasClass('active')){
            t.addClass('active');
            t.find('.chooseed-box').css('display','flex');
            t.siblings().removeClass('active');
            t.siblings().find('.chooseed-box').css('display','none');
        }

        $(".main ul li:eq("+index+")").find('img').each(function(){
           $(this).attr('src', $(this).attr('data-src'));
        });

        $(".main ul li:eq("+index+")").addClass('show').show();
        $(".main ul li:eq("+index+")").removeClass('show').siblings().hide();

        html2canvas(document.querySelector("#main ul"), {
            'backgroundColor': null,
            'time':0,
            'useCORS':true
        }).then(canvas => {
            var a = canvasToImage(canvas);
       		 $('.drawImg').html(a);
       		
    	});
    });
    $('.module .module-list li:eq(0)').click();



    function canvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");  //把canvas转换成base64图像保存
        return image;
    }

    $('.drawImg').delegate('img', 'click', function(){
        window.open($(this).attr('src'));
    });







})















