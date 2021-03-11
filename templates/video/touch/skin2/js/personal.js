$(function () {
    var is_load0 = true;
    var is_load1 = true;
    var is_load3 = true;

    var page = $(".info_n li").eq(0).attr("data-page");
    var tcpage = $(".info_n li").eq(1).attr("data-page"); //小视频
    var qjpage = $(".info_n li").eq(3).attr("data-page"); //全景
    var timer;
    var ischange = false;
    var winsct_ = 0;

    function waterFall() {
        // 1- 确定图片的宽度 - 滚动条宽度
        var pageWidth = getClient().width;
        var columns = 2; //3列
        var itemWidth = $(".tc_list ul li").width(); //得到item的宽度
        // $(".tc_list ul li").width(itemWidth); //设置到item的宽度
        var arr = [];

        var allload = true;
        $(".tc_list ul li").each(function (i) {
            var height = $(this).height();
            var width = $(this).width();
            var imgw = $(this).find('img').width();
            if(imgw <= 0) allload = false;
            var bi = itemWidth / width; //获取缩小的比值
            var boxheight = parseInt(height * bi); //图片的高度*比值 = item的高度
            if (i < columns) {
                // 2- 确定第一行
                $(this).css({
                    top: 0,
                    left: (itemWidth) * i
                });
                arr.push(boxheight);
            } else {
                // 其他行
                // 3- 找到数组中最小高度  和 它的索引
                var minHeight = arr[0];
                var index = 0;
                for (var j = 0; j < arr.length; j++) {
                    if (minHeight > arr[j]) {
                        minHeight = arr[j];
                        index = j;
                    }
                }
                // 4- 设置下一行的第一个盒子位置
                // top值就是最小列的高度
                $(this).css({
                    top: arr[index],
                    left: $(".tc_list ul li").eq(index).css("left")
                });

                // 5- 修改最小列的高度
                // 最小列的高度 = 当前自己的高度 + 拼接过来的高度
                arr[index] = arr[index] + boxheight;
            }
        });
        $('.tc_list ul').css('height', Math.max.apply(null, arr));
        if(allload){
            console.log('allload')
            clearTimeout(timer);
        }
    }

//clientWidth 处理兼容性
    function getClient() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
    }

    // 页面尺寸改变时实时触发
    window.onresize = function () {
        //重新定义瀑布流
        waterFall();
    };




// 点击切换
    $('.info ul li').click(function () {
        ischange = true;
        winsct = $(window).scrollTop();
        var t = $(this), i = t.index();
        if (!t.hasClass('active')) {
            t.addClass('active').siblings().removeClass('active');
        }

        $('.list>div:eq(' + i + ')').show();
        $('.list>div:eq(' + i + ')').siblings().hide();

        $(window).scrollTop(winsct_);
        winsct_ = winsct;

    });

    getList();
    panList();
    tcList();
    $('.info ul li:eq(0)').click();

    function getList() {
        var html = [];
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=video&action=alist&pageSize=5&page=' + page + '&orderby=2&userid=' + userid,
            data: '',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.state == 100) {
                    var list = data.info.list;
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        var is_zan = '';
                        if (list[i].is_zan) {
                            is_zan = 'active';
                        }
                        html.push('<li>');
                        html.push('<a href="' + list[i].url + '">');
                        html.push('  <div class="bg_img">');
                        html.push('<img src="' + list[i].litpic + '">');
                        html.push('<i></i>');
                        html.push('<div class="fn-clear"><span>' + list[i].click + '</span><span>03:35</span></div>');
                        html.push('</div>');
                        html.push('<div class="bg_content fn-clear">');
                        html.push('</a>');

                        html.push('  <p>' + list[i].title + '</p>');
                        html.push('  <div><span class="user_name"><em>' + list[i].pubdate2 + '</em><em>' + list[i].pubdate1 + '</em></span>');
                        html.push('  <span class="dianzan ' + is_zan + '" data-id="' + list[i].id + '" data-temp="video">' + list[i].zanCount + '</span>');
                        html.push('  <span class="xinxi">' + list[i].common + '</span></div>');
                        html.push('</div>');
                        html.push('</li>');
                    }
                    $(".video_list ul").append(html.join(""));

                } else {
                    is_load0 = false;
                    $(".video_list ul").append("<p class='no_data'>暂无数据!</p>");
                }

            }
        })

    }


    function tcList() {
        var html = [];
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=video&action=alist&pageSize=10&page=' + tcpage + '&userid=' + userid + '&orderby=2',
            data: '',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.state == 100) {
                    var list = data.info.list;
                    var len = list.length;
                    var html = [];
                    for (var i = 0; i < len; i++) {
                        html.push('<li>');
                        html.push('<a href="' + list[i].url + '">');
                        html.push('  <div class="tc_img"><img src="' + list[i].litpic + '"><p class="ic_list"><span class="ic_01">' + list[i].click + '</span><span class="ic_02">' + list[i].zanCount + '</span><span class="ic_03">' + list[i].common + '</span></p></div>');
                        html.push('  <p class="tc_title">' + list[i].title + '</p>');
                        html.push('</a>');
                        html.push('</li>');
                    }

                    $(".tc_list ul").append(html.join(""));
                    timer = setInterval(function () {
                        waterFall();
                    }, 500)
                } else {
                    is_load1 = false;

                    $(".tc_list ul").append("<p class='no_data'>暂无数据!</p>");

                }

            }
        })

    }


    function panList() {
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=quanjing&action=qlist&pageSize=5&orderby=1&page=' + qjpage + '&userid=' + userid,
            data: {},
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.state == 100) {
                    var list = data.info.list;
                    var len = list.length;
                    var html = [];
                    for (var i = 0; i < len; i++) {
                        var is_zan = '';
                        if (list[i].is_zan) {
                            is_zan = 'active';
                        }
                        html.push('<li>');
                        html.push('<a href="' + list[i].url + '">');
                        html.push('  <div class="bg_img">');
                        html.push('<img src="' + list[i].litpic + '">');
                        html.push('<div class="fn-clear"><span>' + list[i].click + '</span></div>');
                        html.push('</div>');
                        html.push('<div class="bg_content fn-clear">');
                        html.push('</a>');
                        html.push('  <p>' + list[i].title + '</p>');
                        html.push('  <div><span class="user_name"><em>' + list[i].pubdate1 + '</em><em>' + list[i].pubdate2 + '</em></span>');
                        html.push('  <span class="dianzan ' + is_zan + '" data-vid="' + list[i].id + '" data-temp="quanjing">' + list[i].zanCount + '</span>');
                        html.push('  <span class="xinxi">' + list[i].common + '</span></div>');
                        html.push('</div>');
                        html.push('</li>');
                    }
                    $(".panorama_list ul").append(html.join(""));

                } else {
                    is_load3 = false;

                    $(".panorama_list ul").append("<p class='no_data'>暂无数据!</p>");

                }
            }
        })


    }


// 吸顶
    var xiding = $(".info_n"), chtop = parseInt(xiding.offset().top);
    $(window).on("scroll", function () {

        var thisa = $(this);
        var st = thisa.scrollTop();
        var sct = $(window).scrollTop();
        if (st >= chtop) {
            $(".info_n").addClass('choose-top');
        } else {
            $(".info_n").removeClass('choose-top');
        }
        if(ischange){
            ischange = false;
            return;
        }
        if (sct + $(window).height() >= $(document).height()) {
            var temp_xuanzhong = $(".info_n .fn-clear .active").attr("data-id");
            if (temp_xuanzhong == 1) {
                $(".info_n li").eq(0).attr("data-page", page++);
                if(is_load0){
                    getList();
                }

            } else if (temp_xuanzhong == 2) {


                $(".info_n li").eq(1).attr("data-page", tcpage++);
                if(is_load1){
                    tcList();
                }
            } else if (temp_xuanzhong == 4) {

                $(".info_n li").eq(3).attr("data-page", qjpage++);
                if(is_load3){
                    panList();
                }

            }
        }

    });







// 点击关注
    $('.follow').click(function () {
        var t = $(this);
        if (t.hasClass('add_follow')) {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=follow&' + 'type=' + 1 + '&temp=video&userid=' + userid,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.removeClass('add_follow');
                        t.addClass('pitchOn');
                        t.text('已关注');
                    } else {
                        alert(data.info);
                        window.location.href = masterDomain + '/login.html';

                    }

                }
            })

        } else {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=follow&' + 'type=' + 0 + '&temp=video&userid=' + userid,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.removeClass('pitchOn').addClass('add_follow');
                        t.text('关注');
                    } else {
                        alert(data.info);
                        window.location.href = masterDomain + '/login.html';

                    }

                }
            })

        }
    });





// 点赞
    $('.video_list ul').delegate('.dianzan', 'click', function () {
        var t = $(this);
        var temp = t.attr("data-temp");
        var vid = t.attr("data-id");
        if (t.hasClass('active')) {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + 0 + '&temp=' + temp,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.removeClass('active');
                        var b = t.text();
                        b--;
                        t.text(b)
                    } else {
                        alert(data.info);
                    }

                }
            })

        } else {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + 1 + '&temp=' + temp,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.addClass('active');
                        var c = t.text();
                        c++;
                        t.text(c);
                    } else {
                        alert(data.info);
                    }

                }
            })
        }
    });




    $('.panorama_list ul').delegate('.dianzan', 'click', function () {
        var t = $(this);
        var temp = t.attr("data-temp");
        var vid = t.attr("data-vid");
        if (t.hasClass('active')) {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + 0 + '&temp=' + temp,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.removeClass('active');
                        var b = t.text();
                        b--;
                        t.text(b)
                    } else {
                        alert(data.info);
                    }

                }
            })

        } else {
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=video&action=dianzan&vid=' + vid + '&type=' + 1 + '&temp=' + temp,
                data: '',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data.state == 100) {
                        t.addClass('active');
                        var c = t.text();
                        c++;
                        t.text(c);
                    } else {
                        alert(data.info);
                    }

                }
            })

        }
    });


})