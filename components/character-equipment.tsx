import guideData from '@/data/verified-guide.json';
import atlas from '@/data/gear-atlas.json';
type GuideRow={name:string;row:string;sheet:string;source:string;equipment:string};
const guide=guideData as Record<string,GuideRow[]>;
const groups=[
 {test:/急速/,label:'急速套・奇術系列',names:['奇术兜帽','奇术长袍','奇术护手','奇术长靴']},
 {test:/減費|降費/,label:'減費方向・繁星組',names:['繁星魔导书','繁星魔导器']},
 {test:/生命套/,label:'生命套・君炎防具',names:['君炎头盔','君炎护甲','君炎护手','君炎战靴']},
 {test:/[暴爆]傷/,label:'暴傷套・聖騎系列',names:['圣骑头盔','圣骑战甲','圣骑护手','圣骑战靴']},
 {test:/低語/,label:'低語',names:['最后的低语']},
 {test:/鷹像/,label:'鷹像',names:['鹰之战士肖像']},
];
export default function CharacterEquipment({id,imagePath}:{id:string;imagePath:(p:string)=>string}){
 const rows=guide[id]??[];
 return <section className="text-panel character-equipment" aria-label="角色推薦裝備"><h2>推薦裝備</h2><p className="caption">依原表角色專屬建議整理；不同套裝是可選方案，不表示全部同時穿戴。</p>
 {!rows.length&&<p>這位角色尚未取得重新核對的原表配裝，暫不指定裝備圖片。</p>}
 {rows.map((r,i)=>{const matches=groups.filter(g=>g.test.test(r.equipment));return <section className="equipment-variant" key={i}><h3>{r.name.includes('專武')?'專武路線':'一般路線'}</h3><p className="equipment-set" style={{whiteSpace:'pre-line'}}>{r.equipment||'原表未填推薦裝備'}</p>
 {matches.map(g=><div key={g.label}><h4>{g.label}</h4><div className="verified-gear-grid">{g.names.map(name=>{const item=atlas.find(a=>a.name===name);return item?<figure key={name}><a href={imagePath(item.image)} target="_blank" rel="noreferrer" aria-label={'放大裝備圖片：'+item.name}><img src={imagePath(item.image)} alt={item.name} loading="lazy"/></a><figcaption>{item.name}</figcaption></figure>:null})}</div></div>)}
 {!matches.length&&r.equipment&&<p className="caption">目前只顯示原表文字；尚未確認圖片對應，不用相似圖示代替。</p>}
 {/加費/.test(r.equipment)&&<p className="caption">「加費套」的具體圖片對應待確認，未以瑪娜套代替。</p>}
 <a href={r.source} target="_blank" rel="noreferrer">原表來源：{r.sheet}第{r.row}列・{r.name} ↗</a></section>})}
 <details><summary>圖片來源與使用方式</summary><p className="caption">單品圖片與名稱出自4399陸服圖鑑，保留來源品名，並非台服官方裝備圖鑑。點圖片可放大。圖示是推薦目標，不代表你已持有；原表未明確區分PVE／PVP時，不自行宣稱兩者通用。僅展示已建立名稱對應的部分裝備，其餘以原表文字為準。</p><a href="https://a.4399.cn/lhlr/tools/collection" target="_blank" rel="noreferrer">具名裝備圖鑑 ↗</a></details>
 </section>
}
