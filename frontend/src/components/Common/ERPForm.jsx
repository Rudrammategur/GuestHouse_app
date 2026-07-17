

function ERPForm({

    children,

    onSubmit

}) {

    return (

        <form

            className="erp-form"

            onSubmit={onSubmit}

        >

            {children}

        </form>

    );

}

export default ERPForm;