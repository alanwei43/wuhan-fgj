(function(e){function t(t){for(var a,i,c=t[0],s=t[1],u=t[2],d=0,p=[];d<c.length;d++)i=c[d],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&p.push(r[i][0]),r[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a]);l&&l(t);while(p.length)p.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,c=1;c<n.length;c++){var s=n[c];0!==r[s]&&(a=!1)}a&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var a={},r={app:0},o=[];function i(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=a,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("a133"),n("ed0d"),n("f09c"),n("e117");var a=n("a593"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("e-chart")],1)},o=[],i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"hello"},[e._m(0),n("div",{staticStyle:{"font-size":"16px"}},[n("span",[e._v("范围: ")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.data.range.start,expression:"data.range.start"}],attrs:{type:"date"},domProps:{value:e.data.range.start},on:{input:function(t){t.target.composing||e.$set(e.data.range,"start",t.target.value)}}}),e._v(" - "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.data.range.end,expression:"data.range.end"}],attrs:{type:"date"},domProps:{value:e.data.range.end},on:{input:function(t){t.target.composing||e.$set(e.data.range,"end",t.target.value)}}})]),n("div",{staticStyle:{"font-size":"16px"}},[n("span",[e._v("区域:")]),e._l(e.data.areas,(function(t){return n("label",{key:t.name,staticStyle:{display:"inline",width:"auto",padding:"5px 8px"}},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.checked,expression:"area.checked"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.checked)?e._i(t.checked,null)>-1:t.checked},on:{change:function(n){var a=t.checked,r=n.target,o=!!r.checked;if(Array.isArray(a)){var i=null,c=e._i(a,i);r.checked?c<0&&e.$set(t,"checked",a.concat([i])):c>-1&&e.$set(t,"checked",a.slice(0,c).concat(a.slice(c+1)))}else e.$set(t,"checked",o)}}}),e._v(" "+e._s(t.name))])})),n("button",{on:{click:e.toggleAll}},[e._v("全部")])],2),n("div",[n("button",{staticStyle:{"font-size":"18px"},on:{click:e.refresh}},[e._v("查询")])]),n("hr"),n("div",{key:e.data.chartKey,staticStyle:{width:"100%",height:"600px"},attrs:{id:"main"}})])},c=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",{staticStyle:{"font-size":"14px"}},[e._v(" 数据来源: "),n("a",{attrs:{href:"http://fgj.wuhan.gov.cn/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/",target:"_blank"}},[e._v("每日新建商品房成交统计情况-武汉市住房保障和房屋管理局")])])}],s=(n("dbb3"),n("fe59"),n("2eeb"),n("053b"),n("e18c"),n("e35a"),n("1c2e"),n("5e9f"),n("08ba"),n("4d28")),u=n.n(s);n("77ad"),n("0d7a");function l(e){var t=e.start,n=e.end,a=e.top;return console.log("[query] ",arguments[0]),d().then((function(e){var r=e;return"number"!==typeof t||isNaN(t)||(r=r.filter((function(e){return e.day>=t}))),"number"!==typeof n||isNaN(n)||(r=r.filter((function(e){return e.day<=n}))),"number"!==typeof a||isNaN(n)||(r=r.slice(0,a)),r}))}function d(){var e=(new Date).toISOString().split("T")[0],t=localStorage.getItem(e);return t?Promise.resolve(JSON.parse(t)):fetch("/api/get-data").then((function(e){return e.json()})).then((function(t){t.forEach((function(e){e.residentials.forEach((function(t){e.groups=e.groups||{},e.groups[t.district]=t}))}));try{localStorage.setItem(e,JSON.stringify(t))}catch(n){console.warn("localStorage.setItem error: ",n),localStorage.clear()}return t}))}var p={data:function(){return{data:{range:{start:"",end:""},areas:[],chartKey:""}}},mounted:function(){this.initData()},methods:{initData:function(){var e=this;l({top:1}).then((function(t){var n=t[0];e.data.areas=n.residentials.map((function(e){return{checked:!0,name:e.district}}))}))},refresh:function(){var e=this;0!==this.data.areas.length?l({start:parseInt(this.data.range.start.replace(/-/g,"")),end:parseInt(this.data.range.end.replace(/-/g,""))}).then((function(t){if(0!==t.length){var n=t,a=e.data.areas.filter((function(e){return e.checked})).map((function(e){return e.name})),r={title:{},tooltip:{trigger:"axis"},legend:{data:a},toolbox:{show:!0,feature:{dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line","bar"]},restore:{show:!0},saveAsImage:{show:!0}}},calculable:!0,xAxis:[{type:"category",data:n.map((function(e){return e.day}))}],yAxis:[{type:"value"}],series:a.map((function(e){return{name:e,type:"bar",data:n.map((function(t){return t.groups[e]||{}})).map((function(e){return e.count||0}))}}))};e.renderChart(r)}})):alert("没有数据")},renderChart:function(e){this.data.chartKey=Date.now().toString(16),this.$nextTick((function(){var t=u.a.init(document.getElementById("main"));t.setOption(e)}))},toggleAll:function(){var e=!this.data.areas[0].checked;this.data.areas.forEach((function(t){t.checked=e}))}}},f=p,h=n("9ca4"),g=Object(h["a"])(f,i,c,!1,null,"0b438fd4",null),v=g.exports,m={name:"App",components:{"e-chart":v}},y=m,b=Object(h["a"])(y,r,o,!1,null,null,null),x=b.exports;a["a"].config.productionTip=!1,new a["a"]({render:function(e){return e(x)}}).$mount("#app")}});
//# sourceMappingURL=app.js.map