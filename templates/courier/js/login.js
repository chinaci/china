 var logininfo = utils.getStorage("lwm_courier_login");
 var user = pass = '';
    if(logininfo){
    	user = logininfo.user;
    	pass = logininfo.pass;
    }
var dataGeetest = "";	

// input输入框 组件
var InputText = {
	props: ['type','placeholder','name','areacode','readonly','value'],
	data:function(){
		return {
			eyeshow:true,
			input_ :'',
			password_:'',
		}
	},
	
	methods:{
		input(){
			var el = event.target;
			input_ = event.target.value;
			var name = $(el).attr('name');
			if(name=='username'){
				 this.$parent.userinfo.username = input_
			}else if(name=='password'){
				this.input_ = input_
				this.$parent.userinfo.password = input_;
			}else if(name=='telphone'){
				this.$parent.userphone.userphone = input_
			}else if(name=='captcha'){
				if(isNaN(input_)){
					showErr("请输入正确的验证码！");return false;
				}
				this.$parent.userphone.validcode = input_;
			}else if(name=='areaCode'){
				this.$parent.userphone.areaCode = input_
			}else if(name=='nickname'){
				this.$parent.reg_info.nickname = input_
			}else if(name=='sex'){
				this.$parent.reg_info.sex = input_;
			}else if(name=='age'){
				this.$parent.reg_info.age = input_
			}else if(name=='sure_password'){
				this.input_ = input_
				this.$parent.userinfo.password = input_;
			}
			
			if(name=='password' || name=='sure_password'){
				this.password_ = input_
			}else{
				this.password_ = ''
			}
		},
		
		// 显示弹窗
		pop_show:function(){
			$(".popl_mask").show();
			$(".popl_box").css('bottom','0')
		},
		getCode:function(){
			// 获取验证码
			var el = event.currentTarget;
			var phone = $('input[name="telphone"]').val();

			if(phone==''||phone==undefined){
				showErr(langData['siteConfig'][20][239]);//'请输入手机号'
				return false;
			}else{
				if(!geetest){
					this.$options.methods.sendVerCode();
				}else{
					this.$options.methods.yanzheng()
				}
				
			}
			// this.$options.methods.coutDown();
		},
		
		yanzheng:function(){
			console.log(111);return  false;

			//极验验证
			   var handlerPopupReg = function (captchaObjReg) {
			   	// captchaObjReg.appendTo("#popupReg-captcha-mobile");
			   
			   	// 成功的回调
			   	captchaObjReg.onSuccess(function () {
			   		var validate = captchaObjReg.getValidate();
			   		dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;
			   		sendVerCode();
			   		// $("#maskReg, #popupReg-captcha-mobile, .gt_popup").removeClass("show");
			   	});
			   	captchaObjReg.onClose(function () {
			   		// getYzmBtn.text(langData['siteConfig'][4][1]);
			   	})
			   
			   	window.captchaObjReg = captchaObjReg;
			    };
				
				if (captchaObjReg) {
					captchaObjReg.verify();
				}
				$.ajax({
				        url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
				        type: "get",
				        dataType: "json",
				        success: function (data) {
				            initGeetest({
				                gt: data.gt,
				                challenge: data.challenge,
				                offline: !data.success,
				                new_captcha: true,
				                product: "bind",
				                width: '312px'
				            }, handlerPopupFpwd);
				        }
				    });
		},
		openeye:function(){
			this.eyeshow = !this.eyeshow;
			this.$root.psd_show = this.eyeshow ;
			if(!this.eyeshow){
				$("input[name='sure_password']").attr('type','text')
			}else{
				$("input[name='sure_password']").attr('type','password')
			}

		},
	
		 //发送验证码
		sendVerCode:function(){
		        var btn = $(".get_code");
		        var phone = $("input[name='telphone']").val()
				var areacode = $("input[name='areaCode']").val()
		        if(btn.hasClass("disabled")) return;
		        btn.addClass("disabled").text(langData['siteConfig'][23][99]);
				data = {'phone':phone,"areaCode":areacode}
				var tt = this;
		        $.ajax({
		            url: "/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=auth",
		            data: data+dataGeetest,
		            type: "GET",
		            dataType: "jsonp",
		            success: function (data) {
		                //获取成功
		                if(data && data.state == 100){
		                    tt.$options.methods.coutDown();
		                    btn.removeClass("disabled")
		                    //获取失败
		                }else{
		                    btn.removeClass("disabled").text(langData['siteConfig'][19][736]);
		                    showErr(data.info);
		                }
		            },
		            error: function(){
		                btn.removeClass("disabled").text(langData['siteConfig'][19][736]);
		                showErr(langData['siteConfig'][20][173]);
		            }
		        });
		    }
	},
	template: `
	<div v-bind:class="['inpbox',{tel_inpbox:name =='telphone'}]">
	  <span v-if='name =="telphone"' class="areacode" v-on:click="pop_show">{{areacode}}</span>
	  <input v-if='name =="telphone"' type="hidden" name="areaCode" v-model="areacode" >
	  <button v-if='name =="captcha"' class="get_code">`+langData['siteConfig'][19][736]+`</button>
	  <input v-bind:type="name==('password'||'sure_password')?(eyeshow === true?'password':'text'):type" v-bind:placeholder="placeholder"  v-bind:name="name" v-bind:readonly="readonly"  v-on:input="input" :maxlength='(name =="captcha"||name =="age")?"6":""'   :value="value?value:input_">
	  <em></em>
	  <i v-if='name=="password"' v-on:click="openeye" v-bind:class="[{ eye_open: !eyeshow === true }]"></i>
	 </div>
	`,
};

// loading组件
var loading = {
	template:`
	<div class="loading"></div>	
	`,
}
var reginfo ={
	template:`
	<div class="reginfo_show" >
		<h4>`+langData['waimai'][10][118]+`</h4>
		<div class="regbox ">
			<div class="left_img"><div class="img"></div><h5>{{this.$parent.reg_info.nickname}}</h5></div>
			<ul class="right_info fn-clear">
				<li>
					<p>`+langData['siteConfig'][19][12]+`</p>
					<h5>{{this.$parent.reg_info.age}}`+langData['siteConfig'][13][29]+`</h5>
				</li>
				<!--
				<li class="fn-hide">
					<p>`+langData['siteConfig'][19][7]+`</p>
					<h5 v-if="this.$parent.reg_info.sex==1">男</h5>
					<h5 v-else >女</h5>
				</li>
				-->
				<li style="width:51%;">
					<p>`+langData['siteConfig'][22][40]+`</p>
					<h5>{{this.$parent.userphone.userphone}}</h5>
				</li>
			</ul>
		</div>
	</div>	
	`,
}
// 按钮组件
var btnLogin = {
	data:function(){
		return {
			info:'',
			params:'',
			load:false,
			
		}
	},
	components:{
		'loading-div':loading,
		
	},
	methods:{
		// 登录
		login:function(){
			var logintype = this.$parent.currentTab;
			if(logintype=='accountLogin'){
				var ainfo = this.$parent.userinfo;
				if(ainfo.username==''){
					showErr(langData['waimai'][10][120]);  //请输入账号
					return false;
				}else if(ainfo.password==''){
					showErr(langData['waimai'][10][119]);  //'请输入密码'
					return false;
				}else{
					params = {
						'username' :ainfo.username,
						'password' :ainfo.password,
						'logintype':this.$parent.currentTab,
					}
					this.login_access(params)
				}
				this.$parent.codetype  = 2;
			}else{
				var ainfo = this.$parent.userphone;
				if(ainfo.userphone==''){
					showErr(langData['siteConfig'][20][239]); //'请输入手机号'
					return false;
				}else if(ainfo.validcode==''){
					showErr(langData['siteConfig'][20][176]);  //'请输入验证码'
					return false;
				}else{
					params = {
						'userphone':ainfo.userphone,
						'validcode':ainfo.validcode,
						'areaCode':ainfo.areaCode,
						'logintype':this.$parent.currentTab,
					}
					this.login_access(params)
				}
			}
		},
		login_access:function(params){
			var logintype = this.$parent.currentTab;
			this.load = true;
			let param = new URLSearchParams();
			if(logintype == 'accountLogin'){
				param.append('username', params.username)
				param.append('password', params.password)
				param.append('logintype', params.logintype)
			}else{
				param.append('username', params.userphone)
				param.append('validcode', params.validcode)
				param.append('areaCode', params.areaCode)
				param.append('logintype', params.logintype)
			}
				
			axios({
				method: 'post',
				url: '/include/ajax.php?service=waimai&action=courierLogin',
				data: param,
			})
			.then((response)=>{
				tt = 1;
				var data = response.data;
				this.load = false;
				if(data.state!=100){
					showErr(data.info)
				}else{
					var userid = data.info.did;
					setupWebViewJavascriptBridge(function(bridge) {
						bridge.callHandler('appLoginFinish', {'passport':userid}, function(){});
						bridge.callHandler('pageClose', function(){});
					});
					if(data.info.info == 'setpws'){
						// showErr(data.info.info);
						this.$root.login = false;
						this.$root.reg_success = true;
					}else{
						var data = {"user":params.username, "pass":params.password}
						utils.setStorage("lwm_courier_login", JSON.stringify(data));
						location.href = "/?service=waimai&do=courier&template=index";
					}
				}
			});
				
		},
		register_go:function(){
			 this.$parent.login 	= false;
			 this.$parent.codetype  = 1;
		},

		register:function(){
			var ainfo = this.$parent.reg_info;
			var ainfo1 = this.$parent.userphone;
			if(ainfo.nickname==''){
				showErr(langData['siteConfig'][20][330]); //'请输入姓名'
				return false;
			}else if(ainfo.age==''){
				showErr(langData['waimai'][10][121]);  //请输入年龄
				return false;
			}else if(ainfo1.userphone==''){
				showErr(langData['waimai'][10][122]);  //请验证手机号码
				return false;
			}else if(ainfo1.validcode==''){
				showErr(langData['waimai'][10][123]);  //请输入手机验证码
				return false;
			}else{
				params = {
					'nickname':ainfo.nickname,
					'age':ainfo.age,
					'sex':ainfo.sex,
					'telephone':ainfo1.userphone,
					'areaCode':ainfo1.areaCode,
					'validcode':ainfo1.validcode,
				}
				this.$parent.reg_info = {
					'nickname':ainfo.nickname,
					'age':ainfo.age,
					'sex':ainfo.sex,
				};
				this.$parent.userphone = {
					'userphone':ainfo1.userphone,
					'validcode':ainfo1.validcode,
					'areaCode':ainfo1.areaCode,
				}
				this.register_access(params)

			}
		},
		register_access:function(data){
			// this.load = true;
			let param = new URLSearchParams();
			param.append('phone', data.telephone)
			param.append('areaCode', data.validcode)
			param.append('code', data.areaCode)
			param.append('sex', data.sex)
			param.append('age', data.age)
			param.append('username', data.nickname);
			axios({
				method: 'post',
				url: '/include/ajax.php?service=waimai&action=courierReg',
				data: param,
			})
			.then((response)=>{
				tt = 1;
				var data = response.data;
				this.load = false;
				if(data.state == 100){
					showErr(data.info)
					this.$parent.regcheck  = true;
				}else{
					showErr(data.info)
					window.reload();
				}
			});
			// this.$parent.reg_success = true;
		}
		
		
	},
	template: `
	<div class="btn_box">
		<button v-if="this.$parent.login" type="button" class="login_btn" @click="login"><slot></slot></button>
		<a v-if="this.$parent.login" href="javascript:;" class="reg_url" @click="register_go">`+langData['waimai'][10][126]+`</a>
		<button v-if="!this.$parent.login" type="button" class="login_btn" @click="register"><slot></slot></button>
		<loading-div v-if="load"></loading-div>
	</div>
	
	`,
}


var sexSelect;  //单选
// 登录
var pageVue = new Vue({
	el: "#page",
	data: {
	  currentTab: "accountLogin",  //默认账号登录
	  tabs: [{'id':"accountLogin",'name':langData['waimai'][10][124]}, {'id':"noPsdLogin",'name':langData['waimai'][10][125]}],  //账号登录  免密登录
	  userinfo:{'username':user,'password':pass,'areaCode':''},
	  userphone:{'userphone':'','validcode':'','areaCode':86},
	  areaCode:86,
	  login:true,   //登录页
	  regcheck:false,   //注册审核
	  reg_success:false, //还没注册
      codetype:'',
	  reg_info:{
	  	'nickname':'',
	  	'age':'',
	  	'sex':'',
	  },
		psd_show:true,
	},
	
	components:{
		'input-txt':InputText,
		'btn-login':btnLogin,
		'loading-div':loading,
		'reg-info':reginfo
	},
	methods:{
		pop_hide:function(){
			$(".popl_mask").hide();
			$(".popl_box").css('bottom','-9rem')
		},
		Changecode:function(){
			var el = event.currentTarget;
			areaCode = $(el).attr('data-code');
			$(el).addClass('achose').siblings('li').removeClass('achose');
			this.$options.methods.pop_hide();
			$("input[name='areaCode']").val(areaCode);
			$(".areacode").text(areaCode)
			this.userphone.areaCode = areaCode
		},
		save_psd:function(){
			var password 	= this.$refs.psd.password_;
			var repassword 	= this.$refs.rpsd.password_;
			if(password == undefined || repassword == undefined){
				//请填写完整
				showErr(langData['waimai'][10][127]);
			}
			var reg = new RegExp("^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$");
			if(!reg.test(password)|| !reg.test(repassword)){
				//"温馨提示：请输入大、小写字母、数字或特殊字符！
				showErr(langData['waimai'][10][48]); return false;
			}

			var data = '&password='+this.$refs.psd.password_;

			axios({
				method: 'post',
				url: '/include/ajax.php?service=waimai&action=courierEditpwsphone&from=loginafter&edittype=edpws'+data,
			})
			.then((response)=>{
				var data = response.data;
				if(data.state==100){

					showErr(data.info);

					window.location = '/?service=waimai&do=courier&template=index';

				}else{
					showErr(data.info);
				}

				$(".reload").removeClass("rotate")
			});
		}
		
		
	},
	mounted(){
		if(!geetest){
		    $('body').delegate(".get_code",'click',function(){
				if($(this).hasClass("disabled")) return;
				var areaCode = $("input[name='areaCode']").val();
				 var phone = $("input[name='telphone']").val();
				 if(phone == ''){
					 showErr(langData['siteConfig'][20][463]);//请输入手机号码
					 return false;
				 }
					 
				 if(areaCode == "86"){
					var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
					if(!phoneReg.test(phone)){
						showErr(langData['siteConfig'][20][465]);   //手机号码格式不正确
						return false;
					}
				}
		        sendVerCode();
		      
		    });
		  }else{
		    //极验验证
			var handlerPopupFpwd = function (captchaObjReg) {
				// captchaObjReg.appendTo("#popupReg-captcha-mobile");
	
				// 成功的回调
				captchaObjReg.onSuccess(function () {
					var validate = captchaObjReg.getValidate();
					dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;
					sendVerCode();
					// $("#maskReg, #popupReg-captcha-mobile, .gt_popup").removeClass("show");
				});
				captchaObjReg.onClose(function () {
					// getYzmBtn.text(langData['siteConfig'][4][1]);
				})
	
				window.captchaObjReg = captchaObjReg;
		     };
		
		    //获取验证码
			$('body').delegate(".get_code",'click',function(){
				  if($(this).hasClass("disabled")) return;
				  var areaCode = $("input[name='areaCode']").val();
				 var phone = $("input[name='telphone']").val();
				 if(phone == ''){
					 showErr(langData['siteConfig'][20][463]);//请输入手机号码
					 return false;
				 }
	 
				 if(areaCode == "86"){
					var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
					if(!phoneReg.test(phone)){
						showErr(langData['siteConfig'][20][465]);   //手机号码格式不正确
						return false;
					}
				}
			
					if (captchaObjReg) {
						captchaObjReg.verify();
					}
			
				 
			})
		
		
		
		    $.ajax({
		        url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
		        type: "get",
		        dataType: "json",
		        success: function (data) {
		            initGeetest({
		                gt: data.gt,
		                challenge: data.challenge,
		                offline: !data.success,
		                new_captcha: true,
		                product: "bind",
		                width: '312px'
		            }, handlerPopupFpwd);
		        }
		    });
		  }

	},
	watch:{
		login:function(){
			$(".mobileSelect").remove();
			if(!this.login){
				setTimeout(function(){
					sexSelect = new MobileSelect({
						trigger: '.reg_box .inpbox input[name="sex"] ',
						title: '',//房型选择
						wheels: [
									{data: [langData['waimai'][10][128],langData['waimai'][10][129]]},
								   
								],
						position:[0],
						callback:function(indexArr, data){
							$('.reg_box .inpbox input[name="sex"]').val(data);
							changeval(data)
						}
					});
				},600)
				
			}
			
		}
	}
	
	
});



//注册

var showErrTimer;
function showErr(data) {
	showErrTimer && clearTimeout(showErrTimer);
	$(".popErr").remove();
	$("body").append('<div class="popErr"><p>' + data + '</p></div>');
	$(".popErr p").css({
		"margin-left": -$(".popErr p").width() / 2,
		"left": "50%"
	});
	$(".popErr").css({
		"visibility": "visible"
	});
	showErrTimer = setTimeout(function() {
		$(".popErr").fadeOut(300, function() {
			$(this).remove();
		});
	}, 1500);
 }
 
 function changeval(data){
	 console.log(data);
	 pageVue.reg_info.sex = (data[0] == langData['siteConfig'][13][4]?1:0);
 }
 
 
 function coutDown(){
 	// 倒计时
 	var mydate= new Date();
 	mydate.setMinutes(mydate.getMinutes()+1); //当前时间加1分钟
 	var end_time = new Date(mydate).getTime();//月份是实际月份-1
 	var sys_second = (end_time-new Date().getTime())/1000;
 	var timer = setInterval(function(){
 		if (sys_second > 1) {
 			sys_second -= 1;
 			var second = Math.floor(sys_second % 60);
 			$(".get_code").attr("disabled","true");//添加disabled属性
 			$(".get_code").css("opacity",".5");
 			$(".get_code").html(second+"s");
 	
 		} else { 
 			$(".get_code").removeAttr("disabled");//移除disabled属性
 			$(".get_code").css("opacity","1");
 			$(".get_code").html(langData['siteConfig'][19][736]);  //"获取"
 			clearInterval(timer);//清楚定时器
 		}
 	}, 1000);
 }
   
   
   function sendVerCode(){
	   	var btn = $(".get_code");
	   	var phone = $("input[name='telphone']").val()
		var areacode = $("input[name='areaCode']").val()
	    var codetype = pageVue.codetype;
	   	if(btn.hasClass("disabled")) return;
	   	btn.addClass("disabled").text(langData['siteConfig'][23][99]);
		data = 'phone='+phone+'&areaCode='+areacode

		var tt   = this;
		var type = '';

		if(codetype == 1){
			type = 'signup';
		}else{
			type = 'sms_login';
		}
	   $.ajax({
		   url: "/include/ajax.php?service=siteConfig&action=getPhoneVerify&vertype=1&type="+type,
		   data: data+dataGeetest,
		   type: "GET",
		   dataType: "jsonp",
		   success: function (data) {
			   //获取成功
			   if(data && data.state == 100){
				   coutDown();
				   //获取失败
			   }else{
				   btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
				   showErr(data.info);
			   }
		   },
		   error: function(){
			   btn.removeClass("disabled").text(langData['siteConfig'][4][1]);
			   showErr(langData['siteConfig'][20][173]);
		   }
	   });
   }
