export const ACTIONS = {

    VIEW: "view",

    EDIT: "edit",

    DELETE: "delete",

    CANCEL: "cancel",

    VERIFY: "verify",

    APPROVE: "approve",

    REJECT: "reject",

    ALLOCATE: "allocate",

    CHECKIN: "checkin",

    CHECKOUT: "checkout",

    PRINT: "print",

    RECEIPT: "receipt"

};

export function getAvailableActions(application, roles = []) {

    const status = application?.BookingStatus;

    const roleNames = roles.map(role =>
        typeof role === "string"
            ? role
            : role.RoleName
    );

    const actions = [];

    // Everyone can view
    actions.push(ACTIONS.VIEW);

    // Applicant
    if (roleNames.includes("Applicant")) {

        switch (status) {

            case "Draft":
                actions.push(ACTIONS.EDIT, ACTIONS.DELETE);
                break;

            case "Submitted":
                actions.push(ACTIONS.CANCEL);
                break;

            case "Approved":
            case "Allocated":
            case "Checked In":
            case "Checked Out":
                actions.push(ACTIONS.PRINT);
                break;

            default:
                break;
        }

    }

    // Verifier
    if (
        roleNames.includes("Verifier") &&
        status === "Submitted"
    ) {

        actions.push(
            ACTIONS.VERIFY,
            ACTIONS.REJECT
        );

    }

    // Approver
    if (
        roleNames.includes("Approver") &&
        status === "Verified"
    ) {

        actions.push(
            ACTIONS.APPROVE,
            ACTIONS.REJECT
        );

    }

    // Guest House Incharge
    if (roleNames.includes("Guest House Incharge")) {

        switch (status) {

            case "Approved":
                actions.push(ACTIONS.ALLOCATE);
                break;

            case "Allocated":
                actions.push(ACTIONS.CHECKIN);
                break;

            case "Checked In":
                actions.push(ACTIONS.CHECKOUT);
                break;

            case "Checked Out":
                actions.push(ACTIONS.RECEIPT);
                break;

            default:
                break;

        }

    }

    return actions;

}