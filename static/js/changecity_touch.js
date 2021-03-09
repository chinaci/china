$(function(){

  $('a').bind('contextmenu', function(e) {
    e.preventDefault();
  })

  var sortBy = function(prop){
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if(!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if(val1 < val2) {
        return -1;
      }else if(val1 > val2) {
        return 1;
      }else{
        return 0;
      }
    }
  }

  // 获取城市列表
  $.ajax({
    url: "/include/ajax.php?service=siteConfig&action=siteCity&module=" + backModule,
    type: "GET",
    dataType: "json",
    success: function(data){
      if(data.state != 100) return false;
      var list = data.info, cityArr = new Array(), html = [], html1 = [], hotCityHtml = [];
      for (var i = 0; i < list.length; i++) {
        var pinyin = list[i].pinyin.substr(0,1), tableList = $('.table-list-'+pinyin);

        if(cityArr[pinyin] == undefined){
          cityArr[pinyin] = [];
        }
        //
        // var lArr = [];
        // lArr.name = list[i].name;
        // lArr.url = list[i].url;

        cityArr[pinyin].push(list[i]);

      }

      $('.search-box input').bind('input propertychange', function(){
        var t = $(this), val = t.val(), searchHtml = [];
        if (val != "") {
          $('body').addClass('fixed');
          $('.search-list, .search-box .close').show();

          for (var m = 0; m < list.length; m++) {
            var name = list[m].name, pinyin = list[m].pinyin;
            if (name.indexOf(val) >= 0 || pinyin.indexOf(val) >= 0) {
              searchHtml.push('<li><a href="'+list[m].url+'?currentPageOpen=1" data-domain=\''+JSON.stringify(list[m])+'\'>'+list[m].name+'</a></li>');
            }else {
              $('.search-list ul').html('');
            }
          }

          $('.search-list ul').html('');
          $('.search-list ul').html(searchHtml.join(''));

        }else {
          $('body').removeClass('fixed');
          $('.search-list, .search-box .close').hide();
        }
      })

      var szmArr = [];
      for(var key in cityArr){
        var szm = key;
        // 右侧字母数组
        szmArr.push(key);

      }

      // 右侧字母填充
      szmArr.sort();
      for (var i = 0; i < szmArr.length; i++) {
        html1.push('<li><a href="javascript:;" data-id="'+szmArr[i]+'">'+szmArr[i]+'</a></li>');

        cityArr[szmArr[i]].sort(sortBy('cityid'));

        // 左侧城市填充
        html.push('<p class="table-tit table-tit-'+szmArr[i]+'" id="'+szmArr[i]+'">'+szmArr[i]+'</p>');
        html.push('<ul class="table-list">');
        for (var j = 0; j < cityArr[szmArr[i]].length; j++) {
          html.push('<li><a href="'+cityArr[szmArr[i]][j].url+'?currentPageOpen=1" data-domain=\''+JSON.stringify(cityArr[szmArr[i]][j])+'\'>'+cityArr[szmArr[i]][j].name+'</a></li>');

          if(cityArr[szmArr[i]][j].hot == 1){
          	hotCityHtml.push('<li><a href="'+cityArr[szmArr[i]][j].url+'?currentPageOpen=1" data-domain=\''+JSON.stringify(cityArr[szmArr[i]][j])+'\'>'+cityArr[szmArr[i]][j].name+'</a></li>');
          }
        }
        html.push('</ul>');


      }

      var hotHtml = '';
      if(hotCityHtml.length > 0){
        hotHtml = '<p class="table-tit table-tit-hot" id="hot">'+langData['siteConfig'][37][98]+'</p>';//热门城市
        hotHtml += '<ul class="table-list">'+hotCityHtml.join('')+'</ul>';

        html1.unshift('<li><a href="javascript:;" data-id="hot">'+langData['siteConfig'][37][79]+'</a></li>');//热门
      }

      html1 = '<ul>' + html1.join('') + '</ul>';

      $('.table-city').html(hotHtml+html.join(''));
      $('.jump-ul').html(html1);

    }
  })



  // 关闭搜索框
  $('.search-box .close').click(function(){
    $('.search-box input').val('');
    $('body').removeClass('fixed');
    $('.search-list, .search-box .close').hide();
  })

  var navBar = $(".navbar");
  navBar.on("touchstart", function (e) {
      $(this).addClass("active");
      $('.letter').html($(e.target).html()).show();
      var width = navBar.find("li").width();
      var height = navBar.find("li").height();
      var touch = e.touches[0];
      var pos = {"x": touch.pageX, "y": touch.pageY};
      var x = pos.x, y = pos.y;
      $(this).find("li").each(function (i, item) {
          var offset = $(item).offset();
          var left = offset.left, top = offset.top;
          if (x > left && x < (left + width) && y > top && y < (top + height)) {
              var id = $(item).find('a').attr('data-id');
              var cityHeight = $('#'+id).offset().top;
              $('body, html').scrollTop(cityHeight);
              $('.letter').html($(item).html()).show();
          }
      });
  });

  navBar.on("touchmove", function (e) {
      e.preventDefault();
      var width = navBar.find("li").width();
      var height = navBar.find("li").height();
      var touch = e.touches[0];
      var pos = {"x": touch.pageX, "y": touch.pageY};
      var x = pos.x, y = pos.y;
      $(this).find("li").each(function (i, item) {
          var offset = $(item).offset();
          var left = offset.left, top = offset.top;
          if (x > left && x < (left + width) && y > top && y < (top + height)) {
              var id = $(item).find('a').attr('data-id');
              var cityHeight = $('#'+id).offset().top;
              $('body, html').scrollTop(cityHeight);
              $('.letter').html($(item).html()).show();
          }
      });
  });


  navBar.on("touchend", function () {
      $(this).removeClass("active");
      $(".letter").hide();
  })

  // 清除列表cookie
	$('.nav li').click(function(){
		window.sessionStorage.removeItem('house-list');
		window.sessionStorage.removeItem('maincontent');
		window.sessionStorage.removeItem('detailList');
		window.sessionStorage.removeItem('video_list');
	})

  // 重新定位
  $('.localBtn').click(function(){
    getCity(true);
  })
  getCity();


  //选择城市写入cookie
  $('.main,.search-list').delegate('a', 'click', function(e){
    e.preventDefault();
    var t = $(this), domain = t.attr('data-domain');

    var channelDomainClean = typeof channelDomain != 'undefined' ? channelDomain.replace("http://", "").replace("https://", "") : window.location.host;
    var channelDomain_1 = channelDomainClean.split('.');
    var channelDomain_1_ = channelDomainClean.replace(channelDomain_1[0]+".", "");

    channelDomain_ = channelDomainClean.split("/")[0];
    channelDomain_1_ = channelDomain_1_.split("/")[0];

    $.cookie(cookiePre + 'siteCityInfo', domain, {expires: 7, domain: channelDomainClean, path: '/'});
    $.cookie(cookiePre + 'siteCityInfo', domain, {expires: 7, domain: channelDomain_1_, path: '/'});
    $.cookie(cookiePre + 'siteCityInfo', domain, {expires: 7, path: '/', domain: '.' + cfg_clihost});
    
    location.href = t.attr('href');
  });

})


// 定位
function getCity(force) {
  $('.local p').html(langData['siteConfig'][27][135]);
  HN_Location.init(function(data){
    if (data == undefined || data.province == "" || data.city == "") {
        $('.local p').html(langData['siteConfig'][27][136]);
    }else{
        var province = data.province, city = data.city, district = data.district, page = 1;
        var time = Date.parse(new Date());
        selectCity(province, city, district);
    }
  }, device.indexOf('huoniao') > -1 ? false : true, force);
}


// 根据定位城市查询本站数据
function selectCity(province, city, district){
  $.ajax({
    url: "/include/ajax.php?service=siteConfig&action=verifyCity&region="+province+"&city="+city+"&district="+district+"&module="+backModule,
    type: "POST",
    dataType: "json",
    success: function(data){
      if(data && data.state == 100){
          $('.local p').html('<a href="'+data.info.url+'?currentPageOpen=1" data-domain=\''+JSON.stringify(data.info)+'\'>'+data.info.name+'</a>');
      }else {
          $('.local p').html(data.info);
      }
    },
    error: function(){
      alert(langData['siteConfig'][6][203]);//网络错误，请重试
    }
  })
}
