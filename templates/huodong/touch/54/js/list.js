$(function(){

    toggleDragRefresh('off');

    var con = $('.list-body'), clist = con.children('ul');

    // 个人列表
    $(".tab").click(function(){
        if( $(".lead .tab-list").css("display")=='none' ) {
            $(".lead .tab-list").show();
        }else{
            $(".lead .tab-list").hide();
        }
    });

    // 价格
    $('.list-4, .jo-3 a').click(function(){
        $('.baoming').slideDown(300);
        $('.black,.baoming').show();
    })
    $('.baoming span,.black').click(function(){
        $('.baoming').slideUp(300);
        $('.black').hide();
    })

    //价格勾选
    $('.baoming ul li').click(function(){
        var x = $(this);
        if (x.hasClass('op-1')) {
            x.removeClass('op-1');
        }else{
            x.addClass('op-1');
            x.siblings().removeClass('op-1');
        }
    })

    // 筛选框
    $('.list-head li').click(function(){
        var $t = $(this),
         index = $t.index(),
           box = $('.fenlei .fenlei-1').eq(index);
         if (box.css("display")=="none") {
            $t.addClass('active').siblings().removeClass('active');
            box.show().siblings().hide();
            $('.mask').show();
         }else{
            $t.removeClass('active');
            box.hide();
            $('.mask').hide();
        }
    })

    // 选择筛选条件
    $('.fenlei li').click(function(){
        var t = $(this), s = t.children('a').text(), id = t.data('id'), p = t.closest('.fenlei-1'), index = p.index();
        if(!t.hasClass('oo')){
            $('.list-head ul li:eq('+index+')').attr('data-id',id).find('span').text(s);
            t.addClass('oo').siblings().removeClass('oo');

            getList(1);
        }
        $('.mask').click();
    })
    // 遮罩层
    $('.mask').on('click',function(){
        $('.mask').hide();
        $('.fenlei .fenlei-1').hide();
        $('.list-head li').removeClass('active');
        $('body').removeClass('by')
    })

    // 列表body置顶
    $('.list-head ul li').click(function(){
        var dom = $('.list-head ul li')
        if (dom.hasClass('active')) {
            $('body').addClass('by')
        }else{
            $('body').removeClass('by')
        }
    })

    var pageInfo = {totalCount:-1,totalPage:0};

    getList(1);

    var win = $(window), winh = win.height(), itemh = 0, isload = false, isend = false;
    win.scroll(function(){
        var sct = win.scrollTop();
        var h = itemh == 0 ? clist.children('li').height() : itemh;
        var allh = $('body').height();
        var scroll = allh - h - winh;
        if (sct > scroll && !isload && !isend) {
            page++;
            getList();
        };
    })

    function getList(is){
        if(is){
            page = 1;
            pageInfo.totalCount = -1;
            pageInfo.totalPage = 0;
            clist.html('');
        }
        isload = true;
        $('.loading').remove();
        con.append('<div class="loading">正在加载，请稍后······</div>');

        var  data = [];
        data.push('page='+page);
        data.push('pageSize='+pageSize);
        data.push('keywords='+keywords);
        $('.list-head ul li').each(function(i){
            var t = $(this), id = t.attr('data-id');
            if(id != undefined && id != ''){
                switch(i){
                    case 0:
                    data.push('typeid='+id);
                    break;
                    case 1:
                    data.push('times='+id);
                    break;
                    case 2:
                    data.push('feetype='+id);
                    break;
                }
            }
        })

        $.ajax({
            url: '/include/ajax.php?service=huodong&action=hlist',
            type: 'GET',
            data: data.join('&'),
            dataType: 'json',
            success: function(data){
                if(data){
                    if(data.state == 100){
                        var info = data.info, list = info.list, html = [];
                        if(pageInfo.totalCount == -1){
                            pageInfo.totalCount = info.pageInfo.totalCount;
                            pageInfo.totalPage = info.pageInfo.totalPage;
                        }
                        if(list.length > 0){
                            for(var i = 0; i < list.length; i++){
                                var obj = list[i], item = [];
                                item.push('<li>');
                                item.push(' <a href="'+obj.url+'">');
                                item.push('     <img src="'+obj.litpic+'" alt="">');
                                item.push('     <div class="lb-txt">');
                                item.push('         <h2>'+obj.title+'</h2>');
                                item.push('         <p>'+huoniao.transTimes(obj.began,1)+' 开始</p>');
                                if(obj.feetype == 0){
                                    item.push('     <span><i>'+obj.addrname[0] + ' ' + (obj.addrname[1] && obj.addrname[1] != undefined ? obj.addrname[1] : "")+'</i><b>免费</b></span>');
                                }else{
                                    item.push('     <span><i>'+obj.addrname[0] + ' ' + (obj.addrname[1] && obj.addrname[1] != undefined ? obj.addrname[1] : "")+'</i><b><em>'+(echoCurrency('symbol'))+'</em>'+obj.mprice+'<em>起</em></b></span>');
                                }
                                item.push('     </div>');
                                item.push(' </a>');
                                item.push('</li>');

                                html.push(item.join(""));
                            }
                        }

                        checkResult();
                        clist.append(html.join(""));
                    }else{
                        checkResult();
                    }
                }else{
                    checkResult();
                }
            },
            error: function(){
                alert('网络错误，请刷新重试');
            }
        })
    }

    function checkResult(){
        if(pageInfo.totalCount <= 0){
            $('.loading').text('暂无相关活动');
            isend = true;
        }else{
            if(pageInfo.totalPage == page){
                isend = true;
                $('.loading').addClass('toend').text('已显示全部活动');
            }else{
                $('.loading').remove();
                isload = false;
            }
        }
    }

})