import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function GET() {
  try {
    await connectToDatabase();
    const hospitals = await Hospital.find({}).sort({ createdAt: -1 });
    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const hospital = await Hospital.create(body);
    return NextResponse.json(hospital);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}