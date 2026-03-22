"use server"

import FreePlanBtn from '@/src/components/FreePlanBtn';
import CheckoutButton from '@/src/components/CheckoutButton';
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/models/User';


enum PopularPlanType {
	NO = 0,
	YES = 1,
}

interface PricingProps {
	title: string;
	popular: PopularPlanType;
	price: number;
	description: string;
	buttonText: string;
	benefitList: string[];
	href: string;
	billing: string;
	paymentLink?: string;
	priceId?: 'monthly' | 'yearly';
}
const page = async() => {

  

  //when we are coming to this page we will check if the user is already subsribed to this plan or not
  //if he is already subsribed to a plan we will show him the billing button where he can update or cancel his plan



  const user=await getCurrentUser();
  if(!user) return null;


  //is the user is already subscribed then show him the billing page
  
  if(user?.plan=="premium"){
    redirect("/tools/payement/subscription");
  }

   const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description: "Try InterviewX with limited access and experience AI-powered mock interviews.",
    buttonText: "Get Started",
    benefitList: [
      "Limited AI mock interviews",
      "Basic interview questions",
      "Standard AI feedback",
      "Community support",
      "Upgrade anytime"
    ],
    href:"/",
    billing: "/month",
  },
  {
    title: "Monthly",
    popular: 1,
    price: 10,
    description: "Unlimited AI mock interviews for a full month. Perfect for focused interview prep.",
    buttonText: "Buy Now",
    benefitList: [
      "Unlimited AI mock interviews",
      "Real-time AI interviewer",
      "Detailed performance feedback",
      "Interview history with feedback",
      "Priority support"
    ],
    href: "/api/auth/login",
    priceId: "monthly",
    billing: "/month",
  },
  {
    title: "Yearly",
    popular: 0,
    price: 99,
    description: "Unlimited AI mock interviews for a full year at the best value.",
    buttonText: "Buy Now",
    benefitList: [
      "Unlimited AI mock interviews",
      "Access for 12 months",
      "Advanced AI feedback & insights",
      "Interview history with feedbacks",
      "Priority support"
    ],
    href: "/api/auth/login",
    priceId: "yearly",
    billing: "/year",
  },
];


   
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden flex-col space-y-30">
        <div>
       <Link href={"/authenticatedLandingPage"}>
            <Button variant="link" className="gap-2 pl-0 cursor-pointer">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
        </Link> 
        </div>
<div className="flex justify-center items-center">
        <div className="orbs-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="orb" />
        ))}
      </div>

    <div className="relative z-10 flex flex-wrap justify-center gap-13 px-6">
    {pricingList.map((plan, index) => (
    <div
      key={index}
      className={`card w-[350px] ${
        plan.popular
          ? "border-blue-500 shadow-blue-500/40 scale-105"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="card-title">{plan.title}</h2>
        {plan.popular === 1 && (
          <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">
            Most Popular
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-gray-400 ml-1">{plan.billing}</span>
      </div>

      {/* Description */}
      <p className="card-description mb-6">
        {plan.description}
      </p>

      {/* Benefits */}
      <ul className="space-y-3 mb-8">
        {plan.benefitList.map((benefit, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-300">
            <span className="text-blue-400">✔</span>
            {benefit}
          </li>
        ))}
      </ul>

      {/* CTA */}
     {plan.title === "Free" ? (
  <FreePlanBtn />
) : plan.priceId ? (
  <CheckoutButton
    priceId={plan.priceId}
    buttonText={plan.buttonText}
    className="block w-full text-center rounded-xl py-3 font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
  />
) : (
  <a
    href={plan.paymentLink || plan.href}
    className="block text-center rounded-xl py-3 font-semibold bg-blue-600 hover:bg-blue-700"
  >
    {plan.buttonText}
  </a>
)}
    </div>
   
  ))}
</div>
 </div>



     {/* Styles */}
      <style>{`
      

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
;

       
       

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

      
        .card-title {
          font-size: 26px;
          color: #60a5fa;
        }

        .card-description {
          color: #9ca3af;
          line-height: 1.6;
        }

       
      `}</style>
    </div>
  )
}

export default page
