import { NextRequest, NextResponse } from 'next/server';
import { HospitalInput, HospitalApiResponse, ApiResponse } from '@/types';
import connectToDatabase from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const input: HospitalInput = await request.json();
    
    const hospital = await Hospital.findByIdAndUpdate(
      context.params.id,
      input,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return NextResponse.json(
        { success: false, error: 'Hospital not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: hospital },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update hospital' },
      { status: 500 }
    );
  }
}