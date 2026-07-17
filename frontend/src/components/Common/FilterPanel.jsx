import ERPSection from "./ERPSection";
import Button from "./Button/Button";

function FilterPanel({

    children,

    onSearch,

    onReset,

    showReset = true

}) {

    return (

        <ERPSection

            title="Filters"

            actions={

                <div className="flex gap-sm">

                    {

                        showReset && (

                            <Button

                                variant="outline"

                                onClick={onReset}

                            >

                                Reset

                            </Button>

                        )

                    }

                    <Button

                        onClick={onSearch}

                    >

                        Search

                    </Button>

                </div>

            }

        >

            <div className="erp-grid grid-4">

                {children}

            </div>

        </ERPSection>

    );

}

export default FilterPanel;