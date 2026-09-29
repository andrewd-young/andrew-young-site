import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Andrew Young — Software Engineer',description:'Software engineer at Notability. Building thoughtful interfaces, integrations, and the systems behind them. Based in San Francisco.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
