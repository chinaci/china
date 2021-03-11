var imgconfig =[
	{
		'imgid':'01',           //模板id
		'psize':'1440X2560',    //海报模板尺寸  长X宽
		'jlimit':5,             //海报显示职位条数
		'jposition':'220X1178', //职位定位   x轴  X y轴
		'jsize':'1000X890',     //职位宽度    长X宽
		'cposition':'450X2136', //公司定位   x轴  X y轴
		'csize':'890X312',      //公司尺寸    长X宽
		'qrsize':'312X312',     //二维码尺寸    长X宽
		'qrposition':'90X2136', //二维码定位     x轴  X y轴
		'intent':'48X2486'      //网址定位     x轴  X y轴
	},
	 {
        'imgid': '02',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '76X1186',
        'jsize': '1284X930',
        'cposition': '438X2140',
        'csize': '924X312',
        'qrsize': '312X312',
        'qrposition': '76X2140',
        'intent': '48X2486'
    },
    {
        'imgid': '03',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '90X1130',
        'jsize': '1260X964',
        'cposition': '456X2146',
        'csize': '890X304',
        'qrsize': '304X304',
        'qrposition': '98X2146',
        'intent': '58X2486'
    },
    {
        'imgid': '04',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '90X1132',
        'jsize': '1260X960',
        'cposition': '484X2136',
        'csize': '868X314',
        'qrsize': '314X314',
        'qrposition': '102X2136',
        'intent': '56X2486'
    },
    {
        'imgid': '05',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '64X1304',
        'jsize': '1316X888',
        'cposition': '0X2300',
        'csize': '1400X200',
        'qrsize': '384X384',
        'qrposition': '982X78',
        'intent': '62X2486'
    },
    {
        'imgid': '06',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '330X1074',
        'jsize': '988X946',
        'cposition': '500X2064',
        'csize': '860X322',
        'qrsize': '322X322',
        'qrposition': '122X2064',
        'intent': '107X2428'
    },
    {
        'imgid': '07',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '110X1036',
        'jsize': '990X926',
        'cposition': '486X2080',
        'csize': '890X320',
        'qrsize': '320X320',
        'qrposition': '108X2080',
        'intent': '50X2486'
    },
    {
        'imgid': '08',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '346X1140',
        'jsize': '994X940',
        'cposition': '492X2120',
        'csize': '900X330',
        'qrsize': '330X330',
        'qrposition': '120X2120',
        'intent': '48X2500'
    },
    {
        'imgid': '09',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '76X1194',
        'jsize': '1288X930',
        'cposition': '434X2152',
        'csize': '928X312',
        'qrsize': '312X312',
        'qrposition': '78X2152',
        'intent': '60X2486'
    },
    {
        'imgid': '10',
        'psize': '1440X2560',
        'jlimit': 5,
        'jposition': '330X1252',
        'jsize': '980X900',
        'cposition': '140X2202',
        'csize': '1184X200',
        'qrsize': '310X310',
        'qrposition': '912X740',
        'intent': '98X2426'
    },
]



var index;
for(var i =0 ;i<imgconfig.length;i++ ){
	if(imgconfig[i].imgid==imgid){
		index=i;
	}
}
$('.corpinfo .QRtip').before('<h2>'+jobinfo.name+'</h2><p>地址：'+jobinfo.addr+'</p><p class="tel">电话：'+jobinfo.tel+'</p>');  //插入公司信息
var bodyH = $('body').height(),bodyW = $('body').width();  //图片高度是窗口高度，并且获取窗口宽度

	var h = imgconfig[index].psize.split('X')[1]*1,w =imgconfig[index].psize.split('X')[0]*1
	var imgh = bodyH,imgw = imgh*w/h;
	if(bodyW<imgw){
		imgw = bodyW,
		imgh = imgw*h/w
	}

	$('.imgBox').css({'width': imgw, 'height': imgh});

	var bl = imgh/h;

	//定位职位
	var jtop_o = imgconfig[index].jposition.split('X')[1]*1,jleft_o = imgconfig[index].jposition.split('X')[0]*1,jw_o = imgconfig[index].jsize.split('X')[0]*1
	var jtop = jtop_o*imgh/h,  //获取垂直定位   图片宽度
		jleft = (jleft_o*imgh/h),
		jw =jw_o*imgh/h;
		$('.joblistbox').css({'top':jtop,'left':jleft,'width':jw});
	//定位二维码
	var qrw_o = imgconfig[index].qrsize.split('X')[0]*1,qrtop_o = imgconfig[index].qrposition.split('X')[1]*1,qrleft_o =imgconfig[index].qrposition.split('X')[0]*1
	var qrw =  qrw_o*imgh/h  ,qrtop = qrtop_o*imgh/h  ,qrleft = qrleft_o*imgh/h
	$('.qrcodeBox').css({'top':qrtop,'left':qrleft,'width':qrw,'height':qrw});

	//定位公司信息
	var ctop_o = imgconfig[index].cposition.split('X')[1]*1,cleft_o = imgconfig[index].cposition.split('X')[0]*1,cw_o = imgconfig[index].csize.split('X')[0]*1,ch_o =imgconfig[index].csize.split('X')[1]*1;
	var ctop = ctop_o*imgh/h,cleft=cleft_o*imgh/h,cw=cw_o*imgh/h,ch=ch_o*imgh/h;
	$('.corpinfo').css({'top':ctop,'left':cleft,'width':cw,'height':ch});

	//网址定位
	var itop_o = imgconfig[index].intent.split('X')[1]*1,iright_o = imgconfig[index].intent.split('X')[0]*1;
	var itop = itop_o*imgh/h,iright=iright_o*imgh/h
	$('.intent').css({'top':itop,'right':iright});

	var len = jobinfo.jobs.length;
	$('.joblistbox').empty();

	if(len>imgconfig[index].jlimit){
		len = imgconfig[index].jlimit;
	}

	for(var i=0; i<len; i++){
		if(jobinfo.jobs[i].money=='0'){
			jobinfo.jobs[i].money='面议'
		}
		$('.joblistbox').append('<li class="joblist"><div class="_left jobname">'+jobinfo.jobs[i].jname+'</div><div class="_right jobinfo"><p>待遇:'+jobinfo.jobs[i].money+'&nbsp;&nbsp;经验:'+jobinfo.jobs[i].jexpr+'&nbsp;&nbsp;学历:'+jobinfo.jobs[i].jedu+'</p></div></li>')
}





$(function(){

	$.ajax({
		url: "/include/ajax.php",
		type: "POST",
		data: {
			service: 'siteConfig',
			action: 'getWeixinQrPost',
			module: 'job',
			type: 'company',
			aid: id,
			title: wxconfig.title,
			description: wxconfig.description,
			imgUrl: wxconfig.imgUrl,
			link: wxconfig.link
		},
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.state == 100){
				$('.qrcodeBox img').attr('src', '/include/qrcode.php?data=' + response.info);
			}
		},
		error: function (xhr, status, error) {

		}
	});


    //生成图片
	html2canvas(document.querySelector(".imgBox"), {
        'backgroundColor':null,
        'useCORS':true,
    }).then(canvas => {
        var a = canvasToImage(canvas);
   		$('.drawImg').delay(1000).html(a);
   		$('.imgBox').hide();
   		console.log(imgw)
	});

    function canvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");  //把canvas转换成base64图像保存
        return image;
    }

});


//长按
var flag=1  //设置长按标识符
var timeOutEvent=0;
$(function(){
	$(".drawImg").on({
		touchstart: function(e){
			if(flag){
				clearTimeout(timeOutEvent);
				timeOutEvent = setTimeout("longPress()",800);
			}
		 	// e.preventDefault();
		},
		touchmove: function(){
            	clearTimeout(timeOutEvent);
		    	timeOutEvent = 0;
		},
		touchend: function(){
			if(timeOutEvent){
			    console.log("这是点击，不是长按");
			}else{
				flag=1;
			}
	   		clearTimeout(timeOutEvent);
			return false;
		}
	});
});

//长按执行的方法
function longPress(){
    var imgsrc = $(".drawImg").find('img').attr('src');
    if(imgsrc==''||imgsrc==undefined){
    	alert('下载失败，请重试');
    	return 0
    }
    flag=0;
    if(device.indexOf('huoniao_Android') > -1){
            utils.setStorage("huoniao_poster", imgsrc);
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler(
                    'saveImage',
                    {'value': "huoniao_poster"},
                    function(responseData){
                        if(responseData == "success"){
                            setTimeout(function(){
                                flag=1;
                            }, 200)
                        }
                    }
                );
            });
        }else{
           setupWebViewJavascriptBridge(function(bridge) {
        		bridge.callHandler(
        			'saveImage',
        			{'value': imgsrc},
        			function(responseData){
        				if(responseData == "success"){
        					setTimeout(function(){
        						flag=1;
        					}, 200)
        				}

        			},

        		);
        	});

    }
}
