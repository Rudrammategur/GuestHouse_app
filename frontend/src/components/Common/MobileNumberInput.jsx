import React from "react";
import "./MobileNumberInput.css";

function MobileNumberInput({
  countryCode,
  setCountryCode,
  mobile,
  setMobile,
  label = "Mobile Number"
}) {

  const handleMobileChange = (e) => {

    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setMobile(value);

  };

  return (
    <div className="form-group">

      <label>{label}</label>

      <div className="mobile-input-container">

        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+91">IN +91</option>
          <option value="+1">US +1</option>
          <option value="+44">GB +44</option>
          <option value="+61">AU +61</option>
          <option value="+93">AF +93</option>
        </select>

        <input
          type="text"
          value={mobile}
          onChange={handleMobileChange}
          maxLength={10}
          placeholder="Enter Mobile Number"
        />
      </div>
      {
          mobile &&
          mobile.length < 10 && (
            <div className="errorMessage">
              Mobile No, should have 10 digits
            </div>
          )
        }
    </div>
  );
}

export default MobileNumberInput;