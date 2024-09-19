import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PricePlan = () => {

  const navigate  = useNavigate()

  const initiatePayment = async (amount, plan) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/create-payment',
        { amount, subscription_plan: plan },
        { withCredentials: true } 
      );

      const data = response.data;
      if (!data.success) {
        throw new Error('Failed to create payment order');
      }

      return data.order;
    } catch (error) {
      console.error('Error initiating payment:', error.message);
      
    }
  };

  const handlePayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount, 
      currency: order.currency,
      name: 'Green Goblin',
      description: 'Payment for courses',
      order_id: order.id,
      handler: async (response) => {
        try {
         
          const receiptParts = order.receipt.split('_');
          const plan = receiptParts[1]; 
  
          const result = await axios.post(
            'http://localhost:8000/api/v1/verify-payment',
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount / 100,
              subscription_plan: plan, 
            },
            { withCredentials: true }
          );
  
          const data = result.data;
          if (!data.success) {
            throw new Error('Payment verification failed');
          }
  
          toast.success('Payment verified successfully');
          navigate("/redirect");
        } catch (error) {
          console.error('Error verifying payment:', error.message);
        }
      },
      prefill: {
        name: '', 
        email: '',
      },
      theme: {
        color: '#3399cc',
      },
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleButtonClick = async (plan) => {
    let amount;
    switch (plan) {
      case 'Intermediate':
        amount = 4900; 
        break;
      case 'Advanced':
        amount = 7900; 
        break;
      default:
        amount = 0;
    }
  
    const order = await initiatePayment(amount, plan);
  
    if (order) {
      handlePayment(order);
    }
  };
  
  return (
    <div>
      <div className="main">
        <h1>Transparent Pricing for Python Mastery.</h1>
        <h2>Choose the perfect plan for your journey and grow your skills.</h2>
      </div>
      <div className="container">
        <div className="grid">
          <h1>Beginner</h1>
          <span>$0 <strong>/ mo</strong></span>
          <p>Basic Python concepts</p>
          <p>5 projects</p>
          <p>Community support</p>
          <button onClick={() => handleButtonClick('Free')}>Start for Free</button>
        </div>
        <div className="grid">
          <h1>Intermediate</h1>
          <span>$49 <strong>/ mo</strong></span>
          <p>Advanced Python concepts</p>
          <p>10 projects</p>
          <p>Live mentorship</p>
          <p>Priority support</p>
          <button onClick={() => handleButtonClick('Intermediate')}>Buy Intermediate</button>
        </div>
        <div className="grid">
          <h1>Advanced</h1>
          <span>$79 <strong>/ mo</strong></span>
          <p>Expert Level Python</p>
          <p>20 projects</p>
          <p>1-on-1 mentorship</p>
          <p>24/7 support</p>
          <button onClick={() => handleButtonClick('Advanced')}>Buy Advanced</button>
        </div>
      </div>
    </div>
  );
};

export default PricePlan;
