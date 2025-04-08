import { useState, useCallback, useContext, useEffect } from "react";
import "../Scss/Productmanagements.scss"
import AllproductNav from "./AllproductNaV";
import Addnewproduct from "./AddNewProduct";
import { ProductContext } from "../../../Context/productContext";

const Productmanagements = () =>{
    const [isChoose, setisChoose] = useState("all")
    const { products, category, addProduct, removeProduct, updateProduct, fetchProducts, fecthCategory } = useContext(ProductContext);

    useEffect(() =>{
        fecthCategory();
        fetchProducts();
    },[])

    const renderContent = useCallback(() => {
        switch (isChoose) {
            case "all":
                return <AllproductNav />;
            case "add":
                return <Addnewproduct/>
           
        }
    }, [isChoose]);


    return( 
        <div className="Prt-container">
            <div className="dashboard">
                <div className="topcontent d-flex">
                   <div onClick={()=>setisChoose("all")} className={isChoose === "all" ? "choose allproduct bar" : "allproduct bar" }> 
                        <p className="p9123">All product</p>
                        <p className="p7712">{products.length}</p>
                   </div>
                   <div onClick={()=>setisChoose("sale")} className={isChoose === "sale" ? "choose sellinday bar" : "sellinday bar"}>
                        <p className="p0122">Sale in day</p>
                        <p className="p7871">0</p>
                   </div>
                   <div onClick={()=>setisChoose("order")} className={isChoose === "order" ? "choose orderinday bar" : "orderinday bar"}>
                        <p className="p7299">Order in day</p>
                        <p className="p6129">0</p>
                   </div>
                </div>
                <div className="contents">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Productmanagements;

