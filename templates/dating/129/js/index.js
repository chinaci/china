$(function(){

  $('img').scrollLoading();
  
  if(uid == 0){
    if(check){
      checkLogin_();
    }
  }
  // 验证是否登录及注册
  function checkLogin_(strict){
    if(sysId == 0){
      alert('您还没有登录！');
      location.href = masterDomain+'/login.html';
    }else if(uid == 0){
      if(confirm('您还没有注册交友会员，马上注册？')){
        $.ajax({
          url: masterDomain+'/include/ajax.php?service=dating&action=datingSwitch&state=1',
          type: 'get',
          dataType: 'jsonp',
          success: function(data){
            alert(data.info);
            location.reload();
          }
        })
      }
    }
  }


	// 判断浏览器是否是ie8
  if($.browser.msie && parseInt($.browser.version) >= 8){
    $('.app-con .down .con-box:last-child').css('margin-right','0');
    $('.wx-con .c-box:last-child').css('margin-right','0');
    $('.module-con .box-con:last-child').css('margin-right','0');
    $('.recommend-info .picture-con .picture:last-child').css('margin-right','0');
    $('.tuan-box .tuan-con .main-tuan:last-child').css('margin-right','0');
    $('.qiye-con .main-box:last-child').css('margin-right','0');
    $('.house-box .slideBox .bd ul li .li-box:last-child').css({'border-bottom':'none','padding-bottom':'0'});
    $('.search .search-con input.submit').css('background','#ff313f');
    $('.love .love-con-m .love-m-img .love-box:last-child').css('margin-right','0');
    $('.blind .blind-tab ul li:last-child').css('margin-right','0');
    $('.blind .blind-list:nth-child(2n)').css('margin-right','0');
    $('.shop .shop-box .shop-list:nth-child(4n)').css('margin-right','0');
    $('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
    $('.blind .blind-list:nth-child(3),.blind .blind-list:nth-child(4)').css('margin-bottom','0');
    $('.banner-form .form-con select').css('padding','0 0px 0 0px')
    $('.single .member-con .member-list:nth-child(5n)').css('margin-right','0');
  }
  
	//大图幻灯
  $("#slide").cycle({
    pager: '#slidebtn',
    pause: true
  });
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
  $(".slideBox2").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});
  $(".slideBox3").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>",autoPlay: true});
  $(".slideBox4").slide({titCell:".hd ul", mainCell:".bd ul",effect:"leftLoop", autoPage:"<li></li>"});
  $(".txtMarquee-top").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",vis:5,interTime:50});

  if(userid == 0){
    $("#date").selectDate()
    $("#days").focusout(function(){
      var year = $("#year option:selected").html()
      var month = $("#month option:selected").html()
      var day = $("#days option:selected").html()
      console.log(year+month+day)
    })
  }
 

  $('#regForm').submit(function(e){
    e.preventDefault();
    var form = $(this),
        t = $('.submit'),
        year = $('#year'),
        month = $('#month'),
        day = $('#days');
    if(year.val() == '' || month.val() == '' || day.val() == ''){
      alert('请选择出生日期');
      return;
    }
    var id = $('.addrBtn').attr('data-id'), ids = $('.addrBtn').attr('data-ids');
    if(id == 0 || id == undefined || id == ''){
      alert('请选择工作地区');
      return;
    }
    var cityid = ids.split(' ')[0];
    $('#cityid').val(cityid);
    $('#addrid').val(id);

    t.attr('disabled', true);

    $.ajax({
      url: '/include/ajax.php?service=dating&action=fastRegister',
      data: form.serialize(),
      type: 'post',
      dataType: 'json',
      success: function(data){
        t.attr('disabled', false);
        if(data && data.state == 100){
          alert(data.info.info)
          location.href = data.info.url;
        }else{
          alert(data.info);
        }
      },
      error: function(){
        t.attr('disabled', false);
        alert('网络错误，请重试');
      }
    })

  })
  

  $.ajax({
    url: '/include/ajax.php?service=dating&action=getTotal',
    type: 'get',
    dataType: 'json',
    success: function(data){
      if(data && data.state == 100){
        $('#u_total_album').text(data.info.album);
        $('#u_total_friend').text(data.info.friend);
        $('#u_total_gift').text(data.info.gift);
      }
    },
    error: function(){

    }
  })



})
 