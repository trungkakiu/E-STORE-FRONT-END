import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const loginAPI = async (loginpart) => {
    console.log("ENV VARIABLES:", process.env.REACT_APP_API_BASE_URL);
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        identity: loginpart.EmailorPhonenumber,
        password: loginpart.Password
    });
    return response;
};

const Logout = async(token) =>{
    try {
        await axios.post(`${API_BASE_URL}/api/auth/logout`,{}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error(error)
        return;
    }
}
const Getprofile = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response;
};

const Register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            email: userData.EmailorPhonenumber,
            password: userData.Password
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
  
};

const ChangeUserInfo = async (userData, token) => {
    const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([key, value]) => value !== "" && value !== null && value !== undefined)
            .map(([key, value]) => [
                key,
                key === "date_of_birth" ? new Date(value).toISOString().split("T")[0] : value
            ])
    );

    if (Object.keys(filteredData).length === 0) {
        return { success: false, message: "Không có thay đổi nào được gửi." };
    }

    try {
        const response = await axios.put(`${API_BASE_URL}/api/user/update-profile`, filteredData, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        return { success: false, message: "Có lỗi xảy ra khi cập nhật." };
    }
};

const logOut = async (token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const FetchProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/product/products`);
        return response;
    } catch (error) {
        console.error(error);
    }
};

const FetchProduct = async (productID, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/product/product/${productID}`,{

        },{
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const fetchCategory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/category/categories`);
        return response;
    } catch (error) {
        console.error(error);
    }
};

const AddCategory = async (data, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/category/add-category`, {
            name: data.cateName,
            parent_id: data.parent_id || ""
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const DeleteCategory = async (categoryId, token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/category/delete-category/${categoryId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const UpdateCategory = async (data, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/category/update-category/${data.CataID}`, {
            name: data.cateName,
            parent_id: data.parent_id || null
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error("Lỗi API:", error.response?.data || error.message);
    }
};

const Addnewproduct = async (formdata, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/product/add-product`, 
            formdata,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }
            }
        );
        console.log("res:", response);
        return response;
    } catch (error) {
        console.error("Lỗi API:", error.response?.data || error.message);
    }
};


const FetchAllUser = async (token, role) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/users`, {
            params: { limit: 99999, role: role },
            headers: { "Authorization": `Bearer ${token}` } 
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

const ChangeUserStatus = async (userStatus, userID, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/update-status/${userID}`,
            { is_active: userStatus },
            { headers: { Authorization: `Bearer ${token}` } } 
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const GrantStaffRequest = async (userID, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/grant-staff/${userID}`,{},
            { headers: { Authorization: `Bearer ${token}` } } 
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const UploadUserAvatar = async (formData, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/update-avatar`,
            formData ,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};


const fecthCart = async(token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/cart/get`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    } catch (error) {
        console.error("Fetch cart error:", error);
        return null;
    }
};


const AddCart = async (ProductID, userID, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/cart/add`,{
                product_id:  ProductID,
                quantity: 1,
                user_id: userID
            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};


const UpdateQuanity = async (CartID, Quantity, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/cart/update/${CartID}`,{
                quantity: Quantity
            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const RemoveItem = async (CartID, token) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/cart/delete/${CartID}`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

const SendForgot = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
            email: email
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const SendOTP = async (email, OTP, NPW) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
            email: email,
            new_password: NPW,
            reset_code: OTP
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const UserNameUpdate = async (UserName, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/auth/change-username`, {
                new_username: UserName
            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const SendOTPchangeEmail = async (email, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/request-email-change`, {
            new_email: email
        },{
            headers: { Authorization: `Bearer ${token}`}
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};


const ComfirmChange = async (OTP ,email, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/auth/change-email`, {
            confirmation_code: OTP,
            new_email: email
        },{
            headers: { Authorization: `Bearer ${token}`}
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const handleChangePass = async (oldPass, NewPass, token) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/auth/change-password`, {
            new_password: NewPass,
            old_password: oldPass
        },{
            headers: { Authorization: `Bearer ${token}`}
        });
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const UpLoadIMG = async (productID, formdata, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/product/upload-image/${productID}`,
            formdata ,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const handleEditProduct = async (NewData, token) => {

    try {
        const response = await axios.put(`${API_BASE_URL}/api/product/update-product/${NewData.id}`,{
            brand: NewData.brand,
            category_id : NewData.category_id,
            description : NewData.description,
            material : NewData.material,
            name : NewData.name,
            origin : NewData.origin,
            price : NewData.price,
            stock : NewData.stock
        },{
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {

        console.error("Lỗi API:", error.response?.data || error.message);
        return error;
    }
};

const DeleteIMG = async (IMGID, token) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/product/delete-image/${IMGID}`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const DeleteProduct = async (ProductID, token) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/product/delete-product/${ProductID}`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const setDefaultIMG = async (ImgID, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/product/set-default-image/${ImgID}`,{

            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const DeleteUser = async (UserID, token) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/user/delete/${UserID}`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const fetchAdd = async (token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/user/addresses`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const AddnewAddress = async (UserAdd,token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/user/add-address`,{
                city: UserAdd.province,
                district: UserAdd.district,
                country: UserAdd.country,
                full_name: UserAdd.fullname,
                is_default: UserAdd.isDefault,
                phone_number: UserAdd.phonenumber,
                postal_code: UserAdd.zipcode,
                state: UserAdd.addressdetail,
                street_address: UserAdd.commune
            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const SetDefaultAddress = async (AddID, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/set-default-address/${AddID}`,{

            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const UpdateAddress = async (DataState, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/api/user/update-address/${DataState.id}`,{
                city: DataState.city,
                district: DataState.district,
                country: DataState.country,
                full_name: DataState.full_name,
                is_default: DataState.is_default,
                phone_number: DataState.phone_number,
                postal_code: DataState.postal_code,
                state: DataState.state,
                street_address: DataState.street_address
            },
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const RemoveAddress = async (AddID, token) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/user/delete-address/${AddID}`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;

    }
};

const fetchUserOrder = async (token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/order/list`,
            { 
                headers: { Authorization: `Bearer ${token}` }
            } 
        );
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export default {
    loginAPI, RemoveItem, ComfirmChange,
    Logout, UserNameUpdate, SendOTPchangeEmail,
    Getprofile, handleChangePass, UpLoadIMG,
    Register, handleEditProduct, DeleteProduct,
    ChangeUserInfo, DeleteIMG, setDefaultIMG,
    logOut, DeleteUser, fetchAdd, AddnewAddress,
    FetchProducts, FetchProduct, SetDefaultAddress,
    fetchCategory, UpdateAddress, RemoveAddress, 
    AddCategory, fetchUserOrder, 
    DeleteCategory,
    UpdateCategory,
    Addnewproduct,
    FetchAllUser,
    ChangeUserStatus,
    GrantStaffRequest,
    UploadUserAvatar,
    fecthCart,
    AddCart,
    UpdateQuanity,
    SendForgot,
    SendOTP
};
