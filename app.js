const {useState,useEffect}=React, h=React.createElement, KEY="hostel-erp-v1";
const seed=()=>({
 students:[{id:1,name:"Sumit Tibile",prn:"24064681242519",phone:"9800000001",room:"A-101"},{id:2,name:"Paras Patil",prn:"24064681242508",phone:"9800000002",room:"A-101"},{id:3,name:"Pranav Suryavanshi",prn:"23064681242003",phone:"9800000003",room:"A-102"},{id:4,name:"Premanath Magdum",prn:"24064681242528",phone:"9800000004",room:""}],
 rooms:["A-101","A-102","A-103","B-201","B-202","B-203"].map(no=>({no,block:no[0],cap:2})),
 fees:[{sid:1,total:60000,paid:60000},{sid:2,total:60000,paid:30000},{sid:3,total:60000,paid:0},{sid:4,total:60000,paid:15000}],
 complaints:[{id:1,sid:2,title:"Ceiling fan not working",status:"Open"},{id:2,sid:3,title:"Water leakage in bathroom",status:"In Progress"}]});
const load=()=>{try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return seed()};
const inr=n=>"₹"+n.toLocaleString("en-IN");
const Tag=(t,c)=>h("span",{className:"tag "+c},t);
const stCls={Open:"bad","In Progress":"warn",Resolved:"ok"};

function Dash({d,me}){
 const occ=d.students.filter(s=>s.room).length, cap=d.rooms.reduce((a,r)=>a+r.cap,0);
 const pend=d.fees.reduce((a,f)=>a+f.total-f.paid,0), open=d.complaints.filter(c=>c.status!=="Resolved").length;
 if(me){const s=d.students.find(x=>x.id===me),f=d.fees.find(x=>x.sid===me);
  return h("div",null,h("div",{className:"card"},h("h3",null,s.name),h("p",null,"PRN "+s.prn),h("p",null,"Room: "+(s.room||"Not allocated yet"))),
  h("div",{className:"card"},h("h3",null,"My fees"),h("p",null,"Paid "+inr(f.paid)+" of "+inr(f.total)),h("div",{className:"bar"},h("i",{style:{width:f.paid/f.total*100+"%"}})),h("p",null,"Pending: "+inr(f.total-f.paid))))}
 const blocks=[...new Set(d.rooms.map(r=>r.block))];
 return h("div",null,h("div",{className:"grid"},
  [["Students",d.students.length],["Beds occupied",occ+" / "+cap],["Fees pending",inr(pend)],["Open complaints",open]].map(([k,v])=>h("div",{className:"card stat",key:k},h("b",null,v),h("span",null,k)))),
  h("div",{className:"card"},h("h3",{style:{marginBottom:10}},"Occupancy by block"),blocks.map(b=>{const rs=d.rooms.filter(r=>r.block===b),c=rs.reduce((a,r)=>a+r.cap,0),o=d.students.filter(s=>rs.some(r=>r.no===s.room)).length;
   return h("div",{key:b,className:"row",style:{marginBottom:8}},h("span",{style:{width:70}},"Block "+b),h("div",{className:"bar",style:{flex:1}},h("i",{style:{width:o/c*100+"%"}})),h("span",null,o+"/"+c))})));
}

function Students({d,set}){
 const [f,setF]=useState({name:"",prn:"",phone:""});
 const add=()=>{if(!f.name.trim()||!f.prn.trim())return;const id=Date.now();
  set(p=>({...p,students:[...p.students,{id,...f,room:""}],fees:[...p.fees,{sid:id,total:60000,paid:0}]}));setF({name:"",prn:"",phone:""})};
 const del=id=>set(p=>({...p,students:p.students.filter(s=>s.id!==id),fees:p.fees.filter(x=>x.sid!==id),complaints:p.complaints.filter(x=>x.sid!==id)}));
 const inp=(k,ph)=>h("input",{placeholder:ph,value:f[k],onChange:e=>setF({...f,[k]:e.target.value}),"aria-label":ph});
 return h("div",null,h("div",{className:"card row"},inp("name","Full name"),inp("prn","PRN"),inp("phone","Phone"),h("button",{className:"btn",onClick:add},"Register student")),
  h("div",{className:"card scroll"},h("table",null,h("thead",null,h("tr",null,["Name","PRN","Phone","Room",""].map(x=>h("th",{key:x},x)))),
  h("tbody",null,d.students.map(s=>h("tr",{key:s.id},h("td",null,s.name),h("td",null,s.prn),h("td",null,s.phone),h("td",null,s.room||Tag("Unallocated","warn")),h("td",null,h("button",{className:"ghost",onClick:()=>del(s.id)},"Remove"))))))));
}

function Rooms({d,set}){
 const [sid,setSid]=useState(""),[rn,setRn]=useState("");
 const free=d.students.filter(s=>!s.room), avail=d.rooms.filter(r=>d.students.filter(s=>s.room===r.no).length<r.cap);
 const alloc=()=>{if(!sid||!rn)return;set(p=>({...p,students:p.students.map(s=>s.id==sid?{...s,room:rn}:s)}));setSid("");setRn("")};
 const vac=id=>set(p=>({...p,students:p.students.map(s=>s.id===id?{...s,room:""}:s)}));
 return h("div",null,h("div",{className:"card row"},
  h("select",{value:sid,onChange:e=>setSid(e.target.value),"aria-label":"Student"},h("option",{value:""},"Select student"),free.map(s=>h("option",{key:s.id,value:s.id},s.name))),
  h("select",{value:rn,onChange:e=>setRn(e.target.value),"aria-label":"Room"},h("option",{value:""},"Select room"),avail.map(r=>h("option",{key:r.no,value:r.no},r.no))),
  h("button",{className:"btn",onClick:alloc},"Allocate room"),!free.length&&h("span",{className:"empty"},"Every student has a room.")),
  h("div",{className:"rooms"},d.rooms.map(r=>{const oc=d.students.filter(s=>s.room===r.no);
   return h("div",{key:r.no,className:"room"+(oc.length>=r.cap?" full":"")},h("b",null,r.no),h("div",{className:"empty"},oc.length+"/"+r.cap+" beds"),
    oc.map(s=>h("div",{key:s.id,className:"row",style:{justifyContent:"space-between"}},h("span",null,s.name.split(" ")[0]),h("button",{className:"ghost",onClick:()=>vac(s.id)},"Vacate"))))})));
}

function PayRow({s,f,set}){
 const [a,setA]=useState(""),pend=f.total-f.paid;
 const pay=()=>{const n=Math.min(Number(a),pend);if(!(n>0))return;set(p=>({...p,fees:p.fees.map(x=>x.sid===s.id?{...x,paid:x.paid+n}:x)}));setA("")};
 return h("tr",null,h("td",null,s.name),h("td",null,inr(f.total)),h("td",null,inr(f.paid)),h("td",null,inr(pend)),
  h("td",null,pend===0?Tag("Paid","ok"):f.paid?Tag("Partial","warn"):Tag("Unpaid","bad")),
  h("td",null,pend>0&&h("div",{className:"row"},h("input",{type:"number",min:1,style:{width:90},placeholder:"Amount",value:a,onChange:e=>setA(e.target.value),"aria-label":"Payment amount"}),h("button",{className:"btn",onClick:pay},"Record"))));
}
function Fees({d,set}){
 return h("div",{className:"card scroll"},h("table",null,h("thead",null,h("tr",null,["Student","Total","Paid","Pending","Status","Record payment"].map(x=>h("th",{key:x},x)))),
  h("tbody",null,d.students.map(s=>{const f=d.fees.find(x=>x.sid===s.id);return f&&h(PayRow,{key:s.id,s,f,set})}))));
}

function Complaints({d,set,me}){
 const [sid,setSid]=useState(me||""),[t,setT]=useState("");
 const add=()=>{if(!sid||!t.trim())return;set(p=>({...p,complaints:[{id:Date.now(),sid:Number(sid),title:t,status:"Open"},...p.complaints]}));setT("")};
 const list=d.complaints.filter(c=>!me||c.sid===me);
 return h("div",null,h("div",{className:"card row"},
  !me&&h("select",{value:sid,onChange:e=>setSid(e.target.value),"aria-label":"Student"},h("option",{value:""},"Select student"),d.students.map(s=>h("option",{key:s.id,value:s.id},s.name))),
  h("input",{style:{flex:1,minWidth:180},placeholder:"Describe the issue",value:t,onChange:e=>setT(e.target.value),"aria-label":"Complaint"}),h("button",{className:"btn",onClick:add},"Submit complaint")),
  h("div",{className:"card scroll"},!list.length?h("div",{className:"empty"},"No complaints yet."):h("table",null,h("thead",null,h("tr",null,["Student","Issue","Status"].map(x=>h("th",{key:x},x)))),
  h("tbody",null,list.map(c=>{const s=d.students.find(x=>x.id===c.sid);return h("tr",{key:c.id},h("td",null,s?s.name:"—"),h("td",null,c.title),
   h("td",null,me?Tag(c.status,stCls[c.status]):h("select",{value:c.status,"aria-label":"Status",onChange:e=>set(p=>({...p,complaints:p.complaints.map(x=>x.id===c.id?{...x,status:e.target.value}:x)}))},["Open","In Progress","Resolved"].map(o=>h("option",{key:o},o)))))})))));
}

function Pay({d,set,me}){
 const s=d.students.find(x=>x.id===me),f=d.fees.find(x=>x.sid===me),pend=f.total-f.paid;
 const [amt,setAmt]=useState(pend),[m,setM]=useState("upi"),[st,setSt]=useState("form"),[r,setR]=useState(null),[c,setC]=useState({no:"",exp:"",cvv:""}),[bank,setBank]=useState(""),[err,setErr]=useState("");
 useEffect(()=>{setAmt(pend);setSt("form")},[me]);
 const a=Math.min(Math.max(Number(amt)||0,0),pend);
 const uri="upi://pay?pa=bsiet.hostel@upi&pn="+encodeURIComponent("BSiET Hostel")+"&am="+a+"&cu=INR&tn="+encodeURIComponent("Hostel fee "+s.prn);
 let qr="";try{const q=qrcode(0,"M");q.addData(uri);q.make();const n=q.getModuleCount(),z=4;let p="";for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))p+="M"+(x+z)+","+(y+z)+"h1v1h-1z";qr='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+2*z)+" "+(n+2*z)+'" width="100%" height="100%" shape-rendering="crispEdges" role="img"><rect width="100%" height="100%" fill="#fff"/><path d="'+p+'" fill="#000"/></svg>'}catch(e){}
 const go=()=>{setErr("");
  if(a<=0){setErr("Enter an amount up to "+inr(pend));return}
  if(m==="card"&&(c.no.replace(/\s/g,"").length!==16||!/^\d\d\/\d\d$/.test(c.exp)||c.cvv.length!==3)){setErr("Check card number, expiry (MM/YY) and CVV.");return}
  if(m==="bank"&&!bank){setErr("Choose your bank.");return}
  setSt("proc");
  setTimeout(()=>{const p={id:Date.now(),sid:me,amt:a,method:m,txn:"TXN"+Math.random().toString(36).slice(2,10).toUpperCase(),date:new Date().toLocaleString("en-IN")};
   set(x=>({...x,fees:x.fees.map(y=>y.sid===me?{...y,paid:y.paid+a}:y),payments:[p,...(x.payments||[])]}));setR(p);setSt("done");setC({no:"",exp:"",cvv:""})},1600)};
 const hist=(d.payments||[]).filter(p=>p.sid===me);
 const names={upi:"UPI / QR",card:"Card",bank:"Net banking"};
 const seg=k=>h("button",{key:k,className:m===k?"btn":"ghost",style:m===k?null:{color:"var(--ink)"},onClick:()=>{setM(k);setErr("")}},names[k]);
 const box=st==="done"?h("div",{className:"card"},h("h3",null,"Payment successful"),h("p",null,inr(r.amt)+" received via "+names[r.method]),
   h("p",{className:"empty"},"Transaction "+r.txn+" · "+r.date),h("div",{className:"row"},h("button",{className:"btn",onClick:()=>window.print()},"Print receipt"),
   pend>0&&h("button",{className:"ghost",style:{color:"var(--ink)"},onClick:()=>{setAmt(pend);setSt("form")}},"Pay remaining "+inr(pend))))
  :st==="proc"?h("div",{className:"card"},h("h3",null,"Verifying payment…"),h("p",{className:"empty"},"Please don't close this page."))
  :pend===0?h("div",{className:"card"},h("h3",null,"No dues"),h("p",{className:"empty"},"Your hostel fees are fully paid."))
  :h("div",{className:"card"},
   h("div",{className:"row",style:{marginBottom:12}},["upi","card","bank"].map(seg)),
   h("label",null,"Amount (₹) ",h("input",{type:"number",min:1,max:pend,value:amt,style:{width:120},onChange:e=>setAmt(e.target.value)})),
   h("p",{className:"empty"},"Pending: "+inr(pend)+" · You pay: "+inr(a)),
   m==="upi"&&h("div",{className:"upi"},
     h("div",{className:"qrbox"},h("div",{className:"qr","aria-label":"UPI QR code",dangerouslySetInnerHTML:{__html:qr}}),h("b",null,inr(a)),h("span",{className:"empty"},"Scan to pay")),
     h("div",{className:"upiinfo"},h("p",{style:{margin:0}},"Scan with any UPI app (GPay, PhonePe, Paytm, BHIM)."),h("p",{className:"empty",style:{margin:0}},"UPI ID: bsiet.hostel@upi"),h("button",{className:"btn",onClick:go},"I've paid – verify"))),
   m==="card"&&h("div",{className:"row",style:{flexDirection:"column",alignItems:"stretch",maxWidth:320}},
     h("input",{placeholder:"Card number",inputMode:"numeric",maxLength:19,value:c.no,onChange:e=>setC({...c,no:e.target.value})}),
     h("div",{className:"row"},h("input",{placeholder:"MM/YY",maxLength:5,style:{width:90},value:c.exp,onChange:e=>setC({...c,exp:e.target.value})}),h("input",{placeholder:"CVV",type:"password",maxLength:3,style:{width:80},value:c.cvv,onChange:e=>setC({...c,cvv:e.target.value})})),
     h("button",{className:"btn",onClick:go},"Pay "+inr(a))),
   m==="bank"&&h("div",{className:"row"},h("select",{value:bank,onChange:e=>setBank(e.target.value),"aria-label":"Bank"},h("option",{value:""},"Select bank"),["State Bank of India","HDFC Bank","ICICI Bank","Bank of Maharashtra","Axis Bank"].map(b=>h("option",{key:b},b))),h("button",{className:"btn",onClick:go},"Pay "+inr(a))),
   err&&h("p",{style:{color:"var(--bad)"},role:"alert"},err));
 return h("div",null,h("div",{className:"card",style:{background:"var(--warn2)"}},"Demo gateway: no real money moves. Card details are not stored."),
  box,h("div",{className:"card scroll"},h("h3",{style:{marginBottom:8}},"Payment history"),!hist.length?h("div",{className:"empty"},"No payments yet."):
   h("table",null,h("thead",null,h("tr",null,["Date","Amount","Method","Transaction"].map(x=>h("th",{key:x},x)))),h("tbody",null,hist.map(p=>h("tr",{key:p.id},h("td",null,p.date),h("td",null,inr(p.amt)),h("td",null,names[p.method]),h("td",null,p.txn)))))));
}

function App(){
 const [d,setD]=useState(load),[view,setView]=useState("dash"),[role,setRole]=useState("admin"),[me,setMe]=useState(1);
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},[d]);
 const adm=role==="admin", stu=adm?null:me;
 const tabs=adm?[["dash","Dashboard"],["students","Students"],["rooms","Rooms"],["fees","Fees"],["complaints","Complaints"]]:[["dash","My hostel"],["pay","Pay fees"],["complaints","My complaints"]];
 const v=tabs.some(t=>t[0]===view)?view:"dash";
 const body={dash:h(Dash,{d,me:stu}),students:h(Students,{d,set:setD}),rooms:h(Rooms,{d,set:setD}),fees:h(Fees,{d,set:setD}),pay:!adm&&h(Pay,{d,set:setD,me}),complaints:h(Complaints,{d,set:setD,me:stu,key:role})}[v];
 return h("div",{className:"app"},
  h("nav",null,h("h1",null,"Hostel ERP"),h("small",null,"Dr. Bapuji Salunkhe Institute, Kolhapur"),tabs.map(([k,l])=>h("button",{key:k,className:v===k?"on":"",onClick:()=>setView(k)},l))),
  h("main",null,h("div",{className:"top"},h("h2",null,tabs.find(t=>t[0]===v)[1]),
   h("div",{className:"row"},h("select",{value:role,onChange:e=>setRole(e.target.value),"aria-label":"Role"},h("option",{value:"admin"},"Warden / Admin"),h("option",{value:"student"},"Student")),
    !adm&&h("select",{value:me,onChange:e=>setMe(Number(e.target.value)),"aria-label":"Signed in as"},d.students.map(s=>h("option",{key:s.id,value:s.id},s.name))),
    h("button",{className:"ghost",style:{color:"var(--mute)"},onClick:()=>{if(confirm("Reset all demo data?"))setD(seed())}},"Reset demo"))),body));
}
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
