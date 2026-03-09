"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";




export default function InterviewXDashboard() {
  const router = useRouter();
 
  

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>(".card");

    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = "all 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100 * index);
    });
  }, []);

  //function when we click the interviewX tools card

  const handleClick=()=>{

    

      toast.success("Redirecting to InterviewX Carrier Tools..");
      router.push("/tools/onboarding")
 }



  //function when we click the VAPI interview card
 const handleClick1=()=>{
  


  //first of all we will check the status of the user , if he is not premium user then direct him to payment dashboard
  //if he is a premium user then check whether he is admin or not, if he is then direct him to landing page of mock interview
  //otherwise show him the msg that the payment has been made successfull but the admin of this website has restricted this feature from public use as VAPI credentials are paid
    router.push("/payement/dashboard")
    toast.success("Redirecting to InterviewX's Premium feature.");




 }

  return (
   
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Orbs */}
      <div className="orbs-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="orb" />
        ))}
      </div>
      
{/*       
          <Header/> */}

      <div className="container pt-24 z-10">
       
      

        {/* Title */}
      
        <div className="main-content">
          <h1 className="font-bold text-white text-6xl mb-2 shimmer-text">Choose Your Path</h1>
          <p className="text-2xl mt-3 text-white">Select an option to begin your journey</p>
        </div>

        {/* Cards */}

       
        <div className="cards-container">
          <div className="card" onClick={handleClick1}>
          <div className="flex justify-between items-center">
 <div className="text-4xl mb-4">🎤</div>
 <div className="bg-yellow-300 p-4 font-bold hover:bg-yellow-600 text-red-600 rounded lg m-2">Premium</div>

 </div>

            <h2 className="text-2xl font-semibold text-blue-400 mb-3">
              AI-Powered Mock Interview
            </h2>

            <p className="text-gray-400 leading-relaxed mb-5">
              Experience real interview simulations with an AI interviewer.
              Answer role-specific questions and get instant feedback on
              confidence, clarity, and technical depth.
            </p>

            <ul className="text-sm text-gray-400 space-y-1">
              <li> Voice based interviews</li>
              <li> Role-specific questions</li>
              <li> Real-time AI feedback</li>
            </ul>    
         </div>

          

          <div className="card" onClick={handleClick}>
              <div className="text-4xl mb-4">📊</div>

            <h2 className="text-2xl font-semibold text-blue-400 mb-3">
              InterviewX Career Tools
            </h2>

            <p className="text-gray-400 leading-relaxed mb-5">
              Build professional resumes, practice AI-powered mock interviews, and take role-based MCQ assessments, all enhanced with intelligent feedback.
            </p>

            <ul className="text-sm text-gray-400 space-y-1">
               <li> Industry Analytics</li>
               <li>AI Career ChatBot</li>
               <li> AI Resume Studio</li>
              <li> MCQ Mock Interview Practice</li>
              <li>AI Career Roadmap Generator</li>
            </ul>
          </div>
        </div>

        </div>

       
        <div className=" mt-20 flex flex-col justify-center items-center mb-30 ">
            <div>
          <h2 className="font-bold mb-4">Ready to Ace Your Next Interview?</h2>
          </div>
           <div>
          <p className="text-xl text-white mb-20">
            Join thousands of professionals using InterviewX to land their
            dream job.
          </p>
          </div>
        </div>
          {/* <Footer/> */}
      

      {/* Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #000;
          color: white;
          padding: 40px 20px;
          position: relative;
          overflow-x: hidden;
        }

        .orbs-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(59, 130, 246, 0.4),
            rgba(37, 99, 235, 0.1)
          );
          filter: blur(40px);
          animation: float 25s linear infinite;
        }

        .orb:nth-child(1) {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
        }

        .orb:nth-child(2) {
          width: 200px;
          height: 200px;
          top: 60%;
          left: 70%;
        }

        .orb:nth-child(3) {
          width: 250px;
          height: 250px;
          top: 30%;
          right: 10%;
        }

        .orb:nth-child(4) {
          width: 180px;
          height: 180px;
          bottom: 20%;
          left: 30%;
        }

        .orb:nth-child(5) {
          width: 220px;
          height: 220px;
          top: 50%;
          left: 50%;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(80px, -60px);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: auto;
        }

        header {
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          gap: 12px;
          font-size: 28px;
          font-weight: bold;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f97316, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: grid;
          place-items: center;
        }

        .main-content {
          text-align: center;
          margin-bottom: 60px;
        }


        .subtitle {
          color: #8b9caf;
          font-size: 20px;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .card {
          background: rgba(20, 28, 45, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 26px;
          color: #60a5fa;
        }

        .card-description {
          color: #9ca3af;
          line-height: 1.6;
        }

        .footer-text {
          text-align: center;
          margin-top: 80px;
        }
      `}</style>

      
        

    </div>
   

  );
}
