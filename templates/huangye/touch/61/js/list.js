$(function(){

  var device = navigator.userAgent;
  if (device.indexOf('huoniao_iOS') > -1) {
    $("body").addClass("padTop20")
  }

  $('img').scrollLoading();
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
  var objId = $('#listCon'), atpage = 1, totalPage = 1; pageSize = 10, isload = false;
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
            getList();
            return;
        }
        if(boxi == 0){
            p.find('.cl-rr').html('');
            if(ti == 0){
                $('.disk').click();
            }else{
                getType(action,id);
            }
        }else{
            $('.disk').click();
            if(ti == 0){
                type = p.find('.cl-left li.bc a').text();
            }
            $('.choice ul li').eq(pi).find('span').html(type + (pi == 0 ? '<font id="count">(0)</font>' : ''));
            getList();
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

    // 上一页
    $('.fanye .fan-l').click(function(){
        if(atpage == 1 || isload) return;
        atpage--;
        getList();
    })
    // 下一页
    $('.fanye .fan-r').click(function(){
        if(atpage == totalPage || isload) return;
        atpage++;
        getList();
    })

    // 获取分类
    function getType(action,id,currid){
        if(id == undefined || id == '' || id == 0) return;
        $.ajax({
            url: '/include/ajax.php?service=huangye&action='+action+'&type='+id,
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
                        getList();
                        $('.disk').click();
                    }
                }else{
                    getList();
                    $('.disk').click();
                }

            },
            error: function(){
                console.log('err')
            }
        })
    }

    function getList(){
        $(window).scrollTop(0);

        var data = [], df = $('.choice ul li');
        data.push('typeid='+typeid);
        data.push('addrid='+addrid);
        if(keywords != ''){
            data.push('keywords='+keywords);
            keywords = '';
            var url = window.location.href.split("?")[0];
            window.history.pushState({}, 0, url);
        }
        $.ajax({
            url: "/include/ajax.php?service=business&action=blist&page="+atpage+'&pageSize='+pageSize,
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data){
                    if(data.state == 100){
                        var list = data.info.list, html = [];
                        var pageInfo = data.info.pageInfo;
                        if(list.length > 0){
                            for(var i = 0; i < list.length; i++){
                                var obj = list[i], item = [];
                                item.push('<li>');
                                item.push(' <a href="'+obj.url+'">');
                                item.push('     <img src="'+obj.logo+'" alt="">');

                                item.push(' <div class="li-right"><span class="title">'+obj.title+'</span>');
                                for(var n = 0; n < obj.auth.length; n++){
                                    item.push('<em>'+obj.auth[n].jc+'</em>');
                                }
                                // if(obj.top == "1"){
                                //     item.push(' <i>置顶</i>');
                                // }
                                item.push(' <p>'+obj.address+'</p>');
                                item.push(' </div>');
                                if(obj.tel){
                                    item.push(' <a href="tel:'+obj.tel+'" class="phone"></a>');
                                }
                                item.push('</li>');

                                html.push(item.join(""));
                            }

                            objId.html(html.join(""));
                            totalPage = pageInfo.totalPage;
                            $('#count').text('('+pageInfo.totalCount+')')
                            $('.page').html(pageInfo.page+'/'+totalPage);
                            isload = false;
                        }else{
                            objId.html('<li class="loading">暂无相关信息！</li>');
                            $('#count').text('(0)')
                            $('.fanye').hide();
                            isload = false;
                        }
                    }else{
                        objId.html('<li class="loading">暂无相关信息！</li>');
                        $('#count').text('(0)')
                        $('.fanye').hide();
                        isload = false;
                    }
                }
            },
            error: function(){
                isload = false;
            }
        })
    }

    getList();

})
