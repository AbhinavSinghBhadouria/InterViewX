import Footer from '@/src/components/ui/Footer'
import Header from '@/src/components/ui/Header'
import { ReactNode } from 'react'
import Providers from './Providers'



const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <div className="root-layout">
  
     <Header/>
        <Providers>
         {children}
      </Providers>
      <Footer/>
    </div>
  )
}

export default RootLayout
