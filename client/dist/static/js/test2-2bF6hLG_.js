import{f as o,g as s,I as c,o as a}from"./vendor-DwjfiTos.js";const i={style:{padding:"10px"}},u=c("custom-button",{type:"primary"},null,-1),d=[u],l=o({__name:"test2",setup(m){return fetch("/index2.js").then(t=>t.text()).then(async t=>{new Function(t)();const n=window.MyPlugin;customElements.define("custom-button",window.Vue.defineCustomElement({...n.component,styles:[await(await fetch("/bundle.css")).text()]}))}),(t,e)=>(a(),s("div",i,d))}});export{l as default};
