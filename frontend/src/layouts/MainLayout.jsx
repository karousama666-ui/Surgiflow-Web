import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function MainLayout({ children }) {

    return (

        <div
            style={{
                display: "flex",
                height: "100vh",
                background: "var(--background)"
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <Header />

                <main
                    style={{
                        padding: "32px",
                        flex: 1
                    }}
                >

                    {children}

                </main>

            </div>

        </div>

    );

}

export default MainLayout;