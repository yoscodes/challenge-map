import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, planType, message, targetUser } = await req.json();
    if (!amount || !planType || !targetUser) {
      return NextResponse.json({ error: '必要な情報が不足しています' }, { status: 400 });
    }

    // Stripeの最小単位は「円」なら1円単位
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: planType === 'monthly' ? '月額継続支援' : '単発支援',
              description: message || undefined,
            },
            unit_amount: amount,
            recurring: planType === 'monthly' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: planType === 'monthly' ? 'subscription' : 'payment',
      success_url: `${req.nextUrl.origin}/support/success`,
      cancel_url: `${req.nextUrl.origin}/support/cancel`,
      metadata: {
        message: message || '',
        planType,
        supporter_id: req.headers.get('x-supporter-id') || '',
        supported_user_id: targetUser,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripeエラー:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 