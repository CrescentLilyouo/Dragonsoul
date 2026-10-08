'use client';
import {useEffect,useState} from 'react';
import events from '@/data/events.json';

const groups=[
 {name:'魔物',items:[{name:'水銀秘藥（藍水）',points:2},{name:'靈魂煉劑（紫水）',points:10},{name:'命運魔藥（橘水）',points:15}]},
 {name:'神器',items:[{name:'黃金號角',points:10},{name:'命運號角',points:15}]},
 {name:'龍語',items:[{name:'傳承龍晶',points:3},{name:'命運龍晶',points:5}]}
];
const categories=['全部',...new Set(events.items.map(e=>e.group))];
const sourceLabels:Record<string,string>={guide:'台服玩家：佳里攻略',current:'台服官方 9/30',autumn:'台服官方 9/23',monster:'台服官方 7/15',mine:'台服官方 6/9',sea:'台服官方 9/16',myth:'台服玩家：神話階段',old:'2025 舊版資源攻略',season:'台服官方 5/14'};
const num=(v:string)=>Math.max(0,Math.min(10000000,Math.floor(Number(v)||0)));
export default function EventBudget(){
 const [now,setNow]=useState(()=>Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),30000);return()=>clearInterval(timer);},[]);
 const [category,setCategory]=useState('全部');
 const [counts,setCounts]=useState<Record<string,number>>({});
 const [target,setTarget]=useState(2700);
 const [done,setDone]=useState<Record<string,number>>({});
 const filtered=events.items.filter(e=>category==='全部'||category===e.group);
 const ended=filtered.filter(e=>e.end&&Date.parse(e.end)<now);
 const current=filtered.filter(e=>e.start&&e.end&&Date.parse(e.start)<=now&&Date.parse(e.end)>=now);
 const pending=filtered.filter(e=>!e.start||!e.end||Date.parse(e.start)>now);
 const cards=(items:typeof events.items)=><div className="event-list">{items.map(e=><article key={e.name} className="text-panel"><span className="eyebrow">{e.group}</span><h3>{e.name}</h3><p className="date-range">{e.when}（台灣時間）</p><dl><dt>低標目標</dt><dd>{e.goal}</dd><dt>資源需求</dt><dd>{e.budget}</dd><dt>停手與注意</dt><dd>{e.stop}</dd></dl><span className="pill">{e.status}</span><div className="event-sources">{e.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{sourceLabels[s.label]||s.label} ↗</a>)}</div></article>)}</div>;
 return <>
  <div className="page-heading"><div><p className="eyebrow">EVENT RESOURCE PLANNER</p><h1>活動與資源預算</h1><p>先存到一個完整獎勵檔，再決定是否繼續。</p></div><span className="pill">核對 {events.checkedAt.replaceAll('-','/')}</span></div>
  <div className="notice"><span>這裡的「低標」先定義為：輪替養成完成一輪；其他活動拿免費任務或自選核心獎勵。不是排名獎勵，也不代表整期商店全清。</span></div>
  <section className="text-panel"><h2>先存多少？三種輪替活動</h2><p>台服玩家整理的一輪門檻為 2,700 分。以下是從零分開始、只用單一資源的等價需求；同一列可混用，不用每種都存滿。</p>
   <div className="event-quick-grid"><article><h3>魔物</h3><strong>紫水 270 瓶</strong><p>或藍水 1,350／橘水 180</p></article><article><h3>神器</h3><strong>黃金號角 270 個</strong><p>或命運號角 180</p></article><article><h3>龍語</h3><strong>傳承龍晶 900 個</strong><p>或命運龍晶 540</p></article></div>
   <p className="caption">來源：<a href={events.sources.guide} target="_blank" rel="noreferrer">佳里台服攻略 ↗</a>。近期官方已公告第六輪獎勵，舊攻略的五輪資訊不當成整期上限；各輪與獎勵數量需核對活動畫面。</p>
  </section>
  <section className="text-panel"><h2>庫存與缺口計算器</h2><p>輸入尚未使用的庫存與本期已獲得的積分。三類活動分開計算，不共用積分；尚未領到的返還道具不先算入。</p>
   <label className="event-target">目標累計積分 <input type="number" min="1" max="10000000" value={target||''} onChange={e=>setTarget(num(e.target.value))}/></label>
   <p className="caption">預設一輪 2,700 分；若遊戲顯示不同門檻，請自行改填。此欄使用從本期起算的累計分数，多輪時不要填單輪進度。</p>
   <div className="event-calculators">{groups.map(g=>{
    const stock=g.items.reduce((sum,v)=>sum+(counts[v.name]||0)*v.points,0);
    const gap=Math.max(0,target-(done[g.name]||0)-stock);
    return <article key={g.name}><h3>{g.name}</h3>
     {g.items.map(v=><label key={v.name}>{v.name}<span>{v.points} 分／個</span><input aria-label={v.name+'庫存'} inputMode="numeric" type="number" min="0" value={counts[v.name]??''} placeholder="請輸入庫存" onChange={e=>setCounts({...counts,[v.name]:num(e.target.value)})}/></label>)}
     <label>本期已得積分<input aria-label={g.name+'本期已得積分'} type="number" min="0" value={done[g.name]??''} placeholder="0" onChange={e=>setDone({...done,[g.name]:num(e.target.value)})}/></label>
     <p>庫存可換算 <b>{stock.toLocaleString()}</b> 分</p>
     <strong className="event-gap" aria-live="polite">{target<1?'請填入目標積分':gap?`還差 ${gap.toLocaleString()} 分`:'現有資源足夠達標'}</strong>
     {gap>0&&target>0&&<p className="caption">若只補一種：{g.items.map(v=>`${v.name} ${Math.ceil(gap/v.points).toLocaleString()} 個`).join('，或')}。以上為替代方案，不是全部相加。</p>}
    </article>;
   })}</div><p className="caption">本頁輸入僅供當次計算，重新整理會清空。不自動辨認背包圖示，也不自動扣減資源。</p>
  </section>
  <div className="section-top"><h2>活動清單・{events.items.length} 類</h2><p className="caption">涵蓋本期及已查證歷史活動；不保證歷史活動必定復刻。</p></div>
  <div className="event-filters" role="group" aria-label="活動分類">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <section className="event-section"><h2 className="section-title">進行中 · {current.length}</h2><p className="caption">依台灣時間自動分類；個人活動仍以遊戲內倒數為準。</p>{current.length?cards(current):<p className="caption">此分類目前沒有已確認進行中的活動。</p>}</section>
  {pending.length>0&&<section className="event-section"><h2 className="section-title">尚未開始／檔期待確認 · {pending.length}</h2><p className="caption">歷史規則供備存資源參考，不代表目前已開放。</p>{cards(pending)}</section>}
  <details className="event-archive"><summary>已結束活動 · {ended.length}<span>點擊展開／收合</span></summary>{ended.length?cards(ended):<p className="caption">此分類沒有已結束的活動。</p>}</details>
  <section className="text-panel"><h2>還缺哪些資料才能算「全部低標拿滿」？</h2><p>需要本期魔物／獵蟒／魔法的各輪獎勵與計分頁，以及海神寶庫、探寶尋珍、節慶商店的目標商品價格。已確認的固定門檻先列出；未公開的部分不填猜測數字。</p><p>你目前背包截圖顯示 2,780 鑽，但券種與剩餘庫存未重新確認。先把券數輸入上面的計算器；鑽石追加額須按當期商店價格與購買上限另算。</p></section>
 </>;
}
