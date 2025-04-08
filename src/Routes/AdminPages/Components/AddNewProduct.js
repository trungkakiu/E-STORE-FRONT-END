import '../Scss/Addnewproduct.scss'
import { faPlus, faPuzzlePiece, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../img/UserIMG/avatar/boy01.png'
import React, { useState, useRef, useContext, useEffect } from "react";
import { ProductContext } from '../../../Context/productContext';
import { toast, ToastContainer } from 'react-toastify';
import ResfulAPI from '../../RouteAPI/ResfulAPI';
import { UserContext } from '../../../Context/userContext';



const Addnewproduct = () =>{
    const {user} = useContext(UserContext);
    const { products, category, addProduct, removeProduct, updateProduct, fetchProducts, fecthCategory } = useContext(ProductContext);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    const [topicImg, setTopicImg] = useState();
    const inputRef = useRef(null);
    const prd = {
        name: "",
        description: "",
        price : "",
        stock: "",
        material: "",
        origin: "",
        brand: "",
        category_id: "",
        discount: "",
        default_image: ""
    }
    const [CateFilter, setCateFilter] = useState("");
    const [ProductData, setProductData] = useState(prd);
    const [isLoading, setIsLoading] = useState(false);
    const [OtherPicture, setOtherPicture] = useState([]);
    const fileInputRef = useRef(null);
    const fileInputRefTopic = useRef(null);

    const handleClick = (code) => {
        if(code === "topic"){
            fileInputRefTopic.current.click();
        }
        if(code === "another"){
            fileInputRef.current.click(); 
        }
        return;
    };

    const handleFileChange = (code, event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return; 
        if (files) {
            if (code === "topic") {
                setTopicImg(files[0]);
            }
            if (code === "another") {
                setOtherPicture(prev => [...prev, ...files]);
            }
        }
    };

    const handleUpload = async () => {
        if (!ProductData.name || !ProductData.price || !ProductData.category_id 
            || !ProductData.stock || !ProductData.brand || !ProductData.material) {
            toast.error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }
    
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", ProductData.name);
        formData.append("description", ProductData.description);
        formData.append("price", ProductData.price);
        formData.append("stock", ProductData.stock);
        formData.append("material", ProductData.material);
        formData.append("origin", ProductData.origin);
        formData.append("brand", ProductData.brand);
        formData.append("discount", ProductData.discount);
        formData.append("category_id", ProductData.category_id);
        console.log("obj: ",OtherPicture)
        if (topicImg) {
            formData.append("default_image", topicImg);
            if (Array.isArray(OtherPicture) && OtherPicture.length > 0) {
                OtherPicture.forEach((file) => {
                    formData.append("sub_images", file);
                });
            }
        } else {
            toast.error("Bạn chưa chọn ảnh sản phẩm!");
            setIsLoading(false);
            return;
        }
        const toastId = toast.loading("Uploading product...");
        try {
            const response = await ResfulAPI.Addnewproduct(formData, user.token);
           
            if (response.status === 201) {
                toast.update(toastId, {
                render: "Add new product successfully !",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                });
                setIsLoading(false);
            } else {
                toast.update(toastId, {
                render: "Add product failed !",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                });
                setIsLoading(false);
            }
        } catch (error) {
            toast.update(toastId, {
            render: "Error while adding product !",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    const filterProduct = category.filter(item =>
        item.name.toLowerCase().includes(CateFilter.toLowerCase()) 
    );

    return(
        <div className="Addcontainer d-flex">
            <ToastContainer/>
            <div className="left">
                <div className="upleft"> 
                    <p className='ptp0992'>General Infomation</p>
                    <label className='lb776s'>Name Product</label>
                    <input 
                    className='ipn77s'
                    value={ProductData.name}
                    onChange={(e) => 
                        setProductData(prev => ({ 
                        ...prev, 
                        name: e.target.value 
                        }))
                    }
                    />
                    <p className='pty765'>Description Product</p>
                    <textarea 
                    value={ProductData.description} 
                    onChange={(e) => 
                        setProductData(prev => ({ 
                        ...prev, 
                        description: e.target.value 
                        }))
                    }
                    className='txa8837j'></textarea>
                    <div className="d-flex div99as">
                        <div className='divLas78'>
                            <p className='pmt882'>Metarial</p>
                            <p className='pmtT76s'>Decription your metarial</p>
                            <input
                            value={ProductData.material}
                            onChange={(e) => 
                                setProductData(prev => ({ 
                                ...prev, 
                                material: e.target.value 
                                }))
                            }
                            className='intbr772' />
                        </div>
                        <div className='divI77a'>
                            <p className='pbrO8as'>Brand</p>
                            <p className='pbrU761'>Wirte your product brand</p>
                            <input
                            value={ProductData.brand}
                            onChange={(e) => 
                                setProductData(prev => ({ 
                                ...prev, 
                                brand: e.target.value 
                                }))
                            } 
                            className='inp8sww'/>
                        </div>
                    </div>
                </div>
                <div className="downleft">
                    <div className='divU88s'>
                        <p className='p98ss'>Pricing and Stock</p>
                        <div className="d-flex divY67">
                            <div className='p882s'>
                                <div className='Po99s'>
                                    <label>Base Pricing</label>
                                    <input
                                    value={ProductData.price}
                                    type='number'
                                     onChange={(e) => 
                                        setProductData(prev => ({ 
                                        ...prev, 
                                        price: e.target.value 
                                        }))
                                    }/>
                                </div>
                                <div className='p6NS8'>
                                <label>Discount</label>
                                <input type='number' value={ProductContext.discount}
                                onChange={(e) => 
                                    setProductData(prev => ({ 
                                    ...prev, 
                                    discount: e.target.value 
                                    }))
                                }
                                />
                                 
                                </div>
                                
                            </div>
                            <div className='p9snn'>
                                <div className='pt5as'>
                                    <label>Stock</label>
                                    <input value={ProductData.stock}
                                    type='number'
                                     onChange={(e) => 
                                        setProductData(prev => ({ 
                                        ...prev, 
                                        stock: e.target.value 
                                        }))
                                    }/>
                                </div>
                               <div className='pM9si'>
                                    <label>Origin</label>
                                    <input value={ProductData.origin}
                                     onChange={(e) => 
                                        setProductData(prev => ({ 
                                        ...prev, 
                                        origin: e.target.value 
                                        }))
                                    }/>
                               </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="upright">
                    <div className='d-flex'>
                        <p className='pK982s'>Upload Img</p> 
                        <button disabled={OtherPicture.length === 0 ? true : false}
                        onClick={()=>setOtherPicture([])} className='btn btn-warning'>Clear</button>
                    </div>
                    

                    <div className='uploadImg d-flex'>
                        <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRefTopic}
                        style={{ display: "none" }}
                        onChange={(event) => handleFileChange("topic", event)}
                        />
                        <div onClick={()=>handleClick("topic")} style={{cursor: "pointer"}} className='Upload9sa'>
                            {topicImg == null ? (
                                <>  
                                    <FontAwesomeIcon icon={faPlus} className='ic9jjs'/>
                                </>
                            ) : (
                                <>  
                                    <img src={URL.createObjectURL(topicImg)} 
                                    style={{width: "100%", height: "100%", borderRadius: "10px", objectFit: "scale-down"}}/>
                                </>
                            )}
                           
                        </div>
                        <div className='UploadO9ss'>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(event) => handleFileChange("another", event)}
                            />
                            <div onClick={()=>handleClick("another")} className='addAnother' style={{cursor: "pointer"}}>
                                <FontAwesomeIcon icon={faPlus} className='ic9jjs'/>
                            </div>
                            <div className='AnotherIMG'>
                                {
                                     Array.isArray(OtherPicture) && OtherPicture.map((file, id) => (
                                        <img key={id} src={URL.createObjectURL(file)} className='card' />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="downright">
                    <div className='drdiv90as'>
                        <div className='d-flex'>
                            <p className='pdr9ns'>Category</p>
                            <div className='d-flex divMlas'>
                                <FontAwesomeIcon icon={faSearch} className='ico99s'/>
                                <input value={CateFilter}
                                onChange={(e) => setCateFilter(e.target.value)}
                                placeholder='find tag#'/>
                            </div>
                        </div>
                        <label>Product Category</label>
                        <div className='drdiv55s flex-wrap' style={{marginBottom: "10px"}}>
                           {
                            filterProduct?.map((item, index) =>(
                                <>
                                <div onClick={()=>setProductData((prev) => ({...prev, category_id: item.id}))} className={ProductData.category_id == item?.id ? "cardItemActive" : 'cardItem'}>
                                    <p className='item' key={index}> {item.name} </p>
                                </div>
                                
                                </>
                            ))
                           }
                        </div>
                        <p onClick={handleUpload} className='uploadPr btn btn-success' style={{pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.5 : 1}}>
                            {isLoading ? "Đang tải lên..." : "Upload product"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addnewproduct;