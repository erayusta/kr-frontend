
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import Header from './header'
import Footer from './footer'
import { Toaster } from '../ui/toaster'
import { useState } from 'react'
import BmwAdsLeft from '../common/BmwAdsLeft'
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Layout({children, menuItems}){
 const [isVisible, setVisible] = useState(true)

const handleCloseAdsModal = () => {
 setVisible(false)
}

 return(
   <main
     className={cn(
            "min-h-screen bg-[#FFFAF4] font-sans antialiased",
            fontSans.variable
          )}
    >   
    <Toaster />
   
    <div className="">
<Header  />
              <div>{children}</div>
              <Footer  />
              
            </div>

    </main> )
}