import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export async function generateMetadata():Promise<Metadata>{const requestHeaders=await headers();const host=requestHeaders.get("x-forwarded-host")||requestHeaders.get("host")||"localhost:3000";const protocol=requestHeaders.get("x-forwarded-proto")||"http";const origin=`${protocol}://${host}`;return {metadataBase:new URL(origin),title:{default:"Voxora",template:"%s · Voxora"},description:"Transform PDFs into editable text and natural audio.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},openGraph:{title:"Voxora — Your documents, finally accessible.",description:"Turn PDFs into editable text and natural audio.",images:[{url:`${origin}/og.png`,width:1536,height:896,alt:"Voxora document workspace"}]},twitter:{card:"summary_large_image",title:"Voxora — Your documents, finally accessible.",description:"Turn PDFs into editable text and natural audio.",images:[`${origin}/og.png`]}}}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>}
