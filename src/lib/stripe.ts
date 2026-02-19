import Stripe from "stripe"

export const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)

export const NEXT_PUBLIC_STRIPE_PUBLIC_KEY=process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

export const STRIPE_PRICE_IDS={
    monthly:"price_1SyPXmHbwmM6RxpyXXMUd0BO",
    yearly:"price_1SyVEPHbwmM6Rxpya3T2nwxh"
}as const

export type StripePriceId= keyof typeof STRIPE_PRICE_IDS

