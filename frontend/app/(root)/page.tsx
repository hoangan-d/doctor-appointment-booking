import Banner from "@/components/Banner";
import HeroSection from "@/components/HeroSection";
import Specialty from "@/components/Specialty";
import TopDoctors from "@/components/TopDoctors";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Specialty />
      <TopDoctors />
      <Banner />
    </div>
  );
}
