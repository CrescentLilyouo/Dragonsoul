'use client';
import {useEffect,useState} from 'react';
import guides from '@/data/activity-guides.json';
const categories=['全部',...new Set(guides.items.map(g=>g.category))];
const quick=[{id:'dig',label:'挖土怎麼挖'},{id:'monster',label:'魔物囤水'},{id:'artifact',label:'號角／神器'},{id:'magic',label:'龍晶／魔法'},{id:'leaf',label:'金葉換什麼'},{id:'sea',label:'寶庫／海螺'},{id:'archaeology',label:'考古與時隙'},{id:'launch-rush',label:'新服先做什麼'}];
export default function ActivityGuides({initialId,onOpenBudget}:{initialId?:string;onOpenBudget:()=>void}){
 const [category,setCategory]=useState('全部'),[query,setQuery]=useState(''),[expanded,setExpanded]=useState(initialId??'dig');
 const [fields,setFields]=useState<Record<string,string>>({});
 useEffect(()=>{if(initialId)document.getElementById('activity-'+initialId)?.scrollIntoView({block:'start'});},[initialId]);
 const filtered=guides.items.filter(g=>(category==='全部'||g.category===category)&&[g.title,g.summary,...g.rules,...g.preparation,...g.steps,...g.daily,...g.rewards].join(' ').includes(query.trim()));
 const input=(key:string,label:string)=><label>{label}<input type="number" min="0" step="1" value={fields[key]??''} placeholder="依遊戲畫面填入" onChange={e=>setFields({...fields,[key]:e.target.value})}/></label>;
 const valid=['price','count','owned'].every(k=>fields[k]!==undefined&&fields[k]!==''&&Number.isFinite(Number(fields[k]))&&Number(fields[k])>=0)&&Number(fields.count)>0;
 const gap=valid?Math.max(0,Number(fields.price)*Number(fields.count)-Number(fields.owned)):0;
 function jump(id:string){setCategory('全部');setQuery('');setExpanded(id);requestAnimationFrame(()=>document.getElementById('activity-'+id)?.scrollIntoView({behavior:'smooth',block:'start'}));}
 return <section className="activity-guides">
  <section className="activity-route"><p className="eyebrow">囤貨 → 開活動 → 分批領獎 → 達標停手</p><h2>先選目標，再決定用多少資源</h2><div className="activity-route-grid"><article><span>01</span><h3>平時先存</h3><p>藥水、號角、龍晶分開記；先留下主隊補強所需資源。</p></article><article><span>02</span><h3>活動開了再算</h3><p>確認本期計分、UP與獎勵，選可完成的一輪。</p></article><article><span>03</span><h3>邊用邊領</h3><p>分批投入，獎勵領到後才把返還計入庫存。</p></article><article><span>04</span><h3>跨檔前再判斷</h3><p>達標就停；下一輪重新算差額與代價。</p></article></div><button className="outline-link" onClick={onOpenBudget}>開啟囤貨與積分計算器 ↗</button></section>
  <div className="activity-quick" role="group" aria-label="常用活動攻略">{quick.map(q=><button key={q.id} onClick={()=>jump(q.id)}>{q.label} ↗</button>)}</div>
  <section className="text-panel"><h2>三種輪替：平時存什麼？</h2><p>佳里歷史攻略以一輪2,700分作存量參考。當期門檻不同時，改用活動畫面；各類資源不共用分數。</p><div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>輪替活動</th><th>計分參考</th><th>只有單一資源時的一輪需求</th><th>先檢查</th></tr></thead><tbody><tr><td><button onClick={()=>jump('monster')}>魔物 ↗</button></td><td>藍2／紫10／橘15</td><td>藍水1,350 或紫水270 或橘水180</td><td>魔物組合與本期UP</td></tr><tr><td><button onClick={()=>jump('artifact')}>神器 ↗</button></td><td>黃金號角10／命運號角15</td><td>黃金號角270 或命運號角180</td><td>可否形成龍巢配置</td></tr><tr><td><button onClick={()=>jump('magic')}>龍語 ↗</button></td><td>傳承龍晶3／命運龍晶5</td><td>傳承龍晶900 或命運龍晶540</td><td>主隊龍與陣營是否適用</td></tr></tbody></table></div><p className="caption">同列是替代方案，也能混用。官方已公告第六輪獎勵，不能把舊攻略的五輪直接當成現行上限。</p></section>
  <div className="section-top"><div><h2>活動與常駐玩法 · {guides.items.length} 類</h2><p className="caption">限時活動與常駐養成分開分類；歷史玩法不代表現在開放。</p></div><button className="outline-link" onClick={()=>setExpanded('')}>收合攻略</button></div>
  <div className="equipment-controls"><input aria-label="搜尋活動攻略" placeholder="搜尋挖土、金葉、寶具、考古、裝備…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
  <div className="event-filters" role="group" aria-label="玩法分類">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <p className="caption">找到 {filtered.length} 類。展開可看準備、操作、每日與獎勵選擇。</p>
  <div className="activity-articles">{filtered.map(g=><details className="activity-article" id={'activity-'+g.id} key={g.id} open={expanded===g.id} onToggle={e=>{const isOpen=e.currentTarget.open;setExpanded(previous=>isOpen?g.id:previous===g.id?'':previous);}}>
   <summary><span className="eyebrow">{g.category}</span><strong>{g.title}</strong><span>{g.summary}</span></summary>
   <div className="activity-body">
    <section><h3>規則與適用範圍</h3>{g.rules.map(t=><p key={t}>{t}</p>)}</section>
    <div className="activity-playbook-grid"><section><h3>開活動前準備</h3><ul>{g.preparation.map(t=><li key={t}>{t}</li>)}</ul></section><section><h3>每天做什麼</h3><ul>{g.daily.map(t=><li key={t}>{t}</li>)}</ul></section></div>
    <section><h3>實際操作順序</h3><ol>{g.steps.map(t=><li key={t}>{t}</li>)}</ol></section>
    <section className="activity-rewards"><h3>獎勵與兌換優先序</h3><ol>{g.rewards.map(t=><li key={t}>{t}</li>)}</ol></section>
    {g.example&&<div className="activity-example"><b>算給你看／預算參考</b><p>{g.example}</p></div>}
    {g.id==='leaf'&&<div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>帳號情況</th><th>佳里歷史方向</th><th>本站套用方式</th></tr></thead><tbody><tr><td>新服，魔物尚未解鎖</td><td>先保留金葉，等可換魔物</td><td>等開放前先確認需求；不要因只看到神器就隨便兌換。</td></tr><tr><td>魔物開放，功能未齊</td><td>黑龍 → 南瓜騎士 → 迅捷，再補其他魔物</td><td>已擁有或與主隊無關的項目，按缺口調整，不重複開無用養成線。</td></tr><tr><td>主隊成型</td><td>黑龍紅6後再評估神杯部件</td><td>只有選擇黑龍主線且缺該階段時才採用；其他主龍另算。</td></tr></tbody></table></div>}
    {g.id==='dig'&&<div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>工具／路線</th><th>先看什麼</th><th>使用判斷</th></tr></thead><tbody><tr><td>鐵鍬</td><td>格子消耗與推進位置</td><td>低成本開路優先，星星順路拿。</td></tr><tr><td>炸彈</td><td>障礙與補給是否同在覆蓋內</td><td>預覽後選能同時開路與取得工具的位置。</td></tr><tr><td>火箭</td><td>整行障礙及出口</td><td>比較節省多少工具，再決定使用哪一行。</td></tr><tr><td>寶箱支線</td><td>為接近寶箱付出的工具</td><td>看淨消耗；不能只看到有工具就繞路。</td></tr></tbody></table></div>}
    <div className="activity-stop"><b>停手點</b><p>{g.stop}</p></div>
    <section><h3>常見誤區</h3><ul>{g.pitfalls.map(t=><li key={t}>{t}</li>)}</ul></section>
    {['monster','artifact','magic'].includes(g.id)&&<button className="outline-link" onClick={onOpenBudget}>用我的庫存算下一輪差額 ↗</button>}
    <div className="event-sources">{g.sources.map(s=><a key={s.url+s.label} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div>
    <p className="caption">整理：{guides.checkedAt}。{g.sourceNote}</p>
   </div>
  </details>)}</div>
  {!filtered.length&&<p className="empty">沒有符合的攻略，請換關鍵字或選「全部」。</p>}
  <section className="text-panel"><h2>活動商店：還差多少貨幣？</h2><p>每次算同一種貨幣；可用於星星、超凡能量、舊憶碎片或山銅。雙貨幣商品分開計算。</p><div className="activity-calc">{input('price','商品單價')}{input('count','想兌換份數')}{input('owned','目前持有貨幣')}</div><p aria-live="polite" className="event-gap">{valid?gap>0?`還差 ${gap.toLocaleString()}；再看剩餘免費任務能否補足。`:'貨幣足夠；兌換前確認限購、解鎖與期限。':'填入單價、份數與持有量後顯示差額。'}</p><p className="caption">未領獎勵或隨機掉落不計入現有庫存；輸入僅供當次計算。</p></section>
  <details className="event-archive"><summary>參考來源與版本說明</summary><h3><a href={guides.reference.url} target="_blank" rel="noreferrer">{guides.reference.title} ↗</a></h3><p>{guides.reference.scope}</p><p>{guides.reference.note}</p><p>台服公告列表核對至2026/10/25，最新維護公告仍為10/21。本頁保留歷史活動攻略，實際開放狀態見「進行中與歷史活動」。</p></details>
 </section>;
}
