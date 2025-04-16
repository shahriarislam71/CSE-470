import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../config/firebase.config";
import { MdSchool } from "react-icons/md";

const auth = getAuth(app);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate('/home')
        console.log("Google sign in success:", result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Facebook sign in success:", result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl"
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with gradient background */}
          <div
            className="hidden md:block md:w-1/2 px-8 pt-4 flex"
            style={{
              background: "linear-gradient(to right, #8B5CF6, #A855F7)",
            }}
          >
            <div className="flex items-center gap-4 py-4">
              <MdSchool className="text-5xl text-white" />
              <h1 className="text-white text-xl font-semibold">Education And Communication Platform</h1>
            </div>
            <div className="text-white pt-32 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold mb-4">
                Welcome Back!
              </h2>
              <p className="text-lg opacity-90">
                Continue your learning journey with us
              </p>
            </div>
          </div>

          {/* Right side with form */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-10">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
              Login to Your Account
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="text-gray-500" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-500" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FaGoogle className="text-red-500 mr-2" />
                  Google
                </button>

                <button
                  onClick={handleFacebookSignIn}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FaFacebook className="text-blue-600 mr-2" />
                  Facebook
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;