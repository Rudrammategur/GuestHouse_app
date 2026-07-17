import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GHReceiptPage() {

    const { bookingId } = useParams();

    const navigate = useNavigate();

    const [receipt, setReceipt] = useState(null);

    useEffect(() => {

        loadReceipt();

    }, []);

    const loadReceipt = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/guesthouse-incharge/receipt/${bookingId}`

            );

            setReceipt(response.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    if (!receipt) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h2>

                Receipt Loaded Successfully

            </h2>

            <pre>

                {JSON.stringify(receipt, null, 2)}

            </pre>

        </div>

    );

}

export default GHReceiptPage;