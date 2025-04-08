import { useContext, useEffect, useState } from 'react';
import './scss/CartHistory.scss';
import RestfulAPI from '../../RouteAPI/ResfulAPI'
import { UserContext } from '../../../Context/userContext'
import { toast, ToastContainer } from "react-toastify"
import bgimg from '../../../img/4751043c866ed52f9661.png'


const CartHistory = () =>{
    const defaultStates = {
        All: true,
        WaitPay: false,
        WaitShip: false,
        delivery: false,
        complete: false,
        cancer: false,
        return: false
    }

    const { user } = useContext(UserContext);
    const [states, setState] = useState(defaultStates);
    const [CartOrderData, setCartOrderData] = useState([]);

    const handleTabClick = (tabName) => {
        setState({
            All: false,
            WaitPay: false,
            WaitShip: false,
            delivery: false,
            complete: false,
            cancer: false,
            return: false,
            [tabName]: true,
        });
    };

    const showToast = (id, message, type, containerID) => {
        if (toast.isActive(id)) {
          toast.update(id, {
            render: message,
            type,
            containerId: containerID,
            autoClose: 5000, 
            closeOnClick: true
          });
        } else {
          toast[type](message, {
            toastId: id,
            containerId: containerID
          });
        }
    };

    const fetchUserOrder = async() =>{
        try {
            const rs = await RestfulAPI.fetchUserOrder(user.token);
            if(rs.status === 200){
                setCartOrderData(rs.data);
            }else{
                showToast("Error", "Error while fetch user order history" , "error" , "CartHistories");
                return;
            }
        } catch (error) {
            showToast("Error", "Error while fetch user order history" , "error" , "CartHistories");
            console.error(error);
            return;
        }
    }

    useEffect(()=>{
        if(user.Authen){
            fetchUserOrder();
        }
    },[])

    return(
        <div className="Cart-histories">
            <ToastContainer containerId={"CartHistories"}/>
            <div className="headerBar">
                <div className="d-flex">
                    <div onClick={()=>handleTabClick("All")}
                    className={states.All? "All itemHeader_active" : "All itemHeader"}>
                        <p>All</p>
                    </div>
                    <div onClick={()=>handleTabClick("WaitPay")}
                    className={states.WaitPay? "WaitPay itemHeader_active" : "WaitPay itemHeader" }>
                        <p>waiting payment</p>
                    </div>
                    <div onClick={()=>handleTabClick("WaitShip")}
                    className={states.WaitShip? "WaitShip itemHeader_active" : "WaitShip itemHeader" }>
                        <p>Wait delivery</p>
                    </div>
                    <div onClick={()=>handleTabClick("delivery")}
                    className={states.delivery? "delivery itemHeader_active" : "delivery itemHeader" }>
                        <p>On delivery</p>
                    </div>
                    <div onClick={()=>handleTabClick("complete")}
                    className= {states.complete? "complete itemHeader_active" : "complete itemHeader"}>
                        <p>Complete</p>
                    </div>
                    <div onClick={()=>handleTabClick("cancer")}
                    className={states.cancer? "cancer itemHeader_active" : "cancer itemHeader" }>
                        <p>Cancer</p>
                    </div>
                    <div onClick={()=>handleTabClick("return")}
                    className={states.return? "return itemHeader_active" : "return itemHeader"}>
                        <p>Return/refund</p>
                    </div>
                </div>
            </div>
            <div className="ContentBody">
                {
                    CartOrderData.length === 0 ? (
                        <>
                        <div className='NoContent' style={{backgroundImage: `url(${bgimg})`}}>
                        <p>You have no orders yet!</p>
                        </div>
                        
                        </>
                    ) : (
                        <>
                        <div>
                            
                        </div>
                        </>
                    )
                }
                
            </div>
        </div>
    )
}

export default CartHistory;