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
                <li>Email address for newsletter subscribers who opt in to "watch me recreate this with my co-founder"</li>
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
                <li>Improving and optimizing our extension</li>
                <li>Sending newsletter updates to users who have opted in to "watch me recreate this with my co-founder" to follow our entrepreneurial journey</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">3. Newsletter Subscription</h2>
              <p className="text-gray-600">
                During signup, users may opt in to our newsletter by selecting "also watch me recreate this with my co-founder." By checking this box, you agree to receive email updates about our entrepreneurial journey. You can unsubscribe from these communications at any time by clicking the "unsubscribe" link in our emails.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">4. Data Storage and Security</h2>
              <p className="text-gray-600">
                Your keywords and settings are stored securely in your browser using Chrome&apos;s storage API. We implement industry-standard security measures to protect your personal information and payment data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">5. Data Sharing</h2>
              <p className="text-gray-600">
                We do not sell, trade, or otherwise transfer your personal information to third parties. Your data is only used to provide the FilterX service and, if opted in, to send you newsletter updates about our entrepreneurial journey.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">6. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct any inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Unsubscribe from our newsletter at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">7. Contact Us</h2>
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