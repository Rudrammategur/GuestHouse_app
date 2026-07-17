import { FaArrowLeft } from "react-icons/fa";
import "./pageHeader.css";

function PageHeader({

    title,

    subtitle,

    breadcrumbs = [],

    badge,

    actions,

    onBack,

    showBack = false

}) {

    return (

        <div className="erp-page-header">

            <div className="erp-page-header-left">

                {

                    showBack && (

                        <button

                            className="erp-back-btn"

                            onClick={onBack}

                        >

                            <FaArrowLeft />

                        </button>

                    )

                }

                <div>

                    {

                        breadcrumbs.length > 0 && (

                            <div className="erp-breadcrumb">

                                {

                                    breadcrumbs.map((item,index)=>(

                                        <span key={index}>

                                            {item}

                                            {

                                                index !==

                                                breadcrumbs.length-1

                                                &&

                                                " / "

                                            }

                                        </span>

                                    ))

                                }

                            </div>

                        )

                    }

                    <h1>

                        {title}

                    </h1>

                    {

                        subtitle && (

                            <p>

                                {subtitle}

                            </p>

                        )

                    }

                </div>

            </div>

            {

                actions && (

                    <div className="erp-page-header-right">

                        {actions}

                    </div>

                )

            }

        </div>

    );

}

export default PageHeader;