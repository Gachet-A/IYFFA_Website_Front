import React from 'react';

const ThankYouCotisation: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Thank You for Renewing Your Membership!</h1>
    <p className="text-lg text-[#FEF7CD] mb-6">
      Your membership renewal has been processed successfully.<br />
      A confirmation email and your receipt have been sent to you.<br />
      We are grateful for your continued support!
    </p>
    
    <a href="/dashboard" className="inline-block bg-[#1EAEDB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1EAEDB]/90 transition">Go to Dashboard</a>
  </div>
);

export default ThankYouCotisation; 