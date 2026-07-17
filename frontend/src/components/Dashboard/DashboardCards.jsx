import "./dashboard.css";

function DashboardCards({ cards = [] }) {

    return (

        <div className="summary-grid">

            {cards.map(card => (

                <div
                    key={card.label}
                    className={`summary-card ${card.className} ${card.active ? "active" : ""}`}
                    onClick={card.onClick}
                >

                    <div className="summary-card-content">

                        <h2>{card.count}</h2>

                        <p>{card.label}</p>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default DashboardCards;