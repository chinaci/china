window.onload = function(){
    resize();
}
window.onresize = function(){
    resize();
}

function resize(){
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    var winH = document.documentElement.clientHeight || document.body.clientHeight;
    var pcM = (winH - 650) / 2;
    var pcBox = document.getElementById("pc_box");
    if(winH >= 700){
        pcBox.style.marginTop = pcM + "px";
    }
    if(winW <= 1130){
        var desW = 750;
        var desWfontSize = 100;
        document.documentElement.style.fontSize = winW / desW * 100 + 'px';
    }
}
