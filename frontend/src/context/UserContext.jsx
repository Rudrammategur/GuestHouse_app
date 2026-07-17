import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState({
        EmployeeID: "EMP100",
        EmployeeName: "Test Employee",
        Role: "Applicant"
    });

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () =>
    useContext(UserContext);