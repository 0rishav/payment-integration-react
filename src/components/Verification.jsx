import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useVerificationMutation } from "../redux/features/authApi";
import { useNavigate } from "react-router-dom";
import Loader from './Loader'; 

const Verification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [verification, { isLoading }] = useVerificationMutation();
  const navigate = useNavigate();

  const activationToken = localStorage.getItem("activation_token");

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length === 4 && activationToken) {
      try {
        const response = await verification({ 
          activation_token: activationToken, 
          activation_code: otpValue 
        }).unwrap();

        if (response.success) {
          toast.success(response.message || 'OTP verified successfully!');
          navigate("/login");
        } else {
          toast.error(response.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        toast.error(error.data?.message || 'Verification failed. Please try again.');
      }
    } else {
      toast.error("Please enter the complete 4-digit OTP and ensure the activation token is available.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />} 

      <div className="modal-overlay">
        <div className="card">
          <div className="dialog">
            <h2>Enter OTP</h2>
            <form onSubmit={handleSubmit} className="otp-form">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{
                      width: "40px",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  />
                ))}
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
