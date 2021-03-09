// 表情相关
var emojiText = "😄 😝 😜 😪 😞 😚 😏 😎 😌 😋 😊 😍 😷 😘 😖 😳 😲 😱 😰 😩 😨 😭 😥 😤 😣 😢 😡 😠 😆 😅 😃 😂 😔 😓 😒 😫 😐 😉 😈 😇 😁 👽 🙊 🐻 🚗 🎵 ❤ 💔 👻 🎁 🎉 🎂 👀 🙋 🙏 🌹 🐴 🐶 🐠 🐔 🐼 🐺 🐭 🐌 🐷 🐯 🐍 🐮 🐝 ⚽ 💊 🍔 🍊 🍎 🍉 ☕ 🍜 🍚 🍞 🍺 ☀ ⛅ ☁ ☔ ⚡ ⛄ 💰 💕 💏 💎 💍 ✌ 👍 👎 👏 👌";

function appendEmoji(){
	var emojiList = emojiText.split(' ');
	var html = '';
	var list = [];
	for(var i=0; i<emojiList.length; i++){
		list.push('<li class="emot_li" data-txt="'+emojiList[i]+'"><img src="/static/images/ui/emot/default/defult_'+(i+1)+'.png"></li>');
	}
	html = '<ul class="fn-clear">'+list.join('')+'</ul>';
	return html;
}


var showAlertErrTimer;
function showErrAlert(data) {
	showAlertErrTimer && clearTimeout(showAlertErrTimer);
	$(".popErrAlert").remove();
	$("body").append('<div class="popErrAlert"><p>' + data + '</p></div>');
	$(".popErrAlert p").css({
		"margin-left": -$(".popErrAlert p").width() / 2,
		"left": "50%"
	});
	$(".popErrAlert").css({
		"visibility": "visible"
	});
	showAlertErrTimer = setTimeout(function() {
		$(".popErrAlert").fadeOut(300, function() {
			$(this).remove();
		});
	}, 1500);
 }

// alert(navigator.userAgent.toLowerCase())
// 引入微信脚本
var wx_miniprogram,baidu_miniprogram,qq_miniprogram;
if(navigator.userAgent.toLowerCase().match(/micromessenger/) && typeof(wx) == 'undefined') {
    document.write(unescape("%3Cscript src='https://res.wx.qq.com/open/js/jweixin-1.6.0.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
    if(navigator.userAgent.toLowerCase().match(/android/)){
        (function() {
           if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
               handleFontSize();
           } else {
               if (document.addEventListener) {
                   document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
               } else if (document.attachEvent) {
                   document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                   document.attachEvent("onWeixinJSBridgeReady", handleFontSize);  }
           }
           function handleFontSize() {
               // 设置网页字体为默认大小
               WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
               // 重写设置网页字体大小的事件
               WeixinJSBridge.on('menu:setfont', function() {
                   WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 });
               });
           }
        })();
    }
}

//多语言包
setTimeout(function(){
    if(typeof langData == "undefined"){
        var langDir = hn_getCookie('HN_lang');
        langDir = typeof langDir != "undefined" ? langDir : "zh-CN";
        document.head.appendChild(document.createElement('script')).src = '/include/lang/'+langDir+'.js?v=' + ~(-new Date());
    }
}, 3000);


// 判断设备类型，ios全屏
var device = navigator.userAgent;
// 百度小程序
var isbaidu = device.indexOf('swan-baiduboxapp') > -1 ; //百度小程序
// qq小程序
var isQQ = device.toLowerCase().indexOf('qq') > -1 && device.toLowerCase().indexOf('miniprogram')>-1;
if (document.getElementsByTagName("html")[0] && (device.indexOf('huoniao') > -1 || window.__wxjs_environment == 'miniprogram') || isbaidu || isQQ) {
    var bodyEle = document.getElementsByTagName('html')[0];
    bodyEle.className += " huoniao_iOS";
    // 新增全面屏幕样式
    bodyEle.className += " huoniao_Fullscreen";
}
if (document.getElementsByTagName("html")[0] && device.indexOf('huoniao') > -1 && device.indexOf('Linux') > -1 && device.indexOf('Android') > -1) {
    var bodyEle = document.getElementsByTagName('html')[0];
    bodyEle.className += " huoniao_Android";

    // 新增全面屏幕样式
    bodyEle.className += " huoniao_Fullscreen";
}






if(window.__wxjs_environment == 'miniprogram'){
    var bodyEle = document.getElementsByTagName('html')[0];
    bodyEle.className += " wx_miniprogram";
}

if(getQueryParam('from') == 'wmsj'){
	var bodyEle = document.getElementsByTagName('html')[0];
    bodyEle.className += " from_wmsj";
}

// qq小程序
var isQQ = device.toLowerCase().indexOf('qq') > -1 && device.toLowerCase().indexOf('miniprogram')>-1;
if(isQQ){
	 document.write(unescape("%3Cscript src='https://qqq.gtimg.cn/miniprogram/webview_jssdk/qqjssdk-1.0.0.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
	  var bodyEle = document.getElementsByTagName('html')[0];
}

if(isbaidu){
   // var bodyEle = document.getElementsByTagName('html')[0];
   //  bodyEle.className += " baidu_miniprogram";

    // 引入js
    document.write(unescape("%3Cscript src='https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.21.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
}


!function(s, t) {
    function u() {
        var a = x.getBoundingClientRect().width;
        a / A > 540 && (a = 540 * A);
        var d = a / 7.5;
        x.style.fontSize = d + "px",
        C.rem = s.rem = d
    }
    var v, w = s.document, x = w.documentElement, y = w.querySelector('meta[name="viewport"]'), z = w.querySelector('meta[name="flexible"]'), A = 0, B = 0, C = t.flexible || (t.flexible = {});
    // y.remove();
    // y = false;
    if (y) {
        // console.warn("将根据已有的meta标签来设置缩放比例");
        var D = y.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        D && (B = parseFloat(D[1]),
        A = parseInt(1 / B))
    } else {
        if (z) {
            var E = z.getAttribute("content");
            if (E) {
                var F = E.match(/initial\-dpr=([\d\.]+)/)
                  , G = E.match(/maximum\-dpr=([\d\.]+)/);
                F && (A = parseFloat(F[1]),
                B = parseFloat((1 / A).toFixed(2))),
                G && (A = parseFloat(G[1]),
                B = parseFloat((1 / A).toFixed(2)))
            }
        }
    }
    if (!A && !B) {
        var H = (s.navigator.appVersion.match(/android/gi),
        s.navigator.appVersion.match(/iphone/gi))
          , I = s.devicePixelRatio;
        A = H ? I >= 3 && (!A || A >= 3) ? 3 : I >= 2 && (!A || A >= 2) ? 2 : 1 : 1,
        B = 1 / A
    }
    if (x.setAttribute("data-dpr", A),
    !y) {
        if (y = w.createElement("meta"),
        y.setAttribute("name", "viewport"),
        y.setAttribute("content", "width=device-width, initial-scale=" + B + ", maximum-scale=" + B + ", minimum-scale=" + B + ", user-scalable=no, viewport-fit=cover"),
        x.firstElementChild) {
            x.firstElementChild.appendChild(y)
        } else {
            var J = w.createElement("div");
            J.appendChild(y),
            w.write(J.innerHTML)
        }
    }
    s.addEventListener("resize", function() {
        clearTimeout(v),
        v = setTimeout(u, 300)
    }, !1),
    "complete" === w.readyState ? w.body.style.fontSize = 12 * A + "px" : w.addEventListener("DOMContentLoaded", function(b) {
        // w.body.style.fontSize = 12 * A + "px"
    }, !1),
    u(),
    C.dpr = s.dpr = A,
    C.refreshRem = u,
    C.rem2px = function(c) {
      var d = parseFloat(c) * this.rem;
      return "string" == typeof c && c.match(/rem$/) && (d += "px"),
      d
    }
    ,
    C.px2rem = function(c) {
      var d = parseFloat(c) / this.rem;
      return "string" == typeof c && c.match(/px$/) && (d += "rem"),
      d
    }

	  s.addEventListener("pageshow", function(b) {

      //iPhoneX适配
      var meta = document.getElementsByTagName('meta');
      for(var i = 0; i < meta.length; i++){
        if(meta[i]['name'] == 'viewport'){
            meta[i].setAttribute('content', meta[i]['content'] + ', viewport-fit=cover');
        }
      }

			b.persisted && (clearTimeout(v),
			v = setTimeout(u, 300))

      // 判断设备类型，ios全屏
			var device = navigator.userAgent;
			if (document.getElementsByTagName("body")[0] && (device.indexOf('huoniao_iOS') > -1 || window.__wxjs_environment == 'miniprogram'|| window.__qqjs_environment == 'miniprogram')) {
				var bodyEle = document.getElementsByTagName('body')[0];
				bodyEle.className += " huoniao_iOS";
			}

	  }, false);
}(window, window.lib || (window.lib = {}));

//注册客户端webview
function setupWebViewJavascriptBridge(callback){
	if(window.WebViewJavascriptBridge){
		return callback(WebViewJavascriptBridge);
	}else{
		document.addEventListener("WebViewJavascriptBridgeReady", function() {
			return callback(WebViewJavascriptBridge);
		}, false);
	}

	var _device = navigator.userAgent.toLowerCase();
	// if (device.indexOf('huoniao_iOS') > -1 && device.indexOf('huoniao_Android') <= -1) {
	// if(_device.indexOf('toutiaomicroapp') <= -1 && !wx_miniprogram && !baidu_miniprogram && !qq_miniprogram){
	if(_device.indexOf('huoniao') > -1){
        if(window.WVJBCallbacks){return window.WVJBCallbacks.push(callback);}
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement("iframe");
        WVJBIframe.style.display = "none";
        WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";

		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function(){document.documentElement.removeChild(WVJBIframe) }, 0);
	}
	// }
}

//获取客户端设备信息
var appInfo = {"device": "", "version": ""};
var pageBack;

//公用方法
var huoniao = {

	//转换PHP时间戳
	transTimes: function(timestamp, n){
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
		}else{
			return 0;
		}
	}

	//数字格式化
	,number_format: function(number, decimals, dec_point, thousands_sep) {
		var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
				sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
				dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
				s = '',
				toFixedFix = function (n, prec) {
					var k = Math.pow(10, prec);
					return '' + Math.round(n * k) / k;
				};

		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}

	//将普通时间格式转成UNIX时间戳
	,transToTimes: function(timestamp){
		var new_str = timestamp.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return datum.getTime()/1000;
	}

	//获取附件不同尺寸
	,changeFileSize: function(url, to, from){
		if(url == "" || url == undefined) return "";
		if(to == "") return url;
		var from = (from == "" || from == undefined) ? "large" : from;
		if(hideFileUrl == 1){
			return url + "&type=" + to;
		}else{
			return url.replace(from, to);
		}
	}

	//获取字符串长度
	//获得字符串实际长度，中文2，英文1
	,getStrLength: function(str) {
		var realLength = 0, len = str.length, charCode = -1;
		for (var i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) realLength += 1;
		else realLength += 2;
		}
		return realLength;
	}

	//异步操作
	,operaJson: function(url, action, callback){
		$.ajax({
			url: url,
			data: action,
			type: "POST",
			dataType: "json",
			success: function (data) {
				typeof callback == "function" && callback(data);
			},
			error: function(){}
		});
	}
  // 过滤html
  ,checkhtml:function(){
    // 过滤html
    $('[contenteditable],[contenteditable="true"]').each(function() {
        // 干掉IE http之类地址自动加链接
        try {
            document.execCommand("AutoUrlDetect", false, false);
        } catch (e) {}

        $(this).on('paste', function(e) {
            e.preventDefault();
            var text = null;

            if(window.clipboardData && clipboardData.setData) {
                // IE
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            }
            if (document.body.createTextRange) {
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            } else {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text);
            }
        });
    });
  }

}


//商家配置--谷歌地图
function businessgooleMap(gLng,gLat){
    $('body').addClass('googleBody');//自动检索弹窗加样式
    var map, geocoder, marker,
            mapOptions = {
              zoom: 14,
              center: new google.maps.LatLng(gLat, gLng),
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

          getLocation(mapOptions.center);

          google.maps.event.addListener(marker, 'dragend', function(event) {
            var location = event.latLng;
            var pos = {
              lat: location.lat(),
              lng: location.lng()
            };
            getLocation(pos);
          })
          function getLocation(pos){

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: pos,
              radius: 500
            }, callback);

            var list = [];
            function callback(results, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                  list.push('<li data-lng="'+results[i].geometry.location.lng()+'" data-lat="'+results[i].geometry.location.lat()+'"><h5>'+results[i].name+'</h5><p>'+results[i].vicinity+'</p></li>');
                }
                if(list.length > 0){
                  $(".mapresults ul").html(list.join(""));
                  $(".mapresults").show();
                }
              }
            }
          }

          var input = document.getElementById('searchAddr');
          var places = new google.maps.places.Autocomplete(input, {placeIdOnly: true});

          google.maps.event.addListener(places, 'place_changed', function () {
              var address = places.getPlace().name;
              $('#searchAddr').val(address);
              geocoder = new google.maps.Geocoder();
              geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  var locations = results[0].geometry.location;
                  lng = locations.lng(), lat = locations.lat();
                  if (lng && lat) {

                    //$("#local strong").html(results[0].formatted_address);
                    $("#lnglat").val(lng + ',' + lat);
                    $(".pageitem").hide();
                    $(".page.gz-address").show();
                    $(".chose_val #address").val(address);
                  }else{
                    alert(langData["waimai"][7][132]);   /* 您选择地址没有解析到结果! */
                  }
                }
              });

          });
}

window.onload = function(){

	/**********************修复底部回复框被遮挡**************************/
	var userAgent = navigator.userAgent.toLowerCase();
	if (/iphone|ipad|ipod/.test(userAgent)) {
		if($('.bottom_reply_fixed').is(':hidden')){
			$(".bottom_reply_fixed").css("padding-bottom",".28rem");
		}
	}else{
		if($('.bottom_reply_fixed').is(':hidden')){
			$(".bottom_reply_fixed").css("padding-bottom","3rem");
			if($(".Bottom_inputBox").size()>0){  //tab切换
				$(".bottom_reply_fixed").css("padding-bottom","0");
				$(".bottom_reply_fixed input").focus(function(){
					$(".bottom_reply_fixed").css("padding-bottom","3rem");
				});
				$(".bottom_reply_fixed input").blur(function(){
					$(".bottom_reply_fixed").css("padding-bottom",".28rem");
				})
			}
		}else{
			$(".bottom_reply_fixed input").focus(function(){
				$(".bottom_reply_fixed").css("padding-bottom","3rem");
			});
			$(".bottom_reply_fixed input").blur(function(){
				$(".bottom_reply_fixed").css("padding-bottom",".28rem");
			})
		}
	} //修复底部回复框被遮挡

	/**********************修复底部回复框被遮挡**************************/

    //2020-9-21 详情页底部增加下载app按钮
       var isWeixin = device.toLowerCase().indexOf('micromessenger') != -1;
       var wx_stringArr = isWeixin?device.toLowerCase().match(/micromessenger\/([\d\.]+)/i):0;
       var wx_version = wx_stringArr.length>0?device.toLowerCase().match(/micromessenger\/([\d\.]+)/i)[1]:0; //微信版本号
       var wx_for = isWeixin?(wx_version.split('.')[0]>=7 || (wx_version.split('.')[1] >= 0 && wx_version.split('.')[0]==7) || (wx_version.split('.')[2]>=12 && wx_version.split('.')[0]==7 && wx_version.split('.')[1] == 0) ):0;//微信版本号是否大于7.0.12
       var iOSver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);  //ios版本信息
       var isIOS9 = iOSver?iOSver[1]:0; //ios的版本
       var url_path =  window.location.href;

     function openclient() {
         var startTime = Date.now();
         // 用户点击时，在动态创建一个iframe，并且让这个iframe去加载config中的Schema
         var ifr = document.createElement('iframe');
         // 端口判断 安卓或IOS
         ifr.src = device.toLowerCase().indexOf('os') > 0 ? appConfig.scheme_IOS : appConfig.scheme_Adr;
         ifr.style.display = 'none';
         if(isIOS9 >= 9){
            window.location.href = appConfig.scheme_IOS;
            setTimeout(function(){
             window.location.href = appConfig.download_url_IOS
            },appConfig.timeout)
         }else{
           document.body.appendChild(ifr);
         }
         var t = setTimeout(function() {
             var endTime = Date.now();
             //指定的时间内没有跳转成功 当前页跳转到apk的下载地址
             if ((endTime - startTime) < (appConfig.timeout + 200)) {
                 //判断是安卓 还是IOS
                 if (/iphone|ipad|ipod/.test(device.toLowerCase())) {
                     window.location.href = appConfig.download_url_IOS;
                 } else if (/android/.test(device.toLowerCase())) {
                     window.location.href = appConfig.download_url_IOS;
                 }
             } else {
                 window.close();
             }
         }, appConfig.timeout);

         window.onblur = function() {
             clearTimeout(t);
         }
     }
   if(typeof cfg_appinfo != "undefined"){
     var paramUrlAnd = url_path == masterDomain?"":'?url='+url_path;
     var paramUrlIos = url_path == masterDomain?"":'://?url='+url_path
     var appConfig = {
          scheme_IOS: cfg_appinfo.URLScheme_iOS?(cfg_appinfo.URLScheme_iOS + paramUrlIos):(masterDomain+'/mobile.html'),
          scheme_Adr: cfg_appinfo.URLScheme_Android?('portal://'+cfg_appinfo.URLScheme_Android+':8000/splash' + paramUrlAnd):(masterDomain+'/mobile.html'),
          download_url_IOS: masterDomain+'/mobile.html',
          timeout: 600
      };

       if(typeof JubaoConfig != "undefined" && location.href.indexOf('waimai') < 0){
         //非app 非小程序
         if((device.indexOf('huoniao') < 0) && !(window.__wxjs_environment == 'miniprogram') && !isbaidu && !isQQ){
     /* ================================圆形按钮============================== */
       // 显示app下载圆形按钮
       if(isWeixin && wx_for &&  cfg_appinfo.wx_appid){
         $('body').append('<div class="appDwonload" id="appDwonload">'+
         '     <wx-open-launch-app' +
          '          id="launch-appbtn"' +
          '          appid="'+cfg_appinfo.wx_appid+'"' +
          '      extinfo="'+url_path+'"'+
          '        ><template>\n' +
          '     <style>.downLoadBtn { width:42px; height:42px; diplay:block; line-height:42px; opacity:0;}</style>\n'+
           '   <a href="javascript:;" class="downLoadBtn">立即打开</a>\n' +  //立即打开
          '   </template>\n'+
         '   </wx-open-launch-app>\n'+
         '</div>')
       }else{
         $('body').append('<a href="javascript:" class="appDwonload" id="appDwonload"></a>')
       }

       $("body").delegate('.appDwonload','click',function(){
          if(isWeixin && !wx_for){
           location.href = appConfig.download_url_IOS
          }else if(!isWeixin){
            openclient();
          }
       });

	   //调起失败后兼容处理
	   var isClick = false;
	   $('.app_btn_down').bind('click', function(){
		   setTimeout(function(){
			   if(!isClick){
				   isClick = true;
				   location.href = appConfig.download_url_IOS
			   }
		   }, 2000);
	   })
	   $('body').delegate('.appDwonload', 'click', function(){
		   setTimeout(function(){
			   if(!isClick){
				   isClick = true;
				   location.href = appConfig.download_url_IOS
			   }
		   }, 2000);
	   })

       if(isWeixin && wx_for){
         wx.ready(function(){
	         var btn = document.getElementById('launch-appbtn');
			 btn.addEventListener('click', function (e) {
				 console.log('click');

				 //调起失败后兼容处理
				 setTimeout(function(){
					 if(!isClick){
						 isClick = true;
						 location.href = appConfig.download_url_IOS
					 }
				 }, 1000);

			 });
	         btn.addEventListener('launch', function (e) {
	           console.log('success');
	         });
	         btn.addEventListener('error', function (e) {
				 //调起失败后兼容处理
				 isClick = true;
				 $.cookie('appDownloadLocation', true);
				 location.href = appConfig.download_url_IOS
	         });
         })

       }

         }

     }else{
     if((device.indexOf('huoniao') < 0) && !(window.__wxjs_environment == 'miniprogram') && !isbaidu && !isQQ && !$.cookie('downloadAppTips')){
       // 不需要的页面
       if(
         location.href.indexOf('mobile') < 0 &&
         location.href.indexOf('login') < 0


       ){

         if(isWeixin && wx_for &&  cfg_appinfo.wx_appid){
           $('body').append('<div class="downloadBox">\n'+
           '<div class="left_app_info">\n'+
           ' <a href="javascript:;" class="btn_close_appDownload"></a>\n'+
           ' <div class="downloadLogo"><img src="'+cfg_appinfo.logo+'"></div>\n'+
           '<h3>'+cfg_appinfo.subtitle+'</h3>\n'+
           '</div>\n'+
           '<a href="javascript:;" class="app_btn_down">\n'+
           '<div class="btn_style">打开APP</div>\n'+
           '<div class="wxDownLoad">\n'+
           '     <wx-open-launch-app' +
            '          id="launch-btn"' +
            '          appid="'+cfg_appinfo.wx_appid+'"' +
            '      extinfo="'+url_path+'"'+
            '        ><template>\n' +
            '     <style>.downLoadBtn { width:100px; height:100px; opacity:0; }</style>\n'+
           '   <a href="javascript:;" class="downLoadBtn">打开APP</a>\n' +  //立即打开
            '   </template>\n'+
           '   </wx-open-launch-app>\n'+
           '</div> \n'+
           '</a>');
         }else{
           $('body').append('<div class="downloadBox">\n'+
           '<div class="left_app_info">\n'+
           ' <a href="javascript:;" class="btn_close_appDownload"></a>\n'+
           ' <div class="downloadLogo"><img src="'+cfg_appinfo.logo+'"></div>\n'+
           '<h3>'+cfg_appinfo.subtitle+'</h3>\n'+
           '</div>\n'+
           '<a href="javascript:;" class="app_btn_down">\n'+
           '<div class="btn_style">打开APP</div>\n'+
           '</a>');
         }
       }

       $('body').delegate('.btn_close_appDownload','click',function(){
           $('.downloadBox').removeClass('topShow');
           $.cookie('downloadAppTips', 1, {expires: 1});

       });
       $("body").delegate('.downloadBox .app_btn_down','click',function(){
          if(isWeixin && !wx_for){
           location.href = appConfig.download_url_IOS
          }else if(!isWeixin){
            openclient();
          }
       });
       if(isWeixin && wx_for){
         wx.ready(function(){
         var btn = document.getElementById('launch-btn');
         btn.addEventListener('launch', function (e) {
           console.log('success');

         });
         btn.addEventListener('error', function (e) {
            window.location = appConfig.download_url_IOS;
         });
         })

       }
       setTimeout(function(){
         $('.downloadBox').addClass('topShow');
         setTimeout(function(){
           $('.downloadBox').removeClass('topShow');
         },8000)
       },1000)
     }

     }
   }



// 微信小程序
    if(navigator.userAgent.toLowerCase().match(/micromessenger/)) {
        wx.miniProgram.getEnv(function (res) {
            wx_miniprogram = res.miniprogram;

            window.wx_miniprogram_judge = true;

            if(wx_miniprogram) {
                var bodyEle = document.getElementsByTagName('html')[0];
                bodyEle.className += " huoniao_iOS wx_miniprogram";

                var Days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = "HN_isWxMiniprogram=1;path=/;expires=" + exp.toGMTString();
            }else{
                hn_delCookie('HN_isWxMiniprogram');
            }
        });

        if(!wx_miniprogram){
            hn_delCookie('HN_isWxMiniprogram');
        }
    }else{
       window.wx_miniprogram_judge = true;
    }



  // 百度小程序
  if(isbaidu){
      swan.webView.getEnv(function (res) {
          baidu_miniprogram = res.smartprogram
          // alert(`当前页面是否运行在小程序中：${baidu_miniprogram}`); // true

          if(baidu_miniprogram) {
              var bodyEle = document.getElementsByTagName('html')[0];
              bodyEle.className += " huoniao_iOS baidu_miniprogram";

              var Days = 30;
              var exp = new Date();
              exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
              document.cookie = "HN_isBaiDuMiniprogram=1;path=/;expires=" + exp.toGMTString();
          }else{
              hn_delCookie('HN_isBaiDuMiniprogram');
          }
      });
      if(!baidu_miniprogram){
          hn_delCookie('HN_isBaiDuMiniprogram');
      }
  }




  // qq小程序
 	 if(isQQ) {
        qq.miniProgram.getEnv(function (res) {
            qq_miniprogram = res.miniprogram;
            // window.qq_miniprogram_judge = true;

            if(qq_miniprogram) {
                var bodyEle = document.getElementsByTagName('html')[0];
                bodyEle.className += " huoniao_iOS qq_miniprogram";
                var Days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = "HN_isQqMiniprogram=1;path=/;expires=" + exp.toGMTString();
            }else{
                hn_delCookie('HN_isQqMiniprogram');
            }
        });
        if(!qq_miniprogram){
            hn_delCookie('HN_isQqMiniprogram');
        }
	}else{
	   // window.qq_miniprogram_judge = true;
	}

	setupWebViewJavascriptBridge(function(bridge) {
		//初始化信息
		var jubao_show = 0,share_show = $(".HN_PublicShare").length;
		if (typeof JubaoConfig != "undefined" ){
		    jubao_show = 1;
		}

		if(typeof wxconfig != "undefined"){
      var apptitle = $('meta[name="apptitle"]');

			var initAppConfigData = {
				"apptitle": (apptitle.length > 0 && apptitle[0].content)?apptitle[0].content:wxconfig.title,   //为空时不改变现有标题
				"share": (share_show?1:0),           //为1时显示分享按钮
				"report": jubao_show,           //为1时显示举报按钮
				"shareContent": {
					"platform": "all",
					"title": wxconfig.title,
					"url": wxconfig.link,
					"imageUrl": wxconfig.imgUrl,
					"summary": wxconfig.description
				}
			}
			bridge.callHandler("initAppConfig", {'value':initAppConfigData}, function(responseData){});
		}

		//获取APP信息
		bridge.callHandler("getAppInfo", {}, function(responseData){
			var data = JSON.parse(responseData);
			appInfo = data;
		});

		//APP端后退、目前只有安卓端有此功能
		var deviceUserAgent = navigator.userAgent;
		if (deviceUserAgent.indexOf('huoniao') > -1) {
			$('.header .back, .goBack').bind('click', function(e){
				e.preventDefault();
				bridge.callHandler("goBack", {}, function(responseData){});
			});

		}

		// 开启下拉刷新
    // bridge.callHandler("setDragRefresh", {"value": "on"}, function(){});

        //显示隐藏菜单
        bridge.registerHandler("toggleAppMenu", function(data, responseCallback) {
            $('.header-search .dropnav').click();
        });

		//后退触发
        bridge.registerHandler("pageBack", function(data, responseCallback) {
            typeof pageBack == "function" && pageBack(data);
        });

        //举报按钮点击
		bridge.registerHandler("HN_report", function(data, responseCallback) {
		    $('.HN_Jubao').click();
		});

	});


	//退出
	var logoutBtn = document.getElementsByClassName("logout")[0];
	if(logoutBtn && logoutBtn != undefined){
		logoutBtn.onclick = function(){
			var device = navigator.userAgent;
			if(device.indexOf('huoniao') > -1){
                $(this).html(langData['siteConfig'][45][54]);  //退出中
				if(device.indexOf('android') > -1){
                    $('body').append('<iframe src="'+masterDomain+'/logout.html?from=app" style="display: none;"></iframe>');
                }
                setTimeout(function(){
                    setupWebViewJavascriptBridge(function(bridge) {
                      bridge.callHandler('appLogout', {}, function(){});
                      bridge.callHandler("goBack", {}, function(responseData){});
                      bridge.callHandler('pageReload',	{},	function(responseData){});
    				});
                }, 2000);
			}else{
                location.href = '/logout.html';
            }
		};
	}

	$('.header').on('touchmove', function(e){
    e.preventDefault();
  })

	if($("#navlist").size() > 0){
	  var myscroll_nav = new iScroll("navlist", {vScrollbar: false});
	  $('.header-search .dropnav').click(function(){
	    var a = $(this), header = a.closest('.header');
	    if(!header.hasClass('open')) {
          toggleDragRefresh('off');
	      header.addClass('open');
	      $('.btmMenu').hide();
	      $('.fixFooter').hide();
	      $('#navBox').css({'top':'0.9rem', 'bottom':'0'}).show();
				var device = navigator.userAgent;
	      if (device.indexOf('huoniao_iOS') > -1) {
	        // $('#navBox').css({'top':'calc(0.9rem + 20px)', 'bottom':'0'});
	        $('#navBox').css({'top':'0', 'bottom':'0'});
	      }
	      $('#navBox .bg').css({'height':'100%','opacity':1});
	      myscroll_nav.refresh();
	    }else {
          toggleDragRefresh('on');
	      header.removeClass('open');
	      closeShearBox();
	    }
	  })

    }


    //如果没有菜单内容，则隐藏APP端右上角菜单
    if (device.indexOf('huoniao') > -1 && ($('.dropnav').size() == 0 || $('#navlist_4').size() == 0)) {
        setTimeout(function(){
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('hideAppMenu', {}, function(){});
            });
        }, 500);
    }

	if(typeof huoniao.checkhtml === "function"){
  		huoniao.checkhtml();
    }

  $('#cancelNav').click(function(){
      closeShearBox();
  })


  $('#shearBg').click(function(){
      closeShearBox();
  })

  $('#navlist li').click(function(){
      setTimeout(function(){
          closeShearBox();
      }, 500);
  })

  //模块链接跳原生
  $('#navlist_4').delegate('a', 'click', function(e){
      var t = $(this), name = t.attr('data-name'), code = t.attr('data-code'), href = t.attr('href');
      if(href != 'javascript:;' && device.indexOf('huoniao') > -1){
          e.preventDefault();
          setupWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('redirectNative', {'name': name, 'code': code, 'link': href}, function(){});
          });
      }
  });


  function closeShearBox(){
    $('.fixFooter').show();
    $('.header').removeClass('open');
    $('#navBox').hide();
    $('#navBox .bg').css({'height':'0','opacity':0});
  }


  // 清除列表cookie
  $('#navlist_4 li').click(function(){
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
  if (typeof JubaoConfig != "undefined" && JubaoConfig.module != 'shop' && JubaoConfig.module != 'waimai' && JubaoConfig.module != 'tuan') {
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
    var t = $(this);
    if(t.hasClass('disabled')) return;
    if ($('.JuSelect .active').length < 1) {
      showErr(langData['siteConfig'][24][2]);  //请选择举报类型
    }else if ($('#JubaoTel').val() == "") {
      showErr(langData['siteConfig'][20][459]);  //请填写您的联系方式
    }else {

      var type = $('.JuSelect .active').text();
      var desc = $('.JuRemark textarea').val();
      var phone = $('#JubaoTel').val();

      if(JubaoConfig.module == "" || JubaoConfig.action == "" || JubaoConfig.id == 0){
        showErr('Error!');
        setTimeout(function(){
          JubaoBox.hide();
          JuMask.removeClass('show');
        }, 1000);
        return false;
      }

      t.addClass('disabled').html('loading...');

      $.ajax({
        url: masterDomain+"/include/ajax.php",
        data: "service=member&template=complain&module="+JubaoConfig.module+"&dopost="+JubaoConfig.action+"&aid="+JubaoConfig.id+"&type="+encodeURIComponent(type)+"&desc="+encodeURIComponent(desc)+"&phone="+encodeURIComponent(phone),
        type: "GET",
        dataType: "jsonp",
        success: function(data){
          t.removeClass('disabled').html(langData['siteConfig'][6][151]);  //提交
          if (data && data.state == 100) {
            showErr(langData['siteConfig'][21][242]);  //举报成功！
            setTimeout(function(){
              JubaoBox.hide();
              JuMask.removeClass('show');
            }, 1500);

          }else{
            showErr(data.info);
          }
        },
        error: function(){
          t.removeClass('disabled').html(langData['siteConfig'][6][151]);  //提交
          showErr(langData['siteConfig'][20][183]);  //网络错误，请稍候重试！
        }
      });

    }
  });


  //apptitle
  var apptitle = $('meta[name="apptitle"]');
  if(apptitle.length > 0 && apptitle[0].content && (window.__wxjs_environment == 'miniprogram' || isbaidu || isQQ)){
	  document.title = apptitle[0].content;
  }

    //在线联系
 var userinfo,toUserinfo,chatToken,toChatToken;

 //创建websocket
 var kumanIMLib = function (wsHost) {

        var lib = this;

        this.timeOut = 30000;  // 每30秒发送一次心跳
        this.timeOutObj = null;

        // 重置心跳
        this.reset = function(){
            clearTimeout(this.timeOutObj);
            lib.start();
        }

        // 启动心跳
        this.start = function(){
            lib.timeOutObj = setInterval(function(){
                lib.socket.send('HeartBeat');
            }, lib.timeOut);
        }

        // 初始化连接
        if (window['WebSocket']) {
            this.socket = new WebSocket(wsHost);
            //this.socket.onopen = this.evt.onopen;  // 连接成功

            // 关闭
            this.socket.onclose = function(){
                lib.socket = new WebSocket(lib.socket.url);
            };

            // 异常
            this.socket.onerror = function(){
                this.close();
            };

            // 收到消息
            this.socket.onmessage = function (evt) {
                lib.reset();  //重置心跳
                var msg = JSON.parse(evt.data);
                switch (msg.type) {
                    case "init":
                        console.log(msg.info.content);
                        break;
                    default:
                        if(userinfo['uid'] == msg.info.to && msg.info.type == 'member'){

                        }
                        break;
                }

            };

        } else {
            alert('您的浏览器不支持WebSockets.');
            return false;
        }

        this.start();  //启动心跳检测

    };

  //获取token
  function getToken(id){
  	if(!id){
  		id = '';
  	}
  	 $.ajax({
        url: '/include/ajax.php?service=siteConfig&action=getImToken&userid='+id,
        type: 'post',
        dataType: 'json',
        success: function(data){
            if(data.state == 100){
                var info = data.info;
				//创建连接
				if(!id){
				  userinfo = info;
	              chatToken = info.token;
	              chatServer = info.server;
	              AccessKeyID = info.AccessKeyID;
				  chatLib = new kumanIMLib(chatServer + "?AccessKeyID=" + AccessKeyID + "&token=" + chatToken + "&type=member");

				}else{
					toUserinfo = info;
					toChatToken = info.token;
				}
           }else{
                window.location.href = masterDomain+'/login.html';
				return false;
            }

        },
        error: function(){
            console.log('网络错误，初始化失败！');
        }
    });
  }

 function msgto(msg,type){
	var time = Math.round(new Date().getTime()/1000).toString();
    var data = {
        content: msg,
        contentType: type,
        from: chatToken,
        fid: userinfo['uid'],
        to: toChatToken,
        tid: toUserinfo['uid'],
        type: "person",
        time: time
    }
    $.ajax({
        url: '/include/ajax.php?service=siteConfig&action=sendImChat',
        data: data,
        type: 'post',
        dataType: 'json',
        success: function(data){
            chatLib.reset();
        },
        error: function(){

        }
    });
}

if(typeof(imconfig) != "undefined"){
   getToken(imconfig.chatid);
   getToken();
}

$('.chat_to-Link').click(function(){
  	var type = $(this).attr('data-type');
  	var userid = $.cookie(cookiePre+"login_user");
	if(userid == null || userid == ""){
		window.location.href = masterDomain+'/login.html';
		return false;
	}

	/*
	 1.获取自己的token
	 2.获取好友的token
	 3.发送消息
	 4.跳转链接
	 * */
	if(type == 'detail'){
		msgto(imconfig,'link');
	}
	// 更新房产用户联系经纪人
	if(imconfig.mod && imconfig.mod=='house' && type=='detail'){
		updateContact(imconfig.chatid,page_type,imconfig.title);
	}
	if(device.indexOf('huoniao') > -1 && userinfo && toUserinfo){
      var param = {
        from: userinfo['uid'],
        to: toUserinfo['uid'],
      };
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('invokePrivateChat',  param, function(responseData){
        	console.log(responseData)
        });
      });
      return false;
    }else{
    	window.location.href = user_member+'/im/chat-'+toUserinfo['uid']+'.html'
    }

  });

  function updateContact(id,type,title){
	  var houseid = pageData?pageData.id:'';
	  if(houseid != ''){
	  	$.ajax({
	  		url: '/include/ajax.php?service=house&action=updateContactlog&jzuid='+id+'&aid='+houseid+'&title='+title+'&type='+type,
	  		type: 'post',
	  		dataType: 'json',
	  		success: function(data){
	  			if(data.state==100){

	  			}
	  		},
	  		error: function(data){},
	  	});
	  }
  }


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
      $('.JuError').fadeOut();
    }, 2000)
  }


    //重置小程序中所有a链接
    // $('body').delegate('a', 'click', function(e){
    //     if(wx_miniprogram){
    //         var t = $(this), url = t.attr('data-url') ? t.attr('data-url') : t.attr('href'), href = url.toLowerCase();
    //         if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0){
    //             e.preventDefault();
    //             wx.miniProgram.navigateTo({url: '/pages/redirect/index?url=' + encodeURIComponent(url)});
    //         }

    //     }
    // });
    var wxmini_click = 0, bdmini_click = 0, qqmini_click = 0;
    $('body').delegate('a', 'click', function(e){
		var t = $(this), url = t.attr('data-url') ? t.attr('data-url') : t.attr('href'), href = url.toLowerCase(), a_domain = t.attr('data-domain') ? 1 : 0;
		var foot = t.closest('.footer_4_3').length;  //是否是底部导航按钮
		var fmod = '';
		if(foot){
		  var li = t.closest('li.ficon')
		  fmod = t.closest('.footer_4_3').attr('data-title')=='siteConfig' && li.index()==1;
		}
		if(a_domain) return false;
        if(wx_miniprogram && !wxmini_click && (!foot || fmod)){
            wxmini_click = 1;
            if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0 && href.indexOf('currentpageopen') < 0)
            {
                e.preventDefault();
        				if(href.indexOf('miniprogramlive_') > -1){
        					wx.miniProgram.navigateTo({url: '/pages/live/detail?roomid=' + href.replace('miniprogramlive_', '')});
        				}else{
        					wx.miniProgram.navigateTo({url: '/pages/redirect/index?url=' + encodeURIComponent(url)});
        				}
            }else{
				// if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0){
    //                 location.href = url;
    //             }
            }
        }else{
        	// 百度小程序
          // alert(baidu_miniprogram)
          if(isbaidu && !bdmini_click && (!foot || fmod) ){
              bdmini_click = 1;
              if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0 && href.indexOf('currentpageopen') < 0)
                {
                    e.preventDefault();
					  //? => huoniaowh
					  //& => huoniaolj
					  //= => huoniaodh
                    swan.webView.navigateTo({url: '/pages/redirect/redirect?url=' + encodeURIComponent(url.replace('?','huoniaowh').replace(/\&/g,'huoniaolj').replace(/\=/g,'huoniaodh'))});

                }else{
					// if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0){
	    //                 location.href = url;
	    //             }
	            }

		  //QQ小程序
          }else{
              // alert(qq_miniprogram+'~'+ !qqmini_click+'~'+(!foot || fmod))
          		if(qq_miniprogram && !qqmini_click && (!foot || fmod)){
          			qqmini_click = 1;
          			if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0 && href.indexOf('currentpageopen') < 0)
		                {
		                    e.preventDefault();
		                    qq.miniProgram.navigateTo({url: '/pages/redirect/redirect?url=' + encodeURIComponent(url)});
		                }

          		}else{

	      			if(href.indexOf('miniprogramlive_') > -1 && !wx_miniprogram && !baidu_miniprogram){

	      				//APP端
	      				if(device.indexOf('huoniao') > -1){
	      					setupWebViewJavascriptBridge(function(bridge) {
	      						bridge.callHandler('redirectToWxMiniProgram', {'path': '/pages/live/detail?roomid=' + href.replace('miniprogramlive_', '')},	function(responseData){});
	      					});
	      				}else{
	      					location.href="/include/json.php?action=getMiniProgramLive&id="+href.replace('miniprogramlive_', '');
	      				}
	      				return false;
	      			}else{
						// if(href != '' && href != 'javascript:;' && href != '#' && href != '###' && href.indexOf('.jpg') < 0 && href.indexOf('.gif') < 0 && href.indexOf('.png') < 0 && href.indexOf('.jpeg') < 0 && href.indexOf('tel:') < 0 && device.indexOf('huoniao') < 0){
		    //                 location.href = url;
		    //             }
		            }
          		}
          }
    	}

        setTimeout(function(){
          wxmini_click = 0;
          bdmini_click = 0;
          qqmini_click = 0;
        },1500)
    });

    //城市下拉菜单自动选中当前城市
    var cityIdSelectObj = $('select#cityid');
    if(cityIdSelectObj.size() > 0 && (cityIdSelectObj.val() == 0 || cityIdSelectObj.val() == '')){
        var cityInfo = $.cookie('HN_siteCityInfo');
        cityInfo = eval('('+cityInfo+')');
        var cityInfoID = cityInfo.cityid;
        cityIdSelectObj.find("option[value='"+cityInfoID+"']").attr("selected", 'selected');
        cityIdSelectObj.siblings('#cityid_dummy').val(cityInfo.name);
    }

    var cityIdSelectObj = $('select#city');
    if(cityIdSelectObj.size() > 0 && (cityIdSelectObj.val() == 0 || cityIdSelectObj.val() == '')){
        var cityInfo = $.cookie('HN_siteCityInfo');
        cityInfo = eval('('+cityInfo+')');
        var cityInfoID = cityInfo.cityid;
        cityIdSelectObj.find("option[value='"+cityInfoID+"']").attr("selected", 'selected');
        cityIdSelectObj.siblings('#city_dummy').val(cityInfo.name);
    }

    //多域名同步登录
	var masterDomainClean = typeof masterDomain != 'undefined' ? masterDomain.replace("http://", "").replace("https://", "") : "",
			channelDomainClean = typeof channelDomain != 'undefined' ? channelDomain.replace("http://", "").replace("https://", "") : window.location.host;
	if(masterDomainClean != "" && channelDomainClean != "" && channelDomainClean.indexOf(masterDomainClean) == -1){
		channelDomainClean = channelDomainClean.split("/")[0];
		$("body").append('<iframe src="'+masterDomain+'/sso.html?site='+channelDomainClean+'" style="display:none;"></iframe>');
	}


    //内容页增加快速导航
    var pathname = location.pathname, pathnameArr = pathname.split('/'), pathfile = pathnameArr[pathnameArr.length-1];
    huoniao.operaJson('/include/ajax.php', 'service=siteConfig&action=getFastNavigationRule', function(data){
        if(data && data.state == 100){
            var info = data.info, busiDomain = info.member.busiDomain, userDomain = info.member.userDomain, fabuArr = info.fabu, cartArr = info.cart;
            var weixin = info.weixin, qr = weixin.qr, name = weixin.name, mQr = weixin.mQr, mName = weixin.mName;

            //不需要的页面
            if(
                pathname != '' &&
                pathname != 'index.html' &&
                pathname != '/' &&
                location.href.indexOf(busiDomain+'/') < 0 &&
                location.href.indexOf(userDomain+'/') < 0 &&
                location.href.indexOf('changecity') < 0 &&
                location.href.indexOf('login') < 0 &&
                location.href.indexOf('register') < 0 &&
                location.href.indexOf('complain') < 0 &&
                location.href.indexOf('sso') < 0 &&
                location.href.indexOf('logout') < 0 &&
                location.href.indexOf('fpwd') < 0 &&
                location.href.indexOf('resetpwd') < 0 &&
                location.href.indexOf('memberVerifyEmail') < 0 &&
                location.href.indexOf('memberVerifyPhone') < 0 &&
                location.href.indexOf('getUserInfo') < 0 &&
                location.href.indexOf('bindMobile') < 0 &&
                location.href.indexOf('suggestion') < 0 &&
                location.href.indexOf('order') < 0 &&
                location.href.indexOf('pay') < 0 &&
                location.href.indexOf('confirm') < 0 &&
                location.href.indexOf('cart') < 0 &&
                location.href.indexOf('buy') < 0 &&
                // location.href.indexOf('waimai') < 0 &&
                location.href.indexOf('address') < 0 &&
                location.href.indexOf('map') < 0 &&
                location.href.indexOf('fabu') < 0 &&
                location.href.indexOf('h_detail') < 0 &&
                location.href.indexOf('sharePage') < 0 &&
                location.href.indexOf('.html') > 0
            ){

                var liArr = [];
                liArr.push('<li class="f-homePage"><a href="'+info.basehost+'">'+langData['siteConfig'][0][0]+'</a></li>');  //首页

                if(qr || mQr) {
                    liArr.push('<li class="f-weChat"><a href="javascript:;">' + langData['siteConfig'][19][183] + '</a></li>');  //微信号


                    $('body').append('<div class="popupNavWechat">\n' +
                        '\t<div class="conWechat">\n' +
                        '\t\t<a href="javascript:;" class="closeWechat">×</a>\n' +
                        (qr ? '\t\t<dl><dt><img src="'+qr+'"></dt><dd>'+name+'<br>微信中长按识别</dd></dl>\n' : '') +
                        (mQr ? '\t\t<dl><dt><img src="'+mQr+'"></dt><dd>'+mName+'<br>微信中长按识别</dd></dl>\n' : '') +
                        '\t</div>\n' +
                        '</div>');

                }

                liArr.push('<li class="f-user"><a href="'+userDomain+'">' + langData['siteConfig'][10][0] + '</a></li>');  //我的

                //验证是否有发布需求
                for (var i = 0; i < fabuArr.length; i++){
                    if(location.href.indexOf(fabuArr[i].domain) > -1){
                        liArr.push('<li class="f-fabu"><a href="'+fabuArr[i].link+'">' + langData['siteConfig'][11][0] + '</a></li>');  //发布
                        break;
                    }
                }

                //验证是否有购物车需求
                for (var i = 0; i < cartArr.length; i++){
                    if(location.href.indexOf(cartArr[i].domain) > -1){

                        $('.wechat, .gocart, .my').remove();

                        liArr.push('<li class="f-cart"><a href="'+cartArr[i].link+'">' + langData['siteConfig'][22][12] + '</a></li>');  //发布
                        break;
                    }
                }
				var popcls = 'fn-hide';
				if(typeof touch_poster !='undefined'){   //如果有touch_poster,则需要显示按钮
					popcls = '';
					var userShareId = $.cookie((window.cookiePre ? window.cookiePre : 'HN_') + 'userid');
					if(userShareId){
					  var img = ($('.html2_qrcode').find('img').size()>0)?$('.html2_qrcode').find('img'):$('.html2_qrcode1').find('img');
					  var imgUrl = img.attr('src');
					  img.attr('src',imgUrl+"?fromShare="+userShareId);
					}
					// $('body').append('<form id="poster_form" action="'+masterDomain+'/include/upload.inc.php?mod=siteConfig&type=card" method="post" target="iframe"><input type="hidden" id="poster_addr"></form>');
					// getdetail_poster()

				}
                $('body').append('<div class="popupRightBottom">\n' +
					'    <a href="javascript:;" class="postFast '+popcls+'" id="postFast"><em class="smsk"></em></a> \n'  +
					'    <div></div> \n' +
                    '    <div class="fastNav" id="fastNav">\n' +
                    '        <button><em class="smsk"></em></button>\n' +
                    '        <div class="slideMain"><div class="slideFastNav">\n' +
                    '            <a href="javascript:;" class="closeNav"><em class="smsk"></em></a>\n' +
                    '            <ul class="fn-clear">\n' + liArr.join('') +
                    '            </ul>\n' +
                    '        </div></div>\n' +
                    '    </div>\n' +
                    '    <div class="fastTop"><em class="smsk"></em><i></i></div>\n' +
                    '</div>');

                //显示导航内容
                $('body').delegate('.popupRightBottom button', 'click', function(){
                   var slideFastNav = $('.popupRightBottom .slideFastNav');
                   var fastNavBtn = $('.popupRightBottom .fastNav button');
				   var postNavBtn = $('.popupRightBottom .postFast');
				   var topNavBtn = $('.popupRightBottom .fastTop');
                   if(slideFastNav.hasClass('showNav')){
					   $('.popupRightBottom .fastNav .slideMain').hide()
                       slideFastNav.addClass('hideNav');
                       fastNavBtn.removeClass('openNav');
					   topNavBtn.removeClass('hidefast');
					   postNavBtn.removeClass('hidefast');
                       setTimeout(function(){
                           slideFastNav.removeClass('showNav');
                           slideFastNav.removeClass('hideNav');
                       }, 200);
                   }else {
					   $('.popupRightBottom .fastNav .slideMain').show()
                       fastNavBtn.addClass('openNav');
                       slideFastNav.addClass('showNav').removeClass('hideNav');
					   topNavBtn.addClass('hidefast');
					   postNavBtn.addClass('hidefast');
                   }
                });




				//页面滚动
				$(window).scroll(function(){
					if($('.popupRightBottom .fastNav button').hasClass('openNav')){
						$('.popupRightBottom .fastNav button').click()
					}
				});
				// 生成海报
				 $(document).delegate('.postFast','click',function(e){
					 $('html').addClass('noscroll')
					$(".html2_mask").show();

					//APP端取消下拉刷新
				    toggleDragRefresh('off');

					getdetail_poster();
				 });

				// 生成海报2
				function getdetail_poster(){
					if($('.html2Wrap').size() > 0){

						var html2canvas_fixed = $('#html2canvas_fixed'), html2canvas_fixed_img = $('#html2canvas_fixed .html2_img img');

						//生成带参数的微信二维码
						//必须有微信分享信息和举报信息
						if(wxconfig && JubaoConfig && html2canvas_fixed_img.size() == 0){

							$.ajax({
								url: "/include/ajax.php",
								type: "POST",
								data: {
									service: 'siteConfig',
									action: 'getWeixinQrPost',
									module: JubaoConfig['module'],
									type: JubaoConfig['action'],
									aid: JubaoConfig['id'],
									title: wxconfig['title'],
									description: wxconfig['description'],
									imgUrl: wxconfig['imgUrl'],
									link: wxconfig['link']
								},
								async: false,
								dataType: "json",
								success: function (response) {
									if(response.state == 100){

                                        if($(".html2Wrap.newPoster .html2_qrcode .html2_qrcodeBox").size() > 0){
    									    $(".html2Wrap.newPoster .html2_qrcode .html2_qrcodeBox").qrcode({
                                				render: window.applicationCache ? "canvas" : "table",
                                				width: $(".html2_qrcodeBox").width(),
                                				height: $(".html2_qrcodeBox").height(),
                                				text: toUtf8(response.info)
                                			});
                                        }else{
                                            $(".html2Wrap .html2_qrcode").html('');
                                            $(".html2Wrap .html2_qrcode").qrcode({
                                				render: window.applicationCache ? "canvas" : "table",
                                				width: $(".html2_qrcode").width(),
                                				height: $(".html2_qrcode").height(),
                                				text: toUtf8(response.info)
                                			});
                                        }

								// 		$('.html2_qrcode img, .html2_qrcode1 img').attr('src', '/include/qrcode.php?data=' + response.info);
									}else{
										$(".html2Wrap .html2_qrcode").html('');
										$(".html2Wrap .html2_qrcode").qrcode({
											render: window.applicationCache ? "canvas" : "table",
											width: $(".html2_qrcode").width(),
											height: $(".html2_qrcode").height(),
											text: toUtf8(wxconfig.link)
										});

										var w = $(".html2_qrcode1").width(), h = $(".html2_qrcode1").height();
										$(".html2Wrap .html2_qrcode1").html('');
										$(".html2Wrap .html2_qrcode1").qrcode({
											render: window.applicationCache ? "canvas" : "table",
											width: w,
											height: h,
											text: toUtf8(wxconfig.link)
										});
									}
								},
								error: function (xhr, status, error) {

								}
							});

						}

						if(html2canvas_fixed_img.size() == 0){
							//生成图片
                            const shareContent = document.getElementById('html2_node')
                            const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
                            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
                            var width = shareContent.offsetWidth;//dom宽
                            var height = shareContent.offsetHeight;//dom高 获取滚动轴滚动的长度
							html2canvas(document.querySelector("#html2_node"), {
					           //'backgroundColor':'#fff',
                     'backgroundColor':'transparent',
					           'useCORS':true,
							   'dpi': window.devicePixelRatio * 2,
							   'scale': 2,
                               // 'x': rect.left, // 绘制的dom元素相对于视口的位置
                               // 'y': rect.top,
                               'width':width,
                               'heoght':height,
                               'scrollY': 0,
                               'scrollX': 0,
                               'taintTest':true,
                               // 'timeout': 500 // 加载延时
							}).then(function(canvas){
								var a = canvasToImage(canvas);
								$('#html2canvas_fixed .html2_img').html(a);
								$(".html2_mask img").hide();
								$('.html2canvas_fixed').addClass('show');
							});
							function canvasToImage(canvas) {
							    var image = new Image();
								image.setAttribute("crossOrigin",'anonymous')
								var imageBase64 = canvas.toDataURL("image/png",1);
                                image.src = imageBase64;
								utils.setStorage("huoniao_poster" , imageBase64);

						        return image;
							}
						}else{
							$('.html2canvas_fixed').addClass('show');
						}

						setTimeout(function(){
							if(($('.html2canvas_fixed').outerHeight()+10)>$(window).height()*.9){
								$('.html2_mask_bottom').fadeIn();
							}else{
								$('.html2_mask_bottom').fadeOut()
							}
						},500)

					}
					return false;
				}

				$('.html2canvas_fixed').on('click','.html2_close',function(e){
					e.preventDefault();
					$('.html2canvas_fixed').removeClass('show')
					$(".html2_mask").hide();
					$('html').removeClass('noscroll');
					$('.html2_mask_bottom').fadeOut();

					//APP端开启下拉刷新
				    toggleDragRefresh('on');
				});
				$('.html2_mask').click(function(e){
					e.preventDefault();
					$('.html2canvas_fixed').removeClass('show')
					$(".html2_mask").hide();
					$('html').removeClass('noscroll');
					$('.html2_mask_bottom').fadeOut();

					//APP端开启下拉刷新
				    toggleDragRefresh('on');
				})




				 //长按
				    var flag=1  //设置长按标识符
				    var timeOutEvent=0;
				    $(".html2canvas_fixed .html2_img").on({
				        touchstart: function(e){
				            if(flag){
				                clearTimeout(timeOutEvent);
				                timeOutEvent = setTimeout("longPressPoster()",800);
				            }
				            // e.preventDefault();
				        },
				        touchmove:function () {
				            clearTimeout(timeOutEvent);
				            timeOutEvent = 0;
				        },
				        touchend:function () {
				            flag=1;
				        }

				    });


                //隐藏导航内容
                $('body').delegate('.popupRightBottom .closeNav', 'click', function(){
                    var slideFastNav = $('.popupRightBottom .slideFastNav');
                    slideFastNav.addClass('hideNav');
                    setTimeout(function(){
                        slideFastNav.removeClass('showNav');
                        slideFastNav.removeClass('hideNav');
                    }, 200);
                });

                //显示微信公众号
                $('body').delegate('.popupRightBottom .f-weChat', 'click', function(){
                    $('.popupNavWechat').css("visibility", "visible");
                });

                //隐藏微信公众号
                $('body').delegate('.popupNavWechat .closeWechat', 'click', function(){
                    $('.popupNavWechat').css("visibility", "hidden");
                });

                //返回顶部
                $('body').delegate('.fastTop', 'click', function(){
                    document.scrollingElement.scrollTop = 0;
                });

                //隐藏返回顶部
                $(window).on("scroll", function(){
                    if($(window).scrollTop() > 400) {
                        $('.popupRightBottom .fastTop').css("visibility", "visible");
                    }else{
                        $('.popupRightBottom .fastTop').css("visibility", "hidden");
                    }
                });

                //隐藏原有按钮
                $('.gotop, .wechat-fix').remove();

            }
        }
    });

};

//开启关闭下拉刷新
function toggleDragRefresh(val){
    if (device.indexOf('huoniao') > -1) {
        setTimeout(function(){
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler("setDragRefresh", {"value": val}, function () {
                });
            });
        }, 500);
    }
}
     //长按执行的方法
	function longPressPoster(){
	    var imgsrc = $(".html2canvas_fixed .html2_img").find('img').attr('src');
	    if(imgsrc==''||imgsrc==undefined){
	        alert(langData['siteConfig'][44][94]);//下载失败，请重试
	        return 0
	    }
	    flag=0;
	    setupWebViewJavascriptBridge(function(bridge) {
	        bridge.callHandler(
	            'saveImage',
	            {'value': 'huoniao_poster'},
	            function(responseData){
	                if(responseData == "success"){
	                    setTimeout(function(){
	                        flag=1;
	                    }, 200)
	                }
	            }
	        );
	    });
	}
//输出货币标识
function echoCurrency(type){
	var pre = (typeof cookiePre != "undefined" && cookiePre != "") ? cookiePre : "HN_";
	var currencyArr = $.cookie(pre+"currency");
	if(currencyArr){
		var currency = JSON.parse(currencyArr);
		if(type){
			return unescape(currency[type].replace(/&#x/g,'%u').replace(/;/g,''));
		}else{
			return currencyArr['short'];
		}
	}else if(typeof cfg_currency != "undefined"){
		if(type){
			return unescape(cfg_currency[type].replace(/&#x/g,'%u').replace(/;/g,''))
		}else{
			return cfg_currency['short'];
		}
	}
}


//单点登录执行脚本
function ssoLogin(info){

    var host = window.location.host;
    var host_ = host.split('.');
    var len = host_.length;
    var domain = '', start = len > 2 ? len - 2 : 0;
    for(var i = start; i < len; i++){
        domain += '.' + host_[i];
    }

	//已登录
	if(info){

        $.cookie(cookiePre+'login_user', info['userid_encode'], {expires: 365, domain: host, path: '/'});
        $.cookie(cookiePre+'login_user', info['userid_encode'], {expires: 365, domain: domain, path: '/'});

	//未登录
	}else{
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: host, path: '/'});
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: domain, path: '/'});
	}

}


var utils = {
    canStorage: function(){
        if (!!window.localStorage){
            return true;
        }
        return false;
    },
    setStorage: function(a, c){
        try{
            if (utils.canStorage()){
                localStorage.removeItem(a);
                localStorage.setItem(a, c);
            }
        }catch(b){
            if (b.name == "QUOTA_EXCEEDED_ERR"){
                alert("您开启了秘密浏览或无痕浏览模式，请关闭");
            }
        }
    },
    getStorage: function(b){
        if (utils.canStorage()){
            var a = localStorage.getItem(b);
            return a ? JSON.parse(localStorage.getItem(b)) : null;
        }
    },
    removeStorage: function(a){
        if (utils.canStorage()){
            localStorage.removeItem(a);
        }
    },
    cleanStorage: function(){
        if (utils.canStorage()){
            localStorage.clear();
        }
    }
};


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

//计算广告尺寸
function calculatedAdvSize(obj){
  var obj = $('#' + obj);
  if(!obj.parent().height()){
    obj.css({'min-height': '2.5rem'});
  };
  if(obj.size() > 0){
    obj.find('h6').html('尺寸【'+parseInt(obj.width() * 2)+' × '+parseInt(obj.height() * 2)+'】px');
  }
}

function hn_getCookie(key){
   var arr,reg = RegExp('(^| )'+key+'=([^;]+)(;|$)');
   if (arr = document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
   else
        return null;
}

function hn_delCookie(key){
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var delValue = hn_getCookie(key);
    if (!!delValue) {
        document.cookie = key+'='+delValue+';expires='+date.toGMTString();
    }
}

function returnHumanTime(t,type) {
    var n = new Date().getTime() / 1000;
    var c = n - t;
    var str = '';
    if(c < 60) {
        str = '刚刚';
    } else if(c < 3600) {
        str = parseInt(c / 60) + '分钟前';
    } else if(c < 86400) {
        str = parseInt(c / 3600) + '小时前';
    } else if(c < 604800) {
        str = parseInt(c / 86400) + '天前';
    } else {
        str = huoniao.transTimes(t,type);
    }
    return str;
}
function returnHumanClick(click){
   if(click >= 10000){
       click = (click/10000).toFixed(1) + '万';
   }
   return click;
}

//获取URL参数
function getQueryParam(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null) return unescape(r[2]); return null;
}


// 转blob流文件
var loadImageToBlob  = function(img,url,callback) {
  if(!url || !callback) return false;
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    // 注意这里的this.response 是一个blob对象 就是文件对象
    callback(this.status == 200 ? this.response : false);
  }
  xhr.onerror= function() {
    img.remove();
  }
  xhr.send();
  return true;
}

function imgToBlob(dom){
  $(dom).find('img').each(function(){
    var t = $(this),src = t.attr('src');
    loadImageToBlob(t,src, function(blobFile) {
      t.attr('src', URL.createObjectURL(blobFile));
    });
  })
}

function toUtf8(str){
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}
