import Header from "../components/header";
import OrgSidebar from "./components/orgsidebar";

import Footer from "../components/footer";

export default function OrgAdminPage() {
    return (
        <div className="min-h-screen bg-white pb-12">{/* pb-12 prevents footer overlap */}
            <Header />
            <div className="pt-16">
                <OrgSidebar />
            </div>
            <Footer />
        </div>
    );
}
