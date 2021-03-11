$(function(){

	if($('.icon-circle img').attr('src','')){
		$('.icon-circle img').css('background-color','#ccc')
	}else{
		$('.icon-circle img').css('background-color','#fff')
	}

	//抢购倒计时
    $.ajax({
        url: "/include/ajax.php",
        dataType: "jsonp",
        data: 'service=system&action=getSysTime',
        success: function(data) {

            var date = new Date();
            $('.nowtime span').text(date.getHours());

            var nowtime = data.now;
            var time = data.nextHour - nowtime;

            setInterval(function () {
                var hour = parseInt(time/ 60 / 60 % 24);
                var minute = parseInt(time/ 60 % 60);
                var seconds = parseInt(time% 60);

                $('#time_h').text(hour < 10 ? '0' + hour : hour);
                $('#time_m').text(minute < 10 ? '0' + minute : minute);
                $('#time_s').text(seconds < 10 ? '0' + seconds : seconds);

                time--;
            }, 1000);
        }
    });








	 //广告位滚动
    new Swiper('.banner .swiper-container', {pagination: '.banner .pagination',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});
	  $('.next-page').click(function(){
	    $('.pagination .swiper-pagination-switch').eq(1).click();
	  });


	var miniprogram = false;
	if(window.__wxjs_environment == 'miniprogram'){
		miniprogram = true;
	}else{
		if(navigator.userAgent.toLowerCase().match(/micromessenger/)) {
			if(typeof(wx) != 'undefined'){
				wx.miniProgram.getEnv(function (res) {
					miniprogram = res.miniprogram;
				});
			}
		}
	}

    //导航
    $.ajax({
        type: "POST",
        url: "/include/ajax.php",
        dataType: "json",
        data: 'service=siteConfig&action=siteModule&type=1&platform=' + (miniprogram ? 'wx_miniprogram' : ''),
        success: function (data) {
            if(data && data.state == 100){
                var tcInfoList = [], list = data.info;
                for (var i = 0; i < list.length; i++){
                    if(list[i].code != 'special' && list[i].code != 'website'){
                        tcInfoList.push('<li><a href="'+list[i].url+'" data-code="'+(!list[i].disabled ? list[i].code : '')+'" data-name="'+list[i].name+'"><span class="icon-circle"><img src="'+list[i].icon+'"></span><span class="icon-txt">'+list[i].name+'</span></a></li>');
                    }
                }
                $('.tcInfo .swiper-slide ul').html(tcInfoList.join(''));

                // 滑动导航
                var t = $('.tcInfo .swiper-wrapper');
                var swiperNav = [], mainNavLi = t.find('li');
                for (var i = 0; i < mainNavLi.length; i++) {
                    swiperNav.push('<li>'+t.find('li:eq('+i+')').html()+'</li>');
                }

                var liArr = [];
                for(var i = 0; i < swiperNav.length; i++){
                    liArr.push(swiperNav.slice(i, i + 10).join(""));
                    i += 9;
                }

                t.html('<div class="swiper-slide"><ul class="fn-clear">'+liArr.join('</ul></div><div class="swiper-slide"><ul class="fn-clear">')+'</ul></div>');
                new Swiper('.swipre00', {pagination: '.pag00', loop: false, grabCursor: true, paginationClickable: true});

            }else{
                $('.tcInfo').hide();
            }
        },
        error: function(){
            $('.tcInfo').hide();
        }
    });
    //模块链接跳原生
    $('.tcInfo').delegate('a', 'click', function(e){
        var t = $(this), name = t.attr('data-name'), code = t.attr('data-code'), href = t.attr('href');
        if(href != 'javascript:;' && device.indexOf('huoniao') > -1){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('redirectNative', {'name': name, 'code': code, 'link': href}, function(){});
            });
        }
    });

		//同城头条动态数据
    $.ajax({
        type: "POST",
        url: "/include/ajax.php",
        dataType: "json",
        data: 'service=article&action=alist&flag=h&pageSize=10',
        success: function(data) {

            if(data.state == 100){
                var tcNewsHtml = [], list = data.info.list;
                var step = 1;
                var img = '', imgUrl = '';

                for (var i = 0; i < list.length; i++){
                    if(step == 1){
                        tcNewsHtml.push('<div class="swiper-slide swiper-no-swiping">');
                        tcNewsHtml.push('<p><a href="'+list[i].url+'"><span>['+list[i].typeName[(list[i].typeName.length)-1]+']</span>'+list[i].title+'</a></p>');
//                      if(list[i].litpic){
//                          img = list[i].litpic;
//                          imgUrl = list[i].url;
//                      }
                    }

                    if(step == 2){
                        tcNewsHtml.push('<p><a href="'+list[i].url+'"><span>['+list[i].typeName[(list[i].typeName.length)-1]+']</span>'+list[i].title+'</a></p>');
//                      if(img == '' && list[i].litpic){
//                          img = list[i].litpic;
//                          imgUrl = list[i].url;
//                      }
                        step = 0;
                    }

                    if(step == 0 || i == list.length - 1){
                        tcNewsHtml.push('</div>');
                        step = 0;
                    }

                    if(img && step == 0){
                        tcNewsHtml.push('<div class="mrBox"><a href="'+imgUrl+'"><img src="'+img+'" alt=""></a></div>');
                    }

                    if(step == 0) {
                        tcNewsHtml.push('</div>');
                    }
                    step++;

                }

                $('.tcNews .swiper-wrapper').html(tcNewsHtml.join(''));
                new Swiper('.tcNews .swiper-container', {pagination: '.tcNews .pagination',direction: 'vertical',paginationClickable: true, loop: true, autoplay: 2000, autoplayDisableOnInteraction : false});

            }else{
                $('.tcNews').hide();
            }
        },
        error: function(){
            $('.tcNews').hide();
        }
    });

	  //出租房源
	  $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=house&action=zuList&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="house-list">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="for-margin">');
                        newsList.push('<div class="house-img">');
                        newsList.push('<img src="'+list[i].litpic+'">');
                        newsList.push('</div>');
                        newsList.push('<div class="house-info ">');
                        newsList.push('<h3 class="house-detail ">'+list[i].title+'</h3>');
                        newsList.push('<p class=""><span class="house-spec">'+list[i].rentype+'  '+list[i].room+'  '+list[i].area+'平米</span>  <span class="house-price"><b>'+(list[i].price > 0 ? list[i].price + '</b>'+echoCurrency('short')+'/月' : '<b>面议')+'</b></span></p>');
                        newsList.push('<p class="house-distance pub-list-style ">'+list[i].community+'</p>');
                        newsList.push('</div>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.house-list-box ul').html(newsList.join(''));
                }else{
                    $('.house-list-box ul').html('<li class="loading">暂无数据！</li>');

                }
            },
            error: function(){
                $('.house-list-box ul').html('<li class="loading">加载失败！</li>');
            }
        });


     //同城分类信息

    if($('.info-list-box').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=info&action=ilist&pageSize=6',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;
                    for (var i = 0; i < list.length; i++){
                        newsList.push('<li class="info-list">');
                        newsList.push('<a href="'+list[i].url+'">');
                        newsList.push('<div class="for-margin">');
						if(list[i].litpic){
	                        newsList.push('<div class="info-img">');
	                        newsList.push('<img src="'+huoniao.changeFileSize(list[i].litpic, 'small')+'">');
	                        newsList.push('</div>');
						}
                        newsList.push('<div class="info-detail-box">');
                        newsList.push('<h3 class="info-detail">'+list[i].title+'</h3>');

//                      newsList.push('<h4>'+list[i].title+'</h4>');
                        var price = '';
                        if(list[i].price_switch == 0){
                            if(list[i].price != 0){
                                price = '￥'+'<span>' + list[i].price + '</span>';
                            }else{
                                price = '<span>价格面议</span>';
                            }
                        }
						if(price){
	                        newsList.push('<p class="info-price">'+price+'</p>');
						}
                        newsList.push('<p class="pub-list-style info-area"><span>'+list[i].address+'</span>&nbsp;<span>'+list[i].pubdate1+'</span></p>');
                        newsList.push('</div>');
                        newsList.push('</div>');
                        newsList.push('</a>');
                        newsList.push('</li>');
                    }
                    $('.info-list-box ul').html(newsList.join(''));


                }else{
                    $('.info-list-box ul').html('<li class="loading">暂无数据！</li>');

                }
            },
            error: function(){
                $('.info-list-box ul').html('<li class="loading">加载失败！</li>');
            }
        });
    }


    //企业招聘
    if($('.job-list-box').size() > 0){
        $.ajax({
            type: "POST",
            url: "/include/ajax.php",
            dataType: "json",
            data: 'service=job&action=post&pageSize=5',
            success: function (data) {
                if(data && data.state == 100){
                    var newsList = [], list = data.info.list;

                    for (var i = 0; i < list.length; i++){
                        var price= list[i].salary ;
//                  		console.log(list[i]);
//                  		console.log(list[i].salary);
                    	if(list[i].isbid == 1){
                    			newsList.push('<li class="top-list">');
                    			newsList.push('<div class="job-top">');
                    			newsList.push('<a class="go_job" href="'+list[i].url+'">');
                    			newsList.push('<div class="for-margin"><i></i>');
                    			newsList.push('<div class="job-name"><span>'+list[i].title+'</span>');
                    			if(list[i].is_delivery==1){
                    				newsList.push('<label>已投递</label></div>');
                    			}else{
                    				newsList.push('</div>');
                    			}
                    			if(price != '面议'){

                    				newsList.push('<p class="job-need">'+list[i].addr[0]+' '+list[i].educational+' '+list[i].experience+'<b class="price-area">'+price+'元</b> </p>');
                    			}else{

                    				newsList.push('<p class="job-need">'+list[i].addr[0]+' '+list[i].educational+' '+list[i].experience+'<b class="price-area">面议</b> </p>');
                    			}

                    			newsList.push('<p class="job-label"><b class="news-state">'+list[i].timeUpdate+'</b></p>')
                    		}else{
                    			newsList.push('<li class="job-list">');
                    			newsList.push('<div class="job">');
                    			newsList.push('<a class="go_job" href="'+list[i].url+'">');
                    			newsList.push('<div class="for-margin">');
                    			newsList.push('<div class="job-name"><span>'+list[i].title+'</span>');
                    			if(list[i].is_delivery==1){
                    				newsList.push('<label>已投递</label>');
                    			}
                    			if(price != '面议'){
                    				newsList.push('<b class="price-area">'+ list[i].salary +'元</b> </div>');
                    			}else{
                    				newsList.push('<b class="price-area">面议</b> </div>');
                    			}
                    			newsList.push('<p class="job-need">'+list[i].addr[list[i].addr.length-1]+' '+list[i].educational+' '+list[i].experience+'<b class="news-state">'+list[i].timeUpdate+'</b></p>');
//
                    		}
                    		newsList.push('</div>');
                    		newsList.push('</a>');
//                  		newsList.push('</div>');

                            if(list[i].company) {
                                newsList.push('<div class="enterise-info">');
                                newsList.push('<a href="' + list[i].companyUrl + '" class="go_enterise">');
                                newsList.push('<div class="for-margin">');
                                newsList.push('<div class="enterise-logo"><img src="' + list[i].company.logo + '"></div>');
                                newsList.push('<div class="enterise-info-detail"><h3>' + list[i].company.title + '</h3>');
                                newsList.push('<p>' + list[i].company.scale + '|' + list[i].company.nature + '|' + (list[i].company.industry ? list[i].company.industry[list[i].company.industry.length-1] : '') + '</p>');
                                newsList.push('<s></s></div>');
                                newsList.push('</div>');
                                newsList.push('</a>');
                                newsList.push('</div>');
                            }
                    		newsList.push('</div>');
                        newsList.push('</li>');
                    }
                    $('.job-list-box ul').html(newsList.join(''));

                }else{
                    $('.job-list-box ul').html('<li class="loading">暂无数据！</li>');

                }
            },
            error: function(){
                $('.job-list-box').html('<li class="loading">加载失败！</li>');
            }

        });
    }




     // 获取推荐商家
    var lng = lat = 0;
    var page = 1, isload = false;
    function getList(){
        isload = true;
        var pageSize = 4;
        $.ajax({
            url: masterDomain+'/include/ajax.php?service=business&action=blist&store=2&page='+page+'&pageSize='+pageSize+'&lng='+lng+'&lat='+lat,
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                    var html = [];
                    for(var i = 0; i < data.info.list.length; i++){
                        var d = data.info.list[i];
                        html.push('<li class="business-list">');
                        html.push(' <a href="'+d.url+'">');
                        html.push('  <div class="for-margin">');
                        html.push('  <div class="business-img"><div class="label-business">');
                        if(d.face_qj == "1"){
                            html.push('    <span class="all-area">全景</span>');
                        }
                        if(d.face_video == "1"){
                            html.push('    <span class="business-video">视频</span>');
                        }

                        html.push('</div>');
                        html.push('<img src="'+(d.logo ? d.logo : (templets + 'images/fShop.png'))+'" alt="">');
                        html.push('  </div>');
                        html.push('  <div class="buiness-detail-box">');
                        html.push('    <h3 class="buiness-detail">'+(d.top == "1" ? '<i></i>' : '')+'<span>'+d.title+'</span> '+(d.type == "2" ? '<s></s>' : '')+'&nbsp;<h3>');
                        html.push('    <p class="business-service">');
                        if(d.typename.length>2){
                        	html.push('				<span class="label label-k">'+d.typename[0]+'<span><span class="label label-o">'+d.typename[1]+'<span><span class="label label-c">'+d.typename[2]+'<span>')

                        }else{
                        	html.push('				<span class="label label-k">'+d.typename[0]+'</span><span class="label label-o">'+d.typename[1]+'</span>')

                        }
                        html.push('    </p>')
                        html.push('    <p class="business-area">'+d.address+'</span></p>');
                        html.push('</div>');
                        html.push('<span class="business-distance"></span>');
                        html.push('  </div>');
                        html.push('  </a>');
                        if(d.tel != ""){
                            html.push('    <a href="tel:'+d.tel+'" class="callme">');
//                          html.push('      <img src="'+templets+'images/hPhone.png" alt="">');
                            html.push('    </a>');
                        }

                        html.push('</li>');
                    }

                    if(page == 1){
                        $('.business-list-box ul').html(html.join(''));
                    }else{
                        $('.business-list-box ul').append(html.join(''));
                    }

                    if(data.info.pageInfo.totalPage <= page){
                        $('.business-list-box .shop-more a').text('已加载全部数据').addClass('disabled');
                    }else{
                        isload = false;
                    }

                }else{
                    $('.business-list-box .shop-more a').text('暂无相关信息');
                    $('.business-list-box .loading').text('暂无数据！');
                }
            },
            error: function(){
                if(page == 1){
                    $('.business-list-box .loading').text('网络错误，请重试');
                }
                $('.business-list-box .shop-more a').text('网络错误，请重试');
                page = page > 1 ? page - 1 : 1;
            }
        })
    }
    function checkLocal(){
        var local = false;
        var localData = utils.getStorage("user_local");
        if(localData){
            var time = Date.parse(new Date());
            time_ = localData.time;
            // 缓存1小时
            if(time - time_ < 3600 * 1000){
                lat = localData.lat;
                lng = localData.lng;
                local = true;
            }

        }
//				getList();
        if(!local){
            HN_Location.init(function(data){
                if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
                    lng = lat = -1;
                    getList();
                }else{
                    lng = data.lng;
                    lat = data.lat;

                    var time = Date.parse(new Date());
                    utils.setStorage('user_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': data.address}));

                    getList();
                }
            })
        }else{
            getList();
        }

    }
     $('.shop-more a').click(function(){

        var t = $(this);
        if(isload || t.hasClass('disabled')) return;
        page++;
        getList();
    })

    getList();



//同城活动
$.ajax({
    url: '/include/ajax.php',
    type: 'get',
    dataType: 'json',
    data:'service=huodong&action=hlist&page=1&pageSize=4&keywords=&typeid=0',

    success: function(data){
        if(data && data.state == 100){
           var newsList = [], list = data.info.list;
           for(var i=0; i<list.length; i++){
           		newsList.push('<div class="activity swiper-slide">');
           		newsList.push('<a href="'+list[i].url+'">');
           		newsList.push('<div class="act-img" >');
           		newsList.push('<img src="'+list[i].litpic+'"/>')
           		newsList.push('<p>'+huoniao.transTimes(list[i].began,1)+'</p>');
           		newsList.push('</div>');
           		newsList.push('<div class="act-info">');
           		newsList.push('<div class="act-logo"><img src="'+list[i].userphoto+'"/></div>');

							newsList.push('<div class="act-detail">');
							newsList.push('<p class="act-name">'+list[i].title+'</p>');
           		newsList.push('<p class="act-in-num">已报名<i>'+list[i].reg+'</i>人</p>');
           		newsList.push('</div>');
           		if(list[i].mprice){
           			newsList.push('<div class="for-money">￥'+list[i].mprice+'</div>')
           		}else{
           			newsList.push('<div class="for-money" >免费</div>')
           		}
           		newsList.push('</div>');
           		newsList.push('</a>');
           		newsList.push('</div>');
//
           }
           newsList.push('<div class="activity-kong swiper-slide"></div>');
           $('.tc-activity').html(newsList.join(''));
           //同城活动滚动
				 var swiper = new Swiper('.tc-activity-box .swiper-container', {

			      slidesPerView: 2,
			      spaceBetween:0,
			      pagination: {
			        el: '.swiper-pagination',
			        clickable: true,
			      },
			    });
        }else{
           $('.tc-activity').html('<div class="loading">暂无数据！</div>');
//         $('.info-list-box  .look-more').remove();
          }
    },
    error: function(){
                $('.info-list-box ul').html('<div class="loading">加载失败！</div>');
            }

 })



//-------

	//切换城市、搜索跳转
	$('.head-search .areachose').bind('click', function(){
		if(device.indexOf('huoniao') > -1 ){
		  setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler('goToCity', {}, function(){});
		  });
		  e.preventDefault();
		}else{
			location.href = $(this).data('url');
		}
	});

	$('.head-search .search').bind('click', function(){
		location.href = $(this).data('url');
	});


	//扫一扫
	$(".search-scan").delegate(".scan", "click", function(){

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

			wx.scanQRCode({
				// 默认为0，扫描结果由微信处理，1则直接返回扫描结果
				needResult : 1,
				desc: '扫一扫',
				success : function(res) {
					if(res.resultStr){
						if(res.resultStr.indexOf('http') > -1){
							if(wx_miniprogram){
								wx.miniProgram.navigateTo({url: '/pages/redirect/index?url=' + encodeURIComponent(res.resultStr)});
							}else{
								location.href = res.resultStr;
							}
						}else if(res.resultStr.indexOf('EAN_13,') > -1){
							var resultStr = res.resultStr.split('EAN_13,');
							if(wx_miniprogram){
								wx.miniProgram.navigateTo({url: '/pages/redirect/index?url=' + encodeURIComponent(masterDomain + '/include/ajax.php?service=shop&action=barcodeSearch&type=redirect&code=' + resultStr[1])});
							}else{
								location.href = '/include/ajax.php?service=shop&action=barcodeSearch&type=redirect&code=' + resultStr[1];
							}
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



	//验证当前访问页面是否为当前城市
	// var changAutoCity = $.cookie("HN_changAutoCity");
	var siteCityInfo = $.cookie("HN_siteCityInfo");
    var changeAutoCity;
	if(siteCityInfo){
		HN_Location.init(function(data){
	    if (data != undefined && data.province != "" && data.city != "" && data.district != "" && !changeAutoCity) {
	      var province = data.province, city = data.city, district = data.district;
				$.ajax({
			    url: "/include/ajax.php?service=siteConfig&action=verifyCity&region="+province+"&city="+city+"&district="+district,
			    type: "POST",
			    dataType: "json",
			    success: function(data){
			      if(data && data.state == 100){
					var siteCityInfo_ = JSON.parse(siteCityInfo);
					var nowCityInfo = data.info;
					if(siteCityInfo_.cityid != nowCityInfo.cityid){
						// $.cookie("HN_changAutoCity", '1', {expires: 1, path: '/'});

						changeAutoCity = $.dialog({
                          width: 250,
                          buttons: {
                            "取消": function() {
                              this.close();
                            },
                            "确定": function() {

							  var channelDomainClean = typeof masterDomain != 'undefined' ? masterDomain.replace("http://", "").replace("https://", "") : window.location.host;
                              var channelDomain_1 = channelDomainClean.split('.');
                              var channelDomain_1_ = channelDomainClean.replace(channelDomain_1[0]+".", "");

                              channelDomain_ = channelDomainClean.split("/")[0];
                              channelDomain_1_ = channelDomain_1_.split("/")[0];

                              $.cookie(cookiePre + 'siteCityInfo', JSON.stringify(nowCityInfo), {expires: 7, domain: channelDomainClean, path: '/'});
                              $.cookie(cookiePre + 'siteCityInfo', JSON.stringify(nowCityInfo), {expires: 7, domain: channelDomain_1_, path: '/'});

                              location.href = nowCityInfo.url + '?currentPageOpen=1' + (device.indexOf('huoniao') > -1 ? '&appIndex=1' : '');
                            }
                          },
                          content: '<div style="text-align: center"> 检测到你目前的城市为<div style="font-size: .5rem; color: #ff6600; padding: .1rem 0;"><strong>' + nowCityInfo.name + '</strong></div>是否切换 </div>'
                        }).open();

					}
			      }
			    }
			  })
	    }
	  })
	}

});
