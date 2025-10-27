import MainNav from "../components/LandingPage/MainNav";
import HeroSection from "../components/LandingPage/HeroSection";

function LandingPage(){
    return (
        <div className="min-h-screen">
            <MainNav />
            <HeroSection />
        </div>
    )
}

export default LandingPage;