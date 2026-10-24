'use client';
import {useState} from 'react';
import characters from '@/data/characters.json';
import guide from '@/data/verified-guide.json';
type Props={roster:Record<string,{owned:boolean;star:string}>,news:{banners:{name:string;characterId:string;start:string;end:string;url:string}[]},imagePath:(path:string)=>string,onOpenCharacter:(id:string)=>void};
const stages=['待確認','金5','金6','紫1','紫2','紫3','紫4','紫5','紫6','紅1','紅2','紅3','紅4','紅5','紅6','鑽','神1','神2','神3','神4','神5'];
const date=(s:string)=>new Date(s).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
const plans:Record<string,{target:string;action:string;stop:string}>={
 '18':{target:'紅1',action:'PVE 主輸出優先補齊急速、低語與鷹像配置。先處理輸出與奧義循環，再評估升鑽。',stop:'試算表把鑽列為後續建議；紅1後不必為追鑽擠掉全隊裝備預算。'},
 '57':{target:'紅1',action:'先補生存與急速減費，確認坦得住、奧義能銜接。',stop:'紅1是本規劃的暫停檢查點，並非來源最低門檻；試算表建議鑽，留待核心裝備完成再評估。'},
 '91':{target:'紫3',action:'先完成急速減費。偏 PVP 且預算足夠跨門檻時，再考慮紅1的控制提升。',stop:'紫3達到試算表起步區間；紅1是選擇性補強，不分散追更高星。'},
 '93':{target:'紅1',action:'急速減費優先，讓輔助與隊伍循環穩定。',stop:'紅1達起步門檻後先停；升鑽放在主輸出與全隊裝備之後。'},
 '2':{target:'紅1',action:'PVP依生存與加費方向配置；PVE切回急速減費。點開角色查看兩條裝備路線。',stop:'紅1即可先用，暫不因有鑽階建議就追加抽卡。'},
 '56':{target:'紅1',action:'新增持有蓋亞後，先以可用生存與急速減費裝試雙前排；是否升紅1依前排瓶頸與可完成的資源決定。紫1不直接取代紅3冰坦。',stop:'原表最低建議紅1；開場權杖另須確認天賦4已解鎖。不能完成門檻則先存，別為尾檔追抽。'},
 '15':{target:'紫3',action:'若要加入現有隊伍，先以紫3功能門檻規劃；急速、暴傷與降費依試算表搭配。',stop:'未達紫3前先存資源；只在能完成目標且確定上場時投入，本期不必強追。'}
};
export default function ReinforcementPlan({roster,news,imagePath,onOpenCharacter}:Props){
 const [mode,setMode]=useState<'PVE'|'PVP'>('PVE');
 const now=Date.now();
 const banners=news.banners.filter(b=>Date.parse(b.start)<=now&&now<=Date.parse(b.end));
 const ids=mode==='PVE'?['18','57','56','91','93','2','15']:['91','2','56','93','57','18','15'];
 return <><div className="page-heading"><div><p className="eyebrow">NEXT INVESTMENT · 10/25 持有更新</p><h1>補強與後續規劃</h1><p>先完成上場隊伍的裝備與循環，再集中跨過一個升星門檻。</p></div><span className="pill">依目前持有紀錄調整</span></div>
 <div className="notice warning">星級取自本瀏覽器的持有頁，並非重新辨識截圖。修改持有紀錄後，本頁會同步更新；以下順序是規劃建議，非官方排名。</div>
 <section className="plan-lead" style={{display:"block"}}><p className="eyebrow">這一期怎麼花</p><h2>核心先配裝；神話資源只選一個目標</h2><p>睡神紫3、穗香與莉莉絲紅1若仍符合你的持有紀錄，先保留，優先改善實際上場的裝備。新增蓋亞紫1後，前排承傷不足可先測雙前排，再評估集中補蓋亞紅1；偏競技場控制則比較睡神紅1。月神目前金5，紫3列為後續補位，三條神話養成線只選一條。</p><p>目前資源、保底進度與所缺本體未填入，因此不沿用舊鑽石餘額，也不估算「幾抽必得幾隻」。</p></section>
 <div className="equipment-tabs" role="group" aria-label="補強用途">{(['PVE','PVP'] as const).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='PVE'?'PVE 推圖／爬塔':'PVP 競技場'}</button>)}</div>
 <p className="caption">排序代表養成檢查順序，不代表每位都要抽。點角色可查看試算表推薦裝備與圖片來源。</p>
 <div className="priority-list">{ids.map((id,i)=>{const c=characters.find(c=>c.id===id)!;const p=plans[id];const r=roster[id];const known=!!r?.owned&&stages.indexOf(r.star)>0;const reached=known&&stages.indexOf(r.star)>=stages.indexOf(p.target);const banner=banners.find(b=>b.characterId===id);const sources=(guide as Record<string,{source:string}[]>)[id]??[];return <article key={id}><span className="priority-num">{i+1}</span><button className="plan-face" onClick={()=>onOpenCharacter(id)} aria-label={`查看${c.short}推薦裝備`}><img src={imagePath(c.portrait)} alt={c.name}/></button><div><p className="eyebrow">{r?.owned?`紀錄：${r.star}`:'尚未記錄持有'} · {reached?'已達本階段檢查點':known?`下一檢查點：${p.target}`:'先確認持有與星級'}</p><h3><button onClick={()=>onOpenCharacter(id)}>{c.name} ↗</button></h3><p>{r?.owned?p.action:'先以已持有的上場角色配裝，不為本清單直接開新養成線。'}</p><p className="stop-rule">停手點｜{p.stop}</p><p className="caption">{banner?`本期可選 · ${date(banner.end)}截止`:'已核對公告中無目前開放的對應UP；先養成／等返場'}{sources[0]&&<> · <a href={sources[0].source} target="_blank" rel="noreferrer">試算表原頁</a></>}</p></div></article>})}</div>
 <div className="guide-grid"><section className="text-panel"><h2>資源分配</h2><ul><li><b>神話券／鈴蘭：</b>先核對兌換規則與本期保底，依缺口只集中蓋亞紅1、睡神紅1或月神紫3其中一個；不能完成門檻則存下。</li><li><b>限定券／龍晶：</b>先保留。德雷克已公告技能，但養成門檻與實戰收益尚未核實，不因新池或圖鑑紀錄直接追星。</li><li><b>裝備與強化材料：</b>{mode==='PVE'?'火槍輸出與急速 → 冰坦生存 → 睡神／穗香循環。':'睡神控制循環 → 莉莉絲生存與加費 → 前排承傷。'}若實戰前排先倒，先修正生存瓶頸。</li><li><b>山銅／神輝／琥珀：</b>確認對應裝備與升級用途後再用；背包圖片未核實的物件不指定分配。</li></ul></section>
 <section className="text-panel"><h2>本期卡池決策</h2><p>神話四選一是睡神、蓋亞、月神、赫爾墨斯。蓋亞已持有紫1，不再當成未持有角色；前排是瓶頸且資源能完成原表紅1目標時才考慮集中補她。睡神紅1偏控制、月神紫3偏後續補位；赫爾墨斯先不另開養成線。</p><p>德雷克的金幣、喚醒與火藥桶機制適合觀察彼岸／奧術隊；目前先試用與看實戰，不把金5紀錄當作已驗證的抽卡依據。</p>{banners.length?banners.slice(0,5).map(b=><p className="caption" key={b.name}><a href={b.url} target="_blank" rel="noreferrer">{b.name}</a> · 至{date(b.end)}</p>):<p>已核對的卡池目前均不在開放期間；請先更新公告後再決定抽卡。</p>}</section></div>
 <section className="text-panel"><h2>近期收尾順序 · 台灣時間</h2>{[{title:'探索活動收尾',end:'2026-10-26T04:59:00+08:00',note:'先領取已完成獎勵。'},{title:'神話四選一／魔法衝刺／聖堂巡禮收尾',end:'2026-10-29T04:59:00+08:00',note:'先核對活動進度與兌換，不為尾檔臨時加碼；聖堂巡禮10/26 05:00才開始。'},{title:'彼岸／奧術巴別塔排名結算',end:'2026-11-04T22:00:00+08:00',note:'先使用現有養成完成可打層數。'},{title:'德雷克卡池／禁酒風雲收尾',end:'2026-11-05T04:59:00+08:00',note:'養成門檻未核實前維持觀望。'}].filter(e=>Date.parse(e.end)>=now).map(e=><p key={e.title}><b>{date(e.end)} · {e.title}</b><br/>{e.note}</p>)}<p className="caption">公告核對：2026/10/23；試算表資料核對：2026/10/22。日期會自動隱藏已過期項目，不代表公告會自動重新查證。<br/><a href="https://sod.game-beans.com/jx/sodNotice/20261014/8285.html" target="_blank" rel="noreferrer">10/14 官方公告</a> · <a href="https://sod.game-beans.com/jx/sodNotice/20261020/8289.html" target="_blank" rel="noreferrer">10/21 維護公告</a></p></section></>;
}
