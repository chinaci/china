$(function(){

	//APP端取消下拉刷新
    toggleDragRefresh('off');
    
    var imgLoad = function (url, obj) {
		var img = new Image();
		img.src = url;
		if (img.complete) {
			$("#"+obj).attr("data-size", img.width+"x"+img.height);
		} else {
			img.onload = function () {
				$("#"+obj).attr("data-size", img.width+"x"+img.height);
				img.onload = null;
			};
		};
	};

	$("#picobj .picarr").each(function(){
		var id = $(this).attr("id"), pic = $(this).attr("href");
		imgLoad(pic, id);
	});

    var photoswipeInstance = new PhotoSwipe('#Gallery a');

})
