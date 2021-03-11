$(function(){


    $('.video-box').on('click',function(){
        $('.video-btn').css('display','-webkit-flex');
        $('#video-control').css('display','-webkit-flex');
        setTimeout(function(){ $('#video-control').css('display','none'); $('.video-btn').css('display','none');}, 5000);
    });

       var box = document.getElementById("video-control"); //box对象
        var video = document.getElementById("video"); //视频对象
        var play = document.getElementById("play"); //播放按钮
        var vbplay = document.getElementById("vbplay");//视频中间播放按钮
        var time = document.getElementById('time');
        var progress = document.getElementById("progress"); //进度条
        var bar = document.getElementById("bar"); //蓝色进度条
        var control = document.getElementById("control"); //声音按钮
        var sound = document.getElementById("sound"); //喇叭
        var full = document.getElementById("full") //全屏
        video.addEventListener('play', function() {
            play.className = "pause";
            $('.play-box').find('i').removeClass('play-icon').addClass('pause-icon');
        });
        video.addEventListener('pause', function() {
            play.className = "play";
            $('.play-box').find('i').removeClass('pause-icon').addClass('play-icon');
        });
        video.addEventListener('timeupdate', function() {
            var timeStr = parseInt(video.currentTime);
            var minute = parseInt(timeStr/60);
            if(minute == 0){
                if(timeStr < 10){
                    timeStr = "0"+timeStr  ;
                }
                minute = "00:"+timeStr;
            }else{
                var timeStr = timeStr%60;
                if(timeStr < 10){
                    timeStr = "0"+timeStr  ;
                }
                minute = minute +":"+timeStr;
            }
            time.innerHTML = minute;
        });
        video.addEventListener('volumechange', function() {
            if(video.muted) {
                sound.className = "soundoff"
            } else {
                sound.className = "soundon"
            }
        });
        full.addEventListener("click", function() {
            $('.video-box').toggleClass('fullscreen-box');
            $('.markBox').toggleClass('show');
            var type = $(this).hasClass('small') ? "del" : "add";
            if(type=="del"){
                $(this).removeClass('small')
            }else{
                $(this).addClass('small')
            }

        }, false)
        play.onclick = function() {
            if(video.paused) {
                play.className = "pause";
                video.play();
            } else {
                play.className = "play";
                video.pause();
            }
        }
        vbplay.onclick = function() {
            if (video.paused){
                video.play();
                video.value = "pause";
            }else{
                video.pause();
                video.value = "play";
            }
        }
        //进度条
        video.addEventListener("timeupdate", function() {
            var scales = video.currentTime / video.duration;
            bar.style.width = progress.offsetWidth * scales + "px";
            control.style.left = progress.offsetWidth * scales + "px";
        }, false);
        var move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
        control.addEventListener("touchstart", function(e) {
            var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
                if(leftv <= 0) {
                    leftv = 0;
                }
                if(leftv >= progress.offsetWidth) {
                    leftv = progress.offsetWidth;
                }
                control.style.left = leftv + "px"
        }, false);
        control.addEventListener('touchmove', function(e) {
            var leftv = e.touches[0].clientX - progress.offsetLeft - box.offsetLeft;
                if(leftv <= 0) {
                    leftv = 0;
                }
                if(leftv >= progress.offsetWidth) {
                    leftv = progress.offsetWidth;
                }
            control.style.left = leftv + "px"
        }, false);
        control.addEventListener("touchend", function(e) {
            var scales = control.offsetLeft / progress.offsetWidth;
            video.currentTime = video.duration * scales;
            video.play();
            document.onmousemove = null;
            document.onmousedown = null;
        //video.pause();
        }, false);
        sound.onclick = function() {
            if(video.muted) {
                video.muted = false;
                sound.className = "soundon"
            } else {
                video.muted = true;
                sound.className = "soundoff"
            }
        }
    


// var v = document.getElementById("video1");
//  var c = document.getElementById("myCanvas");
//      ctx = c.getContext('2d');
//      //每20毫秒画一次图
//      v.addEventListener('play', function() {
//          var i = window.setInterval(function() {
//              ctx.drawImage(v, 0, 0, 270, 135);
//              //打印当前视频的播放时间
//              // console.log(v.currentTime);
//              //当视频结束的时候去掉循环
//              if(v.ended){
//                 clearInterval(i)
//             }
//          }, 20);
//      }, false);
//      //将视频暂停，然后观察canvas里面的效果
//      setTimeout(function(){
//         v.pause();
//      },4000);
//      //将视频播放，然后观察canvas里面的效果
//      setTimeout(function(){
//         v.play();
//      },7000)
// $(".bofang").click(function(){
//      v.play();  
// })
// $(".zanting").click(function(){
//      v.pause();  
// })

// 点赞
$('.comment_list ul').delegate('.dianzan','click',function(){
  var t = $(this);
  if(t.hasClass('active')){
    t.removeClass('active');
    var b = t.text();
    b--;
    t.text(b)
  }else{
    t.addClass('active');
    var c = t.text();
    c++;
    t.text(c);
  }
});
// 评论框处的点赞
$('.fabulous').click(function(){
  var t = $(this);
  if(!t.find('i').hasClass('active')){
    t.find('i').addClass('active');
  }else{
    t.find('i').removeClass('active')
  }
});




})