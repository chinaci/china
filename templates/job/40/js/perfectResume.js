$(function(){

	// 表单
	$('.formFirst').submit(function(){
		var r = true;
		$('.has-error').removeClass('has-error');
		$('.error').text('');
		var oname = $('#username'),name = $.trim(oname.val());
		if(name == '') {
			oname.addClass('has-error').focus();
			r = false;
		}
		var oxl = $('#xl'),xl = oxl.attr('data-id');
		if(xl == '0') {
			oxl.addClass('has-error');
			r = false;
		}
		var oyear = $('#year'),year = oyear.attr('data-id');
		if(year == '0') {
			oyear.addClass('has-error');
			r = false;
		}
		var ophone = $('#phone'),phone = $.trim(ophone.val());
		if(phone == '') {
			ophone.addClass('has-error');
			if (r) {
				ophone.focus();
			}
			r = false;
		} else {
			var telReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
			if(!telReg){
			    ophone.addClass('has-error');
			    if (r) {
			    	ophone.focus();
			    }
				r = false;
			}
		}
		var oarea = $('#addr'),area = oarea.attr('data-id');
		if(area == '0') {
			oarea.addClass('has-error');
			r = false;
		}
		if(!r) {
			$('.error').text('提示 : 请完善信息！');
			return false;
		}
	})

	$(document).click(function(){
		$('.sel').removeClass('selopen');
	})

	var nowYear , nowMonth , selStartYear , selStartMonth , selEndYear , selEndMonth;
	$(document).on('click','.selTimeBtn',function(event){
		event.stopPropagation();
		var a = $(this);
		var sel = a.parent('.sel');
		var list = a.parents('.worklist');
		if(a.hasClass('startBtn')) {
			if(sel.find('.yearsbox').html() == '') {
				var myDate = new Date();
				nowYear = myDate.getFullYear(),
				nowMonth = myDate.getMonth() + 1;
				var years = [];
				for(var i = nowYear;i > nowYear - 40;i--) {
					years.push('<a href="javascript:;">' + i + '</a>')
				}
				$('.startTime .yearsbox').html(years.join(""));
			}
			list.find('.endTime').removeClass('selopen');
			list.find('.startTime').addClass('selopen');
		} else {
			if(sel.find('.yearsbox').html() != '') {
				sel.addClass('selopen');
				list.find('.startTime').removeClass('selopen');
			}
		}
	})

	// 选择年份 startTime
	$(document).on('click','.timeList .years a',function(event){
		event.stopPropagation();
		var a = $(this);
		var list = a.parents('.worklist');
		a.addClass('curr').siblings().removeClass('curr');
		var months = [],min,max;
		if(a.parents('.sel').hasClass('startTime')) {
			selStartYear = parseInt(a.text());
			min = 1;
			max = a.text() == nowYear ? nowMonth : 12;
		} else {
			selEndYear = parseInt(a.text());
			min = selEndYear == selStartYear ? selStartMonth : 1;
		}

		var months = [],max = a.text() == nowYear ? nowMonth : 12;
		for(var i = min;i <= max;i++) {
			months.push('<a href="javascript:;">' + i + '</a>');
		}
		a.parents('.timeList').find('.monthsbox').html(months.join(""));
	})
	// 选择月份
	$(document).on('click','.timeList .months a',function(event){
		event.stopPropagation();
		var a = $(this);
		var list = a.parents('.worklist');
		a.addClass('curr').siblings().removeClass('curr');
		if(a.parents('.sel').hasClass('startTime')) {
			selStartMonth = parseInt(a.text());
			console.log(selStartMonth)
			var years = [];
			for(var i =selStartYear;i <= nowYear;i++) {
				years.push('<a href="javascript:;">' + i + '</a>')
			}
			list.find('.endTime .yearsbox').html(years.join(""));
			list.find('.startTime').removeClass('selopen');
			list.find('.endTime').addClass('selopen');
			list.find('.startBtn').text(selStartYear + '年' + selStartMonth + '月');
		} else {
			selEndMonth = parseInt(a.text());
			list.find('.endBtn').text(selEndYear + '年' + selEndMonth + '月');
			list.find('.endTime').removeClass('selopen');
		}
	})

	// 选择本月
	$(document).on('click','.timeList .today',function(){
		var list = $(this).parents('.worklist');
		list.find('.endBtn').text(nowYear + '年' + nowMonth + '月');
		list.find('.endTime').removeClass('selopen');
	})

	$(document).on('click','.timeList',function(event){
		event.stopPropagation();
	})

	// 增加工作经历
	var clone = $('.worklist').clone();
	$('#addInfo').click(function(){
		var btn = $(this);
		var bclone = clone.clone();
		$('.addk').before(bclone);
	})



})
