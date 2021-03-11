$(function(){
  // 判断设备类型，ios全屏
  var device = navigator.userAgent;
  if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('padTop20');
	}

  $('.header').on('touchmove', function(e){
    e.preventDefault();
  })

  var myscroll_nav = new iScroll("navlist", {vScrollbar: false});
  $('.header-r .header-more').click(function(){
    var a = $(this).closest('.header');
    if(!a.hasClass('open')) {
      a.addClass('open');
      $('.btmMenu').hide();
      $('.fixFooter').hide();
      $('#navBox').css({'top':'0.8rem', 'bottom':'0'});
      if (device.indexOf('huoniao_iOS') > -1) {
        $('#navBox').css({'top':'calc(0.8rem + 20px)', 'bottom':'0'});
      }
      $('#navBox .bg').css({'height':'100%','opacity':1});
      myscroll_nav.refresh();
    }else {
      a.removeClass('open');
      closeShearBox();
    }
  })


  $('#cancelNav').click(function(){
      closeShearBox();
  })


  $('#shearBg').click(function(){
      closeShearBox();
  })

  $('#navlist li').click(function(){
      closeShearBox();
  })

  function closeShearBox(){
    $('.fixFooter').show();
    $('.header').removeClass('open');
    $('#navBox').css({'top':'-200%', 'bottom':'200%'});
    $('#navBox .bg').css({'height':'0','opacity':0});
  }

  // 清除列表cookie
  $('#navlist li').click(function(){
    var t = $(this);
    if (!t.hasClass('HN_PublicShare')) {
      window.sessionStorage.removeItem('house-list');
      window.sessionStorage.removeItem('maincontent');
      window.sessionStorage.removeItem('detailList');
      window.sessionStorage.removeItem('video_list');
    }
  })


  var JuMask = $('.JuMask'), JubaoBox = $('.JubaoBox');

  // 判断是不是需要举报按钮
  if (typeof JubaoConfig != "undefined") {
    $('.HN_Jubao').show();
  }

  // 举报
  $('.HN_Jubao').click(function(){
    $('.Jubao-'+JubaoConfig.module).show();
    JubaoShow();
    JuMask.addClass('show');
  })

  // 关闭举报
  $('.JubaoBox .JuClose, .JuMask').click(function(){
    JubaoBox.hide();
    JuMask.removeClass('show');
  })


  // 选择举报类型
  $('.JuSelect li').click(function(){
    var t = $(this), dom = t.hasClass('active');
    t.siblings('li').removeClass('active');
    if (dom) {
      t.removeClass('active');
    }else {
      t.addClass('active');
    }
  })

  // 举报提交
  $('.JubaoBox-submit').click(function(){
    if ($('.JuSelect .active').length < 1) {
      showErr('请选择举报类型');
    }else if ($('#JubaoTel').val() == "") {
      showErr('请填写联系方式');
    }else {

      var type = $('.JuSelect .active').text();
      var desc = $('.JuRemark textarea').val();
      var phone = $('#JubaoTel').val();

      if(JubaoConfig.module == "" || JubaoConfig.action == "" || JubaoConfig.id == 0){
        showErr('信息传输失败！');
        setTimeout(function(){
          JubaoBox.hide();
          JuMask.removeClass('show');
        }, 1000);
        return false;
      }

      $.ajax({
        url: masterDomain+"/index.php",
        data: "service=member&template=complain&module="+JubaoConfig.module+"&dopost="+JubaoConfig.action+"&aid="+JubaoConfig.id+"&type="+encodeURIComponent(type)+"&desc="+encodeURIComponent(desc)+"&phone="+encodeURIComponent(phone),
        type: "POST",
        dataType: "json",
        success: function(data){
          if (data && data.state == 100) {
            showErr('举报成功，我们将尽快处理！');
            setTimeout(function(){
              JubaoBox.hide();
              JuMask.removeClass('show');
            }, 1500);

          }
        },
        error: function(){
          showErr('网络错误，举报失败！');
        }
      });

    }
  })

  // 显示举报
  function JubaoShow(){
    JubaoBox.show();
    var jubaoHeight = JubaoBox.height();
    JubaoBox.css('margin-top', -(jubaoHeight / 2));
  }

  // 显示错误
  function showErr(txt){
    $('.JuError').text(txt).show();
    setTimeout(function(){
      $('.JuError').hide();
    }, 1000)
  }


})


var	scrollDirect = function (fn) {
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
          fn('up');
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


//输出货币标识
function echoCurrency(type){
	var pre = (typeof cookiePre != "undefined" && cookiePre != "") ? cookiePre : "HN_";
	var currencyArr = $.cookie(pre+"currency");
	if(currencyArr){
		var currency = JSON.parse(currencyArr);
		if(type){
			return currency[type]
		}else{
			return currencyArr['short'];
		}
	}
}
