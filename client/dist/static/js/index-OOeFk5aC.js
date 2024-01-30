import{u as V,p as k}from"./index-LJ8e8yHT.js";import{L as A}from"./Log-6eRZo4F2.js";import{c as B,t as i}from"./useLogType-E-ZIbzpf.js";import{f as L,a as D,r as F,K as N,g as d,s as U,v as g,x as l,i as n,y as I,o as s,I as c,h as p,F as S,C as j,L as _,A as u,B as f}from"./vendor-DwjfiTos.js";const E=[{align:"center",label:"操作id",width:"80",prop:"operate_id"},{align:"center",label:"操作类别",width:"100",prop:"type",slot:"type"},{align:"left",label:"操作内容",width:"200",prop:"operate_cont"},{align:"center",label:"访问来源",width:"100",prop:"client_info",slot:"address"},{align:"center",label:"访问ip",width:"100",prop:"client_info",slot:"ip"},{align:"center",label:"操作时间",width:"100",prop:"createdAt"}],G={class:"log-container"},K={class:"log-filter"},O={class:"log-list"},T={class:"log-pagination"},Q=L({__name:"index",setup(q){const m=new A;V();const e=D({page:1,size:10,total:0,config:E,filters:{type:""},data:[],loading:!1});F([]);const y=N(()=>[{label:"全部日志",value:""},...Object.keys(i).map(o=>({label:i[o].text,value:o}))]),r=()=>{e.loading=!0,m.find({page:e.page,size:e.size,...e.filters}).then(o=>{e.total=o.total,e.data=o.items.map(a=>(a.createdAt=k(a.createdAt),a)),e.loading=!1})};return r(),(o,a)=>{const v=n("el-option"),b=n("el-select"),h=n("table-table"),x=n("pagination"),z=n("c-card"),w=I("loading");return s(),d("div",G,[U((s(),g(z,{title:"操作日志("+e.total+")"},{cardAction:l(()=>[c("div",K,[p(b,{modelValue:e.filters.type,"onUpdate:modelValue":a[0]||(a[0]=t=>e.filters.type=t),placeholder:"请选择日志类型",onChange:r},{default:l(()=>[(s(!0),d(S,null,j(y.value,(t,C)=>(s(),g(v,{key:"type-"+C,label:t.label,value:t.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),default:l(()=>[c("div",O,[p(h,{data:e.data,config:e.config,selection:!1,"is-index":!0,"page-num":e.page,"page-size":e.size,"is-action":!1,border:!0,style:{height:"100%"}},{type:l(t=>[p(B,{type:_(i)[t.type].status,text:_(i)[t.type].text},null,8,["type","text"])]),address:l(t=>[u(f(t.client_info?t.client_info.province+t.client_info.city:"-"),1)]),ip:l(t=>[u(f(t.client_info?t.client_info.ip:"-"),1)]),_:1},8,["data","config","page-num","page-size"])]),c("div",T,[p(x,{page:e.page,"onUpdate:page":a[1]||(a[1]=t=>e.page=t),size:e.size,"onUpdate:size":a[2]||(a[2]=t=>e.size=t),total:e.total,onChange:r},null,8,["page","size","total"])])]),_:1},8,["title"])),[[w,e.loading]])])}}});export{Q as default};
