define("biz_wap/utils/mmversion.js",[],function(){
"use strict";
function n(){
var n=/MicroMessenger\/([\d\.]+)/i,t=s.match(n);
return t&&t[1]?t[1]:!1;
}
function t(t,r,i){
var e=n();
if(e){
e=e.split("."),t=t.split("."),/\d+/g.test(e[e.length-1])||e.pop();
for(var o,s,u=f["cp"+r],c=0,a=Math.max(e.length,t.length);a>c;++c){
o=e[c]||0,s=t[c]||0,o=parseInt(o)||0,s=parseInt(s)||0;
var p=f.cp0(o,s);
if(!p)return u(o,s);
}
return i||0==r?!0:!1;
}
}
function r(n){
return t(n,0);
}
function i(n,r){
return t(n,1,r);
}
function e(n,r){
return t(n,-1,r);
}
function o(){
return u?"ios":a?"android":"unknown";
}
var s=navigator.userAgent,u=/(iPhone|iPad|iPod|iOS)/i.test(s),c=/Windows\sPhone/i.test(s),a=/(Android)/i.test(s),f={
"cp-1":function(n,t){
return t>n;
},
cp0:function(n,t){
return n==t;
},
cp1:function(n,t){
return n>t;
}
};
return{
get:n,
cpVersion:t,
eqVersion:r,
gtVersion:i,
ltVersion:e,
getPlatform:o,
isWp:c,
isIOS:u,
isAndroid:a
};
});define("appmsg/max_age.js",["biz_wap/utils/ajax.js"],function(e){
"use strict";
function a(){
window.location.href.indexOf("clearStorage=1")>=0&&(localStorage.removeItem("max-age-storage-test"),
console.log("清除 localStorage"));
var e=1,a=top.window.user_uin||0,t=0!==a&&Math.floor(a/100)%1e3<e;
if(t&&(o({
type:"GET",
url:"/mp/reportcache?type=1&random="+Math.random()
}),(new Image).src="/mp/reportcache?type=2&uin="+uin,localStorage&&null==localStorage.getItem("max-age-storage-test"))){
console.log("localstorage为空");
try{
localStorage.setItem("max-age-storage-test",!0),console.log("localStorage设置成功");
}catch(r){}
o({
type:"GET",
url:"/mp/reportcache?type=3&random="+Math.random()
});
}
}
var o=e("biz_wap/utils/ajax.js");
return a;
});define("biz_common/dom/attr.js",[],function(){
"use strict";
function t(t,e,n){
return"undefined"==typeof n?t.getAttribute(e):t.setAttribute(e,n);
}
function e(t,e,n,r){
t.style.setProperty?(r=r||null,t.style.setProperty(e,n,r)):"undefined"!=typeof t.style.cssText&&(r=r?"!"+r:"",
t.style.cssText+=";"+e+":"+n+r+";");
}
return{
attr:t,
setProperty:e
};
});define("biz_wap/utils/ajax.js",["biz_common/utils/url/parse.js","biz_common/utils/respTypes.js"],function(require,exports,module,alert){
"use strict";
function joinUrl(e){
var t={};
return"undefined"!=typeof uin&&(t.uin=uin),"undefined"!=typeof key&&(t.key=key),
"undefined"!=typeof pass_ticket&&(t.pass_ticket=pass_ticket),"undefined"!=typeof wxtoken&&(t.wxtoken=wxtoken),
"undefined"!=typeof top.window.devicetype&&(t.devicetype=top.window.devicetype),
"undefined"!=typeof top.window.clientversion&&(t.clientversion=top.window.clientversion),
t.x5=isx5?"1":"0",t.f="json",Url.join(e,t);
}
function reportRt(e,t,o){
var r="";
if(o&&o.length){
var n=1e3,s=o.length,a=Math.ceil(s/n);
r=["&lc="+a];
for(var i=0;a>i;++i)r.push("&log"+i+"=[rtCheckError]["+i+"]"+encodeURIComponent(o.substr(i*n,n)));
r=r.join("");
}
var c,p="idkey="+e+"_"+t+"_1"+r+"&r="+Math.random();
if(window.ActiveXObject)try{
c=new ActiveXObject("Msxml2.XMLHTTP");
}catch(_){
try{
c=new ActiveXObject("Microsoft.XMLHTTP");
}catch(d){
c=!1;
}
}else window.XMLHttpRequest&&(c=new XMLHttpRequest);
c&&(c.open("POST",location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?",!0),c.setRequestHeader("cache-control","no-cache"),
c.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),
c.setRequestHeader("X-Requested-With","XMLHttpRequest"),c.send(p));
}
function Ajax(obj){
var type=(obj.type||"GET").toUpperCase(),url=joinUrl(obj.url),mayAbort=!!obj.mayAbort,async="undefined"==typeof obj.async?!0:obj.async,xhr=new XMLHttpRequest,timer=null,data=null;
if("object"==typeof obj.data){
var d=obj.data;
data=[];
for(var k in d)d.hasOwnProperty(k)&&data.push(k+"="+encodeURIComponent(d[k]));
data=data.join("&");
}else data="string"==typeof obj.data?obj.data:null;
xhr.open(type,url,async);
var _onreadystatechange=xhr.onreadystatechange;
xhr.onreadystatechange=function(){
if("function"==typeof _onreadystatechange&&_onreadystatechange.apply(xhr),3==xhr.readyState&&obj.received&&obj.received(xhr),
4==xhr.readyState){
xhr.onreadystatechange=null;
var status=xhr.status;
if(status>=200&&400>status)try{
var responseText=xhr.responseText,resp=responseText;
if("json"==obj.dataType)try{
resp=eval("("+resp+")");
var rtId=obj.rtId,rtKey=obj.rtKey||0,rtDesc=obj.rtDesc,checkRet=!0;
rtId&&rtDesc&&RespTypes&&!RespTypes.check(resp,rtDesc)&&reportRt(rtId,rtKey,RespTypes.getMsg()+"[detail]"+responseText+";"+obj.url);
}catch(e){
return void(obj.error&&obj.error(xhr));
}
obj.success&&obj.success(resp);
}catch(e){
throw __moon_report({
offset:MOON_AJAX_SUCCESS_OFFSET,
e:e
}),e;
}else{
try{
obj.error&&obj.error(xhr);
}catch(e){
throw __moon_report({
offset:MOON_AJAX_ERROR_OFFSET,
e:e
}),e;
}
if(status||!mayAbort){
var __ajaxtest=window.__ajaxtest||"0";
__moon_report({
offset:MOON_AJAX_NETWORK_OFFSET,
log:"ajax_network_error["+status+"]["+__ajaxtest+"]: "+url+";host:"+top.location.host,
e:""
});
}
}
clearTimeout(timer);
try{
obj.complete&&obj.complete();
}catch(e){
throw __moon_report({
offset:MOON_AJAX_COMPLETE_OFFSET,
e:e
}),e;
}
obj.complete=null;
}
},"POST"==type&&xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),
xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"),"undefined"!=typeof obj.timeout&&(timer=setTimeout(function(){
xhr.abort("timeout");
try{
obj.complete&&obj.complete();
}catch(e){
throw __moon_report({
offset:MOON_AJAX_COMPLETE_OFFSET,
e:e
}),e;
}
obj.complete=null,__moon_report({
offset:MOON_AJAX_TIMEOUT_OFFSET,
log:"ajax_timeout_error: "+url,
e:""
});
},obj.timeout));
try{
xhr.send(data);
}catch(e){
obj.error&&obj.error();
}
return xhr;
}
var Url=require("biz_common/utils/url/parse.js"),RespTypes=require("biz_common/utils/respTypes.js"),isx5=-1!=navigator.userAgent.indexOf("TBS/"),__moon_report=window.__moon_report||function(){},MOON_AJAX_SUCCESS_OFFSET=3,MOON_AJAX_NETWORK_OFFSET=4,MOON_AJAX_ERROR_OFFSET=5,MOON_AJAX_TIMEOUT_OFFSET=6,MOON_AJAX_COMPLETE_OFFSET=7;
return Ajax;
});define("appmsg/log.js",["biz_wap/utils/log.js"],function(i){
"use strict";
var s=i("biz_wap/utils/log.js");
return function(i,t){
s(i,t);
};
});define("biz_common/dom/class.js",[],function(){
"use strict";
function s(s,a){
return s.classList?s.classList.contains(a):s.className.match(new RegExp("(\\s|^)"+a+"(\\s|$)"));
}
function a(s,a){
s.classList?s.classList.add(a):this.hasClass(s,a)||(s.className+=" "+a);
}
function e(a,e){
if(a.classList)a.classList.remove(e);else if(s(a,e)){
var c=new RegExp("(\\s|^)"+e+"(\\s|$)");
a.className=a.className.replace(c," ");
}
}
function c(c,l){
s(c,l)?e(c,l):a(c,l);
}
return{
hasClass:s,
addClass:a,
removeClass:e,
toggleClass:c
};
});define("biz_wap/utils/device.js",[],function(){
"use strict";
function s(s){
{
var e=s.match(/MQQBrowser\/(\d+\.\d+)/i),r=s.match(/QQ\/(\d+\.(\d+)\.(\d+)\.(\d+))/i)||s.match(/V1_AND_SQ_([\d\.]+)/),i=s.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/)||s.match(/MicroMessenger\/((\d+)\.(\d+))/),t=s.match(/Mac\sOS\sX\s(\d+\.\d+)/),n=s.match(/Windows(\s+\w+)?\s+?(\d+\.\d+)/),a=s.match(/MiuiBrowser\/(\d+\.\d+)/i),d=s.match(/MI-ONE/),h=s.match(/MI PAD/),w=s.match(/UCBrowser\/(\d+\.\d+(\.\d+\.\d+)?)/)||s.match(/\sUC\s/),c=s.match(/IEMobile(\/|\s+)(\d+\.\d+)/)||s.match(/WPDesktop/),b=s.match(/(ipod).*\s([\d_]+)/i),u=s.match(/(ipad).*\s([\d_]+)/i),v=s.match(/(iphone)\sos\s([\d_]+)/i),p=s.match(/Chrome\/(\d+\.\d+)/),m=s.match(/Mozilla.*Linux.*Android.*AppleWebKit.*Mobile Safari/),f=s.match(/(android)\s([\d\.]+)/i);
s.indexOf("HTC")>-1;
}
if(o.browser=o.browser||{},o.os=o.os||{},window.ActiveXObject){
var l=6;
(window.XMLHttpRequest||s.indexOf("MSIE 7.0")>-1)&&(l=7),(window.XDomainRequest||s.indexOf("Trident/4.0")>-1)&&(l=8),
s.indexOf("Trident/5.0")>-1&&(l=9),s.indexOf("Trident/6.0")>-1&&(l=10),o.browser.ie=!0,
o.browser.version=l;
}else s.indexOf("Trident/7.0")>-1&&(o.browser.ie=!0,o.browser.version=11);
f&&(this.os.android=!0,this.os.version=f[2]),b&&(this.os.ios=this.os.ipod=!0,this.os.version=b[2].replace(/_/g,".")),
u&&(this.os.ios=this.os.ipad=!0,this.os.version=u[2].replace(/_/g,".")),v&&(this.os.iphone=this.os.ios=!0,
this.os.version=v[2].replace(/_/g,".")),n&&(this.os.windows=!0,this.os.version=n[2]),
t&&(this.os.Mac=!0,this.os.version=t[1]),s.indexOf("lepad_hls")>0&&(this.os.LePad=!0),
h&&(this.os.MIPAD=!0),e&&(this.browser.MQQ=!0,this.browser.version=e[1]),r&&(this.browser.MQQClient=!0,
this.browser.version=r[1]),i&&(this.browser.WeChat=!0,this.browser.mmversion=this.browser.version=i[1]),
a&&(this.browser.MIUI=!0,this.browser.version=a[1]),w&&(this.browser.UC=!0,this.browser.version=w[1]||0/0),
c&&(this.browser.IEMobile=!0,this.browser.version=c[2]),m&&(this.browser.AndriodBrowser=!0),
d&&(this.browser.M1=!0),p&&(this.browser.Chrome=!0,this.browser.version=p[1]),this.os.windows&&(this.os.win64="undefined"!=typeof navigator.platform&&"win64"==navigator.platform.toLowerCase()?!0:!1);
var M={
iPad7:"iPad; CPU OS 7",
LePad:"lepad_hls",
XiaoMi:"MI-ONE",
SonyDTV:"SonyDTV",
SamSung:"SAMSUNG",
HTC:"HTC",
VIVO:"vivo"
};
for(var g in M)this.os[g]=-1!==s.indexOf(M[g]);
o.os.phone=o.os.phone||/windows phone/i.test(s),this.os.getNumVersion=function(){
return parseFloat(o.os.version,"10");
},this.os.hasTouch="ontouchstart"in window,this.os.hasTouch&&this.os.ios&&this.os.getNumVersion()<6&&(this.os.hasTouch=!1),
o.browser.WeChat&&o.browser.version<5&&(this.os.hasTouch=!1),o.browser.getNumVersion=function(){
return parseFloat(o.browser.version,"10");
},o.browser.isFFCanOcx=function(){
return o.browser.firefox&&o.browser.getNumVersion()>=3?!0:!1;
},o.browser.isCanOcx=function(){
return!(!o.os.windows||!o.browser.ie&&!o.browser.isFFCanOcx()&&!o.browser.webkit);
},o.browser.isNotIESupport=function(){
return!!o.os.windows&&(!!o.browser.webkit||o.browser.isFFCanOcx());
},o.userAgent={},o.userAgent.browserVersion=o.browser.version,o.userAgent.osVersion=o.os.version,
delete o.userAgent.version;
}
var o={};
s.call(o,window.navigator.userAgent);
var e=function(){
var s=window.navigator.userAgent,e=null;
if(o.os.android){
if(o.browser.MQQ&&o.browser.getNumVersion()>=4.2)return!0;
if(-1!=s.indexOf("MI2"))return!0;
if(o.os.version>="4"&&(e=s.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/))&&e[1]>=4.2)return!0;
if(o.os.version>="4.1")return!0;
}
return!1;
}(),r=function(){
var s=document.createElement("video");
if("function"==typeof s.canPlayType){
if("probably"==s.canPlayType('video/mp4; codecs="mp4v.20.8"'))return!0;
if("probably"==s.canPlayType('video/mp4; codecs="avc1.42E01E"')||"probably"==s.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'))return!0;
}
return!1;
}();
return o.canSupportVideo=r||e,o.canSupportVideoMp4=r,o.canSupportH5Video=e,o;
});define("biz_wap/jsapi/a8key.js",["biz_wap/jsapi/core.js"],function(n){
"use strict";
var e,i=n("biz_wap/jsapi/core.js"),o=!1,t={},a=function(){
"undefined"!=typeof window.pass_ticket&&window.pass_ticket?(t.onAlreadyHasA8Key&&t.onAlreadyHasA8Key.call(A),
u()):0==window.isInWeixinApp()?(t.onOutOfWeixinApp&&t.onOutOfWeixinApp.call(A),u()):(o=1,
i.ready(c));
},c=function(){
window.isWeixinCached?w(u):(t.onNoCacheFuncWeixin&&t.onNoCacheFuncWeixin.call(A),
u());
},w=function(n){
if(t.onJSAPIGetA8KeyStart&&t.onJSAPIGetA8KeyStart.call(A),window.getA8KeyUrl)t.onJSAPIGetA8KeyEnd&&t.onJSAPIGetA8KeyEnd.call(A),
n(window.getA8KeyUrl);else{
var e=!1,o=setTimeout(function(){
e=!0,t.onJSAPIGetA8KeyTimeout&&t.onJSAPIGetA8KeyTimeout.call(A),n("");
},1500);
i.on("onGetA8KeyUrl",function(i){
o&&clearTimeout(o),e||(t.onJSAPIGetA8KeyEnd&&t.onJSAPIGetA8KeyEnd.call(A,i),n(i.url));
});
}
},u=function(n){
var i=!1;
if(n){
var o=getQueryFromURL(n);
window.uin=o.uin||window.uin,window.key=o.key||window.key,window.pass_ticket=o.pass_ticket||window.pass_ticket,
i=!0;
}
e&&e(i);
},A={
isPageCached:o
};
return A.config=function(n){
return t=n||{},A;
},A.onReady=function(n){
e=n,a();
},A;
});define("biz_common/utils/string/html.js",[],function(){
"use strict";
return String.prototype.html=function(t){
var e=["&#96;","`","&#39;","'","&quot;",'"',"&nbsp;"," ","&gt;",">","&lt;","<","&yen;","¥","&amp;","&"];
t&&e.reverse();
for(var n=0,r=this;n<e.length;n+=2)r=r.replace(new RegExp(e[n],"g"),e[n+1]);
return r;
},String.prototype.htmlEncode=function(){
return this.html(!0);
},String.prototype.htmlDecode=function(){
return this.html(!1);
},String.prototype.getPureText=function(){
return this.replace(/<\/?[^>]*\/?>/g,"");
},String.prototype.htmlLite=function(t){
var e=["&#96;","`","&#39;","'","&quot;",'"',"&gt;",">","&lt;","<","&amp;","&"];
t&&e.reverse();
for(var n=0,r=this;n<e.length;n+=2)r=r.replace(new RegExp(e[n],"g"),e[n+1]);
return r;
},String.prototype.htmlEncodeLite=function(){
return this.htmlLite(!0);
},String.prototype.htmlDecodeLite=function(){
return this.htmlLite(!1);
},{
htmlDecode:function(t){
return t.htmlDecode();
},
htmlEncode:function(t){
return t.htmlEncode();
},
getPureText:function(t){
return t.getPureText();
},
htmlEncodeLite:function(t){
return t.htmlEncodeLite();
},
htmlDecodeLite:function(t){
return t.htmlDecodeLite();
}
};
});define("appmsg/index.js",["biz_common/utils/string/html.js","biz_wap/jsapi/a8key.js","biz_wap/utils/device.js","biz_common/dom/class.js","appmsg/log.js","biz_wap/utils/ajax.js","biz_common/dom/attr.js","appmsg/max_age.js","biz_wap/utils/mmversion.js","appmsg/test.js","biz_common/dom/event.js","page/appmsg/page_mp_article_improve_combo.css","page/appmsg/not_in_mm.css","biz_common/utils/url/parse.js","appmsg/cdn_img_lib.js","appmsg/share.js","biz_common/log/jserr.js","biz_wap/ui/lazyload_img.js","appmsg/async.js","appmsg/copyright_report.js","biz_wap/jsapi/core.js","appmsg/outer_link.js","appmsg/review_image.js","appmsg/iframe.js","appmsg/qqmusic.js","appmsg/voice.js","appmsg/wxtopic.js","appmsg/cdn_speed_report.js","appmsg/page_pos.js","appmsg/report_and_source.js","appmsg/report.js","appmsg/fereport.js","biz_wap/safe/mutation_observer_report.js","sougou/index.js"],function(e){
"use strict";
function t(){
function t(e,t){
var o={
lossy:"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
lossless:"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
},i=new Image;
i.onload=function(){
var o=i.width>0&&i.height>0;
t(e,o);
},i.onerror=function(){
t(e,!1);
},i.src="data:image/webp;base64,"+o[e];
}
function o(){
var e=window.performance||window.msPerformance||window.webkitPerformance;
if(e.timing){
var t=e.timing;
a("[Appmsg] dns:"+(t.domainLookupEnd-t.domainLookupStart)+"^^^ ssl:"+(0==t.secureConnectionStart?0:t.connectEnd-t.secureConnectionStart)+"^^^ tcp:"+(t.connectEnd-t.connectStart)+"^^^ request:"+(t.responseStart-t.requestStart)+"^^^ getPackageTime:"+(t.responseEnd-t.responseStart)+"^^^ domCententLoaded:"+(t.domContentLoadedEventStart-t.domLoading)+"^^^ domComplete:"+(t.domComplete-t.domLoading)+"^^^ firstViewTime:"+(real_show_page_time-t.navigationStart)+"^^^ interactiveTime:"+(page_endtime-t.navigationStart))+"^^^ ua:"+window.navigator.userAgent,
setTimeout(function(){
t.loadEventEnd&&a("[Appmsg] onload:"+(t.loadEventEnd-t.loadEventStart));
},100);
}
"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){
return this.replace(/^\s+|\s+$/g,"");
}),""==document.getElementById("js_content").innerHTML.trim()&&((new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=24729_94_1");
var o=Math.random();
.001>o&&document.getElementById("js_read_area3")&&document.getElementById("js_read_area3").innerText&&document.getElementById("js_read_area3").innerText.indexOf("Pageview")>-1&&((new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=24729_95_1"),
window.__wxjs_is_wkwebview&&window.__addIdKeyReport("28307",67);
}
var s=document.getElementsByTagName("body");
if(!s||!s[0])return!1;
s=s[0],function(){
var e=(new Date).getHours(),t=function(e,t){
t=t||"",window.isSg?(t=["uin:sougou","resp:"+t].join("|"),(new Image).src="/mp/jsreport?key="+e+"&content="+t+"&r="+Math.random()+"&from=sougou"):(t=["uin:"+top.window.user_uin,"resp:"+t].join("|"),
(new Image).src="/mp/jsreport?key="+e+"&content="+t+"&r="+Math.random());
},o=function(e,t,o){
var i=e+"_"+t;
o=o||1,window.logs.idkeys[i]||(window.logs.idkeys[i]={
val:0
}),window.logs.idkeys[i].val+=o;
},i=e>=11&&17>=e&&Math.random()<1,n=function(e,o){
i&&t(e,o);
};
window.__report=t,window.__commonVideoReport=n,window.__addIdKeyReport=o;
}();
var g=/^http(s)?:\/\/mp\.weixin\.qq\.com\//g;
try{
if(top!=window&&(!top||top&&top.location.href&&g.test(top.location.href))&&!window.isSg)throw new Error("in iframe");
}catch(_){
var u="",f=new Image;
f.src=("http://mp.weixin.qq.com/mp/jsreport?key=4&content=biz:"+biz+",mid:"+mid+",uin:"+uin+"[key4]"+u+"&r="+Math.random()).substr(0,1024);
}
if(window.isInWeixinApp()&&/#rd$/.test(location.href)&&!window.isWeixinCached){
var h=-1!=location.href.indexOf("?")?"&":"?";
location.replace(location.href.replace(/#rd$/,h+"rd2werd=1#wechat_redirect"));
}
var A=e("biz_common/utils/url/parse.js");
e("appmsg/cdn_img_lib.js"),window.page_endtime=+new Date;
{
var y=e("biz_wap/utils/mmversion.js"),v=!y.isWp&&-1==navigator.userAgent.indexOf("MicroMessenger");
-1!=navigator.userAgent.indexOf("WindowsWechat");
}
if(e("appmsg/share.js"),window.isSg||"mp.weixin.qq.com"==location.host){
var b=e("biz_common/log/jserr.js");
b({
key:0,
reporturl:"http://mp.weixin.qq.com/mp/jsreport?1=1",
replaceStr:/http(s)?:(.*?)js\//g
});
}
window.logs.webplog={
lossy:0,
lossless:0,
alpha:0,
animation:0,
total:0
};
var x=-1!=navigator.userAgent.indexOf("TBS/"),j=function(e,o){
t(e,function(e,t){
if(window.logs.webplog[e]=t?1:0,window.logs.webplog.total++,4==window.logs.webplog.total){
var i=window.logs.webplog,n=Math.random();
x&&1>=n&&(i.lossy=i.lossless=i.alpha=1,window.logs.webplog=i);
var a=i.lossy&i.lossless&i.alpha;
o(!!a);
}
});
},I=function(e){
j("lossy",e),j("lossless",e),j("alpha",e),j("animation",e);
};
window.webp=!1,I(function(t){
function o(e){
return;
}
function i(e){
return;
}
function n(e){
return;
}
function r(e,t){
if(1*t.getAttribute("data-order")<5)return e;
var o=1e3*window.svr_time||+new Date;
o=new Date(o);
var i=o.getHours(),n=(60*i+o.getMinutes(),e),a=document.createElement("span");
a.className="gif_img_wrp",a.innerHTML='<span class="gif_img_tips" style="display:none;"><i class="gif_img_play_arrow"></i>动图</span><span class="gif_img_tips loading" style="display:none;"><i class="weui_loading gif_img_loading"></i>加载中</span>';
var r="click",s=function(){
if(a){
a.children.item(0).style.display="none",a.children.item(1).style.display="";
var e=t.onload;
t.onload=function(){
a&&(a.children.item(1).style.display="none",l.off(a,r,s),a=null),t.className+=" img_gif_onload",
e&&e.apply(t,arguments);
};
var o=t.onerror;
t.onerror=function(){
a&&(a.children.item(0).style.display="",a.children.item(1).style.display="none",
l.off(a,r,s),a=null),o&&o.apply(t,arguments);
},t.src=n,t.loadGif=!0,window.__addIdKeyReport("28307",15);
}
};
return t.autoTap=function(){
t.src=n,t.loadGif=!0,t.autoTap=null,l.off(a,r,s),window.__addIdKeyReport("28307",26);
},t.span=a,(window.user_uin&&100>(m/100|0)%100&&"MzI5NjExODQ4OA=="!==window.biz||location.href.indexOf("gif=1")>-1)&&(e=e.nogif(),
t.gray=!0,t.parentNode.insertBefore(a,t),a.appendChild(t),l.on(a,r,s),window.__addIdKeyReport("28307",16)),
e;
}
function s(e){
var t,o=getComputedStyle(e),i=new Image,n=o.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi,"$2"),a=o.backgroundSize,r=parseFloat(o.width.replace("px","")),s=parseFloat(o.height.replace("px","")),d=[r,s],p=[];
if(i.src=n,t=i.width>i.height?i.width/i.height:i.height/i.width,a=a.split(" "),p[0]=a[0],
p[1]=a.length>1?a[1]:"auto","cover"===a[0])d[0]>d[1]&&d[0]/d[1]>=t?(p[0]=d[0],p[1]="auto"):(p[0]="auto",
p[1]=d[1]);else if("contain"===a[0])d[0]<d[1]?(p[0]=d[0],p[1]="auto"):d[0]/d[1]>=t?(p[0]="auto",
p[1]=d[1]):(p[1]="auto",p[0]=d[0]);else for(var c=a.length;c--;)a[c].indexOf("px")>-1?p[c]=a[c].replace("px",""):a[c].indexOf("%")>-1&&(p[c]=d[c]*(a[c].replace("%","")/100));
return"auto"===p[0]&&"auto"===p[1]?(p[0]=i.width,p[1]=i.height):(t="auto"===p[0]?i.height/p[1]:i.width/p[0],
p[0]="auto"===p[0]?i.width/t:p[0],p[1]="auto"===p[1]?i.height/t:p[1]),{
width:p[0],
height:p[1]
};
}
window.webp=t,t&&window.localStorage&&window.localStorage.setItem&&window.localStorage.setItem("webp","1"),
window.logs.img={
download:{},
read:{},
load:{}
};
var p=document.getElementById("js_cover");
if(p){
var c=p.getAttribute("data-src");
if(c){
if(c.isCDN()){
var g=new Date;
for(g.setFullYear(2014,9,1);-1!=c.indexOf("?tp=webp");)c=c.replace("?tp=webp","");
for(;-1!=c.indexOf("&tp=webp");)c=c.replace("&tp=webp","");
1e3*ct>=g.getTime()&&""!=img_format&&"gif"!=img_format&&(c=c.replace(/\/0$/,"/640"),
c=c.replace(/\/0\?/,"/640?"),p.dataset&&(p.dataset.s="300,640")),t&&(c=A.addParam(c,"tp","webp",!0)),
c=A.addParam(c,"wxfrom","5",!0),is_https_res||w?c=c.http2https():("http:"==location.protocol||-1!=navigator.userAgent.indexOf("MicroMessenger"))&&(c=c.https2http());
}
setTimeout(function(){
p.onload=function(){
d(p,"height","auto","important"),d(p,"visibility","visible","important");
},p.setAttribute("src",c);
},0),window.logs.img.read[c]=!0,window.logs.img.load[c]=!0,p.removeAttribute("data-src");
}
}
var _=e("biz_wap/ui/lazyload_img.js"),u=1;
window.logs.outer_pic=0;
for(var f=document.getElementsByTagName("img"),h=0,y=f.length;y>h;++h){
var v=f[h].getAttribute("data-src");
v&&v.isGif()&&f[h].className.indexOf("__bg_gif")<0&&(f[h].className+=" __bg_gif"),
o(f[h]);
}
for(var b=document.getElementsByClassName("__bg_gif"),h=0,y=b.length;y>h;++h)b[h].setAttribute("data-order",h);
var x=!1,j=function(){
if(!x){
x=!0;
for(var e=document.getElementsByClassName("__bg_gif"),t=function(e){
var t=document.createElement("span"),o=document.createElement("div");
o.style.position="relative",o.style.height=0,o.className="gif_bg_tips_wrp",t.className="gif_img_tips_group",
t.innerHTML='<span class="gif_img_tips"><i class="gif_img_play_arrow"></i>动图</span><span class="gif_img_tips loading" style="display:none;"><i class="weui_loading gif_img_loading"></i>加载中</span>',
o.appendChild(t);
var i=getComputedStyle(e),n=i.backgroundPosition,a=i.backgroundPositionX||n.split(" ")[0],r=i.backgroundPositionY||n.split(" ")[1]||backgroundPositionX,d=s(e),p=parseFloat(d.width),c=parseFloat(d.height);
if(120>p||120>c)return"autoTap";
var m,g,w=e.clientWidth,_=e.clientHeight,u=i.backgroundOrigin,f=i.backgroundImage.slice(4,-1).replace(/"/g,""),h=parseFloat(i.paddingLeft),A=parseFloat(i.borderLeftWidth),y=parseFloat(i.paddingRight),v=parseFloat(i.borderRightWidth),b=parseFloat(i.paddingTop),x=parseFloat(i.borderTopWidth),j=parseFloat(i.paddingBottom),I=parseFloat(i.borderBottomWidth),z=parseFloat(i.marginTop),E=parseFloat(i.marginLeft);
"padding-box"===u?(m=A+E,g=x+z):"border-box"===u?(w+=A+v,_+=x+I,m=E,g=z):"content-box"===u&&(w-=y+h,
_-=b+j,m=A+E+h,g=x+z+b);
var q;
if(a.indexOf("%")>=0){
var R=.01*parseFloat(a);
q=(w-p)*R;
}else a.indexOf("px")>=0&&(q=parseFloat(a));
var k;
if(r.indexOf("%")>=0){
var R=.01*parseFloat(r);
k=(_-c)*R;
}else r.indexOf("px")>=0&&(k=parseFloat(r));
var B=k+g+c,S=q+m;
S=Math.max(S,E),B=Math.min(B,_+5+g),S+=10,B-=35,t.style.top=B+"px",t.style.left=S+"px";
var O="click",T=function(){
if(t){
t.children.item(0).style.display="none",t.children.item(1).style.display="";
var o=new Image,i=f;
f.indexOf("mmbiz_gif")>=0?i=i.replace("/s640?","/0?"):(i=i.replace("/s640?","/0?"),
i+="&wx_fmt=gif"),o.src=i,o.onload=function(){
t&&(t.children.item(1).style.display="none",l.off(t,O,T),t=null),e.style.backgroundImage='url("'+i+'")',
e.loadGif=!0;
},o.onerror=function(){
t&&(t.children.item(0).style.display="",t.children.item(1).style.display="none",
l.off(t,O,T),t=null);
},window.__addIdKeyReport("28307",15);
}
};
return l.on(t,O,T),o;
},o=5,i=function(e){
var t=getComputedStyle(e),o=t.backgroundImage.slice(4,-1).replace(/"/g,""),i=o;
o.indexOf("/mmbiz_gif/")>=0?i=i.replace("/s640?","/0?"):(i=i.replace("/s640?","/0?"),
i+="&wx_fmt=gif"),e.style.backgroundImage='url("'+i+'")',e.loadGif=!0;
},n=0,a=e.length;a>n;++n){
var r=e[n].getAttribute("data-src");
if(!(r&&r.isGif()||e[n].loadGif))if(o>n)i(e[n]);else{
var d=t(e[n]);
"autoTap"===d?i(e[n]):e[n].parentNode.insertBefore(d,e[n]);
}
}
}
};
l.on(window,"load",j),setTimeout(function(){
j();
},1e4),function(){
var e="onorientationchange"in window?"orientationchange":"resize";
l.on(window,e,function(){
if(x){
for(var e=document.getElementsByClassName("gif_bg_tips_wrp");e.length>0;)e[0].parentNode.removeChild(e[0]);
x=!1,j();
}
});
}(),new _({
attrKey:"data-src",
imgOccupied:!0,
lazyloadHeightWhenWifi:function(){
var e,t=1,o=1;
e=window.svr_time?new Date(1e3*window.svr_time):new Date;
var i=e.getHours();
return i>=20&&23>i&&(t=.5,o=0),{
bottom:t,
top:o
};
},
inImgRead:function(e){
e&&(window.logs.img.read[e]=!0);
},
changeSrc:function(e,t,o){
if(!t)return"";
var i=t;
if(i=i.replace(/(\?tp=webp)|(\?tp=wxpic)|(&tp=webp)|(&tp=wxpic)/g,""),t.isCDN()){
(e.dataset&&e.dataset.s||-1!=t.indexOf("wx_fmt=")&&-1==t.indexOf("wx_fmt=gif"))&&(i=i.replace(/\/0$/,"/640"),
i=i.replace(/\/0\?/,"/640?"));
var n,s=top.window.navigator.userAgent,d=/TBS\/([\d\.]+)/i,p=s.match(d);
p&&p[1]&&(n=parseInt(p[1]));
var c=1e3,l=top.window.user_uin||0,m=0!==l&&Math.floor(l/100)%1e3<c;
m&&(43121==n||43202==n)&&i.isGif()&&"MjM5OTIwODMzMQ=="==biz?(i=A.addParam(i,"tp","wxpic",!0),
window.__addIdKeyReport("28307",91)):window.webp&&(i=A.addParam(i,"tp","webp",!0),
window.__addIdKeyReport("28307",84)),i=A.addParam(i,"wxfrom","5",!0),is_https_res||w?(i=i.http2https(),
window.__addIdKeyReport("28307",77)):("http:"==location.protocol||-1!=navigator.userAgent.indexOf("MicroMessenger"))&&(i=i.https2http(),
window.__addIdKeyReport("28307",70));
}else try{
var d=new RegExp("^http(s)?://((mmbiz.qpic.cn/.*)|(m.qpic.cn/.*)|(mmsns.qpic.cn/.*)|(shp.qpic.cn/.*)|(wx.qlogo.cn/.*)|(mmbiz.qlogo.cn/.*)|((a|b)[0-9]*.photo.store.qq.com/.*)|(mp.weixin.qq.com/.*)|(res.wx.qq.com/.*))");
d.test(t)||(window.__addIdKeyReport("28307",9),window.logs.outer_pic++);
}catch(g){}
var _=/^http\:\/\/(a|b)(\d)+\.photo\.store\.qq\.com/g;
return i=i.replace(_,"http://m.qpic.cn"),i=A.addParam(i,"wx_lazy","1",!0),t.isGif()&&(i=r(i,e,o)),
window.logs.img.load[i]=!0,a("[Appmsg] image_load_event_change_src. originsrc:"+t+"  ^^^ newsrc : "+i),
e.start_load_time=+new Date,i;
},
onerror:function(e,t){
i(t);
var o=t?t.__retryload||0:0;
if(e&&!(o>u)&&e.isCDN()){
var n=0==e.indexOf("https://")?7:0;
window.__addIdKeyReport("28307",72+n),window.__addIdKeyReport("28307",75+1*o+n),
e.isWxpic()?(window.__addIdKeyReport("28307",93),window.__addIdKeyReport("28307",96+1*o)):e.isWebp()&&(window.__addIdKeyReport("28307",86),
window.__addIdKeyReport("28307",89+1*o)),u>o&&(o++,t.__retryload=o,e.indexOf("http://")>-1&&(e=e.http2https(),
window.__addIdKeyReport("28307",77)),t.start_load_time=+new Date,t.src=A.addParam(e,"retryload",o,!0)),
window.__has_imgfailed||(window.__has_imgfailed=!0,window.__addIdKeyReport("28307",65)),
a("[Appmsg] image_load_event_on_error. src:"+e),t.setAttribute("data-fail",1);
var r=10;
/tp\=webp/.test(e)&&(r=11);
var s=new Image;
s.src="http://mp.weixin.qq.com/mp/jsreport?key="+r+"&content="+(encodeURIComponent(e)+"["+uin+"]")+"&r="+Math.random();
}
},
onload:function(e,t){
n(t),t.gray&&!t.loadGif&&((t.width||t.naturalWidth)<120||(t.height||t.naturalHeight)<120?t.autoTap&&t.autoTap():t.span&&t.span.children&&t.span.children.item(0)&&(t.span.children.item(0).style.display=""));
var o=t?t.__retryload||0:0;
if(!(o>u)){
a("[Appmsg] image_load_event_onload_image. src:"+e+"  ^^^  retryloadtimes: "+o),
t.setAttribute("data-fail",0);
var i=0==e.indexOf("https://")?7:0;
window.__addIdKeyReport("28307",71+i),window.__addIdKeyReport("28307",73+1*o+i),
e.isWxpic()?(window.__addIdKeyReport("28307",92),window.__addIdKeyReport("28307",94+1*o)):e.isWebp()&&(window.__addIdKeyReport("28307",85),
window.__addIdKeyReport("28307",87+1*o)),window.__has_imgsucceed||(window.__has_imgsucceed=!0,
window.__addIdKeyReport("28307",64));
var r=Math.random(),s=+new Date-t.start_load_time;
s&&0==e.indexOf("https://")&&.5>r?(window.__addIdKeyReport("27822",121,s),window.__addIdKeyReport("27822",122)):s&&5e-4>r&&(window.__addIdKeyReport("27822",124,s),
window.__addIdKeyReport("27822",125));
}
},
detect:function(e){
if(e&&e.time&&e.loadList){
var t=e.time,o=e.loadList;
window.logs.img.download[t]=o;
}
},
container:document.getElementById("page-content")
});
}),e("appmsg/async.js"),!window.isSg;
var z=e("appmsg/copyright_report.js"),E=e("biz_wap/jsapi/core.js");
!function(){
var e=document.getElementById("post-user"),t=document.getElementById("copyright_info"),o=[];
if(e){
var i="57";
"26"==window.source&&(i="95"),"28"==window.source&&(i="96"),"29"==window.source&&(i="39"),
"15"==window.source&&(i="121"),o.push({
dom:e,
username:user_name_new||user_name,
profileReportInfo:window.profileReportInfo||"",
scene:i
});
}
t&&source_encode_biz&&o.push({
dom:t,
source_encode_biz:source_encode_biz,
scene:"110"
});
for(var n=0,s=o.length;s>n;n++)!function(e){
l.on(e.dom,"click",function(){
if("copyright_info"==e.dom.id&&source_encode_biz){
z.card_click_report({
scene:"0"
});
var t="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz="+e.source_encode_biz+"&scene="+e.scene+"#wechat_redirect";
-1!=navigator.userAgent.indexOf("WindowsWechat")||-1!=navigator.userAgent.indexOf("Mac OS")?location.href=t:E.invoke("openUrlWithExtraWebview",{
url:t,
openType:1
},function(e){
-1==e.err_msg.indexOf("ok")&&(location.href=t);
});
}else a("[Appmsg] profile_click_before_loadprofile: username:"+e.username+", scene:"+e.scene),
r({
url:"/mp/appmsgreport?action=name_click",
data:{
url:location.href,
title:window.msg_title||"",
msgid:window.mid||"",
itemidx:window.idx||"",
__biz:window.biz||""
},
type:"POST",
dataType:"json",
async:!0,
success:function(){}
}),E.invoke("profile",{
username:e.username,
profileReportInfo:e.profileReportInfo||"",
scene:e.scene
},function(t){
window.__addIdKeyReport("28307","1"),a("[Appmsg] profile_click_after_loadprofile: username:"+e.username+", scene:"+e.scene+", profileReportInfo:"+e.profileReportInfo+", res.err_msg:"+t.err_msg);
});
return!1;
}),y.isWp&&e.dom.setAttribute("href","weixin://profile/"+e.username);
}(o[n]);
}(),function(){
location.href.match(/fontScale=\d+/)&&y.isIOS&&E.on("menu:setfont",function(e){
e.fontScale<=0&&(e.fontScale=100),document.getElementsByTagName("html").item(0).style.webkitTextSizeAdjust=e.fontScale+"%",
document.getElementsByTagName("html").item(0).style.lineHeight=160/e.fontScale;
});
}();
var q=e("appmsg/outer_link.js");
if(new q({
container:document.getElementById("js_content"),
changeHref:function(e,t){
if(e&&0==e.indexOf("http://mp.weixin.qq.com/s")){
e=e.replace(/#rd\s*$/,""),e=e.replace(/#wechat_redirect\s*$/,""),e=e.replace(/[\?&]scene=21/,"");
var o="&";
-1==e.indexOf("?")&&(o="?"),e+=o+"scene=21#wechat_redirect";
}else{
if(18==ban_scene)return"/mp/ban?action=check&__biz="+biz+"&mid="+mid+"&idx="+idx+"&scene="+ban_scene+"#wechat_redirect";
if(0!=e.indexOf("http://mp.weixinbridge.com/mp/wapredirect"))return"http://mp.weixinbridge.com/mp/wapredirect?url="+encodeURIComponent(e)+"&action=appmsg_redirect&uin="+uin+"&biz="+biz+"&mid="+mid+"&idx="+idx+"&type="+t+"&scene=0";
}
return e;
}
}),!v){
var R=e("appmsg/review_image.js"),k=document.getElementById("js_cover"),B=[];
k&&B.push(k),new R({
container:document.getElementById("js_content"),
is_https_res:is_https_res,
imgs:B
});
}
!function(){
try{
var e=document.getElementById("js_content");
if(!e||!e.querySelectorAll)return;
for(var t=e.querySelectorAll("*"),o="list-paddingleft-2,selectTdClass,noBorderTable,ue-table-interlace-color-single,ue-table-interlace-color-double,__bg_gif".split(","),i=function(e){
if(e&&e.className){
for(var t=e.className.split(/\s+/),i=[],n=0,a=t.length;a>n;++n){
var r=t[n];
r&&-1!=o.indexOf(r)&&i.push(r);
}
e.className=i.join(" ");
}
},n=0,a=t.length;a>n;++n){
var r=t[n];
r.tagName&&"iframe"!=r.tagName.toLowerCase()&&i(r);
}
}catch(s){}
}(),window.fromWeixinCached||e("appmsg/iframe.js"),e("appmsg/qqmusic.js"),e("appmsg/voice.js"),
e("appmsg/wxtopic.js"),e("appmsg/cdn_speed_report.js"),e("appmsg/page_pos.js"),setTimeout(function(){
window.article_improve_combo_css;
},0),setTimeout(function(){
l.tap(document.getElementById("copyright_logo"),function(){
location.href="http://kf.qq.com/touch/sappfaq/150211YfyMVj150326iquI3e.html";
}),p(),c(),e("appmsg/report_and_source.js"),function(){
if(v){
n.addClass(s,"not_in_mm");
var e=document.getElementById("js_pc_qr_code_img");
if(e){
var t=10000004,o=document.referrer;
if(0==o.indexOf("http://weixin.sogou.com")?t=10000001:0==o.indexOf("https://wx.qq.com")&&(t=10000003),
window.isSg)e.setAttribute("src",sg_qr_code.htmlDecode());else{
e.setAttribute("src","/mp/qrcode?scene="+t+"&size=102&__biz="+biz+"&mid="+mid+"&idx="+idx+"&sn="+sn+"&send_time="+send_time);
var i=new Image;
i.src="/mp/report?action=pcclick&__biz="+biz+"&uin="+uin+"&scene="+t+"&r="+Math.random();
}
document.getElementById("js_pc_qr_code").style.display="block";
}
var a=document.getElementById("js_profile_qrcode"),r=document.getElementById("js_profile_arrow_wrp"),d=document.getElementById("post-user");
if(a&&d&&r){
var p=function(){
var e=10000005,t=document.referrer;
0==t.indexOf("http://weixin.sogou.com")?e=10000006:0==t.indexOf("https://wx.qq.com")&&(e=10000007);
var o=document.getElementById("js_profile_qrcode_img");
if(o)if(window.isSg)o.setAttribute("src",sg_qr_code.htmlDecode());else{
o.setAttribute("src","/mp/qrcode?scene="+e+"&size=102&__biz="+biz+"&mid="+mid+"&idx="+idx+"&sn="+sn+"&send_time="+send_time);
var i=new Image;
i.src="/mp/report?action=pcclick&__biz="+biz+"&uin="+uin+"&scene="+e+"&r="+Math.random();
}
return a.style.display="block",r.style.left=d.offsetLeft-a.offsetLeft+d.offsetWidth/2-8+"px",
!1;
};
l.on(d,"click",p),l.on(a,"click",p),l.on(document,"click",function(e){
var t=e.target||e.srcElement;
t!=d&&t!=a&&(a.style.display="none");
});
}
}else{
var c=document.getElementById("js_report_article3");
!!c&&(c.style.display="");
}
}(),function(){
var e=location.href.indexOf("scrolltodown")>-1?!0:!1,t=document.getElementById("img-content");
if(e&&t&&t.getBoundingClientRect){
var o=t.getBoundingClientRect().height;
window.scrollTo(0,o);
}
}(),e("appmsg/report.js");
for(var t=document.getElementsByTagName("map"),o=0,i=t.length;i>o;++o)t[o].parentNode.removeChild(t[o]);
if(z.card_pv_report(),Math.random()<.01)try{
var a="https://js.aq.qq.com/js/aq_common.js",r=document.createElement("script");
r.src=a;
var d=document.getElementsByTagName("head")[0];
d.appendChild(r);
}catch(m){}
var g=document.getElementById("js_close_temp");
l.on(g,"click",function(){
g.parentNode.parentNode.removeChild(g.parentNode),n.removeClass(document.getElementById("js_article"),"preview_appmsg");
});
},1e3),function(){
if(i.os.ios&&"onorientationchange"in window){
var e=[],t="onorientationchange"in window?"orientationchange":"resize",o=function(){
return 90===Math.abs(window.orientation)?1:2;
};
e.push({
ori:o(),
scroll:window.pageYOffset||document.documentElement.scrollTop,
istouchmove:!1
});
var n=(new Date).getHours();
l.on(window,t,function(){
var t=e.length-2,i=o();
if(t>=0){
var a=e[t],r=a.ori;
r!==i||e[e.length-1].istouchmove||(n>=11&&17>=n&&window.__report(63),window.scrollTo(0,a.scroll));
}
e.push({
ori:i,
scroll:window.pageYOffset||document.documentElement.scrollTop,
istouchmove:!1
});
}),l.on(window,"scroll",function(){
var t=e.length-1;
e[t].ori==o()&&(e[t].scroll=window.pageYOffset||document.documentElement.scrollTop,
e[t].istouchmove=!0);
});
}
}(),a("[Appmsg] href:"+location.href+"^^^ ua:"+window.navigator.userAgent),window.addEventListener?window.addEventListener("load",o,!1):window.attachEvent&&window.attachEvent("onload",o),
e("appmsg/fereport.js"),function(){
window.addEventListener&&document.getElementsByTagName("body")[0].addEventListener("copy",function(){
(new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_18_1",
y.isIOS&&((new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_19_1"),
y.isAndroid&&((new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_20_1");
},!1);
}(),function(){
window.__observer&&window.__observer_data&&e("biz_wap/safe/mutation_observer_report.js");
}(),function(){
var e=[.875,1,1.125,1.25,1.375],t=window.location.href.match(/winzoom=(\d+(?:\.\d+)?)/);
if(t){
var o=parseFloat(t[1]);
"undefined"!=typeof e.indexOf&&e.indexOf(o)>=0&&(document.getElementById("page-content").style.zoom=o,
document.getElementsByClassName("rich_media_title")[0].style.zoom=1/o,document.getElementsByClassName("rich_media_meta_list")[0].style.zoom=1/o);
}
}(),"undefined"!=typeof isSg&&e("sougou/index.js"),setTimeout(function(){
for(var e=function(){
(new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_49_1&lc=1&log0=[28307_49_appmsg_fe_filter]"+encodeURIComponent(location.href);
},t=(window.appmsg_fe_filter||"").split(","),o=function(t,o){
try{
if(!t)return;
if(t.querySelectorAll){
var i=t.querySelectorAll("*["+o+"]");
if(i&&i.length>0){
e();
for(var n=0;n<i.length;++n)i[n]&&i[n].removeAttribute&&i[n].removeAttribute(o);
}
return;
}
var a=t.childNodes;
if(t.hasAttribute&&t.hasAttribute(o)&&e(),t.removeAttribute&&t.removeAttribute(o),
a&&a.length)for(var n=0;n<a.length;++n)filterContenteditable(a[n]);
}catch(r){}
},i=document.getElementById("js_content"),n=0;n<t.length;++n)t[n]&&o(i,t[n]);
},0),setTimeout(function(){
var e=999,t=636,o="http://mmbiz.qpic.cn/mmbiz_png/7lG1x2vpicdic0p5bBthpD9lsJcINicsSzd6uKQQJyoj5oTl8lFIs9K0fIibgxCzms0enDLTRxTHLpDPCLpSvIExiag/0",i=(new Date).getHours();
if(!(11>i||i>16||Math.random()<.99)){
var n=new Image;
n.onload=function(){
var o=n.naturalWidth||n.width,i=n.naturalHeight||n.height;
(o!=e||i!=t)&&window.__addIdKeyReport("28307","wifi"===window.networkType?120:123),
window.__addIdKeyReport("28307","wifi"===window.networkType?121:124);
},n.src=o;
}
},3e3);
}
e("biz_common/utils/string/html.js");
var o=e("biz_wap/jsapi/a8key.js"),i=e("biz_wap/utils/device.js"),n=e("biz_common/dom/class.js"),a=e("appmsg/log.js"),r=e("biz_wap/utils/ajax.js"),s=e("biz_common/dom/attr.js"),d=s.setProperty,p=e("appmsg/max_age.js"),c=(e("biz_wap/utils/mmversion.js"),
e("appmsg/test.js")),l=e("biz_common/dom/event.js");
e("page/appmsg/page_mp_article_improve_combo.css"),e("page/appmsg/not_in_mm.css");
var m=top.window.user_uin||0,g=Math.floor(m/100)%1e3,w=0!==m&&50>g;
o.config({
onOutOfWeixinApp:function(){
console.log("onOutOfWeixinApp"),a("[Appmsg] onOutOfWeixinApp");
},
onNoCacheFuncWeixin:function(){
console.log("isWeixinCached == false"),a("[Appmsg] isWeixinCached == false");
},
onAlreadyHasA8Key:function(){
console.log("URL已有A8Key"),a("[Appmsg] URL alery has A8Key");
},
onJSAPIGetA8KeyStart:function(){
console.log("onJSAPIGetA8KeyStart"),a("[Appmsg] onJSAPIGetA8KeyStart");
},
onJSAPIGetA8KeyEnd:function(){
console.log("onJSAPIGetA8KeyEnd"),a("[Appmsg] onJSAPIGetA8KeyEnd");
},
onJSAPIGetA8KeyTimeout:function(){
console.log("onJSAPIGetA8KeyTimeout"),a("[Appmsg] onJSAPIGetA8KeyTimeout");
}
}),o.onReady(function(){
window.logs.pagetime.jsapi_ready_time=+new Date,window.logs.idkeys={},console.log("进入index.js init"),
a("[Appmsg] start run index.js init"),t();
});
});