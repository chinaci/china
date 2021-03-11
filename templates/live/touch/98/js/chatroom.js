$(function(){
	$('html, body').animate({scrollTop: $(document).height()}, 50);//让滚动条一直置于页面最底部

	var page = 1;
	var isload = false;
	RongIMLib.RongIMClient.init(appKey,null,config);
	var instance = RongIMClient.getInstance();
    // 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            break;
		    }
		}
	});
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    switch(message.messageType){
				case RongIMClient.MessageType.TextMessage:
	                if(chatRoomId==message.targetId){//需要判断是否是相同的聊天室，不然后的话信息就会乱窜其他的聊天室。
						updateMessage(message.content.content);
	                }
	                break;
	            case RongIMClient.MessageType.LiveComment:
	                html='';
               		if(chatRoomId==message.targetId){//需要判断是否是相同的聊天室，不然后的话信息就会乱窜其他的聊天室。
						console.log(message);
						html +='<li class="chat_info">';
						html +='<div class="info_left"><img src="'+message.content.avatarUrl+'" onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';"></div>';
						html +='<div class="info_right"><p class="chat_name color1">'+message.content.username+'</p><p class="chat_con"><span>'+message.content.comment+'</span></p></div>';
						html +='</li>';
               		}
               		var t = document.getElementById("main_info");
					t.innerHTML += html;
	            	break;
            }
		}
	});
	//开始链接

	RongIMClient.connect(token, {
		onSuccess: function(userId) {
            //链接成功后 才可 发送消息
            RongIMClient.userInfo = {
				data : {userId: userId,userName:username,userPhoto:userphoto},
				status : "ok",
				info : "链接成功"
			};
			joinChat(RongIMClient.userInfo);
			loaddata();
		},
		onTokenIncorrect: function() {
			//console.log('token无效');
		},
		onError:function(errorCode){
		  console.log(errorCode);
		}
	});
	var callback = {
        onSuccess: function(userId) {
            console.log("Reconnect successfully." + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError:function(errorCode){
            console.log(errorcode);
        }
    };
    var reconfig = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        url: staticPath + 'js/rong/RongIMLib-2.2.9.min.js',
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        rate: [100, 1000, 3000, 6000, 10000]
    };
    RongIMClient.reconnect(callback, reconfig);
	function joinChat(userInfo){
		RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
		  onSuccess: function() {
		  		var messageName = "LiveComment"; // 消息名称。
				var objectName = "HNLiveComment"; // 消息内置名称，请按照此格式命名。
				var mesasgeTag = new RongIMLib.MessageTag(false,false);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
				var prototypes = ["username","comment","avatarUrl"]; // 消息类中的属性名。
				RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes);

			   var chatRoom = {
					id : chatRoomId,
					currentUser : userInfo.data,
					getInfo : function (params,callbacks){
						var order = params.order; //RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
						var memberCount = params.memberCount; // 获取聊天室人数 （范围 0-20 ）
						RongIMClient.getInstance().getChatRoomInfo(chatRoomId, memberCount, order,callbacks);
					},
					quit : function(callbacks){
						RongIMClient.getInstance().quitChatRoom(chatRoomId, callbacks);
					},
					sendMessage : function(content, callbacks){
						var conversationType = RongIMLib.ConversationType.CHATROOM;
						//var msg = new RongIMLib.TextMessage(content);
						var msg = new RongIMClient.RegisterMessage.LiveComment({username:userInfo.data.userName,comment:content.content,avatarUrl:userInfo.data.userPhoto});
						RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, callbacks);
					}
				};
				apiDemo(chatRoom);
		  },
		  onError: function(error) {
			// 加入聊天室失败
			console.log('聊天室失败');
		  }
		});
	}
	function apiDemo(chatRoom){
		$("#rc-chatroom-input").keyup(function (e) {
			if (!e) {
				var e = window.event;
			}
			if (e.keyCode) {
				code = e.keyCode;
			}
			else if (e.which) {
				code = e.which;
			}
			if (code === 13) {
				$("#rc-chatroom-button").click();
			}
		});

		$('.box_bottom .bg').bind('click', function(){
			$(this).hide();
			//$('.box_bottom').addClass('fixed');
			$("#rc-chatroom-input").focus();
          setTimeout(function(){
            //$("html,body").scrollTop(document.body.scrollHeight);
            //$("#rc-chatroom-input").focus();
},5000);
		});

		$("#rc-chatroom-input").blur(function(){
			$('.box_bottom .bg').show();
			//$('.box_bottom').removeClass('fixed');
          setTimeout(function(){
            //$("html,body").scrollTop(document.body.scrollHeight);
		  },300);
		});

		//点击发送消息
		$("#rc-chatroom-button").click(function(){
			var userid = $.cookie(cookiePre+"login_user");
			if(userid == null || userid == ""){
				window.location.href = masterDomain+'/login.html';
				return false;
			}

			var content = $("#rc-chatroom-input").val();
			var content1 = $("#rc-chatroom-input").val();
			if(content==undefined){
				alert('内容不能为空');
				return;
			}
			var userid = chatRoom.currentUser.userId;
			var username = chatRoom.currentUser.userName;
			var userphoto = chatRoom.currentUser.userPhoto;
			content='<li class="chat_info"><div class="info_left"><img src="'+userphoto+'" onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';"></div><div class="info_right"><p class="chat_name color1">'+username+'</p><p class="chat_con"><span>'+content+'</span></p></div></li>';
			chatRoom.sendMessage({"content" : content1}, {
		        onSuccess: function (message) {
		            updateMessage(content);
		            chatTalk(chatRoom.id,userid,username,userphoto,content1)
					$("#rc-chatroom-input").attr("value",'');
		        },
		        onError: function (errorCode,message) {
		            console.log("发送聊天室消息失败",errorCode);
		        }
		    });
		});
	}
	/*
	发送弹幕方法
	*/
	function updateMessage(message){
		var t = document.getElementById("main_info");
		$("#rc-chatroom-input").val('');
		t.innerHTML += message;
		t.scrollTop = t.scrollHeight;
	}
	//聊天记录插入数据
	function chatTalk(chatid,userid,username,userphoto,content){
		var url = masterDomain + "/include/ajax.php?service=live&action=chatTalk";
		$.ajax({
	      url: url,
	      data: "chatid="+chatid+"&userid="+userid+"&username="+username+"&userphoto="+userphoto+"&content="+content,
	      type: "GET",
	      dataType: "jsonp",
	      success: function (msg) {
	        if(msg.state == 100){
	        	console.log('suc');
	        }else{
	        	console.log('error');
	        }
	      },
	      error: function(){
	      	console.log('网络错误，操作失败！');
	      }
	    });
	}
	//加载聊天室数据
	function loaddata(){
		isload = true;
		var url = masterDomain + "/include/ajax.php?service=live&action=talkList&chatid="+chatRoomId;
		var t = $("#main_info");
		$.ajax({
	      url: url,
	      data: "page="+page,
	      type: "GET",
	      dataType: "jsonp",
	      success: function (msg) {
	        if(msg.state == 100){
				var list = msg.info.list, html ="";
				if(list.length > 0){
					for(var i = 0; i < list.length; i++){
						html +='<li class="chat_info">';
						html +='<div class="info_left"><img src="'+list[i].userphoto+'" onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';"></div>';
						html +='<div class="info_right"><p class="chat_name color1">'+list[i].username+'</p><p class="chat_con"><span>'+list[i].content+'</span></p></div>';
						html +='</li>';
					}
					isload = false;
					//最后一页
					if(page >= msg.info.pageInfo.totalPage){
						isload = true;
					}
				}
				t.prepend(html);

				if(page == 1){
					$("#main_info").scrollTop($("#main_info")[0].scrollHeight);
				}
	        }else{
	        	console.log('error');
	        }
	      },
	      error: function(){
	      	console.log('网络错误，操作失败！');
	      }
	    });

	}
	$("#main_info").scroll(function() {
		if($("#main_info").scrollTop() <= 50 && !isload){
			page++;
			loaddata();
		}
	});

});
