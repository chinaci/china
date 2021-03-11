$(function(){

	// 表单
	$('.formStep').submit(function(){
			var r = true;
			$('.has-error').removeClass('has-error');
			$('.error').text('');
		$('.contentList').each(function(){
			var list = $(this);
			var ocom = list.find('.companyname'),com = $.trim(ocom.val());
			if(com == '') {
				ocom.addClass('has-error');
				if (r) {
					ocom.focus();
				}
				r = false;
			}
			var ojob = list.find('.jobname'),job = $.trim(ojob.val());
			if(job == '') {
				ojob.addClass('has-error');
				if (r) {
					ojob.focus();
				}
				r = false;
			}
			var otime1 = list.find('.startBtn'),time1 = $.trim(otime1.val());
			if(time1 == '') {
				otime1.addClass('has-error');
				r = false;
			}
			var otime2 = list.find('.endBtn'),time2 = $.trim(otime2.val());
			if(time2 == '') {
				otime2.addClass('has-error');
				r = false;
			}
		})

			if(!r) {
				$('.error').text('提示 : 请完善信息！');
				return false;
			}
	})

	// 日历 s

	var myDate = new Date(),nowYear,nowMonth,nowDay,minYear = 10,minMonth;
	nowYear = myDate.getFullYear();
	nowMonth = myDate.getMonth() + 1;
	nowDay = myDate.getDate();

	$(document).on('click','.timeBtn',function(){
		var btn = $(this);
		var id = btn.attr('id');
		creatTimeBox(id);
	})

	function creatTimeBox(from){
		if($('.date-box').length >0) {
			$('.date-box , #date_bg').remove();
		}

		var html = '<div class="date-box fn-clear" data-focus="#' + from + '">';
			html += 	'<div class="fn-clear"><div class="date-year-box">';
			html += 		'<p class="date-title">年份</p>';
			html += 		'<div class="date-years-list date-list fn-clear">';
			html +=				'<div class="date-listbox">'
			var ii = 0,ycls = '';
			var isStart = from.indexOf('start') >= 0 ? true : false;
			for(var i = nowYear - 70 ;i <= nowYear ;i++) {
				ycls = i == parseInt($('#' + from).attr('data-year')) ? 'curr' : '';
				if(isStart) {
					ycls += $('#' + from).attr('data-max-year') === undefined ? '' : i > parseInt($('#' + from).attr('data-max-year')) ? ' disabled' : '';
				} else {
					ycls += $('#' + from).attr('data-min-year') === undefined ? '' : i < parseInt($('#' + from).attr('data-min-year')) ? ' disabled' : '';
				}
				if(ii % 30 == 0) {
					html += 		'<div class="data-years-group fn-clear">';
				}
				html +=					'<a href="javascript:;" data-val="' + i + '" class="' + ycls + '">' + i + '</a>';
				if((ii + 1) % 30 == 0 || i == nowYear) {
					html += 		'</div>';
				}
				ii++;
			}
			html += 			'</div>';	//date-box
			html += 		'</div>';	//list
			html += 	'</div>';		//date-year-box
			html +=		'<div class="date-month-box">';
			html +=			'<p class="date-title">月份</p>';
			html += 		'<div class="date-month-list date-list fn-clear">';
			var mcls = '';
			for(var i = 1 ; i <= 12 ; i++) {
				if($('#' + from).attr('data-month') == undefined) {
					mcls = 'disabled';
				} else {
					if(parseInt($('#' + from).attr('data-year')) == nowYear && i > nowMonth || parseInt($('#' + from).attr('data-year')) == parseInt($('#' + from).attr('data-min-year')) && i < parseInt($('#' + from).attr('data-min-month')) || parseInt($('#' + from).attr('data-year')) == parseInt($('#' + from).attr('data-max-year')) && i > parseInt($('#' + from).attr('data-max-month'))) {
						mcls = 'disabled';
					} else {
						if(i == parseInt($('#' + from).attr('data-month'))) {
							mcls = 'curr';
						} else {
							mcls = '';
						}
					}
				}
				html +=			'<a href="javascript:;" data-val="' + i + '" class="' + mcls + '">' + i + '</a>';
			}
			html += 		'</div>';		//date-month-list
			html += 	'</div></div>';		//date-month-box
			html +=		'<div class="date-btn"><a href="javascript:;" class="do1" id="year_prevg">&lt</a><a href="javascript:;" class="do1" id="year_nextg">&gt</a><a href="javascript:;" class="do" id="date_ok">确定</a>';
			html +=			isStart ? '' : '<a href="javascript:;" class="do" id="date_today" data-f="#' + from + '">至今</a><a href="javascript:;" class="do" id="date_clear" data-f="#' + from + '">清除</a>';
			html += 	'</div>';			//date-btn
			html += '</div>';			//date-box
			$('body').append(html + '<div id="date_bg"></div>');

		var from = $('#' + from);
		var _top = from.offset().top + from.outerHeight();
		var _left = from.offset().left;
		$('.date-box').show().css({'top':_top + 'px','left':_left + 'px'});
		var yearsG = $('.data-years-group');
		var yearsGNum = yearsG.length;
		$('.date-listbox').attr({'data-gnum':yearsGNum,'data-now' : yearsGNum - 1}).animate({'top' : -yearsG.height() * (yearsGNum - 1)},300);
		$('#year_nextg').addClass('disabled');
	}

	$(document).on('click','#year_prevg',function(){
		var a = $(this),
			o = $('.date-listbox'),
			m = parseInt(o.attr('data-gnum')),
			n = parseInt(o.attr('data-now'));
		if(a.hasClass('disabled')) return;
		$('.date-listbox').attr({'data-now' : n - 1}).animate({'top' : -$('.data-years-group').height() * (n - 1)},300,function(){
			$('#year_nextg').removeClass('disabled');
		});
		if(n == 1) {
			a.addClass('disabled');
		}
	})
	$(document).on('click','#year_nextg',function(){
		var a = $(this),
			o = $('.date-listbox'),
			m = parseInt(o.attr('data-gnum')),
			n = parseInt(o.attr('data-now'));
		if(a.hasClass('disabled')) return;
		$('.date-listbox').attr({'data-now' : n + 1}).animate({'top' : -$('.data-years-group').height() * (n + 1)},300,function(){
			$('#year_prevg').removeClass('disabled');
		});
		if(n + 2 == $('.data-years-group').length) {
			a.addClass('disabled');
		}
	})
	$(document).on('click','.date-list a',function(){
		var a = $(this),y,m,f = $('.date-box').attr('data-focus');
		if(a.hasClass('disabled')) return;
		a.closest('.date-list').find('a').removeClass('curr');
		a.addClass('curr');
		var isStart = f.indexOf('start') >= 0 ? true : false;
		_f = isStart ? f.replace('start','end') : f.replace('end','start');
		if(a.closest('.date-list').hasClass('date-years-list')) {
			y = parseInt(a.attr('data-val'));
			$(f).attr('data-year',y);
			isStart && $(f).attr('data-month') && $(_f).attr('data-min-year',y);
			!isStart && $(f).attr('data-month') && $(_f).attr('data-max-year',y);
			var m = $(f).attr('data-month'),mr = m > nowMonth && y == nowYear ? 1 : m;
			if(m !== undefined) {
				$(f).val(y + '-' + mr);
				$(f).attr('data-month',mr);
			}
			var ms = '',mcls = '',mm = y == nowYear ? nowMonth : 12;
			for(var i = 1 ; i <= 12 ;i++) {
				if(isStart) {
					var isErr = $(f).attr('data-max-year') == $(f).attr('data-year') ? true : false;
					if(isErr) {
						if(parseInt($(f).attr('data-month')) > parseInt($(f).attr('data-max-month'))) {
							$(f).val(y + '-' + 1);
							$(f).attr({'data-month':1,'data-min-month':1});
						}
					}

					mcls = i > mm || i > parseInt($(f).attr('data-max-month')) && isErr ? 'disabled' : i == $(f).attr('data-month') ? 'curr' : '';
					console.log(parseInt($(f).attr('data-max-month')))
					if(i > mm) {
						$(_f).attr('data-min-month',1)
					}
				} else {
					var isErr = $(f).attr('data-min-year') == $(f).attr('data-year') ? true : false;
					if(isErr) {
						if(parseInt($(f).attr('data-month')) < parseInt($(f).attr('data-min-month'))) {
							$(f).val(y + '-' + parseInt($(f).attr('data-min-month')));
							$(f).attr('data-month',parseInt($(f).attr('data-min-month')));
						}
					}
					mcls = i > mm || i < parseInt($(f).attr('data-min-month')) && isErr ? 'disabled' : i == $(f).attr('data-month') ? 'curr' : '';
				}
				ms += '<a href="javascript:;" data-val="' + i + '" class="' + mcls+ '">' + i + '</a>';
			}
			$('.date-month-list').html(ms);
		} else {
			y = $(f).attr('data-year');
			m = a.attr('data-val');
			$(f).attr('data-month',m);
			$(f).val(y + '-' + m);
			isStart && $(f).attr('data-year') && $(_f).attr({'data-min-year':$(f).attr('data-year'),'data-min-month':m});
			!isStart && $(f).attr('data-year') && $(_f).attr({'data-max-year':$(f).attr('data-year'),'data-max-month':m});
			$('#date_bg').remove();
			$('.date-box').remove();
		}
	})

	// 至今 date_today
	$(document).on('click','#date_today',function(){
		var a = $(this),f = a.attr('data-f');
		$(f).val('至今').attr({'data-year':nowYear,'data-month':nowMonth}).click();
		$(f.replace('endBtn','startBtn')).attr({'data-max-year':nowYear,'data-max-month':nowMonth});
	})
	// 清除
	$(document).on('click','#date_clear',function(){
		var a = $(this),f = a.attr('data-f');
		$(f).val('').removeAttr('data-year data-month');
		$(f.replace('endBtn','startBtn')).removeAttr('data-max-year data-max-month');
	})

	// 点击空白关闭日历 确定按钮
	$(document).on('click','#date_bg ,#date_ok',function(){
		$('#date_bg').remove();
		$('.date-box').remove();
	})


	// 日历 e

	// 增加工作经历

	$('#addInfo').click(function(){
		var btn = $(this);
		var n = $('.contentList').length + 1;
		var cloneStr = '<div class="contentList"> <div class="form-row"> <span class="type">公司名称</span> <input type="text" class="int companyname"> </div> <div class="form-row"> <span class="type">你的职位</span> <input type="text" class="int jobname"> </div> <div class="form-row fn-clear"> <div class="half halfl"> <div class="date-sel halfo sel startTime"> <input type="text" readonly="" class="btn timeBtn startBtn" id="startBtn_' + n + '" placeholder="起始时间"> <s></s> </div> </div> <div class="half"> <div class="date-sel halfo sel endTime"> <input type="text" readonly="" class="btn timeBtn endBtn" id="endBtn_' + n + '" placeholder="结束时间"> <s></s> </div> </div> </div> <a href="javascript:;" class="con_close" title="关闭">x</a> </div>';
		$('.addk').before(cloneStr);
		$('.contentList').last().find('.companyname').focus();
		var sct = $(document).scrollTop();
		$('html,body').animate({'scrollTop' : sct + 177 + 'px'},600,'swing')
	})
	// 删除
	$(document).on('click','.con_close',function(){
		$(this).closest('.contentList').remove();
	})
})
