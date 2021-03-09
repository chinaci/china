$(function(){
	
	

	//倒计时s
	var timeCompute = function (a, b) {
		if (this.time = a, !(0 >= a)) {
			for (var c = [86400 / b, 3600 / b, 60 / b, 1 / b], d = .1 === b ? 1 : .01 === b ? 2 : .001 === b ? 3 : 0, e = 0; d > e; e++) c.push(b * Math.pow(10, d - e));
			for (var f, g = [], e = 0; e < c.length; e++) f = Math.floor(a / c[e]),
			g.push(f),
			a -= f * c[e];
			return g
		}
	}
	,CountDown =	function(a, b) {
		this.precise = parseFloat(b) || 1,
		this.time = a / this.precise,
		this.countTimer = null,
		this.run = function(a) {
			var b, c = this,
			e = this.precise;
			this.countTimer = setInterval(function() {
				b = timeCompute.call(c, c.time - 1, e),
				b || (clearInterval(c.countTimer), c.countTimer = null),
				"function" == typeof a && a(b || [0, 0, 0, 0, 0], !c.countTimer)
			},
			1e3 * e)
		}
	}
	,timeLmtCountdown = function() {
		var content = $(".infbox");
		var $this = content.find(".time");
		var etime = $this.attr('data-etime'); //结束时间
		var ntime = $this.attr('data-ntime'); //当前时间
		var end = etime - ntime;
		var time = end > 0 ? end : 0;

		var timeTypeText = '报名倒计时：';
		var countDown = new CountDown(time);
		countDownRun();

		function countDownRun(time) {
			time && (countDown.time = time);
			countDown.run(function(times, complete) {
				var html = '<span>'+timeTypeText+'<em>' + (times[0] < 10 ? "0" + times[0] : times[0]) +
				'</em>天<em>' + (times[1] < 10 ? "0" + times[1] : times[1]) +
				'</em>小时<em>' + (times[2] < 10 ? "0" + times[2] : times[2]) +
				'</em>分<em>' + (times[3] < 10 ? "0" + times[3] : times[3]) + '</em>秒</span>';
				$this.html(html);
			});
		}
	}
	timeLmtCountdown();

	


	//更新验证码
	var verifycode = $("#verifycode").attr("src");
	$("body").delegate("#verifycode", "click", function(){
		$(this).attr("src", verifycode+"?v="+Math.random());
	});
	//国际手机号获取
  getNationalPhone();
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
    var areaWrap =$(this).closest(".dc").find('.areaCode_wrap');
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
    var par = t.closest(".dc");
    var areaIcode = par.find(".areaCode");
    areaIcode.find('i').html('+' + code);
    $('#areaCode').val(code);
  });

  $('body').bind('click', function(){
    $('.areaCode_wrap').fadeOut(300);
  });

	//验证提示弹出层
	function showMsg(msg){
	  $('.dy .dc').append('<p class="ptip">'+msg+'</p>')     
	  setTimeout(function(){   
		$('.ptip').remove();
	  },2000);
	}


	//提交订阅信息
	$("body").delegate("#btnTj", "click", function(){

		var type =[],t = $(this), obj = t.closest(".dy"), btnhtml = t.html();

		if(t.hasClass("disabled")) return false;

		obj.find("dl").each(function(){
			var checkbox = $(this).find(".checkbox");
			if(checkbox.hasClass("checked")){
				type.push(checkbox.attr('data-val'));
			}
		});

		if(type.length == 0){
			errMsg = "请选择要订阅的信息类型";
			showMsg(errMsg);
			return false;
		}

		var name = obj.find("#name1");
		var phone = obj.find("#phone1");
		var vercode = obj.find("#vercode1");
		var xy = obj.find(".xy");
		var areaCode = obj.find("#areaCode");


		if(name.val() == "" || name.val() == name.attr("placeholder")){
			console.log(12)
			errMsg = "请输入您的姓名";
			showMsg(errMsg);
			return false;
		}else if(phone.val() == "" || phone.val() == phone.attr("placeholder")){
			errMsg = "请输入您的手机号码";
			showMsg(errMsg);
			return false;
		}else if(!/(13|14|15|17|18)[0-9]{9}/.test($.trim(phone.val()))){
			// errMsg = "手机号码格式错误，请重新输入！";
			// showMsg(errMsg);
			// return false;
		}else if(vercode.val() == "" || vercode.val() == vercode.attr("placeholder")){
			errMsg = "请输入验证码";
			showMsg(errMsg);
			return false;
		}

		if(!xy.hasClass("checked")){
			errMsg = "请先同意[免责协议]";
			showMsg(errMsg);
			return false;
		}
		t.addClass("disabled").html("提交中...");

    var data = [];
    data.push("act=loupan");
    data.push("aid="+pageData_.id);
    data.push("type="+type.join(","));
    data.push("name="+name.val());
    data.push("phone="+phone.val());
    data.push("areaCode="+areaCode.val());
    data.push("vercode="+vercode.val());
    data = data.join("&");

    $.ajax({
      url: masterDomain+"/include/ajax.php?service=house&action=subscribe",
      data: data,
      dataType: "JSONP",
      success: function(data){
        if(data && data.state == 100){
          t.removeClass("disabled").html("订阅成功");
          setTimeout(function(){
            t.closest(".dy").find(".close").click();
          }, 1000);
        }else{
          t.removeClass("disabled").html(btnhtml);
          alert(data.info);
        }
      },
      error: function(){
        t.removeClass("disabled").html(btnhtml);
        alert("网络错误，请稍候重试！");
      }
    })

	});

	// 地图内容切换
	$('.tabBox li').on("click",function(){
		var t = $(this),i = t.index();
		if(!t.hasClass('selectTag')){
			t.addClass('selectTag').siblings().removeClass('selectTag');
		}
	})


	$("html").delegate(".bdshare_popup_box", "mouseover", function(){
		$(".share").addClass("curr");
	});
	$("html").delegate(".bdshare_popup_box", "mouseout", function(){
		$(".share").removeClass("curr");
	});

	//动态
	$(".news dl").hover(function(){
		var t = $(this);
		t.addClass("curr").siblings("dl").removeClass("curr");
	});

	//文本框placeholder
	$("html input").placeholder();

	// 楼盘户型 
	$('.lphx .tab_nav li').click(function(event) {
		var t = $(this),index = t.index();
		if(!t.hasClass('curr')){
			t.addClass('curr').siblings().removeClass('curr');
      if(index != 0 && !t.hasClass('loadimg')){
        $('.lphx .tab_content').eq(index).find('img').each(function(){
          var img = $(this), src = img.attr('data-url');
          img.attr('src', src);
        })
        t.addClass('loadimg');
      }
		}
		$('.lphx .tab_content').eq(index).addClass('show').siblings().removeClass('show');
	});

	//新房顾问
    $(".adviBox").slide({titCell:".hd ul",mainCell:".bd",effect:"leftLoop",pnLoop:"false",autoPlay:false,autoPage:"<li></li>",prevCell:".prev",nextCell:".next"});

    // 楼盘相册 
	// $('.lpAlbum .tab_nav li').click(function(event) {
	// 	var t = $(this),index = t.index();
	// 	if(!t.hasClass('curr')){
	// 		t.addClass('curr').siblings().removeClass('curr');
	// 	}
	// 	$('.lpAlbum .tab_content').eq(index).addClass('show').siblings().removeClass('show');
	// });
    //大图切换
	// $("#lp_slide").slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: false,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {if (i == 0) {$(".sprev").click()} else if (i % 6 == 0) {$(".snext").click()}}});

	//小图左滚动切换
	// $("#lp_slide .thumb").slide({mainCell: "ul",delayTime: 300,vis: 6,scroll: 6,effect: "left",autoPage: false,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});

	//楼盘相册
    var bigAlbum = [],smallAlbum = [];
    $(".lpAlbum .tab_nav li").click(function(){
    	var t = $(this),i = t.index();
        if(!t.hasClass('curr')){
			   t.addClass('curr').siblings().removeClass('curr');
		    }
        var i=$(this).index();
        $('.lpAlbum .tab_content').eq(i).addClass('show').siblings().removeClass('show');
        if(!bigAlbum[i]){
        	console.log(!bigAlbum[i])
        	bigAlbum[i] = $('.lp_slide:eq('+i+')').slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: false,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {}});
        }
        if(!smallAlbum[i]){
          smallAlbum[i] = $('.lp_slide:eq('+i+')').find('.thumb').slide({mainCell: "ul",delayTime: 300,vis: 6,scroll: 6,effect: "left",autoPage: false,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});
          $('.lpAlbum .tab_content').eq(i).find('img').each(function(){
            var img = $(this), src = img.attr('data-url');
            img.attr('src', src);
          })
        }
    });
    $(".lpAlbum .tab_nav li:eq(0)").click();

	//页面改变尺寸重新对特效的宽高赋值
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		if(screenwidth < criticalPoint){
			$("#lp_slide .tempWrap").css({'width': '1000px'});
			$(".album li").css({'width': '1000px'});
			$(".album").css({'width': '1000px'});
		}else{
			$("#lp_slide .tempWrap").css({'width': '1200px'});
			$(".album li").css({'width': '1200px'});
			$(".album").css({'width': '1200px'});
		}
	});

	

var dzshapan = "#dzshapan", dzObj = $(dzshapan);


  //沙盘图拖动
  var shapanImg = $("#shapan-box");
  shapanImg.jqDrag({
      dragParent: dzshapan,
      dragHandle: "#shapan-obj"
  })

  window.HN=window.HN||{};(function(a){HN.Switch=function(c){var b=this;b.op=a.extend({},HN.Switch._default,c);b._isWebPSupport=false;b.isWebpSupport();b._init()};HN.Switch._default={switchST:"",clipST:".clip",conST:".con",itemST:".item",prevST:".prev",nextST:".next",pnavST:".pnav",effect:"slide",event:"click",current:"cur",circle:false,vertical:false,auto:false,start:0,duration:400,interval:4000,switchNum:1,clipNum:1};HN.Switch.prototype._init=function(){var c=this,e=c.op;e.sw=a(e.switchST);e.clip=e.sw.find(e.clipST);e.con=e.clip.find(e.conST).css({position:"relative"});e.item=e.con.find(e.itemST);e.prev=e.prevST==".prev"?e.sw.find(e.prevST):a(e.prevST);e.next=e.nextST==".next"?e.sw.find(e.nextST):a(e.nextST);e.pnav=e.pnavST==".pnav"?e.sw.find(e.pnavST):a(e.pnavST);e.itemLen=e.item.length;e.switchNum>e.clipNum&&(e.switchNum=e.clipNum);e.itemLen<e.clipNum&&(e.itemLen=e.clipNum);if(e.effect!="slide"){e.switchNum=1;e.clipNum=1}e.prevDisClass=a.trim(e.prevST).match(/\w\S*$/)+"-dis";e.nextDisClass=a.trim(e.nextST).match(/\w\S*$/)+"-dis";e.start=parseInt(e.start,10);e.start=(e.start>=0&&e.start<e.itemLen)?e.start:0;if(e.effect=="slide"){e.vertical||e.item.css({"float":"left"});e.leftOrTop=e.vertical?"top":"left";e.widthOrHeight=e.vertical?e.item.outerHeight(true):e.item.outerWidth(true);e.conSize=e.widthOrHeight*e.itemLen;e.vertical?e.con.css({height:e.conSize}):e.con.css({width:e.conSize})}else{if(e.effect=="fade"){e.item.not(e.item.eq(e.start).show()).hide().css({position:"absolute"})}else{e.item.not(e.item.eq(e.start).show()).hide();e.effect="none";e.duration=0}}function b(){e.timer=setInterval(function(){e.showpage>=e.itemLen-e.clipNum?c.switchTo(0):c.next()},e.interval)}function d(){clearInterval(e.timer)}d();if(e.itemLen<=e.clipNum){e.stopRun=true;c.switchTo(0);return}c.switchTo(e.start);e.prev.off("click.switch").on("click.switch",function(){a(this).hasClass(e.prevDisClass)||c.prev()});e.next.off("click.switch").on("click.switch",function(){a(this).hasClass(e.nextDisClass)||c.next()});e.pnav.each(function(f){a(this).off(e.event+".switch").on(e.event+".switch",function(){c.switchTo(f)})});if(e.auto){b();e.sw.off("mouseenter.switch mouseleave.switch").on({"mouseenter.switch":function(){d()},"mouseleave.switch":function(){b()}})}};HN.Switch.prototype._play=function(d,j,g){var c=this,h=c.op,f=null,e={},b=0;if(a(c).trigger("playBefore")!==false){if(d===null){d=j?h.showpage-h.switchNum:h.showpage+h.switchNum}else{d=isNaN(d)?0:d;if(d==h.showpage){return}}if(h.circle){d<0&&(d=h.itemLen-h.clipNum);d>h.itemLen-h.clipNum&&(d=0)}else{d<0&&(d=0);d>h.itemLen-h.clipNum&&(d=h.itemLen-h.clipNum);d==0?h.prev.addClass(h.prevDisClass):h.prev.removeClass(h.prevDisClass);d==h.itemLen-h.clipNum?h.next.addClass(h.nextDisClass):h.next.removeClass(h.nextDisClass)}for(;b<h.clipNum+h.switchNum;b++){if(d+b>=h.itemLen){break}c._changeSrc(d+b)}if(h.effect=="slide"){e[h.leftOrTop]=-h.widthOrHeight*d;h.con.stop().animate(e,h.duration)}else{if(h.effect=="fade"||h.effect=="none"){f=h.item.eq(d);h.item.not(f).stop().fadeOut(h.duration);f.fadeIn(h.duration)}}h.pnav.removeClass(h.current);h.pnav.eq(Math.ceil(d/h.switchNum)).addClass(h.current);h.showpage=d;a(c).trigger("playAfter")}};HN.Switch.prototype.isWebpSupport=function(){var c=this,e=window.localStorage&&window.localStorage.getItem("webpsupport"),d=navigator.userAgent&&/MSIE/.test(navigator.userAgent);e=d?false:e;if(null===e&&!d){var b=new Image();b.src="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";if(b&&2===b.width&&2===b.height){e=true}}window.localStorage&&window.localStorage.setItem("webpsupport",e);c._isWebPSupport="true"===e};HN.Switch.prototype._changeSrc=function(e){var b=this,g=b.op,d=g.item.eq(e).find("img"),f=0;for(;f<d.length;f++){var c=d.eq(f).data("src");if(c&&b._isWebPSupport){c&&(/pic1\.ajkimg\.com(.*)\.(jpg|png)/.test(c))&&!(c.match(/\?t=(\d)/i)>0)&&(c+="?t=4")}d.eq(f).attr("src")||d.eq(f).attr("src",c)}};HN.Switch.prototype.switchTo=function(b){this._play(b,false,false)};HN.Switch.prototype.prev=function(){this._play(null,true,false)};HN.Switch.prototype.next=function(){this._play(null,false,true)}})(jQuery);



      window.switchDistinfo = new HN.Switch({
          switchST: "#j-switch-distinfo",
          clipST: ".dist-clip",
          conST: "ul",
          itemST: "li",
          prevST: "#j-switch-distinfo .prev",
          nextST: "#j-switch-distinfo .next",
          switchNum: 6,
          clipNum: 6
      });
      var c = $("#j-switch-distinfo .dist-clip").find("li"),
          a = $("#j-dist-content .dist-items"),
          e = $("#shapan-obj").find(".map-mark");
      function b() {
          $(c).eq(0).addClass("active").siblings().removeClass("active");
          $(a).eq(0).show().siblings().hide();
          $(e).eq(0).addClass("map-mark-active").siblings().removeClass("map-mark-active");
          $(c).on("click", function() {
              var f = $(c).index($(this));
              $(this).addClass("active").siblings().removeClass("active");
              $(a).eq(f).show().siblings().hide();
              $(e).eq(f).addClass("map-mark-active").siblings().removeClass("map-mark-active");
          });
          $(e).on("click", function() {
              var f = $(e).index($(this)),
              g = Math.floor(f / 4);
              switchDistinfo.switchTo(g * 4) + 1;
              $(c).eq(f).addClass("active").siblings().removeClass("active");
              $(a).eq(f).show().siblings().hide();
              $(this).addClass("map-mark-active").siblings().removeClass("map-mark-active");
          })
      }
      function d() {
          e.each(function() {
              $(this).on({
                  "mouseenter.district": function() {
                      $(this).addClass("map-mark-hover")
                  },
                  "mouseleave.district": function() {
                      $(this).removeClass("map-mark-hover")
                  }
              });

          })
      }
      d();
      b()

});

