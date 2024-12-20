
import { NextRequest, NextResponse } from 'next/server';
import { HospitalInput, HospitalApiResponse, ApiResponse } from '@/types';
import connectToDatabase from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<HospitalApiResponse>> {
  try {
    const id = params.id;
    const input: HospitalInput = await request.json();
    
    await connectToDatabase();
    const hospital = await Hospital.findByIdAndUpdate(id, input, { new: true });
    
    if (!hospital) {
      return NextResponse.json({ 
        success: false, 
        error: 'Hospital not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: hospital 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const id = await params.id;
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Hospital ID is required'
      }, { status: 400 });
    }

    await connectToDatabase();
    const deletedHospital = await Hospital.findByIdAndDelete(id);

    if (!deletedHospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hospital deleted successfully'
    });

  } catch (error) {
    console.error('Delete hospital error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete hospital'
    }, { status: 500 });
  }
}