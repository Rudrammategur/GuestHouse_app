const sql = require("mssql");
const { poolPromise } = require("../config/db");

exports.assignWorkflow = async (

    applicantId,

    expenditureHead

) => {

    const pool = await poolPromise;

    const workflow = await pool.request()

        .input(
            "ExpenditureHead",
            sql.VarChar,
            expenditureHead
        )

        .query(`

SELECT TOP 1 *

FROM WorkflowAssignmentMaster

WHERE

ExpenditureHead=@ExpenditureHead

AND IsActive=1

`);

    if (workflow.recordset.length === 0) {

        throw new Error(
            "Workflow configuration not found."
        );

    }

    const config =
        workflow.recordset[0];

    //------------------------------------
    // VERIFIER
    //------------------------------------

    let verifierId = config.VerifierID;

    if (!verifierId) {

        throw new Error(
            "Verifier is not configured."
        );

    }

    if (verifierId === applicantId) {

        verifierId = config.AlternateVerifierID;

        if (!verifierId) {

            throw new Error(
                "Alternate Verifier is not configured."
            );

        }

    }

    //------------------------------------
    // APPROVER
    //------------------------------------

    let approverId = config.ApproverID;

    if (!approverId) {

        throw new Error(
            "Approver is not configured."
        );

    }

    if (approverId === applicantId) {

        approverId = config.AlternateApproverID;

        if (!approverId) {

            throw new Error(
                "Alternate Approver is not configured."
            );

        }

    }

    //------------------------------------
    // ALLOCATOR
    //------------------------------------


    const allocatorId = config.AllocatorID;

    if (!allocatorId) {

        throw new Error(
            "Allocator is not configured."
        );

    }

    return {

        verifierId,

        approverId,

        allocatorId

    };

};