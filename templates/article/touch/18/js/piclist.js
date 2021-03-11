$(function(){

    // 显示更多导航
    $('#btn_toggle').click(function(){
        var a = $(this),s = a.children('span').text();
        a.toggleClass('open').children('span').text(s == '更多' ? '收起' : '更多');
        $('.chanellist .row2').toggle();
    })


	var loadmoreLock = false;
	$(window).scroll(function(){
		var sct = $(window).scrollTop();
        if(sct > $('.chanellist').offset().top) {
            $('.chanel_fix').addClass('fixed');
        } else {
            $('.chanel_fix').removeClass('fixed');
        }

        if(loadmoreLock) return;
		if(sct + $(window).height() + 50 > $('.loadmore').offset().top) {
			$('.loadmore').show();
            loadmoreLock = true;
            var box = $('#picWrap');
            box.find('.error').remove();
            var url = masterDomain + "/include/ajax.php?service=pic&action=alist&page=" + page + "&pageSize=" + pageSize + "&orderby=1";
            $.ajax({
                url: url,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    console.log('suc')
                    if(data && data.state != 200){
                        if(data.state == 101){
                            $('.loadmore').hide();
                            box.append("<p class='error'>"+data.info+"</p>");
                        }else{
                            var list = data.info.list, html = [], html1 = [];
                            for(var i = 0; i < list.length; i++){
                                var item        = [],
                                    title       = list[i].title,
                                    litpic      = list[i].litpic,
                                    common      = list[i].common,
                                    url         = list[i].url,
                                    description = list[i].description;
                                var img = huoniao.changeFileSize(litpic, "big");
                                item.push('<div class="pic-item">');
                                    item.push('<a href="' + url + '">');
                                        item.push('<img src="' + img + '" alt="">')
                                        item.push('<div class="info">');
                                            item.push('<span class="count"><i class="icon-pl2"></i>' + common + '</span>');
                                            item.push('<h3>' + title + '</h3>');
                                            item.push('<p>' + description + '</p>');
                                        item.push('</div>');
                                    item.push('</a>');
                                item.push('</div>');

                                html.push(item.join(""));
                            }//for end

                            $('.loadmore').hide();
                            box.append(html.join(""));
                            page++;
                            if(list.length = pageSize) {
                                loadmoreLock = false;
                            }
                        }
                    } else {
                        $('.loadmore').hide();
                        box.append("<p class='error'>数据获取失败，请稍候访问！</p>");
                        loadmoreLock = false;
                    }
                },
                error: function(){
                    $('.loadmore').hide();
                    box.append("<p class='error'>数据获取失败，请稍候访问！</p>");
                    loadmoreLock = false;
                }
            })
        }
    })

})