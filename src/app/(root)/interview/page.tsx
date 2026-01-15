
import Agent from '@/src/components/Agent'
import { getCurrentUser } from '@/src/models/User'



const page = async() => {

  const user = await getCurrentUser();
  console.log(user);
  if(!user) return null;
  return (
   <div className="min-h-screen flex flex-col items-center w-full p-5">
   <div className="text-5xl font-bold mt-10 mb-10">Interview Generation</div>
   <Agent userName={user?.name} userId={user?._id.toString()} type="generate"/>
   </div>
  )
}

export default page
