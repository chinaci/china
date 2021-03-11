
function transTimes(timestamp, n){
    update = new Date(timestamp*1000);//时间戳要乘1000
    year   = update.getFullYear();
    month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
    day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
    hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
    minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
    second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
    if(n == 1){
      return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
    }else if(n == 2){
      return (year+'-'+month+'-'+day);
    }else if(n == 3){
      return (month+'-'+day);
    }else if(n == 4){
      return (hour+':'+minute);
    }else{
      return 0;
    }
  }

$(function(){

  var listArr = [];

  //商品属性选择
  var SKUResult = {};  //保存组合结果
  var mpriceArr = [];  //市场价格集合
  var priceArr = [];   //现价集合
  var totalStock = 0;  //总库存
  var skuObj = $(".size-box .size-count"),
      mpriceObj = $(".size-box .size-selected .price .mprice"),          //原价
      priceObj = $(".size-box .size-selected p.price b"),    //现价
      stockObj = $(".size-box .count b"),                   //库存
      disabled = "disabled",                               //不可选
      selected = "selected";                               //已选

  // 点击加入购物车选择颜色、尺码
  // var myscroll = null;
  $('body').delegate('.ter', 'touchend', function(){
    var t = $(this), li = t.closest('.item'), id = li.attr('data-id');
    //验证登录
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = '/login.html';
      return false;
    }

    var specification = listArr[id].specification, specificationArr = listArr[id].specificationArr,
        imgSrc = li.find('.pro-img').find('img').attr('src');
    $('.guige em').text();
    li.addClass('layer').siblings('.item').removeClass('layer');
    if (specification != "") {
      $('.mask').css('display', 'block');
      $('.size-box').css('bottom', '0');

      //商品属性选择
      SKUResult = {};  //保存组合结果
      mpriceArr = [];  //市场价格集合
      priceArr = [];   //现价集合
      totalStock = 0;  //总库存
      var skuObj = $(".size-box .size-count"),
          mpriceObj = $(".size-box .size-selected .price .mprice"),          //原价
          priceObj = $(".size-box .size-selected p.price b"),    //现价
          stockObj = $(".size-box .count b"),                   //库存
          disabled = "disabled",                               //不可选
          selected = "selected";                               //已选

      init.start(id);

      // if(myscroll == null){
      //   myscroll = new iScroll("scrollbox", {vScrollbar: false,});
      // }

      $('.size-img img').attr('src', imgSrc);
      return false;

    }else {
      var cartNum = Number($('.total-cart em').text()), detailUrl = $('.command-list-con .layer a').attr('href'),
          layerId = $('.command-list-con .layer').attr('data-id'), detailTitle = $('.command-list-con .layer h4').text();
      var t = $(this).offset();
      var offset = $(".ficon5").offset();
      var img = $(this).closest(".item").find('img').attr('src'); //获取当前点击图片链接
      var flyer = $('<img class="flyer-img" style="z-index:1000;" src="' + img + '">'); //抛物体对象
      var num=parseInt($(".shop-count").text());
      var scH = $(window).scrollTop();

      flyer.fly({
        start: {
          left: t.left - 50, //抛物体起点横坐标
          top: t.top - scH - 30, //抛物体起点纵坐标
          width: 30,
          height: 30
        },
        end: {
          left: offset.left + 12,//抛物体终点横坐标
          top: offset.top-scH, //抛物体终点纵坐标
          width:15,
          height:15
        },
        onEnd: function() {
          this.destroy(); //销毁抛物体
          $('.total-cart').addClass('swing');

          setTimeout(function(){$('.total-cart em').removeClass('swing')},300);
        }
      });

      var t=''; //该商品的属性编码 以“-”链接个属性
      $(".sys_item .selected").each(function(){
        var y=$(this).attr("attr_id");
        t=t+"-"+y;
      })
      var t=t.substr(1);

      //操作购物车
      var data = [];
      data.id = layerId;
      data.specation = t;
      data.count = 1;
      data.title = detailTitle;
      data.url = detailUrl;
      shopInit.add(data);

    }
  })

  // 关闭规格弹出层
  $('.mask, .closed').click(function(){
    $('.mask').hide();
    $('.size-box').css('bottom', '-200%');
  })

  // 选择规格点击确定
  $('.size-confirm a').click(function(){
    var count = Number($('.shop-count').text()), cart = Number($('.total-cart em').text());
    $('.total-cart em').text(count + cart);
    var winWidth = $(window).width(), winHeight = $(window).height(), cartNum = Number($('.total-cart em').text()),
        layerId = $('.command-list-con .layer').attr('data-id'), detailTitle = $('.command-list-con .layer h3').text(),
        detailUrl = $('.command-list-con .layer a').attr('href');

    //加入购物车及加入购物车判断
    var $buy=$(this),$li=$(".sys_item"),$ul=$(".size-html"),n=$li.length;
    if($buy.hasClass("disabled")) return false;
    var len=$li.length;
    var spValue=parseInt($(".size-selected .count b").text()),
        inputValue=parseInt($(".shop-count").text());

    if($(".sys_item dd").find("a.selected").length==n && inputValue<=spValue){

      //加入购物车动画
      $(".size-html").removeClass("on");
      var offset = $(".ficon5").offset();
      var detailThumb = $('.size-img img').attr('src');
      var flyer = $('<img class="flyer-img" style="z-index:1000;" src="' + detailThumb + '">'); //抛物体对象
      var t = $('.command-list-con .layer .ter').offset();
      var scH = $(window).scrollTop();

      flyer.fly({
        start: {
          left: t.left - 50, //抛物体起点横坐标
          top: t.top - scH - 30, //抛物体起点纵坐标
          width: 30,
          height: 30
        },
        end: {
          left: offset.left + 12,//抛物体终点横坐标
          top: offset.top-scH, //抛物体终点纵坐标
          width: 15,
          height: 15

        },
        onEnd: function() {
          this.destroy(); //销毁抛物体
          $('.total-cart').addClass('swing');
          setTimeout(function(){$('.total-cart em').removeClass('swing')},300);
        }
      });

      $('.mask').hide();
      $('.size-box').css('bottom', '-200%');

      var t=''; //该商品的属性编码 以“-”链接个属性
      $(".sys_item").each(function(){
        var $t=$(this),y=$t.find("a.selected").attr("attr_id");
         t=t+"-"+y;
      })
      t=t.substr(1);

      var num=parseInt($(".shop-count").text());

      //操作购物车
      var data = [];
      data.id = layerId;
      data.specation = t;
      data.count = num;
      data.title = detailTitle;
      data.url = detailUrl;
      shopInit.add(data);

    }else{
      $ul.addClass("on");
      $('.guige-tips').show();
      // setTimeout(function(){$('.guige-tips').hide();}, 1000);
    }

  })

  // 选择规格增加数量
  $('.sizeBtn .add').click(function(){
    var stockx = parseInt($(".size-selected .count b").text()),n=$(".sys_item").length;
    var $c=$(this),value;
    value=parseInt($c.siblings(".shop-count").html());
    if(value<stockx){
      value=value+1;
      $c.siblings(".shop-count").html(value);
      if(value>=stockx){}
      var spValue=parseInt($(".size-selected .count b").text()),
      inputValue=parseInt($(".shop-count").val());
      if($(".color-info-ul ul").find("li.active").length==n && inputValue<spValue){
        // $(".singleGoods dd.info ul").removeClass("on");
      }
    }else{
      alert(langData['shop'][2][23])
    }



  })

  // 选择规格减少数量
  $('.sizeBtn .reduce').click(function(){
    var stockx = parseInt($(".size-selected .count b").text()),n=$(".sys_item").length;
    var $c=$(this),value;
    value=parseInt($c.siblings(".shop-count").html());
    if(value>1){
      value=value-1;
      $c.siblings(".shop-count").html(value);
      if(value<=stockx){}
      var spValue=parseInt($(".size-selected .count b").text()),
      inputValue=parseInt($(".shop-count").val());
      if($(".color-info-ul ul").find("li.active").length==n && inputValue<=spValue){
      }
    }else{
      alert(langData['shop'][2][12])
    }
  })

  // 加入购物车的商品选择规格框
  var init = {

    //拼接HTML代码
    start: function(id){
      var specification = listArr[id].specification, specificationArr = listArr[id].specificationArr, sizeHtml = [];
      for (var i = 0; i < specificationArr.length; i++) {
        sizeHtml.push('<dl class="sys_item"><dt>'+specificationArr[i].typename+'</dt>');
        var itemArr = specificationArr[i].item;
        sizeHtml.push('<dd class="fn-clear">');
        for (var j = 0; j < itemArr.length; j++) {
          sizeHtml.push('<a href="javascript:;" class="sku" attr_id="'+itemArr[j].id+'">'+itemArr[j].name+'</a>');
        }
        sizeHtml.push('</dd>');
        sizeHtml.push('</dl>');
      }
      $('.size-html').html(sizeHtml.join(""));
      init.initSKU(id);
    }


    //默认值
    ,defautx: function(){

      //市场价范围
      var maxPrice = Math.max.apply(Math, mpriceArr);
      var minPrice = Math.min.apply(Math, mpriceArr);
      mpriceObj.html(echoCurrency('symbol')+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));

      //现价范围
      var maxPrice = Math.max.apply(Math, priceArr);
      var minPrice = Math.min.apply(Math, priceArr);
      priceObj.html(echoCurrency('symbol')+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));

      //总库存

      stockObj.text(totalStock);

      //设置属性状态
      $('.sku').each(function() {
        SKUResult[$(this).attr('attr_id')] ? $(this).removeClass(disabled) : $(this).addClass(disabled).removeClass(selected);
      })

    }

    //初始化得到结果集
    ,initSKU: function(id) {
      var i, j, skuKeys = listArr[id].specification;

      for(i = 0; i < skuKeys.length; i++) {
        var _skuKey = skuKeys[i].spe.split("-");  //一条SKU信息value
        var skuKey = _skuKey.join(";");  //一条SKU信息key
        var sku = skuKeys[i].price; //一条SKU信息value
        var skuKeyAttrs = skuKey.split(";");  //SKU信息key属性值数组
        var len = skuKeyAttrs.length;

        //对每个SKU信息key属性值进行拆分组合
        var combArr = init.arrayCombine(skuKeyAttrs);

        for(j = 0; j < combArr.length; j++) {
          init.add2SKUResult(combArr[j], sku);
        }

        mpriceArr.push(sku[0]);
        priceArr.push(sku[1]);
        totalStock += parseInt(sku[2]);

        //结果集接放入SKUResult
        SKUResult[skuKey] = {
          stock: sku[2],
          prices: [sku[1]],
          mprices: [sku[0]]
        }
      }

      init.defautx();
    }

    //把组合的key放入结果集SKUResult
    ,add2SKUResult: function(combArrItem, sku) {
      var key = combArrItem.join(";");
      //SKU信息key属性
      if(SKUResult[key]) {
        SKUResult[key].stock = parseInt(SKUResult[key].stock) + parseInt(sku[2]);
        SKUResult[key].prices.push(sku[1]);
        SKUResult[key].mprices.push(sku[0]);
      } else {
        SKUResult[key] = {
          stock: sku[2],
          prices: [sku[1]],
          mprices: [sku[0]]
        };
      }
    }

    //从数组中生成指定长度的组合
    ,arrayCombine: function(targetArr) {
      if(!targetArr || !targetArr.length) {
        return [];
      }

      var len = targetArr.length;
      var resultArrs = [];

      // 所有组合
      for(var n = 1; n < len; n++) {
        var flagArrs = init.getFlagArrs(len, n);
        while(flagArrs.length) {
          var flagArr = flagArrs.shift();
          var combArr = [];
          for(var i = 0; i < len; i++) {
            flagArr[i] && combArr.push(targetArr[i]);
          }
          resultArrs.push(combArr);
        }
      }

      return resultArrs;
    }

    //获得从m中取n的所有组合
    ,getFlagArrs: function(m, n) {
      if(!n || n < 1) {
        return [];
      }

      var resultArrs = [],
        flagArr = [],
        isEnd = false,
        i, j, leftCnt;

      for (i = 0; i < m; i++) {
        flagArr[i] = i < n ? 1 : 0;
      }

      resultArrs.push(flagArr.concat());

      while (!isEnd) {
        leftCnt = 0;
        for (i = 0; i < m - 1; i++) {
          if (flagArr[i] == 1 && flagArr[i+1] == 0) {
            for(j = 0; j < i; j++) {
              flagArr[j] = j < leftCnt ? 1 : 0;
            }
            flagArr[i] = 0;
            flagArr[i+1] = 1;
            var aTmp = flagArr.concat();
            resultArrs.push(aTmp);
            if(aTmp.slice(-n).join("").indexOf('0') == -1) {
              isEnd = true;
            }
            break;
          }
          flagArr[i] == 1 && leftCnt++;
        }
      }
      return resultArrs;
    }

    // 将已选展示出来
    ,getSelected: function(){
      var selectedHtml = [];
      $('.size-html .sys_item').each(function(){
        var t = $(this), selected = t.find('.selected').text();
        if (selected) {
          selectedHtml.push('\"'+selected+'\"');
        }
        $('.guige em').text(selectedHtml.join(","));
      })
    }

  }


  //点击事件
  $('.sku').each(function() {
    var self = $(this);
    var attr_id = self.attr('attr_id');
    if(!SKUResult[attr_id]) {
      self.addClass(disabled);
    }
  })
  $('body').delegate('.sku', 'click', function() {

    var self = $(this);


    if(self.hasClass(disabled)) return;

    //选中自己，兄弟节点取消选中
    self.toggleClass(selected).siblings("a").removeClass(selected);
    var spValue=parseInt($(".size-box .count b").text()),
    inputValue=parseInt($(".shop-count").text());
    var n=$(".size-html .sys_item").length;

    if($(".size-html .sys_item").find("a.selected").length==n && inputValue<spValue){
      $(".size-html").removeClass("on");
      $('.guige-tips').hide();
    }

    //已经选择的节点
    var selectedObjs = $('.'+selected);
    init.getSelected();

    if(selectedObjs.length) {
      //获得组合key价格
      var selectedIds = [];
      selectedObjs.each(function() {
        selectedIds.push($(this).attr('attr_id'));
      });
      selectedIds.sort(function(value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });
      var len = selectedIds.length;

      var prices = SKUResult[selectedIds.join(';')].prices;
      var maxPrice = Math.max.apply(Math, prices);
      var minPrice = Math.min.apply(Math, prices);
      priceObj.html(echoCurrency('symbol')+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));


      var mprices = SKUResult[selectedIds.join(';')].mprices;
      var maxPrice = Math.max.apply(Math, mprices);
      var minPrice = Math.min.apply(Math, mprices);
      mpriceObj.html(echoCurrency('symbol')+(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2)));


      stockObj.text(SKUResult[selectedIds.join(';')].stock);

      //获取input的值
      var inputValue=parseInt($(".shop-count").val());
      // var inputTip=$(".singleGoods dd cite");

      if(inputValue>SKUResult[selectedIds.join(';')].stock){
        alert(langData['shop'][2][24]);
      }


      //用已选中的节点验证待测试节点 underTestObjs
      $(".sku").not(selectedObjs).not(self).each(function() {
        var siblingsSelectedObj = $(this).siblings('.'+selected);
        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
        if(siblingsSelectedObj.length) {
          var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
          for(var i = 0; i < len; i++) {
            (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
          }
        } else {
          testAttrIds = selectedIds.concat();
        }
        testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
        testAttrIds.sort(function(value1, value2) {
          return parseInt(value1) - parseInt(value2);
        });
        if(!SKUResult[testAttrIds.join(';')]) {
          $(this).addClass(disabled).removeClass(selected);
        } else {
          $(this).removeClass(disabled);
        }
      });
    } else {
      init.defautx();
    }
  });






  var device = navigator.userAgent;
  var cookie = $.cookie("HN_float_hide");

  // 判断设备类型，ios全屏
  if (device.indexOf('huoniao_iOS') > -1) {
    $('body').addClass('huoniao_iOS');
  }

  //如果不是在客户端，显示下载链接
  if (device.indexOf('huoniao') <= -1 && cookie == null) {
    $('.top_fixed').css('height', '1.96rem');
    $('.header').css('top', '1.2rem');
    $('.float-download').show();
  }


  $('.float-download .closesd').click(function(){
    $('.float-download').hide();
    $('.top_fixed').css('height', '.76rem');
    $('.header').css('top', '0');
    setCookie('HN_float_hide', '1', '1');
  })

  function setCookie(name, value, hours) { //设置cookie
     var d = new Date();
     d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
     var expires = "expires=" + d.toUTCString();
     document.cookie = name + "=" + value + "; " + expires;
  }


  //切换城市、搜索跳转
  $('.header .cityname, .header .search').bind('click', function(){
    location.href = $(this).data('url');
  });


  //扫一扫
  $(".header").delegate(".scan", "click", function(){

    //APP端
    if(device.indexOf('huoniao') > -1){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("QRCodeScan", {}, function callback(DataInfo){
          if(DataInfo){
            if(DataInfo.indexOf('http') > -1){
              location.href = DataInfo;
            }else{
              alert(DataInfo);
            }
          }
        });
      });

    //微信端
    }else if(device.toLowerCase().match(/micromessenger/) && device.toLowerCase().match(/iphone|android/)){
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxconfig.appId, // 必填，公众号的唯一标识
        timestamp: wxconfig.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxconfig.nonceStr, // 必填，生成签名的随机串
        signature: wxconfig.signature,// 必填，签名，见附录1
        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      wx.scanQRCode({
        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
        needResult : 1,
        desc: '扫一扫',
        success : function(res) {
          if(res.resultStr){
            if(res.resultStr.indexOf('http') > -1){
              location.href = res.resultStr;
            }else{
              alert(res.resultStr);
            }
          }
        },
        fail: function(err){
          alert(langData['siteConfig'][20][183]);
        }
      });

    //浏览器
    }else{
      $('.downloadAppFixed').css("visibility","visible");
      $('.downloadAppFixed .con').show();
    }

  });

  var ua = navigator.userAgent;
  var appVersion = '1.0';
  if(ua.match(/(iPhone|iPod|iPad);?/i)) {
    appVersion = $('.downloadAppFixed .app dd p').attr('data-ios');
  }else{
    appVersion = $('.downloadAppFixed .app dd p').attr('data-android');
  }
  $('.downloadAppFixed .app dd em').html(appVersion);
  $('.downloadAppFixed .close').bind('click', function(){
    $('.downloadAppFixed .con').hide();
    $('.downloadAppFixed').css("visibility","hidden");
  });







  var loadMoreLock = false;

  // 幻灯片
  new Swiper('#slider', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

  // 滑动导航
  var swiperNav = [], mainNavLi = $('.mainNav li');
  for (var i = 0; i < mainNavLi.length; i++) {
    swiperNav.push('<li>'+$('.mainNav li:eq('+i+')').html()+'</li>');
  }

  var liArr = [];
  for(var i = 0; i < swiperNav.length; i++){
    liArr.push(swiperNav.slice(i, i + 10).join(""));
    i += 9;
  }

  $('.mainNav .swiper-wrapper').html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');

  var mySwiperNav = new Swiper('.mainNav',{pagination : '.swiper-pagination',})

  var navbar = $('.navbar');
  var navHeight = navbar.offset().top;

  // 导航条左右切换模块
  var tabsSwiper = new Swiper('#tabs-container',{
    speed:350,
    autoHeight: true,
    touchAngle : 35,
    onSlideChangeStart: function(){
      loadMoreLock = false;
      $(".navbar .active").removeClass('active');
      $(".navbar li").eq(tabsSwiper.activeIndex).addClass('active');
      if (navbar.hasClass('fixed')) {
        $(window).scrollTop(navHeight + 2);
      }

      $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height());

      // 当模块的数据为空的时候加载数据
      if($.trim($("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find(".content-slide").html()) == ""){
        $("#tabs-container .swiper-slide").eq(tabsSwiper.activeIndex).find('.content-slide').html('<div class="loading"><i class="icon-loading"></i>加载中...</div>')
        getList();
      }

    },
    onSliderMove: function(){
      // isload = true;
    },
    onSlideChangeEnd: function(){
      // isload = false;
    }
  })
  $(".navbar li").on('touchstart mousedown',function(e){
    e.preventDefault();
    $(".navbar .active").removeClass('active');
    $(this).addClass('active');
    tabsSwiper.slideTo( $(this).index() );

  })
  $(".tabs a").click(function(e){
    e.preventDefault();
  })


  // 导航吸顶
  $(window).on("scroll", function(){
    var sct = $(window).scrollTop();
    // if ($(window).scrollTop() > navHeight) {
    //  $('.navbar').addClass('fixed');
    //  if (device.indexOf('huoniao_iOS') > -1) {
    //    $('.navbar, .navblank').addClass('padTop20');
    //  }
    // }else {
    //   $('.navbar').removeClass('fixed padTop20');
    //   $('.navblank').removeClass('padTop20');
    //  $('.gotop').hide();
    // }

    if(sct + $(window).height() + 50 > $(document).height() && !loadMoreLock) {
        var page = parseInt($('.navbar .active').attr('data-page')),
            totalPage = parseInt($('.navbar .active').attr('data-totalPage'));
        if(page < totalPage) {
            ++page;
            $('.navbar .active').attr('data-page', page);
            getList();
        }
    }
  });


  getList();


  // 异步获取列表
  function getList(config){
    var active = $('.navbar .active'), action = active.attr('data-action'), url;
    var page = active.attr('data-page');
    var ts = false;
    if (action == "article") {
      url = masterDomain + "/include/ajax.php?service=article&action=alist&page=" + page + "&pageSize=10";
    }else if (action == "huodong") {
      url = masterDomain + "/include/ajax.php?service=huodong&action=hlist&page=" + page + "&pageSize=10";
    }else if (action == "tieba") {
      url = masterDomain + "/include/ajax.php?service=tieba&action=tlist&page=" + page + "&pageSize=10";
    }else if (action == "video") {
      url = masterDomain + "/include/ajax.php?service=video&action=alist&page=" + page + "&pageSize=10";
    }else if (action == "live") {
      // url = masterDomain + "/include/ajax.php?service=huodong&action=hlist&page=" + page + "&pageSize=10";
    }else if (action == "business"){
      ts = true;
      if (page == "1"){
        $(".business").html($("#businessType").html());
        $(".business").append('<div class="loading"><i class="icon-loading"></i>加载中...</div>');
      }
      HN_Location.init(function(data){
        if (data && data.address && data.name && data.lat && data.lng) {
          var lng = data.lng, lat = data.lat;
          url = masterDomain + "/include/ajax.php?service=business&action=blist&page=" + page + "&pageSize=10&lng="+lng+"&lat="+lat;
          ajaxGet(url);
        }
      })
    }else if (action == "info") {
      url = masterDomain + "/include/ajax.php?service=info&action=ilist&page=" + page + "&pageSize=10";
    }else if (action == "shop") {
      if (page == "1"){
        $(".shop").html($("#shopType").html());
        $(".shop").append('<div class="loading" style="top:auto;margin-top:1rem;"><i class="icon-loading"></i>加载中...</div>');
      }
      url = masterDomain + "/include/ajax.php?service=shop&action=slist&page=" + page + "&pageSize=10";
    }else if (action == "huangye") {
      if (page == "1"){
        var html = $("#huangyeType").html();
        if(!config){
          config = {cls:'ll_0'};
        }
        html = html.replace(config.cls, 'll');
        $(".huangye").html(html);
        $(".huangye").append('<div class="loading" style="top:auto;margin-top:1rem;"><i class="icon-loading"></i>加载中...</div>');
      }
      var more = $(".content-lead li.ll").attr("data-field");
      var data = more ? ('&' + more) : '';
      url = masterDomain + "/include/ajax.php?service=huangye&action=ilist&page=" + page + "&pageSize=10" + data;
    }

    !ts && ajaxGet(url);


  }

  function ajaxGet(url){
    loadMoreLock = true;
    var active = $('.navbar .active'), action = active.attr('data-action');
    $.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp",
      success: function(data){  
        if (data && data.state != 200) {
          if (data.state == 101) {
            $('.loading').html('暂无数据！');
            // panel.children('.content').append("<p class='error'>"+data.info+"</p>");
          }else {
            var list = data.info.list, articleHtml = [], huodongHtml = [], tiebaHtml = [], videoHtml = [], liveHtml = [], infoHtml = [], businessHtml = [], shopHtml = [], huangyeHtml = [];
            var totalPage = data.info.pageInfo.totalPage;
            active.attr('data-totalPage', totalPage);
            for (var i = 0; i < list.length; i++) {
              // 资讯模块
              if (action == "article") {

                // 如果是图集
                if(list[i].group_img){
                  articleHtml.push('<div class="item imglist">');
                  articleHtml.push('<a href="' + list[i].url + '" class="fn-clear">');
                  articleHtml.push('<div class="item-txt">');
                  articleHtml.push('<p class="item-tit">' + list[i].title + '</p>');
                  // articleHtml.push('<p class="item-des">' + list[i].description + '</p>');
                  articleHtml.push('<ul class="item-pics fn-clear">');
                  var n = 0;
                  for (var g = 0; g < list[i].group_img.length; g++) {
                    var src = huoniao.changeFileSize(list[i].group_img[g].path, "small");
                    if(src && n < 3) {
                      articleHtml.push('<li><img src="' + src +'"></li>');
                      n++;
                      if(n == 3) break;
                    }
                  }
                  articleHtml.push('</ul>');
                  articleHtml.push('<ul class="item-info fn-clear"><li class="time">' + returnHumanTime(list[i].pubdate,3) + '</li><li class="comment">' + list[i].common + '</li></ul>');
                  articleHtml.push('</div>');
                  articleHtml.push('</a>');
                  articleHtml.push('</div>');

                // 缩略图
                }else {
                  var litpic = list[i].litpic;
                  articleHtml.push('<div class="item">');
                  articleHtml.push('<a href="' + list[i].url + '" class="fn-clear">');
                  if (litpic) {
                    articleHtml.push('<div class="item-img"><img src="' + list[i].litpic + '"></div>');
                  }
                  articleHtml.push('<div class="item-txt">');
                  if (litpic) {
                    articleHtml.push('<p class="item-tit">' + list[i].title + '</p>');
                  }else {
                    articleHtml.push('<p class="item-tit mb0">' + list[i].title + '</p>');
                  }
                  // articleHtml.push('<p class="item-des">' + list[i].description + '</p>');
                  articleHtml.push('<ul class="item-info fn-clear"><li class="time">' + returnHumanTime(list[i].pubdate,3) + '</li><li class="comment">' + list[i].common + '</li></ul>');
                  articleHtml.push('</div>');
                  articleHtml.push('</a>');
                  articleHtml.push('</div>');
                }

              // 活动列表
              }else if (action == "huodong") {
                var userphoto = list[i].userphoto, feetype = list[i].feetype;
                huodongHtml.push('<div class="item">');
                huodongHtml.push('<a href="' + list[i].url + '" class="fn-clear">');
                huodongHtml.push('<div class="item-user fn-clear">');
                if (userphoto) {
                  huodongHtml.push('<img src="' + userphoto + '" alt="">');
                }else {
                  huodongHtml.push('<img src="' + templets + 'images/noavatar_middle.gif">');
                }
                huodongHtml.push('<span>' + list[i].username + '</span>');
                if (feetype == 1) {
                  huodongHtml.push('<em class="price">'+echoCurrency('symbol')+ list[i].mprice + '</em>');
                }else {
                  huodongHtml.push('<em>免费</em>');
                }
                huodongHtml.push('</div>');
                huodongHtml.push('<div class="item-img">');
                huodongHtml.push('<img src="' + list[i].litpic + '">');
                huodongHtml.push('<p>' + list[i].title + '</p>');
                huodongHtml.push('<i></i>');
                huodongHtml.push('</div>');
                huodongHtml.push('<div class="item-info fn-clear">');
                huodongHtml.push('<span class="time">' + returnHumanTime(list[i].pubdate,3) + ' 开始</span>');
                huodongHtml.push('<span class="addr">' + list[i].addrname[0] + '</span>');
                huodongHtml.push('</div>');
                huodongHtml.push('</a>');
                huodongHtml.push('</div>');

              // 贴吧列表
              }else if (action == "tieba") {
                var group = list[i].imgGroup, username = list[i].username;
                tiebaHtml.push('<div class="item">');
                tiebaHtml.push('<a href="' + list[i].url + '" class="fn-clear">');
                tiebaHtml.push('<div class="item-user fn-clear">');
                if (list[i].photo == "") {
                  tiebaHtml.push('<img src="' + templets + 'images/noavatar_middle.gif">');
                }else{
                  tiebaHtml.push('<img src="' + list[i].photo + '">');
                }
                // 有没有名字
                if (username != "") {
                  tiebaHtml.push('<span>' + username + '</span>');
                }else {
                  tiebaHtml.push('<span>匿名</span>');
                }
                tiebaHtml.push('<em class="biaoqian">' + list[i].typename[0] + '</em>');
                tiebaHtml.push('</div>');
                if (list[i].content != "") {
                  tiebaHtml.push('<div class="item-txt">' + list[i].content + '</div>');
                }

                //图集
                if(group.length > 0){
                  if (group.length == 1) {
                    tiebaHtml.push('<div class="item-img"><img src="' + group[0] + '" alt=""></div>');
                  }else {
                    tiebaHtml.push('<div class="item-pics fn-clear">')
                    if(group.length > 3){
                      tiebaHtml.push('<span class="total">共 '+group.length+' 张</span>');
                    }
                    for(var g = 0; g < group.length; g++){
                      if(g < 3){
                        tiebaHtml.push('<img src="' + group[g] + '" alt="">');
                      }
                    }
                    tiebaHtml.push('</div>');
                  }
                }

                // tiebaHtml.push('<div class="item-comment">行走的美好  评论：是的，你冲她发牢骚,你大声顶撞她甚至当着她的面摔碗，她都不会记恨你，原因很简单，因为她是你的母亲.....</div>');
                tiebaHtml.push('<div class="item-info">');
                tiebaHtml.push('<span class="time">' + transTimes(list[i].pubdate, 4) + '</span>');
                tiebaHtml.push('<span class="comment">' + list[i].reply + '</span>');
                tiebaHtml.push('<span class="click">' + list[i].click + '</span>');
                tiebaHtml.push('</div>');
                tiebaHtml.push('</a>');
                tiebaHtml.push('</div>');

              // 视频
              }else if (action == "video") {
                videoHtml.push('<div class="item">');
                videoHtml.push('<a href="' + list[i].url + '">');
                videoHtml.push('<p class="item-tit">' + list[i].title + '</p>');
                videoHtml.push('<div class="item-thumb">');
                videoHtml.push('<img src="' + list[i].litpic + '">');
                videoHtml.push('<i class="video-bg"></i>');
                // videoHtml.push('<em class="video-time"><s></s>01:40</em>');
                videoHtml.push('</div>');
                videoHtml.push('<div class="item-info fn-clear">');
                // videoHtml.push('<div class="item-user fn-clear"><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2017/03/23/98461490263301.png" alt="">叶落纷飞</div>');
                videoHtml.push('<div class="item-click">' + list[i].click + '次播放</div>');
                videoHtml.push('<div class="item-comment">' + list[i].common + '</div>');
                // videoHtml.push('<div class="item-share">2.1万</div>');
                videoHtml.push('</div>');
                videoHtml.push('</a>');
                videoHtml.push('</div>');

              // 直播
              }else if (action == "live") {

              // 二手
              }else if (action == "info") {
                var username = list[i].member.nickname, userphoto = list[i].member.photo;
                infoHtml.push('<div class="item">');
                infoHtml.push('<a href="' + list[i].url + '">');
                infoHtml.push('<div class="item-user fn-clear">');
                if (userphoto == null) {
                  infoHtml.push('<div class="item-img"><img src="' + templets + 'images/noavatar_middle.gif"></div>');
                }else {
                  infoHtml.push('<div class="item-img"><img src="' + userphoto + '"></div>');
                }
                if (username) {
                  infoHtml.push('<div class="item-name"><p>' + username + '</p>');
                }else {
                  infoHtml.push('<div class="item-name"><p>匿名</p>');
                }
                infoHtml.push('<p class="item-local">3分钟前来过</p></div>');
                // infoHtml.push('<div class="item-tag">￥<em>1350.00</em></div>');
                infoHtml.push('</div>');
                infoHtml.push('<div class="item-img"><img src="' + list[i].litpic + '"></div>');
                infoHtml.push('<p class="item-info">' + list[i].title + '</p>');
                // infoHtml.push('<div class="item-msg">');
                // infoHtml.push('<p>主人回复：对的</p>');
                // infoHtml.push('<p>余新梅：看得出来质量很好，九成新对吧？</p>');
                // infoHtml.push('</div>');
                infoHtml.push('</a>');
                infoHtml.push('<div class="item-zan">');
                // infoHtml.push('<ul class="fn-clear">');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/09/14575161626732.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/14/14579138068133.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/09/14575162725879.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/13/14578720665088.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/09/14575161626732.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/14/14579138068133.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/09/14575162725879.jpg" alt=""></li>');
                // infoHtml.push('<li><img src="http://ios.woaisezhan.com/uploads/siteConfig/photo/large/2016/03/13/14578720665088.jpg" alt=""></li>');
                // infoHtml.push('<li class="more"><img src="' + templets + 'images/more_icon.png" alt=""></li>');
                // infoHtml.push('</ul>');
                infoHtml.push('<p class="fn-clear"><span class="from">来自' + list[i].address + '</span></p>');
                // infoHtml.push('<span class="zan">102</span>');
                infoHtml.push('</div>');
                infoHtml.push('</div>');
              
              // 商家
              }else if (action == "business"){
                businessHtml.push('<div class="item">');
                businessHtml.push('  <a href="' + list[i].url + '" class="url fn-clear">');
                businessHtml.push('    <div class="item-img"><img src="' + list[i].logo + '"></div>');
                businessHtml.push('    <div class="item-txt">');
                businessHtml.push('      <p class="item-tit">' + list[i].title + '</p>');
                businessHtml.push('      <p class="item-des">地址：' + list[i].address + '</p>');
                businessHtml.push('      <p class="item-tel">电话：' + list[i].tel + '</p>');
                businessHtml.push('    </div>');
                businessHtml.push('  </a>');
                businessHtml.push('  <a href="tel:' + list[i].tel + '" class="tel"></a>');
                businessHtml.push('  <a href="https://api.map.baidu.com/marker?location=' + list[i].lat + ',' + list[i].lng + '&title=' + list[i].title + '&content=' + list[i].address + '&output=html" class="addr"></a>');
                businessHtml.push('</div>');

              // 商城
              }else if (action == "shop"){
                var lr = list[i];
                var pic = lr.litpic == false || lr.litpic == '' ? '/static/images/blank.gif' : lr.litpic;
                var specification = lr.specification

                shopHtml.push('<div class="item" data-id="'+lr.id+'">');
                shopHtml.push('   <a href="'+lr.url+'">');
                shopHtml.push('     <div class="pro-img">');
                shopHtml.push('       <img src="'+pic+'" alt="">');
                shopHtml.push('     </div>');
                shopHtml.push('   </a>');
                shopHtml.push('   <div class="pro-txt">');
                shopHtml.push('     <h4 class="mt10">'+lr.title+'</h4>');
                shopHtml.push('     <div class="pro-price mt10">');
                shopHtml.push('       <span>'+echoCurrency('symbol')+lr.price+'</span>');
                shopHtml.push('       <em>'+echoCurrency('symbol')+lr.mprice+'</em>');
                shopHtml.push('     </div>');
                shopHtml.push('     <div class="pro-info">');
                shopHtml.push('       <span>'+langData['shop'][3][7].replace('1', '<em class="yellow">'+lr.sales+'</em>')+'</span>');
                shopHtml.push('       <span class="ter"></span>');
                shopHtml.push('     </div>');
                shopHtml.push('   </div>');
                shopHtml.push('</div>');

                listArr[lr.id] = lr;
              
              // 黄页
              }else if (action == "huangye"){
                huangyeHtml.push('<div class="item">');
                huangyeHtml.push('  <a href="http://wa.215000.com/sz/huangye/detail-29.html">');
                huangyeHtml.push('    <img src="' + (list[i].litpic ? list[i].litpic : '/static/images/blank.gif') + '" alt="">');
                huangyeHtml.push('    <div class="li-right">');
                huangyeHtml.push('      <div class="bt"' + (list[i].color ? ' style="color:#' + list[i].color + ';"' : '') + '>' + list[i].title + '</div>');
                huangyeHtml.push('      <p></p>');
                huangyeHtml.push('    </div>');
                huangyeHtml.push('    </a><a href="tel:' + list[i].tel + '" class="phone"></a>');
                huangyeHtml.push('  ');
                huangyeHtml.push('</div>');
              }
            }

            $('.loading').remove();
            $('.article').append(articleHtml.join(""));
            $('.huodong').append(huodongHtml.join(""));
            $('.tieba').append(tiebaHtml.join(""));
            $('.video').append(videoHtml.join(""));
            $('.info').append(infoHtml.join(""));
            $('.business').append(businessHtml.join(""));
            $('.shop').append(shopHtml.join(""));
            $('.huangye').append(huangyeHtml.join(""));


          }
        }
        loadMoreLock = false;

      }
    })
  }


  // 上滑下滑导航隐藏
  var upflag = 1, downflag = 1, fixFooter = $(".fixFooter, .navbar");
  //scroll滑动,上滑和下滑只执行一次！
  scrollDirect(function (direction) {
    var dom = $('.navbar').hasClass('fixed');
    if (direction == "down" && dom) {
      if (downflag) {
        fixFooter.hide();
        $('.gotop').hide();
        downflag = 0;
        upflag = 1;
      }
    }
    if (direction == "up") {
      if (upflag) {
        fixFooter.show();
        $('.gotop').show();
        downflag = 1;
        upflag = 0;
      }
    }
  });

  // 回到顶部
  $('.gotop').click(function(){
    $(window).scrollTop(navHeight + 2);
  })

  // 本地推广选择城市
  $("body").delegate(".cityList a", "click", function(e){
    var t = $(this),
        href = t.attr("href"),
        url = $(this).attr("data-url"), //此站点url
        url_ = $(".cityList").attr("data-url"); //当前商家url
    // e.preventDefault();
    if(href) return;
    var setUrl = '';
    $(".cityList a").each(function(){
      var url__ = $(this).attr("data-url");//站点url
      if(url_.indexOf(url__) >= 0){
        setUrl = url_.replace(url__, url);
        return;
      }
    })
    if(setUrl){
      t.attr("href", setUrl);
    }
  })

  // 114切换类型
  $("body").delegate(".content-lead ul li", "click", function(e){
    var  u = $(this), index = u.index();
    u.addClass('ll').siblings('li').removeClass('ll');
    getList({cls:'ll_' + index});
  })

})

var scrollDirect = function (fn) {
  var beforeScrollTop = document.body.scrollTop;
  fn = fn || function () {
  };
  window.addEventListener("scroll", function (event) {
      event = event || window.event;

      var afterScrollTop = document.body.scrollTop;
      delta = afterScrollTop - beforeScrollTop;
      beforeScrollTop = afterScrollTop;

      var scrollTop = $(this).scrollTop();
      var scrollHeight = $(document).height();
      var windowHeight = $(this).height();
      if (scrollTop + windowHeight > scrollHeight - 10) {
          return;
      }
      if (afterScrollTop < 10 || afterScrollTop > $(document.body).height - 10) {
          fn('up');
      } else {
          if (Math.abs(delta) < 10) {
              return false;
          }
          fn(delta > 0 ? "down" : "up");
      }
  }, false);
}
