import "./chargeSummary.css";

function ChargeSummary({

    title = "Charge Summary",

    items = [],

    total = 0,

    footer = null

}) {

    const formatAmount = value =>

        new Intl.NumberFormat(

            "en-IN",

            {

                style: "currency",

                currency: "INR",

                minimumFractionDigits: 2

            }

        ).format(value || 0);

    return (

        <div className="charge-summary">

            <div className="charge-summary-header">

                <h3>{title}</h3>

            </div>

            <div className="charge-summary-body">

                {

                    items.map(item => (

                        <div

                            key={item.label}

                            className="charge-row"

                        >

                            <span>

                                {item.label}

                            </span>

                            <span>

                                {

                                    formatAmount(

                                        item.amount

                                    )

                                }

                            </span>

                        </div>

                    ))

                }

            </div>

            <div className="charge-total">

                <span>Total</span>

                <span>

                    {

                        formatAmount(total)

                    }

                </span>

            </div>

            {

                footer &&

                <div className="charge-footer">

                    {footer}

                </div>

            }

        </div>

    );

}

export default ChargeSummary;