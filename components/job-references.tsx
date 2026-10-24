import paths from '@/data/job-paths.json';
export function JobReferenceImages({role,imagePath}:{role?:string;imagePath:(p:string)=>string}){
 const pictures=paths.images.filter(i=>!role||i.role===role);
 return pictures.length?<div className="job-reference-grid">{pictures.map(i=><figure key={i.image}><a href={imagePath(i.image)} target="_blank" rel="noreferrer" aria-label={'放大：'+i.title}><img src={imagePath(i.image)} alt={i.title+'，來源日期'+i.date} loading="lazy"/></a><figcaption><strong>{i.title}</strong><span className="pill">歷史原圖 · {i.date}</span><p>{i.note}</p><p className="caption">{i.credit} · 點圖片放大</p><a href={i.url} target="_blank" rel="noreferrer">原始出處 ↗</a></figcaption></figure>)}</div>:<p className="caption">法師請對照職業效果表與逐角色來源。</p>;
}
export function JobBranchTable({role,names}:{role?:string;names?:string}){
 const branches=paths.branches.filter(b=>(!role||b.role===role)&&(!names||b.name.split(/[／/]/).some(n=>names.includes(n)||n==='首席魔導師'&&names.includes('首席'))));
 return branches.length?<div className="equipment-table-wrap"><table className="equipment-table job-branch-table"><thead><tr><th>職業／分支</th><th>主要用途</th><th>適合什麼情況</th><th>選之前注意</th></tr></thead><tbody>{branches.map(b=><tr key={b.role+b.name}><th><span className="eyebrow">{b.role}</span><br/>{b.name}<br/><a href={b.source} target="_blank" rel="noreferrer" className="caption">機制來源 ↗</a></th><td>{b.purpose}</td><td>{b.when}</td><td>{b.avoid}</td></tr>)}</tbody></table></div>:null;
}
