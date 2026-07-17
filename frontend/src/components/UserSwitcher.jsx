import { useUser }
from "../context/UserContext";

function UserSwitcher() {

    const {
        currentUser,
        setCurrentUser
    } = useUser();

    const handleChange = (e) => {

        const employeeId =
            e.target.value;

        if (employeeId === "EMP100") {

            setCurrentUser({
                EmployeeID: "EMP100",
                EmployeeName: "Normal Employee",
                Role: "Applicant"
            });

        }

        if (employeeId === "EMP001") {

            setCurrentUser({
                EmployeeID: "EMP001",
                EmployeeName: "Verifier User",
                Role: "Verifier"
            });

        }

        if (employeeId === "EMP002") {

            setCurrentUser({
                EmployeeID: "EMP002",
                EmployeeName: "Approver User",
                Role: "Approver"
            });

        }

        if (employeeId === "EMP003") {

            setCurrentUser({
                EmployeeID: "EMP003",
                EmployeeName: "GH Incharge",
                Role: "GHIncharge"
            });

        }

    };

    return (

        <div
            style={{
                padding: "10px",
                background: "#fff",
                marginBottom: "20px",
                borderRadius: "8px"
            }}
        >

            <label>
                Switch User :
            </label>

            <select
                value={currentUser.EmployeeID}
                onChange={handleChange}
            >

                <option value="EMP100">
                    Employee
                </option>

                <option value="EMP001">
                    Verifier
                </option>

                <option value="EMP002">
                    Approver
                </option>

                <option value="EMP003">
                    GH Incharge
                </option>

            </select>

        </div>

    );

}

export default UserSwitcher;