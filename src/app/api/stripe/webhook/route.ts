import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { stripe } from "@/src/lib/stripe";
import clientPromise from "@/src/lib/mongodb";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const runtime = "nodejs"; // otherwise signature verification will fail

export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db();

  const body = await request.text();
  //to keep the check that only the stripe is sending us the request
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook's signature verification failed", err);
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {

        const session = event.data.object as Stripe.Checkout.Session;
        //this was sent as metadata by us during the checkout session creation
        let userId = session.metadata?.userId;
        let priceId = session.metadata?.priceId;

        // stripe may send customer as string id or expanded object
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as Stripe.Customer)?.id;


        //  resolvind user by stripe customer id or customer email
        if (!userId && customerId) {

          //finding the user my customerId
          const userByCustomer = await db.collection("users").findOne({
            stripeCustomerId: customerId,  //setting the stripe customerid
          });


          if (userByCustomer) {
            userId = (userByCustomer._id as ObjectId).toString();
          } else {


            // stripeCustomerId might not be in the db  , then find the customer by his email
            const customer = await stripe.customers.retrieve(customerId);

            if (!customer.deleted && customer.email) {
              const userByEmail = await db.collection("users").findOne({
                email: customer.email,  //finding the user in the db by using customer email
              });

              if (userByEmail) {

                userId = (userByEmail._id as ObjectId).toString();
                // saving the stripe customer id for future transactions
                await db.collection("users").updateOne(
                  { _id: userByEmail._id },
                  { $set: { stripeCustomerId: customerId } }
                );
              }
            }   
          }
        }

        if (!priceId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const pid = sub.items.data[0]?.price?.id;
          if (pid === process.env.STRIPE_YEARLY_PRICE_ID) priceId = "yearly";
          else if (pid === process.env.STRIPE_MONTHLY_PRICE_ID) priceId = "monthly";
        }

        if (userId && priceId) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const result = await db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                subscriptionStart: new Date(
                  subscription.items.data[0].current_period_start * 1000
                ),
                subscriptionEnd: new Date(
                  subscription.items.data[0].current_period_end * 1000
                ),
                subscriptionPeriod: priceId === "monthly" ? "monthly" : "yearly",
                plan: "premium",
              },
            }
          );
         
        }
        break;
      }

      case "customer.subscription.created":


      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : (subscription.customer as Stripe.Customer)?.id;


        let user = stripeCustomerId
          ? await db.collection("users").findOne({ stripeCustomerId })
          : null;

        if (!user && stripeCustomerId) {  //if the user with this stripecustomer id does not exist in the db  , then create one
          const customer = await stripe.customers.retrieve(stripeCustomerId);

          if (!customer.deleted && customer.email) {  //finding the user with email
              user = await db.collection("users").findOne({
              email: customer.email,
            });

            if (user) { //setting the stripe customer id
              await db.collection("users").updateOne(
                { _id: user._id },
                { $set: { stripeCustomerId } }
              );
            }
          }
        }

        const priceId = subscription.items.data[0].price.id;
        let subscriptionPeriod: "monthly" | "yearly" = "monthly";
        if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
          subscriptionPeriod = "yearly";
        } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
          subscriptionPeriod = "monthly";
        }
        

        if (user) {
          await db.collection("users").updateOne(
            { _id: user._id },
            {
              $set: {
                subscriptionStart: new Date(
                  subscription.items.data[0].current_period_start * 1000
                ),
                subscriptionEnd: new Date(
                  subscription.items.data[0].current_period_end * 1000
                ),
                subscriptionPeriod,
                plan:
                  subscription.status === "active" ? "premium" : "free",
              },
            }
          );
        } else if (stripeCustomerId) {
          console.error(
            "customer.subscription: No user found for stripeCustomerId",
            stripeCustomerId
          );
        }
        break;
      }



      case "customer.subscription.deleted": { //if the user deletes his subscription

        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : (subscription.customer as Stripe.Customer)?.id;

        let user = stripeCustomerId
          ? await db.collection("users").findOne({ stripeCustomerId })
          : null;

        if (!user && stripeCustomerId) {
          const customer = await stripe.customers.retrieve(stripeCustomerId);
          if (!customer.deleted && customer.email) {
            user = await db.collection("users").findOne({
              email: customer.email,
            });
          }
        }

        if (user) {
          await db.collection("users").updateOne(
            { _id: user._id },
            {
              $set: {
                subscriptionStart: null,
                subscriptionEnd: null,
                subscriptionPeriod: null,
                plan: "free",
              },
            }
          );
        }
        break;
      }

      default:
        console.log(`unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook", err);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}