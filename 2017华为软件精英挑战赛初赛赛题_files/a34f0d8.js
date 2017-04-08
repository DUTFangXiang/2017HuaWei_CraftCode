define("biz_common/utils/monitor.js",[],function(){
"use strict";
var n=[],t={};
return t.setAvg=function(i,e,o){
return n.push(i+"_"+e+"_"+o),n.push(i+"_"+(e-1)+"_1"),t;
},t.setSum=function(i,e,o){
return n.push(i+"_"+e+"_"+o),t;
},t.send=function(){
if(0!=n.length){
var t=new Image;
t.src="//mp.weixin.qq.com/mp/jsmonitor?idkey="+n.join(";")+"&t="+Math.random(),n=[];
}
},t;
});define("biz_common/utils/report.js",[],function(){
"use strict";
return function(n){
var e=new Image;
e.src=n;
};
});define("appmsg/open_url_with_webview.js",["biz_wap/jsapi/core.js"],function(e){
"use strict";
var r=e("biz_wap/jsapi/core.js"),i=function(e,i){
i=i||{};
var o=i.sample||0;
o*=1e3;
var t=top.window.user_uin||0,n=0!==t&&Math.floor(t/100)%1e3<o;
return n?void r.invoke("openUrlWithExtraWebview",{
url:e,
openType:i.openType||1
},function(e){
e&&"openUrlWithExtraWebview:ok"===e.err_msg?i.resolve&&i.resolve():i.reject&&i.reject();
}):void(i.reject&&i.reject());
};
return i;
});define("biz_common/utils/http.js",[],function(){
"use strict";
function t(){
var t=document.getElementsByTagName("html");
if(t&&1==!!t.length){
t=t[0].innerHTML;
var e=t.replace(/[\x00-\xff]/g,""),n=t.replace(/[^\x00-\xff]/g,"");
return 1*n.length+3*e.length+"<!DOCTYPE html><html></html>".length;
}
return 0;
}
return{
htmlSize:t()
};
});define("biz_common/utils/cookie.js",[],function(){
"use strict";
var e={
get:function(e){
if(""==e)return"";
var t=new RegExp(e+"=([^;]*)"),n=document.cookie.match(t);
return n&&n[1]||"";
},
set:function(e,t,n){
var o=new Date;
return o.setDate(o.getDate()+(n||1)),n=o.toGMTString(),document.cookie=e+"="+t+";expires="+n,
!0;
}
};
return e;
});define("appmsg/topic_tpl.html.js",[],function(){
return'<span class="db topic_wrp">\n    <span class="topic_thumb" style="background-image:url({img_url});"></span>\n    <span class="topic_content">\n        <strong class="topic_title">{title}</strong>\n        <span class="topic_desc">{author}</span>\n        <span class="topic_info">\n            <span class="topic_info_extra"><span class="icon_topic"></span>话题</span>\n            <span class="topic_info_primary">相关文章{msg_num}篇</span>\n        </span>\n    </span>\n</span>\n';
});define("pages/voice_tpl.html.js",[],function(){
return'<span id="voice_main_<#=voiceid#>_<#=posIndex#>" class="db audio_area <#if(!musicSupport){#> unsupport<#}#>">\n    <span class="tc tips_global unsupport_tips" <#if(show_not_support!==true){#>style="display:none;"<#}#>>\n    当前浏览器不支持播放音乐或语音，请在微信或其他浏览器中播放    </span>\n    <span class="audio_wrp db">\n        <span id="voice_play_<#=voiceid#>_<#=posIndex#>" class="audio_play_area">\n            <i class="icon_audio_default"></i>\n            <i class="icon_audio_playing"></i>\n            <img src="<#=window.icon_audio_unread#>" alt="" class="pic_audio_default">\n        </span>\n        <span class="audio_length tips_global"><#=duration_str#></span>\n        <span class="db audio_info_area">\n            <strong class="db audio_title"><#=title#></strong>\n            <span class="audio_source tips_global"><#if(window.nickname){#>来自<#=window.nickname#><#}#></span>\n        </span>\n        <span id="voice_progress_<#=voiceid#>_<#=posIndex#>" class="progress_bar" style="width:0px;"></span>\n    </span>\n</span>\n';
});define("pages/voice_component.js",["biz_common/dom/event.js","biz_common/tmpl.js","pages/loadscript.js","pages/music_player.js","biz_common/dom/class.js","pages/report.js","biz_common/utils/monitor.js"],function(e,t,r,o){
"use strict";
function i(e){
this._o={
type:0,
comment_id:"",
src:"",
mid:"",
songId:"",
autoPlay:!1,
duration:0,
debug:!1,
needVioceMutex:!0,
appPlay:!0,
title:"",
singer:"",
epname:"",
coverImgUrl:"",
webUrl:[location.protocol,"//mp.weixin.qq.com/s?referFrom=#referFrom#&songid=#songId#&__biz=",window.biz,"&mid=",window.mid,"&idx=",window.idx,"&sn=",window.sn,"#wechat_redirect"].join(""),
playingCss:"",
playCssDom:"",
playArea:"",
progress:"",
detailUrl:"",
detailArea:"",
fileSize:0
},this._init(e);
}
function s(e,t,r,o){
I.num++,t.musicSupport=I.musicSupport,t.show_not_support=!1,I.musicSupport||1!=I.num||(t.show_not_support=!0);
var i=document.createElement("div"),s="";
s=o?l.render(e,t):l.tmpl(e,t),i.innerHTML=s;
var n=r.parentNode;
n&&(n.lastChild===r?n.appendChild(i.children[0]):n.insertBefore(i.children[0],r.nextSibling));
}
function n(){
"undefined"==typeof window.reportVoiceid&&(window.reportVoiceid=[]),"undefined"==typeof window.reportMid&&(window.reportMid=[]);
}
function a(){
m.on(window,"unload",p);
}
function p(){
for(var e in I.reportData)g.musicreport({
data:I.reportData[e]
});
}
function c(e){
f.setSum(I.reportId,18,1),f.send();
var t=+new Date,r="//open.music.qq.com/fcgi-bin/fcg_music_get_song_info_weixin.fcg?song_id=#songid#&mid=#mid#&format=json&app_id=1034002693&app_key=cjjDaueOyPYRJFeTqG&device_id=weixin&file_type=mp3&qqmusic_fromtag=50&callback=get_song_info_back";
r=r.replace("#mid#",e.mid).replace("#songid#",e.id),_({
url:r,
timeout:3e4,
callbackName:"get_song_info_back",
callback:function(r){
var o=+new Date-t;
if(!r||"undefined"==typeof r.ret){
var i=1;
return d({
type:"error",
time:o,
code:i
}),void("function"==typeof e.onError&&e.onError({
errcode:i
}));
}
var s;
s=0==r.ret?r.play_url?0:6:1001==r.ret?1:1002==r.ret?2:1003==r.ret?3:1004==r.ret?4:5,
d({
type:"success",
time:o,
code:s
}),e.onSuc({
status:s,
play_url:r.play_url
});
},
onerror:function(r){
var o=+new Date-t,i=4;
switch(1*r){
case 400:
i=2;
break;

case 500:
i=3;
break;

default:
i=4;
}
d({
type:"error",
time:o,
code:i
}),"function"==typeof e.onError&&e.onError({
errcode:i
});
}
});
}
function d(e){
var t=Math.max(e.time,0);
if(t=Math.min(t,6e4),e.time>=0&&e.time<200?f.setSum(I.reportId,24,1):e.time>=200&&e.time<500?f.setSum(I.reportId,25,1):e.time>=500&&e.time<1e3?f.setSum(I.reportId,26,1):e.time>=1e3&&e.time<2e3?f.setSum(I.reportId,27,1):e.time>=2e3&&e.time<1e4?f.setSum(I.reportId,28,1):e.time>=1e4&&f.setSum(I.reportId,29,1),
f.setAvg(I.reportId,23,t),"error"==e.type){
switch(1*e.code){
case 1:
f.setSum(I.reportId,9,1);
break;

case 2:
f.setSum(I.reportId,10,1);
break;

case 3:
f.setSum(I.reportId,11,1);
break;

case 4:
f.setSum(I.reportId,12,1);
}
f.setSum(I.reportId,19,1);
}else if("success"==e.type){
switch(1*e.code){
case 1:
f.setSum(I.reportId,8,1);
break;

case 0:
f.setSum(I.reportId,17,1);
break;

case 2:
f.setSum(I.reportId,13,1);
break;

case 3:
f.setSum(I.reportId,14,1);
break;

case 4:
f.setSum(I.reportId,15,1);
break;

case 5:
f.setSum(I.reportId,16,1);
break;

case 6:
f.setSum(I.reportId,47,1);
}
f.setSum(I.reportId,20,1);
}
f.send();
}
function u(e){
return new i(e);
}
var m=e("biz_common/dom/event.js"),l=e("biz_common/tmpl.js"),_=e("pages/loadscript.js"),y=e("pages/music_player.js"),h=e("biz_common/dom/class.js"),g=e("pages/report.js"),f=e("biz_common/utils/monitor.js"),I={
reportId:"28306",
musicSupport:y.getSurportType(),
reportData:{},
posIndex:{},
qqMusiceSongId:"http://thirdparty.gtimg.com/#songId#.m4a?fromtag=38&songid=#songId#",
qqMusiceMid:"http://thirdparty.gtimg.com/C100#mid#.m4a?fromtag=38&songid=#songId#",
num:0
};
return n(),a(),i.prototype._init=function(e){
this._extend(e),this._g={
copyright:-1,
check_copyright:!1
},this._initQQmusicLyric(),this._initReportData(),this._initPlayer(),this._playEvent();
},i.prototype._initQQmusicLyric=function(){
var e=this._o;
e.webUrl=0==e.type||1==e.type?e.webUrl.replace("#songId#",e.songId||"").replace("#referFrom#","music.qq.com"):e.webUrl.replace("#songId#","").replace("#referFrom#","");
},i.prototype._initReportData=function(){
var e=this._o;
2==e.type||3==e.type?window.reportVoiceid.push(e.songId):(0==e.type||1==e.type)&&window.reportMid.push(e.songId),
"undefined"==typeof I.reportData[e.type]&&(I.reportData[e.type]=g.getMusicReportData(e),
I.posIndex[e.type]=0),this._g.posIndex=I.posIndex[e.type]++;
var t=I.reportData[e.type];
t.musicid.push(e.songId),t.commentid.push(e.comment_id),t.hasended.push(0),t.mtitle.push(e.title),
t.detail_click.push(0),t.duration.push(parseInt(1e3*e.duration)),t.errorcode.push(0),
t.play_duration.push(0);
},i.prototype._initPlayer=function(){
I.musicSupport&&(this._o.onStatusChange=this._statusChangeCallBack(),this._o.onTimeupdate=this._timeupdateCallBack(),
this._o.onError=this._errorCallBack(),this.player=new y.init(this._o));
},i.prototype._playEvent=function(){
var e=this,t=this._o,r=this._g;
if(I.musicSupport){
var o=0;
2==t.type||3==t.type?o=3:(0==t.type||1==t.type)&&(o=1),m.tap(t.playArea,function(){
return h.hasClass(t.playCssDom,t.playingCss)?(e.player.stop(),g.report({
type:o,
comment_id:t.comment_id,
voiceid:t.songId,
action:5
})):3==o?e._playMusic(3):1==o&&e._checkCopyright(function(){
e.player.setSrc(r.play_url),e._playMusic(1);
}),!1;
});
}
t.detailUrl&&t.detailArea&&m.tap(t.detailArea,function(){
e._checkCopyright(function(){
I.reportData[t.type].detail_click[r.posIndex]=1,window.location.href=t.detailUrl;
});
});
},i.prototype._checkCopyright=function(e){
var t=this,r=this._o,o=this._g;
return o.play_url&&this._musicCopyrightWarnning(!1)===!1?void("function"==typeof e&&e()):void(o.check_copyright||(o.check_copyright=!0,
c({
id:r.songId,
mid:r.mid,
onSuc:function(r){
o.check_copyright=!1,o.copyright=1*r.status,t._musicCopyrightWarnning(!0)===!1&&"function"==typeof e&&(o.play_url=r.play_url,
e({
play_url:r.play_url
}));
},
onError:function(){
o.check_copyright=!1;
}
})));
},i.prototype._musicCopyrightWarnning=function(e){
var t=this._g,r=!0,i="";
switch(1*t.copyright){
case 0:
r=!1;
break;

case 1:
r=!0,i="该歌曲版权已过期，无法播放。";
break;

case 2:
r=!0,i="抱歉，应版权方要求，当前国家或地区暂不提供此歌曲服务。";
break;

case 3:
r=!0,i="该歌曲版权已过期，无法播放。";
break;

case 4:
r=!0,i="抱歉，歌曲信息不正确。";
break;

case 5:
r=!0,i="系统错误，请稍后再试。";
break;

case 6:
r=!0,i="系统错误，请稍后再试。";
break;

default:
r=!0,i="系统错误，请稍后再试。";
}
return r===!0&&e===!0&&(i+="错误码："+t.copyright,setTimeout(function(){
o(i);
},0)),r;
},i.prototype._playMusic=function(e){
var t=this._o,r=this._g;
this.player.play(0),I.reportData[t.type].hasended[r.posIndex]=1,g.report({
type:e,
comment_id:t.comment_id,
voiceid:t.songId,
action:4
});
},i.prototype._extend=function(e){
for(var t in e)this._o[t]=e[t];
},i.prototype._statusChangeCallBack=function(){
var e=this;
return function(t,r){
e._updatePlayerCss(this,r);
};
},i.prototype._timeupdateCallBack=function(){
var e=this,t=this._o,r=this._g;
return function(o,i){
e._updateProgress(this,i),0!=i&&(I.reportData[t.type].play_duration[r.posIndex]=parseInt(1e3*i));
};
},i.prototype._errorCallBack=function(){
var e=this,t=this._o,r=this._g;
return function(o,i){
I.reportData[t.type].errorcode[r.posIndex]=i,e._updatePlayerCss(this,3);
};
},i.prototype._updatePlayerCss=function(e,t){
var r=this._o,o=r.playCssDom,i=r.progress;
2==t||3==t?(h.removeClass(o,r.playingCss),!!i&&(i.style.width=0)):1==t&&h.addClass(o,r.playingCss);
},i.prototype._updateProgress=function(e,t){
var r=this._o,o=r.progress,i=e.getDuration();
i&&o&&(o.style.width=this._countProgress(i,t));
},i.prototype._countProgress=function(e,t){
return t/e*100+"%";
},{
init:u,
renderPlayer:s
};
});define("pages/qqmusic_tpl.html.js",[],function(){
return'<span id="qqmusic_main_<#=comment_id#>_<#=posIndex#>" class="db qqmusic_area <#if(!musicSupport){#> unsupport<#}#>">\n    <span class="tc tips_global unsupport_tips" <#if(show_not_support!==true){#>style="display:none;"<#}#>>\n    当前浏览器不支持播放音乐或语音，请在微信或其他浏览器中播放    </span>\n    <span class="db qqmusic_wrp">\n        <span class="db qqmusic_bd">\n            <span id="qqmusic_play_<#=musicid#>_<#=posIndex#>" class="play_area">\n                <i class="icon_qqmusic_switch"></i>\n                <img src="<#=window.icon_qqmusic_default#>" alt="" class="pic_qqmusic_default">\n                <img src="<#=music_img#>" data-autourl="<#=audiourl#>" data-musicid="<#=musicid#>" class="qqmusic_thumb" alt="">\n            </span>\n            <!--\n            <%@if($show_comment.DATA$=1)%>\n            <span id="qqmusic_love_icon_<#=musicid#>_<#=posIndex#>" class="qqmusic_love">\n                <i class="icon_love"></i>\n                <span id="love_text_<#=comment_id#>_<#=posIndex#>" class="love_num">赞</span>\n            </span>\n            <%@endif%>\n            -->\n            <a id="qqmusic_home_<#=musicid#>_<#=posIndex#>" class="access_area">\n                <span class="qqmusic_songname"><#=music_name#></span>\n                <span class="qqmusic_singername"><#=singer#></span>\n                <span class="qqmusic_source"><img src="<#=window.icon_qqmusic_source#>" alt=""></span>\n            </a>\n        </span>\n    </span>       \n</span>\n';
});define("new_video/ctl.js",["biz_wap/utils/ajax.js"],function(i){
"use strict";
var e=top.window.user_uin,t=Math.floor(top.window.user_uin/100)%20;
e||(t=-1);
var o=function(){
return t>=0;
};
top.window.__webviewid||(top.window.__webviewid=+new Date+"_"+Math.ceil(1e3*Math.random()));
var d=function(){
var i=top.window.mid,t=top.window.idx,o="";
o=i&&t?i+"_"+t:"";
var d=top.window.__webviewid,r=[e,o,d].join("_");
return r;
},r=function(e){
if(20>t)try{
var r=e.vid||"",w={};
w.__biz=top.window.biz||"",w.vid=r,w.clienttime=+new Date;
var n=top.window.mid,a=top.window.idx,p="";
n&&a?(w.type=1,p=n+"_"+a):(w.type=2,p=r),w.id=p,w.webviewid=d(),w.step=e.step||0,
w.orderid=e.orderid||0,w.ad_source=e.ad_source||0,w.traceid=e.traceid||0,w.ext1=e.ext1||"",
w.ext2=e.ext2||"",w.r=Math.random(),w.devicetype=top.window.devicetype,w.version=top.window.clientversion,
w.is_gray=o()?1:0;
var _=i("biz_wap/utils/ajax.js");
_({
url:"/mp/ad_video_report?action=user_action",
type:"post",
data:w
});
}catch(v){}
};
return{
report:r,
getWebviewid:d,
showAd:o
};
});define("a/testdata.js",[],function(){
"use strict";
var p=[{
hint_txt:"",
url:"http://p.weixin.qq.com/promotion/ad_detail_info?key=30eb0e9b5ecc495af46b69e0d34e048a7ecab19188a2cf401b8572c09f2de30768b0263bd398b432283e01f2bf4df374",
type:"0",
rl:"http://c.gdt.qq.com/gdt_mclick.fcg?viewid=lBVtRb2mL!XAQbJ6ufVt!LQ9kcp5Is0QJCPSy4ohVW7C!_AWskP5eMlSdzl4ksNQvkmB6Uu!xc2JpGYuGh2qJUdnqUjSUTfKhkgciU7GR9!PeAr5mQce5B4cgZiRmWTnGvq52igNyBzorOLKhFAEOGONcPnMSXyfO8eFPpweJqk&jtype=0&i=1",
apurl:"http://v.gdt.qq.com/gdt_stats.fcg?viewid=lBVtRb2mL!XAQbJ6ufVt!LQ9kcp5Is0QJCPSy4ohVW7C!_AWskP5eMlSdzl4ksNQvkmB6Uu!xc2JpGYuGh2qJUdnqUjSUTfKhkgciU7GR9!PeAr5mQce5B4cgZiRmWTnGvq52igNyBzorOLKhFAEOGONcPnMSXyfO8eFPpweJqk&i=1",
traceid:"qh4u7udwhuwlg01",
group_id:"",
url_scheme:"asdsd",
ticket:"29tcgyfz3xfqf",
watermark_type:2,
aid:"48928",
image_url:"http://pgdt.gtimg.cn/gdt/0/CAAAE95CdBUkWUKACq5F2vZ.png/0?ck=bd6949105af97639d0ab95551e9539fb",
pt:104,
is_cpm:1,
app_info:{
url_scheme:"asd",
app_rating:4.5,
app_name:"妈妈圈-怀孕育儿",
app_id:100497157,
apk_name:"cn.mama.activity",
icon_url:"http://pp.myapp.com/ma_icon/0/icon_1221109_20044009_1419991372/96",
apk_url:"http://dd.myapp.com/16891/8332CC95CF6C0656270CA82EB65950EC.apk?fsname=cn%2Emama%2Eactivity%5F5%2E0%2E8%5F35.apk&asr=2d3d",
app_md5:"8332CC95CF6C0656270CA82EB65950EC",
version_code:35,
appinfo_url:"http://a.app.qq.com/o/simple.jsp?pkgname=cn.mama.activity",
app_size:12897787,
down_count:3840230,
category:[],
snap_shots:"http://pp.myapp.com/ma_pic2/0/shot_1221109_20044009_1_1419991365/330|http://pp.myapp.com/ma_pic2/0/shot_1221109_20044009_2_1419991365/330|http://pp.myapp.com/ma_pic2/0/shot_1221109_20044009_3_1419991365/330|http://pp.myapp.com/ma_pic2/0/shot_1221109_20044009_4_1419991365/330|http://pp.myapp.com/ma_pic2/0/shot_1221109_20044009_5_1419991365/330",
signature_md5:"749C945CB88BEBF085CC7AADA57E5364",
desc:"妈妈圈(q.mama.cn)—辣妈们必备的备孕、怀孕、育儿、家庭生活，娱乐休闲应用，3000万妈妈的选择。从备孕、孕期、 宝宝成长、早教、亲子娱乐到购物、瘦身、美食、家庭闲谈、国内外旅游攻略，只要妈妈关心的内容， 只要妈妈感兴趣的人，无所不包，无所不有。妈妈的精彩生活，上妈妈圈一手掌握。\n妈妈圈——\n她是【孕育神器】\n孕前准备、怀孕、育儿，休闲娱乐，家庭生活经营，妈妈圈沉淀了十年的专业知识和真实经验，贴心呵护妈妈的每一天。\n她是【辣妈乐园】\n寻找志趣相投的姐妹，孕育圈、兴趣圈、娱乐圈、同城圈、购物圈，圈圈相扣，要寻找的内容，要认识的姐妹这里啥都有。\n她是【同城利器】\n本地资讯、周边旅游、同城活动，折扣情报，教育医疗，只要一个妈妈圈，本地吃、喝、住、行、玩、 乐、购尽在掌握之中。\n她是【购物宝典】\n非买不可-妈妈专属的购物天地，专业的选品团队为您精挑细选, 海外淘、新奇特、白菜价，免费试用，各种玩法和商品，买得开心，败得有理！",
new_feature:"1、Android 推送样式优化\n2、针对部分Bug&问题修复"
},
card_info:{
card_logo_url:"http://pgdt.gtimg.cn/gdt/0/CAAAE95CdBUkWUKACq5F2vZ.png/0?ck=bd6949105af97639d0ab95551e9539fb",
card_titile:"测试卡券",
card_brand_name:"腾讯公司",
card_id:"123",
card_ext:"abc"
},
ad_desc:"",
biz_appid:"",
pos_type:0
}];
return{
data:p
};
});define("appmsg/reward_entry.js",["biz_common/dom/event.js","biz_wap/utils/ajax.js","biz_wap/jsapi/core.js","rt/appmsg/getappmsgext.rt.js"],function(e,t,n,r){
"use strict";
function a(e){
e&&(e.style.display="block");
}
function o(e){
e&&(e.style.display="none");
}
function i(){
p({
url:"/mp/getappmsgext?&f=json"+(window.send_time?"&send_time="+send_time:""),
data:{
__biz:biz,
appmsg_type:appmsg_type,
mid:mid,
sn:sn,
idx:idx,
scene:source,
title:encodeURIComponent(msg_title.htmlDecode()),
ct:ct,
devicetype:devicetype.htmlDecode(),
version:version.htmlDecode(),
is_need_reward:is_need_reward,
reward_uin_count:is_need_reward?3*w:0,
r:Math.random()
},
type:"post",
dataType:"json",
async:!0,
rtId:27613,
rtKey:50,
rtDesc:f,
success:function(e){
e&&(document.getElementById("js_reward_link")&&u.off(document.getElementById("js_reward_link"),"click",x),
s({
reward_total:e.reward_total_count,
reward_head_imgs:e.reward_head_imgs||[],
can_reward:e.can_reward,
timestamp:e.timestamp
}));
}
});
}
function d(e){
return function(t){
return"0"==window.wx_user_can_reward?void r("你已成为该公众号的黑名单用户，暂时无法赞赏。"):(t.preventDefault(),
void g.invoke("openUrlWithExtraWebview",{
url:e
},function(t){
t.err_msg.indexOf(":ok")>-1||(location.href=e);
}));
};
}
function s(e){
var t=window.innerWidth||document.documentElement.innerWidth,n=(Math.ceil((h-188)/42)+1)*Math.floor((t-15)/42);
_="http://mp.weixin.qq.com/mp/reward?act=getrewardheads&__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&sn="+sn+"&offset=0&count="+n+"&source=1#wechat_redirect";
var r="#wechat_redirect",s="https://mp.weixin.qq.com/bizmall/reward?__biz="+biz+"&appmsgid="+mid+"&idx="+idx+"&sn="+sn+"&timestamp="+e.timestamp+"&showwxpaytitle=1"+r,l=document.getElementById("js_reward_link");
l&&(g.on("activity:state_change",function(e){
if("onResume"==e.state_change||"onResume"==e.state){
var t=(new Date).valueOf();
if(-1!=navigator.userAgent.indexOf("Android")&&localStorage.getItem("lastOnresumeTime")&&t-parseInt(localStorage.getItem("lastOnresumeTime"))<=j)return;
localStorage.setItem("lastOnresumeTime",t),g.invoke("setNavigationBarColor",{
actionCode:"1"
}),i();
}
}),x=d(s),u.on(l,"click",x)),y=e.reward_head_imgs;
var w=c();
v.reward&&1==e.can_reward?(a(v.reward),u.on(window,"load",function(){
m&&(u.off(window,"scroll",m),u.on(window,"scroll",m));
})):o(v.reward);
var p=document.getElementById("js_reward_inner");
p&&w>0&&a(p);
var f=document.getElementById("js_reward_total");
f&&(f.innerText=e.reward_total,f.setAttribute("href",_));
}
function l(e,t){
var n=document.createElement("span");
n.className="reward_user_avatar";
var r=new Image;
return r.onload=function(){
window.logs&&window.logs.reward_heads_total++,r.onload=r.onerror=null;
},r.onerror=function(){
window.logs&&window.logs.reward_heads_total++,window.logs&&window.logs.reward_heads_fail++,
r.onload=r.onerror=null;
},r.src=t,n.appendChild(r),e.appendChild(n),n;
}
function c(){
if(y.length){
var e=document.getElementById("js_reward_list"),t=0,n=document.createDocumentFragment();
if(e){
for(var r=0,a=y.length;a>r&&(t++,l(n,y[r]),t!=3*w);++r);
t>w&&(e.className+=" tl"),e.innerHTML="",e.appendChild(n);
}
return t;
}
}
function m(){
var e=window.pageYOffset||document.documentElement.scrollTop;
e+h>v.reward.offsetTop&&(p({
type:"GET",
url:"/bizmall/reward?act=report&__biz="+biz+"&appmsgid="+mid+"&idx="+idx,
async:!0
}),u.off(window,"scroll",m),m=null);
}
var w,_,u=e("biz_common/dom/event.js"),p=e("biz_wap/utils/ajax.js"),g=e("biz_wap/jsapi/core.js"),f=e("rt/appmsg/getappmsgext.rt.js"),h=window.innerHeight||document.documentElement.clientHeight,v={
reward:document.getElementById("js_reward_area")
},y=[],j=500;
window.logs&&(window.logs.reward_heads_total=0,window.logs.reward_heads_fail=0);
var x=function(){};
return{
handle:function(e,t){
w=t,s(e);
},
render:function(e){
w=e,c();
}
};
});define("appmsg/comment.js",["appmsg/cmt_tpl.html.js","biz_common/utils/wxgspeedsdk.js","biz_common/dom/event.js","biz_common/dom/class.js","biz_wap/utils/ajax.js","biz_common/utils/string/html.js","biz_common/tmpl.js","biz_wap/utils/fakehash.js","appmsg/log.js","appmsg/my_comment_tpl.html.js","appmsg/emotion/emotion.js","appmsg/emotion/dom.js"],function(e,t,n,m){
"use strict";
function o(e,t){
e&&(e.style.display=t?t:"block");
}
function i(e){
e&&(e.style.display="none");
}
function c(){
setTimeout(function(){
o(J.toast);
},750),setTimeout(function(){
i(J.toast);
},1500);
}
function s(e){
return e.replace(/^\s+|\s+$/g,"");
}
function a(e,t){
if(!(Math.random()<.999)){
var n=window.location.protocol,m=9;
"https:"==n&&(m=18),q.saveSpeeds({
uin:uin,
pid:m,
speeds:[{
sid:29,
time:e
},{
sid:30,
time:t
}]
}),q.send();
}
}
function l(){
var e=window.innerHeight||document.documentElement.clientHeight,t=window.pageYOffset||document.documentElement.scrollTop,n=document.documentElement.scrollHeight;
if(!(S||-1==U||U>0&&n-t-e>500)){
var m=+new Date;
S=!0,i(J.tips),o(J.loading);
var c="/mp/appmsg_comment?action=getcomment&__biz="+biz+"&appmsgid="+appmsgid+"&idx="+idx+"&comment_id="+comment_id+"&offset="+U+"&limit="+A+(window.send_time?"&send_time="+send_time:"");
try{
$++,$>1&&((new Image).src="http://mp.weixin.qq.com/mp/jsreport?key=27&content="+encodeURIComponent(c)),
Z.indexOf(c)>-1&&((new Image).src="http://mp.weixin.qq.com/mp/jsreport?key=25&content="+encodeURIComponent(c)),
Z.push(c);
}catch(s){}
L("[Appmsg comment] start get comment data, url:"+c),D({
url:c,
type:"get",
success:function(e){
var t=+new Date,n=t-m,o={};
try{
o=window.eval.call(window,"("+e+")");
}catch(i){}
var s=o.base_resp&&o.base_resp.ret;
if(0==s){
r(o);
var l=+new Date-t;
a(n,l);
}else R.src="http://mp.weixin.qq.com/mp/jsreport?key=18&content=type:resperr;url:"+encodeURIComponent(c)+";ret="+s+"&r="+Math.random();
L("[Appmsg comment] get comment success, text: "+e);
},
error:function(){
R.src="http://mp.weixin.qq.com/mp/jsreport?key=18&content=type:ajaxerr;url:"+encodeURIComponent(c)+"&r="+Math.random(),
L("[Appmsg comment] get comment ajax error");
},
complete:function(){
S=!1,i(J.loading),z.off(window,"scroll",E);
}
});
}
}
function r(e){
var t,n=document.createDocumentFragment();
K++,K>1&&(X.src="http://mp.weixin.qq.com/mp/jsreport?key=26&content="+encodeURIComponent(JSON.stringify({
comment_id:comment_id,
offset:U,
url:location.href
}))),0==U?(F=e.logo_url,P=e.nick_name,t=e.elected_comment,t&&t.length?(u(t,n,"elected"),
J.list.appendChild(n),o(J.main),0==window.can_fans_comment_only||1==window.can_fans_comment_only&&1==e.is_fans?o(document.getElementById("js_cmt_addbtn1")):o(document.getElementById("js_cmt_nofans1"),"block"),
e.elected_comment_total_cnt<=10&&(o(document.getElementById("js_cmt_statement")),
o(document.getElementById("js_cmt_qa")))):(i(J.main),1==copyright_stat&&T.addClass(document.body,"rich_media_empty_extra"),
0==window.can_fans_comment_only||1==window.can_fans_comment_only&&1==e.is_fans?o(document.getElementById("js_cmt_addbtn2")):o(document.getElementById("js_cmt_nofans2"),"block")),
function(){
var e=location.href.indexOf("scrolltodown")>-1?!0:!1,t=(document.getElementById("img-content"),
document.getElementById("js_cmt_area"));
if(e&&t&&t.offsetTop){
var n=t.offsetTop;
window.scrollTo(0,n-25);
}
}()):(t=e.elected_comment,t&&t.length&&(u(t,n,"elected"),J.list.appendChild(n))),
0==e.elected_comment_total_cnt?(U=-1,z.off(window,"scroll",l),i(document.getElementById("js_cmt_loading")),
i(document.getElementById("js_cmt_statement")),i(document.getElementById("js_cmt_qa"))):U+A>=e.elected_comment_total_cnt?(U=-1,
z.off(window,"scroll",l),i(document.getElementById("js_cmt_loading")),o(document.getElementById("js_cmt_statement")),
o(document.getElementById("js_cmt_qa"))):U+=e.elected_comment.length;
}
function d(){
O.log("tag1");
var e=s(J.input.value);
if(O.log("tag2"),!T.hasClass(J.submit,"btn_disabled")){
if(O.log("tag3"),e.length<1)return y("留言不能为空");
if(O.log("tag4"),e.length>600)return y("字数不能多于600个");
O.log("tag5"),T.addClass(J.submit,"btn_disabled"),O.log("tag6");
var t=document.getElementById("activity-name");
O.log("tag7");
var n="/mp/appmsg_comment?action=addcomment&comment_id="+comment_id+"&__biz="+biz+"&idx="+idx+"&appmsgid="+appmsgid+"&sn="+sn;
D({
url:n,
data:{
content:e,
title:t&&s(t.innerText),
head_img:F,
nickname:P
},
type:"POST",
success:function(t){
O.log("tag8"),N.hidePannel();
var m={},i=document.createDocumentFragment();
try{
m=window.eval.call(window,"("+t+")");
}catch(s){}
switch(+m.ret){
case 0:
c(),u([{
content:e,
nick_name:P,
create_time:(new Date).getTime()/1e3|0,
is_elected:0,
logo_url:F,
like_status:0,
content_id:0,
like_num_format:0,
like_num:0,
is_from_friend:0,
is_from_me:1,
my_id:m.my_id
}],i,"mine"),J.mylist.insertBefore(i,J.mylist.firstChild),o(J.mylist.parentNode),
J.input.value="";
break;

case-6:
y("你留言的太频繁了，休息一下吧");
break;

case-7:
y("你还未关注该公众号，不能参与留言");
break;

case-10:
y("字数不能多于600个");
break;

case-15:
y("留言已关闭");
break;

default:
y("系统错误，请重试");
}
0!=m.ret&&(R.src="http://mp.weixin.qq.com/mp/jsreport?key=19&content=type:resperr;url:"+encodeURIComponent(n)+";ret="+m.ret+"&r="+Math.random());
},
error:function(e){
O.log("shit;"+e.status+";"+e.statusText),R.src="http://mp.weixin.qq.com/mp/jsreport?key=19&content=type:ajaxerr;url:"+encodeURIComponent(n)+"&r="+Math.random();
},
complete:function(){
""!=J.input.value&&T.removeClass(J.submit,"btn_disabled");
}
});
}
}
function p(){
if(0==Y){
var e="/mp/appmsg_comment?action=getmycomment&__biz="+biz+"&appmsgid="+appmsgid+"&idx="+idx+"&comment_id="+comment_id,t=document.getElementById("js_mycmt_loading");
Y=1,o(t),D({
url:e,
type:"get",
success:function(t){
var n={};
try{
n=window.eval.call(window,"("+t+")");
}catch(m){}
var i=n.base_resp&&n.base_resp.ret;
if(0==i){
var c=n.my_comment,s=document.createDocumentFragment();
c&&c.length&&(u(c,s,"mine"),J.mylist.appendChild(s),o(J.mylist.parentNode)),Y=2;
}else Y=0,R.src="http://mp.weixin.qq.com/mp/jsreport?key=18&content=type:resperr;url:"+encodeURIComponent(e)+";ret="+i+"&r="+Math.random();
},
error:function(){
Y=0,R.src="http://mp.weixin.qq.com/mp/jsreport?key=18&content=type:ajaxerr;url:"+encodeURIComponent(e)+"&r="+Math.random();
},
complete:function(){
i(t);
}
});
}
}
function _(e){
var t=(new Date).getTime(),n=new Date;
n.setDate(n.getDate()+1),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n=n.getTime();
var m=t/1e3-e,o=n/1e3-e,i=new Date(n).getFullYear(),c=new Date(1e3*e);
return 3600>m?Math.ceil(m/60)+"分钟前":86400>o?Math.floor(m/60/60)+"小时前":172800>o?"昨天":604800>o?Math.floor(o/24/60/60)+"天前":c.getFullYear()==i?c.getMonth()+1+"月"+c.getDate()+"日":c.getFullYear()+"年"+(c.getMonth()+1)+"月"+c.getDate()+"日";
}
function u(e,t,n){
var m,o="",i=document.createElement("div"),c="http://mmbiz.qpic.cn/mmbiz/ByCS3p9sHiak6fjSeA7cianwo25C0CIt5ib8nAcZjW7QT1ZEmUo4r5iazzAKhuQibEXOReDGmXzj8rNg/0";
Q={};
for(var s,a=0;s=e[a];++a){
s.time=_(s.create_time),s.status="",s.logo_url=s.logo_url||c,s.logo_url=-1!=s.logo_url.indexOf("wx.qlogo.cn")?s.logo_url.replace(/\/132$/,"/96"):s.logo_url,
s.content=s.content.htmlDecodeLite().htmlEncodeLite(),s.nick_name=s.nick_name.htmlDecodeLite().htmlEncodeLite(),
s.like_num_format=parseInt(s.like_num)>=1e4?(s.like_num/1e4).toFixed(1)+"万":s.like_num,
s.is_from_friend=s.is_from_friend||0,s.is_from_me="mine"==n?1:s.is_from_me||0,s.reply=s.reply||{
reply_list:[]
},s.is_mine=n?!1:!0,s.is_elected="elected"==n?1:s.is_elected,s.reply.reply_list.length>0&&(s.reply.reply_list[0].time=_(s.reply.reply_list[0].create_time),
s.reply.reply_list[0].content=(s.reply.reply_list[0].content||"").htmlEncodeLite(),
s.reply.reply_list[0].reply_like_status=s.reply.reply_list[0].reply_like_status||0,
s.reply.reply_list[0].reply_like_num=s.reply.reply_list[0].reply_like_num||0),o+=M.tmpl(x,s);
try{
var l=s.nick_name+s.content,r=!1,d=23;
Q[l]&&(r=!0,d=24),G.indexOf(s.content_id)>-1&&(r=!0,d=23),G.push(s.content_id),Q[l]=!0,
r&&(X.src="http://mp.weixin.qq.com/mp/jsreport?key="+d+"&content="+encodeURIComponent(JSON.stringify({
comment_id:comment_id,
content_id:s.content_id,
offset:U,
length:e.length,
url:location.href
})));
}catch(p){}
}
for(i.innerHTML=o,g(i);m=i.children.item(0);)t.appendChild(m);
}
function g(e){
O.each(e.querySelectorAll("div.discuss_message_content"),function(e){
e.innerHTML=N.encode(e.innerHTML);
});
}
function y(e){
return setTimeout(function(){
m(e);
});
}
function f(){
var e="1"===C.getParam("js_my_comment");
e&&h(!0);
}
function h(e){
i(J.article),o(J.mine),window.scrollTo(0,0),p(),e||O.later(function(){
J.input.focus();
});
}
function w(){
i(J.mine),o(J.article),window.scrollTo(0,document.documentElement.scrollHeight),
J.input.blur();
}
function j(e){
var t=e.delegatedTarget||e.srcElement,n=null;
if(T.hasClass(t,"js_comment_praise")&&(n=t),n){
var m=parseInt(n.dataset.status),o=0==m?1:0,i=n.dataset.contentId,c="/mp/appmsg_comment?action=likecomment&&like="+o+"&__biz="+biz+"&appmsgid="+appmsgid+"&comment_id="+comment_id+"&content_id="+i;
v(n),D({
url:c,
type:"GET"
});
}
}
function b(e){
var t=e.delegatedTarget,n=parseInt(t.dataset.status),m=n?0:1,o=t.dataset.contentId,i=t.dataset.replyId;
v(t),D({
url:"/mp/appmsg_comment?action=like_author_reply",
type:"post",
data:{
comment_id:comment_id,
content_id:o,
reply_id:i,
like:m
}
});
}
function v(e){
var t=T.hasClass(e,"praised"),n=e.querySelector(".praise_num"),m=n.innerHTML,o=m.indexOf("万"),i=parseInt(m)?parseInt(m):0;
t?(-1==o&&(n.innerHTML=i-1>0?i-1:""),T.removeClass(e,"praised"),e.dataset.status=0):(-1==o&&(n.innerHTML=i+1),
T.addClass(e,"praised"),e.dataset.status=1);
}
function I(e){
var t=e.delegatedTarget,n=t.getAttribute("data-my-id"),c="/mp/appmsg_comment?action=delete&__biz="+biz+"&appmsgid="+appmsgid+"&comment_id="+comment_id+"&my_id="+n;
confirm("确定删除吗？")&&D({
url:c,
success:function(e){
var c,s=t;
try{
e=JSON.parse(e);
}catch(a){
e={};
}
if(0==e.ret){
for(;s&&(s.nodeType!=s.ELEMENT_NODE||"li"!=s.tagName.toLowerCase());)s=s.parentNode;
s&&(s.parentNode.removeChild(s),c=document.getElementById("cid"+n),c&&c.parentNode.removeChild(c),
0==J.list.children.length&&(i(J.main),i(document.getElementById("js_cmt_statement")),
i(document.getElementById("js_cmt_qa")),o(document.getElementById("js_cmt_addbtn2"))),
0==J.mylist.children.length&&i(J.mylist.parentNode));
}else m("删除失败，请重试");
},
error:function(){
m("网络错误，请重试");
}
});
}
function E(){
try{
var e=J.loading.getBoundingClientRect(),t=Math.random()<1;
e.top<window.innerHeight&&S&&t&&((new Image).src="//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_45_1&lc=1&log0",
z.off(window,"scroll",E));
}catch(n){}
}
function k(e){
var t=document.createElement("a");
t.setAttribute("href",e),this.el=t,this.parser=this.el,this.getParam=function(e){
var t=new RegExp("([?&])"+e+"=([^&#]*)([&#])?"),n=this.el.search.match(t);
return n?n[2]:null;
};
}
var x=e("appmsg/cmt_tpl.html.js"),B=document.getElementById("js_cmt_area"),C=new k(window.location.href),q=e("biz_common/utils/wxgspeedsdk.js");
if(0!=comment_id&&uin&&key){
if(-1==navigator.userAgent.indexOf("MicroMessenger"))return void(B&&(B.style.display="none"));
B&&(B.style.display="block");
var z=e("biz_common/dom/event.js"),T=e("biz_common/dom/class.js"),D=e("biz_wap/utils/ajax.js"),M=(e("biz_common/utils/string/html.js"),
e("biz_common/tmpl.js")),H=e("biz_wap/utils/fakehash.js"),L=e("appmsg/log.js");
!function(){
var t=e("appmsg/my_comment_tpl.html.js"),n=document.createElement("div");
n.innerHTML=M.tmpl(t,{}),document.body.appendChild(n);
}();
var N=e("appmsg/emotion/emotion.js"),O=e("appmsg/emotion/dom.js"),R=new Image,U=0,A=100,S=!1,F="",P="我",Y=0,J={
article:document.getElementById("js_article"),
mine:document.getElementById("js_cmt_mine"),
main:document.getElementById("js_cmt_main"),
input:document.getElementById("js_cmt_input"),
submit:document.getElementById("js_cmt_submit"),
addbtn:document.getElementById("js_cmt_addbtn"),
list:document.getElementById("js_cmt_list"),
mylist:document.getElementById("js_cmt_mylist"),
morelist:document.getElementById("js_cmt_morelist"),
toast:document.getElementById("js_cmt_toast"),
tips:document.getElementById("js_cmt_tips"),
loading:document.getElementById("js_cmt_loading")
},G=[],Q={},X=new Image,Z=[],$=0,K=0;
!function(){
l(),f(),N.init();
}(),H.on("comment",function(){
h();
}),H.on(function(e){
"comment"==e&&w();
}),z.on(J.input,"input",function(){
var e=s(J.input.value);
e.length<1?T.addClass(J.submit,"btn_disabled"):T.removeClass(J.submit,"btn_disabled");
}),z.on(J.list,"tap",".js_comment_praise",j),z.on(J.mylist,"tap",".js_comment_praise",j),
z.on(J.list,"tap",".js_reply_praise",b),z.on(J.list,"tap",".js_del",I),z.on(J.mylist,"tap",".js_del",I),
z.on(J.list,"tap",".js_del",function(e){
e.preventDefault();
}),z.on(J.mylist,"tap",".js_del",function(e){
e.preventDefault();
}),z.on(J.submit,"tap",d),z.on(J.submit,"click",function(e){
e.preventDefault();
}),z.on(window,"scroll",E),z.on(document.getElementById("js_cmt_write1"),"click",function(e){
e.preventDefault(),H.push("comment");
}),z.on(document.getElementById("js_cmt_write2"),"click",function(e){
e.preventDefault(),H.push("comment");
});
}
});define("appmsg/like.js",["biz_common/dom/event.js","biz_common/dom/class.js","biz_wap/utils/ajax.js"],function(require,exports,module,alert){
"use strict";
function like_report(e){
var tmpAttr=el_like.getAttribute("like"),tmpHtml=el_likeNum.innerHTML,isLike=parseInt(tmpAttr)?parseInt(tmpAttr):0,like=isLike?0:1,likeNum=parseInt(tmpHtml)?parseInt(tmpHtml):0;
ajax({
url:"/mp/appmsg_like?__biz="+biz+"&mid="+mid+"&idx="+idx+"&like="+like+"&f=json&appmsgid="+appmsgid+"&itemidx="+itemidx,
data:{
is_temp_url:window.is_temp_url||0
},
type:"POST",
success:function(res){
var data=eval("("+res+")");
0==data.base_resp.ret&&(isLike?(Class.removeClass(el_like,"praised"),el_like.setAttribute("like",0),
likeNum>0&&"100000+"!==tmpHtml&&(el_likeNum.innerHTML=likeNum-1==0?"赞":likeNum-1)):(el_like.setAttribute("like",1),
Class.addClass(el_like,"praised"),"100000+"!==tmpHtml&&(el_likeNum.innerHTML=likeNum+1)));
},
async:!0
});
}
var DomEvent=require("biz_common/dom/event.js"),Class=require("biz_common/dom/class.js"),ajax=require("biz_wap/utils/ajax.js"),el_toolbar=document.getElementById("js_toobar3");
if(el_toolbar&&el_toolbar.querySelector){
var el_like=el_toolbar.querySelector("#like3"),el_likeNum=el_toolbar.querySelector("#likeNum3"),el_readNum=el_toolbar.querySelector("#readNum3");
DomEvent.on(el_like,"click",function(e){
return like_report(e),!1;
});
}
});//下载并打开APP
;define('pages/version4video.js', ['biz_common/dom/event.js', 'biz_wap/jsapi/core.js', 'biz_wap/utils/device.js', 'new_video/ctl.js'], function(require, exports, module, alert){
	'use strict';

	var DomEvent = require('biz_common/dom/event.js'),
		JSAPI = require('biz_wap/jsapi/core.js'),
		Device = require('biz_wap/utils/device.js'),
        VideoCtl = require('new_video/ctl.js'),
        ua = top.window.navigator.userAgent,
		g = {
			networkType : ""
		},
		device = {
		};
    
    function report(key, content){
        content = content || '';
        content = ['uin:'+top.window.user_uin, 'resp:'+content].join('|');
        (new Image).src = '/mp/jsreport?key=' + key + '&content=' + content + '&r=' + Math.random();
    }

	(function(ua){
		var os = Device.os;
		device.is_ios = /(iPhone|iPad|iPod|iOS)/i.test(ua);
		device.is_android = !!os.android;
		device.is_wp = !!os.phone;
		device.is_pc = (!os.phone) && (!!os.Mac||!!os.windows);
		device.inWechat = /MicroMessenger/.test(ua);
		device.is_android_phone = device.is_android&&/Mobile/i.test(ua);
		device.is_android_tablet = device.is_android&&!/Mobile/i.test(ua);
		device.ipad = /iPad/i.test(ua);
		device.iphone = !device.ipad && /(iphone)\sos\s([\d_]+)/i.test(ua);
        device.is_x5 = /TBS\//.test(ua) && /MQQBrowser/i.test(ua);

        
        
        
        var wechat = ua.match(/MicroMessenger\/((\d+)(\.\d+)*)/);
        device.wechatVer = wechat && wechat[1] || 0;

		DomEvent.on(window, 'load', function(){
			if (g.networkType == "" && device.inWechat){
			    
			    var nettype_map = {
			        "network_type:fail" : "fail",
			        "network_type:edge": "2g/3g",
			        "network_type:wwan": "2g/3g",
			        "network_type:wifi": "wifi"
			    };
			    JSAPI.invoke('getNetworkType',{}, function(res) {
			        g.networkType = nettype_map[res.err_msg]||"fail";
			    });
			}
	    },false);
	})(top.window.navigator.userAgent);

    if (typeof top.window._hasReportCanSupportVideo == 'undefined') {
        top.window._hasReportCanSupportVideo = false;
    } 


	function isShowMpVideo(){
    	
		
		document.domain = "qq.com";
        if (top.location.href.indexOf("&_newvideoplayer=0") != -1){
            return false;    
        }
        if (top.location.href.indexOf("&_newvideoplayer=1") != -1){
            return true;    
        }
        if (top.window.is_login != 1) {
            return false;
        }
        if (!!top.window.use_tx_video_player){
            return false;
        }
		if (!Device.canSupportVideo || !device.inWechat){
			if (!top.window._hasReportCanSupportVideo && !Device.canSupportVideo && !!device.inWechat){
				top.window._hasReportCanSupportVideo = true;
				report(44);
			}
			return false;
		}

        
        if (device.is_ios || (device.is_android && device.is_x5)){
            return true;    
        }
        return false;
	}

    
	
    function isUseAd(){

    	
        
        
        
        var url = top.location.href,
            selfUrl = window.location.href;
        var sn = top.sn || ""; 
        if (url.indexOf("&_videoad=0") != -1 && (top.sn == "5a2492d450d45369cd66e9af8ee97dbd" || top.sn == "f62e1cb98630008303667f77c17c43d7" || top.sn == "30c609ee11a3a74a056e863f0e20cae2")){
            
            return false;    
        }
        if (url.indexOf("&_videoad=1") != -1){
            
            return true;    
        }
        if (url.indexOf("mp.weixin.qq.com/s") == -1 && url.indexOf("mp.weixin.qq.com/mp/appmsg/show") == -1) {
            return false;
        }
        if (top.window.appmsg_type == "54"){
            return false;
        }
        if(selfUrl.indexOf("&xd=1")!=-1){
            return false;
        }        
        if (!!top.window.__appmsgCgiData && top.window.__appmsgCgiData.can_use_page && (device.is_ios || device.is_android)){
            return true;
        }
        if (VideoCtl.showAd()){
            return true;
        }
        return false;
    }
    function isUseProxy(){
        
        

        var url = top.location.href;
        if (!top.window.user_uin){
            return false;
        }
        if (url.indexOf("&_proxy=1") != -1){
            return true;    
        }
        if (url.indexOf("&_proxy=0") != -1){
            return false;    
        }

        if (url.indexOf("mp.weixin.qq.com/s") == -1 && url.indexOf("mp.weixin.qq.com/mp/appmsg/show") == -1) {
            return false;
        }

        var h = (new Date()).getHours();

        if (h >= 9 && h <= 14){
            return false;
        }
        

        if (device.inWechat && device.is_android && device.is_x5 && device.wechatVer >= "6.2.2") {
            return true;
        }

        if (device.inWechat && device.is_ios) {
            if (ua.indexOf("MicroMessenger/6.2.4") != -1 || device.wechatVer >= "6.2.4") {
                
                return true;
            }
            else{
                
            }
        }

        return false;
    }

	function getNetworkType(){
		return g.networkType;
	}

	return {
		device : device,
		isShowMpVideo : isShowMpVideo,
		isUseProxy    : isUseProxy,
		isUseAd    : isUseAd,
		getNetworkType : getNetworkType
	};
});
define("a/a.js",["biz_common/dom/event.js","biz_common/utils/url/parse.js","a/a_report.js","biz_wap/utils/ajax.js","biz_wap/utils/position.js","a/card.js","a/mpshop.js","biz_wap/jsapi/core.js","biz_common/tmpl.js","a/a_tpl.html.js","a/sponsor_a_tpl.html.js","biz_common/utils/report.js","biz_common/dom/class.js","biz_wap/utils/storage.js","appmsg/log.js","appmsg/cdn_img_lib.js","biz_wap/utils/mmversion.js","a/profile.js","a/android.js","a/ios.js","a/app_card.js","a/sponsor.js"],function(require,exports,module,alert){
"use strict";
function report(e,a){
Report("http://mp.weixin.qq.com/mp/ad_report?action=follow&type="+e+a);
}
function checkNeedAds(){
var is_need_ad=1,_adInfo=null,screen_num=0,both_ad=0,inwindowwx=-1!=navigator.userAgent.indexOf("WindowsWechat");
if(!document.getElementsByClassName||-1==navigator.userAgent.indexOf("MicroMessenger")||inwindowwx)is_need_ad=0,
js_sponsor_ad_area.style.display="none",js_top_ad_area.style.display="none",js_bottom_ad_area.style.display="none";else{
var adLS=new LS("ad");
if(window.localStorage)try{
var key=[biz,sn,mid,idx].join("_"),_ad=adLS.get(key);
_adInfo=_ad.info;
try{
_adInfo=eval("("+_adInfo+")");
}catch(e){
_adInfo=null;
}
var _adInfoSaveTime=_ad.time,_now=+new Date;
_adInfo&&18e4>_now-1*_adInfoSaveTime&&1*_adInfo.advertisement_num>0?is_need_ad=0:adLS.remove(key);
}catch(e){
is_need_ad=1,_adInfo=null;
}
}
return screen_num=Math.ceil(document.body.scrollHeight/(document.documentElement.clientHeight||window.innerHeight)),
both_ad=screen_num>=2?1:0,{
is_need_ad:is_need_ad,
both_ad:both_ad,
_adInfo:_adInfo
};
}
function afterGetAdData(e,a){
var t={},i=e.is_need_ad,o=e._adInfo;
if(0==i)t=o,t||(t={
advertisement_num:0
});else{
if(a.advertisement_num>0&&a.advertisement_info){
var p=a.advertisement_info;
t.advertisement_info=saveCopy(p);
}
t.advertisement_num=a.advertisement_num;
}
if(1==i&&(window._adRenderData=t),t=t||{
advertisement_num:0
},!t.flag&&t.advertisement_num>0){
var n=t.advertisement_num,r=t.advertisement_info;
window.adDatas.num=n;
for(var _=0;n>_;++_){
var d=null,s=r[_];
if(s.exp_info=s.exp_info||{},s.is_cpm=s.is_cpm||0,s.biz_info=s.biz_info||{},s.app_info=s.app_info||{},
s.pos_type=s.pos_type||0,s.logo=s.logo||"",100==s.pt||115==s.pt){
for(var l=s.exp_info.exp_value||[],c=!1,m=0,u=0;u<l.length;++u){
var f=l[u]||{};
if(1==f.exp_type&&(m=f.comm_attention_num,c=m>0),2==f.exp_type){
c=!1,m=0;
break;
}
}
s.biz_info.show_comm_attention_num=c,s.biz_info.comm_attention_num=m,d={
usename:s.biz_info.user_name,
pt:s.pt,
url:s.url,
traceid:s.traceid,
adid:s.aid,
ticket:s.ticket,
is_appmsg:!0
};
}else if(102==s.pt)d={
appname:s.app_info.app_name,
versioncode:s.app_info.version_code,
pkgname:s.app_info.apk_name,
androiddownurl:s.app_info.apk_url,
md5sum:s.app_info.app_md5,
signature:s.app_info.version_code,
rl:s.rl,
traceid:s.traceid,
pt:s.pt,
ticket:s.ticket,
type:s.type,
adid:s.aid,
is_appmsg:!0
};else if(101==s.pt)d={
appname:s.app_info.app_name,
app_id:s.app_info.app_id,
icon_url:s.app_info.icon_url,
appinfo_url:s.app_info.appinfo_url,
rl:s.rl,
traceid:s.traceid,
pt:s.pt,
ticket:s.ticket,
type:s.type,
adid:s.aid,
is_appmsg:!0
};else if(103==s.pt||104==s.pt||2==s.pt&&s.app_info){
var g=s.app_info.down_count||0,y=s.app_info.app_size||0,v=s.app_info.app_name||"",j=s.app_info.category,h=["万","百万","亿"];
if(g>=1e4){
g/=1e4;
for(var w=0;g>=10&&2>w;)g/=100,w++;
g=g.toFixed(1)+h[w]+"次";
}else g=g.toFixed(1)+"次";
y=formSize(y),j=j?j[0]||"其他":"其他",v=formName(v),s.app_info._down_count=g,s.app_info._app_size=y,
s.app_info._category=j,s.app_info.app_name=v,d={
appname:s.app_info.app_name,
app_rating:s.app_info.app_rating||0,
icon_url:s.app_info.icon_url,
app_id:s.app_info.app_id,
channel_id:s.app_info.channel_id,
md5sum:s.app_info.app_md5,
rl:s.rl,
pkgname:s.app_info.apk_name,
url_scheme:s.app_info.url_scheme,
androiddownurl:s.app_info.apk_url,
versioncode:s.app_info.version_code,
appinfo_url:s.app_info.appinfo_url,
traceid:s.traceid,
pt:s.pt,
url:s.url,
ticket:s.ticket,
type:s.type,
adid:s.aid,
is_appmsg:!0
};
}else if(105==s.pt){
var k=s.card_info.card_id||"",b=s.card_info.card_ext||"";
b=b.htmlDecode();
try{
b=JSON.parse(b),b.outer_str=s.card_info.card_outer_id||"",b=JSON.stringify(b);
}catch(x){
b="{}";
}
d={
card_id:k,
card_ext:b,
pt:s.pt,
ticket:s.ticket||"",
url:s.url,
rl:s.rl,
tid:s.traceid,
traceid:s.traceid,
type:s.type,
adid:s.aid,
is_appmsg:!0
};
}else if(106==s.pt){
var z=s.mp_shop_info.pid||"",I=s.mp_shop_info.outer_id||"";
d={
pid:z,
outer_id:I,
pt:s.pt,
url:s.url,
rl:s.rl,
tid:s.traceid,
traceid:s.traceid,
type:s.type,
adid:s.aid,
is_appmsg:!0
};
}else if(108==s.pt||109==s.pt||110==s.pt)d={
pt:s.pt,
ticket:s.ticket||"",
url:s.url,
traceid:s.traceid,
adid:s.aid,
is_appmsg:!0
};else if(111==s.pt||113==s.pt||114==s.pt||112==s.pt){
var y=s.app_info.app_size||0,v=s.app_info.app_name||"";
y=formSize(y),v=formName(v),s.app_info.app_size=y,s.app_info.app_name=v,d={
appname:s.app_info.app_name,
app_rating:s.app_info.app_rating||0,
app_id:s.app_info.app_id,
icon_url:s.app_info.icon_url,
channel_id:s.app_info.channel_id,
md5sum:s.app_info.app_md5,
rl:s.rl,
pkgname:s.app_info.apk_name,
url_scheme:s.app_info.url_scheme,
androiddownurl:s.app_info.apk_url,
versioncode:s.app_info.version_code,
appinfo_url:s.app_info.appinfo_url,
traceid:s.traceid,
pt:s.pt,
url:s.url,
ticket:s.ticket,
type:s.type,
adid:s.aid,
source:source||"",
is_appmsg:!0
};
}
var E=s.image_url;
require("appmsg/cdn_img_lib.js");
var D=require("biz_common/utils/url/parse.js");
E&&E.isCDN()&&(E=E.replace(/\/0$/,"/640"),E=E.replace(/\/0\?/,"/640?"),s.image_url=D.addParam(E,"wxfrom","50",!0)),
adDatas.ads["pos_"+s.pos_type]={
a_info:s,
adData:d
},localStorage&&localStorage.setItem&&s.app_info&&s.app_info.url_scheme&&localStorage.setItem("__WXLS__a_url_schema_"+s.traceid,s.app_info.url_scheme);
}
var q=function(e){
var a=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
"undefined"!=typeof e&&(a=e);
10>=a&&(A.style.display="block",DomEvent.off(window,"scroll",q));
},T=function(){
var e=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,a=document.documentElement.clientHeight||window.innerHeight;
B.offsetTop<e+a&&(Class.addClass(document.getElementById("js_ad_area"),"show"),DomEvent.off(window,"scroll",T));
},C=document.getElementById("js_bottom_ad_area"),A=document.getElementById("js_top_ad_area"),B=document.getElementById("js_sponsor_ad_area"),O=adDatas.ads;
for(var S in O)if(0==S.indexOf("pos_")){
var d=O[S],s=!!d&&d.a_info;
if(d&&s)if(0==s.pos_type){
if(C.innerHTML=TMPL.tmpl(a_tpl,s),111==s.pt||112==s.pt||113==s.pt||114==s.pt){
var N=document.getElementsByClassName("js_download_app_card")[0],H=N.offsetWidth,M=Math.floor(H/2.875);
M>0&&(N.style.height=M+"px");
}
}else if(1==s.pos_type){
A.style.display="none",A.innerHTML=TMPL.tmpl(a_tpl,s),DomEvent.on(window,"scroll",q);
var R=0;
window.localStorage&&(R=1*localStorage.getItem(S)||0),window.scrollTo(0,R),q(R);
}else if(3==s.pos_type){
var N=document.createElement("div");
N.appendChild(document.createTextNode(s.image_url)),s.image_url=N.innerHTML,B.innerHTML=TMPL.tmpl(sponsor_a_tpl,s),
B.style.display="block";
var L=B.clientWidth;
document.getElementById("js_main_img").style.height=L/1.77+"px",DomEvent.on(window,"scroll",T),
T(0);
}
}
bindAdOperation();
}
}
function saveCopyArr(e){
for(var a=[],t=0;t<e.length;++t){
var i=e[t],o=typeof i;
i="string"==o?i.htmlDecode():i,"object"==o&&(i="[object Array]"==Object.prototype.toString.call(i)?saveCopyArr(i):saveCopy(i)),
a.push(i);
}
return a;
}
function saveCopy(e){
var a={};
for(var t in e)if(e.hasOwnProperty(t)){
var i=e[t],o=typeof i;
i="string"==o?i.htmlDecode():i,"object"==o&&(i="[object Array]"==Object.prototype.toString.call(i)?saveCopyArr(i):saveCopy(i)),
a[t]=i;
}
return a;
}
function formName(e){
for(var a=[" ","-","(",":",'"',"'","：","（","—","－","“","‘"],t=-1,i=0,o=a.length;o>i;++i){
var p=a[i],n=e.indexOf(p);
-1!=n&&(-1==t||t>n)&&(t=n);
}
return-1!=t&&(e=e.substring(0,t)),e;
}
function formSize(e){
return"number"!=typeof e?e:(e>=1024?(e/=1024,e=e>=1024?(e/1024).toFixed(2)+"MB":e.toFixed(2)+"KB"):e=e.toFixed(2)+"B",
e);
}
function seeAds(){
var adDatas=window.adDatas;
if(adDatas&&adDatas.num>0){
var onScroll=function(){
for(var scrollTop=window.pageYOffset||document.documentElement.scrollTop,i=0;total_pos_type>i;++i)!function(i){
var pos_key="pos_"+i,gdt_a=gdt_as[pos_key];
if(gdt_a=!!gdt_a&&gdt_a[0],gdt_a&&gdt_a.dataset&&gdt_a.dataset.apurl){
var gid=gdt_a.dataset.gid,tid=gdt_a.dataset.tid,apurl=gdt_a.dataset.apurl,is_cpm=1*gdt_a.dataset.is_cpm,ads=adDatas.ads,a_info=ads[pos_key].a_info||{},exp_info=a_info.exp_info||{},exp_id=exp_info.exp_id||"",exp_value=exp_info.exp_value||[],pos_type=adDatas.ads[pos_key].a_info.pos_type,gdt_area=el_gdt_areas[pos_key],offsetTop=gdt_area.offsetTop,adHeight=gdt_a.clientHeight,adOffsetTop=offsetTop+gdt_a.offsetTop;
adDatas.ads[pos_key].ad_engine=0;
try{
exp_value=JSON.stringify(exp_value);
}catch(e){
exp_value="[]";
}
if(-1!=apurl.indexOf("ad.wx.com")&&(adDatas.ads[pos_key].ad_engine=1),function(){
try{
var e=window.__report,a=ping_test_apurl[pos_key],t=new Date,i=t.getHours(),o=ping_test_apurl_random&&i>=12&&18>=i&&0==pos_type;
!a[0]&&o&&scrollTop+innerHeight>offsetTop&&(a[0]=!0,e(81)),!a[1]&&o&&scrollTop+innerHeight>offsetTop+40&&(a[1]=!0,
e(82));
}catch(p){}
}(),!ping_apurl[pos_key]&&(0==pos_type&&scrollTop+innerHeight>offsetTop||1==pos_type&&(10>=scrollTop||scrollTop-10>=offsetTop)||3==pos_type&&scrollTop+innerHeight>offsetTop)){
ping_apurl[pos_key]=!0;
try{
var mmversion=require("biz_wap/utils/mmversion.js"),report_arg="trace_id="+tid+"&product_type="+adDatas.ads[pos_key].a_info.pt+"&logtype=2&url="+encodeURIComponent(location.href)+"&apurl="+encodeURIComponent(apurl);
tid&&mmversion.gtVersion("6.3.22",!0)&&JSAPI.invoke("adDataReport",{
ad_info:report_arg
},function(){});
}catch(e){}
log("[Ad] seeAd, tid="+tid+", gid="+gid+", pos_type="+pos_type),ajax({
url:"/mp/advertisement_report?report_type=1&tid="+tid+"&adver_group_id="+gid+"&apurl="+encodeURIComponent(apurl)+"&__biz="+biz+"&pos_type="+pos_type+"&exp_id="+exp_id+"&exp_value="+exp_value+"&r="+Math.random(),
mayAbort:!0,
success:function(res){
log("[Ad] seeAd report success, tid="+tid+", gid="+gid+", pos_type="+pos_type);
try{
res=eval("("+res+")");
}catch(e){
res={};
}
res&&0!=res.ret?ping_apurl[pos_key]=!1:ping_apurl.pos_0&&ping_apurl.pos_1;
},
error:function(){
log("[Ad] seeAd report error, tid="+tid+", gid="+gid+", pos_type="+pos_type),(new Image).src=location.protocol+"//mp.weixin.qq.com/mp/jsmonitor?idkey=28307_27_1";
},
async:!0
});
}
var ping_cpm_apurl_obj=ping_cpm_apurl[pos_key];
if(is_cpm&&!ping_cpm_apurl_obj.hasPing){
var rh=.5;
scrollTop+innerHeight>=adOffsetTop+adHeight*rh&&adOffsetTop+adHeight*(1-rh)>=scrollTop?3==pos_type?(ping_cpm_apurl_obj.hasPing=!0,
ajax({
url:"/mp/advertisement_report?report_type=1&tid="+tid+"&adver_group_id="+gid+"&apurl="+encodeURIComponent(apurl+"&viewable=true")+"&__biz="+biz+"&pos_type="+pos_type+"&r="+Math.random(),
mayAbort:!0,
success:function(res){
try{
res=eval("("+res+")");
}catch(e){
res={};
}
res&&0!=res.ret&&(ping_cpm_apurl_obj.hasPing=!1);
},
async:!0
})):ping_cpm_apurl_obj.clk||(ping_cpm_apurl_obj.clk=setTimeout(function(){
ping_cpm_apurl_obj.hasPing=!0,ajax({
url:"/mp/advertisement_report?report_type=1&tid="+tid+"&adver_group_id="+gid+"&apurl="+encodeURIComponent(apurl+"&viewable=true")+"&__biz="+biz+"&pos_type="+pos_type+"&exp_id="+exp_id+"&exp_value="+exp_value+"&r="+Math.random(),
mayAbort:!0,
success:function(res){
try{
res=eval("("+res+")");
}catch(e){
res={};
}
res&&0!=res.ret&&(ping_cpm_apurl_obj.hasPing=!1);
},
async:!0
});
},1001)):3!=pos_type&&ping_cpm_apurl_obj.clk&&(clearTimeout(ping_cpm_apurl_obj.clk),
ping_cpm_apurl_obj.clk=null);
}
}
}(i);
};
DomEvent.on(window,"scroll",onScroll),onScroll();
}
}
function ad_click(e,a,t,i,o,p,n,r,_,d,s,l,c,m,u,f,g){
if(!has_click[o]){
has_click[o]=!0;
var y=document.getElementById("loading_"+o);
y&&(y.style.display="inline");
var v=g.exp_info||{},j=v.exp_id||"",h=v.exp_value||[];
try{
h=JSON.stringify(h);
}catch(w){
h="[]";
}
AdClickReport({
click_pos:1,
report_type:2,
type:e,
exp_id:j,
exp_value:h,
url:encodeURIComponent(a),
tid:o,
rl:encodeURIComponent(t),
__biz:biz,
pos_type:d,
pt:_,
pos_x:c,
pos_y:m,
ad_w:u,
ad_h:f
},function(){
if(has_click[o]=!1,y&&(y.style.display="none"),"5"==e)location.href="/mp/profile?source=from_ad&tousername="+a+"&ticket="+p+"&uin="+uin+"&key="+key+"&__biz="+biz+"&mid="+mid+"&idx="+idx+"&tid="+o;else{
if("105"==_&&l)return void Card.openCardDetail(l.card_id,l.card_ext,l);
if("106"==_&&l)return void(location.href=ParseJs.join(a,{
outer_id:l.outer_id
}));
if(0==a.indexOf("https://itunes.apple.com/")||0==a.indexOf("http://itunes.apple.com/"))return JSAPI.invoke("downloadAppInternal",{
appUrl:a
},function(e){
e.err_msg&&-1!=e.err_msg.indexOf("ok")||(location.href="http://"+location.host+"/mp/ad_redirect?url="+encodeURIComponent(a)+"&ticket="+p+"#wechat_redirect");
}),!1;
if(-1==a.indexOf("mp.weixin.qq.com"))a="http://mp.weixinbridge.com/mp/wapredirect?url="+encodeURIComponent(a);else if(-1==a.indexOf("mp.weixin.qq.com/s")&&-1==a.indexOf("mp.weixin.qq.com/mp/appmsg/show")){
var t={
source:4,
tid:o,
idx:idx,
mid:mid,
appuin:biz,
pt:_,
aid:r,
ad_engine:s,
pos_type:d
},i=window.__report;
if(("104"==_||"113"==_||"114"==_)&&l||-1!=a.indexOf("mp.weixin.qq.com/mp/ad_app_info")){
var n="",c="";
l&&(n=l.pkgname&&l.pkgname.replace(/\./g,"_"),c=l.channel_id||""),t={
source:4,
tid:o,
traceid:o,
mid:mid,
idx:idx,
appuin:biz,
pt:_,
channel_id:c,
aid:r,
engine:s,
pos_type:d,
pkgname:n
};
}
a=URL.join(a,t),(0==a.indexOf("http://mp.weixin.qq.com/promotion/")||0==a.indexOf("https://mp.weixin.qq.com/promotion/"))&&(a=URL.join(a,{
traceid:o,
aid:r,
engine:s
})),!r&&i&&i(80,a);
}
location.href=a;
}
});
}
}
function bindAdOperation(){
seeAds();
for(var e=0;total_pos_type>e;++e)!function(e){
var a="pos_"+e,t=el_gdt_areas[a];
if(!t)return!1;
if(!t.getElementsByClassName)return t.style.display="none",!1;
var i=t.getElementsByClassName("js_ad_link")||[],o=adDatas.ads[a];
if(o){
for(var p=o.adData,n=o.a_info,r=n.pos_type,_=o.ad_engine,d=0,s=i.length;s>d;++d)!function(e,a){
var t=i[e],o=t.dataset;
if(o&&3!=n.pos_type){
var p=o.type,d=o.url,s=o.rl,l=o.apurl,c=o.tid,m=o.ticket,u=o.group_id,f=o.aid,g=o.pt;
DomEvent.on(t,"click",function(e){
var t=!!e&&e.target;
if(!t||!t.className||-1==t.className.indexOf("js_ad_btn")&&-1==t.className.indexOf("btn_processor_value")){
if(a){
a.adid=window.adid||a.adid;
var i="&tid="+a.traceid+"&uin="+uin+"&key="+key+"&ticket="+(a.ticket||"")+"&__biz="+biz+"&source="+source+"&scene="+scene+"&appuin="+biz+"&aid="+a.adid+"&ad_engine="+_+"&pos_type="+r+"&r="+Math.random();
"103"==a.pt||"111"==a.pt||"112"==a.pt?report(23,i):("104"==a.pt||"113"==a.pt||"114"==a.pt)&&report(25,i);
}
var o,y,v,j;
return o=position.getX(t,"js_ad_link")+e.offsetX,y=position.getY(t,"js_ad_link")+e.offsetY,
v=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientWidth,
j=document.getElementsByClassName("js_ad_link")[0]&&document.getElementsByClassName("js_ad_link")[0].clientHeight,
ad_click(p,d,s,l,c,m,u,f,g,r,_,a,o,y,v,j,n),log("[Ad] ad_click: type="+p+", url="+d+", rl="+s+", apurl="+l+", traceid="+c+", ticket="+m+", group_id="+u+", aid="+f+", pt="+g+", pos_type="+r+", ad_engine="+_),
!1;
}
},!0);
}
}(d,p);
if(p){
p.adid=window.adid||p.adid;
var l=n.exp_info||{},c=l.exp_id||"",m=l.exp_value||[];
try{
m=JSON.stringify(m);
}catch(u){
m="[]";
}
var f="&tid="+p.traceid+"&uin="+uin+"&key="+key+"&ticket="+(p.ticket||"")+"&__biz="+biz+"&source="+source+"&scene="+scene+"&appuin="+biz+"&aid="+p.adid+"&ad_engine="+_+"&pos_type="+r+"&exp_id="+c+"&exp_value="+m+"&r="+Math.random();
if(p.report_param=f,"100"==p.pt||"115"==p.pt){
var g=require("a/profile.js");
return void new g({
btnViewProfile:document.getElementById("js_view_profile_"+r),
btnAddContact:document.getElementById("js_add_contact_"+r),
adData:p,
pos_type:r,
report_param:f,
aid:p.adid,
ad_engine:_
});
}
if("102"==p.pt){
var y=require("a/android.js"),v=15,j=p.pkgname&&p.pkgname.replace(/\./g,"_");
return void new y({
btn:document.getElementById("js_app_action_"+r),
adData:p,
report_param:f,
task_ext_info:[p.adid,p.traceid,j,source,v,_].join("."),
via:[p.traceid,p.adid,j,source,v,_].join(".")
});
}
if("101"==p.pt){
var h=require("a/ios.js");
return void new h({
btn:document.getElementById("js_app_action_"+r),
adData:p,
ticket:p.ticket,
report_param:f
});
}
if("105"==p.pt)return void new Card({
btn:document.getElementById("js_card_action_"+r),
adData:p,
report_param:f,
pos_type:r
});
if("106"==p.pt)return void new MpShop({
btn:document.getElementById("js_shop_action_"+r),
adData:p,
report_param:f,
pos_type:r
});
if("103"==p.pt||"104"==p.pt||"111"==p.pt||"112"==p.pt||"113"==p.pt||"114"==p.pt){
var w=require("a/app_card.js"),v=15,j=p.pkgname&&p.pkgname.replace(/\./g,"_");
return void new w({
btn:document.getElementById("js_appdetail_action_"+r),
js_app_rating:document.getElementById("js_app_rating_"+r),
adData:p,
report_param:f,
pos_type:r,
url_scheme:p.url_scheme,
via:[p.traceid,p.adid,j,source,v,_].join("."),
ticket:p.ticket,
appdetail_params:["&aid="+p.adid,"traceid="+p.traceid,"pkgname="+j,"source="+source,"type="+v,"engine="+_,"appuin="+biz,"pos_type="+r,"ticket="+p.ticket,"scene="+scene].join("&"),
engine:_
});
}
if("108"==p.pt||"109"==p.pt||"110"==p.pt){
var k=require("a/sponsor.js");
new k({
adDetailBtn:document.getElementById("js_ad_detail"),
adMoreBtn:document.getElementById("js_ad_more"),
adAbout:document.getElementById("js_btn_about"),
adImg:document.getElementById("js_main_img"),
adMessage:document.getElementById("js_ad_message"),
adData:p,
a_info:n,
pos_type:r,
report_param:f
});
}
}
}
}(e);
}
var js_bottom_ad_area=document.getElementById("js_bottom_ad_area"),js_top_ad_area=document.getElementById("js_top_ad_area"),js_sponsor_ad_area=document.getElementById("js_sponsor_ad_area"),pos_type=window.pos_type||0,__report=window.__report,total_pos_type=4,el_gdt_areas={
pos_3:js_sponsor_ad_area,
pos_1:js_top_ad_area,
pos_0:js_bottom_ad_area
},gdt_as={
pos_3:js_sponsor_ad_area.getElementsByClassName("js_ad_link"),
pos_1:js_top_ad_area.getElementsByClassName("js_ad_link"),
pos_0:js_bottom_ad_area.getElementsByClassName("js_ad_link")
};
window.adDatas={
ads:{},
num:0
};
var adDatas=window.adDatas,has_click={},DomEvent=require("biz_common/dom/event.js"),URL=require("biz_common/utils/url/parse.js"),AReport=require("a/a_report.js"),AdClickReport=AReport.AdClickReport,ajax=require("biz_wap/utils/ajax.js"),position=require("biz_wap/utils/position.js"),Card=require("a/card.js"),MpShop=require("a/mpshop.js"),JSAPI=require("biz_wap/jsapi/core.js"),ParseJs=require("biz_common/utils/url/parse.js"),TMPL=require("biz_common/tmpl.js"),a_tpl=require("a/a_tpl.html.js"),sponsor_a_tpl=require("a/sponsor_a_tpl.html.js"),Report=require("biz_common/utils/report.js"),Class=require("biz_common/dom/class.js"),LS=require("biz_wap/utils/storage.js"),log=require("appmsg/log.js"),ping_apurl={
pos_0:!1,
pos_1:!1,
pos_3:!1
},ping_cpm_apurl={
pos_0:{},
pos_1:{},
pos_3:{}
},ping_test_apurl={
pos_0:[],
pos_1:[],
pos_3:[]
},ping_test_apurl_random=Math.random()<.3,innerHeight=window.innerHeight||document.documentElement.clientHeight,ad_engine=0,keyOffset="https:"==top.location.protocol?5:0;
return{
checkNeedAds:checkNeedAds,
afterGetAdData:afterGetAdData
};
});