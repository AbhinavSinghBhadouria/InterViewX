"use server";


import { getCurrentUser } from "@/src/models/User";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Crown } from "lucide-react";
import { AlertTriangle } from "lucide-react";


type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const page = async ({ searchParams }: PageProps) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const params = await searchParams;
  const justPaid = typeof params?.session_id === "string";

  // Don't redirect away if user just landed from Stripe (webhook may not have run yet)
  if (user.plan === "free" && !justPaid) {
    redirect("/payement/dashboard");
  }

  return (
    <div className="min-h-scree p-6">

      {/* Back Button */}
      <Link href={"/authenticatedLandingPage"}>
        <div className="flex items-center gap font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </div>
      </Link>

      {/* Center Container */}
      <div className="flex justify-center mt-10">
        <div className="max-w-3xl space-y-6">

    
          {/* Success Card */}
          <div className="bg-muted/70 rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 h-16 w-16 mb-4" />

            <h1 className="text-3xl font-bold text-green-500">
              Payment Successful 🎉
            </h1>

            <p className="text-gray-600 mt-2">
              Hi <span className="font-semibold">{user?.name}</span>,  
              you have successfully subscribed to our "Premium Plan".
            </p>
            {
              user.email==process.env.NEXT_PUBLIC_ADMIN_EMAIL! &&  <div className="flex-col items-center">
              <div className="bg-yellow-400 text-white font-bold hover:bg-yellow-700 p-4 m-2 rounded-lg">
               <Link href={"/"}>Explore the premium feature</Link>
               </div>

                 {/* Billing Button */}
          <Link
            href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL ?? "#"}
          >
            <div className="bg-green-400 hover:bg-green-800 text-black text-center p-4 rounded-xl font-semibold shadow-lg cursor-pointer transition mt-4">
              Manage Billing & Subscription
            </div>
          </Link>
          </div>

            }
          </div>

          {/* Subscription Details */}
          <div className="bg-muted/70 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Crown className="text-yellow-500" />
              <h2 className="text-2xl font-bold text-yellow-500 ">
                Your Subscription Details
              </h2>
            </div>

            <div className="space-y-3 bg-muted/50 p-4 rounded-lg ml-2">
              <p>
                <span className="font-semibold text-yellow-300">Plan:</span>{" "}
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {user?.subscriptionPeriod}
                </span>
              </p>

              <p>
                <span className="font-semibold text-yellow-300">Start Date:</span>{" "}
                {user?.subscriptionStart?.toLocaleString()}
              </p>

              <p>
                <span className="font-semibold text-yellow-300">End Date:</span>{" "}
                {user?.subscriptionEnd?.toLocaleString()}
              </p>
            </div>
          </div>


          {/* Feature Locked Notice */}

      {user.email!=process.env.NEXT_PUBLIC_ADMIN_EMAIL! && 
       <div className="bg-muted/70 border-l-4 border-yellow-400 rounded-xl p-6 shadow">
            <div className="flex gap-3">
              <AlertTriangle className="text-red-500" />
              <div>
                <h3 className="font-bold text-red-400 text-lg">
                  Feature Currently Locked 🔒
                </h3>
                <p className="text-yellow-700 mt-2">
                  Even though you have successfully completed the payment,
                  this feature is <span className="text-red-500">not publicly enabled yet</span>.
                </p>

                <p className="text-yellow-700 mt-2">
                  The payment system is integrated using "Stripe Test Mode"
                  as part of the project demonstration.  
                  This shows the capability of supporting real payments in future.
                </p>

                <p className="text-yellow-700 mt-2 font-semibold">
                  — Admin
                </p>
              </div>
            </div>
          

        
        </div> }


      </div>
      </div>
    </div>
  );
};

export default page;