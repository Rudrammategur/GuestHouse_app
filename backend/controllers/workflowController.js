const { getWorkflowHistory } = require("../services/workflowService");

exports.getWorkflowLogs = async (req, res) => {

    try {

        const { moduleName, referenceId } = req.params;

        const logs = await getWorkflowHistory(
            moduleName,
            referenceId
        );

        res.json(logs);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};