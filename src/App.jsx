import Header from "./components/Header";
// import Subscription from "./components/Subscription";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./components/Register";
import Login from "./components/Login";
import Verification from "./components/Verification";
import PricePlan from "./components/PricePlan";
import PrivateRoute from "./components/PrivateRoute";
import Redirect from "./components/Redirect";
import ContentPage from "./components/page/ContentPage";

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} /> */}
          <Route path="/verification" element = {<Verification/>}/>
          <Route path="/price-plan" element={<PrivateRoute><PricePlan/></PrivateRoute>}/>
          <Route path="/content" element={<ContentPage/>}/>

          {/* <Route path="/subscription" element={<PrivateRoute></PrivateRoute>}/> */}
          <Route path="/redirect" element={<PrivateRoute><Redirect/></PrivateRoute>}/>
        </Routes>
        <Toaster/>
      </Router>
    </div>
  );
};

export default App;
