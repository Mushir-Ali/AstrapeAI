import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Form = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = "http://localhost:4000";
      let response;

      if (isSignUp) {
        response = await axios.post(`${BASE_URL}/api/auth/register`, {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/auth/login`, {
          email,
          password,
        });
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome ${user.name}!`, {
        duration: 2000,
      });

      console.log("navigating to dashboard");
      navigate("/dashboard",{state:{user}});
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-10 py-10 rounded-3xl border-2 border-gray w-full max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="text-center text-gray-500 mt-2">
        {isSignUp
          ? "Sign up to get started with your account"
          : "Please enter your details"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isSignUp && (
          <div>
            <label className="text-lg font-medium">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <label className="text-lg font-medium">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-lg font-medium">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-3 rounded-xl bg-violet-500 text-white text-lg font-bold transition-transform active:scale-95 hover:scale-105"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-gray-500 mt-4">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          className="text-violet-500 cursor-pointer font-medium"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default Form;
