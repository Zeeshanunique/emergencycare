import { NextRequest, NextResponse } from 'next/server';
import { HospitalInput, HospitalApiResponse, ApiResponse } from '@/types';
import connectToDatabase from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

type RouteParams = { params: { id: string } }

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const input: HospitalInput = await req.json();
    
    const hospital = await Hospital.findByIdAndUpdate(
      params.id,
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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = context.params;

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
