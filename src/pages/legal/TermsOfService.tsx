import React from 'react';
import { FileText, Mail, AlertTriangle, Scale, Gavel } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-sm rounded-2xl border border-gray-100 my-8">
      <div className="border-b border-gray-100 pb-8 mb-8">
        <div className="flex items-center space-x-3 text-blue-600 mb-4">
          <Scale size={32} />
          <span className="font-bold text-sm tracking-wider uppercase">Legal Document</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500">Last Updated: January 28, 2026</p>
      </div>

      <div className="prose prose-blue max-w-none space-y-12 text-gray-600">
        
        {/* Agreement */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Gavel className="mr-3 text-blue-500" size={24} /> 1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the ComplianceDaddy™ application and services, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        {/* Use of Service */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
          <p className="mb-4">
            ComplianceDaddy™ is a compliance management tool for the hospitality industry. You agree to use the service only for lawful purposes 
            and in accordance with these Terms.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        {/* AI Disclaimer */}
        <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
          <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <AlertTriangle className="mr-3" size={24} /> 3. AI Advisory Disclaimer
          </h2>
          <p className="text-yellow-900 font-medium mb-2">
            IMPORTANT: ComplianceDaddy™ is a software tool, not a legal expert or government official.
          </p>
          <p className="text-yellow-800">
            Our AI analysis and compliance checklists are provided for informational and organizational purposes only. 
            While we strive for accuracy based on standard FDA Food Codes and safety regulations:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-yellow-800">
            <li><strong>We do not guarantee</strong> that reliance on our Service will prevent legal violations, fines, or closures.</li>
            <li><strong>We are not a substitute</strong> for professional legal advice or official government inspections.</li>
            <li><strong>You are solely responsible</strong> for ensuring your venue complies with all local, state, and federal laws.</li>
          </ul>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall ComplianceDaddy™, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="mr-3" size={24} /> Contact Information
          </h2>
          <p className="text-gray-600 mb-4">
            For legal inquiries or questions regarding these Terms, please contact us:
          </p>
          <div className="font-medium text-gray-900">
            <p>ComplianceDaddy™ Legal Department</p>
            <p>Email: <a href="mailto:legal@compliancedaddy.com" className="underline hover:text-blue-600">legal@compliancedaddy.com</a></p>
            <p>General Inquiries: <a href="mailto:support@compliancedaddy.com" className="underline hover:text-blue-600">support@compliancedaddy.com</a></p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default TermsOfService;
