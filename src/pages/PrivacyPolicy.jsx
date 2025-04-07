import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h1 className="mb-4 text-center">Privacy Policy</h1>

          <p className="mb-3">
            We value your privacy. This policy describes how we collect, use, and protect your personal information.
          </p>

          <h4 className="mt-4 mb-2">1. Information We Collect</h4>
          <p className="mb-3">
            We may collect details such as your name, email address, phone number, and other relevant information when you interact with our services.
          </p>

          <h4 className="mt-4 mb-2">2. How We Use Your Information</h4>
          <p className="mb-3">
            The data is used to improve user experience, personalize content, and provide important updates. We do not sell or share your data without consent.
          </p>

          <h4 className="mt-4 mb-2">3. Security</h4>
          <p className="mb-3">
            We use industry-standard security measures to protect your information from unauthorized access.
          </p>

          <h4 className="mt-4 mb-2">4. Cookies</h4>
          <p className="mb-3">
            We may use cookies to improve our site functionality. You can disable them through your browser settings.
          </p>

          <h4 className="mt-4 mb-2">5. Changes to this Policy</h4>
          <p className="mb-3">
            We may update this policy occasionally. Please check back periodically for changes.
          </p>

          <p className="mt-4">
            For any concerns, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
