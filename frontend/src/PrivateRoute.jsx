import React from "react";
import { Navigate } from "react-router-dom";
import { userAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
    const { session } = userAuth();
    
    return <> {session ? <>{children}</> : <Navigate to="/" />}</>;
}

export default PrivateRoute;