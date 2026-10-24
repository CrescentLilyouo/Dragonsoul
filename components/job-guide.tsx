'use client';
import {useState} from 'react';
import characters from '@/data/characters.json';
import data from '@/data/job-recommendations.json';
import paths from '@/data/job-paths.json';
import {JobReferenceImages,JobBranchTable} from '@/components/job-references';
type Roster=Record<string,{owned:boolean;star:string}>;
type Advice={pve:string;pvp:string;why:string;basis:string;source?:string};
const sheet='https://reurl.cc/rKOAXk';
const core:Record<string,Advice>={
 '18':{pve:'先比較神射手；已開分支優先試用',pvp:'沿用可用輸出分支，先確保存活與循環',why:'原表火槍欄未填轉職。神射手是參考原表多名射手後的試用候選，尚未有這位角色的台服實測結論；先比較同關卡輸出，不為候選直接花琥珀。',basis:'本站試用建議；非原表逐角結論'},
 '57':{pve:'守護者／十字軍依生存瓶頸比較',pvp:'先保護被集火的核心，再看自身承傷',why:'原表冰坦欄未填轉職。後排先倒時比較保護路線；自己先倒時比較自保路線。僅在角色命途確有對應分支、且已啟用時試用；未核實前保留琥珀。',basis:'本站按隊伍瓶頸提出候選；分支待台服介面核對'},
 '91':{pve:'高階祭司：隊內回能代表',pvp:'誅罪官：隊內降能代表',why:'依原表牧師總則提出試用方向；睡神個別欄位未填。先確認其可選分支。和穗香同隊時，每種回能／降能效果各安排一位即可。',basis:'原表牧師總則＋台服官方不疊加規則'},
 '93':{pve:'高階祭司；若睡神已供回能，改比較誅罪官',pvp:'誅罪官；若隊友已有降能，改比較高階祭司',why:'陸服官方攻略直接列出這兩條路線。依台服不疊加規則分工：睡神與穗香不要同時重複同一類效果；能同時提供回能與降能時，優先比較整隊循環。',basis:'陸服官方逐角參考＋台服規則；台服分支需核對',source:'https://www.taptap.cn/moment/842458561245086882'},
 '2':{pve:'綠林俠盜：先作參考候選',pvp:'綠林俠盜：先確保站得住',why:'陸服官方逐角攻略推薦綠林俠盜；台服原表此欄空白。先確認同名分支與效果，再配合目前PVE急速減費或PVP生命加費配置測試。',basis:'陸服官方逐角參考；非台服實測',source:'https://www.taptap.cn/moment/768477614095467955'},
 '15':{pve:'狩獵狂人：上場後再評估',pvp:'狩獵狂人：先補角色功能門檻',why:'陸服官方逐角攻略推薦狩獵狂人。若目前仍金5，先決定是否補到既定功能門檻；未確定上場前，轉職不排在主隊之前。',basis:'陸服官方逐角參考；台服分支需核對',source:'https://www.taptap.cn/moment/771343924961742198'},
 '98':{pve:'神官；缺回能時比較高階祭司',pvp:'神官；回能需求高且無重複時用高階祭司',why:'原表明列神官／高階祭司，並偏向神官提高輸出上限。先看現有隊友是否已提供回能。',basis:'原表角色欄與作者補充'},
 '36':{pve:'角鬥士',pvp:'角鬥士',why:'原表逐角色欄明列角鬥士。先完成這條上場路線，再考慮額外分支。',basis:'原表角色欄'}
};
const rolePrinciples=[
 ['牧師','先安排一位回能；PVP視需求安排一位降能。其餘比較神官等增益路線。','回能類彼此不疊加，降能類彼此也不疊加；回能與降能屬不同類效果。'],
 ['射手','依原表逐角選擇；神射手、光明遊俠、狩獵狂人不是全角色共用答案。','先分清主輸出、普攻或技能機制、功能輔助；原表空白者先試已啟用路線。'],
 ['戰士','缺承傷先看生存；站得住且缺輸出再看傷害路線。','原表已列重裝騎士、劍術大師、狂戰士、角鬥士等不同選擇，勿只按職業統一套用。'],
 ['坦克','依後排先倒或自身先倒，區分保護與自保需求。','依原表個別選守護者、獅心騎士、殉道者等；不要把所有坦克都設相同職業。'],
 ['法師','純輔與輸出路線分開看，元素隊與通用隊也可能不同。','洛基／塔蘿絲的星象家與首席路線，海神的元素／魔藥路線，原表已有用途區分。'],
 ['刺客','先看是否依賴擊殺、控制或團隊增傷。','純功能角色不能直接套擊殺收割路線；未取得逐角來源時先保留目前分支。']
];
const rowsFor=(id:string)=>data.items.filter(r=>r.characterId===id);
function SourceLinks({id,extra}:{id:string;extra?:string}){const rows=rowsFor(id);return <div className="event-sources">{rows.length?<a href={rows[0].source} target="_blank" rel="noreferrer">原表角色分頁 ↗</a>:<a href={sheet} target="_blank" rel="noreferrer">原表（此角欄位未填） ↗</a>}{extra&&<a href={extra} target="_blank" rel="noreferrer">陸服官方逐角參考 ↗</a>}</div>}
export function CharacterJob({id,imagePath}:{id:string;imagePath:(p:string)=>string}){
 const rows=rowsFor(id);const a=core[id];
 const role=characters.find(c=>c.id===id)?.class;
 const names=[...rows.map(r=>r.recommendation),a?.pve??'',a?.pvp??''].join(' ');
 return <section className="text-panel character-job"><h2>推薦轉職</h2>{rows.length?rows.map((r,i)=><div key={r.row+r.source} className="equipment-variant"><span className="pill">{r.specialist?'原表專武路線':'原表角色建議'}</span><h3 style={{marginTop:8,whiteSpace:'pre-line'}}>{r.recommendation.replaceAll(' / ','／')}</h3><p className="caption">{r.name} · 第{r.row}列</p></div>):!a&&<p>原表尚未填此角色的具體轉職，先保留已啟用分支；確認實際可選職業與角色用途後再開新路線。</p>}
 {a&&<><div className="job-mode-advice"><p><b>PVE：</b>{a.pve}</p><p><b>PVP：</b>{a.pvp}</p></div><p>{a.why}</p><p className="caption">依據：{a.basis}</p></>}
 <JobBranchTable names={names||undefined} role={role}/><details className="job-picture-details"><summary>查看同類職業原圖與版本提醒</summary><p className="caption">以下原圖是2025歷史攻略，角色建議按上方目前原表與來源閱讀。</p><JobReferenceImages role={role} imagePath={imagePath}/></details><SourceLinks id={id} extra={a?.source}/><p className="caption">轉職建議不代表帳號已啟用。回能／降能類同類效果不疊加；涉及其他分支時先核對源生琥珀成本。</p></section>;
}
export default function JobGuide({roster,imagePath,onOpenCharacter}:{roster:Roster;imagePath:(p:string)=>string;onOpenCharacter:(id:string)=>void}){
 const [section,setSection]=useState('職業效果與原圖'),[mode,setMode]=useState<'pve'|'pvp'>('pve'),[query,setQuery]=useState(''),[job,setJob]=useState('全部'),[owned,setOwned]=useState(true);
 const [branchRole,setBranchRole]=useState('牧師');
 const list=characters.filter(c=>(job==='全部'||c.class===job)&&(!owned||roster[c.id]?.owned)&&[c.name,c.alias,...rowsFor(c.id).map(r=>r.recommendation),core[c.id]?.pve??'',core[c.id]?.pvp??''].join(' ').includes(query.trim()));
 return <div className="job-guide"><div className="page-heading"><div><p className="eyebrow">CLASS PATHS</p><h1>推薦轉職與命途</h1><p>依角色用途選分支，多牧師隊伍先分配回能與降能。</p></div><span className="pill">補充 {paths.checkedAt}</span></div>
 <div className="equipment-tabs" role="group" aria-label="轉職頁分類">{['職業效果與原圖','主隊建議','逐角色查詢','命途與選擇原則'].map(s=><button key={s} aria-pressed={section===s} onClick={()=>setSection(s)}>{s}</button>)}</div>
 {section==='職業效果與原圖'&&<><section className="plan-lead" style={{display:'block'}}><h2>先看觸發條件，再沿角色的分支走</h2><p>轉職技能要能在實戰觸發才有價值。每位角色可選路線、前置與高階終點可能不同；原圖用來對照圖示和歷史分支，逐角色推薦則回到目前原表。</p><p>這次補上{paths.branches.length}種分支比較與{paths.images.length}張已檢視的來源原圖。職業機制依所附攻略／資料站摘要，精確倍率、間隔與現行台服限制仍以命途技能說明為準。</p></section><div className="event-filters" role="group" aria-label="職業效果分類">{['全部','牧師','射手','戰士','坦克','法師','刺客'].map(r=><button key={r} aria-pressed={branchRole===r} onClick={()=>setBranchRole(r)}>{r}</button>)}</div><h2 className="section-title">{branchRole==='全部'?'六職業':branchRole}：怎麼選</h2><JobBranchTable role={branchRole==='全部'?undefined:branchRole}/><section className="text-panel"><h2>原圖對照 · 點圖放大</h2><p>圖片保留原文、作者標記與日期。舊圖尚未包含的角色，不從相似頭像自行補配。</p><JobReferenceImages role={branchRole==='全部'?undefined:branchRole} imagePath={imagePath}/></section><section className="text-panel"><h2>舊攻略和目前原表不一致時</h2><div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>角色</th><th>2025攻略方向</th><th>目前原表方向</th><th>怎麼處理</th></tr></thead><tbody>{paths.discrepancies.map(d=><tr key={d.characterId}><td>{characters.find(c=>c.id===d.characterId)?.short}</td><td>{d.old}</td><td>{d.current}</td><td>{d.note}</td></tr>)}</tbody></table></div><p className="caption">原表角色欄讀取於{data.checkedAt}；圖片與機制補充查閱於{paths.checkedAt}。表內「首席→符文法師」等差異也包含文字攻略，不一定全部出現在原圖。</p></section></>}
 {section==='主隊建議'&&<><section className="plan-lead" style={{display:'block'}}><h2>睡神＋穗香：先分工，再投入職業</h2><p>PVE可先試「睡神高階祭司＋穗香誅罪官」；PVP可反過來比較「睡神誅罪官＋穗香高階祭司」。這是依台服不疊加規則提出的隊伍方案；必須先確認兩位實際可選分支，已啟用才切換測試。</p><p>若其中一位沒有該分支，就把回能位置交給另一位，其他角色保留可用路線。比較同一對手的首次奧義時間、整隊施放次數與存活，不只看戰力。</p></section><div className="equipment-tabs" role="group" aria-label="轉職用途">{(['pve','pvp'] as const).map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m.toUpperCase()}</button>)}</div><div className="job-core-grid">{Object.entries(core).map(([id,a])=>{const c=characters.find(c=>c.id===id)!;const r=roster[id];return <article className="text-panel" key={id}><button className="equipment-face" onClick={()=>onOpenCharacter(id)}><img src={imagePath(c.portrait)} alt={c.name} loading="lazy"/><div><h2>{c.name} ↗</h2><p>{r?.owned?`持有紀錄：${r.star}`:'未記錄持有'} · {c.class}</p></div></button><h3 className="equipment-set">{a[mode]}</h3><p>{a.why}</p><p className="caption">{a.basis}</p><SourceLinks id={id} extra={a.source}/><button className="activity-read-link" onClick={()=>{setBranchRole(c.class);setSection('職業效果與原圖');}}>查看{c.class}分支用途與原圖 ↗</button></article>})}</div></>}
 {section==='逐角色查詢'&&<><div className="notice"><span>原表已填{data.items.length}筆、涵蓋{new Set(data.items.map(r=>r.characterId)).size}位角色；空白欄不視為推薦。一般與專武路線分開列出。陸服補充與本站試用方案均標明來源性質。</span></div><div className="equipment-controls"><input aria-label="搜尋角色轉職" value={query} placeholder="搜尋角色、轉職名稱…" onChange={e=>setQuery(e.target.value)}/><select aria-label="轉職角色類型" value={job} onChange={e=>setJob(e.target.value)}>{['全部','牧師','射手','戰士','坦克','法師','刺客'].map(j=><option key={j}>{j}</option>)}</select><label><input type="checkbox" checked={owned} onChange={e=>setOwned(e.target.checked)}/>只看已持有</label></div><p className="caption">符合 {list.length} 位；點角色開啟裝備、轉職與寶具。</p><div className="job-core-grid">{list.map(c=><article className="text-panel" key={c.id}><button className="equipment-face" onClick={()=>onOpenCharacter(c.id)}><img src={imagePath(c.portrait)} alt={c.name} loading="lazy"/><div><h2>{c.name} ↗</h2><p>{c.class} · {roster[c.id]?.owned?roster[c.id].star:'未持有'}</p></div></button><CharacterJob id={c.id} imagePath={imagePath}/></article>)}</div>{!list.length&&<p className="empty">沒有符合角色，請調整搜尋或持有篩選。</p>}</>}
 {section==='命途與選擇原則'&&<><section className="text-panel"><h2>先讀這三件事</h2><ol><li><b>先確定上場用途：</b>回能、降能、增益、生存或輸出，選對實際需要的功能。</li><li><b>再確認分支與精通：</b>職業名稱、前置節點與精通條件依台服命途頁。舊攻略的中階終點不一定是目前的高階終點。</li><li><b>最後才花琥珀：</b>原表提醒改點職業涉及琥珀；先看介面顯示的成本。已啟用路線可切換時，先試再投資。</li></ol><p className="caption">原表轉職總則與角色欄為主要依據。刷取日程、每日次數及精確材料消耗未在此套用陸服舊數字。</p></section><section className="text-panel"><h2>台服已確認的疊加限制</h2><p>服事、祭司、高階祭司屬回能類，同類效果不疊加；信徒、狂熱者、誅罪官屬降能類，同類效果也不疊加。安排兩位以上牧師時，先檢查這兩組是否重複。</p><p>官方曾新增高階命途並調整職業效果，包含神射手、聖教軍、神官等。因此不把2025年早期陸服攻略直接當作現在台服的唯一答案。</p><p className="caption"><a href={data.officialSource} target="_blank" rel="noreferrer">台服2025/7/30職業調整公告 ↗</a></p></section><div className="equipment-table-wrap"><table className="equipment-table"><thead><tr><th>類型</th><th>先怎麼選</th><th>注意事項</th></tr></thead><tbody>{rolePrinciples.map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table></div><section className="text-panel"><h2>原表有多個選項時</h2><p>「星象家（純輔）／首席（輸出）」代表不同用途；「誅罪官（PVP）／神官（通用）」代表不同戰鬥場景。先按當次配隊選一條，不是把列出的所有分支都解鎖。</p><p>原表保留「元素師／元素使」「首席」等寫法。實際名稱與效果依遊戲，查詢頁保留原文供對照。</p></section></>}
 <p className="caption">角色圖像沿用已核對的原表頭像；本頁為幻靈轉職，主角巨龍陣營另在配隊考慮。</p>
 </div>;
}
