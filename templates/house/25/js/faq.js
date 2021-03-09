$(function(){

	$("#tj").submit(function(event){
		event.preventDefault();
		var body = $("#body").val(), people = $("#people").val(), phone = $("#phone").val();
		var data = [];
		data.push("body="+encodeURIComponent(body));
		data.push("people="+encodeURIComponent(people));
		data.push("phone="+encodeURIComponent(phone));

		$.ajax({
			url: "/include/ajax.php?service=house&action=fabuFaq&"+data.join("&"),
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data.state == 100){
					alert('提交成功！');
					location.reload();
				}else{
					alert(data.info);
				}
			},
			error: function(){
				alert('网络错误，提交失败！');
			}
		});

	})

})
