import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Loader';

const ContentPage = () => {
  const [contents, setContents] = useState([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const { user } = useSelector((state) => state.user); // Redux state for user
  console.log(user);

  useEffect(() => {
    // Function to fetch user data and update local storage
    const fetchUserData = async () => {
      try {
        // Fetch user data from backend API
        const response = await axios.get('http://localhost:8000/api/v1/me', { withCredentials: true });
        const userData = response.data;

        // Update local storage with the user data
        localStorage.setItem('user', JSON.stringify(userData));

        // Extract subscription plan and set state
        if (userData && userData.subscription_plan) {
          setSubscriptionPlan(userData.subscription_plan);

          // Fetch content based on the subscription plan
          const fetchContent = async () => {
            try {
              let url;
              switch (userData.subscription_plan) {
                case 'Intermediate':
                  url = 'http://localhost:8000/api/v1/intermediate-content';
                  break;
                case 'Advanced':
                  url = 'http://localhost:8000/api/v1/advanced-content';
                  break;
                case 'Free':
                default:
                  url = 'http://localhost:8000/api/v1/free-content';
              }

              // Fetch content based on the subscription plan
              const contentResponse = await axios.get(url, { withCredentials: true });

              // Set content state
              setContents(contentResponse.data.data);
            } catch (contentError) {
              console.error('Content Fetch Error:', contentError.message);
            }
          };

          // Call fetch content
          fetchContent();
        } else {
          console.log('No subscription plan found in user data');
        }
      } catch (error) {
        console.error('User Fetch Error:', error.message);
      }
    };

    // Call fetch user data
    fetchUserData();
  }, []); // Run only once when the component mounts

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>
        Content for {subscriptionPlan} Plan
      </h1>
      <ul>
        {contents.length > 0 ? (
          contents.map((content, index) => (
            <div className="content-data" key={index}>
              <h1>{content.title}</h1>
              <h3>{content.description}</h3>
              <p>{content.content}</p>
            </div>
          ))
        ) : (
          <Loader/>
        )}
      </ul>
    </div>
  );
};

export default ContentPage;
