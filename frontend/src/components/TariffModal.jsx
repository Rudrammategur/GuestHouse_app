import Modal from "./Modal/Modal";

function TariffModal({
    tariffDetails,
    onClose
}) {

    return (

        <Modal
            title="Guest House Tariff Details"
            onClose={onClose}
        >

            <div className="tariff-table-container">

                <table className="erp-table tariff-table">

                    <thead>

                        <tr>

                            <th>Guest House</th>

                            <th>Room Type</th>

                            <th>Occupancy</th>

                            <th>1 Day</th>

                            <th>15 Days</th>

                            <th>30 Days</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            tariffDetails.map((row) => (

                                <tr key={row.GHRCID}>

                                    <td>
                                        {row.GuestHouseName}
                                    </td>

                                    <td>
                                        {row.RoomTypeName}
                                    </td>

                                    <td>
                                        {row.Occupancy ?? "-"}
                                    </td>

                                    <td>
                                        ₹ {row.DayRate}
                                    </td>

                                    <td>
                                        ₹ {row["15DayRate"]}
                                    </td>

                                    <td>
                                        ₹ {row["30DayRate"]}
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </Modal>

    );

}

export default TariffModal;