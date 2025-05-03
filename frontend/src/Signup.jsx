import React, { useState } from "react";
import { userAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ssn, setSSN] = useState("");

  const { signUpNewUser } = userAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullName = `${firstname} ${lastname}`;

    try {
      const result = await signUpNewUser(email, password, fullName);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">
          Create Your Account
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="password"
            required
          />
          <input
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First Name"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="text"
          />
          <input
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last Name"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="text"
          />
          <input
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="Birthday (mm/dd/yyyy)"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="text"
          />
          <input
            onChange={(e) => setSSN(e.target.value)}
            placeholder="SSN"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-400"
            type="text"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
