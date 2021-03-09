$(function(){

    var con = $('.list-body'), clist = con.children('ul');

    var pageInfo = {totalCount:-1,totalPage:0};

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

    getList(1);

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
        data.push('uid='+id);
        data.push('page='+page);
        data.push('pageSize='+pageSize);

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
                                    item.push('     <span><i>'+obj.addrname[0] + ' ' + obj.addrname[1]+'</i><b>免费</b></span>');
                                }else{
                                    item.push('     <span><i>'+obj.addrname[0] + ' ' + obj.addrname[1]+'</i><b><em>'+(echoCurrency('symbol'))+'</em>'+obj.mprice+'<em>起</em></b></span>');
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
        console.log(pageInfo)
        if(pageInfo.totalCount <= 0){
            $('.loading').text('尚未发布活动');
            isend = true;
        }else{
            if(pageInfo.totalPage == page){
                isend = true;
                $('.loading').addClass('toend').text('已加载完全部数据');
            }else{
                $('.loading').remove();
                isload = false;
            }
        }
    }

})