import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/ghCheckOut.css";
import ApplicationSummary from "../../components/Dashboard/ApplicationView/ApplicationSummary";
import PageHeader from "../../components/Common/PageHeader";
import Button from "../../components/Common/Button/Button";
import InfoCard from "../../components/Common/InfoCard/InfoCard";

import ApplicationView from "../../components/Dashboard/ApplicationView/ApplicationView";

import ERPFormField from "../../components/Common/Form/ERPFormField";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GHCheckOutPage() {

    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [booking, setBooking] = useState(null);

    const [rooms, setRooms] = useState([]);

    console.log("BookingId:", bookingId);

    const [accommodationAmount,
        setAccommodationAmount] =
        useState(0);

    const [mealCharges,
        setMealCharges] =
        useState(0);

    const [additionalCharges,
        setAdditionalCharges] =
        useState(0);

    const [discount,
        setDiscount] =
        useState(0);

    const [paymentMode,
        setPaymentMode] =
        useState("");

    const [transactionReference,
        setTransactionReference] =
        useState("");



    const totalPayableAmount =
        Number(accommodationAmount)
        +
        Number(mealCharges)
        +
        Number(additionalCharges)
        -
        Number(discount);

    const handleCheckout = async () => {

        try {

            await axios.post(

                `${API_URL}/api/guesthouse-incharge/checkout/${bookingId}`,

                {

                    mealCharges,

                    additionalCharges,

                    discount,

                    paymentMode,

                    transactionReference,

                    totalPayableAmount

                }

            );

            alert("Guest Checked Out Successfully");

            navigate(

                `/gh-incharge/receipt/${bookingId}`

            );

        }

        catch (err) {

            console.log(err);

            alert(

                err.response?.data?.message ||

                "Check-Out Failed"

            );

        }

    };

    useEffect(() => {

        loadBooking();

    }, []);

    const loadBooking = async () => {

        const res =
            await axios.get(
                `${API_URL}/api/guesthouse-incharge/checkout/${bookingId}`
            );

        setBooking(res.data.booking);

        setRooms(res.data.rooms);

    };

    useEffect(() => {

        if (booking) {

            setAccommodationAmount(
                booking.AccommodationAmount || 0
            );

            setMealCharges(
                booking.MealCharges || 0
            );

            setAdditionalCharges(
                booking.AdditionalCharges || 0
            );

            setDiscount(
                booking.DiscountAmount || 0
            );

        }

    }, [booking]);

    // const handleGenerateReceipt = async () => {

    //     try {

    //         await axios.post(

    //             `${API_URL}/api/guesthouse-incharge/checkout/${bookingId}/generate-receipt`,

    //             {

    //                 accommodationAmount,

    //                 mealCharges,

    //                 additionalCharges,

    //                 discount,

    //                 paymentMode,

    //                 transactionReference,

    //                 totalPayableAmount

    //             }

    //         );

    //         setReceiptGenerated(true);

    //         alert("Receipt generated successfully.");

    //     }

    //     catch (err) {

    //         console.log(err);

    //         alert("Failed to generate receipt.");

    //     }

    // };

     return (

<div className="checkout-page">

    <PageHeader

        title="Guest Check-Out"

        subtitle={`Booking No : ${booking?.GHRBookingNo || ""}`}

        actions={

            <Button

                variant="outline"

                onClick={() => navigate(-1)}

            >

                ← Back

            </Button>

        }

    />


    <div className="workflow-layout">

        {/* LEFT PANEL */}

        <div className="workflow-left">

            {

                booking &&

                <ApplicationView

                    application={booking}

                    hideHeader

                    hideSummary

                />

            }

        </div>

        {/* RIGHT PANEL */}

        <div className="workflow-right">

            <InfoCard title="Guest Check-Out">

    {/* Departure Checklist */}

    <div className="section-block">

        <h4>Departure Checklist</h4>

        <label className="check-item">

            <input type="checkbox" />

            Room Keys Returned

        </label>

        <label className="check-item">

            <input type="checkbox" />

            Room Inspected

        </label>

        <label className="check-item">

            <input type="checkbox" />

            No Damages Found

        </label>

        <label className="check-item">

            <input type="checkbox" />

            Guest Belongings Cleared

        </label>

    </div>

    <hr />

    {/* Charges */}

    <div className="section-block">

        <h4>Charges</h4>

        <ERPFormField

            label="Accommodation"

            value={booking?.AccommodationAmount || 0}

            disabled

        />

        <ERPFormField

            label="Meal Charges"

            type="number"

            value={mealCharges}

            onChange={(e)=>setMealCharges(e.target.value)}

        />

        <ERPFormField

            label="Additional Charges"

            type="number"

            value={additionalCharges}

            onChange={(e)=>setAdditionalCharges(e.target.value)}

        />

        <ERPFormField

            label="Discount"

            type="number"

            value={discount}

            onChange={(e)=>setDiscount(e.target.value)}

        />

    </div>

    <hr />

    {/* Payment */}

    <div className="section-block">

        <h4>Payment Details</h4>

        <ERPFormField

            label="Transaction Reference"

            value={transactionReference}

            onChange={(e)=>setTransactionReference(e.target.value)}

        />

    </div>

    <hr />

    {/* Receipt */}

    <div className="section-block">

        <h4>Receipt Summary</h4>

        <div className="summary-row">

            <span>Total Payable</span>

            <strong>

                ₹ {totalPayableAmount}

            </strong>

        </div>

    </div>

    <div className="action-footer">

        <Button

            variant="outline"

            onClick={()=>navigate(-1)}

        >

            Cancel

        </Button>

        <Button

            onClick={handleCheckout}

        >

            Generate Receipt

        </Button>

    </div>

</InfoCard>

        </div>

    </div>

</div>

);
}

export default GHCheckOutPage;