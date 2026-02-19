"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


//this function will be called when the user clicks the start chat button on the chat dashboard
export async function startChat(){

    const session = await getServerSession(authOptions);

    //id from mongodb
   const authUserId = session?.user._id;


   //getting the id of the user from prisma
   const dbUser = await db.user.findUnique({
  where: {
    authUserId,
  },
});

if (!dbUser) {
  throw new Error("User not found in database");
}
     

    //now create the chat in the database  , the content is empty only the chat id is created

    const chat= await db.chat.create({

        data:{
            userId:dbUser.id ,  //prisma user id
        } ,
    });

    redirect(`/ai-chat/${chat.id}`);
  }

  //-----------------------------------------------------------------------------------------------------------------------------
  
  export async function deleteAllChats(){
  const session = await getServerSession(authOptions);

    //id from mongodb
   const authUserId = session?.user._id;


   //getting the id of the user from prisma
   const dbUser = await db.user.findUnique({
  where: {
    authUserId,
  },
});

if (!dbUser) {
  throw new Error("User not found in database");
}

await db.chat.deleteMany({
  where:{
    userId:dbUser.id ,
  }
});
   //after deleting the chats we need to revalidate the cache of the chat dashboard page so that the user can see the updated list of chats
  revalidatePath("/ai-chat/history");
 return { success: true };
  }


