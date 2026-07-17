import React from "react";
import "./NationalityInput.css";

function NationalityInput({
  nationality,
  setNationality,
  countryName,
  setCountryName
}) {

  const handleNationalityChange = (e) => {

    const value = e.target.value;

    setNationality(value);

    if (value === "Indian") {
      setCountryName("");
    }

  };

  return (

    <div className="nationality-container">

      <div className="form-group">

        <label>Nationality</label>

        <select
          value={nationality}
          onChange={handleNationalityChange}
        >
          <option value="">
            Select Nationality
          </option>

          <option value="Indian">
            Indian
          </option>

          <option value="Other">
            Other
          </option>

        </select>

      </div>

      {
        nationality === "Other" && (

          <div className="form-group">

            <label>Country Name</label>

            <input
              type="text"
              placeholder="Enter Country Name"
              value={countryName}
              onChange={(e) =>
                setCountryName(e.target.value)
              }
            />

          </div>

        )
      }

    </div>

  );

}

export default NationalityInput;