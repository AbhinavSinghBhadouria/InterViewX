import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import clientPromise from "@/src/lib/mongodb";
import { getCurrentUser } from "@/src/models/User";
import { STRIPE_PRICE_IDS } from "@/src/lib/stripe";
import { ObjectId } from "mongodb";


export async function POST(request: NextRequest){

    const client = await clientPromise; //mongodb client
    const db = client.db();
    try{
       
    
        //finding out the user info from mongodb
        const user=await getCurrentUser();

        if(!user) return NextResponse.json(

          {error:"User not found in db"} ,
          {status: 404}
        )

        const {priceId}=await request.json();
        if(!priceId){

            return NextResponse.json(
                { error:"Invalid price Id" } ,
                { status:500}
        )}

        //checking if the user already has the customer id or not
        let customerId=user?.stripeCustomerId;


        //creating the customerId
        if(!customerId){
            const customer= await stripe.customers.create({
                email:user.email  ,
                metadata:{
                    userId: user.id ,
                } ,
            })

            customerId=customer.id;

           
            await db.collection("users").updateOne(
                { _id: new ObjectId( user._id) },
                { $set: { stripeCustomerId: customerId } }
            )
        }

        const baseUrl = process.env.NEXT_PUBLIC_URL! ;
           

        const checkoutSession=await stripe.checkout.sessions.create({
            customer: customerId ,
            payment_method_types:["card"] ,
            line_items:[
                {
                    price: STRIPE_PRICE_IDS[priceId as keyof typeof STRIPE_PRICE_IDS]  ,
                    quantity:1

                }
            ] ,
            mode:"subscription" ,
            success_url: `${baseUrl}/payement/subscription`,
            cancel_url: `${baseUrl}/payement/dashboard`,

            //storing the metadata in the checkout session
            metadata: {
                userId: user._id.toString(),
                priceId: priceId,
            },
            //storing the metadata in the subscription data because when the checkout sesssion is completed then the subscription will be created and we can access the metadata from the subscription object
            //the session object is created only once the payment is successful and then the subscription object is created and we can access the metadata from the subscription object
            subscription_data: {
                metadata: {
                    userId: user._id.toString(),
                    priceId: priceId,
                },
            },
        })
    
 return NextResponse.json({ url: checkoutSession.url });
    }catch(err){

      console.error("Error creating checkout session" , err);
      return NextResponse.json(
        {error : "Failed to create checkout session"} ,
        {status :500}
      )

    }

}