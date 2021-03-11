var bodyWidth,winW,winH;

var slider;
function returnWinSize(w,h,b){
    winW = w;
    winH = h;
    slider = $('#picscroll').css({'height':winH - 55 + 'px'}).slider({autoScroll:0,loop:0,changedFun:function(n){
        var li = $('#picscroll ul li');
        var active = li.eq(n);
        var title = active.children('img').attr('data-title');
        var des = active.children('img').attr('data-des');
        $('#info .title').text(title);
        $('#info .des').text(des);
        if(!active.hasClass('showed')) {
            var src = active.children('img').attr('data-src');
            active.addClass('showed').children('img').attr('src',src);
        }
        if(n < li.length - 1) {
            var next = li.eq(n+1),
                nextimg = next.find('img'),
                nextsrc = nextimg.attr('data-src');
            nextimg.attr('src',nextsrc);
            next.addClass('showed');
        }
        $('.page').text(++n);
        if($('#main').hasClass('op0')) {
            $('#main').removeClass('op0');
        }
    }});
    $('#picscroll li').css({'line-height':winH - 55 + 'px'});
}

$(function(){
	// 滚动图片
	var picbox = $('#picscroll');
	var hd = $('#header');
	var info = $('#info');
	$('.count').text(picbox.find('li').length);
	picbox.click(function(e){
		if(picbox.hasClass('on')) {
			picbox.removeClass('on');
			hd.css('top',0);
			info.show();
			$('#footerad').removeClass('full');
		} else {
			picbox.addClass('on');
			hd.css('top','-1rem');
			info.hide();
			$('#footerad').addClass('full');
		}
	})
	picbox[0].addEventListener('touchstart',function(e){

	})

	// 列表模式
    $('#toggleShow').click(function(){
        var btn = $(this),bigBox = $('#main'),smallBox = $('#main_small'),smallCon = $('#small_con');
        if(btn.hasClass('on')) {
            btn.removeClass('on');
            smallBox.hide();
            bigBox.show();
        } else {
            btn.addClass('on');
            if(smallCon.html() == '') {
	            var pic = [];
	            var html = [];
	            $('#picscroll img').each(function(i){
	                var img = $(this).attr('data-smallsrc');
	                html.push('<div class="small-item"><i></i><img src="' + img + '" alt="" /></div>');
	            })
	            smallCon.append(html.join(""));
        	}
            bigBox.hide();
            smallBox.show();
        }
    })

    // 点击缩略图返回大图
    $(document).on('click','.small-item',function(){
        var i = $(this).index();
        $('#toggleShow').click();
        console.log(i)
        slider.to(i,0);
    })

    $('.pic_share').click(function(){
        console.log('kkk')
        $('.shearBox').css('top','0');
        $('.shearBox .bg').css({'height':'100%','opacity':1});
    })
    $('#cancelShear').click(function(){
        closeShearBox();
    })

    // 分享
    G('shearBg').addEventListener('touchstart',function(){
        closeShearBox();
    })

    function closeShearBox(){
        $('.shearBox').css('top','-100%');
        $('.shearBox .bg').css({'height':'0','opacity':0});
    }
})
