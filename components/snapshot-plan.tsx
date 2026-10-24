'use client';
import {useState} from 'react';
import characters from '@/data/characters.json';
import guideData from '@/data/verified-guide.json';
import officialData from '@/data/official-verified.json';
import gear from '@/data/gear-atlas.json';
type Roster=Record<string,{owned:boolean,star:string,note:string}>;
type Entry={name:string,row:string,sheet:string,source:string,equipment:string,portrait:string};
const guide=guideData as Record<string,Entry[]>;
const official=officialData as Record<string,{image:string,source:string,name:string}>;
const sets:Record<string,string[]>={haste:['奇术兜帽','奇术长袍','奇术护手','奇术长靴'],cost:['繁星魔导书','繁星魔导器'],life:['君炎头盔','君炎护甲','君炎护手','君炎战靴'],crit:['圣骑头盔','圣骑战甲','圣骑护手','圣骑战靴'],fee:['玛娜的潮汐','玛娜之泪']};
export default function SnapshotPlan({roster,imagePath}:{roster:Roster,imagePath:(p:string)=>string}){
 const [mode,setMode]=useState('PVE'),[gaiaTrial,setGaiaTrial]=useState(false);const candidateIds=['57','18','91','93','2',gaiaTrial?'56':mode==='PVE'?'9':'99'];const ids=candidateIds.filter(id=>roster[id]?.owned);
 function pictures(names:string[]){return <div className="verified-gear-grid">{names.map(name=>{const g=gear.find(g=>g.name===name);return g?<figure key={name}><img src={imagePath(g.image)} alt={g.name} loading="lazy"/><figcaption>{g.name}</figcaption></figure>:null})}</div>}
 return <section><div className="page-heading"><div><p className="eyebrow">ROSTER UPDATE · 2026/10/25</p><h2>官方角色對照與配裝圖鑑</h2><p>角色按完整稱號＋姓名對應原表；裝備以圖鑑的具名圖片展示。</p></div></div>
 <p className="notice warning">已撤回上一版「背包圖示＝指定裝備」與唯一繁星套等庫存分配結論。以下是配裝目標，不代表你的背包已確認擁有；持有星數依10/25備份及瀏覽器後續修改；角色持有不代表已持有推薦裝備。</p>
 <div className="equipment-tabs">{['PVE','PVP'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
 <p><label><input type="checkbox" checked={gaiaTrial} disabled={!roster['56']?.owned} onChange={e=>setGaiaTrial(e.target.checked)}/> 比較蓋亞雙前排（替換第六位；保留冰坦）</label></p><p className="notice">蓋亞目前：{roster['56']?.owned?roster['56'].star:'未持有'}。紫1僅作試隊，原表最低建議紅1；開場權杖需天賦4，先看遊戲實際解鎖。幻境／彼岸隊友受益較完整；冰坦不屬這兩陣營，不能套同陣營庇護。<a href="https://sod.game-beans.com/jx/sodNotice/20260819/8194.html" target="_blank" rel="noreferrer">台服技能來源 ↗</a></p><p>目前{gaiaTrial?'蓋亞雙前排試隊':'既有核心試隊'}：{ids.map(id=>characters.find(c=>c.id===id)?.short).join('、')}。依目前持有篩選，未持有者不列入；不足六人請先補位。以同一關卡比較首次奧義、核心存活與整隊傷害，再決定是否換人。此為本站試隊建議，非原表指定陣容。</p>
 <p className="caption">官方角色圖：台服公告。裝備單品圖：4399陸服圖鑑，保留原始簡體品名以便逐字核對，非台服官方圖鑑。套裝效果另附遊戲帳號發布的原圖；跨服數值不直接當成台服現況。</p>
 <div className="loadout-grid">{ids.map(id=>{const c=characters.find(c=>c.id===id)!;const o=official[id];let groups=['haste','cost'];if(id==='18')groups=['haste'];if(id==='9')groups=['crit'];if(id==='2'&&mode==='PVP')groups=['life'];return <article className="text-panel" key={id}>
 <div className="equipment-face"><img src={imagePath(c.portrait)} alt={c.name}/><div><h3>{c.name}</h3><p>{roster[id]?.star??'星數待核對'} · 原表頭像</p></div></div>
 {o?<details><summary>查看台服官方具名介紹圖</summary><a href={o.source} target="_blank" rel="noreferrer"><img className="official-reference" src={o.image} referrerPolicy="no-referrer" alt={o.name+'官方角色介紹'}/></a><a href={o.source} target="_blank" rel="noreferrer">官方來源 ↗</a></details>:<p className="caption">本次未取得具名官方原皮介紹圖；使用原表同名頭像，不以其他造型代替。</p>}
 {(guide[id]??[]).map((v,i)=><div key={i}><p style={{whiteSpace:'pre-line'}}><b>原表裝備建議：</b>{v.equipment}</p><a href={v.source} target="_blank" rel="noreferrer">{v.sheet}分頁・第{v.row}列・{v.name} ↗</a></div>)}
 <h4>{mode} 配裝方向圖示</h4>{groups.map(g=><div key={g}><p className="caption">{{haste:'急速方向',cost:'減費方向（武器＋飾品）',life:'生命方向',fee:'加費方向',crit:'暴傷方向'}[g]}</p>{pictures(sets[g])}</div>)}
 {id==='2'&&mode==='PVP'&&<p className="caption">原表另列「加費套」，但尚未確認它對應哪組裝備，因此不硬套圖示。瑪娜套的開場奧義點與敵方奧義加費是不同效果。</p>}
 {(id==='18'||id==='9')&&pictures(['最后的低语','鹰之战士肖像'])}
 <p className="caption">圖示為推薦方向對照，並非已穿戴或已分配庫存。套裝件數、效果與台服名稱請以遊戲內詳情比對；不再以背包外觀估算套數。</p>
 </article>})}</div>
 <section className="text-panel"><h3>套裝名稱的查證來源</h3><p>奇術＝急速、君炎＝生命、繁星＝減費：另參照遊戲帳號轉載的玩家心得。瑪娜套為開場增加奧義點，不能直接等同敵方加費。</p><a href="https://www.taptap.cn/moment/719606868116244075" target="_blank" rel="noreferrer">原始配裝心得（陸服、玩家經驗） ↗</a><h3>遊戲帳號發布的套裝原圖</h3><p>2025/03/25陸服「裝備大全」：奇術與聖騎系列。保留完整原圖，供名稱與圖示核對；非台服最新數值保證。</p><div className="equipment-grid">{['haste','crit'].map(n=><img key={n} className="official-reference" src={imagePath('/gear-atlas/'+n+'.png')} alt={n==='haste'?'奇術系列原圖':'聖騎系列原圖'}/>)}</div><a href="https://game.xiaomi.com/viewpoint/151431824_1742893556846_13" target="_blank" rel="noreferrer">遊戲帳號原文與圖片 ↗</a></section>
 <details className="event-archive"><summary>展開具名裝備圖鑑（4399陸服資料）</summary><p>這份圖鑑不是台服官方資料；不宣稱已核對全部台服效果。圖片與名稱來自同一筆資料，不按圖片順序猜配。</p>{pictures(gear.map(g=>g.name))}<a href="https://a.4399.cn/lhlr/tools/collection" target="_blank" rel="noreferrer">原始圖鑑 ↗</a></details>
 </section>
}
