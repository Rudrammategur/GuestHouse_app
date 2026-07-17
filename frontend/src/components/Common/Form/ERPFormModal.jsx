import "./ERPForm.css";

function ERPFormModal({

    open,

    title,

    children,

    onSave,

    onClose,

    saveText = "Save",

    cancelText = "Cancel",

    saving = false

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="erp-form-modal">

                <div className="erp-form-header">

                    <h2>{title}</h2>

                </div>

                <div className="erp-form-body">

                    {children}

                </div>

                <div className="erp-form-footer">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        {cancelText}

                    </button>

                    <button

                        className="save-btn"

                        onClick={onSave}

                        disabled={saving}

                    >

                        {

                            saving

                                ? "Saving..."

                                : saveText

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ERPFormModal;