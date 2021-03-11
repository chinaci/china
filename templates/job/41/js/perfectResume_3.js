$(function(){

	// select
	$(document).on('click','.selBtn',function(event){
		var a = $(this),sel = a.parent('.sel');
		event.stopPropagation();
		if(sel.hasClass('selopen')) {
			$('.sel').removeClass('selopen');
			$('.contentList').removeClass('zindextop');
		} else {
			$('.sel').removeClass('selopen');
			sel.addClass('selopen').closest('.contentList').addClass('zindextop');
		}
	})

	$(document).on('click','.selList a',function(event){
		var a = $(this);
		var t = a.text(),id = a.attr('data-id');
		a.addClass('hover').siblings().removeClass('hover');
		a.parents('.sel').children('.selBtn').val(t).attr('data-id',id);
	})

	// 表单
	$('.formStep').submit(function(){
			var r = true;
			$('.has-error').removeClass('has-error');
			$('.error').text('');
		$('.contentList').each(function(){
			var list = $(this);
			// 学校名称
			var osname = list.find('.schoolname'),sname = $.trim(osname.val());
			if(sname == '') {
				osname.addClass('has-error');
				if (r) {
					osname.focus();
				}
				r = false;
			}
			// 所学专业
			var oprofes = list.find('.profesname'),profes = $.trim(oprofes.val());
			if(profes == '') {
				oprofes.addClass('has-error');
				if (r) {
					oprofes.focus();
				}
				r = false;
			}
			// 学历
			var orecord = list.find('.record'),record = $.trim(orecord.val());
			if(record == '') {
				orecord.addClass('has-error');
				if (r) {
					orecord.focus();
				}
				r = false;
			}
			// 年份
			var oyear = list.find('.selTimeBtn'),year = $.trim(oyear.val());
			if(year == '') {
				oyear.addClass('has-error');
				if (r) {
					oyear.focus();
				}
				r = false;
			}
		})
		if(!r) {
			$('.error').text('提示 : 请完善信息！');
			return false;
		}
	})

	$(document).click(function(){
		$('.sel').removeClass('selopen');
	})

	var myDate = new Date();
	var nowYear = myDate.getFullYear(), selStartYear;
	$(document).on('click','.selTimeBtn',function(event){
		event.stopPropagation();
		var a = $(this);
		var sel = a.parent('.sel');
		if(sel.hasClass('selopen')) {
			$('.sel').removeClass('selopen');
			$('.contentList').removeClass('zindextop');
		} else {
			$('.sel').removeClass('selopen');
			sel.addClass('selopen').closest('.contentList').addClass('zindextop');
		}
		var list = a.parents('.contentList');
		if(sel.find('.yearsbox').html() == '') {
			var years = [];
			for(var i = nowYear;i > nowYear - 70;i--) {
				years.push('<a href="javascript:;" data-id="' + i+ '">' + i + '</a>')
			}
			$('.startTime .yearsbox').html(years.join(""));
		}
		var selyeared = list.find('.selTimeBtn').attr('data-year');
	})

	// 选择年份 startTime
	$(document).on('click','.timeList .years a',function(event){
		event.stopPropagation();
		var a = $(this);
		if(a.hasClass('disabled')) return;
		var list = a.closest('.contentList');
		a.addClass('curr').siblings().removeClass('curr');
		selStartYear = parseInt(a.text());
		list.find('.selTimeBtn').val(selStartYear + ' 年').attr({'data-year':selStartYear});
		list.find('.startTime').removeClass('selopen');
	})
	// 选择今年
	$(document).on('click','.timeList .today',function(){
		var list = $(this).parents('.contentList');
		list.find('.selTimeBtn').val(nowYear + ' 年').attr('data-year',nowYear);
		list.find('.startTime').removeClass('selopen');
	})

	$(document).on('click','.timeList',function(event){
		event.stopPropagation();
	})

	// 增加教育经历
	var clone = $('.contentList').clone();
	$('#addInfo').click(function(){
		var btn = $(this);
		var bclone = clone.clone();
		$('.addk').before(bclone);
		$('.contentList').last().find('.companyname').focus()
		var sct = $(document).scrollTop();
		$('html,body').animate({'scrollTop' : sct + 177 + 'px'},600,'swing')
	})



})
