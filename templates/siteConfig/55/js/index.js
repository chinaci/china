$(function(){

	$("img").scrollLoading();

	// 全民调查百分比
	function setsurvey(){
		var supportvote = parseInt($('#supportNum').text()),
		againstvote = parseInt($('#againstNum').text());
		totalvote = supportvote + againstvote;
		$('.pro-support').width((supportvote/totalvote) * 100 + '%');
		$('.pro-against').width((againstvote/totalvote) * 100 + '%');
	}
	setsurvey();

	// 投票
	$('.survey .total a').click(function(){
		var a = $(this),type = a.hasClass('supportbtn') ? 1 : 0;
		var info = $('.survey .info');
		if(a.hasClass('disabled')) {
			var str = type ? '支持' : '反对';
			if(a.hasClass('beenopera')) {
				info.text('您已经“' + str + '”过了').show();
			} else {
				info.text('您已经发表了观点').show();
			}
			setTimeout(function(){
				info.hide();
			},1000)
		} else {
			$('.survey .total a').addClass('disabled');
			a.addClass('beenopera');
			info.show();
			var numobj = type ? $('#supportNum') : $('#againstNum');
			$add = $('<div class="surveynew">+1</div>');
			$('body').append($add);
			numobj.text(parseInt(numobj.text()) + 1);
			setsurvey();
			$add.css({'left':a.offset().left,'top':a.offset().top}).animate({'top':'-=20px'},500,function(){
				setTimeout(function(){
					$add.remove();
					info.hide().removeClass('flash').addClass('shake');
				},1500)
			})
		}
	})

	// 窗口尺寸调整时轮播重置
	var slideArr = ['.mainpicfocus','.videonews','.waimai','.furniture','.home','.photocompany','.members','.carnews','.slideBox2'],slideClone = [];
	function picSlide(type){
		for(var i=0;i < slideArr.length;i++){
			var obj = $(slideArr[i]),slideul = obj.find('.slide');
			if(type == '1') {
				slideClone[i] = slideul.clone();
			}
			if(type == '2') {
				var p = slideul.closest('.slidewrap');
				p.html(slideClone[i].clone());
			}
		}
		// 焦点图
		$(".slideBox1").slide({titCell:".hd ul",mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>"});

		// 视频新闻 图片滚动
		$(".videonews").slide({titCell:".mhd ul",mainCell:".mbd .slide",autoPage:"<li></li>",effect:"leftLoop",autoPlay:true,vis:3,scroll:3,trigger:"mouseover",delayTime:800,interTime:3000});
		// 最新外卖商家
		$(".waimai").slide({titCell:".ihd ul",mainCell:".ibd .slide",autoPage:"<li></li>",switchLoad:"_src",effect:"leftLoop",autoPlay:true,trigger:"mouseover",delayTime:500,interTime:3000});

		// 装修设计 公司
		$(".slideBox2").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true,switchLoad:"_src",startFun:function(i,c,s){
			var li = s.find('.bd li').eq(i),
				h = s.find('.bd li').eq(i).find('h3');
			if(h.children('span').length == 0) {
				h.append('<span><em>' + (++i) + '</em>/' + c + '</span>')
			}
			li.addClass('on').siblings().removeClass('on');
		}});

		/* 建材 内层图片滚动切换 */
		var on = $('.inBox2 .inHd li.on').index();
		$(".slideBox3").slide({titCell:".hd ul",mainCell:".bd ul",vis:3,scroll:3,autoPlay:true,switchLoad:"_src",autoPage:"<li></li>",effect:"leftLoop"});

		$(".inBox2").slide({ titCell:".inHd li",mainCell:".inBd .slide"});

		// 家居商城
		$(".slideBox5").slide({titCell:".hd ul",mainCell:".bd ul",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",vis:3,scroll:3,delayTime:500,interTime:3000});

		// 摄影公司
		$(".slideBox6").slide({titCell:".shd ul",mainCell:".slide ul",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>",switchLoad:"_src",vis:1,scroll:1,delayTime:500,interTime:3000});

		// 交友推荐会员
		$(".members").slide({titCell:".shd ul",mainCell:".sbd .slide ul",autoPage:"<li></li>",effect:"leftLoop",autoPlay:true,vis:3,scroll:3,switchLoad:"_src",trigger:"mouseover",delayTime:500,interTime:2000});

		// 汽车资讯
		$(".carnews").slide({mainCell:".sbd .slide",effect:"leftLoop",startFun:function(){
			$('.changegroup i').addClass('changeing');
		},endFun:function(){
			$('.changegroup i').removeClass('changeing');
		}});
	}

	picSlide('1');

	// 建材品牌商家
	$(".slideBox4").slide({mainCell:".bd .slidewrap",effect:"leftLoop",autoPlay:true,delayTime:500,switchLoad:"_src",interTime:3000});

	// 信息 tab切换
	// $(".inBox").slide({ titCell:".inHd li",mainCell:".inBd"});


	//倒计时（开始时间、结束时间、显示容器）
	var countDown = function(stime, etime, obj, func){
		sys_second = etime - stime;
		var i = 9,mtimer,stop = false,first = true;
		setTimeout(function(){
			mtimer = setInterval(function(){
				i = i < 0 ? 9 : i;
				$(obj).find(".ms").text(i);
				i--;
				if(stop && i == -1) {
					clearInterval(mtimer);
				}
			}, 100);
		},1000)

		var timer = setInterval(function(){
			if (sys_second > 0) {
				first = false;
				sys_second -= 1;
				var hour = Math.floor((sys_second / 3600) % 24);
				var minute = Math.floor((sys_second / 60) % 60);
				var second = Math.floor(sys_second % 60);
				$(obj).find(".h1").text(parseInt(hour/10));
				$(obj).find(".h2").text(hour%10);
				$(obj).find(".m1").text(parseInt(minute/10));
				$(obj).find(".m2").text(minute%10);
				$(obj).find(".s1").text(parseInt(second/10));
				$(obj).find(".s2").text(second%10);
			} else {
				clearInterval(timer);
				if(first) {
					clearInterval(mtimer);
				}
				stop = true;
				typeof func === 'function' ? func() : "";
			}
		}, 1000);
	}

	function getTime(){
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=system&action=getSysTime",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					var now = huoniao.transTimes(data.now, 1);
					now = now.split(" ")[1];
					var hour = now.split(":")[0], index = hour - 9;

					// if(index >= 13 || index < 0){
					// 	data.nextHour = data.nextDay + 28800;
					// }
					//
					// if(index < 0){
					// 	data.nextHour = data.today + 28800;
					// }

					var now = data.now, nextHour = data.nextHour;

					//获取团购数据
					$.ajax({
						url: masterDomain+"/include/ajax.php?service=tuan&action=tlist&hourly=1&time="+nextHour+"&pageSize=1",
						type: "GET",
						dataType: "jsonp",
						success: function (data) {
							if(data && data.state == 100 && data.info.list.length > 0){
								var list = data.info.list, html = [];
								for(var i = 0; i < list.length; i++){

									var flag = list[i].flag, yuyue = '';
									if(flag.indexOf("yuyue") > -1){
										yuyue = '<i class="iicon"></i>';
									}
									html.push('<div class="price animated swing animatloop"><p class="p1">团购价</p><p class="p2"><em>'+echoCurrency('symbol')+'</em><font>'+list[i].price+'</font>'+echoCurrency('short')+'</p></div>');
									html.push('<a href="'+list[i].url+'" target="_blank" title="'+list[i].title+'">'+yuyue+'<img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" alt=""><div class="txt"><p class="title">'+list[i].title+'</p><p class="des">'+list[i].subtitle+'</p></div><div class="bg"></div></a>');

									//html.push('<li><a href="'+list[i].url+'" target="_blank"><img src="'+huoniao.changeFileSize(list[i].litpic, "middle")+'" /><h4>'+list[i].title+'</h4><div class="price"><span><i>超值价&nbsp;&yen;</i>'+list[i].price+'</span><span class="sum_g">'+list[i].sale+'<em>人已抢</em></span></div></a></li>');
								}
								$(".module.tuan .miaobox .pic").html(html.join(""));

								//引入倒计时效果
								countDown(now, nextHour, '#countDown', function(){
									getTime();
								});

							}else{
								$(".module.tuan .miaobox .pic").html("<div class='empty'>暂无此时间段的团购信息！</div>");
							}
						}
					});


				}
			},
			error: function(){
				// console.log('error');
			}
		})
	}
	getTime();

	// 团购价格牌
	$('.miaobox').hover(function(){
		$(this).find('.price').removeClass('animated');
	},function(){
		$(this).find('.price').addClass('animated');
	})

	// 打折 显示方式切换
	// $('#discountList li').mouseover(function(){
	// 	var a = $(this),l = a.find('.show1').html(),src = a.children('a').attr('src');
	// 	a.addClass('hover').siblings().removeClass('hover');
	// 	$('#discountTitle').html('<a href="' + src + '">' + l + '</a>');
	// }).eq(0).addClass('hover')
	//


	// 装修登记表单

	//区域
	$("#addrlist").delegate("select", "change", function(){
		var sel = $(this), id = sel.val(), index = sel.index();
		if(id == 0){
			sel.nextAll("select").remove();
		} else if(id != 0 && id != "" && index < 1){
			$.ajax({
				type: "GET",
				url: masterDomain + "/include/ajax.php",
				data: "service=siteConfig&action=addr&son=0&type="+id,
				dataType: "jsonp",
				success: function(data){
					var i = 0, opt = [];
					if(data instanceof Object && data.state == 100){
						for(var key in data.info){
							opt.push('<option value="'+data.info[key]['id']+'">'+data.info[key]['typename']+'</option>');
						}
						sel.nextAll("select").remove();
						$("#addrlist").append('<select name="addrid[]"><option value="0">请选择</option>'+opt.join("")+'</select>');
					}else{

					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}
	});

	var djObj = $('.registration'),info = djObj.find('.info');
	djObj.find('.name').focus(function(){
		validation.name();
	}).blur(function(){
		validation.name(1);
	})

	djObj.find('.phone').focus(function(){
		validation.phone();
	}).blur(function(){
		validation.phone(1);
	})

	$(document).on('change','#addrlist select',function(){
		validation.addr();
	})

	var validation = {
		name : function(type){
			var o = djObj.find('.name'),v = o.val(),t = o.closest('.row');
			t.removeClass('error');
			if(v == '') {
				djObj.find('.info').text('填写您的称呼');
				if(type) {
					t.addClass('error');
				}
				return false;
			} else {
				djObj.find('.info').text('');
				return true;
			}
		},
		phone : function(type){
			var a = this ,o = djObj.find('.phone'),v = o.val(),t = o.closest('.row');
			t.removeClass('error');
			if(v == '') {
				djObj.find('.info').text('填写您的电话');
				if(type) {
					t.addClass('error');
				}
				return false;
			} else {
				var telReg = !!v.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if(!telReg && ! /^((0\d{2,3})[-_－—]?)(\d{7,8})([-_－—]?(\d{3,}))?$/.test(v)){
					djObj.find('.info').text('电话格式有误').attr('data-err','phone');
					t.addClass('error');
					return false;
				} else {
					djObj.find('.info').text('');
					return true;
				}
			}
		},
		addr : function(){
			var s = $('#addrlist select'),
				a = s.last();
			s.removeClass('error');
			if(a.val() == '0') {
				djObj.find('.info').text('填写您的地址');
				a.addClass('error');
				return false;
			} else {
				djObj.find('.info').text('');
				return true;
			}
		}
	}

	$('.registration form').submit(function(e){
		if(validation.name(1) && validation.phone(1) && validation.addr()) {

		} else {
			e.preventDefault();
			$(this).find('.error').eq(0).children('input').focus();
		}
	})

	// 爱情搜索
	function returnAges(min,max,sel){
		var s = '<option value="0">不限</option>';
		for(var i = min;i <= max;i++){
			var select = i == sel ? ' selected="selected"' : '';
			s += '<option value="' + i + '"' + select + '>' + i + '岁</option>';
		}
		return s;
	}
	var ages = returnAges(18,99);
	$('#agemin,#agemax').html(ages);
	$('#agemin').change(function(){
		var a = $(this),v = parseInt(a.val()),s = a.data('start');
		var a2 = $('#agemax'),v2 = parseInt(a2.val());
		var a2sel = s && parseInt(s) >= v2 ? 0 : v2;
		$('#agemax').html(returnAges(v,99,a2sel));
		a.data('start',a.val());
	});
	// 勾选有照片
	$('.havephoto input').change(function(){
		var a = $(this),t = a.parent('.havephoto');
		if(a.is(':checked')){
			t.addClass('checked');
		} else {
			t.removeClass('checked');
		}
	})

	// 汽车焦点图
	$(".slideBox8").slide({titCell:".hd ul",mainCell:".bd .slideObj",effect:"left",autoPlay:true,delayTime:500,endFun:function(i,c,s){
		s.find('.pages').html(++i + '/' + c);
	}});


	//页面自适应设
	$(window).resize(function(){
		var screenwidth = window.innerWidth || document.body.clientWidth;
		var criticalPoint = criticalPoint != undefined ? criticalPoint : 1240;
		var criticalClass = criticalClass != undefined ? criticalClass : "w1200";
		var isHaveBig = $("html").hasClass(criticalClass),now;
		if(screenwidth < criticalPoint){
			$("html").removeClass(criticalClass);
			now = false;
		}else{
			$("html").addClass(criticalClass);
			now = true;
		}
		if(isHaveBig && !now || !isHaveBig && now) {
			$(window).trigger('winSizeChange' , now);
		}
	});

	$(window).on('winSizeChange',function(obj,now){
		picSlide('2');
	})

})
