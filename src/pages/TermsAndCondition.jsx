import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndCondition = () => {
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
          <h1 className="mb-4 text-center">Terms and Conditions</h1>

          <p className="mb-3">
            By using our services, you agree to comply with these terms and conditions.
          </p>

          <h4 className="mt-4 mb-2">1. Acceptance of Terms</h4>
          <p className="mb-3">
            Accessing or using our services indicates your agreement to these terms. If you do not agree, please do not use the service.
          </p>

          <h4 className="mt-4 mb-2">2. Use of Service</h4>
          <p className="mb-3">
            You agree to use our services legally and responsibly. Any misuse may result in account termination.
          </p>

          <h4 className="mt-4 mb-2">3. Intellectual Property</h4>
          <p className="mb-3">
            All content and materials are our intellectual property and may not be reused without permission.
          </p>

          <h4 className="mt-4 mb-2">4. Termination</h4>
          <p className="mb-3">
            We reserve the right to suspend or terminate your access if these terms are violated.
          </p>

          <h4 className="mt-4 mb-2">5. Governing Law</h4>
          <p className="mb-3">
            These terms are governed by the laws of [Your Country or State].
          </p>

          <p className="mt-4">
            If you have questions, please email <a href="mailto:support@example.com">support@example.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;
