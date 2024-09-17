import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from './Loader'; 
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Function to get the value of a cookie by name
  const getCookie = (name) => {
    const value = `${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the token from cookies
      const accessToken = getCookie('access_token');

      // Create payment request
      const response = await axios.post("http://localhost:8000/api/v1/create-payment", {
        amount: selectedPlan === "monthly" ? 999 : 9999, 
        name,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include token in the request headers
          'Content-Type': 'application/json',
        },
        withCredentials:true
      });
      console.log(response.headers)

      const { order } = response.data;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: name,
        description: "Subscription Payment",
        order_id: order.id,
        handler: async (response) => {
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            name,
            email,
            amount: order.amount / 100, 
          };

          try {
            const verificationResponse = await axios.post(
              "http://localhost:8000/api/v1/verify-payment",
              paymentData,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`, 
                  'Content-Type': 'application/json',
                },
                withCredentials:true
              }
            );

            if (verificationResponse.data.success) {
              toast.success("Payment successful!");
              navigate("/subscription/page")
            } else {
              toast.error("Payment verification failed. Please try again.");
            }
          } catch (error) {
            toast.error("Payment verification failed. Please try again.");
            console.log(error);
          } finally {
            setIsLoading(false); 
          }
        },
        prefill: {
          name,
          email,
        },
        theme: {
          color: "#F37254",
        },
      };

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      toast.error("Error creating payment. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="subscription-container">
      {isLoading && <Loader />} 

      <h1>Choose Your Subscription Plan</h1>
      <div className="plan-selector">
        <button
          className={selectedPlan === "monthly" ? "active" : ""}
          onClick={() => handlePlanChange("monthly")}
        >
          Monthly
        </button>
        <button
          className={selectedPlan === "yearly" ? "active" : ""}
          onClick={() => handlePlanChange("yearly")}
        >
          Yearly
        </button>
      </div>

      <div className="plan-details">
        {selectedPlan === "monthly" ? (
          <div className="plan">
            <h2>Monthly Plan</h2>
            <p>$999 per month</p>
            <p>Billed monthly. Cancel anytime.</p>
          </div>
        ) : (
          <div className="plan">
            <h2>Yearly Plan</h2>
            <p>$99.99 per year</p>
            <p>Billed annually. Save 20%!</p>
          </div>
        )}
      </div>

      <form className="subscription-form" onSubmit={handleSubscription}>
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="subscribe-btn" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  );
};

export default Subscription;
