$(function(){

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=6",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".weatherInfo").append(data.info);
			}
		}
	});
	
});