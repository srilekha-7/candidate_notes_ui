import React, { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { message } from "antd";
import { ElementExecutor } from "../view/engine";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState({
    schema: [
      {
        element: "input-text",
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        className:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50",
        labelClassName: "block text-gray-700 font-medium mb-1",
        errorClassName: "text-red-500 text-sm mt-1",
      },
      {
        element: "input-text",
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        className:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50",
        labelClassName: "block text-gray-700 font-medium mb-1",
        errorClassName: "text-red-500 text-sm mt-1",
      },
      {
        element: "button",
        name: "loginBtn",
        label: "Login",
        className:
          "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 mt-4",
      },
      {
        element: "div",
        name: "registerRedirect",
        label: "Don’t have an account? Register",
        className: "mt-4 text-center text-blue-500 hover:underline cursor-pointer",
        labelClassName: "text-sm font-medium",
      },
    ],
  });

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      
      if (res.data.status === true) {
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login Successful!");
        // onLogin(res.data.user);

        navigate("/dashboard"); 
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = (fields) => {
    let payload = {};

    fields.forEach((field) => {
      if (field.fields && field.fields.length > 0) {
        payload = { ...payload, ...buildPayload(field.fields) };
      } else if (field.element !== "button" && field.element !== "div") {
        payload[field.name] = field.value || "";
      }
    });

    return payload;
  };

  const handleSelectedRecord = (e) => {
    if (e.name === "loginBtn") {
      const payload = buildPayload(schema.schema);
      handleLogin(payload);
    } else if (e.name === "registerRedirect") {
      navigate("/signup"); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 animate-pulse translate-x-1/3 translate-y-1/3"></div>
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-80 md:w-96 z-10 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        <ElementExecutor data={schema} selectedRecord={handleSelectedRecord} />
      </div>
    </div>
  );
}

export default LoginPage;
