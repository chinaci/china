$(function(){



  // 获取好友
  var friendArr = [];
  getMyFriend();
  function getMyFriend(){
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=friendList&pageSize=999',
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var list = data.info.list, len = list.length, html = [], pyArr = [], pyHtml = [];
          function abc(a,b){
            console.log(a)
            return a.py - b.py;
          }
          for(var i = 0; i < len; i++){
            var d = list[i];
            if(friendArr[d.py] == undefined){
              pyArr.push(d.py);
              friendArr[d.py] = [];
            }
            friendArr[d.py].push(d);
          }

          pyArr.sort();

          for(var m = 0; m < pyArr.length; m++){
            var d = friendArr[i];
            html.push('<div class="areaitem area_'+pyArr[m]+'">');
            html.push('    <p id="anchor'+pyArr[m]+'" class="f_title">'+pyArr[m]+'</p>');
            html.push('    <ul class="friend_list">');
            for(var n = 0; n < friendArr[pyArr[m]].length; n++){
              var u = friendArr[pyArr[m]][n];
              html.push('        <li class=" fn-clear">');
              html.push('          <a href="'+u.url+'"><div class="img"><img src="'+u.photo+'"></div><span class="name">'+u.nickname+'</span></a>');
              html.push('        </li>');
            }
            html.push('    </ul>');
            html.push('</div>');

            pyHtml.push('<a href="#anchor'+pyArr[m]+'" data-id="anchor0">'+pyArr[m]+'</a>')
          }

          $("#container").html(html.join(""));
          $(".in_total").show().children('span').text(len);
          $(".aside-shortcut").append(pyHtml.join(""));
        }
      },
      error: function(){

      }
    })
  }

  // 导航栏切换
  var active = 0, isload = false, pageSize = 10; 

  // 导航切换
  $('.navigation span').click(function(){
    var t = $(this), index = t.index();
    active = index;
    if(!t.hasClass('active')){
      t.addClass('active');
      t.siblings().removeClass('active');
      if(index > 0 && $("#container"+index).html() == ""){
        isload = false;
        getList();
      }

      $('.mainbox .group').eq(index).show().siblings().hide();
    }
  });

  //点击关注和互相关注
  $(".container").delegate(".btns", "click", function(){
    var b = $(this), id = b.closest("li").attr("data-id");
    if(b.hasClass('follow_no')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_no');
          b.addClass('follow_yes');
          b.text('已关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }else if(b.hasClass('follow_yes') || b.hasClass('follow_all')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=cancelFollow', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_yes');
          b.addClass('follow_no');
          b.text('关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }
  })
  
 
  var offsetTop = [];
  offsetTop.push($('.searchWrap').offset().top - 5);
  $('.areaitem').each(function(){
    offsetTop.push($(this).offset().top);
  })


  var navBar = $(".aside-shortcut");
  navBar.on("touchstart", function (e) {
      $(this).addClass("active");
      $('.letter').html($(e.target).html()).show();
      var width = navBar.find("a").width();
      var height = navBar.find("a").height();
      var touch = e.touches[0];
      var pos = {"x": touch.pageX, "y": touch.pageY};
      var x = pos.x, y = pos.y;
      $(this).find("a").each(function (i, item) {
          var offset = $(item).offset();
          var left = offset.left, top = offset.top;
          if (x > left && x < (left + width) && y > top && y < (top + height)) {
              var id = $(item).text();
              var cityHeight = $('#anchor'+id).offset.top;
              $(window).scrollTop(cityHeight);
              if(i != 0){
                $('.letter').html($(item).html()).show();
              }else{
                $('.letter').hide();
              }
          }
      });
  });


  navBar.on("touchmove", function (e) {
      e.preventDefault();
      var width = navBar.find("a").width();
      var height = navBar.find("a").height();
      var touch = e.touches[0];
      var pos = {"x": touch.pageX, "y": touch.pageY};
      var x = pos.x, y = pos.y;
      $(this).find("a").each(function (i, item) {
          var offset = $(item).offset();
          var left = offset.left, top = offset.top;
          if (x > left && x < (left + width) && y > top && y < (top + height)) {

              var cityHeight = offsetTop[i];
              $(window).scrollTop(cityHeight);
              if(i != 0){
                $('.letter').html($(item).html()).show();
              }else{
                $('.letter').hide();
              }
          }
      });
  });


  navBar.on("touchend", function () {
      $(this).removeClass("active");
      $(".letter").hide();
  })

  var container_guanzhu = $('.guanzhu #container'),container_fensi = $('.fensi #container'), tofoot = $('.tofoot'), lng = lat = 0;

  $(window).scroll(function(){
    if(!isload) return;
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    if (scrollH == (document.documentElement.scrollTop | document.body.scrollTop) + clientH){
      //加载新数据
      getList();
    }
  });


  function getList(){
    if(isload) return;
    isload = true;
    showMsg.loading();
    var navActive = $('.navigation span.active'), page = navActive.attr("data-page");
    var act = active == 1 ? 'out' : 'in';
    page = page == undefined ? 1 : page;
    var container = $("#container"+active);
    // tofoot.hide();

    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=visit&oper=follow&act='+act+'&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        showMsg.close();
        if(data && data.state == 100){
          var list = data.info.list, len = list.length, html = [];
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<li class="fn-clear" data-id="'+d.member.id+'">');
            html.push('  <div class="fans_img"><a href="'+d.member.url+'"><img src="'+d.member.phototurl+'"></a></div>');
            html.push('  <div class="fans_txt">');
            html.push('    <p>'+d.member.nickname+'</p>');
            html.push('    <p>'+d.member.profile+'</p>');
            html.push('  </div>');
            if(d.follow && d.followby){
              html.push('  <span class="btns follow_all">互相关注</span>');
            }else if(d.follow){
              html.push('  <span class="btns follow_yes">已关注</span>');
            }else{
              html.push('  <span class="btns follow_no">关注</span>');
            }
            html.push('</li>');
          }
          container.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage > page){
            navActive.attr("data-page", page+1);
            // tofoot.show();
            isload = false;
          }else{
            // tofoot.text('已加载完全部数据').show();
          }
        }else{
          // tofoot.text('暂无相关数据！').show();
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

})