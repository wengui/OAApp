// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  


//API地址常量
//var API_ADDRESS = 'http://202.120.117.54:8080/gzjkyApi/'; //定义了常量
var API_ADDRESS = 'http://192.168.1.168:8080/hairunOAApi/'; //定义了常量

Date.prototype.Format = function(fmt) { //author: meizz   
		var o = {
			"M+": this.getMonth() + 1, //月份   
			"d+": this.getDate(), //日   
			"h+": this.getHours(), //小时   
			"m+": this.getMinutes(), //分   
			"s+": this.getSeconds(), //秒   
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
			"S": this.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

//页面跳转
function pageJump(page) {
	mui.openWindow({
		url: page,
		id: page,
		waiting: {
			autoShow: false //自动显示等待框，默认为true
		}
	});
}

//咨询页面跳转
function addPageJump(page) {
	mui.openWindow({
		url: page,
		id: page,
		show: {  
        autoShow: true, //页面loaded事件发生后自动显示，默认为true  
    	},
		waiting: {
			autoShow: false //自动显示等待框，默认为true
		}
	});
}

//根据病人名字和时间显示通知详情ajax
function info(name, time) {
	mui.openWindow({
				url: 'message.html',
				id: 'message.html',
				show: {  
		        	autoShow: true, //页面loaded事件发生后自动显示，默认为true  
		    	},
				waiting: {
					autoShow: false //自动显示等待框，默认为true
				}
			});
};

function swicthPush()
{
	 var int=window.setInterval("clock()",60000)//1m执行一次
};	 

function clock()
{
	var messageSetList = JSON.parse(localStorage.getItem("messageSet"));//取回messageSet值  
	var messageSetFlag = JSON.parse(localStorage.getItem("messageSetFlag"));//取回messageSet值
	if (messageSetList != null && messageSetList.length > 0) {
		for (var i = 0; i < messageSetList.length; i++) {
			// 用药提醒
			if(messageSetList[i].remindFlag == '1' && messageSetFlag.medicationremind == '1'){
				
				var str = "你有一条用药提醒消息！";
	
				// 通知周期
				if(messageSetList[i].txzq == '一天'){
					var hours = new Date().getHours();
					var minutes = new Date().getMinutes();
					var time = '';
					if(minutes < '10'){
						time = hours+':0'+minutes;
					}else{
						time = hours+':'+minutes;
					}
					console.log(messageSetList[i].txtime);
					console.log(time);
					console.log(messageSetList[i].txtime == time);
					if(messageSetList[i].txtime == time){
						createLocalPushMsg(str);
					}
					
				}else if(messageSetList[i].txzq == '一周'){
					var weekDate = new Date().getDay();
					
					// 每周周一发送提醒消息
					if(weekDate == '1'){
						var hours = new Date().getHours();
						var minutes = new Date().getMinutes();
						var time = hours+':'+minutes;
						if(messageSetList[i].txtime == time){
							createLocalPushMsg(str);
						}
					}
					
				}else if(messageSetList[i].txzq == '一月'){
					var monthDate = new Date().getDate();
					// 每月的一号发送消息提醒
					if(monthDate == '1'){
						var hours = new Date().getHours();
						var minutes = new Date().getMinutes();
						var time = hours+':'+minutes;
						if(messageSetList[i].txtime == time){
							createLocalPushMsg(str);
						}
					}
				}
			}else if(messageSetList[i].remindFlag == '2' &&　messageSetFlag.bloodlevelremind == '1'){
				// 测压提醒
				// TODO
			}
		}
	}

};

/**
 * 本地创建一条推动消息
 */
function createLocalPushMsg(str){
	var options = {cover:false};
	plus.push.createMessage( str, "LocalMSG", options );
	if(plus.os.name=="iOS"){
		outLine('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
	}
};
