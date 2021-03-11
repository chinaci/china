$(function () {
	var isload = false,clearTime=0;
	// 倒计时
	function countDown(id){
		timer = setInterval(function(){
	        var end = $('.mnostart').find(id).attr("data-time")*1000;  //点击的结束抢购时间的毫秒数
	        var newTime = Date.parse(new Date());  //当前时间的毫秒数
	        var youtime = end - newTime; //还有多久时间结束的毫秒数
	        var seconds = youtime/1000;//秒
	        var minutes = Math.floor(seconds/60);//分
	        var hours = Math.floor(minutes/60);//小时
	        var days = Math.floor(hours/24);//天
	        var CDay= days ;
	        var CHour= hours % 24 ;
	        var CMinute= minutes % 60;
	        var CSecond= Math.floor(seconds%60);//"%"是取余运算，可以理解为60进一后取余数
	        var c=new Date();
	        var millseconds=c.getMilliseconds();
	        var Cmillseconds=Math.floor(millseconds %100);
	        if(CSecond<10){//如果秒数为单数，则前面补零
	          CSecond="0"+CSecond;
	        }
	        if(CMinute<10){ //如果分钟数为单数，则前面补零
	          CMinute="0"+CMinute;
	        }
	        if(CHour<10){//如果小时数为单数，则前面补零
	          CHour="0"+CHour;
	        }
	        if(CDay<10){//如果天数为单数，则前面补零
	          CDay="0"+CDay;
	        }
	        if(Cmillseconds<10) {//如果毫秒数为单数，则前面补零
	          Cmillseconds="0"+Cmillseconds;
	        }

	       	$(id).find("span.day").html(CDay);
	        $(id).find("span.hour").html(CHour);
	        $(id).find("span.minute").html(CMinute);
	        $(id).find("span.second").html(CSecond);

		}, 1000);
	}

	$(document).ready(function() {
		$(window).scroll(function() {
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - w;
			if ($(window).scrollTop() + 50 > scroll && !isload) {
				atpage++;
				getList();
			};
		});
	});

	$('.miaoshabox').delegate('.contbox', 'click', function(){
		var t = $(this), url = t.attr('data-url');
		setTimeout(function(){location.href = url;}, 200);
	});

	getList();
	function getList(tr){
		isload = true;
		if(tr){
   			$(".miaoshabox").html("");
   		}
   		$(".miaoshabox .loading").remove();
   		//请求数据
		var data = [];
		var now = Date.parse(new Date())/1000;  //当前时间的毫秒数
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);
   		$.ajax({
	      url: masterDomain+"/include/ajax.php?service=shop&action=slist&limited=5",
	      data: data.join("&"),
	      type: "GET",
	      dataType: "jsonp",
	      success: function (data) {
	        if(data.state == 100){
	        	$(".miaoshabox .loading").remove();
				var list = data.info.list, html = [],className='';
				for(var i = 0; i < list.length; i++){
					if(list[i].ketime < now){
						className = 'disabled';
					}else if(list[i].kstime > now){
						className = 'mnostart';
					}else{
						className = '';
					}
					html.push('<div data-url="'+list[i].url+'" class="contbox '+className+'">');
					html.push('<div class="bocover"></div>');
					html.push('<div class="ttopbox">');
					if(list[i].ketime < now){
						html.push('<div class="mfImg fn-clear"><img src="'+templets_skin+'images/mfend.png" alt=""></div>');
					}else if(list[i].kstime < now){
						html.push('<div class="mfImg fn-clear"><img src="'+templets_skin+'images/mfstart.png" alt=""></div>');
					}else if(list[i].kstime > now){
						html.push('<div id="jsTime'+list[i].kstime+'" class="jsTime fn-clear" data-time="'+list[i].kstime+'"><span class="day">0</span><em>:</em><span class="hour">0</span><em>:</em><span class="minute">0</span><em>:</em><span class="second">0</span></div>');
					}
					html.push('<a href="'+list[i].url+'" class="m_detail">查看详细 <s class="right"></s></a>');
					html.push('</div>');
					html.push('<div class="mainbox fn-clear">');
					html.push('<div class="l imgbox"><img src="'+list[i].litpic+'" alt=""></div>');
					html.push('<div class="r txtbox">');
					html.push('<div class="fibox">');
					html.push('<h3>'+list[i].title+'</h3>');
					html.push('<h4>'+list[i].storeTitle+'</h4>');
					//html.push('<h4>双潜望摄像头</h4>');
					html.push('<span class="xianl">限量 <em>'+list[i].inventory+'</em>件</span>');
					html.push('</div>');
					html.push('<p class="pprice"><span class="nprice"><em>'+echoCurrency('symbol')+'</em>'+list[i].price+'</span> <span class="yprice">'+echoCurrency('symbol')+' '+list[i].mprice+'</span></p>');
					html.push('</div>');
					html.push('</div>');
					html.push('</div>');
				}
				$(".miaoshabox").append(html.join(""));
				isload = false;
				//引入倒计时效果
				$('.jsTime').each(function() {
					var id = $(this).attr('id');
					countDown('#'+id);
				});
				//最后一页
				if(atpage >= data.info.pageInfo.totalPage){
					isload = true;
					$(".miaoshabox").append('<div class="loading">'+langData['siteConfig'][18][7]+'</div>');
				}
	        }else{
	        	isload = true;
				$(".miaoshabox").append('<div class="loading">暂无相关信息</div>');
	        }
	      },
		  error: function(){
		  	isload = false;
			$('.miaoshabox').html('<div class="loading">'+langData['siteConfig'][20][227]+'</div>');
		  }
	    });
	}

});