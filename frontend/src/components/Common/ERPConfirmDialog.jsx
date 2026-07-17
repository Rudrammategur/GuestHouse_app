import "./ERPConfirmDialog.css";

function ERPConfirmDialog({

    open,

    title = "Confirmation",

    message,

    confirmText = "Yes",

    cancelText = "No",

    confirmButtonClass = "confirm-btn",

    onConfirm,

    onCancel,

    loading = false

}) {

    if (!open) return null;

    return (

        <div className="confirm-overlay">

            <div className="confirm-dialog">

                <div className="confirm-header">

                    <h3>{title}</h3>

                </div>

                <div className="confirm-body">

                    <p>{message}</p>

                </div>

                <div className="confirm-footer">

                    <button

                        className="cancel-btn"

                        onClick={onCancel}

                        disabled={loading}

                    >

                        {cancelText}

                    </button>

                    <button

                        className={confirmButtonClass}

                        onClick={onConfirm}

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                "Processing..."

                                :

                                confirmText

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ERPConfirmDialog;