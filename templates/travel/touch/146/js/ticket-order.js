$(function(){
	//入住时间显示
	var curDate = new Date();
	var html =[];
	//var preDate = new Date(curDate.getTime() +24*60*60*1000*i); //后一天
	var nowdate = new Date();
	var month = nowdate.getMonth();
	var year = nowdate.getFullYear();
	var countDay = new Date(year,month+1,0).getDate();
	nextMonth = month + 2;
	if(month>=12){ year++; nextMonth = 1;}
	countDay =new Date(year,month+2,0).getDate() + new Date(year,month+2,0).getDate() + countDay - nowdate.getDate() + 1;
  	
	if(st && typeof(chosetimeArr)=="object"){
      	
		if(chosetimeArr.length>4){
			$(".more_date").show();
		}else{
			$(".more_date").hide();
		}
		for(var i = 0; i<chosetimeArr.length; i++){
			var choseDate = new Date(chosetimeArr[i]);
			var year = choseDate.getFullYear();    //获取完整的年份(4位,1970-????)
			var month = choseDate.getMonth();       //获取当前月份(0-11,0代表1月)
			var day = choseDate.getDate(); 
			if(specialtimejson!=''){
				var specialtime = JSON.parse(specialtimejson);//特殊时刻
				for(var o in specialtime){
					var stime = new Date(specialtime[o].stime);
					var etime = new Date(specialtime[o].etime);
					if(choseDate.getTime() >= stime.getTime() && choseDate.getTime() <= etime.getTime()){
						html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+specialtime[o].price+'</b>'+langData['travel'][12][51]+'</p></div>')
					}else{
						html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
					}
				}
			}else{
				html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
			}
		}
	}else{
		for(var i=0; i<countDay; i++){
          	
			var preDate = new Date(curDate.getTime() +24*60*60*1000*i); //后一天
			var year = preDate.getFullYear();    //获取完整的年份(4位,1970-????)
			var month = preDate.getMonth();       //获取当前月份(0-11,0代表1月)
			var day = preDate.getDate();        //获取当前日(1-31);
			// month = month>=10?month:("0"+month);
			if(specialtimejson!=''){
				var specialtime = JSON.parse(specialtimejson);//特殊时刻
				for(var o in specialtime){
					var stime = new Date(specialtime[o].stime);
					var etime = new Date(specialtime[o].etime);
					if(preDate.getTime() >= stime.getTime() && preDate.getTime() <= etime.getTime()){
						html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+specialtime[o].price+'</b>'+langData['travel'][12][51]+'</p></div>')
					}else{
						html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
					}
				}
			}else{
				html.push('<div data-id="'+year+'-'+(month+1)+'-'+(day)+'" class="'+(i==0?"date_chose":"")+' chosedate swiper-slide"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
			}
			
		
		}
	}
	
	// html.push('<div class="more_date"><a href="javascript:;">更多</a></div>')
	 $('.datebox .swiper-wrapper').html(html.join(''));
	 swiper = new Swiper('.datebox .swiper-container', {slidesPerView: "auto",});
	 $('#datein').val($('.date_chose').find('h3').text())

	//选择时间
	$('.datebox').delegate('.chosedate','click',function(){
		$(this).addClass('date_chose').siblings('.chosedate').removeClass('date_chose');
		$('#datein').val($(this).find('h3').text());
		priceCalculator();
	});
	
	

	//增加r数目
	$('.add').click(function(){
		var i = $(this).siblings('span').text()*1;
		i=i+1;
		$(this).siblings('span').text(i);
		priceCalculator();
	});
	$('.jian').click(function(){
		var i = $(this).siblings('span').text()*1;
		i=i-1;
		if(i==0){
			showErrAlert(langData['travel'][7][59]);//不能再减少
			return 0;
		}
		$(this).siblings('span').text(i);

		priceCalculator();
	});

	//计算总价 包含特殊时刻
	priceCalculator();

	function priceCalculator(){
		var peoplenum = $('.jian').siblings('span').text();//人数
		peoplenum = peoplenum ? parseInt(peoplenum) : 1;
		var walktime  = $(".datebox .date_chose").find('h3').data('id');//日期
		var pricePay = price;//原来的价格
		walktime = new Date(walktime);


		var priceArr = [];
		if(specialtimejson!=''){
			var specialtime = JSON.parse(specialtimejson);//特殊时刻
			if(specialtime.length>0){
				for(var o in specialtime){
					var stime = new Date(specialtime[o].stime);
					var etime = new Date(specialtime[o].etime);
					if(walktime.getTime() >= stime.getTime() && walktime.getTime() <= etime.getTime()){
						priceArr.push(specialtime[o].price);
					}
				}
			}
		}
		if (priceArr.length == 0){
			pricePay = (pricePay * peoplenum).toFixed(2);
		}else{
			pricePay = (priceArr.pop() * peoplenum).toFixed(2);
		}
		$('.price_all em').html(pricePay);
		$('.detail_all em').html(pricePay);


	}




	//时间选择器
    var opt={};
    opt.date = {preset : 'date'};
    opt.datetime = {preset : 'datetime'};
    opt.time = {preset : 'time'};
    opt.default = {
        dateFormat:'yy-mm-dd',
        mode: 'scroller', //日期选择模式
        lang:'zh',
        minDate: new Date(),
        onCancel:function(){//点击取消按钮

        },
        onSelect:function(valueText,inst){//点击确定按钮
            $('#datein').val(valueText)
            var chosedate = new Date(valueText);
			// 有三种方式获取
			var curchose = chosedate.getTime();
            var html2 = [];
            var len = $('.chosedate').length;
            for(var i=0; i<len; i++){
            	var preDate = new Date(curchose +24*60*60*1000*i); //后一天
				var year = preDate.getFullYear();    //获取完整的年份(4位,1970-????)
				var month = preDate.getMonth();       //获取当前月份(0-11,0代表1月)
				var day = preDate.getDate();        //获取当前日(1-31)
				if(i==0){
					html2.push('<div class="date_chose chosedate"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
				}else{
					html2.push('<div class="chosedate"><h3 data-id="'+year+'-'+(month+1)+'-'+(day)+'">'+(month+1)+'-'+(day)+'</h3><p>'+echoCurrency("symbol")+'<b>'+price+'</b>'+langData['travel'][12][51]+'</p></div>')
				}
            }
            $('.chosedate').remove();
			$('.more_date').before(html2.join(''));
        },
    };
    var time = $.extend(opt['date'], opt['default']);
    // $(".more_date").scroller($.extend(opt['date'], opt['default']));
	$(".more_date").hotelDate();

//提交
$('.right_btn').click(function(){
	var userid = $.cookie(cookiePre+"login_user");
	if(userid == null || userid == ""){
		window.location.href = masterDomain+'/login.html';
		return false;
	}

	var t = $(this);
	var contact = $('#contact').val();
	var tel = $('#tel').val();
	var person_id =$('#person_id').val();
	var tel_d = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
	var id_d = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
	if(contact==''){
		showErrAlert(langData['travel'][8][63]);  //请输入联系人
		return 0;
	}else if(tel==''){
		showErrAlert(langData['travel'][7][60]);//请输入手机号
		return 0;
	}else if(!tel.match(tel_d)){
		showErrAlert(langData['travel'][7][61]);   //请输入正确的手机号
		return 0;
	}else if(person_id==''){
		showErrAlert(langData['travel'][7][64]);   //请输入身份证号
		return 0;
	}else if(!person_id.match(id_d)){
		showErrAlert(langData['travel'][7][65]);    //请输入正确身份证号
		return 0;
	}

	var data = [];
	data.push('proid=' + $("#proid").val());
	data.push('type=' + type);
	data.push('procount=' + $('.jian').siblings('span').text());

	data.push('people=' + $("#contact").val());
	data.push('contact=' + $("#tel").val());
	data.push('idcard=' + $("#person_id").val());
	data.push('walktime=' + $(".datebox .date_chose").find('h3').data('id'));

	$.ajax({
		url: masterDomain + '/include/ajax.php?service=travel&action=deal',
		data: data.join("&"),
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state == 100){
				if(device.indexOf('huoniao_Android') > -1) {
					setupWebViewJavascriptBridge(function (bridge) {
						bridge.callHandler('pageClose', {}, function (responseData) {
						});
					});
					location.href = data.info;
				}else{
					location.href = data.info + (data.info.indexOf('?') > -1 ? '&' : '?') + 'currentPageOpen=1';
				}
			}else{
				showErrAlert(data.info);
			}
		},
		error: function(){
			showErrAlert(langData['siteConfig'][20][183]);
			t.removeClass("disabled").html(langData['shop'][1][8]);
		}
	});

});


//价格明细
$('.price_all a').click(function(){
	$('.mask').show();
	$('.detail_price').animate({'bottom':'0'},200)
});

$('.detail_price h2>i,.mask').click(function(){
	$('.mask').hide();
	$('.detail_price').animate({'bottom':'-20rem'},200)
});


})
