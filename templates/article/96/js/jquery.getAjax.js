
; (function ($) {
	$.fn.getAjax = function (options) {
		var timer = null; //定时器
		var setTime = true; //控制事件触发
		var defaults = {
			page: 1,
			pageSize: 3
		}
		var settings = $.extend({}, defaults, options);
		var container = $(settings.container)
		var page = settings.page;
		var flag = false;
		function getDatas(settings, page) {
			var time = new Date().getTime();
			flag = true;

			var url = '';
			if (settings.typeid) {
				url = masterDomain+'/include/ajax.php?service=article&action=alist&typeid=' + settings.typeid + '&group_img=1&page=' + page + '&pageSize=' + settings.pageSize + ''
			} else if (settings.title) {
				url = masterDomain+'/include/ajax.php?service=article&action=alist&group_img=1&page=' + page + '&pageSize=' + settings.pageSize + '&title=' + settings.title + ''
			} else {
				url = masterDomain+'/include/ajax.php?service=article&action=alist&group_img=1&page=' + page + '&pageSize=' + settings.pageSize + ''
			}
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'jsonp',
				
				success: function (respon) {
					if (respon.state == 100) {
						var datas = respon.info.list;

						var totalPage = respon.info.pageInfo.totalPage; //总页码
						for (var i = 0; i < datas.length; i++) {
							//判斷是一張圖片還是多張圖片

							if (datas[i].group_img) {

								var da = datas[i].pubdate;
								var tim = dateTimes(da)
								var url=datas[i].url+'#comment'
								var reg = /<strong>|<\/strong>/g;
								var title = datas[i].title.replace(reg, '');
								var imgs=datas[i].group_img;
								var img=''
								for(var l=0;l<imgs.length;l++){
									// var imgs='';
									// imgs +=`

									// 		<img src="${imgs[l].path}" alt="${title}"> 
									// `
								
									img +="<div class='anim_s'><img src='"+imgs[l].path+"' alt='"+title+"'> </div>"

									
								}
						
									list = `
									<li class="hdnews">
									<h5><a href="${datas[i].url}" target="_blank" title="${title}">${datas[i].title}</a></h5>
									<a class="news_pic " href="${datas[i].url}" target="_blank" id="news_pic">
											${img}
									</a>
									<div class="news_text">
									<p>
									<a href="${datas[i].url}" target="_blank"><label>${datas[i].typeName[0]}</label></a>
									<span><a href="${url}"  target="_blank"><em>${datas[i].common}</em>评论</a> ▪ <em>${tim}</em></span>
									</p>
									</div>
									</li>
									`
									

								
									$(container).append(list)
						
								
					
								flag = false;
							} else if (datas[i].litpic == '') {
								var da = datas[i].pubdate;
								var tim = dateTimes(da)
								var url=datas[i].url+'#comment'
								var reg = /<strong>|<\/strong>/g;
								var title = datas[i].title.replace(reg, '');
								list = `
										<li class="first_list hdnews ">

										<div class="news_text fl">
										<h5><a href="${datas[i].url}" title="${title}"  target="_blank">${datas[i].title}</a></h5>
										<p>
										<a href="${datas[i].url}" target="_blank"><label>${datas[i].source}</label></a>
										<span><a href="${url}"  target="_blank"><em>${datas[i].common}</em>评论</a> ▪ <em>${tim}</em></span>
										</p>
										</div>
										<div class="cl"></div>
										</li>

										`
								$(container).append(list)
								flag = false;
							} else {
								var da = datas[i].pubdate
								var tim = dateTimes(da)
								var url=datas[i].url+'#comment'
								var reg = /<strong>|<\/strong>/g;
								var title = datas[i].title.replace(reg, '');

								list = `
										<li class="first_list hdnews ">
										<a class="news_pic anim fl" href="${datas[i].url}" target="_blank"><img src="${datas[i].litpic}" alt="${title}"></a>
										<div class="news_text fl left">
										<h5><a href="${datas[i].url}" title="${title}"  target="_blank">${datas[i].title}</a></h5>
										<p>
										<a href="${datas[i].url}" target="_blank"><label>${datas[i].typeName[0]}</label></a>
										<span><a href="${url}"  target="_blank"><em>${datas[i].common}</em>评论</a> ▪ <em>${tim}</em></span>
										</p>
										</div>
										<div class="cl"></div>
										</li>
										`
								$(container).append(list)
								flag = false;

							}

						}
						flag = false;
					}
					if (page == totalPage) {
						$('.loa').text('没有更多数据');
						getDatas = null;
						flag = false;
						return;

					}

				},
				
				error: function () {
					$('.loa').text('数据加载失败，请刷新后重新尝试')
					flag = false;
				}
			})
		}
		getDatas(settings, page);
		$(window).scroll(function () {
			var height = document.documentElement.clientHeight || window.innerHeight;
			var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
			var elementHeight = null;

			var viewHeight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
			if ($(container).children().length >= 1) {
					elementHeight = $(container).children().last().offset().top;

			}
			if (elementHeight - scrollHeight < height && !flag) {

				page++;
				try {
					getDatas(settings, page);
				} catch (erro) {
					getDatas = null;
				}


			}
		});
		function dateTimes(times) {
			var d = new Date(times * 1000);
			var date = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + "-" + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
			var startTime = date;
			var currTime = new Date(); //当前时间  
			//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式  
			startTime = startTime.replace(/\-/g, "/");
			var sTime = new Date(startTime);
			var totalTime = currTime.getTime() - sTime.getTime();
			var days = parseInt(totalTime / parseInt(1000 * 60 * 60 * 24));
			totalTime = totalTime % parseInt(1000 * 60 * 60 * 24);
			var hours = parseInt(totalTime / parseInt(1000 * 60 * 60));
			totalTime = totalTime % parseInt(1000 * 60 * 60);
			var minutes = parseInt(totalTime / parseInt(1000 * 60));
			totalTime = totalTime % parseInt(1000 * 60);
			var seconds = parseInt(totalTime / parseInt(1000));
			var time = "";
			if (days >= 1) {
				time = days + "天";
				if (days > 3) {
					time = d;


					return time = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';

				}
			} else if (hours >= 1) {
				time = hours + "时";
			} else if (minutes >= 1) {
				time = minutes + "分"
			} else {
				time = seconds + "秒";
			}
			return time;

		}
	}
})(window.jQuery)