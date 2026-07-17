import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaFileAlt,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import MobileNumberInput from "../../components/Common/MobileNumberInput";
import EmailInput from "../../components/Common/EmailInput";
import NationalityInput from "../../components/Common/NationalityInput";
import TariffModal from "../../components/TariffModal";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/guestHouseForm.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const isSameCalendarDay = (first, second) => Boolean(
  first && second &&
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()
);

const readDraft = () => {
  try {
    return JSON.parse(localStorage.getItem("guestHouseDraft")) || {};
  } catch {
    return {};
  }
};

function FormSection({ icon, step, title, children }) {
  return (
    <section className="booking-section">
      <header className="booking-section-header">
        <div className="section-icon">{icon}</div>
        <div>
          <span className="section-step">Section {step}</span>
          <h2>{title}</h2>
        </div>
      </header>
      <div className="booking-section-body">{children}</div>
    </section>
  );
}

function Field({ label, required = false, hint, className = "", children }) {
  return (
    <div className={`booking-field ${className}`}>
      <label>{label}{required && <span className="required-mark"> *</span>}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function GuestHouseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = { ...readDraft(), ...(location.state || {}) };

  const [employee, setEmployee] = useState({});
  const [guestTypes, setGuestTypes] = useState([]);
  const [guestHouses, setGuestHouses] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [expenditureHeads, setExpenditureHeads] = useState([]);
  const [tariffDetails, setTariffDetails] = useState([]);
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [loadingMasters, setLoadingMasters] = useState(true);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    guestType: draft.guestType || "",
    guestTypeName: draft.guestTypeName || "",
    guestName: draft.guestName || "",
    designation: draft.designation || "",
    guestAddress: draft.guestAddress || draft.GuestAddress || "",
    purpose: draft.purpose || "",
    GuestHouseID: draft.GuestHouseID || "",
    GuestHouseName: draft.GuestHouseName || "",
    occupancy: draft.occupancy || "",
    expenditureHeadType: draft.expenditureHeadType || "",
    projectDetails: draft.projectDetails || "",
    special: draft.special || "",
  });
  const [arrivalDate, setArrivalDate] = useState(draft.arrivalDate ? new Date(draft.arrivalDate) : null);
  const [departureDate, setDepartureDate] = useState(draft.departureDate ? new Date(draft.departureDate) : null);
  const [countryCode, setCountryCode] = useState(draft.countryCode || "+91");
  const [mobile, setMobile] = useState(draft.mobile || "");
  const [guestEmail, setGuestEmail] = useState(draft.email || draft.guestEmail || "");
  const [nationality, setNationality] = useState(draft.nationality === "Indian" ? "Indian" : draft.nationality ? "Other" : "");
  const [countryName, setCountryName] = useState(draft.nationality && draft.nationality !== "Indian" ? draft.nationality : draft.countryName || "");
  const [roomRequirements, setRoomRequirements] =
    useState([
      {
        roomTypeId: "",
        noOfRooms: 1
      }
    ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(draft.uploadedFileUrl || "");

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      axios.get(`${API_URL}/api/user/current-user`),
      axios.get(`${API_URL}/api/master/guest-types`),
      axios.get(`${API_URL}/api/master/guesthouse-types`),
      axios.get(`${API_URL}/api/expenditure-heads`),
    ]).then(([user, guests, houses, heads]) => {
      if (!active) return;
      if (user.status === "fulfilled") setEmployee(user.value.data);
      if (guests.status === "fulfilled") setGuestTypes(guests.value.data);
      if (houses.status === "fulfilled") setGuestHouses(houses.value.data);
      if (heads.status === "fulfilled") setExpenditureHeads(heads.value.data);
      setLoadingMasters(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {

    if (!formData.GuestHouseID)
      return;

    axios.get(
      `${API_URL}/api/master/room-types/${formData.GuestHouseID}`
    )
      .then((response) => {

        setRoomTypes(response.data);

      });

  }, [formData.GuestHouseID]);

  useEffect(() => {

    const loadGuestTypes = async () => {

      const response = await axios.get(
        `${API_URL}/api/master/guest-types`
      );

      setGuestTypes(response.data);

    };

    loadGuestTypes();

  }, []);

  useEffect(() => {

    if (formData.expenditureHeadType === "Project Fund") {

      loadProjects();

    } else {

      setProjects([]);

      setFormData(current => ({
        ...current,
        projectDetails: ""
      }));

    }

  }, [formData.expenditureHeadType]);


  const loadProjects = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/master/projects`
      );

      setProjects(response.data);

    }
    catch (error) {

      toast.error("Unable to load projects");

    }

  };

  const totalRooms = useMemo(
    () => roomRequirements.reduce((sum, room) => sum + Number(room.noOfRooms || 0), 0),
    [roomRequirements]
  );

  const stayDuration = useMemo(() => {
    if (!arrivalDate || !departureDate || departureDate <= arrivalDate) return null;
    const hours = Math.ceil((departureDate - arrivalDate) / 3600000);
    return { hours, nights: Math.max(1, Math.ceil(hours / 24)) };
  }, [arrivalDate, departureDate]);

  const changeArrivalDate = (date) => {
    setArrivalDate(date);
    if (!date || (departureDate && departureDate <= date)) setDepartureDate(null);
  };

  const changeDepartureDate = (date) => {
    if (date && arrivalDate && date <= arrivalDate) {
      toast.error("Departure date and time must be after arrival");
      return;
    }
    setDepartureDate(date);
  };

  const isDepartureTimeAllowed = (time) => {
    if (!arrivalDate) return false;
    const departureDay = departureDate || arrivalDate;
    if (!isSameCalendarDay(departureDay, arrivalDate)) return true;
    const candidateMinutes = time.getHours() * 60 + time.getMinutes();
    const arrivalMinutes = arrivalDate.getHours() * 60 + arrivalDate.getMinutes();
    return candidateMinutes > arrivalMinutes;
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const selectGuestType = (event) => {
    const option = event.target.options[event.target.selectedIndex];
    setFormData((current) => ({
      ...current,
      guestType: event.target.value,
      guestTypeName: event.target.value ? option.text : "",
    }));
  };

  const selectGuestHouse = (event) => {

    const option =
      event.target.options[
      event.target.selectedIndex
      ];

    setFormData(current => ({

      ...current,

      GuestHouseID:
        event.target.value,

      GuestHouseName:
        option.text

    }));

    setRoomRequirements([
      {
        roomTypeId: "",
        noOfRooms: 1
      }
    ]);

  };

  const changeRoomType = (index, roomTypeId) => {
    setRoomRequirements((current) => {
      const rows = current.map((room) => ({ ...room }));
      const duplicateIndex = rows.findIndex((room, rowIndex) => rowIndex !== index && String(room.roomTypeId) === String(roomTypeId));
      if (duplicateIndex >= 0 && roomTypeId) {
        rows[duplicateIndex].noOfRooms = Number(rows[duplicateIndex].noOfRooms) + Number(rows[index].noOfRooms);
        rows.splice(index, 1);
        toast.info("Duplicate room types were combined");
        return rows;
      }
      rows[index].roomTypeId = roomTypeId;
      console.log(rows);
      return rows;
    });
  };

  const changeRoomCount = (index, value) => {

    setRoomRequirements(current =>

      current.map((room, i) =>

        i === index

          ? {
            ...room,
            noOfRooms: value
          }

          : room

      )

    );

  };

  const addRoom = () => {

    setRoomRequirements(current => [

      ...current,

      {
        roomTypeId: "",
        noOfRooms: 1
      }

    ]);

  };

  const removeRoom = (index) => {
    setRoomRequirements((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Document size must be 5 MB or less");
      event.target.value = "";
      return;
    }
    setUploadedFile(selected);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const buildPreviewData = () => ({
    ...formData,
    GuestAddress: formData.guestAddress,
    countryCode,
    mobile,
    contact: `${countryCode}${mobile}`,
    email: guestEmail,
    nationality: nationality === "Indian" ? "Indian" : countryName,
    arrivalDate,
    departureDate,
    roomRequirements: roomRequirements.map((room) => ({
      ...room,
      roomTypeName: roomTypes.find((type) => String(type.RoomTypeID) === String(room.roomTypeId))?.RoomTypeName || "",
    })),
    totalRooms,
    rooms: totalRooms,
    roomType: roomRequirements[0]?.roomTypeId || "",
    roomTypeName: roomTypes.find((type) => String(type.RoomTypeID) === String(roomRequirements[0]?.roomTypeId))?.RoomTypeName || "",
    uploadedFile,
    uploadedFileName: uploadedFile?.name || draft.uploadedFileName || "",
    uploadedFileUrl: filePreview,
    userId: employee.EmployeeId,
    EmployeeName: employee.EmployeeName,
    DepartmentName: employee.DepartmentName,
  });

  const validate = () => {
    if (!formData.guestType) return "Select the guest type";
    if (!formData.guestName.trim()) return "Enter the guest name";
    if (!formData.guestAddress.trim()) return "Enter the guest address";
    if (mobile.length < 10) return "Enter a valid 10-digit contact number";
    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) return "Enter a valid guest email";
    if (!nationality || (nationality === "Other" && !countryName.trim())) return "Enter the guest nationality";
    if (!formData.purpose.trim()) return "Enter the purpose of visit";
    if (!arrivalDate || !departureDate) return "Select arrival and departure date/time";
    if (departureDate <= arrivalDate) return "Departure must be after arrival";
    if (!formData.GuestHouseID) return "Select a guest house";
    if (!formData.occupancy || Number(formData.occupancy) < 1) return "Enter the number of occupants";
    if (roomRequirements.some((room) => !room.roomTypeId || Number(room.noOfRooms) < 1)) return "Complete all room requirements";
    if (!formData.expenditureHeadType) return "Select an expenditure head";
    if (formData.expenditureHeadType === "Project Fund" && !formData.projectDetails) return "Select a project";
    return "";
  };

  const saveDraft = () => {
    const previewData = buildPreviewData();
    console.log(previewData.uploadedFile);
    localStorage.setItem("guestHouseDraft", JSON.stringify({ ...previewData, uploadedFileUrl: "" }));
    toast.success("Draft saved on this device");
  };

  const continueToPreview = (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const previewData = buildPreviewData();
    localStorage.setItem("guestHouseDraft", JSON.stringify({ ...previewData, uploadedFileUrl: "" }));
    navigate("/guesthouse/preview", {
    state: previewData
});
  };

  const openTariff = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/master/tariff-details`);
      setTariffDetails(response.data);
      setShowTariffModal(true);
    } catch {
      toast.error("Tariff details are currently unavailable");
    }
  };

  return (
    <main className="booking-form-page">
      <header className="booking-form-hero">
        <button type="button" className="form-back-button" onClick={() => navigate("/guesthouse/dashboard")}>
          <FaArrowLeft /> Back
        </button>
        <div className="hero-copy">
          <span className="hero-kicker">Guest House Services</span>
          <h1>Apply for Guest House Accommodation</h1>
          <p>Provide the guest and visit details below. Fields marked with * are required.</p>
        </div>
        <div className="hero-reference">
          <span>Application status</span>
          <strong>Draft</strong>
        </div>
      </header>

      <div className="booking-form-layout">
        <aside className="booking-form-sidebar">
          <div className="applicant-card">
            <span className="sidebar-label">Requesting employee</span>
            <div className="employee-avatar">{employee.EmployeeName?.charAt(0) || "E"}</div>
            <h3>{employee.EmployeeName || (loadingMasters ? "Loading…" : "Institute Employee")}</h3>
            <p>{employee.EmployeeId || "Employee ID"}</p>
            {employee.DepartmentName && <p>{employee.DepartmentName}</p>}
          </div>
          <nav className="form-outline" aria-label="Form sections">
            <a href="#guest-details"><span>1</span> Guest details</a>
            <a href="#visit-details"><span>2</span> Visit schedule</a>
            <a href="#stay-details"><span>3</span> Accommodation</a>
            <a href="#finance-details"><span>4</span> Billing & notes</a>
          </nav>
          <div className="privacy-note"><FaInfoCircle /><p>Guest information is used only for accommodation processing and institute records.</p></div>
        </aside>

        <form className="booking-form" onSubmit={continueToPreview} noValidate>
          <div id="guest-details">
            <FormSection icon={<FaUser />} step="01" title="Guest Details">
              <div className="booking-grid">
                <Field label="Guest type" required>
                  <select
                    value={formData.guestType}
                    onChange={selectGuestType}
                  >
                    <option value="">Select Guest Type</option>

                    {guestTypes.map(type => (

                      <option
                        key={type.GuestTypeID}
                        value={type.GuestTypeID}
                      >
                        {type.GuestTypeName}
                      </option>

                    ))}

                  </select>
                </Field>
                <Field label="Guest name" required>
                  <input name="guestName" value={formData.guestName} onChange={updateField} placeholder="Full name as per official ID" />
                </Field>
                <Field label="Designation and organization" className="span-2">
                  <input name="designation" value={formData.designation} onChange={updateField} placeholder="e.g. Professor, IIT Dharwad" />
                </Field>
                <Field label="Guest address" required className="span-2">
                  <textarea name="guestAddress" value={formData.guestAddress} onChange={updateField} rows="3" placeholder="Complete postal address" />
                </Field>
                <div className="component-field"><MobileNumberInput countryCode={countryCode} setCountryCode={setCountryCode} mobile={mobile} setMobile={setMobile} label="Contact number *" /></div>
                <div className="component-field"><EmailInput label="Guest email *" value={guestEmail} setValue={setGuestEmail} /></div>
                <div className="component-field span-2"><NationalityInput nationality={nationality} setNationality={setNationality} countryName={countryName} setCountryName={setCountryName} /></div>
              </div>
            </FormSection>
          </div>

          <div id="visit-details">
            <FormSection icon={<FaCalendarAlt />} step="02" title="Visit Schedule">
              <div className="booking-grid">
                <Field label="Purpose of visit" required className="span-2">
                  <textarea name="purpose" value={formData.purpose} onChange={updateField} rows="3" placeholder="Briefly describe the official purpose of this visit" />
                </Field>
                <Field label="Arrival date and time" required>
                  <DatePicker selected={arrivalDate} onChange={changeArrivalDate} showTimeSelect timeIntervals={15} dateFormat="dd MMM yyyy, h:mm aa" placeholderText="Select arrival" className="datepicker-input" minDate={new Date()} />
                </Field>
                <Field label="Departure date and time" required>
                  <DatePicker selected={departureDate} onChange={changeDepartureDate} showTimeSelect timeIntervals={15} dateFormat="dd MMM yyyy, h:mm aa" placeholderText="Select departure" className="datepicker-input" minDate={arrivalDate || new Date()} filterTime={isDepartureTimeAllowed} disabled={!arrivalDate} />
                </Field>
                {stayDuration && <div className="stay-summary span-2"><FaCalendarAlt /><span>Estimated stay</span><strong>{stayDuration.nights} night{stayDuration.nights !== 1 ? "s" : ""} · {stayDuration.hours} hours</strong></div>}
              </div>
            </FormSection>
          </div>

          <div id="stay-details">
            <FormSection icon={<FaBed />} step="03" title="Accommodation Details">
              <div className="booking-grid">
                <Field label="Guest house" required>
                  <select value={formData.GuestHouseID} onChange={selectGuestHouse} disabled={loadingMasters}>
                    <option value="">Select guest house</option>
                    {guestHouses.map((house) => (

                      <option
                        key={house.GuestHouseID}
                        value={house.GuestHouseID}
                      >
                        {house.GuestHouseName}
                      </option>

                    ))}
                  </select>
                </Field>
                <Field label="Number of occupants" required>
                  <input type="number" min="1" name="occupancy" value={formData.occupancy} onChange={updateField} placeholder="0" />
                </Field>
                <div className="room-requirements span-2">
                  <div className="room-requirements-title">
                    <h3>Room Requirements</h3>
                    <button type="button" className="add-room-button" onClick={addRoom}><FaPlus /> Add room type</button>
                  </div>
                  <div className="room-requirements-columns">
                    <span>Room Type</span>
                    <span>No. of Rooms</span>
                    <span aria-hidden="true"></span>
                  </div>
                  {roomRequirements.map((room, index) => (
                    <div className="room-requirement-row" key={`${index}-${room.roomTypeId}`}>
                      <select
                        aria-label={`Room type ${index + 1}`}
                        value={room.roomTypeId}
                        onChange={(event) =>
                          changeRoomType(index, event.target.value)
                        }
                        disabled={!formData.GuestHouseID}


                      >
                        <option value="">
                          {
                            !formData.GuestHouseID
                              ? "Select Guest House First"
                              : roomTypes.length === 0
                                ? "No Room Types Available"
                                : "Select Room Type"
                          }
                        </option>
                        {roomTypes
                          .filter(type =>

                            !roomRequirements.some(

                              (room, i) =>

                                i !== index &&

                                String(room.roomTypeId) ===
                                String(type.RoomTypeID)

                            )

                            ||

                            String(room.roomTypeId) ===
                            String(type.RoomTypeID)

                          )

                          .map(type => (

                            <option
                              key={type.RoomTypeID}
                              value={type.RoomTypeID}
                            >
                              {type.RoomTypeName}
                            </option>

                          ))}
                      </select>
                      <input aria-label={`Number of rooms ${index + 1}`} type="number" min="1" value={room.noOfRooms} onChange={(event) => changeRoomCount(index, event.target.value)} />
                      <button type="button" className="remove-room-button" onClick={() => removeRoom(index)} disabled={roomRequirements.length === 1} aria-label="Remove room type"><FaTrash /></button>
                    </div>
                  ))}
                  <div className="room-total"><span>Total rooms requested</span><strong>{totalRooms}</strong></div>
                </div>
                <div className="tariff-action"><button
                  type="button"
                  onClick={openTariff}
                >
                  View Room Details
                </button></div>
              </div>
            </FormSection>
          </div>

          <div id="finance-details">
            <FormSection icon={<FaWallet />} step="04" title="Billing and Supporting Information">
              <div className="booking-grid">
                <Field label="Expenditure head" required>
                  <select name="expenditureHeadType" value={formData.expenditureHeadType} onChange={updateField} disabled={loadingMasters}>
                    <option value="">Select expenditure head</option>
                    {expenditureHeads.map((head) => <option key={head.id} value={head.name}>{head.name}</option>)}
                  </select>
                </Field>
                {formData.expenditureHeadType === "Project Fund" && (
                  <Field
                    label="Project"
                    required
                  >

                    <select
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={updateField}
                    >


                      <option value=""> Select Project </option>

                      {projects.map(project => (

                        <option
                          key={project.ProjectRefNo}
                          value={project.ProjectRefNo}
                        >
                          {project.ProjectRefNo} - {project.ProjectName}
                        </option>

                      ))}

                    </select>

                  </Field>
                )}
                <div className="form-divider span-2"><span>Optional information</span></div>
                <Field label="Special requirements" className="span-2" hint="Accessibility, food preferences, late arrival, pickup coordination, or other instructions.">
                  <textarea name="special" value={formData.special} onChange={updateField} rows="4" placeholder="Tell the guest house team anything they should prepare in advance" />
                </Field>
                <Field label="Supporting document" className="span-2" hint="PDF, JPG, PNG, DOC or DOCX · Maximum 5 MB">
                  <label className="file-drop-zone">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFile} />
                    <FaFileAlt />
                    <span><strong>{uploadedFile?.name || draft.uploadedFileName || "Choose a document"}</strong><small>Click to browse from your device</small></span>
                  </label>
                </Field>
              </div>
            </FormSection>
          </div>

          <footer className="booking-form-actions">
            <div><strong>Ready to review?</strong><span>Your request will not be submitted until the next screen.</span></div>
            <button type="button" className="cancel-form-button" onClick={() => navigate("/guesthouse/dashboard")}>Cancel</button>
            <button type="button" className="save-draft-button" onClick={saveDraft}>Save draft</button>
            <button type="submit" className="preview-button">Review application <span>→</span></button>
          </footer>
        </form>
      </div>

      {showTariffModal && <TariffModal tariffDetails={tariffDetails} onClose={() => setShowTariffModal(false)} />}
    </main>
  );
}

export default GuestHouseForm;
