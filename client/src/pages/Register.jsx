import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "reader",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await API.post(
        "/auth/register",
        payload
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      className="home"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.15)",
          marginTop: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          📚 Join BookVerse
        </h1>

        <form
          onSubmit={registerUser}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "14px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          />

          <div style={{ position: "relative" }}>
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
            />

            <span
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {showConfirmPassword
                ? "🙈"
                : "👁"}
            </span>
          </div>

          <div>
            <h3>Register As</h3>

            <label>
              <input
                type="radio"
                name="role"
                value="reader"
                checked={
                  form.role === "reader"
                }
                onChange={handleChange}
              />
              {" "}Reader
            </label>

            <br />

            <label>
              <input
                type="radio"
                name="role"
                value="author"
                checked={
                  form.role === "author"
                }
                onChange={handleChange}
              />
              {" "}Author
            </label>
          </div>

          <button
            type="submit"
            style={{
              padding: "14px",
              fontSize: "17px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;