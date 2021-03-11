/**
  * 会员中心新闻投稿列表
  * by guozi at: 20150627
  */


 var uploadErrorInfo = [],
 	huoniao = {

 		//转换PHP时间戳
 		transTimes: function(timestamp, n) {
 				update = new Date(timestamp * 1000); //时间戳要乘1000
 				year = update.getFullYear();
 				month = (update.getMonth() + 1 < 10) ? ('0' + (update.getMonth() + 1)) : (update.getMonth() + 1);
 				day = (update.getDate() < 10) ? ('0' + update.getDate()) : (update.getDate());
 				hour = (update.getHours() < 10) ? ('0' + update.getHours()) : (update.getHours());
 				minute = (update.getMinutes() < 10) ? ('0' + update.getMinutes()) : (update.getMinutes());
 				second = (update.getSeconds() < 10) ? ('0' + update.getSeconds()) : (update.getSeconds());
 				if (n == 1) {
 					return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
 				} else if (n == 2) {
 					return (year + '-' + month + '-' + day);
 				} else if (n == 3) {
 					return (month + '-' + day);
 				} else {
 					return 0;
 				}
 			}

 			//将普通时间格式转成UNIX时间戳
 			
 		,transToTimes: function(timestamp) {
 				var new_str = timestamp.replace(/:/g, '-');
 				new_str = new_str.replace(/ /g, '-');
 				var arr = new_str.split("-");
 				var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
 				return datum.getTime() / 1000;
 			}


 			//判断登录成功
 			
 		,checkLogin: function(fun) {
 				//异步获取用户信息
 				$.ajax({
 					url: masterDomain + '/getUserInfo.html',
 					type: "GET",
 					async: false,
 					dataType: "jsonp",
 					success: function(data) {
 						if (data) {
 							fun();
 						}
 					},
 					error: function() {
 						return false;
 					}
 				});
 			}



 			//获取附件不同尺寸
 			,
 		changeFileSize: function(url, to, from) {
 				if (url == "" || url == undefined) return "";
 				if (to == "") return url;
 				var from = (from == "" || from == undefined) ? "large" : from;
 				if (hideFileUrl == 1) {
 					return url + "&type=" + to;
 				} else {
 					return url.replace(from, to);
 				}
 			}

 			//获取字符串长度
 			//获得字符串实际长度，中文2，英文1
 			
 		,getStrLength: function(str) {
 				var realLength = 0,
 					len = str.length,
 					charCode = -1;
 				for (var i = 0; i < len; i++) {
 					charCode = str.charCodeAt(i);
 					if (charCode >= 0 && charCode <= 128) realLength += 1;
 					else realLength += 2;
 				}
 				return realLength;
 			}



 			//删除已上传的图片
 			
 		,delAtlasImg: function(mod, obj, path, listSection, delBtn) {
 				var g = {
 					mod: mod,
 					type: "delAtlas",
 					picpath: path,
 					randoms: Math.random()
 				};
 				$.ajax({
 					type: "POST",
 					cache: false,
 					async: false,
 					url: "/include/upload.inc.php",
 					dataType: "json",
 					data: $.param(g),
 					success: function() {}
 				});
 				$("#" + obj).remove();

 				if ($("#" + listSection).find("li").length < 1) {
 					$("#" + listSection).hide();
 					$("#" + delBtn).hide();
 				}
 			}

 			//异步操作
 			
 		,operaJson: function(url, action, callback) {
 			$.ajax({
 				url: url,
 				data: action,
 				type: "POST",
 				dataType: "json",
 				success: function(data) {
 					typeof callback == "function" && callback(data);
 				},
 				error: function() {

 					$.post("../login.php", "action=checkLogin", function(data) {
 						if (data == "0") {
 							huoniao.showTip("error", langData['siteConfig'][20][262]);
 							setTimeout(function() {
 								location.reload();
 							}, 500);
 						} else {
 							huoniao.showTip("error", langData['siteConfig'][20][183]);
 						}
 					});

 				}
 			});
 		}
 	}


 var objId = $("#list ul");
 var keywords = "";
 $(function() {


 	//导航
 	$('.header-r .screen').click(function() {
 		var nav = $('.nav'),
 			t = $('.nav').css('display') == "none";
 		if (t) {
 			nav.show();
 		} else {
 			nav.hide();
 		}
 	})


 	//项目
 	$(".tab .type").bind("click", function() {
 		var t = $(this),
 			id = t.attr("data-id"),
 			index = t.index();
 		if (!t.hasClass("curr") && !t.hasClass("sel")) {
 			state = id;
 			atpage = 1;
 			$('.count li').eq(index).show().siblings("li").hide();
 			t.addClass("curr").siblings("li").removeClass("curr");
 			$('#list').html('');
 			getList(1);
 		}
 	});


 	// 下拉加载
 	$(window).scroll(function() {
 		var h = $('.item').height();
 		var allh = $('body').height();
 		var w = $(window).height();
 		var scroll = allh - w - h;
 		if ($(window).scrollTop() > scroll && !isload) {
 			atpage++;
 			getList();
 		};
 	});
	// 搜索提交
	$('.searchbox').submit(function(e) {
		e.preventDefault();
		keywords = $.trim($('#keywords').val());
		isload = false, atpage = 1;
		getList(1)
		
	});
	// 取消搜索
	$(".search_cancel").click(function(){
		if(keywords!=''){
			$('#keywords').val('')
			keywords = '';
			isload = false, atpage = 1;
			getList(1)
		}
		$(".top_box .tab_box").removeClass("fn-hide");
		$(".search_box").addClass("fn-hide");
	})

 	getList(1);
 	var M = {};
 	// 删除
 	objId.delegate(".del_btn", "click", function() {
 		var t = $(this),
 			par = t.closest(".cmt_li"),
 			id = par.attr("data-id");
 		if (id) {
 			M.dialog = jqueryAlert({
 				'title': '',
 				'content': langData['siteConfig'][44][98], //确定要删除吗?
 				'modal': true,
 				'buttons': {
 					'是': function() {
 						M.dialog.close();
 						t.siblings("a").hide();
 						t.addClass("load");
 						$.ajax({
 							url: "/include/ajax.php?service=live&action=delChatRoomComment&aid="+chatid+"&cid="+id,
 							type: "GET",
 							dataType: "json",
 							success: function(data) {
 								if (data && data.state == 100) {
 									//删除成功后移除信息层并异步获取最新列表
									
 								} else {
 									alert(data.info);
 									// t.siblings("a").show();
 									// t.removeClass("load");
 								}
								getList(1);
 							},
 							error: function() {
 								alert(langData['siteConfig'][20][183]);
 								t.siblings("a").show();
 								t.removeClass("load");
 							}
 						});
 					},
 					'否': function() {
 						M.dialog.close();
 					}
 				}
 			})
 		}
 	});

 	// 头部搜索
 	
 	var selectDate = function(el) {
 		WdatePicker({
 			el: el,
 			isShowClear: false,
 			isShowOK: false,
 			isShowToday: false,
 			qsEnabled: false,
 			dateFmt: 'yyyy-MM',
 			maxDate: $('#month').val(),
 			onpicked: function() {
 				getArticleTotal();
 			}
 		});
 	}
 	$("#month").click(function() {
 		selectDate("month");
 	})

 	$('#reload').click(function() {
 		getList(1);
 	});
	
	
	// 滚动加载
	$(window).scroll(function(){
		
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - 20;
		if ($(window).scrollTop() > scroll && !isload) {
			
			getList();
		};
	})


 	function getList(is) {

 		isload = true;


 		if (is != 1) {
 			// 	$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
 		} else {
 			objId.html('');
 			atpage = 1;
 		}
 		objId.find('.loading').remove();
 		objId.append('<p class="loading">' + langData['siteConfig'][20][184] + '...</p>');
 		$.ajax({
 			url: "/include/ajax.php?service=live&action=chatRoomComment&aid=" + chatid + "&page=" + atpage + "&pageSize=" + pageSize + "&keywords=" + keywords,
				
 			type: "GET",
 			dataType: "json",
 			success: function(data) {
 				if (data && data.state != 200) {
 					if (data.state == 101) {
 						objId.html("<p class='loading'>" + langData['siteConfig'][20][126] + "</p>");
 						$('.count span').text(0);
 					} else {
						$(".all_cmt em").text(data.info.pageInfo.totalCount)
 						var list = data.info.list,
 							pageInfo = data.info.pageInfo,
 							html = [];

 						//拼接列表
 						if (list.length > 0) {

 							var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";

 							for (var i = 0; i < list.length; i++) {
 								var item = [],
 									id = list[i].info.id,
									userid = list[i].info.uid,
 									username = list[i].info.userinfo.username,
 									userphoto = list[i].info.userinfo.photo,
 									content = list[i].info.content,
 									ftime = huoniao.transTimes(list[i].info.time,1),
 									title = '';

 							
								html.push('<li class="cmt_li"  data-id="' + id + '">');
								html.push('<div class="user_info fn-clear">');
								html.push('<a class="uimg" href="'+masterDomain+'/user/'+userid+'"><img src="'+userphoto+'" onerror="this.src=\'/static/images/noPhoto_40.jpg\'"></a>');
								html.push('<div class="uinfo"><h4 class="unick">'+username+'</h4><p>'+ftime+'</p></div></div>');
								if(list[i].type == 'text'){
									html.push('<div class="cmt_con">'+content+'</div>');
								}else if(list[i].type == 'image'){
									html.push('<div class="cmt_con"><img src="/include/attachment.php?f='+list[i].info.content.url+'"></div>');
								}
								
								html.push('<button type="button" class="del_btn"></button></li>');

 							}

 							objId.append(html.join(""));
							
 							$('.loading').remove();
 							isload = false;
							atpage++;
							if(atpage > pageInfo.totalPage){
								atpage = true;
							}
 						} else {
 							$('.loading').remove();
 							objId.append("<p class='loading'>" + langData['siteConfig'][20][185] + "</p>");
 						}

 						
 					}
 				} else {
 					objId.html("<p class='loading'>" + langData['siteConfig'][20][126] + "</p>");
 					$('.count span').text(0);
 				}
 			}
 		});
 	}


	// 出现搜索框
		$(".search_btn").click(function(){
			var t =$(this);
			t.closest('.tab_box').addClass("fn-hide");
			$(".search_box").removeClass("fn-hide");
			$(".search_box #keywords").focus();
		});
	
		$(".search_cancel").click(function(){
			$(".top_box .tab_box").removeClass("fn-hide");
			$(".search_box").addClass("fn-hide");
		})
		
		$(".search_clear").click(function(){
			$("#keywords").val('');
			$(".searchbox i.search_clear").hide();
		});
		
		$("#keywords").on("input",function(){
			if($(this).val()){
				$(".searchbox i.search_clear").show();
			}else{
				$(".searchbox i.search_clear").hide();
			}
		});
 })
