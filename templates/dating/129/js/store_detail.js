$(function(){

    var atpage = 1, pageSize = 15, totalCount = 0;

    var ajaxData = {
        hn : {
            atpage: 1,
            totalCount: 0
        },
        user : {
            atpage: 1,
            totalCount: 0
        }
    };

	// 判断浏览器是否是ie8
     if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.app-con .down .con-box:last-child').css('margin-right','0');
        $('.wx-con .c-box:last-child').css('margin-right','0');
        $('.stores-brief .apply').css('background','#f60e44');
        $('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
        $('.maker-deed .deed-con .match-list:nth-child(3n)').css('margin-right','0');
     }

    // 申请门店为我牵线
    $('#apply-popup').click(function(){
        $('.desk').show();
        $('.apply-store-popup').show();
    })

    //关闭
    $('.apply-popup-close').click(function(){
        $('.desk').hide();
        $('.apply-store-popup').hide();
    })
	// 轮播1
    var swiperNav = [], mainNavLi = $('.slideBox .bd').find('li');
    for (var i = 0; i < mainNavLi.length; i++) {
      swiperNav.push($('.slideBox .bd').find('li:eq('+i+')').html());
    }
    var liArr = [];
    for(var i = 0; i < swiperNav.length; i++){
      liArr.push(swiperNav.slice(i, i + 4).join(""));
      i += 3;
    }
    $(".slideBox1").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});
    // 红娘风采导航条
    $(".maker-deed .deed-title ul li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var i=$(this).index();
        $(this).closest('.maker-deed').find('.deed-con').eq(i).addClass("show").siblings().removeClass("show");

        if(i == 0){
            atpage = ajaxData.hn.atpage;
            totalCount = ajaxData.hn.totalCount;
        }else{
            atpage = ajaxData.user.atpage;
            totalCount = ajaxData.user.totalCount;
        }
        showPageInfo();
    });
    // 申请门店为我牵线弹窗
    $('.apply-store-popup dl .sex i').click(function(){
        if($(this).hasClass('disabled')) return;
        $(this).addClass('active').siblings().removeClass('active');
    })
    //月薪范围
    $('#selectTypeMenu').hover(function(){
        $(this).show();
        $(this).closest('selectType').addClass('hover');
    }, function(){
        $(this).hide();
        $(this).closest('selectType').removeClass('hover');
    });

    $("#selectTypeText").hover(function () {
        $(this).next("span").slideDown(200);
        $(this).closest('selectType').addClass('hover');
    },function(){
        $(this).next("span").hide();
        $(this).closest('selectType').removeClass('hover');
    });

    $("#selectTypeMenu>a").click(function () {
        $("#selectTypeText").text($(this).text());
        $("#selectTypeText").attr("value", $(this).attr("rel"));
        $(this).parent().hide();
        $('selectType').removeClass('hover');
        $(this).addClass('curr').siblings().removeClass('curr');
    });
    //工作城市
    $('.select-city .selectmenu').hover(function(){
        $(this).show();
        $(this).closest('.select-type').addClass('hover');
    }, function(){
        $(this).hide();
        $(this).closest('.select-type').removeClass('hover');
    });

    $(".select-city .selectText").hover(function () {
        $(this).next("span").slideDown(200);
        $(this).closest('select-type').addClass('hover');
    },function(){
        $(this).next("span").hide();
        $(this).closest('select-type').removeClass('hover');
    });

    $(".select-city .selectmenu a").click(function () {
        $(this).closest('.select-city').find('.selectText').text($(this).text());
        $(this).closest('.select-city').find('.selectText').attr("value", $(this).attr("rel"));
        $(this).parent().hide();
        $('.select-city .select-type').removeClass('hover');
    });
    function getNationalPhone(){
    $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'JSONP',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
                   }
                   $('.areaCode_wrap ul').append(phoneList.join(''));
                }else{
                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
                    }

        })
    }
    //显示区号
    $('.areaCode').bind('click', function(){
      getNationalPhone();
      var areaWrap =$(this).closest(".apply-store-form").find('.areaCode_wrap');
      if(areaWrap.is(':visible')){
        areaWrap.fadeOut(300)
      }else{
        areaWrap.fadeIn(300);
        return false;
      }
    });

    //选择区号
    $('.areaCode_wrap').delegate('li', 'click', function(){
      var t = $(this), code = t.attr('data-code');
      var par = t.closest(".apply-store-form");
      var areaIcode = par.find(".areaCode");
      areaIcode.find('i').html('+' + code);
      $('#areaCode').val(code);
    });
    $('body').bind('click', function(){
    $('.areaCode_wrap').fadeOut(300);
  });

    // 提交
    var lgform = $('.apply-store-form');
    lgform.submit(function(e){
        e.preventDefault();
        $('.error').text('').hide();
        var nameinp = $('.apply-name'),
            name = nameinp.val(),
            telinp = $('#telphone'),
            tel = telinp.val(),
            t = $('.submit'),
            code = $('#code').val(),
            areaCode = $('#areaCode').val(),
            city = $('.addrBtn').attr('data-id'),
            r = true;
        if(name == ''){
            nameinp.closest('dl').find('.error').text('请输入您的姓名').show();
            nameinp.focus();
            r = false;
        }
        if(r && tel == '') {
          r = false;
          telinp.closest('dl').find('.error').text('请输入您的电话号码').show();
          telinp.focus();
        } else {
          var reg , h = '';
          reg = !!tel.match(/^1[34578](\d){9}$/);
          if(!reg){
            telinp.closest('dl').find('.error').text('您的手机号输入有误').show();
            telinp.focus();
            r = false;
          }else{
            if(!phoneCheck){
                if(code == ''){
                  r = false;
                    $('#code').closest('dl').find('.error').text('请输入验证码').show();
                }
            }
          }
        }

        var money = $('#selectTypeMenu a.curr');
        if(!money.length){
            $('#selectTypeMenu').closest('dl').find('.error').text('请选择您的月薪范围').show();
            r = false;
        }else{
            money = money.data('id');
        }

        city = $('.addrBtn').attr('data-id');
        if(city == undefined || city == ''){
            $('.addrBtn').closest('dl').find('.error').text('请选择您的工作城市').show();
            r = false;
        }

        if(!r) return;

        t.val('提交中...').attr('disabled', true);

        var data = [];
        data.push('realname='+name);
        data.push('mobile='+tel);
        data.push('code='+code);
        data.push('areaCode='+areaCode);
        data.push('money='+money);
        data.push('city='+city);
        data.push('uto='+id);
        data.push('type=2');

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=putApply',
            type: 'post',
            data: data.join('&'),
            dataType: 'jsonp',
            success: function(data){
                t.val('申请服务').attr('disabled', false);
                $('.apply-popup-close').click();
                if(data && data.state == 100){
                  $.dialog({
                    title: '提示信息',
                    icon: 'success.png',
                    content: data.info,
                    ok: function(){

                    }
                  })
                }else{
                  $.dialog.alert(data.info);
                }
            },
            error: function(){
                t.val('申请服务').attr('disabled', false);
                $('.apply-popup-close').click();
                $.dialog.alert('网络错误，请重试！');
            }
        })

    })


    function setMap(){
        // 百度地图
        if (site_map == "baidu") {

          map = new BMap.Map("mapdiv");
          var mPoint = new BMap.Point(lng, lat);
          map.centerAndZoom(mPoint, 18);

          var marker = new BMap.Marker(mPoint);        // 创建标注
          map.addOverlay(marker);                     // 将标注添加到地图中

        // 谷歌地图
        }else if (site_map == "google") {

          var map, geocoder, marker,
            mapOptions = {
              zoom: 14,
              center: new google.maps.LatLng(lat, lng),
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
              }
            }

          $('.mapcenter').remove();
          map = new google.maps.Map(document.getElementById('mapdiv'), mapOptions);

          marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            draggable:true,
            animation: google.maps.Animation.DROP
          });

        // 高德地图
        }else if(site_map == 'amap'){


          var map = new AMap.Map('mapdiv', {
                zoom:18,//级别
                center: [lng, lat],//中心点坐标
                viewMode:'3D'//使用3D视图
            });

          // 创建一个 Marker 实例：
            var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: title
            });

            // 将创建的点标记添加到已有的地图实例：
            map.add(marker);

        // 腾讯地图
        }else if (site_map == "qq"){

          var center = new qq.maps.LatLng(lat, lng);
          var map = new qq.maps.Map(document.getElementById('mapdiv'), {center: center, zoom: 16, draggable:true});

          //创建一个Marker
            var marker = new qq.maps.Marker({
                //设置Marker的位置坐标
                position: center,
                //设置显示Marker的地图
                map: map
            });

            //设置Marker的可见性，为true时可见,false时不可见，默认属性为true
            marker.setVisible(true);

        }
    }

    setMap();

    function getList(tr){
        if(tr){
            atpage = 1;
        }
        var index = $('.deed-title .active').index();
        if(index == 0){
            getList_0();
        }else{
            getList_1();
        }
        $(".pagination").hide();
    }

    function getList_0(){
        var con = $('#store_hn');

        ajaxData.hn.atpage = atpage;

        con.html('<div class="loading">正在获取，请稍后</div>');

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=hnList&company='+id+'&page='+atpage+'&pageSize='+pageSize,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var html = [];
                    totalCount = data.info.pageInfo.totalCount;

                    ajaxData.hn.totalCount = totalCount;

                    $('.deed-title li:eq(0) span').text('('+totalCount+')');

                    for(var i = 0; i < data.info.list.length; i++){
                        var d = data.info.list[i];
                        var photo = d.photo ? d.photo : staticPath + 'images/blank.gif';

                        html.push('<div class="match-list fn-left">');
                        html.push('    <div class="match-left fn-left">');
                        html.push('        <a href="'+d.url+'" target="_blank"><img src="'+photo+'" alt=""></a>');
                        html.push('    </div>');
                        html.push('    <div class="match-right fn-left">');
                        // <span>资深婚恋顾问</span>
                        html.push('        <p class="name"><a href="'+d.url+'" target="_blank">'+d.nickname+'</a></p>');
                        html.push('        <p class="text">'+d.advice+'</p>');
                        html.push('        <div class="match-bottom">');
                        html.push('            <p class="tel">'+d.phone+'</p>');
                        html.push('            <p class="page"><a href="'+d.url+'" target="_blank">红娘主页</a></p>');
                        html.push('        </div>');
                        html.push('    </div>');
                        html.push('</div>');
                    }
                    con.html(html.join(""));

                    showPageInfo();
                }else{
                    con.html('<div class="loading">暂无红娘</div>');
                    $('.deed-title li:eq(0) span').text(0);
                }
            },
            error: function(){
                con.html('<div class="loading">网络错误，请重试！</div>');
                $('.deed-title li:eq(0) span').text(0);
            }
        })
    }

    function getList_1(type){
        var con = $('#store_user');

        ajaxData.user.atpage = atpage;

        con.html('<div class="loading">正在获取，请稍后</div>');

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=dating&action=memberList&store='+id+'&page='+atpage+'&pageSize='+pageSize,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var html = [];
                    totalCount = data.info.pageInfo.totalCount;

                    ajaxData.user.totalCount = totalCount;


                    $('.deed-title li:eq(1) span').text('('+totalCount+')');

                    for(var i = 0; i < data.info.list.length; i++){
                        var d = data.info.list[i];
                        var photo = d.photo ? d.photo : staticPath + 'images/blank.gif';

                        html.push('<div class="match-list fn-left">');
                        html.push('    <div class="match-left fn-left">');
                        html.push('        <a href="'+d.url+'" target="_blank"><img src="'+photo+'" alt=""></a>');
                        html.push('    </div>');
                        html.push('    <div class="match-right fn-left">');
                        html.push('        <p class="name"><a href="'+d.url+'" target="_blank">'+d.nickname+'</a></p>');
                        html.push('        <p class="text">'+d.profile+'</p>');
                        html.push('        <div class="match-bottom">');
                        var info = [];
                        if(d.age != 0){
                            info.push(d.age + '岁');
                        }
                        if(d.heightName){
                            info.push(d.heightName);
                        }
                        html.push('            <p class="tel">'+info.join('&nbsp;')+'</p>');
                        html.push('            <p class="page"><a href="'+d.url+'" target="_blank">会员主页</a></p>');
                        html.push('        </div>');
                        html.push('    </div>');
                        html.push('</div>');
                    }
                    con.html(html.join(""));

                    if(type != 'init'){
                        showPageInfo();
                    }
                }else{
                    con.html('<div class="loading">暂无会员</div>');
                    $('.deed-title li:eq(1) span').text(0);
                }
            },
            error: function(){
                con.html('<div class="loading">网络错误，请重试！</div>');
                $('.deed-title li:eq(1) span').text(0);
            }
        })
    }

    // 打印分类
    function showPageInfo() {
          var info = $(".pagination");
          var nowPageNum = atpage;
          var allPageNum = Math.ceil(totalCount / pageSize);
          var pageArr = [];

          info.html("").hide();

          //输入跳转
          // var redirect = document.createElement("div");
          // redirect.className = "pagination-gotopage";
          // redirect.innerHTML =
          //     '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
          // info.append(redirect);

          // //分页跳转
          // info.find(".btn").bind("click", function () {
          //     var pageNum = info.find(".inp").val();
          //     if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
          //         atpage = pageNum;
          //         getList();
          //     } else {
          //         info.find(".inp").focus();
          //     }
          // });

          var pages = document.createElement("div");
          pages.className = "page pagination-pages fn-clear";
          info.append(pages);

          //拼接所有分页
          if (allPageNum > 1) {

              //上一页
              if (nowPageNum > 1) {
                  var prev = document.createElement("a");
                  prev.className = "prev";
                  prev.innerHTML = '上一页';
                  prev.onclick = function () {
                      atpage = nowPageNum - 1;
                      getList();
                  }
              } else {
                  var prev = document.createElement("span");
                  prev.className = "prev disabled";
                  prev.innerHTML = '上一页';
              }
              info.find(".pagination-pages").append(prev);

              //分页列表
              if (allPageNum - 2 < 1) {
                  for (var i = 1; i <= allPageNum; i++) {
                      if (nowPageNum == i) {
                          var page = document.createElement("span");
                          page.className = "curr";
                          page.innerHTML = i;
                      } else {
                          var page = document.createElement("a");
                          page.innerHTML = i;
                          page.onclick = function () {
                              atpage = Number($(this).text());
                              getList();
                          }
                      }
                      info.find(".pagination-pages").append(page);
                  }
              } else {
                  for (var i = 1; i <= 2; i++) {
                      if (nowPageNum == i) {
                          var page = document.createElement("span");
                          page.className = "curr";
                          page.innerHTML = i;
                      } else {
                          var page = document.createElement("a");
                          page.innerHTML = i;
                          page.onclick = function () {
                              atpage = Number($(this).text());
                              getList();
                          }
                      }
                      info.find(".pagination-pages").append(page);
                  }
                  var addNum = nowPageNum - 4;
                  if (addNum > 0) {
                      var em = document.createElement("span");
                      em.className = "interim";
                      em.innerHTML = "...";
                      info.find(".pagination-pages").append(em);
                  }
                  for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                      if (i > allPageNum) {
                          break;
                      } else {
                          if (i <= 2) {
                              continue;
                          } else {
                              if (nowPageNum == i) {
                                  var page = document.createElement("span");
                                  page.className = "curr";
                                  page.innerHTML = i;
                              } else {
                                  var page = document.createElement("a");
                                  page.innerHTML = i;
                                  page.onclick = function () {
                                      atpage = Number($(this).text());
                                      getList();
                                  }
                              }
                              info.find(".pagination-pages").append(page);
                          }
                      }
                  }
                  var addNum = nowPageNum + 2;
                  if (addNum < allPageNum - 1) {
                      var em = document.createElement("span");
                      em.className = "interim";
                      em.innerHTML = "...";
                      info.find(".pagination-pages").append(em);
                  }
                  for (var i = allPageNum - 1; i <= allPageNum; i++) {
                      if (i <= nowPageNum + 1) {
                          continue;
                      } else {
                          var page = document.createElement("a");
                          page.innerHTML = i;
                          page.onclick = function () {
                              atpage = Number($(this).text());
                              getList();
                          }
                          info.find(".pagination-pages").append(page);
                      }
                  }
              }

              //下一页
              if (nowPageNum < allPageNum) {
                  var next = document.createElement("a");
                  next.className = "next";
                  next.innerHTML = '下一页';
                  next.onclick = function () {
                      atpage = nowPageNum + 1;
                      getList();
                  }
              } else {
                  var next = document.createElement("span");
                  next.className = "next disabled";
                  next.innerHTML = '下一页';
              }
              info.find(".pagination-pages").append(next);

              info.show();

          } else {
              info.hide();
          }
    }

    getList_0();
    getList_1('intit');

    var sendSmsData = [];

  if(geetest){
    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd){
      captchaObjFpwd.onSuccess(function (){
        var validate = captchaObjFpwd.getValidate();
        sendSmsData.push('geetest_challenge='+validate.geetest_challenge);
        sendSmsData.push('geetest_validate='+validate.geetest_validate);
        sendSmsData.push('geetest_seccode='+validate.geetest_seccode);
        $("#vercode").focus();
        sendSmsFunc();
      });

      $('.getCodes').bind("click", function (){
        if($(this).hasClass('disabled')) return false;
        var tel = $("#telphone").val();
        if(tel == ''){
          $('.senderror').text('请输入手机号码').show();
          $("#telphone").focus();
          return false;
        }
        //弹出验证码
        captchaObjFpwd.verify();
      })
    };

    $.ajax({
      url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
      type: "get",
      dataType: "json",
      success: function(data) {
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: "bind",
          width: '312px'
        }, handlerPopupFpwd);
      }
    });
  }else{
    $(".getCodes").bind("click", function (){
      if($(this).hasClass('disabled')) return false;
      var tel = $("#telphone").val();
      if(tel == ''){
        errMsg = "请输入手机号码";
        showMsg(errMsg);
        $("#telphone").focus();
        return false;
      }
      $("#vercode").focus();
      sendSmsFunc();
    })
  }

  //发送验证码
  function sendSmsFunc(){
    var tel = $("#telphone").val();
    var areaCode = $("#areaCode").val().replace('+', '');
    var sendSmsUrl = "/include/ajax.php?service=siteConfig&action=getPhoneVerify";

    sendSmsData.push('type=verify');
    sendSmsData.push('areaCode=' + areaCode);
    sendSmsData.push('phone=' + tel);

    $('.senderror').text('');
    $.ajax({
      url: sendSmsUrl,
      data: sendSmsData.join('&'),
      type: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.state == 101) {
          $('.senderror').text(res.info);
        }else{
          countDown($('.getCodes'), 60);
        }
      }
    })
  }


  //倒计时
  function countDown(obj,time){
    obj.html(time+'秒后重发').addClass('disabled');
    mtimer = setInterval(function(){
      obj.html((--time)+'秒后重发').addClass('disabled');
      if(time <= 0) {
        clearInterval(mtimer);
        obj.html('重新发送').removeClass('disabled');
      }
    }, 1000);
  }
})
