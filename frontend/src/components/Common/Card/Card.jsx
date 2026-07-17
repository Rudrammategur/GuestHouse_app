import "./Card.css";

function Card({

    children,

    className = ""

}){

    return(

        <div

            className={`erp-card ${className}`}

        >

            {children}

        </div>

    );

}

export default Card;