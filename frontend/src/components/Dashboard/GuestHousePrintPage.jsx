import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ApplicationView from "./ApplicationView/ApplicationView";
import "../Dashboard/dashboard.css";

function GuestHousePrintPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/master/application/${id}`
    );
    setData(res.data);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="print-container">

      <div className="print-header">
        <h2>Guest House Application</h2>
        <ApplicationView
          application={data}
        />
        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

    </div>
  );
}

export default GuestHousePrintPage;