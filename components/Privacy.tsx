import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">1. Information We Collect</h2>
              <p className="text-gray-600">
                FilterX collects and stores only the necessary information required to provide our content filtering service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Email address for account management and communication</li>
                <li>User-defined keywords for content filtering</li>
                <li>Payment information (processed securely through our payment provider)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use your information solely for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Providing and maintaining the FilterX service</li>
                <li>Processing your payments</li>
                <li>Sending important updates about our service</li>
                <li>Improving and optimizing our extension</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">3. Data Storage and Security</h2>
              <p className="text-gray-600">
                Your keywords and settings are stored securely in your browser using Chrome&apos;s storage API. We implement industry-standard security measures to protect your personal information and payment data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">4. Data Sharing</h2>
              <p className="text-gray-600">
                We do not sell, trade, or otherwise transfer your personal information to third parties. Your data is only used to provide the FilterX service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">5. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct any inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">6. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our Privacy Policy, please contact us at filterxhq@gmail.com
              </p>
            </section>

            <div className="text-sm text-gray-500 text-center pt-6">
              Last updated: February 6, 2025
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;