import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'龍魂旅人・作戰手帳',description:'台服角色圖鑑、官方公告、持有名單、多隊配置與養成規劃',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-Hant" className="dark"><body>{children}</body></html>}
