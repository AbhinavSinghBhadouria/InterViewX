"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

//fucntion to be executed when the user clicks the free card on payment dashboard
export async function handleFreeAccess(){
 
    const session=await getServerSession(authOptions);

     //allowing only the admin i.e Amber Hasan to access the VAPI as it is paid 
      const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAILc

    if (isAdmin) {
      redirect("/");
 
       }

   return {
    restricted: true,
    message:
      "This feature is restricted for public use by the admin and is available in demo only.",
  };
  
}