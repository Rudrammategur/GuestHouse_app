import { FaArrowRight } from "react-icons/fa";
import "../Dashboard/dashboard.css";

function ModuleCard({

    title,

    description,

    icon,

    onClick,

    disabled = false

}) {

    return (

        <div

            className={`

                module-card

                ${disabled ? "disabled" : ""}

            `}

            onClick={

                disabled

                    ? undefined

                    : onClick

            }

        >

            <div className="module-icon">

                {icon}

            </div>

            <h3>

                {title}

            </h3>

            <p>

                {description}

            </p>

            <div className="module-footer">

                <span>

                    Open

                </span>

                <FaArrowRight/>

            </div>

        </div>

    );

}

export default ModuleCard;