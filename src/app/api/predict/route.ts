import { NextRequest, NextResponse } from 'next/server';
import { predictHeartDisease, PatientInput } from '@/lib/modelPredictor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields validation
    const requiredKeys: (keyof PatientInput)[] = [
      'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
      'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
    ];

    for (const key of requiredKeys) {
      if (body[key] === undefined || body[key] === null || body[key] === '') {
        return NextResponse.json(
          { error: `Missing required clinical parameter: ${key}` },
          { status: 400 }
        );
      }
    }

    const patientData: PatientInput = {
      age: Number(body.age),
      sex: Number(body.sex),
      cp: Number(body.cp),
      trestbps: Number(body.trestbps),
      chol: Number(body.chol),
      fbs: Number(body.fbs),
      restecg: Number(body.restecg),
      thalach: Number(body.thalach),
      exang: Number(body.exang),
      oldpeak: Number(body.oldpeak),
      slope: Number(body.slope),
      ca: Number(body.ca),
      thal: Number(body.thal),
    };

    const result = predictHeartDisease(patientData);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      patient: patientData,
      ...result,
    });
  } catch (error: any) {
    console.error('Prediction API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process clinical prediction', details: error.message },
      { status: 500 }
    );
  }
}

