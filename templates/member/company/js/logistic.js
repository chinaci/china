$(function(){

  //删除
	$(".list").delegate(".del", "click", function(){
		var t = $(this), par = t.closest("tr"), id = par.data("id");
		if(id){
			$.dialog.confirm(langData['siteConfig'][27][111], function(){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service="+module+"&action=delLogistic&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state != 200){

							location.reload();

						}else{
							$.dialog.alert(langData['siteConfig'][27][77]);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						$.dialog.alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			});
		}
	});

});
