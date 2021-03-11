$(function(){
    function getNatureText(num){
        switch (num){
            case '0' :
                return '全职';
            case '1':
                return '兼职';
            case '2':
                return '临时';
            case '3':
                return '实习';
            default :
                return '未知';
        }
    }
	// 地图
	var map = new BMap.Map("map"); 
    map.centerAndZoom(new BMap.Point(lng,lat), 11);
	map.setCurrentCity(job_addr);

	$('.appMapBtn').attr('href', OpenMap_URL);		

	zhiweiList();
    function zhiweiList(){
		var job_type = $("#job_type").val();

         $.ajax({
			url : '/include/ajax.php?service=job&action=getRelatedPositions',
			type : 'GET',
			data : {
				type  : job_type,
			},
			dataType : 'json',
			success:function (data) {
				if(data.state == 100){
					info = data.info;
                    var html = [];
                    var len = info.length;
                    for(var i = 0; i < len; i++){
                        var welfare = info[i]['welfare'].split(',');
                        var welfare_html = '';
                        for (var j = 0; j < welfare.length; j++){
                            welfare_html += '<span>'+welfare[j]+'</span>';
                        }
                        var is_top = '';
                        if(info[i].isbid == 1){
                        	is_top = '<i></i>';
                        }

                        html.push('<li>');
                        html.push('  <a href="'+info[i].url+'">');
                        html.push('    <div class="zhiwei_title">');
                        html.push('          <div class="title_01">'+info[i].title+'</div>');
                        html.push('          <div class="title_02 fn-clear"><span>'+info[i]['addr'][1]+'</span><span>'+info[i].experience+'</span><span>'+info[i].educational+'</span><span>'+getNatureText(info[i].nature)+'</span><p>'+info[i].salary+'</p></div>');
                        html.push('          <div class="title_03 fn-clear">'+job_type+'<em>最新</em></div>');
                        html.push('     </div>');
                        html.push('     <div class="title_04 fn-clear">');
                        html.push('         <div class="img_left"><img src="'+ info[i].logo+'"></div>');
                        html.push('         <div class="txt_right">');
                        html.push('             <p>'+info[i].company_name+'</p>');
                        html.push('             <div><span>'+info[i]['company_detail']['scale']+'</span><em>|</em><span>'+info[i]['company_detail']['nature']+'</span><em>|</em><span>'+info[i]['company_detail']['industry'][1]+'</span></div>');
                        html.push('         </div>');
                        html.push('     </div>');
                        html.push(is_top);
                        html.push('   </a>');
                        html.push('</li>');
                    }
                    $('.recommend .list ul').append(html.join(""));

                }else{
				}
            }
		})


    };

	//应聘
	$("#yp").bind("click", function(){
		var t = $(this);
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html'
			return false;
		}

		t.addClass("disabled");

		$.ajax({
			url: masterDomain + "/include/ajax.php?service=job&action=delivery&id="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled");
				if(data.state == 100){
					if(data.info.url!=undefined && data.info.url!=null){
						location.href = data.info.url;
						return false;
					}
					// $.dialog.tips('简历已成功投出去了，请静候佳音！', 3, 'success.png');
					 $('.t_yes').css('display','block');
					 $('.mask').css('display','block');
					  setTimeout(function(){      
					    $('.t_yes').css('display','none');
						$('.mask').css('display','none');
					  },2000);
				}else{
					// $.dialog.tips('网络错误，投递失败！', 3, 'error.png');
					
					alert(data.info)
				}
			},
			error: function(){
				t.removeClass("disabled");
				// $.dialog.tips('网络错误，投递失败！', 3, 'error.png');
				$('.t_no').css('display','block');
				 $('.mask').css('display','block');
				  setTimeout(function(){      
				    $('.t_no').css('display','none');
				    $('.mask').css('display','none');
				  },2000);
			}
		});

	});

	//收藏
	$(".shoucang").bind("click", function(){
		var t = $(this);
		if(t.hasClass("disabled")) return false;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = masterDomain + '/login.html'
			return false;
		}

		t.addClass("disabled");
		var type = t.hasClass("has") ? "del" : "add";

		$.ajax({
			url: masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=job&type="+type+"&id="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled");
				if(data.state == 100){

					if(type == "add"){
						t.find('.liked').css('display','block');
						t.find('.like').hide();
					}else{
						t.find('.liked').hide();
						t.find('.like').show();
					}
					t.toggleClass('has');

				}else{
					// $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
					alert('网络错误，收藏失败！')
				}
			},
			error: function(){
				t.removeClass("disabled");
				// $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
				alert('网络错误，收藏失败！')
			}
		});

	});



})
