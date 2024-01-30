import{u as T,d as z,a as $,p as P,o as ee,r as te}from"./index-LJ8e8yHT.js";import{A as X}from"./Album-ocEtMkbr.js";import{f as H,K as j,a as _,r as F,w as oe,v as C,x as s,i as A,o as c,h as l,A as Q,I as u,z as K,P as le,g as U,F as J,n as ae,L as x,ao as se,B as G,aa as M,Y as Ae,y as ne,C as Z,s as ie,j as de}from"./vendor-DwjfiTos.js";import{d as ce}from"./dragBox-HwnoLvLV.js";const re={class:"title"},ue=u("p",{class:"desc"},"私密相册，仅自己可见",-1),ge={class:"title"},pe=u("p",{class:"desc"},"公开相册，所有用户均可见",-1),me={class:"title"},Ce=u("p",{class:"desc"},"密码访问，其他用户校验密码后方可见",-1),Qe=H({__name:"EditDialog",props:{modelValue:{type:Boolean,default:!1},detail:{default:()=>({})}},emits:["update:modelValue","submit"],setup(v,{emit:I}){const p=v,E=I,R=T(),t=new X,f=j({get(){return p.modelValue},set(r){E("update:modelValue",r)}}),a=_({id:0,name:"",desc:"",cover:"",background:"#009688",access_type:0,access_pass:""}),g=_({name:[{required:!0,message:"请输入相册名称",trigger:["blur"]}],access_type:[{required:!0,message:"请选择相册访问权限",trigger:["blur"]}],access_pass:[{required:!0,trigger:["blur","change"],validator:(r,i,n)=>{a.access_type===2&&i===""?n("请输入相册访问密码"):n()}}],background:[{required:!0,message:"请选择顶部背景色",trigger:["blur","change"]}]}),B=F(null);_({background:!1,cover:!1});const b=()=>{f.value=!1},d=()=>{B.value.validate(r=>{r&&(a.id?w():m())})},m=()=>{delete a.id,t.create(a).then(r=>{b(),E("submit"),R.$message({message:"新建成功",duration:1e3,type:"success"})})},w=()=>{t.update(a).then(r=>{b(),E("submit"),R.$message({message:"更新成功",duration:1e3,type:"success"})})};return oe(()=>p.detail,r=>{if(r){a.id=p.detail.id;for(let i in a)a[i]=p.detail[i]}},{immediate:!0}),(r,i)=>{const n=A("el-input"),e=A("el-form-item"),h=A("Lock"),k=A("el-icon"),D=A("el-option"),V=A("Unlock"),y=A("SwitchButton"),O=A("el-select"),W=A("el-color-picker"),S=A("el-form"),Y=A("el-button"),L=A("com-dialog");return c(),C(L,{modelValue:f.value,"onUpdate:modelValue":i[5]||(i[5]=o=>f.value=o),title:r.detail&&r.detail.id?"编辑相册":"新建相册",width:"700px","before-close":b},{action:s(()=>[l(Y,{onClick:b},{default:s(()=>[Q("取 消")]),_:1}),l(Y,{type:"primary",onClick:d},{default:s(()=>[Q("确 定")]),_:1})]),default:s(()=>[l(S,{model:a,rules:g,class:"album-dialog-form","label-position":"top",ref_key:"formRef",ref:B},{default:s(()=>[l(e,{label:"相册名称",prop:"name"},{default:s(()=>[l(n,{modelValue:a.name,"onUpdate:modelValue":i[0]||(i[0]=o=>a.name=o),placeholder:"请输入相册名称",size:"large"},null,8,["modelValue"])]),_:1}),l(e,{label:"访问权限",prop:"access_type"},{default:s(()=>[l(O,{modelValue:a.access_type,"onUpdate:modelValue":i[1]||(i[1]=o=>a.access_type=o),placeholder:"请选择访问权限",size:"large",style:{width:"100%"},"popper-class":"album-status-popper"},{default:s(()=>[l(D,{value:0,label:"私密相册"},{default:s(()=>[u("p",re,[l(k,null,{default:s(()=>[l(h)]),_:1}),Q("私密相册")]),ue]),_:1}),l(D,{value:1,label:"公开相册"},{default:s(()=>[u("p",ge,[l(k,null,{default:s(()=>[l(V)]),_:1}),Q("公开相册")]),pe]),_:1}),l(D,{value:2,label:"密码访问"},{default:s(()=>[u("p",me,[l(k,null,{default:s(()=>[l(y)]),_:1}),Q("密码访问")]),Ce]),_:1})]),_:1},8,["modelValue"])]),_:1}),a.access_type===2?(c(),C(e,{key:0,label:"访问密码",prop:"access_pass"},{default:s(()=>[l(n,{modelValue:a.access_pass,"onUpdate:modelValue":i[2]||(i[2]=o=>a.access_pass=o),placeholder:"请输入相册访问密码",size:"large"},null,8,["modelValue"])]),_:1})):K("",!0),l(e,{label:"顶部背景色",prop:"background"},{default:s(()=>[l(W,{modelValue:a.background,"onUpdate:modelValue":i[3]||(i[3]=o=>a.background=o),"color-format":"hex","show-alpha":"",predefine:["#ff4500","#ff8c00","#ffd700","#90ee90","#00ced1","#1e90ff","#c71585","rgba(255, 69, 0, 0.68)","rgb(255, 120, 0)","hsv(51, 100, 98)","hsva(120, 40, 94, 0.5)","hsl(181, 100%, 37%)","hsla(209, 100%, 56%, 0.73)","#c7158577"]},null,8,["modelValue","predefine"])]),_:1}),l(e,{label:"相册简介",prop:"desc"},{default:s(()=>[l(n,{modelValue:a.desc,"onUpdate:modelValue":i[4]||(i[4]=o=>a.desc=o),placeholder:"介绍一下该相册...",type:"textarea",rows:4,size:"large"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])}}}),Ee="/default.png",fe={class:"album-item"},Be={class:"album-item-cover"},be=["src"],he={key:1,src:Ee,class:"load-error",alt:""},Ue={class:"album-item__content"},we={class:"album-item-name"},ke=u("div",{class:"album-item-divider"},null,-1),Re={class:"album-item-desc"},_e={class:"album-item-action"},Ie=H({__name:"index",props:{album:{default:()=>({id:0,name:"",desc:"",cover:"",background:"",count:0})},editable:{type:Boolean,default:!1}},emits:["submit"],setup(v,{emit:I}){le(d=>({"438989d8":f.value}));const p=new URL("data:image/gif;base64,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",import.meta.url).href,E=I,R=z(),t=F(""),f=j(()=>R.user_habits.data.album_cover_fit||"cover"),a=d=>{E("submit",d)};function g(d){t.value="loaded"}const B=F(!1);function b(){B.value=!0}return(d,m)=>{const w=A("el-button");return c(),U("div",fe,[d.editable?(c(),C(ce,{key:0})):K("",!0),u("div",Be,[d.album.cover?(c(),U(J,{key:0},[B.value?(c(),U("img",{key:0,src:"/error.png"},null,8,be)):(c(),C(x(se),{class:ae([t.value]),src:d.album.cover,"src-placeholder":x(p),key:d.album.id,onLoad:g,onError:b},null,8,["class","src","src-placeholder"]))],64)):(c(),U("img",he))]),u("div",Ue,[u("div",we,G(d.album.name)+"("+G(d.album.count)+") ",1),ke,u("div",Re,G(d.album.desc),1)]),u("div",_e,[l(w,{type:"success",onClick:m[0]||(m[0]=M(r=>a("upload"),["stop"]))},{default:s(()=>[Q("去上传")]),_:1}),l(w,{type:"primary",onClick:m[1]||(m[1]=M(r=>a("edit"),["stop"]))},{default:s(()=>[Q("编辑")]),_:1}),l(w,{type:"danger",onClick:m[2]||(m[2]=M(r=>a("delete"),["stop"]))},{default:s(()=>[Q("删除")]),_:1})])])}}}),De={class:"album-container"},Fe={class:"album-filter"},Ve={class:"album-list"},Ye={class:"album-pagination"},Oe=H({__name:"index",setup(v){const I=T(),p=new X;$();const E=Ae(),R=F([{label:"全部相册",value:""},{label:"私密相册",value:0},{label:"公开相册",value:1},{label:"密码访问",value:2}]),t=_({total:0,page:1,size:12,filters:{search:"",access_type:""},data:[],loading:!1});let f=_({data:null});const a=_({edit:!1}),g=()=>{t.loading=!0,p.find({page:t.page,size:t.size,...t.filters}).then(n=>{t.data=n.items.map(e=>(e.count=n.stats.find(h=>h.id===e.id).count,e.createdAt=P(e.createdAt),e.updatedAt=P(e.updatedAt),e)),t.total=n.total,t.loading=!1})};g();const B=(n,e)=>{f.data=n,a[e]=!0,e==="delete"&&ee().then(()=>{p.delete(n.id).then(h=>{I.$message({message:"删除成功",type:"success",duration:1e3}),g()})}),e==="upload"&&E.push({path:"/",query:{album_id:n.id,from:"album"}})},b=n=>{E.push({path:"/albums/images",query:{id:n.id}})},d=F(!1);function m(){d.value=!d.value,w()}function w(){de(()=>{te(document.querySelector("#sortableRef"),t.data,r)})}function r(n,e){t.loading=!0;const[h,k]=[t.data[n],t.data[e]];p.sort(h.id,k.id).then(()=>{g()})}function i(n){setTimeout(()=>{g()},1e3)}return(n,e)=>{const h=A("el-input"),k=A("el-option"),D=A("el-select"),V=A("el-button"),y=A("el-col"),O=A("el-row"),W=A("c-empty"),S=A("pagination"),Y=A("c-card"),L=ne("loading");return c(),U("div",De,[l(Y,{title:"我的相册("+t.total+")"},{cardAction:s(()=>[l(h,{modelValue:t.filters.search,"onUpdate:modelValue":e[0]||(e[0]=o=>t.filters.search=o),placeholder:"请输入搜索内容...",style:{width:"180px"},"suffix-icon":"Search",clearable:"",onInput:i},null,8,["modelValue"])]),default:s(()=>[u("div",Fe,[u("div",null,[l(D,{modelValue:t.filters.access_type,"onUpdate:modelValue":e[1]||(e[1]=o=>t.filters.access_type=o),placeholder:"请选择相册类别",filterable:"",onChange:g},{default:s(()=>[(c(!0),U(J,null,Z(R.value,(o,q)=>(c(),C(k,{key:"bucket-"+q,label:o.label,value:o.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),u("div",null,[l(V,{type:"primary",onClick:e[2]||(e[2]=o=>B(null,"edit"))},{default:s(()=>[Q("新增")]),_:1}),t.data.length?(c(),C(V,{key:0,onClick:m},{default:s(()=>[Q(G(d.value?"完成排序":"启用排序"),1)]),_:1})):K("",!0)])]),ie((c(),U("div",Ve,[t.data.length?(c(),C(O,{key:0,id:"sortableRef"},{default:s(()=>[(c(!0),U(J,null,Z(t.data,(o,q)=>(c(),C(y,{key:"album-item-"+q+"-"+o.id,xl:6,lg:8,md:12,class:"drag-box-col"},{default:s(()=>[l(Ie,{album:o,editable:d.value,onSubmit:N=>B(o,N),onClick:N=>b(o)},null,8,["album","editable","onSubmit","onClick"])]),_:2},1024))),128))]),_:1})):(c(),C(W,{key:1}))])),[[L,t.loading]]),u("div",Ye,[l(S,{page:t.page,"onUpdate:page":e[3]||(e[3]=o=>t.page=o),size:t.size,"onUpdate:size":e[4]||(e[4]=o=>t.size=o),total:t.total,"page-sizes":[12,24,48,96],onChange:g},null,8,["page","size","total"])])]),_:1},8,["title"]),a.edit?(c(),C(Qe,{key:0,modelValue:a.edit,"onUpdate:modelValue":e[5]||(e[5]=o=>a.edit=o),detail:x(f).data,onSubmit:g},null,8,["modelValue","detail"])):K("",!0)])}}});export{Oe as default};
