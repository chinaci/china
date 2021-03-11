/*!
 * mobileSelect.js
 * (c) 2017-present onlyhom
 * Released under the MIT License.
 */

(function() {
	function getClass(dom,string) {
		return dom.getElementsByClassName(string);
	}
	function in_arr(arr, str){
		for(var i in arr){
			if(arr[i] == str) return true;
		}
		return false;
	}
	//构造器
	function MobileSelect(config) {
		if(config.skin == "skin_fix_option"){
			if(Object.keys(config.wheels[0].data).length > 10){
				if(config.multi != 1) config.skin = "";
			}
		}

		this.mobileSelect;
		this.wheelsData = config.wheels;
		this.jsonType =  false;
		this.cascadeJsonData = [];
		this.displayJson = []; 
		this.cascade = false;
		this.startY;
		this.moveEndY;
		this.moveY;
		this.oldMoveY;
		this.offset = 0;
		this.offsetSum = 0;
		this.oversizeBorder;
		this.curDistance = [];
		this.clickStatus = false;
		this.isPC = true;
		this.config = config;
		this.init(config);
	}
	MobileSelect.prototype = {
		constructor: MobileSelect,
		init: function(config){
			var _this = this; 
			_this.keyMap = config.keyMap ? config.keyMap : {id:'id', value:'value', childs:'childs'};
			_this.checkDataType();
			_this.renderWheels(_this.wheelsData, config.cancelBtnText, config.ensureBtnText, config);
			_this.trigger = document.querySelector(config.trigger);
			if(!_this.trigger){
				console.error('mobileSelect has been successfully installed, but no trigger found on your page.');
				return false;
			}
			_this.wheel = getClass(_this.mobileSelect,'wheel');
			_this.slider = getClass(_this.mobileSelect,'selectContainer'); 
			_this.wheels = _this.mobileSelect.querySelector('.wheels');
			_this.liHeight = _this.mobileSelect.querySelector('li').offsetHeight;
			_this.ensureBtn = _this.mobileSelect.querySelector('.ensure');
			_this.cancelBtn = _this.mobileSelect.querySelector('.cancel');
			_this.grayLayer = _this.mobileSelect.querySelector('.grayLayer');
			_this.popUp = _this.mobileSelect.querySelector('.content');
			_this.callback = config.callback ? config.callback : function(){};
			_this.transitionEnd = config.transitionEnd ? config.transitionEnd : function(){};
			_this.optionClick = config.optionClick ? config.optionClick : function(){};
			_this.initPosition = config.position ? config.position : [];
			_this.titleText = config.title ? config.title : '';
			_this.connector = config.connector ? config.connector : ' ';
			_this.name = config.name ? config.name : '';
			_this.skin = config.skin ? config.skin : '';
			_this.multi = config.multi ? config.multi : 0;
			_this.trigger.style.cursor='pointer';
			_this.setStyle(config);
			_this.setTitle(_this.titleText);
			_this.checkCascade();
			if (_this.cascade) {
				_this.initCascade();
			}
			//定位 初始位置
			if(_this.initPosition.length < _this.slider.length){
				var diff = _this.slider.length - _this.initPosition.length;
				for(var i=0; i<diff; i++){
					_this.initPosition.push(0);
				}
			}
			_this.setCurDistance(_this.initPosition);
			_this.addListenerAll();

			//按钮监听
			_this.cancelBtn.addEventListener('click',function(){
			_this.mobileSelect.classList.remove('mobileSelect-show');
		    	$('html').removeClass('md_fixed');	
		    });

		    _this.ensureBtn.addEventListener('click',function(){
				_this.mobileSelect.classList.remove('mobileSelect-show');
				var tempValue = '', len = _this.wheel.length, tempValue_ = [], tempId_ = [];
		    	for(var i=0; i<len; i++){
		    		var s = _this.getInnerHtml(i).replace(config.name, '');
		    		var id = _this.getInnerId(i);
		    		if(i ==len-1){
		    			tempValue += s;
		    		}else{
		    			tempValue += s + _this.connector;
		    		}
		    		tempId_.push(id);
		    		tempValue_.push(s);
		    	}

		    	var spec = 0;
		    	if(len == 2){
		    		if(tempValue_[0] == tempValue_[1]){
		    			spec = tempValue_[0] == 0 ? 1 : 0;
		    			tempValue = tempValue_[0];
		    		}else{
			    		if(tempId_[0] == 0 && tempId_[1] == 0){
			    			spec = 1;
			    			tempValue = tempValue_[0];
			    		}else if(config.minTxt && config.maxTxt){
			    			if(tempId_[0] == 0){
				    			spec = 1;
				    			tempValue = tempValue_[1]+config.minTxt
				    		}else if(tempId_[1] == 0){
				    			spec = 1;
				    			tempValue = tempValue_[0]+config.maxTxt
				    		}
			    		}
		    		}
		    	}
		    	tempValue += spec ? '' : (config.name ? config.name : '');
		    	if(config.valBox){
		    		var valBox = document.createElement(config.valBox);
		    		valBox.innerHTML = tempValue;
		    		_this.trigger.innerHTML = '';
		    		_this.trigger.appendChild(valBox);
		    	}else{
		    		_this.trigger.innerHTML = tempValue;
		    	}
		    	var cls = _this.trigger.className;
		    	_this.trigger.className = cls + ' selected';
		    	_this.callback(_this.getIndexArr(),_this.getValue());
		    	var r = _this.getValue();
		    	var ids = [];
		    	for(var i = 0; i < r.length; i++){
		    		ids.push(r[i][_this.keyMap.id]);
		    	}
		    	// console.log(tempId_)
		    	_this.trigger.setAttribute('data-id', tempId_.join(","));
		    	var field = _this.trigger.getAttribute('data-field');
		    	if(field != undefined && field != ''){
		    		var d_field = document.getElementById(field);
		    		if(d_field == null){
		    			d_field = document.createElement("input");
		    			d_field.id = field;
		    			d_field.name = field;
		    			d_field.type = 'hidden';
		    			_this.trigger.parentNode.appendChild(d_field); 
		    		}
		    		d_field.value = tempId_.join(",");
		    	}
		    	$('html').removeClass('md_fixed');
		    });

		    _this.trigger.addEventListener('click',function(){
		    	$('.mobileSelect-show').removeClass('mobileSelect-show');
		    	_this.mobileSelect.classList.add('mobileSelect-show');
		    	$('html').addClass('md_fixed');
		    });
		    _this.grayLayer.addEventListener('click',function(){
		    	_this.mobileSelect.classList.remove('mobileSelect-show');
		    	$('html').removeClass('md_fixed');
		    });
		    _this.popUp.addEventListener('click',function(){
		    	event.stopPropagation(); 
		    });

			_this.fixRowStyle(); //修正列数
		},

		setTitle: function(string){
			var _this = this;
			_this.titleText = string;
			_this.mobileSelect.querySelector('.title').innerHTML = _this.titleText;
		},

		setStyle: function(config){
			var _this = this;
			if(config.ensureBtnColor){
				_this.ensureBtn.style.color = config.ensureBtnColor;
			}
			if(config.cancelBtnColor){
				_this.cancelBtn.style.color = config.cancelBtnColor;
			}
			if(config.titleColor){
				_this.title = _this.mobileSelect.querySelector('.title');
				_this.title.style.color = config.titleColor;
			}
			if(config.textColor){
				_this.panel = _this.mobileSelect.querySelector('.panel');
				_this.panel.style.color = config.textColor;
			}
			if(config.titleBgColor){
				_this.btnBar = _this.mobileSelect.querySelector('.btnBar');
				_this.btnBar.style.backgroundColor = config.titleBgColor;
			}
			if(config.bgColor){
				_this.panel = _this.mobileSelect.querySelector('.panel');
				_this.shadowMask = _this.mobileSelect.querySelector('.shadowMask');
				_this.panel.style.backgroundColor = config.bgColor;
				_this.shadowMask.style.background = 'linear-gradient(to bottom, '+ config.bgColor + ', rgba(255, 255, 255, 0), '+ config.bgColor + ')';
			}
		},

		show: function(){
		    this.mobileSelect.classList.add('mobileSelect-show');	
		},

		renderWheels: function(wheelsData, cancelBtnText, ensureBtnText, config){
			var _this = this;
			var cancelText = cancelBtnText ? cancelBtnText : '取消';
			var ensureText = ensureBtnText ? ensureBtnText : '确认';
			_this.mobileSelect = document.createElement("div");
			// _this.mobileSelect.className = "mobileSelect";
			_this.mobileSelect.className = config.skin ? ("mobileSelect " + config.skin) : "mobileSelect";
			_this.mobileSelect.innerHTML = 
		    	'<div class="grayLayer"></div>'+
		        '<div class="content">'+
		            '<div class="btnBar">'+
		                '<div class="fixWidth">'+
		                    '<div class="cancel">'+ cancelText +'</div>'+
		                    '<div class="title"></div>'+
		                    '<div class="ensure">'+ ensureText +'</div>'+
		                '</div>'+
		            '</div>'+
		            '<div class="panel">'+
		                '<div class="fixWidth">'+
		                	'<div class="wheels">'+
			                '</div>'+
		                    '<div class="selectLine"></div>'+
		                    '<div class="shadowMask"></div>'+
		                '</div>'+
		            '</div>'+
		        '</div>';
		    document.body.appendChild(_this.mobileSelect);

			//根据数据长度来渲染

			var tempHTML='';
			for(var i=0; i<wheelsData.length; i++){ 
			//列
				tempHTML += '<div class="wheel"><ul class="selectContainer">';
				if(_this.jsonType){
					for(var j=0; j<wheelsData[i].data.length; j++){ 
					//行
						var cls = j == 0 ? ' class="active"' : '';
						tempHTML += '<li data-id="'+wheelsData[i].data[j][_this.keyMap.id]+'"'+cls+'>'+wheelsData[i].data[j][_this.keyMap.value]+'</li>';
					}
				}else{
					for(var j=0; j<wheelsData[i].data.length; j++){ 
					//行
						tempHTML += '<li>'+wheelsData[i].data[j]+'</li>';
					}
				}
				tempHTML += '</ul></div>';
			}
			_this.mobileSelect.querySelector('.wheels').innerHTML = tempHTML;
		},

		addListenerAll: function(){
			var _this = this;
			
			for(var i=0; i<_this.slider.length; i++){
				//手势监听
				(function (i) {
					_this.addListenerLi(i);
					_this.addListenerWheel(_this.wheel[i], i);
				})(i);
			}
		},

		addListenerWheel: function(theWheel, index){
			var _this = this;

			if(_this.config.skin != "skin_fix_option"){}
				theWheel.addEventListener('touchstart', function () {
					_this.touch(event, this.firstChild, index);
				},false);
				theWheel.addEventListener('touchend', function () {
					_this.touch(event, this.firstChild, index);
				},false);
				theWheel.addEventListener('touchmove', function () {
					_this.touch(event, this.firstChild, index);
				},false);
			
		},

		addListenerLi:function(sliderIndex){
			var _this = this;
			var curWheelLi = _this.slider[sliderIndex].getElementsByTagName('li');
			for(var j=0; j<curWheelLi.length;j++){
				(function (j) {
					curWheelLi[j].addEventListener('click',function(){
						_this.singleClick(this, j, sliderIndex);
					},false);
				})(j);
			}
		},

		checkDataType: function(){ 
			var _this = this;
			if(typeof(_this.wheelsData[0].data[0])=='object'){
				_this.jsonType = true;
			}
		},

		checkCascade: function(){
			var _this = this;
			if(_this.jsonType){ 
				var node = _this.wheelsData[0].data;
				for(var i=0; i<node.length; i++){
					if(_this.keyMap.childs in node[i] && node[i][_this.keyMap.childs].length > 0){
						_this.cascade = true;
						_this.cascadeJsonData = _this.wheelsData[0].data;
						break;
					}
				}
			}else{
				_this.cascade = false;
			}
		},

		generateArrData: function (targetArr) {
			var tempArr = [];
			var keyMap_id = this.keyMap.id;
			var keyMap_value = this.keyMap.value;
			for(var i=0; i<targetArr.length; i++){
				var tempObj = {}; 
				tempObj[keyMap_id] = targetArr[i][this.keyMap.id];
				tempObj[keyMap_value] = targetArr[i][this.keyMap.value];
				tempArr.push(tempObj);	
			}
			return tempArr;
		},

		initCascade: function(){
			var _this = this;
			_this.displayJson.push(_this.generateArrData(_this.cascadeJsonData));
			if(_this.initPosition.length>0){
				_this.initDeepCount = 0;
				_this.initCheckArrDeep(_this.cascadeJsonData[_this.initPosition[0]]);
			}else{
				_this.checkArrDeep(_this.cascadeJsonData[0]);
			}
			_this.reRenderWheels();
		},

		initCheckArrDeep: function (parent) {
			var _this = this;
			if(parent){
				if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
					_this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs])); 
					_this.initDeepCount++;
					var nextNode = parent[_this.keyMap.childs][_this.initPosition[_this.initDeepCount]];
					if(nextNode){
						_this.initCheckArrDeep(nextNode);
					}else{
						_this.checkArrDeep(parent[_this.keyMap.childs][0]);
					}
				}
			}
		},

		checkArrDeep: function (parent) { 
			//检测子节点深度  修改 displayJson
			var _this = this;
			if(parent){
				if (_this.keyMap.childs in parent && parent[_this.keyMap.childs].length > 0) {
					_this.displayJson.push(_this.generateArrData(parent[_this.keyMap.childs])); //生成子节点数组
					_this.checkArrDeep(parent[_this.keyMap.childs][0]);//检测下一个子节点
				}
			}
		},

		checkRange: function(index, posIndexArr){
			var _this = this;
			var deleteNum = _this.displayJson.length-1-index;
			for(var i=0; i<deleteNum; i++){
				_this.displayJson.pop(); //修改 displayJson
			}
			var resultNode;
			for (var i = 0; i <= index; i++){
				if (i == 0)
					resultNode = _this.cascadeJsonData[posIndexArr[0]];
				else {
					resultNode = resultNode[_this.keyMap.childs][posIndexArr[i]];
				}
			}
			_this.checkArrDeep(resultNode);
			_this.reRenderWheels();
			_this.fixRowStyle();
			_this.setCurDistance(_this.resetPostion(index, posIndexArr));
		},

		resetPostion: function(index, posIndexArr){
			var _this = this;
			var tempPosArr = posIndexArr;
			var tempCount;
			if(_this.slider.length > posIndexArr.length){ 
				tempCount = _this.slider.length - posIndexArr.length;
				for(var i=0; i<tempCount; i++){  
					tempPosArr.push(0);
				}
			}else if(_this.slider.length < posIndexArr.length){
				tempCount = posIndexArr.length - _this.slider.length;
				for(var i=0; i<tempCount; i++){
					tempPosArr.pop();
				}	
			}
			for(var i=index+1; i< tempPosArr.length; i++){
				tempPosArr[i] = 0;
			} 
			return tempPosArr;
		},

		reRenderWheels: function(){
			var _this = this;
			//删除多余的wheel
			if(_this.wheel.length > _this.displayJson.length){
				var count = _this.wheel.length - _this.displayJson.length;
				for(var i=0; i<count; i++){
					_this.wheels.removeChild(_this.wheel[_this.wheel.length-1]);
				}
			}
			for(var i=0; i<_this.displayJson.length; i++){ 
			//列
				(function (i) {
					var tempHTML='';
					if(_this.wheel[i]){
						//console.log('插入Li');
						for(var j=0; j<_this.displayJson[i].length; j++){ 
						//行
							tempHTML += '<li data-id="'+_this.displayJson[i][j][_this.keyMap.id]+'">'+_this.displayJson[i][j][_this.keyMap.value]+'</li>';
						}
						_this.slider[i].innerHTML = tempHTML;

					}else{
						var tempWheel = document.createElement("div");
						tempWheel.className = "wheel";
						tempHTML = '<ul class="selectContainer">';
						for(var j=0; j<_this.displayJson[i].length; j++){ 
						//行
							tempHTML += '<li data-id="'+_this.displayJson[i][j][_this.keyMap.id]+'">'+_this.displayJson[i][j][_this.keyMap.value]+'</li>';
						}
						tempHTML += '</ul>';
						tempWheel.innerHTML = tempHTML;

						_this.addListenerWheel(tempWheel, i);
				    	_this.wheels.appendChild(tempWheel); 
					}
					_this.addListenerLi(i);
				})(i);
			}
		},

		updateWheels:function(data){
			var _this = this;
			if(_this.cascade){
				_this.cascadeJsonData = data;
				_this.displayJson = [];
				_this.initCascade();
				if(_this.initPosition.length < _this.slider.length){
					var diff = _this.slider.length - _this.initPosition.length;
					for(var i=0; i<diff; i++){
						_this.initPosition.push(0);
					}
				}
				_this.setCurDistance(_this.initPosition);
				_this.fixRowStyle();
			}
		},

		updateWheel: function(sliderIndex, data){
			var _this = this;
			var tempHTML='';
	    	if(_this.cascade){
	    		console.error('级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源');
				return false;
	    	}
	    	else if(_this.jsonType){
				for(var j=0; j<data.length; j++){
					tempHTML += '<li data-id="'+data[j][_this.keyMap.id]+'">'+data[j][_this.keyMap.value]+'</li>';
				}
				_this.wheelsData[sliderIndex] = {data: data};
	    	}else{
				for(var j=0; j<data.length; j++){
					tempHTML += '<li>'+data[j]+'</li>';
				}
				_this.wheelsData[sliderIndex] = data;
	    	}
			_this.slider[sliderIndex].innerHTML = tempHTML;
			_this.addListenerLi(sliderIndex);
		},

		fixRowStyle: function(){
			var _this = this;
			var width = (100/_this.wheel.length).toFixed(2);
			for(var i=0; i<_this.wheel.length; i++){
				_this.wheel[i].style.width = width+'%';
			}
		},

	    getIndex: function(distance){
	        return Math.round((2*this.liHeight-distance)/this.liHeight);
	    },

	    getIndexArr: function(){
	    	var _this = this;
	    	var temp = [];
	    	for(var i=0; i<_this.curDistance.length; i++){
	    		temp.push(_this.getIndex(_this.curDistance[i]));
	    	}
	    	return temp;
	    },

	    getValue: function(){
	    	var _this = this;
	    	var temp = [];
	    	var positionArr = _this.getIndexArr();
	    	if(_this.cascade){
		    	for(var i=0; i<_this.wheel.length; i++){
		    		temp.push(_this.displayJson[i][positionArr[i]]);
		    	}
	    	}
	    	else if(_this.jsonType){
		    	for(var i=0; i<_this.curDistance.length; i++){
		    		temp.push(_this.wheelsData[i].data[_this.getIndex(_this.curDistance[i])]);
		    	}
	    	}else{
		    	for(var i=0; i<_this.curDistance.length; i++){
		    		temp.push(_this.getInnerHtml(i));
		    	}
	    	}
	    	return temp;
	    },

	    calcDistance: function(index){
	    	if(typeof index == 'string'){
	    		var li = this.mobileSelect.querySelectorAll('li');
	    		for(var i = 0; i < li.length; i++){
	    			var l = li[i], id = l.getAttribute('data-id');
	    			if(id == index){
	    				index = i;
	    				break;
	    			}
	    		}
			}
			return 2*this.liHeight-index*this.liHeight;
	    },

	    setCurDistance: function(indexArr){
	    	var _this = this;
	    	var temp = [];
	    	for(var i=0; i<_this.slider.length; i++){
	    		temp.push(_this.calcDistance(indexArr[i]));
	    		_this.movePosition(_this.slider[i],temp[i]);
	    	}
	    	_this.curDistance = temp;
	    },

	    fixPosition: function(distance){
	        return -(this.getIndex(distance)-2)*this.liHeight;
	    },

	    movePosition: function(theSlider, distance, time){
	    	var _this = this;
	    	if(time == 0){
	    		theSlider.className = 'selectContainer notrans';
	    	}
	    	
	    	if(_this.config.skin != "skin_fix_option"){
	        theSlider.style.webkitTransform = 'translate3d(0,' + distance + 'px, 0)';
	        theSlider.style.transform = 'translate3d(0,' + distance + 'px, 0)';
	      }
	      if(time == 0){
		      setTimeout(function(){
	    			theSlider.className = 'selectContainer';
	    		},300);
		    }
	    },

	    locatePostion: function(index, posIndex, time){
	    	this.curDistance[index] = this.calcDistance(posIndex);
	    	this.movePosition(this.slider[index],this.curDistance[index], time);
	    },

	    updateCurDistance: function(theSlider, index){
	    	this.curDistance[index] = parseInt(theSlider.style.transform.split(',')[1]);
	    },

	    getDistance:function(theSlider){
	    	return parseInt(theSlider.style.transform.split(',')[1]);
	    },

	    getInnerHtml: function(sliderIndex){
	    	var _this = this;
	    	if(_this.multi){
	    		var txt = [];
	    		var curWheelLi = _this.slider[sliderIndex].getElementsByTagName('li');
					for(var j=0; j<curWheelLi.length;j++){
						if(curWheelLi[j].className.indexOf("active") >= 0){
							txt.push(curWheelLi[j].innerHTML);
						}
					}
					return txt.join(",");
	    	}else{
		    	var index = _this.getIndex(_this.curDistance[sliderIndex]);
	    		return _this.slider[sliderIndex].getElementsByTagName('li')[index].innerHTML;
		    }
	    },

	    getInnerId: function(sliderIndex){
	    	var _this = this;
	    	if(_this.multi){
	    		var txt = [];
	    		var curWheelLi = _this.slider[sliderIndex].getElementsByTagName('li');
					for(var j=0; j<curWheelLi.length;j++){
						if(curWheelLi[j].className.indexOf("active") >= 0){
							txt.push(curWheelLi[j].getAttribute('data-id'));
						}
					}
					return txt.join(",");
				}else{
		    	var index = _this.getIndex(_this.curDistance[sliderIndex]);
		    	return _this.slider[sliderIndex].getElementsByTagName('li')[index].getAttribute('data-id');
		    }
	    },

	    touch: function(event, theSlider, index){
	    	var _this = this;
	    	event = event || window.event;
	    	switch(event.type){
	    		case "touchstart":
			        _this.startY = event.touches[0].clientY;
			        _this.oldMoveY = _this.startY;
	    			break;

	    		case "touchend":


			        _this.moveEndY = event.changedTouches[0].clientY;
			        _this.offsetSum = _this.moveEndY - _this.startY;

					//修正位置
			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length-3)*_this.liHeight; 


			        //反弹
			        if(_this.curDistance[index] + _this.offsetSum > 2*_this.liHeight){
			            _this.curDistance[index] = 2*_this.liHeight;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);

			        }else if(_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder){
			            _this.curDistance[index] = _this.oversizeBorder;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);
			        }

			        _this.transitionEnd(_this.getIndexArr(),_this.getValue(), index);

			        if(_this.cascade){
				        var tempPosArr = _this.getIndexArr();
				        tempPosArr[index] = _this.getIndex(_this.curDistance[index]);
			        	_this.checkRange(index, tempPosArr);
			        }

	    			break;

	    		case "touchmove":
	    			if(_this.skin != 'skin_fix_option' && _this.multi != 1){
			        event.preventDefault();
			      }else{
			      	$('html').addClass('md_fixed');
			      }
			        _this.moveY = event.touches[0].clientY;
			        _this.offset = _this.moveY - _this.oldMoveY;

			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.curDistance[index] + _this.offset;
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oldMoveY = _this.moveY;
			      
	    			break;
	    	}
	    },

	    dragClick: function(event, theSlider, index){
	    	var _this = this;
	    	event = event || window.event;
	    	switch(event.type){
	    		case "mousedown":
			        _this.startY = event.clientY;
			        _this.oldMoveY = _this.startY;
			        _this.clickStatus = true;
	    			break;

	    		case "mouseup":

			        _this.moveEndY = event.clientY;
			        _this.offsetSum = _this.moveEndY - _this.startY;

					//修正位置
			        _this.updateCurDistance(theSlider, index);
			        _this.curDistance[index] = _this.fixPosition(_this.curDistance[index]);
			        _this.movePosition(theSlider, _this.curDistance[index]);
			        _this.oversizeBorder = -(theSlider.getElementsByTagName('li').length-3)*_this.liHeight; 


			        //反弹
			        if(_this.curDistance[index] + _this.offsetSum > 2*_this.liHeight){
			            _this.curDistance[index] = 2*_this.liHeight;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);

			        }else if(_this.curDistance[index] + _this.offsetSum < _this.oversizeBorder){
			            _this.curDistance[index] = _this.oversizeBorder;
			            setTimeout(function(){
			                _this.movePosition(theSlider, _this.curDistance[index]);
			            }, 100);
			        }

			        _this.clickStatus = false;
			        _this.transitionEnd(_this.getIndexArr(),_this.getValue());
			        if(_this.cascade){
				        var tempPosArr = _this.getIndexArr();
				        tempPosArr[index] = _this.getIndex(_this.curDistance[index]);
			        	_this.checkRange(index, tempPosArr);
			        }
	    			break;

	    		case "mousemove":
			        event.preventDefault();
			        if(_this.clickStatus){
				        _this.moveY = event.clientY;
				        _this.offset = _this.moveY - _this.oldMoveY;
				        _this.updateCurDistance(theSlider, index);
				        _this.curDistance[index] = _this.curDistance[index] + _this.offset;
				        _this.movePosition(theSlider, _this.curDistance[index]);
				        _this.oldMoveY = _this.moveY;
			        }
	    			break;
	    	}
	    },

	    singleClick: function(theLi, index, sliderIndex){
	    	var _this = this;
	        if(_this.cascade){
		        var tempPosArr = _this.getIndexArr();
		        tempPosArr[sliderIndex] = index;
	        	_this.checkRange(sliderIndex, tempPosArr);

	        }else{
		        _this.curDistance[sliderIndex] = (2-index)*_this.liHeight;
		        _this.movePosition(theLi.parentNode, _this.curDistance[sliderIndex]);
	        }
	        _this.optionClick(theLi, index, sliderIndex);
	    }

	};

	if (typeof exports == "object") {
		module.exports = MobileSelect;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return MobileSelect;
		})
	} else {
		window.MobileSelect = MobileSelect;
	}
})();
