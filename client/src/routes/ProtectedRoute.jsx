import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verify = async () => {

      const token = localStorage.getItem("Token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/solved", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsAuth(res.status === 200);

      } catch (err) {
        setIsAuth(false);
      }
    };

    verify();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;