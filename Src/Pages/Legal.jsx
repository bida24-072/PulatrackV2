import React from 'react';
import { Card } from '../components/ui';

export default function Legal() {
  const isTerms = window.location.pathname === '/terms';
  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-teal-700">{isTerms ? 'Terms and Conditions' : 'Privacy Policy'}</h1>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="text-gray-700 text-sm space-y-3">
          <p>Welcome to PulaTrack. By using our application, you agree to comply with and be bound by the following.</p>
          <p><strong>1. Data Storage:</strong> Your financial data is securely stored using Google Firebase. PulaTrack is designed for users in Botswana and defaults to the Botswana Pula (BWP).</p>
          <p><strong>2. Security:</strong> You are responsible for maintaining the confidentiality of your PIN and account credentials.</p>
          <p><strong>3. Biometrics:</strong> Local biometric/PIN locks execute entirely on your device.</p>
          <p>For support or data deletion requests, contact support@pulatrack.co.bw.</p>
        </div>
        <button onClick={() => window.history.back()} className="mt-6 text-teal-600 font-medium">← Go Back</button>
      </Card>
    </div>
  );
}
