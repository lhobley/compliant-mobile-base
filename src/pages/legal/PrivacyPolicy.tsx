import React from 'react';
import { Shield, Mail, Lock, Eye, Server, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-sm rounded-2xl border border-gray-100 my-8">
      <div className="border-b border-gray-100 pb-8 mb-8">
        <div className="flex items-center space-x-3 text-blue-600 mb-4">
          <Shield size={32} />
          <span className="font-bold text-sm tracking-wider uppercase">Legal Document</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last Updated: January 28, 2026</p>
      </div>

      <div className="prose prose-blue max-w-none space-y-12 text-gray-600">
        
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Eye className="mr-3 text-blue-500" size={24} /> 1. Introduction
          </h2>
          <p>
            ComplianceDaddy™ ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our application 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        {/* Data Collection */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Server className="mr-3 text-blue-500" size={24} /> 2. Data We Collect
          </h2>
          <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and title.</li>
            <li><strong>Contact Data:</strong> includes billing address, email address and telephone numbers.</li>
            <li><strong>Business Data:</strong> includes venue names, locations, and operational details.</li>
            <li><strong>Compliance Data:</strong> includes audit logs, checklist completions, and uploaded photos/media for inspection analysis.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, and operating system and platform.</li>
          </ul>
        </section>

        {/* AI Usage */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Lock className="mr-3 text-blue-500" size={24} /> 3. AI Analysis & Media
          </h2>
          <p>
            Our service utilizes Artificial Intelligence (AI) to analyze photos you upload for compliance purposes (e.g., detecting health code violations). 
            By uploading images, you grant us permission to process these images through our AI providers. 
            <strong>We do not use your proprietary business photos to train public AI models</strong> without your explicit consent.
            Images are processed temporarily for analysis and stored securely in your private audit history.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-blue-50 p-8 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <Mail className="mr-3" size={24} /> Contact Us
          </h2>
          <p className="text-blue-800 mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us:
          </p>
          <div className="font-medium text-blue-900">
            <p>ComplianceDaddy™ Legal Team</p>
            <p>Email: <a href="mailto:privacy@compliancedaddy.com" className="underline hover:text-blue-700">privacy@compliancedaddy.com</a></p>
            <p>Support: <a href="mailto:support@compliancedaddy.com" className="underline hover:text-blue-700">support@compliancedaddy.com</a></p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
