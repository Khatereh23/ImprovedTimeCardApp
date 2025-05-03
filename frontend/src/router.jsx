import { createBrowserRouter } from "react-router-dom";
import Signin from './Signin';
import Signup from './Signup';
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import TimeCounter from "./TimeCounter";

export const router = createBrowserRouter([
  { path: '/', element: <Signin /> },
  { path: '/signup', element: <Signup /> },
  { path: '/TimeCounter', element: <TimeCounter /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    )
  },
]);
