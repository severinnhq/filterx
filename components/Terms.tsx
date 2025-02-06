import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By installing and using the FilterX extension, you agree to these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">2. Service Description</h2>
              <p className="text-gray-600">
                FilterX is a browser extension that filters content on X (formerly Twitter) based on user-defined keywords. We provide this service on a subscription basis.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">3. Subscription and Payments</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Subscription fees are charged according to the plan you select</li>
                <li>Payments are processed securely through our payment provider</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Refunds are provided in accordance with our refund policy</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">4. User Responsibilities</h2>
              <p className="text-gray-600">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not attempt to circumvent or modify the extension</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">5. Limitations of Service</h2>
              <p className="text-gray-600">
                FilterX is provided "as is" without warranties of any kind. We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>All content will be filtered according to your preferences</li>
                <li>The service will be compatible with future X updates</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">6. Termination</h2>
              <p className="text-gray-600">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any violation of these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">7. Changes to Terms</h2>
              <p className="text-gray-600">
                We may modify these terms at any time. Continued use of FilterX after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">8. Contact</h2>
              <p className="text-gray-600">
                For any questions regarding these terms, please contact us at filterxhq@gmail.com
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

export default TermsOfService;