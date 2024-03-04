import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import Footer from "../components/Footer";
import LowerNavbar from "../components/LowerNavbar";

const HomePage = () => {
  return (
    <>
      <LowerNavbar />
      <Listings />
      {/* <Slide /> */}
      <Categories />
      <Footer />
    </>
  );
};

export default HomePage;
