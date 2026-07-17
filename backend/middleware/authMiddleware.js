exports.mockLogin = (req, res, next) => {

    // req.user = {

    //     EmployeeId: req.headers.employeeid || "EMP001",

    //     EmployeeName: req.headers.employeename || "Rudramma Tegur",

    //     DepartmentID: req.headers.departmentid || "ERP",

    //     Role: req.headers.role || "Applicant"

    // };


    //     req.user = {

    //     EmployeeId: "EMP002",

    //     EmployeeName: "Verifier",

    //     DepartmentID: "C&S",

    //     Role: "Verifier"

    // };

    req.user = {

        EmployeeId: "EMP003",

        EmployeeName: "Approver",

        DepartmentID: "Administration",

        Role: "Approver"

    };


//     req.user = {

//         EmployeeId: "EMP004",

//         EmployeeName: "Allocator",

//         DepartmentID: "C&S",

//         Role: "Allocator"

//     };

    console.log("Middleware User:", req.user);

    next();

};