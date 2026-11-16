import './globals.css';
import type { Metadata } from 'next';
import UITheme from '@/components/UITheme';
export const metadata: Metadata = {title:'VNU LIFE MAP · Khám phá khuôn viên',description:'Bản đồ không gian sinh viên VNU. Dữ liệu minh bạch, từng bước xác minh.'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="vi"><body><UITheme>{children}</UITheme></body></html>; }
