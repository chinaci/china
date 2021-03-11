$(function () {

    toggleDragRefresh('off');

    function getNatureText(num) {
        switch (num) {
            case '0' :
                return '全职';
            case '1':
                return '兼职';
            case '2':
                return '临时';
            case '3':
                return '实习';
            default :
                return '未知';
        }
    }



    var detailList;
    detailList = new h5DetailList();
    setTimeout(function () {
        detailList.removeLocalStorage();
    }, 800);

    var dataInfo = {
        id: '',
        url: '',
        addrid: '',
        addrName: '',
        parAddrid: '',
        jtype: '',
        jtypeName: '',
        parJtype: '',
        industry: '',
        industryName: '',
        parIndustry: '',
        more: '',
        isBack: true
    };

    $('#maincontent').delegate('li', 'click', function () {
        var t = $(this), a = t.find('a'), url = a.attr('data-url'), id = t.attr('data-id');

        var addrid = $('.tab-addrid').attr('data-id'),
            addrName = $('.tab-addrid span').text(),
            parAddrid = $('.tab-addrid').attr('data-par'),
            jtype = $('.tab-jtype').attr('data-id'),
            jtypeName = $('.tab-jtype span').text(),
            parJtype = $('.tab-jtype').attr('data-par'),
            industry = $('.tab-industry').attr('data-id'),
            industryName = $('.tab-industry span').text(),
            parIndustry = $('.tab-industry').attr('data-par');

        dataInfo.addrid = addrid;
        dataInfo.addrName = addrName;
        dataInfo.parAddrid = parAddrid;
        dataInfo.jtype = jtype;
        dataInfo.jtypeName = jtypeName;
        dataInfo.parJtype = parJtype;
        dataInfo.industry = industry;
        dataInfo.industryName = industryName;
        dataInfo.parIndustry = parIndustry;
        dataInfo.more = $('#choose-more').html();

        detailList.insertHtmlStr(dataInfo, $("#maincontent").html(), {lastIndex: atpage});

        setTimeout(function () {
            location.href = url;
        }, 500);

    })

    var dom = $('#screen'), mask = $('.mask'), tabTop = $('.choose-tab').offset().top,  // 吸顶
        areaScroll = infoScroll = sortScroll = moreScroll = null,
        areaArr = [], infoArr = [], sortArr = [], moreArr = [], sortSecondArr = [],
        chooseScroll = function (obj) {
            return new iScroll(obj, {vScrollbar: false, mouseWheel: true, click: true});
        },

        init = {

            //区域
            getArea: function () {
                var areaObj = $("#choose-area");
                $.ajax({
                    url: masterDomain + '/include/ajax.php?service=job&action=addr&type=' + cityid + '&son=1',
                    dataType: 'jsonp',
                    success: function (data) {
                        if (data.state == 100) {

                            var list = data.info, html = [], par = $('.tab-addrid').attr('data-par');
                            html.push('<li data-id="">不限</li>');
                            for (var i = 0; i < list.length; i++) {
                                var cla = par != "" && par == list[i].id ? " class='active'" : "";
                                html.push('<li data-id="' + list[i].id + '"' + cla + '>' + list[i].typename + '</li>');
                                areaArr[list[i].id] = list[i].lower;
                            }

                            areaObj.html('<ul>' + html.join("") + '</ul>');
                            areaScroll = chooseScroll("choose-area");

                        } else {
                            areaObj.html('<div class="load">' + data.info + '</div>');
                        }
                    },
                    error: function () {
                        areaObj.html('<div class="load">网络错误！</div>');
                    }
                });
            },

            //行业领域
            getInfo: function () {
                var infoObj = $("#choose-info");
                $.ajax({
                    url: masterDomain + '/include/ajax.php?service=job&action=industry&son=1',
                    dataType: 'jsonp',
                    success: function (data) {
                        if (data.state == 100) {

                            var list = data.info, html = [], par = $('.tab-industry').attr('data-par');
                            html.push('<li data-id="">不限</li>');
                            for (var i = 0; i < list.length; i++) {
                                var cla = par != "" && par == list[i].id ? " class='active'" : "";
                                html.push('<li data-id="' + list[i].id + '"' + cla + '>' + list[i].typename + '</li>');
                                infoArr[list[i].id] = list[i].lower;
                            }

                            infoObj.html('<ul>' + html.join("") + '</ul>');
                            infoScroll = chooseScroll("choose-info");

                        } else {
                            infoObj.html('<div class="load">' + data.info + '</div>');
                        }
                    },
                    error: function () {
                        infoObj.html('<div class="load">网络错误！</div>');
                    }
                });
            },

            //职位类型
            getSort: function () {
                var sortObj = $("#choose-sort");
                $.ajax({
                    url: masterDomain + '/include/ajax.php?service=job&action=type&son=1',
                    dataType: 'jsonp',
                    success: function (data) {
                        if (data.state == 100) {

                            var list = data.info, html = [], par = $('.tab-industry').attr('data-par');
                            html.push('<li data-id="">不限</li>');
                            for (var i = 0; i < list.length; i++) {
                                var cla = par != "" && par == list[i].id ? " class='active'" : "";
                                html.push('<li data-id="' + list[i].id + '"' + cla + '>' + list[i].typename + '</li>');
                                lower1 = list[i].lower;
                                sortArr[list[i].id] = lower1;
                            }
                            console.log(list);
                            // console.log(sortArr);

                            sortObj.html('<ul>' + html.join("") + '</ul>');
                            sortScroll = chooseScroll("choose-sort");

                        } else {
                            sortObj.html('<div class="load">' + data.sort + '</div>');
                        }
                    },
                    error: function () {
                        sortObj.html('<div class="load">网络错误！</div>');
                    }
                });
            },


        }

    // 初始加载列表
    setTimeout(function () {
        init.getArea();
        init.getInfo();
        init.getSort();
    }, 500);

    // 筛选框
    $('.choose-tab li').click(function () {
        var $t = $(this), index = $t.index(), box = $('.choose-box .choose-local').eq(index);
        if (box.css("display") == "none") {
            $t.addClass('active').siblings().removeClass('active');
            box.show().siblings().hide();
            dom.hide();
            if (index == 0) {
                areaScroll.refresh();
            }
            if (index == 1) {
                infoScroll.refresh();
            }
            if (index == 2) {
                sortScroll.refresh();
            }
            if (index == 3 && moreScroll == null) {
                // chooseScroll("choose-more-second");
            }
            mask.show();
        } else {
            $t.removeClass('active');
            box.hide();
            mask.hide();
        }
    });


    // 工作地点一级
    $('#choose-area').delegate("li", "click", function () {

        var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();

        $('.tab-addrid').attr('data-par', id);
        if (index == 0) {
            var type = t.attr("data-id"), type = type == undefined ? "" : type;
            $(".choose-tab li").eq(index).attr("data-id", type);

            $('#area-box .choose-stage-l').removeClass('choose-stage-l-short');
            t.addClass('current').siblings().removeClass('active');
            t.closest('.choose-local').hide();
            $('#area-box .choose-stage-r').hide();
            $('.choose-tab li').eq(localIndex).removeClass('active').attr('data-id', '0').find('span').text("不限");
            mask.hide();
            getList(1);

        } else {

            t.siblings().removeClass('current');
            t.addClass('active').siblings().removeClass('active');
            $('#area-box .choose-stage-l').addClass('choose-stage-l-short');
            $('#area-box .choose-stage-r').show();

            var lower = areaArr[id], html = [];
            if (lower) {
                for (var i = 0; i < lower.length; i++) {
                    html.push('<li data-id="' + lower[i].id + '">' + lower[i].typename + '</li>');
                }
                $("#choose-area-second").html('<ul>' + html.join("") + '</ul>');
                chooseScroll("choose-area-second");
            }else{

                $('.choose-tab li').eq(localIndex).removeClass('active').attr('data-id', id).find('span').text(t.text());
                t.closest('.choose-local').hide();
                mask.hide();
                getList(1);
            }
        }

    })

    // 行业领域一级
    $('#choose-info').delegate("li", "click", function () {

        var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();
        id = id == undefined || id == '' || id < 0 ? 0 : id;
        $('.tab-industry').attr('data-par', id);

        if (index == 0) {
            $('#info-box .choose-stage-l').removeClass('choose-stage-l-short');
            t.addClass('current').siblings().removeClass('active');
            t.closest('.choose-local').hide();
            $('#info-box .choose-stage-r').hide();
            $('.choose-tab li').eq(localIndex).attr('data-id', id).removeClass('active').find('span').text("不限");
            mask.hide();
            getList(1);
        } else {

            t.siblings().removeClass('current');
            t.addClass('active').siblings().removeClass('active');
            $('#info-box .choose-stage-l').addClass('choose-stage-l-short');
            $('#info-box .choose-stage-r').show();

            var lower = infoArr[id], html = [];
            if (lower) {
                for (var i = 0; i < lower.length; i++) {
                    html.push('<li data-id="' + lower[i].id + '">' + lower[i].typename + '</li>');
                }
                $("#choose-info-second").html('<ul>' + html.join("") + '</ul>');
                chooseScroll("choose-info-second");
            }
        }

    })

    // 职位类型一级
    $('#choose-sort').delegate("li", "click", function () {

        var t = $(this), index = t.index(), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();
        id = id == undefined || id == '' || id < 0 ? 0 : id;
        var lower = sortArr[id], html = [];
        $('.tab-jtype').attr('data-par', id);

        if (index == 0 || !lower) {

            var type = t.attr("data-id"), type = type == undefined ? "" : type;
            $(".tab-jtype").attr("data-id", type);

            var val = $(this).html();
            $(this).addClass('current').siblings().removeClass('current');
            $('#sort-box .choose-stage-l').removeClass('choose-stage-l-short').removeClass('choose-stage-th');
            $('#sort-box .choose-stage-c').removeClass('choose-stage-th');
            t.addClass('current').siblings().removeClass('active');
            // t.closest('.choose-local').hide();
            $('#sort-box .choose-stage-c,#sort-box #choose-stage-th').hide();
            $('.choose-tab li').eq(localIndex).removeClass('active').attr('data-id', id).find('span').text(val);
            mask.hide();
            getList(1);

        } else {

            t.siblings().removeClass('current');
            t.addClass('active').siblings().removeClass('active');
            $('#sort-box .choose-stage-l').addClass('choose-stage-l-short').removeClass('choose-stage-th');
            $('#sort-box .choose-stage-c').removeClass('choose-stage-th');
            $('#sort-box .choose-stage-c').show();
            $('#sort-box #choose-stage-th').hide();

            for (var i = 0; i < lower.length; i++) {
                html.push('<li data-par="' + id + '" data-id="' + lower[i].id + '">' + lower[i].typename + '</li>');
            }
            $("#choose-sort-second").html('<ul>' + html.join("") + '</ul>');
            chooseScroll("choose-sort-second");
        }

    })


    // 职位类型二级
    $('#choose-sort-second').delegate("li", "click", function(){

        var t = $(this), index = t.index(), par = t.attr('data-par'), id = t.attr('data-id'), localIndex = t.closest('.choose-local').index();

        $(this).addClass('active').siblings().removeClass('active');
        $('#sort-box .choose-stage-l').addClass('choose-stage-th');
        $('#sort-box .choose-stage-c').addClass('choose-stage-th');
        $('#sort-box .choose-stage-th').show();
        $('#choose-sort-third ul').eq(index).show().siblings().hide();

        var sortSecondArr = sortArr[par];
        var lower = sortSecondArr[index].lower
        var  html = [];
        if(lower){
            for(var i = 0; i < lower.length; i++){
                html.push('<li data-id="'+lower[i].id+'">'+lower[i].typename+'</li>');
            }

            $("#choose-sort-third").html('<ul>'+html.join("")+'</ul>');
            chooseScroll("choose-sort-third");
        }else{
            $("#choose-sort-third").html('');
        }

    })

    // 一级筛选  地址和排序
    $('#choose-info-second, #choose-area-second, #choose-sort-third').delegate("li", "click", function () {

        var $t = $(this), val = $(this).html(), local = $t.closest('.choose-local'), index = local.index(),
            id = $t.attr('data-id');
        id = id == undefined || id == '' || id < 0 ? 0 : id;
        $t.addClass('on').siblings().removeClass('on');

        $('.choose-tab li').eq(index).removeClass('active').attr('data-id', id).find('span').text(val);
        local.hide();
        mask.hide();
        getList(1);

    })


    // 更多

    $('.back').click(function () {
        $('.more-box').hide();
    })

    $('#choose-more-second span').click(function () {

        var t = $(this), val = t.html(), ul = t.closest('.gdList'), index = ul.index(), id = t.data('id');
        id = id < 0 ? '' : id;

        t.addClass('active').siblings('span').removeClass('active');
        t.parent('.gdList').attr('data-id', id);
        $('.more-box').hide();
    })

    $('.confirm').click(function () {
        $(this).closest('.choose-local').hide();
        mask.hide();
        $('.choose-tab li').removeClass('active');
        getList(1);
    })
    //点击重置
    $('.rest').click(function () {
        var t = $(this);
        $('#choose-more .mainList span').removeClass('active');
    });

    // 遮罩层
    $('.mask').on('click', function () {
        mask.hide();
        dom.hide();
        $('.choose-local').hide();
        $('.choose-tab li').removeClass('active');
    })
    $('.mask').on('touchmove', function () {
        mask.hide();
        dom.hide();
        $('.choose-local').hide();
        $('.choose-tab li').removeClass('active');
    })

    // 下拉加载
    var isload = false;
    $(window).scroll(function () {
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w;
        if ($(window).scrollTop() >= scroll && !isload) {
            atpage++;
            getList();
        }
        ;
    });

    // 上滑下滑导航隐藏
    var upflag = 1, downflag = 1, fixFooter = $(".header, .choose, .footer");
    //scroll滑动,上滑和下滑只执行一次！
    scrollDirect(function (direction) {
        if (direction == "down" && !isload) {
            if (downflag) {
                fixFooter.hide();
                downflag = 0;
                upflag = 1;
            }
        }
        if (direction == "up" && !isload) {
            if (upflag) {
                fixFooter.show();
                downflag = 1;
                upflag = 0;
            }
        }
    });

    //初始加载
    if ($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()) {
        getList(1);
    } else {
        getData();
        setTimeout(function () {
            detailList.removeLocalStorage();
        }, 500)
    }

    //数据列表
    function getList(tr, search) {
        isload = true;

        //如果进行了筛选或排序，需要从第一页开始加载
        if (tr) {
            atpage = 1;
            $(".positionList ul").html("");
        }

        //自定义筛选内容
        var item = [];
        $(".choose-more-condition ul").each(function () {
            var t = $(this), active = t.find(".active");
            if (active.text() != "不限") {
            }
        });

        $(".positionList .loading").remove();
        $(".positionList").append('<div class="loading">加载中...</div>');

        //请求数据
        var data = [];
        data.push("pageSize=" + pageSize);

        data.push("page=" + atpage);
        if (search) {
            data.push("title=" + search);
        }
        $('.choose li,#choose-more .gdList').each(function () {
            var obj = $(this), field = obj.data('type');
            var val = obj.attr('data-id');
            if (field && val != undefined && val != '') {
                data.push(field + "=" + val);
            }
        })


        $.ajax({
            url: "/include/ajax.php?service=job&action=post",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if (data) {
                    if (data.state == 100) {
                        $(".positionList .loading").remove();
                        var list = data.info.list, html = [];
                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var pic = hideFileUrl ? (list[i]['company'] ? list[i]['company'].logo : '') : (list[i]['company'] ? list[i]['company'].logo : '');
                                pic = pic == '' ? '/static/images/blank.gif' : pic;
                                var welfare = list[i]['company'] ? list[i]['company']['welfare'].split(',') : '';

                                var welfare_html = '';
                                if(welfare != ''){
                                    for (var j = 0; j < welfare.length; j++) {
                                        welfare_html += '<span>' + welfare[j] + '</span>';
                                    }
                                }

                                var is_delivery = list[i].is_delivery;
                                var is_delivery_html = '';
                                if (is_delivery) {
                                    is_delivery_html = '<span class="delivered">已投递</span>';
                                }
                                var industry_htm;

                                if(list[i]['company'] && list[i]['company']['industry'][1]){
                                  if (list[i]['company']['industry'][1].length > 12) {
                                      industry_htm = list[i]['company']['industry'][1].substr(0, 5) + ' ...';
                                  } else {
                                      industry_htm = list[i]['company']['industry'][1];
                                  }
                                }else{
                                  if (list[i]['company'] && list[i]['company']['industry'][0] && list[i]['company']['industry'][0].length > 12) {
                                      industry_htm = list[i]['company']['industry'][0].substr(0, 5) + ' ...';
                                  } else {
                                      if(list[i]['company']) {
                                          industry_htm = list[i]['company']['industry'][0];
                                      }
                                  }
                                }
                                var is_top = '';
                                if(list[i].isbid == 1){
                                    is_top = '<i></i>'
                                }
                                html.push('<li>');
                                html.push('  <a href="' + list[i].url + '" data-url="' + list[i].url + '" class="fn-clear">');
                                html.push('    <div class="zhiwei_title">');
                                html.push('          <div class="title_01"><span>' + list[i].title + '</span>' + is_delivery_html + '</div>');
                                html.push('          <div class="title_02 fn-clear"><span>' + list[i]['addr'][list[i]['addr'].length-1] + '</span><span>' + list[i].experience + '</span><span>' + list[i].educational + '</span><span>' + getNatureText(list[i].nature) + '</span><p>' + list[i].salary + '</p></div>');
                                html.push('          <div class="title_03 fn-clear">' + list[i].type + '<em>' + list[i].timeUpdate + '</em></div>');
                                html.push('     </div>');
                                if(list[i]['company']) {
                                    html.push('     <div class="title_04 fn-clear">');
                                    html.push('         <div class="img_left"><img src="' + pic + '"></div>');
                                    html.push('         <div class="txt_right">');
                                    html.push('             <p>' + list[i]['company']['title'] + '</p>');
                                    html.push('             <div><span>' + list[i]['company']['scale'] + '</span><em>|</em><span>' + list[i]['company']['nature'] + '</span><em>|</em><span>' + industry_htm + '</span></div>');
                                    html.push('         </div>');
                                    html.push('     </div>');
                                }
                                html.push(is_top);
                                html.push('   </a>');
                                html.push('</li>');
                            }


                            $(".positionList ul").append(html.join(""));
                            isload = false;

                            //最后一页
                            if (atpage >= data.info.pageInfo.totalPage) {
                                isload = true;
                                $(".positionList").append('<div class="loading">已经到最后一页了</div>');
                            }

                            //没有数据
                        } else {
                            isload = true;
                            $(".positionList").append('<div class="loading">暂无相关信息</div>');
                        }

                        //请求失败
                    } else {
                        $(".positionList .loading").html(data.info);
                    }

                    //加载失败
                } else {
                    $(".positionList .loading").html('加载失败');
                }
            },
            error: function () {
                isload = false;
                $(".positionList .loading").html('网络错误，加载失败！');
            }
        });
    }


    // 本地存储的筛选条件
    function getData() {

        var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
        atpage = detailList.getLocalStorage()['extraData'].lastIndex;

        if (filter.addrid != '') {
            $('.tab-addrid').attr('data-id', filter.addrid);
        }
        if (filter.parAddrid != '') {
            $('.tab-addrid').attr('data-par', filter.parAddrid);
        }
        if (filter.addrName != '') {
            $('.tab-addrid span').text(filter.addrName);
        }
        if (filter.jtype != '') {
            $('.tab-jtype').attr('data-id', filter.jtype);
        }
        if (filter.parJtype != '') {
            $('.tab-jtype').attr('data-par', filter.parJtype);
        }
        if (filter.jtypeName != '') {
            $('.tab-jtype span').text(filter.jtypeName);
        }
        if (filter.industry != '') {
            $('.tab-industry').attr('data-id', filter.industry);
        }
        if (filter.parIndustry != '') {
            $('.tab-industry').attr('data-par', filter.parIndustry);
        }
        if (filter.industryName != '') {
            $('.tab-industry span').text(filter.industryName);
        }

        if (filter.more) {
            $('#choose-more').html(filter.more);
        }

    }


    $(".search-btn").click(function () {
        var key = $(".txt_search").val();
        if (key == '') {
            alert("请输入关键词");
            return;
        }
        getList(1, key);
    })

})
