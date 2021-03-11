$(function(){

	//二维码
	$(".boxlist").delegate(".ctag", "mouseover", function(){
		var t = $(this), url = t.data("url"), obj = t.find(".ewmbox");
		if(obj.html() == ""){
			obj.qrcode({
				render: window.applicationCache ? "canvas" : "table",
				width: 100,
				height: 100,
				text: url
			});
		}
	});

});
