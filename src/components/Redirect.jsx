import { Link } from "react-router-dom";

const Redirect = () => {
  return (
    <div className="redirect">
      <h1 style={{ textAlign: "center",alignItems:"center", justifyContent: "center",fontWeight: "800",
          fontFamily: "cursive",color:"GrayText"}}>
        Go to Content Page
      </h1>
      <Link to={"/content"}><button
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "5px 20px",
          backgroundColor: "blue",
          border: "none",
          outline: "none",
          fontSize: "15px",
          fontWeight: "800",
          fontFamily: "cursive",
          cursor:"pointer",
          color:"white"
        }}
      >
        Click here
      </button></Link>
    </div>
  );
};

export default Redirect;
