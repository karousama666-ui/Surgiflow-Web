function CalendarToolbar() {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                marginBottom: "20px"
            }}
        >

            <button>

                Hoje

            </button>

            <h2>

                Julho 2026

            </h2>

            <div>

                <button>

                    ◀

                </button>

                <button>

                    ▶

                </button>

            </div>

        </div>

    );

}

export default CalendarToolbar;