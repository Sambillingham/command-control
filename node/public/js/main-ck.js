$(function(){function s(e){$(".connection-screen").removeClass("show");if(e===1){$(".starting-screen").addClass("show");setTimeout(function(){$(".starting-screen").removeClass("show");$(".level").addClass("show");$("#level-num").text(e);setTimeout(function(){$(".level").removeClass("show")},9500)},1e4)}else{$(".level").addClass("show");$("#level-num").text(e);setTimeout(function(){$(".level").removeClass("show")},9500)}}function o(){$(".arduino-connection").text("Ship controls are Active!");setTimeout(function(){$(".arduino-connection").text("")},5e3)}function u(e){var t=e.max,n=e.currentH,r=n/t*100;displayPerc=r.toString()+"%";console.log(displayPerc);$(".health").css("width",displayPerc);r<70&&r>=40?$(".health").css("background-color","#f7e12c"):r<40&&$(".health").css("background-color","#F75B07")}function a(e){console.log(e);var t=window.innerWidth,n=3,r=t/n,s=Math.floor(e/r),o=0,u=0;console.log("timer interval",s);i=window.setInterval(f,s)}function f(){currentWith=parseInt($(".timer").css("width"));newWidth=currentWith-3;$(".timer").css("width",newWidth)}function l(e,t){thisValue=e;thisId=t;console.log("ultrasound",thisId,": ",e);$("#ul"+t).text(e);thisValue==1?$("#ir"+thisId).css("height","75"):thisValue==2?$("#ir"+thisId).css("height","150"):thisValue==3?$("#ir"+thisId).css("height","225"):thisValue==4?$("#ir"+thisId).css("height","300"):thisValue==5?$("#ir"+thisId).css("height","375"):$("#ir"+thisId).css("height","0")}function c(e,t){thisValue=e;thisId=t;thisValue==1?$("#button"+thisId).removeClass("button-off").addClass("button-on"):$("#button"+thisId).removeClass("button-on").addClass("button-off")}function h(e,t){thisId=t;thisValue=e;switch(thisId){case 0:case 9:thisValue==1?$("#button"+thisId).css("background","url(/img/redRocker-on.png)"):$("#button"+thisId).css("background","url(/img/redRocker-off.png)");break;case 1:case 12:thisValue==1?$("#button"+thisId).css("background","url(/img/greenRocker-on.png)"):$("#button"+thisId).css("background","url(/img/greenRocker-off.png)");break;case 2:case 5:case 6:case 11:thisValue==1?$("#button"+thisId).css("background","url(/img/toggle-on.png)"):$("#button"+thisId).css("background","url(/img/toggle-off.png)");break;case 3:case 4:thisValue==1?$("#button"+thisId).css("background","url(/img/smallRedRocker-on.png)"):$("#button"+thisId).css("background","url(/img/smallRedRocker-off.png)");break;case 7:thisValue==1?$("#button"+thisId).css("background","url(/img/roundRedRocker-on.png)"):$("#button"+thisId).css("background","url(/img/roundRedRocker-off.png)");break;case 8:thisValue==1?$("#button"+thisId).css("background","url(/img/black-toggle-on.png)"):$("#button"+thisId).css("background","url(/img/black-toggle-off.png)");break;case 10:thisValue==1?$("#button"+thisId).css("background","url(/img/smallRedRockerVertical-on.png)"):$("#button"+thisId).css("background","url(/img/smallRedRockerVertical-off.png)")}}function p(e,t){thisValue=e;thisId=t;$("#slider"+thisId).css("background","url(/img/largeSlider-"+thisValue+".png)")}function d(e,t){thisValue=e;thisId=t;$("#slider"+thisId).css("background","url(/img/smallSlider-"+thisValue+".png)")}function v(e,t){thisValue=e;thisId=t;$("#rotary"+thisId+"num").text(thisValue);$("#rotary"+thisId).css("background","url(/img/redRotary-"+thisValue+".png)")}function m(e,t){thisValue=e;thisId=t;$("#rotary"+thisId+"num").text(thisValue);$("#rotary"+thisId).css("background","url(/img/silver-Rotary-"+thisValue+".png)")}function g(e,t){thisValue=e;thisId=t;$("#rotary"+thisId+"num").text(thisValue);$("#rotary"+thisId).css("background","url(/img/black-Rotary-"+thisValue+".png)")}function y(e){allInputNames=e;$("#btn0name").text(allInputNames.rocker0);$("#btn1name").text(allInputNames.rocker1);$("#btn2name").text(allInputNames.toggle0);$("#btn3name").text(allInputNames.rocker2);$("#btn4name").text(allInputNames.rocker3);$("#btn5name").text(allInputNames.toggle1);$("#btn6name").text(allInputNames.toggle2);$("#btn7name").text(allInputNames.rocker4);$("#btn8name").text(allInputNames.toggle3);$("#btn9name").text(allInputNames.rocker5);$("#btn10name").text(allInputNames.rocker6);$("#btn11name").text(allInputNames.toggle4);$("#btn12name").text(allInputNames.rocker7);$("#slider0name").text(allInputNames.slider0);$("#slider1name").text(allInputNames.slider1);$("#slider2name").text(allInputNames.slider2);$("#slider3name").text(allInputNames.slider3);$("#rotary0name").text(allInputNames.rotary0);$("#rotary1name").text(allInputNames.rotary1);$("#rotary2name").text(allInputNames.rotary2);$("#rotary3name").text(allInputNames.rotary3)}function b(e){console.log(e);e.rocker0!=t.rocker0?h(e.rocker0,0):e.rocker1!=t.rocker1?h(e.rocker1,1):e.toggle0!=t.toggle0?h(e.toggle0,2):e.rocker2!=t.rocker2?h(e.rocker2,3):e.rocker3!=t.rocker3?h(e.rocker3,4):e.toggle1!=t.toggle1?h(e.toggle1,5):e.toggle2!=t.toggle2?h(e.toggle2,6):e.rocker4!=t.rocker4?h(e.rocker4,7):e.toggle3!=t.toggle3?h(e.toggle3,8):e.rocker5!=t.rocker5?h(e.rocker5,9):e.rocker6!=t.rocker6?h(e.rocker6,10):e.toggle4!=t.toggle4?h(e.toggle4,11):e.rocker7!=t.rocker7?h(e.rocker7,12):e.slider0!=t.slider0?p(e.slider0,0):e.slider1!=t.slider1?d(e.slider1,1):e.slider2!=t.slider2?d(e.slider2,2):e.slider3!=t.slider3?p(e.slider3,3):e.rotary0!=t.rotary0?v(e.rotary0,0):e.rotary1!=t.rotary1?m(e.rotary1,1):e.rotary2!=t.rotary2?m(e.rotary2,2):e.rotary3!=t.rotary3&&g(e.rotary3,3);t=e}var e=io.connect("commandcontrol.sambillingham.com"),t={rocker0:undefined,rocker1:undefined,rocker2:undefined,rocker3:undefined,rocker4:undefined,rocker5:undefined,rocker6:undefined,rocker7:undefined,toggle0:undefined,toggle1:undefined,toggle2:undefined,toggle3:undefined,toggle4:undefined,slider0:undefined,slider1:undefined,slider2:undefined,slider3:undefined,rotary0:undefined,rotary1:undefined,rotary2:undefined,rotary3:undefined,ultrasound0:undefined,keySwitch0:undefined,redButton0:undefined,missileSwitch0:undefined},n=window.location.pathname.split("/"),r=n[1],i=0;console.log(r);r=="player2"?$("html, body").animate({scrollTop:1},"fast"):$("html, body").animate({scrollTop:50},"fast");e.on("connect",function(){e.emit("playerID",r);e.on("map",function(e){b(e);o()});e.on("instruction",function(e){if(e.reset===!0){window.clearInterval(i);$("#incomming").text("");$(".timer").css("width","100%")}else{a(e.timer);$("#incomming").text(e.message)}$(".timer").css("width","100%")});e.on("names",function(e){y(e)});e.on("new-level",function(e){s(e)});e.on("health",function(e){u(e)});e.on("end-game",function(e){switch(r){case"player1":window.location="/end1";break;case"player2":window.location="/end2";break;case"player3":window.location="/end3"}});e.on("game-reset",function(e){switch(r){case"player1":window.location="/player1";break;case"end1":window.location="/player1";break;case"player2":window.location="/player2";break;case"end2":window.location="/player2";break;case"player3":window.location="/player3";break;case"end3":window.location="/player3"}});e.on("stats",function(e){console.log(e);$("#levels").text(e.levelsCompleted);$("#switches").text(e.switches);$("#pots").text(e.pots)});e.on("no-start",function(e){e===!0&&$(".start-error").text("Not all Players are connected - reconnect");setTimeout(function(){$(".start-error").text("")},3e3)});e.on("disconect",function(){e.emit("playerID",r+"d")})});$("#start").click(function(){console.log("Starting...");e.emit("start",1)});(r=="end1"||r=="end2"||r=="end3")&&setTimeout(function(){switch(r){case"end1":window.location="/player1";break;case"end2":window.location="/player2";break;case"end3":window.location="/player3"}},2e4)});