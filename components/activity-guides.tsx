'use client';
import {useState} from 'react';
import guides from '@/data/activity-guides.json';
const categories=['全部',...new Set(guides.items.map(g=>g.category))];
export default function ActivityGuides(){
 const [category,setCategory]=useState('全部'),[query,setQuery]=useState('');
 const [fields,setFields]=useState<Record<string,string>>({});
 const filtered=guides.items.filter(g=>(category==='全部'||g.category===category)&&[g.title,g.summary,...g.rules].join(' ').includes(query.trim()));
 const input=(key:string,label:string)=><label>{label}<input type="number" min="0" step="1" value={fields[key]??''} placeholder="依遊戲畫面填入" onChange={e=>setFields({...fields,[key]:e.target.value})}/></label>;
 const valid=['price','count','owned'].every(k=>fields[k]!==undefined&&fields[k]!==''&&Number.isFinite(Number(fields[k]))&&Number(fields[k])>=0)&&Number(fields.count)>0;
 const gap=valid?Math.max(0,Number(fields.price)*Number(fields.count)-Number(fields.owned)):0;
 return <section className="activity-guides"><div className="section-top"><div><h2>活動玩法攻略 · {guides.items.length} 類</h2><p className="caption">官方規則、玩家技巧與本站建議分開標示。歷史玩法可查閱，不代表現在開放。</p></div></div>
 <div className="equipment-controls"><input aria-label="搜尋活動攻略" placeholder="搜尋挖土、寶具、魔法、巴別塔…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
 <div className="event-filters" role="group" aria-label="玩法分類">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 <p className="caption">找到 {filtered.length} 類。點標題展開玩法、操作順序與停手點。</p>
 <div className="activity-articles">{filtered.map(g=><details className="activity-article" key={g.id} open={g.id==='dig'?true:undefined}><summary><span className="eyebrow">{g.category}</span><strong>{g.title}</strong><span>{g.summary}</span></summary><div className="activity-body"><section><h3>已核對規則與適用範圍</h3>{g.rules.map(t=><p key={t}>{t}</p>)}</section><section><h3>建議操作順序</h3><ol>{g.steps.map(t=><li key={t}>{t}</li>)}</ol></section><div className="activity-stop"><b>停手點</b><p>{g.stop}</p></div><section><h3>常見誤區</h3><ul>{g.pitfalls.map(t=><li key={t}>{t}</li>)}</ul></section>{g.id==='dig'&&<div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>工具／路線</th><th>先看什麼</th><th>使用判斷</th></tr></thead><tbody><tr><td>鐵鍬</td><td>格子消耗與能否推進</td><td>優先低成本開路；不為零散星星繞遠。</td></tr><tr><td>炸彈</td><td>預覽範圍內的障礙、工具與出口</td><td>同時解決多個高成本格，比只炸一格更值得。</td></tr><tr><td>火箭</td><td>整行障礙與可取得的補給</td><td>先確認當期範圍，再選能開路兼拿補給的一行。</td></tr><tr><td>工具／寶箱支線</td><td>繞路花費與確定可得工具</td><td>比較淨消耗，不把「拿到工具」直接當成賺到。</td></tr></tbody></table><p className="caption">操作判斷示意，非本期地圖解答；道具範圍以當期遊戲預覽為準。</p></div>}<div className="event-sources">{g.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</div><p className="caption">查閱整理：{guides.checkedAt}。操作順序及停手點為本站建議。</p></div></details>)}</div>
 {!filtered.length&&<p className="empty">沒有符合的攻略，請換關鍵字或選「全部」。</p>}
 <section className="text-panel"><h2>活動商店：還差多少貨幣？</h2><p>可用於星星、超凡能量、舊憶碎片或山銅。每次只算同一種貨幣；雙貨幣商品分開計算。</p><div className="activity-calc">{input('price','商品單價')}{input('count','想兌換份數')}{input('owned','目前持有貨幣')}</div><p aria-live="polite" className="event-gap">{valid?gap>0?`還差 ${gap.toLocaleString()}；再核對剩餘免費任務能否補足。`:'貨幣數量足夠；仍需確認限購、解鎖與兌換期限。':'填入單價、份數與持有量後顯示差額。'}</p><p className="caption">只計現有貨幣，不把未領獎勵或隨機掉落算進去；輸入不儲存。</p></section>
 </section>;
}
