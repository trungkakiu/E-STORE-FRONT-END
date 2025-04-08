import { faEarthAsia, faHandHoldingHeart, faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './scss/Settings.scss'
import { useState, useContext } from "react";
import Comingsoon from "./Comingsoon";
import { UserContext } from '../../../Context/userContext';
import { Navigate } from "react-router-dom";
import RestfullAPI from "../../RouteAPI/ResfulAPI"
import { CartContext } from "../../../Context/cartContext";
import UserSetting from "./UserSetting";


const Settigns = () =>{
    const [isSet, setIsSet] = useState("language")
    const { user, login, logout } = useContext(UserContext);
    const { RemoveCart } = useContext(CartContext);

    const renderContent = () => {
        switch (isSet) {
          case "language":
            return <Comingsoon/>;
          case "Coming soon":
            return <Comingsoon/>;
          case "User Setting":
            return <UserSetting/>;
        }
      };

    const Userlogout = async() =>{
        try {
            const respone = await RestfullAPI.logOut(user.token);
            if(respone.status === 200){
                await RemoveCart();
                logout();
                return <Navigate to="/" />;
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
    return(
        <div className="setting-contaier d-flex">
            <div className="navbar-setitings ">
               
                <div onClick={()=>setIsSet("language")} className={isSet === "language" ? "language d-flex stnbActive" : "language d-flex stnb"}>
                    <FontAwesomeIcon icon={faEarthAsia}/>
                  
                </div>
                <div onClick={()=>setIsSet("Coming soon")} className={isSet === "Coming soon" ? "stnbActive Coming soon d-flex": "Coming soon d-flex stnb"}>
                    <FontAwesomeIcon icon={faHandHoldingHeart}/>
                   
                </div>
                <div onClick={()=>setIsSet("User Setting")}  className={isSet === "User Setting" ? "stnbActive User Setting d-flex" :"User Setting d-flex stnb" }>
                    <FontAwesomeIcon icon={faUserGear}/>
                   
                </div>
                <div onClick={Userlogout} className="SignOut d-flex stnblogout">
                    <FontAwesomeIcon icon={faRightFromBracket}/>
                </div>
            </div>
            <div className="setting-contents">
               {renderContent()}
            </div>
        </div>
    )
}

export default Settigns;