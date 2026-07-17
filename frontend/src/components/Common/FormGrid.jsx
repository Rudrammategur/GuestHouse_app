import "./formLayout.css";

function FormGrid({

    columns = 2,

    children

}) {

    return (

        <div

            className={`

                form-grid

                form-grid-${columns}

            `}

        >

            {children}

        </div>

    );

}

export default FormGrid;