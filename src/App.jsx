import Header from "./components/Header";
import Subscription from "./components/Subscription";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./components/Register";
import Login from "./components/Login";
import Verification from "./components/Verification";
import PrivateRoute from "./components/PrivateRoute";
import SubscriptionPage from "./components/SubscriptionPage";

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
          <Route path="/verification" element = {<Verification/>}/>
          <Route path="/subscription/page" element={<PrivateRoute><SubscriptionPage/></PrivateRoute>}/>
        </Routes>
        <Toaster/>
      </Router>
    </div>
  );
};

export default App;
