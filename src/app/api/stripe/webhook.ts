import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const amount = session.amount_total || 0;
    const plan_type = metadata.planType || '';
    const supporter_id = metadata.supporter_id || null;
    const supported_user_id = metadata.supported_user_id || null;
    const stripe_subscription_id = session.subscription || null;

    // DB保存
    const { error } = await supabase.from('supporters').insert([
      {
        supporter_id,
        supported_user_id,
        amount,
        plan_type,
        stripe_subscription_id,
      }
    ]);
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // 通知追加
    if (supporter_id && supported_user_id && supporter_id !== supported_user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('username')
        .eq('id', supporter_id)
        .single();
      const username = user?.username || '誰か';
      await supabase.from('notifications').insert([
        {
          user_id: supported_user_id,
          type: 'support',
          related_id: session.id,
          message: `${username}さんがあなたを支援しました`,
          is_read: false
        }
      ]);
    }
  }

  return NextResponse.json({ received: true });
} 