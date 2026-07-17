import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ApplicationView from "../../components/Dashboard/ApplicationView/ApplicationView";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function ApplicantApplicationPage() {

    const { bookingId } = useParams();

    const [application, setApplication] = useState(null);

    useEffect(() => {

        loadApplication();

    }, [bookingId]);

    const loadApplication = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/guesthouse/application/${bookingId}`
            );

            setApplication(res.data.application);

        }

        catch (err) {

            console.error(err);

        }

    };

    if (!application)

        return <h3>Loading...</h3>;

    return (

        <ApplicationView
            application={application}
        />

    );

}

export default ApplicantApplicationPage;