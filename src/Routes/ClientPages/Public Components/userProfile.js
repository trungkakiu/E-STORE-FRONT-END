import "./scss/userProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faIdCardClip, faCartFlatbed, faClockRotateLeft, 
    faGear, faTicket
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import UserInfo from "../Public Components/userInfo";
import Settings from "../Public Components/Settings";
import CartHistory from "../Public Components/CartHistory";
import RatingHistory from "../Public Components/RatingHistory";
import UserVoucherStorage from "./UserVoucherStorage";

const UserProfile = () => {
    const [isSet, setIsSet] = useState("Profile");
    const location = useLocation();


    const renderContent = useCallback(() => {
        switch (isSet) {
            case "Profile":
                return <UserInfo />;
            case "Cart-history":
                return <CartHistory />;
            case "Rating-history":
                return <RatingHistory />;
            case "Tickets":
                return <UserVoucherStorage />;
            case "Settings":
                return <Settings />; 
            default:
                return <UserInfo />;
        }
    }, [isSet]);

    useEffect(() => {
        console.log(location.state)
        if (location.state?.showCartHistory) {
            setIsSet("Cart-history");
        }
    }, [location.state]);

    return (
        <div className="UserProfile-container d-flex">
            <div className="usernavbar-Contents">
                {[
                    { key: "Profile", icon: faIdCardClip },
                    { key: "Cart-history", icon: faCartFlatbed },
                    { key: "Rating-history", icon: faClockRotateLeft },
                    { key: "Tickets", icon: faTicket },
                    { key: "Settings", icon: faGear },

                ].map((item) => (
                    <div 
                        key={item.key} 
                        onClick={() => setIsSet(item.key)} 
                        className={isSet === item.key ? `active ${item.key}` : `tag ${item.key}`}
                    >
                        <FontAwesomeIcon icon={item.icon} className={`ic ${item.key}`} />
                    </div>
                ))}
            </div>
            <div className="topic-contents">
                {renderContent()}
            </div>
        </div>
    );
};

export default UserProfile;