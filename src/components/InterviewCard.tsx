import dayjs from "dayjs"
import Image from 'next/image';
import { getRandomInterviewCover } from '../lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { InterviewCardProps } from '../types';
import { getFeedbackByInterviewId } from '../lib/action';
import { getServerSession } from 'next-auth';
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import ViewInterviewButton from "./ViewInterviewButton";


const InterviewCard = async({interviewId , userId , role , type , techstack , createdAt}: InterviewCardProps) => {

  const feedback=userId && interviewId ? await getFeedbackByInterviewId({interviewId , userId }): null ;
  const normalizedType= /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate=dayjs(feedback?.createdAt || createdAt?.toString() || Date.now()).format("DD/MM/YYYY");


  const session = await getServerSession(authOptions);
  const sessionUserId= session?.user?._id;

  const isOwner= (sessionUserId==userId) && Boolean(feedback);

  return (
    <div className="card-border w-90 max-sm:w-full min-h-96 m-3 bg-[#0B0F24] 
         cursor-pointer transition-all duration-300 
            hover:-translate-y-2 
            hover:shadow-[0_0_25px_5px_rgba(56,189,248,0.35)] 
            rounded-2xl">
        <div className="card-interview">
            <div>
                <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-blue-950">
                    <p className="badge-text">{normalizedType}</p>
                </div>

                <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full object-fit size-[90px]"/>
                <h3 className="mt-5 capitalize">
                 {role} Interview
                </h3>
                <div className="flex flex-row gap-5 mt-3">
                  <div className="flex flex-row gap-2">
                    <Image src="/calendar.svg" alt="calender" width={22} height={22} />
                    <p>{formattedDate}</p>
                  </div>

                 


                </div>

                <p className="line-clamp-2 mt-5">{feedback?.finalAssessment || "You’re just one step away! Take the interview now and level up your skills."}</p>
            </div>

            <div>
              <div className="flex flex-row justify-between">
              <DisplayTechIcons techStack={techstack}/>
               
              <ViewInterviewButton interviewId={interviewId} isOwner={isOwner} />
              </div>
            </div>
        </div>
      
    </div>
  )
}

export default InterviewCard

