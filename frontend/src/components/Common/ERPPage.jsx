function ERPPage({

    children,

    fluid = false

}) {

    return (

        <div className="erp-page">

            <div

                className={

                    fluid

                        ?

                        "erp-container-fluid"

                        :

                        "erp-container"

                }

            >

                {children}

            </div>

        </div>

    );

}

export default ERPPage;