$(function(){

	//头像
	var photo = $(".photo");
	photo.hover(function(){
		$(this).removeClass("hover").addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});

	//上传图片
  function mysub(){

    var data = [];
    data['mod']  = "job";
    data['type'] = "photo";

    var fileId = photo.find("input[type=file]").attr("id");
		photo.find(".loading").show();
		photo.removeClass("hover");

    $.ajaxFileUpload({
      url: "/include/upload.inc.php",
      fileElementId: fileId,
      dataType: "json",
      data: data,
      success: function(m, l) {
        if (m.state == "SUCCESS") {

        	$(".holder").html("<s></s>"+langData['siteConfig'][6][59]);
					photo.find("img").attr("src", huoniao.changeFileSize(m.turl, "middle"));
					$("#litpic").val(m.url);
          photo.find(".loading").hide();

        } else {
          alert(langData['siteConfig'][20][306]);
        }
      },
      error: function() {
				alert(langData['siteConfig'][20][531]);
      }
    });

  }

  $(".Filedata").bind("change", function(){
    if ($(this).val() == '') return;
    mysub();
  });


	

});
