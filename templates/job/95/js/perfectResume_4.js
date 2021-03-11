$(function(){
	// 输入框字符数
	$('#mydes').on('input prototypechange',function(){
		var t = $(this),s = $.trim(t.val()),n = s.length;
		if(n > 80) {
			t.val(s.substr(0,80));
			n = 80;
		}
		$('#cahrNum').text(80 - n);
	})
	// 表单
	$('.formStep').submit(function(){
		var r = true;
		$('.has-error').removeClass('has-error');
		$('.error').text('');
		var odes = $('#mydes'),des =  $.trim(odes.val());
		if(des == '') {
			odes.focus();
			r = false;
		}
		if(!r) {
			$('.error').text('提示 : 请完善信息！');
			return false;
		}
	})

	// 查看示例
	$('#openexample').click(function(){
		$('.expample').slideToggle();
	})
	// 使用示例
	$('.expample a').click(function(){
		var s = $(this).siblings('span').text();
		$('#mydes').val(s.substr(0,80));
		$('#cahrNum').text(80 - (s.length > 80 ? 80 : s.length));
	})
})
