import { getFeedbackByInterviewId, getInterviewById } from '@/src/lib/action';
import { getCurrentUser } from '@/src/models/User';
import { RouteParams } from '@/src/types'
import { redirect } from "next/navigation";
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import dayjs from "dayjs"


const page = async ({params} : RouteParams) => {
 

  const {id}= await  params;
  const user = await getCurrentUser();

  //if the user not found than redirect him to login
  if (!user) redirect("/login");

  const interview = await getInterviewById(id);
  if(!interview) redirect("/");

  //getting the feedback from the database
  const feedback= await getFeedbackByInterviewId({
    interviewId:id ,
    userId: user._id.toString()
  });

  console.log(feedback);

   if (!feedback) {
  return (
    <section className="section-feedback">
      <p className="text-center">
        Feedback is not available yet. Please try again later.
      </p>
    </section>
  );
}
  
 return (
   

     <section className="section-feedback p-10 min-h-screen">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
        

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        
      </div>

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>


      <div className="buttons">

        <Button className="btn-secondary flex-1 cursor-pointer">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-secondary flex-1 cursor-pointer">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>


    </section>
  )
}

export default page

