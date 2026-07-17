const employees = {

    EMP001: {
        EmployeeId: "EMP001",
        EmployeeName: "Rudramma Tegur"
    },

    EMP002: {
        EmployeeId: "EMP002",
        EmployeeName: "C&S Office"
    },

    EMP003: {
        EmployeeId: "EMP003",
        EmployeeName: "Dean Admin"
    },

    EMP004: {
        EmployeeId: "EMP004",
        EmployeeName: "Guest House Incharge"
    }

};

exports.getEmployeeById = (employeeId) => {

    return employees[employeeId] || {

        EmployeeId: employeeId,

        EmployeeName: employeeId

    };

};