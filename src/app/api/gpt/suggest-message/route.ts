import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  // 仮の返答（OpenAI連携は未実装）
  return NextResponse.json({ message: "これはGPTのサンプル提案です。あなたの挑戦を応援しています！" });
} 