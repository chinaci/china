$(function(){

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=6",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".date-weather ul").append(data.info);
			}
		}
	});


	//获取最新数据
	function getData(){

		//获取商城订单信息
		if($('#shopOrderObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=shop&action=orderList&store=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var ongoing = parseInt(pageInfo.ongoing);
						var recei1 = parseInt(pageInfo.recei1);
						var recei2 = parseInt(pageInfo.recei2);
						var refunded = parseInt(pageInfo.refunded);
						if(ongoing){
							$('#shop1 span').html(ongoing).css('color','#313233').after('<i class="m-state"></i>');
						}
						if(recei1){
							$('#shop61 span').html(recei1).css('color','#313233');
						}
						if(recei2){
							$('#shop62 span').html(recei2).css('color','#313233');
						}
						if(refunded){
							$('#shop4 span').html(refunded).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取外卖订单信息
		if($('#waimaiOrderObj').size() > 0){

			//未处理
			$.ajax({
				url: "/wmsj/order/waimaiOrder.php?action=getList&state=2&p=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var totalCount = parseInt(data.info.pageInfo.totalCount);
						if(totalCount){
							$('#waimai2 span').html(totalCount).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

			//已确认
			$.ajax({
				url: "/wmsj/order/waimaiOrder.php?action=getList&state=3&p=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var totalCount = parseInt(data.info.pageInfo.totalCount);
						if(totalCount){
							$('#waimai3 span').html(totalCount).css('color','#313233');
						}
					}
				}
			});

			//已接单
			$.ajax({
				url: "/wmsj/order/waimaiOrder.php?action=getList&state=4&p=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var totalCount = parseInt(data.info.pageInfo.totalCount);
						if(totalCount){
							$('#waimai4 span').html(totalCount).css('color','#313233');
						}
					}
				}
			});

			//配送中
			$.ajax({
				url: "/wmsj/order/waimaiOrder.php?action=getList&state=5&p=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var totalCount = parseInt(data.info.pageInfo.totalCount);
						if(totalCount){
							$('#waimai5 span').html(totalCount).css('color','#313233');
						}
					}
				}
			});

		}

		//获取信息订单信息
		if($('#infoOrderObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=info&action=orderList&store=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var ongoing = parseInt(pageInfo.ongoing);
						var recei = parseInt(pageInfo.recei);
						var refunded = parseInt(pageInfo.refunded);
						if(ongoing){
							$('#info1 span').html(ongoing).css('color','#313233').after('<i class="m-state"></i>');
						}
						if(recei){
							$('#info3 span').html(recei).css('color','#313233');
						}
						if(refunded){
							$('#info6 span').html(refunded).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取团购订单信息
		if($('#tuanOrderObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=tuan&action=orderList&store=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var ongoing = parseInt(pageInfo.ongoing);
						var recei = parseInt(pageInfo.recei);
						var refunded = parseInt(pageInfo.refunded);
						if(ongoing){
							$('#tuan1 span').html(ongoing).css('color','#313233').after('<i class="m-state"></i>');
						}
						if(recei){
							$('#tuan6 span').html(recei).css('color','#313233');
						}
						if(refunded){
							$('#tuan4 span').html(refunded).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取点餐订单信息
		if($('#diancanObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=business&action=diancanOrder&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalAudit = parseInt(pageInfo.totalAudit);
						var totalGray = parseInt(pageInfo.totalGray);
						if(totalGray){
							$('#diancan0 span').html(totalGray).css('color','#313233').after('<i class="m-state"></i>');
						}
						if(totalAudit){
							$('#diancan3 span').html(totalAudit);
						}
					}
				}
			});

		}

		//获取订座订单信息
		if($('#dingzuoObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=business&action=dingzuoOrder&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalGray = parseInt(pageInfo.totalGray);
						var totalAudit = parseInt(pageInfo.totalAudit);
						if(totalGray){
							$('#dingzuo0 span').html(totalGray).css('color','#313233').after('<i class="m-state"></i>');
						}
						if(totalAudit){
							$('#dingzuo1 span').html(totalAudit);
						}
					}
				}
			});

		}

		//获取排队订单信息
		if($('#paiduiObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=business&action=paiduiOrder&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalGray = parseInt(pageInfo.totalGray);
						if(totalGray){
							$('#paidui0 span').html(totalGray).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取买单订单信息
		if($('#maidanObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=business&action=maidanOrder&u=1&today=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalAudit = parseInt(pageInfo.totalAudit);
						if(totalAudit){
							$('#maidan0 span').html(totalAudit).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取资讯信息
		if($('#articleObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=article&action=alist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var audit = parseInt(pageInfo.audit);
						var gray = parseInt(pageInfo.gray);
						var refuse = parseInt(pageInfo.refuse);
						if(audit){
							$('#article_1 span').html(audit).css('color','#313233');
						}
						if(gray){
							$('#article_0 span').html(gray).css('color','#313233');
						}
						if(refuse){
							$('#article_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取二手信息
		if($('#infoObj').size() > 0){

			//未处理
			$.ajax({
				url: "/include/ajax.php?service=info&action=ilist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var audit = parseInt(pageInfo.audit);
						var gray = parseInt(pageInfo.gray);
						var refuse = parseInt(pageInfo.refuse);
						if(audit){
							$('#info_1 span').html(audit).css('color','#313233');
						}
						if(gray){
							$('#info_0 span').html(gray).css('color','#313233');
						}
						if(refuse){
							$('#info_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取房产信息
		if($('#houseObj').size() > 0){

			//经纪人
			$.ajax({
				url: "/include/ajax.php?service=house&action=zjUserList&type=getnormal&comid="+house_com_id+"&state=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var houseBroker = parseInt(pageInfo.state1);
						if(houseBroker){
							$('#houseBroker span').html(houseBroker).css('color','#313233');
						}
					}
				}
			});

			//入驻申请
			$.ajax({
				url: "/include/ajax.php?service=house&action=zjUserList&iszjcom=1&comid="+house_com_id+"&u=1&state=0&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var house_receive_broker = parseInt(pageInfo.state0);
						if(house_receive_broker){
							$('#house_receive_broker span').html(house_receive_broker).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

			//房源委托
			$.ajax({
				url: "/include/ajax.php?service=house&action=myEntrust&iszjcom=1&u=1&state=0&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var house_entrust = parseInt(pageInfo.state0);
						if(house_entrust){
							$('#house_entrust span').html(house_entrust).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取招聘信息
		if($('#jobObj').size() > 0){

			//职位信息
			$.ajax({
				url: "/include/ajax.php?service=job&action=post&com=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var state0 = parseInt(pageInfo.state0);
						var state1 = parseInt(pageInfo.state1);
						var state2 = parseInt(pageInfo.state2);
						if(state0){
							$('#job_0 span').html(state0).css('color','#313233');
						}
						if(state1){
							$('#job_1 span').html(state1).css('color','#313233');
						}
						if(state2){
							$('#job_2 span').html(state2).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

			//简历
			$.ajax({
				url: "/include/ajax.php?service=job&action=deliveryList&type=company&state=0&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var state0 = parseInt(pageInfo.state0);
						if(state0){
							$('#job_resume span').html(state0).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取商城信息
		if($('#shopObj').size() > 0){

			$.ajax({
				url: "/include/ajax.php?service=shop&action=slist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						var audit = parseInt(pageInfo.audit);
						var refuse = parseInt(pageInfo.refuse);
						if(gray){
							$('#shop_0 span').html(gray).css('color','#313233');
						}
						if(audit){
							$('#shop_1 span').html(audit).css('color','#313233');
						}
						if(refuse){
							$('#shop_2 span').html(refuse).css('color','#313233');
						}
					}
				}
			});

		}

		//获取团购信息
		if($('#tuanObj').size() > 0){

			$.ajax({
				url: "/include/ajax.php?service=tuan&action=tlist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						var audit = parseInt(pageInfo.audit);
						var refuse = parseInt(pageInfo.refuse);
						if(gray){
							$('#tuan_0 span').html(gray).css('color','#313233');
						}
						if(audit){
							$('#tuan_1 span').html(audit).css('color','#313233');
						}
						if(refuse){
							$('#tuan_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取活动信息
		if($('#huodongObj').size() > 0){

			$.ajax({
				url: "/include/ajax.php?service=huodong&action=hlist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						var audit = parseInt(pageInfo.audit);
						var refuse = parseInt(pageInfo.refuse);
						if(gray){
							$('#huodong_0 span').html(gray).css('color','#313233');
						}
						if(audit){
							$('#huodong_1 span').html(audit).css('color','#313233');
						}
						if(refuse){
							$('#huodong_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取养老信息
		if($('#pensionObj').size() > 0){

			//预约
			$.ajax({
				url: "/include/ajax.php?service=pension&action=bookingList&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						if(gray){
							$('#pension_booking span').html(gray).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

			//入住
			$.ajax({
				url: "/include/ajax.php?service=pension&action=awardList&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						if(gray){
							$('#pension_award span').html(gray).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

			//邀请
			$.ajax({
				url: "/include/ajax.php?service=pension&action=invitationList&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						if(gray){
							$('#pension_invitation span').html(gray).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取家政信息
		if($('#homemakingObj').size() > 0){

			//家政
			$.ajax({
				url: "/include/ajax.php?service=homemaking&action=hList&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var gray = parseInt(pageInfo.gray);
						var audit = parseInt(pageInfo.audit);
						var refuse = parseInt(pageInfo.refuse);
						if(gray){
							$('#homemaking_0 span').html(gray).css('color','#313233');
						}
						if(audit){
							$('#homemaking_1 span').html(audit).css('color','#313233');
						}if(refuse){
							$('#homemaking_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取汽车信息
		if($('#carObj').size() > 0){

			//顾问
			$.ajax({
				url: "/include/ajax.php?service=car&action=adviserList&type=getnormal&comid="+car_com_id+"&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var state1 = parseInt(pageInfo.state1);
						if(state1){
							$('#car_broker span').html(state1).css('color','#313233');
						}
					}
				}
			});

			//入驻
			$.ajax({
				url: "/include/ajax.php?service=car&action=adviserList&type=getnormal&iszjcom=1&comid="+car_com_id+"&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var state0 = parseInt(pageInfo.state0);
						if(state0){
							$('#car_receive span').html(state0).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取装修信息
		if($('#renovationObj').size() > 0){

			//团队
			$.ajax({
				url: "/include/ajax.php?service=renovation&action=team&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalCount = parseInt(pageInfo.totalCount);
						if(totalCount){
							$('#renovation_team span').html(totalCount).css('color','#313233');
						}
					}
				}
			});

			//案例
			$.ajax({
				url: "/include/ajax.php?service=renovation&action=diary&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalCount = parseInt(pageInfo.totalCount);
						if(totalCount){
							$('#renovation_case span').html(totalCount).css('color','#313233');
						}
					}
				}
			});

			//预约
			$.ajax({
				url: "/include/ajax.php?service=renovation&action=rese&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var state0 = parseInt(pageInfo.state0);
						if(state0){
							$('#renovation_booking span').html(state0).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取建站信息
		if($('#renovationObj').size() > 0){

			//团队
			$.ajax({
				url: "/include/ajax.php?service=website&action=guest&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var totalAudit = parseInt(pageInfo.totalAudit);
						if(totalAudit){
							$('#website_guest span').html(totalAudit).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取贴吧信息
		if($('#tiebaObj').size() > 0){

			$.ajax({
				url: "/include/ajax.php?service=tieba&action=tlist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var audit = parseInt(pageInfo.audit);
						var gray = parseInt(pageInfo.gray);
						var refuse = parseInt(pageInfo.refuse);
						if(audit){
							$('#tieba_1 span').html(audit).css('color','#313233');
						}
						if(gray){
							$('#tieba_0 span').html(gray).css('color','#313233');
						}
						if(refuse){
							$('#tieba_2 span').html(refuse).css('color','#313233').after('<i class="m-state"></i>');
						}
					}
				}
			});

		}

		//获取投票信息
		if($('#voteObj').size() > 0){

			//参与
			$.ajax({
				url: "/include/ajax.php?service=vote&action=joinList&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var audit = parseInt(pageInfo.audit);
						if(audit){
							$('#vote_join span').html(audit).css('color','#313233');
						}
					}
				}
			});

			//进行中
			$.ajax({
				url: "/include/ajax.php?service=vote&action=vlist&u=1&pageSize=1",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var pageInfo = data.info.pageInfo;
						var audit = parseInt(pageInfo.audit);
						if(audit){
							$('#vote_1 span').html(audit).css('color','#313233');
						}
					}
				}
			});

		}

	}

	getData();

	//刷新
	$('.iRefresh').bind('click', function(){
		var t = $(this);
		if(t.hasClass('loading')) return false;

		t.addClass('loading').find('span').html('loading...');

		getData();

		//10秒后才可以再次刷新
		setTimeout(function(){
			t.removeClass('loading').find('span').html(langData['siteConfig'][16][70]);
		}, 5000);
	});

});
