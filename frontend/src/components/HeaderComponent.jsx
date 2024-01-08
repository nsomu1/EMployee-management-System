import React from "react";
import { useNavigate} from "react-router-dom";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Logout failed");
        // Handle logout failure if needed
        return;
      }

      // Clear user session or perform other necessary actions
      console.log("Logout successful");

      // Redirect to the login page or home page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div>
            <a href="/employees" className="navbar-brand">
              Employee Management App
            </a>
          </div>
          <div className="navbar-collapse justify-content-end">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
