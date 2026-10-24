type Entry={owned:boolean;star:string;note:string;confirmed?:boolean;latestReview?:string};
type Roster=Record<string,Entry>;
/** Apply an imported baseline only where the browser still matches the previous baseline. */
export function reconcileRoster(saved:Roster,previous:Roster,current:Roster):Roster{
 if(!saved||typeof saved!=='object'||Array.isArray(saved))throw Error('Invalid roster');
 const next={...saved};
 for(const [id,value] of Object.entries(current)){
  const local=saved[id],base=previous[id];
  if(!local){next[id]={...value};continue;}
  if(base&&Object.keys(local).length===Object.keys(base).length&&Object.entries(base).every(([key,value])=>local[key as keyof Entry]===value)){next[id]={...value};}
 }
 return next;
}
