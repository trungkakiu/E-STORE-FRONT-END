import './scss/UserSetting.scss'

import banner02 from '../../../img/UserIMG/AnotherIMG/background-banner-blue.jpg'
import banner03 from '../../../img/UserIMG/AnotherIMG/image.png'
import { faDashboard, faEdit, faLocationDot, faMapLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useMemo, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import ResfulAPI from '../../../Routes/RouteAPI/ResfulAPI'
import {UserContext} from '../../../Context/userContext'
import Banner01 from './decorate/banner-01'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddnewAddress from './modal/addNewAddress'
import AddressDetail from './modal/AddressDetail'


const UserSetting = () =>{
    const stateDefault = {
        changePassword: false,
        Dashboard: true
    }
    const defaultData = {
        oldPass: "",
        newPass: "",
        ReNewPass: "",
        AddressData: ""
    }
    const loadDefault = {
        changePassword: false
    }
    const openDefault = {
        addAddress: false,
        editAddress: false
    }

    const [UserData, setUserData] = useState(defaultData)
    const [State, setSate] = useState(stateDefault);
    const {user} = useContext(UserContext);
    const [isload, setIsLoad] = useState(loadDefault)
    const [userAdd, setUserAdd] = useState([]);
    const [isOpen, setIsOpen] = useState(openDefault);
    

    const showToast = (id, message, type) => {
        if (toast.isActive(id)) {
          toast.update(id, {
            render: message,
            type,
            containerId: "bot",
            autoClose: 5000, 
            closeOnClick: true
          });
        } else {
          toast[type](message, {
            toastId: id,
            containerId: "bot"
          });
        }
    };

    const handleChangePass = async() =>{
        try {
            setIsLoad(
                (prev) => ({...prev, changePassword: true})
            )
            if(!UserData.oldPass || !UserData.newPass || !UserData.ReNewPass){
                showToast("warning", "Please enter complete information!", "warning");
                setIsLoad(
                    (prev) => ({...prev, changePassword: false})
                )
                return
            }
            if(UserData.newPass.length < 6){
                showToast("warning", "New password requires at least 6 characters!", "warning");
                setIsLoad(
                    (prev) => ({...prev, changePassword: false})
                )
                return;
            }
            if((UserData.newPass !== UserData.ReNewPass) || (UserData.newPass.length !== UserData.ReNewPass.length)){
                showToast("error", "New and re-entered passwords do not match!", "error");
                setIsLoad(
                    (prev) => ({...prev, changePassword: false})
                )
                return;
            }
            const rs = await ResfulAPI.handleChangePass(UserData.oldPass,UserData.newPass, user.token)
            if(rs.status === 200){
                showToast("success" , "Password changed successfully ✅", "success");
                setIsLoad(
                    (prev) => ({...prev, changePassword: false})
                )
                return;
            }
            if(rs.status === 400){
                showToast("error" , "Old password is incorrect 🕵️", "error");
                setIsLoad(
                    (prev) => ({...prev, changePassword: false})
                )
                return;
            }
        } catch (error) {
            console.error(error)
            setIsLoad(
                (prev) => ({...prev, changePassword: false})
            )
            return;
        }
    }


    
    const fetchAddress = async() =>{
        try {
            const rs = await ResfulAPI.fetchAdd(user.token);
            if(rs.status === 200){
                setUserAdd(rs.data);
                return;
            }
            if(rs.status === 401){
                showToast("Invalid-request", "Invalid request or no access 🐝", "error");
                return;
            }
            if(rs.status === 404){
                showToast("Invalid-request", "User does not exist 🐝", "error");
                return;
            }

        } catch (error) {
            console.error(error);
            return;
        }
    }

    const setDefaultAdd = async(AddID) =>{
        try {
            if(AddID){
                const rs = await ResfulAPI.SetDefaultAddress(AddID, user.token);
                if(rs.status === 200){
                    showToast("success", "Set address default !" , "success");
                    await fetchAddress();
                }
                if(rs.status === 401){
                    showToast("error", "forbidden" , "error");
                    await fetchAddress();
                }
                if(rs.status === 404){
                    showToast("error", "Missing address" , "error");
                    await fetchAddress();
                }
            }
            return;
        } catch (error) {
            showToast("error", "Error while set default address" , "error");
            return;
        }
    }

    useEffect(()=>{
        setUserData(defaultData);
        fetchAddress();
    },[])

    const openModal = (code, data) =>{
        if(code === '1'){
            setIsOpen(
                (prev) => ({...prev, addAddress: true})
            )
        }
        if(code === '2'){
            setIsOpen(
                (prev) => ({...prev, editAddress: true})
            )
            setUserData((prev) => ({...prev, AddressData: data}))
        }
    }

    const closeModal = async(code, data) =>{
        if(code === '1'){
            setIsOpen(
                (prev) => ({...prev, addAddress: false})
            )
            await fetchAddress();
        }
        if(code === '2'){
            setIsOpen(
                (prev) => ({...prev, editAddress: false})
            )
            await fetchAddress();
        }
    }



    const Nav = () =>{
        return(
            <div className='Tager flex-column'>
                <div style={{borderTopRightRadius: "20px"}} onClick={() => setSate(
                    (prev) => ({...prev,changePassword: false, Dashboard: true})
                )} className={State.Dashboard? ("isActive") : ("path")}>
                    <p>Dashboard</p>
                </div>
                <div  onClick={() => setSate(
                    (prev) => ({...prev,Dashboard: false, changePassword: true})
                )} className={State.changePassword? ("isActive") : ("path")}>
                    <p>Edit profile</p>
                </div>
            </div>
        )
    }

    const Dashboard = () =>{
        return(
            <div className='bot'>
                <div className='d-flex'>
                    <div className='contentTopic'>
                        <div className='Dashboard'>
                            <img  src={banner03}/>
                        </div>
                    </div>
                    <Nav/>
                </div>
                <div className='banner02'>
                    <img src={banner02}/>
                </div>
            </div>
        )
    }

    const addressDetailData = useMemo(() => ({
        AddressData: UserData.AddressData,
        onlyDefault: userAdd?.length < 1
    }), [UserData.AddressData, userAdd]);

    const ProfileEdit = () =>{
        return(
            <div className='bot'>
            <ToastContainer containerId={"bot"}/>
            <AddnewAddress show={isOpen.addAddress} close={()=>closeModal('1')} data={{UserData : user.data.id, AddressData : userAdd}}/>
            <AddressDetail show={isOpen.editAddress} close={()=>closeModal('2')} data={addressDetailData}/>    
            <div className='d-flex'>
                <div className='contentTopic'>
                    <div className='changePass'>
                        <p style={{fontSize: "22px", fontWeight: "600"}} >change Password</p>
                        <p style={{fontSize: "14px", fontWeight: "500", color: "gray"}}>Please enter your current password and a new password of your choice.</p>
                        <input
                        value={UserData.oldPass}
                        onChange={(e)=>setUserData(
                            (prev)=>({...prev, oldPass: e.target.value})
                        )}
                        type='password'
                        placeholder='Enter old password'/>
                        <div className='d-flex'>
                        <input 
                        value={UserData.newPass}
                        onChange={(e)=>setUserData(
                            (prev)=>({...prev, newPass: e.target.value})
                        )}
                        type='password'
                        placeholder='Enter new password'/>
                        <input 
                        value={UserData.ReNewPass}
                        onChange={(e)=>setUserData(
                            (prev)=>({...prev, ReNewPass: e.target.value})
                        )}
                        placeholder='New password again'/>
                        </div>
                    
                        <button disabled={isload.changePassword} onClick={handleChangePass} className={isload.changePassword ? ('btn btn-secondary') : ('btn btn-success')}>
                            {isload.changePassword === true? ("Saving..."):("Save")}
                        </button>
                    </div>
                </div>
                <Nav/>
            </div>
            <div className='banner02'>
                <div className='Address'>
                    <div className='d-flex AddressHeader'>
                        <p>My Address {`[ ${userAdd.length} ]`}</p>
                        {
                        userAdd.length < 5 && (
                            <button onClick={()=>openModal('1')}>
                            Add new address
                            </button>
                            ) 
                        }
                    </div>
                    {
                        userAdd.length !== 0 ? (
                            <>
                            <div className='AddressContents'>
                                {userAdd?.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)).map((it, id) => (
                                    <div className='addItem'>
                                        <div className='d-flex' style={{justifyContent: "space-between"}}>
                                            <p style={{fontWeight: "500"}}>Address: {`${it.street_address? it.street_address : "No commune"} - ${it.district? it.district : "No district"} - ${it.city? it.city : "No City "}`}</p>
                                            <div>
                                                <FontAwesomeIcon
                                                onClick={()=>openModal("2", it)} 
                                                icon={faEdit} className='ic78s'/>
                                                <input
                                                checked={it.is_default}
                                                onChange={()=>setDefaultAdd(it.id)}
                                                className='isDefault'
                                                type='checkbox'/>
                                            </div>
                                        </div> 
                                        <p> {`[ detailed address: ${it.state} ]`}</p>
                                        <p>SDT: {it.phone_number}</p>
                                    </div>
                                ))}
                            </div>
                            </>
                        ): (
                            <>
                            <div className='noAdd'>
                                <FontAwesomeIcon icon={faMapLocationDot} className='icon'/>
                                <p className='p'>You do not have an address</p>
                            </div>
                            </>
                        )
                    }
                   
                </div>
            </div>
        </div>
        )
    }
    return(
        <div className="UserSetting-container">
            <ToastContainer containerId={"Profile"}/>
            <div className="contents d-flex">
                <Banner01/>
                {
                    State?.Dashboard &&(
                        <Dashboard/>
                    )
                }
                {
                    State?.changePassword && (
                        <>
                        <ProfileEdit/>
                        </>

                    )
                }
            </div>
        </div>
    )
}

export default UserSetting;