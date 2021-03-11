$(function () {

    //上传单张图片
    var uploadHolder;
	function mysub(id){
        var t = $("#"+id), p = t.parent(), uploadHolder = t.siblings('.imgsearch-btn');

        var data = [];
        data['mod'] = 'shop';
        data['filetype'] = 'image';
        data['type'] = 'single';

        $.ajaxFileUpload({
          url: "/include/upload.inc.php",
          fileElementId: id,
          dataType: "json",
          data: data,
          success: function(m, l) {
            if (m.state == "SUCCESS") {
                var action = $('.search-form.curr').find('.sform').attr('action');
                location.href = action + '?image=' + m.url;
            } else {
              uploadError(m.state, id, uploadHolder);
            }
          },
          error: function() {
            uploadError(langData['siteConfig'][6][203], id, uploadHolder);//网络错误，请重试！
          }
      	});

	}

	function uploadError(info, id, uploadHolder){
		uploadHolder.removeClass('disabled');
    $('.soutu').html(info);
    setTimeout(function(){
      $('.soutu').hide();
    },1000)
	}

	$(".imgsearch-btn").bind("click", function(){
		var t = $(this), inp = t.siblings("input");
		if(t.hasClass("disabled")) return;
		inp.click();
	})

	$(".file_ImgUp").bind("change", function(){
		if ($(this).val() == '') return;
		$(this).siblings('.imgsearch-btn').addClass('disabled');
	    mysub($(this).attr("id"));
      $('.soutu').html('<i></i><span>'+langData['shop'][6][34]+'</span>').show();//正在搜图
	})


	// banner轮播图
  	new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: true,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});
  	// 最新入驻
    new Swiper('.ttNews .swiper-container', {direction: 'vertical', autoplay:{delay: 2000,},});
    //控制标题的字数
    $('.tc-type').each(function(index, el) {
        var num = $(this).attr('data-num');
        var text = $(this).text();
        var len = text.length;
        if(len > num){
            $(this).html(text.substring(0,num));
        }
    });
  	// 滑动导航
  	new Swiper('.swiper-nav .swiper-container', {pagination: {el:'.swiper-nav .pagination',},loop: true,grabCursor: true,paginationClickable: true});
   $('.search-form .type').click(function(event) {
        var par =$(this).closest('.search-form');
        par.find('.typelist').toggleClass('show');
   });
   $('.typelist').delegate('p', 'click', function(event) {
        var par = $(this).closest('.search-form');
        var spar = $(this).closest('.typelist');
        var sform = $('.sform');
        spar.toggleClass('show');
        if($(this).text()==langData['siteConfig'][16][25]){//商品
          $('.type label').text(langData['siteConfig'][16][25]);//商品
          sform.attr('action',prourl);
          $('.typelist p').text(langData['siteConfig'][17][12]);//店铺
          $('.keys').attr('placeholder',langData['shop'][6][0]);//输入宝贝关键词
        }else{
          $('.type label').text(langData['siteConfig'][17][12]);//店铺
          sform.attr('action',storeurl);
          $('.typelist p').text(langData['siteConfig'][16][25]);//商品
          $('.keys').attr('placeholder',langData['shop'][6][31]);//输入店铺关键词
        }


   });
   $(".inp").delegate('#search', 'click', function(event) {
    $(this).closest('#sform2').submit();
   });
   //监听input输入
    $(".search-fixForm #topkeywords").bind('input propertychange', function () {
        var term = $(this).val();
        $('#botkeywords').val(term);
        if (term=='') {
              $('.search-form .imgsearch').show();
              $('.search-form .clear_inp').hide();
        }else{
            $('.search-form .imgsearch').hide();
            $('.search-form .clear_inp').show()
        }

    });

    $(".search-form #botkeywords").bind('input propertychange', function () {
        var term = $(this).val();
        $('#topkeywords').val(term);
        if (term!='') {
          $('.search-form .imgsearch').hide();
          $('.search-form .clear_inp').show();
        }else{
          $('.search-form .imgsearch').show();
          $('.search-form .clear_inp').hide();
        }

    });

  //清除头部input
  $(".search-form").delegate('.clear_inp', 'click', function(event) {
    $(".search-form .keys").val('');
    $('.clear_inp').hide();
    $('.search-form .imgsearch').show();

   });

  //点击头部搜索
  $(".header").delegate('.header-sou', 'click', function(event) {
    $(".serach_cover").addClass('show');
    $('.fir-form').removeClass('curr');
    $('.search-fixForm').addClass('curr');

  });

  //取消搜索
  $(".serach_cover .cancel_serach").click(function(event) {
    $(".serach_cover").removeClass('show');
    $('.fir-form').addClass('curr');
    $('.search-fixForm').removeClass('curr');
  });
  var history_search = 'index_history_search';
    //加载历史记录
  var hlist = [];
  var history = utils.getStorage(history_search);
  if(history){
    history.reverse();//颠倒其元素的顺序
    for(var i = 0; i < history.length; i++){
      if(history[i]){
        hlist.push('<a href="javascript:;">'+history[i]+'</a>');
      }

    }
    $('.histroy-div').html(hlist.join(''));
    $('.story-search').show();
  }

  //清空搜索历史
  var clearHistory =1;
  $('.del-histroy').bind('click', function(){
    var confir = clearHistory ? confirm(langData['siteConfig'][20][211]) : 1;
    if(confir){
      utils.removeStorage(history_search);
      $('.story-search').hide();
      $('.histroy-div').html('');
    }

  });
  //点击搜索记录时搜索
  $('.histroy-div').delegate('a','click',function(){
    var keywords= $(this).text();
    $('#topkeywords').val(keywords);
    $('#sform1').submit();

  })

  //提交时记录搜索历史
  $('.sform').submit(function(e){
    var keywords = $(this).find('.keys').val();
    //记录搜索历史
    var history = utils.getStorage(history_search);
    history = history ? history : [];
    if(history && history.length >= 10 && $.inArray(keywords, history) < 0){
      history = history.slice(1);
    }
    // 判断是否已经搜过
    if($.inArray(keywords, history) > -1){
      for (var i = 0; i < history.length; i++) {
        if (history[i] === keywords) {
          history.splice(i, 1);
          break;
        }
      }
    }
    history.push(keywords);
    // var hlist = [];
    //   for(var i = 0; i < history.length; i++){
    //     if(history[i]){
    //       hlist.push('<a href="javascript:;">'+history[i]+'</a>');
    //     }

    //   }
    //   $('.histroy-div').html(hlist.join(''));
    //   $('.story-search').show();

    utils.setStorage(history_search, JSON.stringify(history));
  })



  $('.banner_wrap .header').append('<i class="header-sou"></i>')

	var orderType,tid;
	$('.top_tab li').click(function(){
	  var t = $(this);
	  t.addClass('active').siblings().removeClass('active');
	  var txt = t.html();
	  $('.top_tit span').text(txt);
	    tid = t.attr('data-id');
	    orderType = t.attr('data-type')
	   $('.sale_con ul').append('<div class="loading">'+langData['siteConfig'][38][8]+'</div>');//加载中....
	   saleList()
	})
	
	
	
	
  // input置顶
    //获取要定位元素距离浏览器顶部的距离
	var first_goodload = true; //数据是否加载
	var first_saleload = true; //数是否加载
	var first_shopload = true; //数是否加载
	var first_mshaload = true;
	var first_qgouload = true;
    $(window).scroll(function(){
        var isFocus=$("#botkeywords").is(":focus");
        if(true==isFocus){
          $("#botkeywords").blur();
        }

        var tabH = $(".good_wrap").offset().top -48;
        //获取滚动条的滑动距离
        var scroH = $(this).scrollTop();
          if(scroH>0){
              $('.banner_wrap .header').addClass('fixed');

          }else{
              $('.banner_wrap .header').removeClass('fixed');

          }


        if(tabH < scroH){
            $('.blackFix .good_tab').addClass('active');
            $('.blackFix').addClass('show');
            if($('.blackFix .good_tab').size() == 0){
              $('.blackFix ').append($('.good_wrap .good_tab ul'));
            }
        }else{
            $('.blackFix .good_tab').removeClass('active');
            $('.blackFix').removeClass('show');
            if($('.good_wrap .good_tab ul').size() == 0){
              $('.good_wrap .good_tab').append($('.blackFix ul'));
            }
        }
        var sh = $('.goodlist li').height();
        var allh = $('body').height();
        var w = $(window).height();
        var s_scroll = allh - sh - w;
		
		//抢购
		if(first_qgouload && $(window).scrollTop()+w >= $('.c_shop').offset().top){
			gettime();
			console.log('抢购开始')
			first_qgouload = false;
		}
		
		// //秒杀
		// if(first_mshaload && $(window).scrollTop()+w >= $('.c_shop').offset().top){
		// 	// busList();
		// 	console.log('商家开始')
		// 	first_mshaload = false;
		// }
		
		//推荐商家
		if(first_shopload && $(window).scrollTop()+w >= $('.c_shop').offset().top){
			busList();
			console.log('商家开始')
			first_shopload = false;
		}
		
		
		// 商品加载
		if(first_saleload && $(window).scrollTop()+w >= $('.sale_wrap').offset().top){
			$('.top_tab li:first-child').click();
			console.log('销量榜开始')
			first_saleload = false;
		}
		
		// 商品加载
		if(first_goodload && $(window).scrollTop()+w >= $('.good_wrap').offset().top){
			getList();
			console.log('商品加载开始')
			first_goodload = false;
		}
		
        if ($(window).scrollTop() > s_scroll && !isload) {
           atpage++
              getList();

        }

    })


    // 滑动导航
    var t = $('.tcInfo .swiper-wrapper');
    var swiperNav = [], mainNavLi = t.find('li');
    for (var i = 0; i < mainNavLi.length; i++) {
        swiperNav.push('<li>'+t.find('li:eq('+i+')').html()+'</li>');
    }

    var liArr = [];
    for(var i = 0; i < swiperNav.length; i++){
        liArr.push(swiperNav.slice(i, i + 4).join(""));
        i += 3;
    }

    t.html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
    new Swiper('.tcInfo .swiper-container', {pagination: {el:'.tcInfo .pagination',}, loop: false, grabCursor: true, paginationClickable: true});



  //倒计时
    var countDown = function(times){
      var now = Date.parse(new Date())/1000;
      var end = times;
      var ytime = end-now;
      var timer = setInterval(function(){
        if (ytime > 0) {
          ytime--;
          clearTime = timer;
          var hour = Math.floor((ytime / 3600000) % 24);
          var minute = Math.floor((ytime / 60) % 60);
          var second = Math.floor(ytime % 60);

          $(".jsTime").find("span.hour").text(hour < 10 ? "0" + hour : hour);
          $(".jsTime").find("span.minute").text(minute < 10 ? "0" + minute : minute);
          $(".jsTime").find("span.second").text(second < 10 ? "0" + second : second);
        } else {
          //gettime()
          countDown(times);
          clearInterval(timer);
          changeImg(times);
        }
      }, 1000);
    };

	
    function gettime(){
	    $.ajax({
	      url: "/include/ajax.php?service=shop&action=systemTime",
	      type: "GET",
	      dataType: "jsonp",
	      success: function (data) {
	        if(data.state == 100){
	          var list = data.info.list, nextHour = data.info.nextHour,times;
            var now = data.info.now;
	          times = list[0].nextHour;
	          nextHour = list[0].nextHour;
            $('.qgTime em').text(now)
	          changeImg(nextHour);
	          countDown(times)
	          $('.qgou').find('#timeCounter').attr('data-time',times);

	        }
	      }
	    });
	}
  function changeImg(nextHour){

    $.ajax({
      url: "/include/ajax.php?service=shop&action=slist&limited=4&time="+nextHour+"&pageSize=3",
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data.state == 100){
            var list = data.info.list,html=[];
            if(list.length<=0){
      				$('.qgou').hide();
            }else{
              $('.qgou').show();
            }
            for(var i = 0; i < list.length; i++){
              var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : list[i].litpic;
              html.push('<div class="act swiper-slide">');
              html.push('<a href="'+list[i].url+'">');
              html.push('<div class="qg_img" >');
              html.push('<img src="'+pic+'"/>')
              html.push('</div>');
              html.push('<div class="qgInfo">');
              html.push('<h3>'+list[i].title+'</h3>')
              html.push('<div class="qgPrice">')
              var sPrice = list[i].price.split('.')
              html.push('<span>'+echoCurrency('symbol')+'<strong>'+sPrice[0]+'</strong><em>.'+sPrice[1]+'</em></span><del>'+echoCurrency('symbol')+list[i].mprice+'</del>')
              html.push('</div>')
              html.push('</div>')
              html.push('</a>')
              html.push('</div>')

              $('.tc-activity').html(html.join(''))

            }
            //活动滚动
            var swiper = new Swiper('.boxCon .swiper-container', {
                slidesPerView: 'auto',

            });
        }else{
      		 $('.qgou').hide();
        }
      }
    });

  }
  
  function busList(){
    $.ajax({
      url: "/include/ajax.php?service=shop&action=store&rec=1&pageSize=3",
      type: "GET",
      dataType: "jsonp",
      async: false,
      success: function (data) {
        if(data.state == 100){
            var list = data.info.list,html=[];
            if(list.length > 0){
              $('.shop_wrap .loading').remove();
              for(var i = 0; i < list.length; i++){
                var html4,html3 = [];

                var logo = list[i].logo == false || list[i].logo == '' ? '/static/images/blank.gif' : list[i].logo;
                html.push('<div class="shopBox fn-clear" data-id="'+list[i].id+'">');
                html.push('<div class="sbleft">');
                html.push('<a href="'+list[i].url+'">')
                html.push('<img src="'+logo+'"/>')
                html.push('</a>')
                html.push('</div>');

                html.push('<h2 class="store-title"><a href="'+list[i].url+'">'+list[i].title+'</a></h2>')
                html.push('<div class="sbofoot">')
                html.push('<a href="'+list[i].url+'">')
                var productCount = list[i].productCount;
                if(productCount > 999){
                  html.push(langData['shop'][6][8].replace('1','999+'))//<strong>1</strong><em>件商品</em>
                }else{
                  html.push(langData['shop'][6][8].replace('1',productCount))//<strong>1</strong><em>件商品</em>
                }
                html.push('<p><i class="go"></i></p>')
                html.push('</a>')
                html.push('</div>')
                html.push('<div class="sbomain">');
                html3 = [];
                  $.ajax({
                    url: "/include/ajax.php?service=shop&action=slist&page=1&pageSize=2&store="+list[i].id+"",
                    type: "POST",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        if(data && data.state == 100){
                            var list2 = data.info.list;
                            for(var j = 0; j < list2.length; j++){
                                var pic2 = list2[j].litpic == false || list2[j].litpic == '' ? '/static/images/blank.gif' : list2[j].litpic;
                                html3.push('<div class="goBox">');
                                html3.push('<a href="'+list2[j].url+'" class="good_box">');
                                html3.push('<img src="'+pic2+'"/>');
                                html3.push('</a>');
                                html3.push('</div>');
                            }

                            html4=html3.join("");
                        }else {
                            html4 = [];
                        }

                    }
                })
                html.push(html4)
                html.push('</div>')
                html.push('</div>')
                $('.shop_wrap').html(html.join(''))

              }
            }else{
              $(".shop_wrap").next('.morebox').remove();
              $('.shop_wrap .loading').text(data.info)
            }


        }else{
          $(".shop_wrap").next('.morebox').remove();
          $('.shop_wrap .loading').text(data.info)
        }
      },
      error: function () {
        $(".shop_wrap").next('.morebox').remove();
        $('.shop_wrap .loading').text(data.info)
      }
    });

  }
 
  //销量榜
   function saleList(){
    $.ajax({
      url: "/include/ajax.php?service=shop&action=slist&"+orderType+"="+tid+"&pageSize=3",
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data.state == 100){
           $('.sale_con ul .loading').remove();
            var list = data.info.list,html=[];
            for(var i = 0; i < list.length; i++){
              var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : list[i].litpic;
              var saleNum ='first-sale'
              if(i==1){
                saleNum ='second-sale'
              }else if(i==2){
                saleNum ='third-sale'
              }
              html.push('<li><a href="'+list[i].url+'">');
              html.push('<div class="sale_img" >');
              html.push('<img src="'+pic+'"/>')
              html.push('<i class="'+saleNum+'"></i>')
              html.push('</div>');
              html.push('<p class="salePrice">')
              var sPrice = list[i].price.split('.')
              html.push(echoCurrency('symbol')+'<strong>'+sPrice[0]+'</strong><em>.'+sPrice[1]+'</em>')
              html.push('</p>')
              var sale = list[i].sales;
              if(sale >= 10000){
                sale = (sale/10000).toFixed(1) + 'W';
              }

              html.push('<span class="saleNum">'+langData['shop'][6][15].replace('1',sale)+'</span>');//<em>1</em>件已售
              html.push('</a></li>')
              $('.sale_con ul').html(html.join(''))

            }

        }else{
           $('.sale_con ul .loading').text(data.info)
        }
      },
      error: function () {
        $('.sale_con ul .loading').text(data.info)
      }
    });

  }
  //获取准点秒杀是否即将开始
  var now = Date.parse(new Date())/1000;  //当前时间的毫秒数
  $('.goodbox').each(function(){
    var kstime = $(this).data('kstime');
    if(kstime>now){
      $(this).addClass('mnostart');
      $(this).append('<span class="ks_span">'+langData['shop'][6][16]+'</span>');//即将开始
    }
  })
  //点击一键收藏
  $('.all-collect').click(function(){
    var t =$(this)

    t.addClass('has');
    t.find('.no-collect').addClass('slide-out-right');//一键收藏滑出
    t.removeClass('has').addClass('coll');
    t.find('.no-collect').hide();//一键收藏隐藏
    t.find('.has-em').css('display','inline-block');//已收藏显示
    t.find('.has-em').addClass('slide-in-right');//已收藏滑入

    setTimeout(function(){
      t.removeClass('coll')
       t.find('.has-em').css('display','inline-block')
    },400)
    t.addClass('slide-out-right2');
    $('.more-store').addClass('slide-in-right2').css('display','inline-block');
    // 收藏
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html';
      return false;
    }
    $('.c_shop .shopBox').each(function(){
      var shopId = $(this).attr('data-id');
      $.post("/include/ajax.php?service=member&action=collect&module=shop&temp=store-detail&type=add&id="+shopId);
    })
  })
  //购物车 start
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
  var myscroll = null;
  $('body').delegate('.bIcart', 'touchend', function(){
    var t = $(this), li = t.closest('li'), id = li.attr('data-id');
    //验证登录
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
       location.href = '/login.html';
       return false;
    }
    var specification = listArr[id].specification, specificationArr = listArr[id].specificationArr,
        imgSrc = li.find('img').attr('src');
    $('.guige em').text();
    li.addClass('layer').siblings('li').removeClass('layer');
    if (specification != "") {
      $('.mask').css({'opacity':'1','z-index':'10000000'});
      $('.size-box').addClass('sizeShow');
      $('.closed').removeClass('sizeHide');

      //商品属性选择
      SKUResult = {};  //保存组合结果
      mpriceArr = [];  //市场价格集合
      priceArr = [];   //现价集合
      totalStock = 0;  //总库存
      init.start(id);//拼接规格属性弹窗
      $('.size-html .sys_item').each(function(){
        var sizeAlen = $(this).find('a').length;
        if(sizeAlen ==1){
          $(this).find('a').click();
        }
      })


      if(myscroll == null){
        myscroll = new iScroll("scrollbox", {vScrollbar: false,});
      }

      $('.size-img img').attr('src', imgSrc);
      $('.sku').each(function() {
        var self = $(this);
        var attr_id = self.attr('attr_id');
        if(!SKUResult[attr_id]) {
          self.addClass(disabled);
        }
      })
      return false;

    }else {
      var cartNum = Number($('.shopgocart em').text()), detailUrl = $('.goodlist .layer a').attr('href'),
          layerId = $('.goodlist .layer').attr('data-id'), detailTitle = $('.goodlist .layer h4').text();
      var t = $(this).offset();
      var offset = $(".shopgocart").offset();
      var img = $(this).closest("li").find('img').attr('src'); //获取当前点击图片链接
      var flyer = $('<img class="flyer-img" src="' + img + '">'); //抛物体对象
      var num=1;//首页默认数量为1
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
          $('.shopgocart').addClass('swing');

          setTimeout(function(){$('.shopgocart em').removeClass('swing')},300);
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
      $('.mask').css({'opacity':'0','z-index':'-1'});
      $('.size-box').removeClass('sizeShow').addClass('sizeHide');
  })

  // 选择规格点击确定
  $('.size-confirm a').click(function(){
    var count = 1, cart = Number($('.shopgocart em').text());
    $('.shopgocart em').text(count + cart);
    var winWidth = $(window).width(), winHeight = $(window).height(), cartNum = Number($('.shopgocart em').text()),
        layerId = $('.goodlist .layer').attr('data-id'), detailTitle = $('.goodlist .layer h3').text(),
        detailUrl = $('.goodlist .layer a').attr('href');

    //加入购物车及加入购物车判断
    var $buy=$(this),$li=$(".sys_item"),$ul=$(".size-html"),n=$li.length;
    if($buy.hasClass("disabled")) return false;
    var len=$li.length;
    var spValue=parseInt($(".size-selected .count b").text()),
        inputValue=1;//首页默认添加数量为1

    if($(".sys_item dd").find("a.selected").length==n && inputValue<=spValue){

      //加入购物车动画
      $(".size-html").removeClass("on");
      var offset = $(".shopgocart").offset();
      var detailThumb = $('.size-img img').attr('src');
      var flyer = $('<img class="flyer-img" src="' + detailThumb + '">'); //抛物体对象
      var t = $('.goodlist .layer .bIcart').offset();
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
          $('.shopgocart').addClass('swing');
          setTimeout(function(){$('.shopgocart em').removeClass('swing')},300);
        }
      });

      $('.mask').css({'opacity':'0','z-index':'-1'});
      $('.size-box').removeClass('sizeShow').addClass('sizeHide');

      var t=''; //该商品的属性编码 以“-”链接个属性
      $(".sys_item").each(function(){
        var $t=$(this),y=$t.find("a.selected").attr("attr_id");
         t=t+"-"+y;
      })
      t=t.substr(1);

      var num=1;//首页默认添加数量为1

      //操作购物车
      var data = [];
      data.id = layerId;
      data.specation = t;
      data.count = num;
      data.title = detailTitle;
      data.url = detailUrl;
      shopInit.add(data);

    }else{
      $li.each(function(){
        var $dt = $(this).find('dt');
        var dtTxt = $dt.find('span').text();
        if($(this).find('a.selected').length == 0){
          $dt.html('<span>'+dtTxt+'</span><em>请选择'+dtTxt+'</em>')
        }
      })
    }

  })

  // 选择规格增加数量
  $('.sizeBtn .add').click(function(){
    var stockx = parseInt($(".size-selected .count b").text()),n=$(".sys_item").length;
    var $c=$(this),value;
    value=parseInt($c.siblings(".shop-count").val());
    if(value<stockx){
      value=value+1;
      $c.siblings(".shop-count").val(value);
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
    value=parseInt($c.siblings(".shop-count").val());
    if(value>1){
      value=value-1;
      $c.siblings(".shop-count").val(value);
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
        sizeHtml.push('<dl class="sys_item"><dt><span>'+specificationArr[i].typename+'</span></dt>');
        var itemArr = specificationArr[i].item;
        sizeHtml.push('<dd class="fn-clear">');
        for (var j = 0; j < itemArr.length; j++) {
			 if(itemArr[j] && itemArr[j].pic){
				sizeHtml.push('<a href="javascript:;" class="sku" attr_id="'+itemArr[j].id+'"><i><img src="'+itemArr[j].pic+'"></i>'+itemArr[j].name+'</a>');
			 }else{
				sizeHtml.push('<a href="javascript:;" class="sku" attr_id="'+itemArr[j].id+'"><i></i>'+itemArr[j].name+'</a>');
			 }
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
      mpriceObj.html(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2));

      //现价范围
      var maxPrice = Math.max.apply(Math, priceArr);
      var minPrice = Math.min.apply(Math, priceArr);
      var maxP = maxPrice.toFixed(2).split('.')[0]+ "<em>."+maxPrice.toFixed(2).split('.')[1]+"</em>";
      var minP = minPrice.toFixed(2).split('.')[0]+ "<em>."+minPrice.toFixed(2).split('.')[1]+"</em>";
      //价格区间
      //priceObj.html(maxPrice > minPrice ? maxP + " - " + minP : maxP);
      //只取最小价格
      priceObj.html(minP);
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

  $('body').delegate('.sku', 'click', function() {

    var self = $(this);


    if(self.hasClass(disabled)) return;

    //选中自己，兄弟节点取消选中
    self.toggleClass(selected).siblings("a").removeClass(selected);
    var spValue=parseInt($(".size-box .count b").text()),
    inputValue=1;
    var n=$(".size-html .sys_item").length;

    if($(".size-html .sys_item").find("a.selected").length==n && inputValue<spValue){
      $('.sys_item dt em').remove();
    }else{
      var sizePar = $(".size-html a.selected").closest('.sys_item').find('dt');
      sizePar.find('em').remove();
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
      // selectedIds.sort(function(value1, value2) {
      //   return parseInt(value1) - parseInt(value2);
      // });
	  selectedIds.sort(arrSortMinToMax);
      var len = selectedIds.length;
      //console.log(SKUResult)
      var prices = SKUResult[selectedIds.join(';')].prices;
      var maxPrice = Math.max.apply(Math, prices);
      var minPrice = Math.min.apply(Math, prices);
      var maxP = maxPrice.toFixed(2).split('.')[0]+ "<em>."+maxPrice.toFixed(2).split('.')[1]+"</em>";
      var minP = minPrice.toFixed(2).split('.')[0]+ "<em>."+minPrice.toFixed(2).split('.')[1]+"</em>";
      //价格区间
      priceObj.html(maxPrice > minPrice ? maxP + " - " + minP : maxP);
      //只取最小价格
      //priceObj.html(minP);


      var mprices = SKUResult[selectedIds.join(';')].mprices;
      var maxPrice = Math.max.apply(Math, mprices);
      var minPrice = Math.min.apply(Math, mprices);
      mpriceObj.html(maxPrice > minPrice ? minPrice.toFixed(2) + "-" + maxPrice.toFixed(2) : maxPrice.toFixed(2));


      stockObj.text(SKUResult[selectedIds.join(';')].stock);

      //获取input的值
      // var inputValue=parseInt($(".shop-count").val());
      var inputValue=1;//首页默认添加数量为1

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
        // testAttrIds.sort(function(value1, value2) {
        //   return parseInt(value1) - parseInt(value2);
        // });
		 testAttrIds.sort(arrSortMinToMax);
        //点击某一个属性时 搭配的属性如果没有库存时 则不可点 disabled
        var defineArr = SKUResult[testAttrIds.join(';')]
        // var stockArr = defineArr.stock*1;
        // if(!stockArr) {
        //   $(this).addClass(disabled).removeClass(selected);
        // } else {
        //   $(this).removeClass(disabled);
        // }
		if(!defineArr || defineArr.stock == 0) {
		  $(this).addClass(disabled).removeClass(selected);
		} else {
		  $(this).removeClass(disabled);
		}
      });
    } else {
      init.defautx();
    }
  });

  $('.size-box').on('touchmove', function(e){
    e.preventDefault();
  })


  //初始加载
  // getList();

  var isload = false;

  //数据列表
  function getList(tr){
    isload = true;
    $(".goodlist").parent().append('<div class="loading">'+langData['siteConfig'][20][184]+'...</div>');
    $(".good_wrap .loading").remove();

    //请求数据
    var data = [];
    data.push("pageSize="+pageSize);
    data.push("page="+atpage);

    $.ajax({
      url: "/include/ajax.php?service=shop&action=slist&flag=0",
      data: data.join("&"),
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data){
          if(data.state == 100){
            $(".goodlist .loading").remove();
            var list = data.info.list, lr, html = [];
            if(list.length > 0){
              for(var i = 0; i < list.length; i++){
                lr = list[i];
                var pic = lr.litpic == false || lr.litpic == '' ? '/static/images/blank.gif' : lr.litpic;
                var specification = lr.specification

                html.push('<li data-id="'+lr.id+'">');
                html.push('<a href="'+lr.url+'"><img src="'+pic+'" alt=""></a>');
                html.push('<div class="goodInfo">');
                html.push('<h4>'+lr.title+'</h4>');
                html.push('<div class="infobot fn-clear">');
                html.push('<div class="left">');
                var priceArr = lr.price.split('.');
                html.push('<h5>'+echoCurrency('symbol')+'<strong>'+priceArr[0]+'</strong><em>.'+priceArr[1]+'</em></h5>');
                html.push('<p class="sellnum">'+langData['shop'][6][17].replace('1',lr.sales)+'</p>');//销量1笔
                html.push('</div>');
                html.push('<div class="right"><i class="bIcart"></i></div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</li>');

                listArr[lr.id] = lr;
              }


              $(".goodlist").append(html.join(""));
              isload = false;

              //最后一页
              if(atpage >= data.info.pageInfo.totalPage){
                isload = true;
                $(".goodlist").next('.morebox').remove();
                $(".goodlist").parent().append('<div class="loading">'+langData['shop'][6][35]+'</div>');//
              }

            //没有数据
            }else{
              isload = true;
              $(".goodlist").parent().append('<div class="loading">'+langData['siteConfig'][20][126]+'</div>');
            }

          //请求失败
          }else{
            $(".goodlist").parent().append('<div class="loading">'+data.info+'</div>');
          }

        //加载失败
        }else{
          $(".goodlist").parent().append('<div class="loading">'+langData['siteConfig'][20][462]+'</div>');
        }
      },
      error: function(){
        isload = false;
        $(".goodlist").parent().append('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
      }
     });
  }



});

// 数字字母中文混合排序
function arrSortMinToMax(a, b) {
    // 判断是否为数字开始; 为啥要判断?看上图源数据
    if (/^\d+/.test(a) && /^\d+/.test(b)) {
        // 提取起始数字, 然后比较返回
        return /^\d+/.exec(a) - /^\d+/.exec(b);
        // 如包含中文, 按照中文拼音排序
    } else if (isChinese(a) && a.indexOf('custom_') < 0 && isChinese(b) && b.indexOf('custom_') < 0) {
        // 按照中文拼音, 比较字符串
        return a.localeCompare(b, 'zh-CN')
    } else {
        // 排序数字和字母
        return a.localeCompare(b, 'en');
    }
}

// 检测是否为中文，true表示是中文，false表示非中文
function isChinese(str) {
    // 中文万国码正则
    if (/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/.test(str)) {
        return true;
    } else {
        return false;
    }
}
