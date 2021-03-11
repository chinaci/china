$(function(){

    var mySwiper = new Swiper('.swiper-container', {
        slideClass: 'slideshow-item',
        pagination: '.pagination',
        loop: true,
        grabCursor: true,
        paginationClickable: true,
        autoplayDisableOnInteraction : false,
        autoplay: 2000
    });

    var device = navigator.userAgent;
    if (device.indexOf('huoniao_iOS') > -1) {
        $("body").addClass("padTop20")
    }

    // 吸顶
    var xiding = $(".choice");
    var chtop = parseInt(xiding.offset().top);
    $(window).on("scroll", function() {
        var thisa = $(this);
        var st = thisa.scrollTop();
        if (st >= chtop) {
            $(".choice").addClass('lead_top1');
        } else {
            $(".choice").removeClass('lead_top1');
        }
    });
    var objId = $('#listCon'), page= 1,isload = false;
    var range = 100; //距下边界长度/单位px
    var totalheight = 0;
	//下拉列表
 	$('.choice ul li').click(function(){
        var $t = $(this),
            index = $t.index(),
            box = $('.choice-list .ol').eq(index);
        if(box.css("display")=="none") {
            $t.addClass('lisc').siblings().removeClass('lisc');
            box.show().siblings().hide();
            $('.disk').show();

            if(index == 0){
                var cur = box.find('.cl-left li.bc');
                if(cur.attr('data-id') != 0 && $('#typeCon').html() == ''){
                    // getType('type',cur.attr('data-id'),typeid);
                }
            }
        }else{
            $t.removeClass('lisc');
            box.hide();
            $('.disk').hide();
        }
    })
    // 点击下拉列表类别
    $('.choice-list ul').delegate("li","click",function(){
        var t = $(this),
            ti = t.index(),         // 0:不限
            id = t.attr('data-id'),
            p = t.closest('.ol'),
            pi = p.index(),         // 0:类别,1:地区
            box = t.closest('.box'),
            boxi = box.index(),     // 0:1级,1:2级
            type = t.children('a').text();
        var action = pi == 0 ? 'type' : 'addr';

        t.addClass('bc').siblings('li').removeClass('bc');

        if(pi == 0){
            typeid = id;
        }else{
            addrid = id;
        }

        if(boxi == 0 && ti == 0){
            $('.disk').click();
            p.find('.cl-rr').html('');
            $('.choice ul li').eq(pi).find('span').html(type + (pi == 0 ? '<font id="count">(0)</font>' : ''));
            getList(1);
            return;
        }
        if(boxi == 0){
            p.find('.cl-rr').html('');
            if(ti == 0){
                $('.disk').click();
            }else{
                getType(action,id, '', function(){
                    $('.choice ul li').eq(pi).find('span').html(type + (pi == 0 ? '<font id="count">(0)</font>' : ''));
                });
            }
        }else{
            $('.disk').click();
            if(ti == 0){
                type = p.find('.cl-left li.bc a').text();
            }
            $('.choice ul li').eq(pi).find('span').html(type + (pi == 0 ? '<font id="count">(0)</font>' : ''));
            getList(1);
        }
    })

    // 列表body置顶
    $('.choice ul li').click(function(){
        var dom = $('.choice ul li')
        if (dom.hasClass('lisc')) {
            $('body').addClass('by')
        }else{
            $('body').removeClass('by')
        }
    })

    //遮罩层
    $('.disk').click(function(){
        $('.disk').hide();
        $('.choice-list .ol').hide();
        $('body').removeClass('by');
        $('.choice li').removeClass('lisc');
    })

    // 获取分类
    function getType(action,id,currid, callback){
        if(id == undefined || id == '' || id == 0) return;
        $.ajax({
            url: masterDomain+'/include/ajax.php?service=quanjing&action='+action+'&type='+id,
            type: 'GET',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    if(data.info.length > 0){
                        var html = ['<li data-id="'+id+'"><a href="javascript:;">不限</a></li>'], info = data.info;
                        for(var i = 0; i < info.length; i++){
                            var obj = info[i];
                            var cls = currid == obj.id ? ' class="bc"' : '';
                            html.push('<li data-id="'+obj.id+'"'+cls+'><a href="javascript:;">'+obj.typename+'</a></li>');
                        }
                        $('#'+action+'Con').html(html.join(""));
                    }else{
                        getList(1);
                        $('.disk').click();
                    }
                }else{
                    callback && callback();
                    getList(1);
                    $('.disk').click();
                }

            },
            error: function(){
                console.log('err')
            }
        })
    }

    function getList(tr){
        //$(window).scrollTop(0);
        isload = true;
        var data = [], orderby = $('.sort li.bc').attr("data-id");
        data.push('typeid='+typeid);
        data.push('orderby='+orderby);
        /*data.push('addrid='+addrid);
        if(keywords != ''){
            data.push('keywords='+keywords);
            keywords = '';
            var url = window.location.href.split("?")[0];
            window.history.pushState({}, 0, url);
        }*/
        if(tr){
            page = 1;
            objId.html('<li class="loading">正在加载，请稍后</li>');
        }else{
            objId.find('.loading').remove();
            objId.append('<li class="loading">正在加载，请稍后</li>');
        }
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=quanjing&action=qlist&pageSize=10"+"&page="+page,
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                objId.find('.loading').remove();
                if (data && data.state != 200) {
                    if (data.state == 101) {
                        objId.html('<li class="loading">暂无相关信息！</li>');
                        load_btn = false;
                    } else {
                        load_btn = true;
                        var list = data.info.list, html = [];
                        var pageInfo = data.info.pageInfo;
                        if(list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var obj = list[i], item = [];
                                item.push('<li>');
                                item.push('<a href="'+obj.url+'">');
                                if(obj.litpic){
                                    item.push('<img src="'+obj.litpic+'">');
                                }
                                item.push('<h5>'+obj.title+'</h5>');
                                item.push('<p class="fn-clear"><span><i class="v-play"></i>'+obj.click+'</span><span><i class="v-comment"></i>'+obj.common+'</span><span><i class="v-time"></i>'+huoniao.transTimes(obj.pubdate, 2)+'</span></p>');
                                item.push('</a>');
                                item.push('</li>');

                                html.push(item.join(""));
                            }

                            objId.append(html.join(""));
                            if (page >= data.info.pageInfo.totalPage) {
                                isload = true;
                                objId.find('.loading').remove();
                                objId.append('<div class="loading">到底啦！</div>');
                            }
                            if (page >= pageInfo.totalPage) {
                                isload = true;
                            } else {
                                isload = false;
                            }
                        }
                        $('#count').text('('+pageInfo.totalCount+')');
                    }
                } else {
                    $('#count').text('(0)');
                    objId.html('<li class="loading">暂无相关信息！</li>');
                }
            },
            error: function(){
                isload = false;
            }
        })
    }

    getList();
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight && !isload) {
            page++;
            getList();
        }
    });

})
