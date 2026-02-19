"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, LogOut, PenBox, StarsIcon ,Bot } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation";


const HEADER_HEIGHT = "h-16";


const ToolsHeader =() => {

  
const router = useRouter();

     const[loggingOut , setIsLoggingOut]=useState(false);
    
      const logout= async():Promise<void>=>{
       setIsLoggingOut(true);
       await signOut({callbackUrl:"/landingPage?loggedOut=true"}); //sending a query as well so that i can display the toast message on the main page
      
      }
  
  return (
    <>
     <div className="fixed top-0 h-16 w-full bg-black/20 flex justify-between px-3 py-2 text-lg font-bold z-50 backdrop-blur-md border border-2px-solid-white">

        <Link href="#" className="flex items-center gap-2 m-2">
        <Image src="/InterviewXlogo.png" alt="Logo" height={32} width={38} ></Image>
        <h2 className="text-primary-100">InterviewX</h2>
        </Link>


        <div className="gap-2">
           <Link href="/tools/dashboard" >
           <Button className="mr-4 btn-primary">
               <LayoutDashboard className="h-4 w-4"></LayoutDashboard>
                Industry Analytics 
            </Button>
            </Link>


    <DropdownMenu >
   <DropdownMenuTrigger asChild>
    <Button className="btn-secondary">
        <StarsIcon className="h-4 w-4"/>
         Career Toolkit
         <ChevronDown className="h-4 w-4"/>
    </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent>
   

   <DropdownMenuItem
  onSelect={() => router.push("/tools/ai-resume")}
  className="bg-black m-1 flex items-center gap-2 cursor-pointer"
>
  <FileText className="w-4 h-4" />
  Build Resume
</DropdownMenuItem>

<DropdownMenuItem
  onSelect={() => router.push("/tools/interview-prep")}
  className="bg-black m-1 flex items-center gap-2 cursor-pointer"
>     <GraduationCap className="h-4 w-4" />
        MCQ Practice
    
    </DropdownMenuItem>

<DropdownMenuItem
  onSelect={() => router.push("/tools/ai-chat-dashboard")}
  className="bg-black m-1 flex items-center gap-2 cursor-pointer"
>     <Bot className="h-4 w-4" />
        AI Career Coach
    
    </DropdownMenuItem>

  
  </DropdownMenuContent>
</DropdownMenu>
       
       
    

     <Button
       className="
     inline-flex items-center justify-center
     px-5 py-2.5 rounded-xl font-semibold
     bg-linear-to-r from-red-600 to-pink-600
    text-white shadow-lg shadow-red-500/30
    hover:from-red-500 hover:to-pink-500
    hover:shadow-red-500/45
    active:scale-[0.97]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ml-2
  "
        onClick={logout}>
       
        {
          loggingOut?(
             <>
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      Logging out...
     </>
     )
     : (
       <>
      <LogOut className="h-4 w-4 mr-2" />
      <p className="text-sm">Logout</p> 
     </>
      )}
       
        </Button>

       </div>

    </div>

        {/* Spacer to push content down */}
       <div className={HEADER_HEIGHT} />

    </>
    
  )
}

export default ToolsHeader;
