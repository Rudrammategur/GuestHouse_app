import "../../styles/applicationDrawer.css";

function ApplicationDrawer({

    open,

    onClose,

    children

}){

    if(!open) return null;

    return(

        <>

            <div

                className="drawer-overlay"

                onClick={onClose}

            />

            <div className="application-drawer">

                <div className="drawer-header">

                    <h2>

                        Application Details

                    </h2>

                    <button

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                <div className="drawer-body">

                    {children}

                </div>

            </div>

        </>

    );

}

export default ApplicationDrawer;