$(function(){

  // 判断设备类型，ios全屏
  var device = navigator.userAgent;
  if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('padTop20');
	}

})
