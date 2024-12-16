import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { openNow } = await request.json();
    
    await connectToDatabase();
    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      { openNow },
      { new: true }
    );

    if (!updatedHospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedHospital
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update status'
    }, { status: 500 });
  }
}