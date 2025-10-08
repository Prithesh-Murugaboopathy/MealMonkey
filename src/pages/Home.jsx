import { useEffect, useState } from "react";
import API from "../api/api";
import './css/Home.css'
import SearchBar from "../components/SearchBar";
import TwoWheelerRoundedIcon from '@mui/icons-material/TwoWheelerRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from "react-router-dom";

export default function Home() {

    return (
        <div className="home_page">
            <div className="hero_display">
                <div className="left_part">
                    <div className="hero_main_text">
                        <span>Fastest</span><br />
                        <span><span>Delivery</span> &</span><br />
                        <span>Easy <span>Pickup</span></span>
                    </div>
                    <SearchBar />
                </div>
                <div className="center">
                    <img style={{width:'600px', height:"600px", marginLeft: "-150px"}} src='/LandingPicture.png'/>
                </div>
                <div className="right_part">
                    <div className="pro">
                        <div className="pro_icon"><TwoWheelerRoundedIcon /></div>
                        <div className="pro_content">
                            <div className="content_title">Fast Delivery</div>
                            <div className="content">Promise to deliver<br />within 30 mins</div>
                        </div>
                    </div>
                    <div className="pro">
                        <div className="pro_icon"><ShoppingBagRoundedIcon /></div>
                        <div className="pro_content">
                            <div className="content_title">Pick up</div>
                            <div className="content">Pickup delivery at<br />your doorstep</div>
                        </div>
                    </div>
                    <div className="pro">
                        <div className="pro_icon"><RestaurantRoundedIcon /></div>
                        <div className="pro_content">
                            <div className="content_title">Dine in</div>
                            <div className="content">Enjoy your food<br />fresh crispy and hot</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="best_delivered_categories">
                <div className="title_part">
                    <div className="best_seller_title">Our <span>Best Delivered</span> <br />Categories</div>
                    <div className="bestseller_content">It's not just about bringing you good food from<br /> restaurants, we deliver experience.</div>
                    <div className="french_fry_hand">
                        <img src="/FrenchFryHand.png" />
                    </div>
                </div>
                <div className="dishes">
                    <div className="bestseller_component">
                        <div className="bestseller_image">
                            <img src="/ChickenFry.png" />
                        </div>
                        <div className="best_seller_name">Masala Chicken</div>
                        <Link className="ordernow">Order now <ChevronRightRoundedIcon /></Link>
                    </div>
                    <div className="bestseller_component">
                        <div className="bestseller_image">
                            <img src="/SoftBeverages.png" />
                        </div>
                        <div className="best_seller_name">Soft Beverages</div>
                        <Link className="ordernow">Order now <ChevronRightRoundedIcon /></Link>
                    </div>
                    <div className="bestseller_component">
                        <div className="bestseller_image">
                            <img src="/FrenchFries.png" />
                        </div>
                        <div className="best_seller_name">French Fries</div>
                        <Link to={''} className="ordernow">Order now <ChevronRightRoundedIcon /></Link>
                    </div>
                </div>
            </div>
            <div className="pan">
                <img src="/pan.png" />
            </div>
            <div className="services">
                <div className="title_part">
                    <div className="services_title">How we <span>Serve</span> you</div>                    
                </div>
                <div className="service">
                    <div className="service_component">
                        <div className="service_image">
                            <img src="/Packaging.png" />
                        </div>
                        <div className="service_name">Automated Packaging</div>
                        <div className="service_desc">100% evironment friendly<br /> packaging</div>
                    </div>
                    <div className="service_component">
                        <div className="service_image">
                            <img src="/Packed.png" />
                        </div>
                        <div className="service_name">Packed with Love</div>
                        <div className="service_desc">We deliver the best <br />experiences</div>
                    </div>
                    <div className="service_component">
                        <div className="service_image">
                            <img src="/Serve.png" />
                        </div>
                        <div className="service_name">Serve hot Appetite</div>
                        <div className="service_desc">Promise to deliver within <br />30 mins</div>
                    </div>
                </div>
            </div>
            <div className="footer">
                
            </div>
        </div>
    );
}
