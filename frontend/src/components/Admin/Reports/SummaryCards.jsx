import "./reports.css";

function SummaryCards({ cards = [], summary = {} }) {

    return (

        <div className="summary-cards">

            {
                cards.map(card => (

                    <div
                        className="summary-card"
                        key={card.key}
                    >

                        <h4>{card.title}</h4>

                        <h2>{summary[card.key] ?? 0}</h2>

                    </div>

                ))
            }

        </div>

    );

}

export default SummaryCards;
