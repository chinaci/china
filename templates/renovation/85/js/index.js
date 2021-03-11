$(function(){
	//获取服务器当前时间
	var nowStamp = 0;
	$.ajax({
		"url": masterDomain+"/include/ajax.php?service=system&action=getSysTime",
		"dataType": "jsonp",
		"success": function(data){
			if(data){
				nowStamp = data.now;
			}
		}
	});
	//获取时间段
	function time_tran(time) {
	    var dur = nowStamp - time;
	    if (dur < 0) {
	        return transTimes(time, 2);
	    } else {
	        if (dur < 60) {
	            return dur+'秒前';
	        } else {
	            if (dur < 3600) {
	                return parseInt(dur / 60)+'分钟前';
	            } else {
	                if (dur < 86400) {
	                    return parseInt(dur / 3600)+'小时前';
	                } else {
	                    if (dur < 259200) {//3天内
	                        return parseInt(dur / 86400)+'天前';
	                    } else {
	                        return transTimes(time, 2);
	                    }
	                }
	            }
	        }
	    }
	}
	$(".find_lead ul li").click(function(){
		var x = $(this),
				index = x.index();
		x.addClass('FD_bc').siblings().removeClass('FD_bc');
		$('.find_list .find_con').eq(index).show().siblings().hide();
	})

	//异步加载装修公司列表
	var page = 1;
	var post = function() {
		$(".Renovation_list").find(".load-more").remove();
		$(".Renovation_list").append("<p class='loading'><img src='"+templatePath+"images/loading.gif'>加载中...</p>")
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=store&pageSize=10&page="+page,
			type: "GET",
			dataType: "jsonp",
			success: function(data) {
				if (data && data.state != 200) {
					if (data.state == 101) {
						$("#" + objId).html("<p class='loading'>" + data.info + "</p>");
					} else {
						var list = data.info.list,
							pageInfo = data.info.pageInfo,
							html = [];
						for (var i = 0; i < list.length; i++) {
								html.push('<div class="Renovation_detail fn-clear">');
								html.push('<div class="Ren_pic"><a target="_blank" href=" '+list[i].url+'"><img src=" '+list[i].logo+'" alt=""></a></div>');
								html.push('<div class="Ren_title">');
								html.push('<a href="'+list[i].url+'" target="_blank">'+list[i].company+'</a>');
								html.push('</div>');
								html.push('<div class="Ren_amount">');
								html.push('<span>'+list[i].teamCount+'</span>  位设计师<em>|</em>');
								html.push('<span>'+list[i].caseCount+'</span> 套案例<em>|</em>');
								html.push('<span>'+list[i].reseCount+'</span> 位预约<em>|</em>');
								html.push('<span>'+list[i].guestCount+'</span> 条评论');
								html.push('</div>');
								html.push('<div class="Ren_tel">');
								if (list[i].contact != "") {
									html.push('<i></i>'+list[i].contact+'');
								}else{
									html.push('<i></i>暂无联系方式！');
								}
								html.push('</div>');
								html.push('<div class="Ren_location"><i></i>'+list[i].address+'</div>');
								html.push('<div class="log_in"><a href="'+list[i].url+'" target="_blank">进入店铺</a></div>');
								html.push('</div>');
						}
						$(".Renovation_list").find(".loading").remove();
						$(".Renovation_list").append(html.join(""));
						if (page < pageInfo.totalPage) {
							$(".Renovation_list").append('<div class="load-more"><div class="load-add"><i></i><span>加载更多</span></div></div>');
						} else {
							$(".Renovation_list").append('<span class="mnbtn">:-)已经到最后啦~</span>');
						}

					}
				} else {
					$(".post").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
				}
			},
			error: function() {
				$(".post").html("<p class='loading'>数据获取失败，请稍候访问！</p>");
			}
		});

	};
	// 点击加载更多
	$(".Renovation_list").delegate(".load-more .load-add", "click", function(){
		var t = $(this);
		page++;
		post();
	});
	//区域
	$("#addr1").change(function(){
		var sel = $(this), id = sel.val();
		if(id != 0 && id != ""){
			$.ajax({
				type: "GET",
				url: masterDomain+"/include/ajax.php",
				data: "service=renovation&action=addr&son=0&type="+id,
				dataType: "jsonp",
				success: function(data){
					var i = 0, opt = [];
					if(data instanceof Object && data.state == 100){
						for(var key = 0; key < data.info.length; key++){
							opt.push('<option value="'+data.info[key]['id']+'">'+data.info[key]['typename']+'</option>');
						}
						$("#addr2").html('<option value="">街道</option>'+opt.join("")+'</select>');
					}else{
						$("#addr2").html('<option value="">街道</option>');
					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}else{
			$("#addr2").html('<option value="">街道</option>');
		}
	});


	$('.sqfwForm').submit(function(event){
		event.preventDefault();
		var f = $(this);
		f.find('.has-error').removeClass('has-error');
		var str = '',r = true;
		var btn = f.find(".submit");

		if(btn.hasClass("disabled")) return false;

		// 称呼
		var name = f.find('.username');
		var namev = $.trim(name.val());
		if(namev == '') {
			layer.tips('请填写您的称呼', '.username', {
				tips: [1, '#0FA6D8']
			});
			name.focus();
			r = false;
		}

		// 手机号
		var phone = f.find('.userphone');
		var phonev = $.trim(phone.val());
		if(phonev == '') {
			if (r) {
				layer.tips('请输入手机号码', '.userphone', {
					tips: [1, '#0FA6D8']
				});
				phone.focus();
			}
			r = false;
		}

		// 区域
		var addr1 = $('#addr1');
		if(addr1.val() == 0 || addr1.val() == "") {
			if (r) {
				layer.tips('请选择区域', '#addr1', {
					tips: [1, '#0FA6D8']
				});
			}
			r = false;
		}

		// 街道
		var addr2 = $('#addr2');
		if(addr2.val() == 0 || addr2.val() == "") {
			if (r) {
				layer.tips('请选择街道', '#addr2', {
					tips: [1, '#0FA6D8']
				});
			}
			r = false;
		}

		if(!r) {
			return false;
		}

		var data = [];
		data.push("people="+namev);
		data.push("contact="+phonev);
		data.push("addrid="+addr2.val());
		data.push("body="+$("#note").val());

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=renovation&action=sendEntrust",
			data: data.join("&"),
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				btn.removeClass("disabled").val("立即申请");
				if(data && data.state == 100){
					layer.msg('申请成功，工作人员收到您的信息后会第一时间与你联系，请保持您的手机畅通！');
				}else{
					layer.msg(data.info);
				}
			},
			error: function(){
				layer.msg("网络错误，请重试！");
			}
		});

		return false;

	});


})
