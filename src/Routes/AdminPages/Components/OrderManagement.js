import { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import '../Scss/OrderManagement.scss';
import ResfulAPI from '../../RouteAPI/ResfulAPI';
import { UserContext } from '../../../Context/userContext';
import { OrderContext } from '../../../Context/orderContext';

const OrderManagement = () => {
    const defaultStates = {
        All: true,
        WaitShip: false,
        Delivery: false,
        Complete: false,
        Cancer: false,
        Return: false
    };
    const IMGPATH = process.env.REACT_APP_IMG_APP_PATH;
    const { order, fetchOrder } = useContext(OrderContext);
    const { user } = useContext(UserContext);
    const [states, setState] = useState(defaultStates);

    const handleTabClick = (tabName) => {
        setState({
            All: false,
            WaitShip: false,
            Delivery: false,
            Complete: false,
            Cancer: false,
            Return: false,
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

    const handleStatusChange = async (status, orderID) => {
        try {
            const rs = await ResfulAPI.OrderStatusChange(status, orderID, user.token);
            if (rs.status === 200) {
                showToast("ChangeStatus", `Order #${orderID} changed to ${status}`, "success", "orderManagement");
                await fetchOrder(user.token);
            } else if (rs.status === 400) {
                showToast("ChangeStatus", `Status: ${status} invalid`, "error", "OrderManagement");
            } else if (rs.status === 404) {
                showToast("ChangeStatus", "Order not found", "error", "OrderManagement");
            }
        } catch (error) {
            console.error(error);
            showToast("ServerError", "Server Error", "error", "OrderManagement");
        }
    };

    useEffect(() => {
        if (user.Authen && user.data.role !== "Customer") {
            fetchOrder(user.token);
        }
    }, [user]);

    const tabData = {
        All: order,
        WaitShip: order.filter(i => i.status === "Pending"),
        Delivery: order.filter(i => i.status === "Shipping"),
        Complete: order.filter(i => i.status === "Completed"),
        Cancer: order.filter(i => i.status === "Canceled"),
        Return: order.filter(i => i.status === "Returned"),
    };

    const getStatusActions = (status, orderID) => {
        switch (status) {
            case "Pending":
                return [
                    { label: "Delivery", value: "Shipping" },
                    { label: "Completed", value: "Completed" },
                    { label: "Cancelled", value: "Cancelled" }
                ];
            case "Shipping":
                return [
                    { label: "Completed", value: "Completed" },
                    { label: "Cancelled", value: "Cancelled" }
                ];
            case "Completed":
                return [
                    { label: "Return", value: "Returned" }
                ];
            default:
                return [];
        }
    };

    const renderOrderRow = (it) => (
        <tr key={it.id}>
            <td>
                <div className='dropdown'>
                    <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {it.items.length} {it.items.length > 1 ? "items" : "item"}
                    </button>
                    <ul className="dropdown-menu" style={{zIndex: 1}}>
                        {
                            it?.items.map((pro, id) =>(
                                <li key={id}>
                                    <div className='BoxProduct d-flex'>
                                        <img style={{width:'3rem', height: "3rem"}} src={`${IMGPATH}=${pro?.product_image|| "default.jpg"}`}/>
                                        <div className='namePr'>
                                            <p className='name'>{pro.product_name}</p>
                                            <p className='price'>{pro.price.toLocaleString("vi-VN")} đ</p>
                                        </div>
                                        
                                    </div>
                                </li>
                            ))
                        }
                        
                    </ul>
                </div>
            </td>
            <td>{`# ${it.id}`}</td>
            <td>{it.created_at}</td>
            <td>{it.total_price.toLocaleString("vi-VN")} đ</td>
            <td>
                <div className="dropdown">
                    {["Canceled", "Returned"].includes(it.status) ? (
                        <button style={{ backgroundColor: "red", color: "white" }} className="btn btn-sm btn-outline-secondary" type="button">
                            {it.status}
                        </button>
                    ) : (
                        <>
                            <button
                                style={{
                                    backgroundColor: it.status === "Pending" ? "gray" :
                                        it.status === "Completed" ? "green" : "lightblue",
                                    color: "white"
                                }}
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {it.status || "Wait delivery"}
                            </button>
                            <ul className="dropdown-menu">
                                {getStatusActions(it.status, it.id).map((action, idx) => (
                                    <li key={idx}>
                                        <button className="dropdown-item" onClick={() => handleStatusChange(action.value, it.id)}>
                                            {action.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </td>
            <td>
                <button className="btn btn-sm btn-outline-primary">Details</button>
            </td>
        </tr>
    );

    const activeTab = Object.entries(states).find(([key, value]) => value)[0];

    return (
        <div className="OrderManagement">
            <ToastContainer containerId="OrderManagement" />
            <div className="OrderManagement-header">
                <div className="headerBar">
                    <div className="d-flex">
                        {Object.entries(defaultStates).map(([tab, _]) => (
                            <div
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={states[tab] ? `${tab} itemHeader_active` : `${tab} itemHeader`}
                            >
                                <p>{tab === "All" ? "All" : tab.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="OrderManagement-contents">
                <table className="table table-hover table-bordered align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Products</th>
                            <th>Order number</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tabData[activeTab]?.map(renderOrderRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;