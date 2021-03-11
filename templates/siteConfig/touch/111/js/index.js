$(function(){
  // banner轮播图
  new Swiper('.banner .swiper-container', {pagination: '.banner .pagination',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

  //微信端隐藏退出按钮
    if(device.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
        $('.logout').hide();
    }

  //同城头条动态数据
    $.ajax({
        type: "POST",
        url: "/include/ajax.php",
        dataType: "json",
        data: 'service=article&action=alist&flag=h&pageSize=10',
        success: function(data) {

            if(data.state == 100){
                var tcNewsHtml = [], list = data.info.list;
                var step = 1;
                var img = '', imgUrl = '';

                for (var i = 0; i < list.length; i++){
                    if(step == 1){
                        tcNewsHtml.push('<div class="swiper-slide swiper-no-swiping"><div class="mlBox">');
                        tcNewsHtml.push('<p><a href="'+list[i].url+'"><span>['+list[i].typeName[(list[i].typeName.length)-1]+']</span>'+list[i].title+'</a></p>');
                        if(list[i].litpic){
                            img = list[i].litpic;
                            imgUrl = list[i].url;
                        }
                    }

                    if(step == 2){
                        tcNewsHtml.push('<p><a href="'+list[i].url+'"><span>['+list[i].typeName[(list[i].typeName.length)-1]+']</span>'+list[i].title+'</a></p>');
                        if(img == '' && list[i].litpic){
                            img = list[i].litpic;
                            imgUrl = list[i].url;
                        }
                        step = 0;
                    }

                    if(step == 0 || i == list.length - 1){
                        tcNewsHtml.push('</div>');
                        step = 0;
                    }

                    if(img && step == 0){
                        tcNewsHtml.push('<div class="mrBox"><a href="'+imgUrl+'"><img src="'+img+'" alt=""></a></div>');
                    }

                    if(step == 0) {
                        tcNewsHtml.push('</div>');
                    }
                    step++;

                }

                $('.tcNews .swiper-wrapper').html(tcNewsHtml.join(''));
                new Swiper('.tcNews .swiper-container', {pagination: '.tcNews .pagination',direction: 'vertical',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

            }else{
                $('.tcNews').hide();
            }
        },
        error: function(){
            $('.tcNews').hide();
        }
    });

    //导航
    $.ajax({
        type: "POST",
        url: "/include/ajax.php",
        dataType: "json",
        data: 'service=siteConfig&action=siteModule&type=1',
        success: function (data) {
            if(data && data.state == 100){
                var tcInfoList = [], list = data.info;
                for (var i = 0; i < list.length; i++){
                    if(list[i].code != 'special' && list[i].code != 'website'){
                        tcInfoList.push('<li><a href="'+list[i].url+'"><span class="icon-circle"><img src="'+list[i].icon+'"></span><span class="icon-txt">'+list[i].name+'</span></a></li>');
                    }
                }
                $('.tcInfo .swiper-slide ul').html(tcInfoList.join(''));

                // 滑动导航
                var t = $('.tcInfo .swiper-wrapper');
                var swiperNav = [], mainNavLi = t.find('li');
                for (var i = 0; i < mainNavLi.length; i++) {
                    swiperNav.push('<li>'+t.find('li:eq('+i+')').html()+'</li>');
                }

                var liArr = [];
                for(var i = 0; i < swiperNav.length; i++){
                    liArr.push(swiperNav.slice(i, i + 10).join(""));
                    i += 9;
                }

                t.html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
                new Swiper('.swipre00', {pagination: '.pag00', loop: false, grabCursor: true, paginationClickable: true});

            }else{
                $('.tcInfo').hide();
            }
        },
        error: function(){
            $('.tcInfo').hide();
        }
    });

    //本地生活资讯
    if($('.lNews').size() > 0){

        //分类
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=article&action=type',
            success: function (data) {
                if(data && data.state == 100){
                    var ttab = [], list = data.info;
                    for (var i = 0; i < list.length; i++){
                        ttab.push('<li><a href="'+list[i].url+'">'+list[i].typename+'</a></li>');
                    }
                    $('.lNews .ttab').html(ttab.join(''));
                }else{
                    $('.lNews .ttab').hide();
                }
            },
            error: function(){
                $('.lNews .ttab').hide();
            }
        });

        //列表
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=article&action=alist&pageSize=5&group_img=1',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){

                        //多图
                        if(list[i].group_img){
                            newsList.push('<div class="articleBox">');
                            newsList.push('<a href="'+list[i].url+'" class="fn-clear">');
                            newsList.push('<h2>'+list[i].title+'</h2>');
                            newsList.push('<ul class="imgBox fn-clear">');
                            var groupImg = list[i].group_img;
                            for (var g = 0; g < groupImg.length; g++){
                                if(g < 3) {
                                    newsList.push('<li><img src="' + groupImg[g].path + '"></li>');
                                }
                            }
                            newsList.push('</ul>');
                            newsList.push('<p><span>'+list[i].typeName[(list[i].typeName).length-1]+'</span> <span>'+list[i].common+'评论</span> <span>'+huoniao.transTimes(list[i].pubdate, 2)+'</span></p>');
                            newsList.push('</a>');
                            newsList.push('</div>');

                        //单图
                        }else{
                            newsList.push('<div class="articleBox firstBox">');
                            newsList.push('<a href="'+list[i].url+'" class="fn-clear">');
                            if(list[i].litpic) {
                                newsList.push('<div class="aright_"><img src="'+list[i].litpic+'"></div>');
                            }
                            newsList.push('<div class="aleft">');
                            newsList.push('<h2>'+list[i].title+'</h2>');
                            newsList.push('<p><span>'+list[i].typeName[(list[i].typeName).length-1]+'</span> <span>'+list[i].common+'评论</span> <span>'+huoniao.transTimes(list[i].pubdate, 2)+'</span></p>');
                            newsList.push('</div>');
                            newsList.push('</a>');
                            newsList.push('</div>');
                        }

                    }
                    $('.lNews .newsList').html(newsList.join(''));
                }else{
                    $('.lNews .newsList').html('<div class="loading">暂无数据！</div>');
                }
            },
            error: function(){
                $('.lNews .newsList').html('<div class="loading">加载失败！</div>');
            }
        });

    }

    //同城二手
    if($('.tchengInfo').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=info&action=ilist&pageSize=6',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li>');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<img onerror="this.src=\'/static/images/404.jpg\'" src="'+list[i].litpic+'">');
                        newsList.push('<h4>'+list[i].title+'</h4>');
                        var price = '';
                        if(list[i].price_switch == 0){
                            if(list[i].price != 0){
                                price = '<b>' + list[i].price + '</b><span class="symbol">元</span>';
                            }else{
                                price = '价格面议';
                            }
                        }
                        newsList.push('<p class="fn-clear"><span class="pleft">'+price+'</span> <span class="pright">'+huoniao.transTimes(list[i].pubdate, 3)+'</span></p>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.tchengInfo ul').html(newsList.join(''));
                }else{
                    $('.tchengInfo ul').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.tchengInfo ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //黄页
    if($('.huangye').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=business&action=blist&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        if(list[i].tel) {
                            newsList.push('<div class="hright tel"><a href="tel:'+list[i].tel+'"><img src="'+templets+'images/hPhone.png"></a></div>');
                        }
                        newsList.push('<div class="hleft">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="lleft"><img src="'+list[i].logo+'"></div>');
                        newsList.push('<div class="lright">');
                        newsList.push('<h4>'+list[i].title+'</h4>');
                        newsList.push('<span class="tip">'+list[i].typename[(list[i].typename).length-1]+'</span>');
                        newsList.push('<p>'+list[i].address+'</p>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</div>');
                        newsList.push('</li>');
                    }
                    $('.huangye ul').html(newsList.join(''));
                }else{
                    $('.huangye ul').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.huangye ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //热销楼盘
    if($('.recomHouse').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=house&action=loupanList&filter=hot&pageSize=4',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li>');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="hBox">');
                        newsList.push('<img src="'+list[i].litpic+'">');
                        if(list[i].videocount){
                            newsList.push('<div class="hImg"><img src="'+templets+'images/h-video.png"></div>');
                        }
                        if(list[i].quanjingcount){
                            newsList.push('<div class="mark mark1">全景</div>');
                        }
                        if(list[i].shapancount){
                            newsList.push('<div class="mark mark2">沙盘</div>');
                        }
                        newsList.push('</div>');
                        newsList.push('<div class="hIntro">');
                        newsList.push('<div class="htitle fn-clear">');
                        newsList.push('<p>'+list[i].title+'</p>');
                        if(list[i].salestate == 0){
                            newsList.push('<span class="hTip htip2">待售</span>');
                        }else if(list[i].salestate == 1){
                            newsList.push('<span class="hTip htip1">在售</span>');
                        }else if(list[i].salestate == 2){
                            newsList.push('<span class="hTip htip1">尾盘</span>');
                        }else if(list[i].salestate == 3){
                            newsList.push('<span class="hTip htip1">售罄</span>');
                        }
                        newsList.push('</div>');
                        var price = list[i].price;
                        var priceHtml = '';
                        if(price > 0){
                            priceHtml = '<span><b>'+price+'</b></span>';
                            if(list[i].ptype == 1){
                                priceHtml += echoCurrency('short') + '/㎡';
                            }else{
                                priceHtml += '万' + echoCurrency('short') + '/套';
                            }
                        }else{
                            priceHtml = '待定';
                        }
                        newsList.push('<p class="harea">'+priceHtml+'</p>');
                        newsList.push('<p class="telphone">电话 '+list[i].tel+'</p>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.recomHouse').html(newsList.join(''));
                }else{
                    $('.recomHouse').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.recomHouse').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //推荐楼盘
    if($('.recommBox.loupan').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=house&action=loupanList&filter=rec&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<div class="rleft">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<img src="'+list[i].litpic+'">');
                        if(list[i].videocount){
                            newsList.push('<div class="hImg"><img src="'+templets+'images/h-video.png"></div>');
                        }
                        newsList.push('</a>');
                        newsList.push('</div>');
                        newsList.push('<div class="rright">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="rtitle fn-clear">');
                        newsList.push('<p>'+list[i].title+'</p>');
                        if(list[i].salestate == 0){
                            newsList.push('<span class="hTip htip2">待售</span>');
                        }else if(list[i].salestate == 1){
                            newsList.push('<span class="hTip htip1">在售</span>');
                        }else if(list[i].salestate == 2){
                            newsList.push('<span class="hTip htip1">尾盘</span>');
                        }else if(list[i].salestate == 3){
                            newsList.push('<span class="hTip htip1">售罄</span>');
                        }
                        if(list[i].quanjingcount){
                            newsList.push('<span class="mark mark1">全景</span>');
                        }
                        if(list[i].shapancount){
                            newsList.push('<span class="mark mark2">沙盘</span>');
                        }
                        newsList.push('</div>');
                        var price = list[i].price;
                        var priceHtml = '';
                        if(price > 0){
                            priceHtml = '<span><b>'+price+'</b></span>';
                            if(list[i].ptype == 1){
                                priceHtml += echoCurrency('short') + '/㎡';
                            }else{
                                priceHtml += '万' + echoCurrency('short') + '/套';
                            }
                        }else{
                            priceHtml = '待定';
                        }
                        newsList.push('<p class="harea">'+priceHtml+'</p>');
                        newsList.push('<p class="addr"><span>'+list[i].addr[(list[i].addr).length - 2] + '-' + list[i].addr[(list[i].addr).length - 1] +'</span></p>');
                        newsList.push('</a>');
                        newsList.push('<div class="tel"><a href="tel:'+list[i].tel+'"><img src="'+templets+'images/hPhone.png"></a></div>');
                        newsList.push('</div>');
                        newsList.push('</li>');
                    }
                    $('.recommBox.loupan ul').html(newsList.join(''));
                }else{
                    $('.recommBox.loupan ul').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.recommBox.loupan ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //二手房
    if($('.recommBox.second').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=house&action=saleList&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="rleft">');
                        newsList.push('<img src="'+list[i].litpic+'">');
                        newsList.push('</div>');
                        newsList.push('<div class="rright fn-clear">');
                        newsList.push('<div class="rtitle fn-clear"><p>'+list[i].title+'</p></div>');
                        newsList.push('<div class="rArea fn-clear"><p>'+list[i].room+'  '+list[i].area+'平米</p>  <span><b>'+(list[i].price > 0 ? list[i].price + '</b>万' : '<b>面议')+'</b></span></div>');
                        newsList.push('<div class="price fn-clear"><p>'+list[i].community+'</p> '+(list[i].unitprice > 0 ? ' <span>均价' + list[i].unitprice + echoCurrency('short') + '</span>' : '')+'</div>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.recommBox.second ul').html(newsList.join(''));
                }else{
                    $('.recommBox.second ul').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.recommBox.second ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //租房
    if($('.recommBox.third').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=house&action=zuList&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="rleft">');
                        newsList.push('<img src="'+list[i].litpic+'">');
                        newsList.push('</div>');
                        newsList.push('<div class="rright fn-clear">');
                        newsList.push('<div class="rtitle fn-clear">'+list[i].title+'</div>');
                        newsList.push('<div class="rArea fn-clear"><p>'+list[i].rentype+'  '+list[i].room+'  '+list[i].area+'平米</p>  <span><b>'+(list[i].price > 0 ? list[i].price + '</b>'+echoCurrency('short')+'/月' : '<b>面议')+'</b></span></div>');
                        newsList.push('<div class="price fn-clear"><p>'+list[i].community+'</p></div>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.recommBox.third ul').html(newsList.join(''));
                }else{
                    $('.recommBox.third ul').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.recommBox.third ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //企业招聘
    if($('.job_zhaopin').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=post&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="mainTitle fn-clear">');
                        newsList.push('<h4>'+list[i].title+'</h4>');
                        if(list[i].isbid == 1){
                            newsList.push('<span class="jTip tip1">顶</span>');
                        }
                        if((list[i].property).indexOf('u') > -1){
                            newsList.push('<span class="jTip tip2">急</span>');
                        }
                        newsList.push('<span class="jTime">'+list[i].timeUpdate+'</span>');
                        newsList.push('</div>');
                        newsList.push('<div class="mainSalary fn-clear"><p><b>'+list[i].salary+'</b>'+(list[i].salary != '面议' ? '元' : '')+'</p> <span class="jPos">'+list[i].type+'</span></div>');
                        newsList.push('<div class="mainExper fn-clear"><p>'+list[i].experience+'工作经验 '+list[i].educational+'</p> <span >'+list[i].addr[(list[i].addr).length - 2] + '-' + list[i].addr[(list[i].addr).length - 1] +'</span></div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_zhaopin').html(newsList.join(''));
                }else{
                    $('.job_zhaopin').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_zhaopin').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //一句话招聘
    if($('.job_sentence0').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=sentence&type=0&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    var url = $('.job_sentence0').next('.moreBox').find('a').attr('href');
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+url+'">');
                        newsList.push('<div class="mainTitle fn-clear"><h4>'+list[i].title+'</h4> <span class="jTime">'+list[i].pubdate+'</span></div>');
                        newsList.push('<div class="mainSalary fn-clear"><span class="jTel">'+list[i].contact+'</span><span class="jPeo">'+list[i].people+'</span></div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_sentence0').html(newsList.join(''));
                }else{
                    $('.job_sentence0').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_sentence0').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //一句话求职
    if($('.job_sentence1').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=sentence&type=1&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    var url = $('.job_sentence1').next('.moreBox').find('a').attr('href');
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+url+'">');
                        newsList.push('<div class="mainTitle fn-clear"><h4>'+list[i].title+'</h4> <span class="jTime">'+list[i].pubdate+'</span></div>');
                        newsList.push('<div class="mainSalary fn-clear"><span class="jTel">'+list[i].contact+'</span><span class="jPeo">'+list[i].people+'</span></div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_sentence1').html(newsList.join(''));
                }else{
                    $('.job_sentence1').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_sentence1').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //最新简历
    if($('.job_resume').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=resume&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="jleft"><img src="'+list[i].photo+'" onerror="this.src=\'/static/images/noPhoto_100.jpg\'"></div>');
                        newsList.push('<div class="jright">');
                        newsList.push('<h4>'+list[i].name+' <span>'+(list[i].salary > 0 ? list[i].salary : '面议')+'</span></h4>');
                        newsList.push('<div class="jInfo">'+(list[i].sex == 1 ? '女' : '男')+'  '+list[i].age+'岁 '+list[i].workyear+'年 '+list[i].educational+'</div>');
                        newsList.push('<p>期望职位：'+list[i].type+'</p>');
                        newsList.push('<p>期望地点：'+list[i].addr[(list[i].addr).length - 2] + '-' + list[i].addr[(list[i].addr).length - 1] +'</p>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_resume').html(newsList.join(''));
                }else{
                    $('.job_resume').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_resume').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //最新入驻企业
    if($('.job_business').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=company&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="jleft"><img src="'+list[i].logo+'"></div>');
                        newsList.push('<div class="jright">');
                        newsList.push('<h4 class="fn-clear"><p>'+list[i].title+'</p> '+(list[i].license ? '<span class="require">认证</span>' : '')+'</h4>');
                        newsList.push('<div class="pMark fn-clear"><span class="jmark">'+list[i].scale+'</span><span class="jPos">'+list[i].industry+'</span></div>');
                        newsList.push('<p>该企业有 <span>'+list[i].pcount+'</span> 个招聘职位 </p>');
                        newsList.push('<p>地址：'+list[i].addr[(list[i].addr).length - 2] + '-' + list[i].addr[(list[i].addr).length - 1] +'</p>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_business').html(newsList.join(''));
                }else{
                    $('.job_business').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_business').html('<li class="loading">加载失败！</li>');
            }
        });
    }

    //职场资讯
    if($('.job_news').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=news&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="fn-clear">');
                        newsList.push('<a href="'+list[i].url+'">');
                        if(list[i].litpic) {
                            newsList.push('<div class="jleft"><img src="' + list[i].litpic + '"></div>');
                        }
                        newsList.push('<div class="jright">');
                        newsList.push('<h4 class="fn-clear">'+list[i].title+'</h4>');
                        newsList.push('<div class="pMark fn-clear"><span class="jmark">'+list[i].typename+'</span></div>');
                        newsList.push('<p> <span class="w-time"><i></i>'+huoniao.transTimes(list[i].pubdate, 2)+'</span> <span class="w-see"><i></i>'+list[i].click+'</span></p>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.job_news').html(newsList.join(''));
                }else{
                    $('.job_news').html('<li class="loading">暂无数据！</li>');
                }
            },
            error: function(){
                $('.job_news').html('<li class="loading">加载失败！</li>');
            }
        });
    }


    // 推荐楼盘
    $(".recommendBox .recomTop ul li a").bind('click', function(){
      $(this).parent().addClass("curr").siblings().removeClass("curr");
      var i=$(this).parent().index();
      $('.recommBox').eq(i).addClass("show").siblings().removeClass("show");
        audio1.play();
    });

     // 招聘求职
    $(".job .jobTab ul li a").bind('click', function(){
      $(this).parent().addClass("curr").siblings().removeClass("curr");
      var i=$(this).parent().index();
      $('.jobMain').eq(i).addClass("show").siblings().removeClass("show");
        audio1.play();
    });


    var lng = lat = 0;
    var page = 1, isload = false;

    // 获取推荐商家
    function getList(){
        if(isload) return false;
        isload = true;
        var pageSize = 4;
        $.ajax({
            url: masterDomain+'/include/ajax.php?service=business&action=blist&store=2&page='+page+'&pageSize='+pageSize+'&lng='+lng+'&lat='+lat,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var html = [];

                    for(var i = 0; i < data.info.list.length; i++){
                        var d = data.info.list[i];

                        html.push('<li class="fn-clear">');
                        html.push('  <div class="rleft">');
                        html.push('    <a href="'+d.url+'"><img src="'+(d.logo ? d.logo : (templets + 'images/fShop.png'))+'" alt=""></a>');
                        if(d.face_qj == "1"){
                            html.push('    <div class="mark mark1">全景</div>');
                        }
                        if(d.face_video == "1"){
                            html.push('    <div class="mark mark3">视频</div>');
                        }
                        html.push('  </div>');
                        html.push('  <div class="rright">');
                        html.push('    <div class="rtitle fn-clear"><a href="'+d.url+'">'+(d.top == "1" ? '<i></i>' : '')+'<p>'+d.title+'</p> '+(d.type == "2" ? '<em></em>' : '')+'&nbsp;</a></div>');
                        html.push('    <p class="comment"><span class="starbg"><i class="star" style="width: '+(d.sco1 / 5 * 100)+'%;"></i></span>'+d.comment+'评论</p>');
                        html.push('    <p class="addr">'+d.address+'</p>');
                        if(d.tel != ""){
                            html.push('    <a href="tel:'+d.tel+'" class="tel">');
                            html.push('      <img src="'+templets+'images/hPhone.png" alt="">');
                            html.push('    </a>');
                        }
                        html.push('  </div>');
                        html.push('</li>');
                    }

                    if($('.recomBus ul').find('.loading').size() > 0){
                        $('.recomBus ul').html(html.join(''));
                    }else{
                        $('.recomBus ul').append(html.join(''));
                    }

                    if(data.info.pageInfo.totalPage <= page){
                        $('.recomBus .btnMore').text('已加载全部数据').addClass('disabled');
                    }else{
                        isload = false;
                    }

                }else{
                    $('.recomBus .btnMore').text('暂无相关信息');
                    $('.recomBus .loading').text('暂无数据！');
                }
            },
            error: function(){
                if(page == 1){
                    $('.recomBus .loading').text('网络错误，请重试');
                }
                $('.recomBus .btnMore').text('网络错误，请重试');
                page = page > 1 ? page - 1 : 1;
            }
        })
    }
    function checkLocal(){
        var local = false;
        var localData = utils.getStorage("user_local");
        if(localData){
            var time = Date.parse(new Date());
            time_ = localData.time;
            // 缓存1小时
            if(time - time_ < 3600 * 1000){
                lat = localData.lat;
                lng = localData.lng;
                local = true;
            }

        }

        if(!local){
            HN_Location.init(function(data){
                if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
                    lng = lat = -1;
                    getList();
                }else{
                    lng = data.lng;
                    lat = data.lat;

                    var time = Date.parse(new Date());
                    utils.setStorage('user_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': data.address}));

                    getList();
                }
            })
        }else{
            getList();
        }

    }

    $('.recomBus .btnMore').click(function(){
        var t = $(this);
        if(isload || t.hasClass('disabled')) return;
        page++;
        getList();
    })

    getList();

    // checkLocal();



    //验证当前访问页面是否为当前城市
	// var changAutoCity = $.cookie("HN_changAutoCity");
	var siteCityInfo = $.cookie("HN_siteCityInfo");
    var changeAutoCity;
	if(siteCityInfo){
		HN_Location.init(function(data){
	    if (data != undefined && data.province != "" && data.city != "" && data.district != "" && !changeAutoCity) {
	      var province = data.province, city = data.city, district = data.district;
				$.ajax({
			    url: "/include/ajax.php?service=siteConfig&action=verifyCity&region="+province+"&city="+city+"&district="+district,
			    type: "POST",
			    dataType: "json",
			    success: function(data){
			      if(data && data.state == 100){
					var siteCityInfo_ = JSON.parse(siteCityInfo);
					var nowCityInfo = data.info;
					if(siteCityInfo_.cityid != nowCityInfo.cityid){
						// $.cookie("HN_changAutoCity", '1', {expires: 1, path: '/'});

						changeAutoCity = $.dialog({
                          width: 250,
                          buttons: {
                            "取消": function() {
                              this.close();
                            },
                            "确定": function() {

							  var channelDomainClean = typeof masterDomain != 'undefined' ? masterDomain.replace("http://", "").replace("https://", "") : window.location.host;
                              var channelDomain_1 = channelDomainClean.split('.');
                              var channelDomain_1_ = channelDomainClean.replace(channelDomain_1[0]+".", "");

                              channelDomain_ = channelDomainClean.split("/")[0];
                              channelDomain_1_ = channelDomain_1_.split("/")[0];

                              $.cookie(cookiePre + 'siteCityInfo', JSON.stringify(nowCityInfo), {expires: 7, domain: channelDomainClean, path: '/'});
                              $.cookie(cookiePre + 'siteCityInfo', JSON.stringify(nowCityInfo), {expires: 7, domain: channelDomain_1_, path: '/'});

                              location.href = nowCityInfo.url + '?currentPageOpen=1' + (device.indexOf('huoniao') > -1 ? '&appIndex=1' : '');
                            }
                          },
                          content: '<div style="text-align: center"> 检测到你目前的城市为<div style="font-size: .5rem; color: #ff6600; padding: .1rem 0;"><strong>' + nowCityInfo.name + '</strong></div>是否切换 </div>'
                        }).open();

					}
			      }
			    }
			  })
	    }
	  })
	}

});
