import React, { useState } from "react";
import styles from "./EmailInput.module.css";

function EmailInput({
  label = "Email Address",
  value,
  setValue,
  placeholder = "Enter Email Address"
}) {

  const [error, setError] = useState("");

  const validateEmail = (email) => {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

  };

  const handleChange = (e) => {

    const email = e.target.value;

    setValue(email);

    if (email === "") {
      setError("");
    }
    else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
    }
    else {
      setError("");
    }
  };

  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        type="email"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {
        error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )
      }

    </div>
  );
}

export default EmailInput;