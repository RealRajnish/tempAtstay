import Navbar from "../components/Navbar";
import Slide from "../components/Slide";
import Categories from "../components/Categories";
import Listings from "../components/Listings";
import Footer from "../components/Footer";
import LowerNavbar from "../components/LowerNavbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { API_3 } from "../api/api";
import { useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

const HomePage = () => {
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const gettingWishlist = async () => {
    try {
      const resp = await axios.get(`${API_3}users/${user._id}/getAllWishlist`);
      console.log("getting wishlist response", resp);
      dispatch(setWishList(resp.data.wishList));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      gettingWishlist();
    }
  }, []);
  return (
    <>
      {/* <LowerNavbar /> */}
      <Listings />
      {/* <Slide /> */}
      <Categories />
      <Footer />
    </>
  );
};

export default HomePage;
