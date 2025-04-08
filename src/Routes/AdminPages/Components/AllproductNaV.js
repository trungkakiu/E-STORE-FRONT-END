import { faPuzzlePiece, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Scss/Allproduct.scss'
import { Link, NavLink } from 'react-router-dom';

const AllproductNav = () =>{
    return(
        <div className="Allproduct-topic">
            <div className="search d-flex">
                <FontAwesomeIcon icon={faSearch} className='ic912'/>
                <input placeholder='Search for product'/>
            </div>
            <div className="tagtag d-flex">
                <Link className='link90pk' to={"/Admin/Product/AddProduct"}>
                    <div className="addnewproduct">
                        <FontAwesomeIcon icon={faSquarePlus} className='ic9112'/>
                        <p>Add new products</p>
                    </div>
                </Link>
                
                <Link to={"/Admin/Product/allProducts"} className={"navk01w"}>
                    <div className="showproduct">
                        <FontAwesomeIcon icon={faPuzzlePiece} className='ic0112'/>
                        <p>Show All Products</p>
                    </div>
                </Link>
                
                <div className='p0822'>
                    <div className='div91as div0'>
                        <p>in develop</p>
                    </div>
                    <div className='div8as div0'>
                        <p>in develop</p>
                    </div>
                    <div className='div76as div0'>
                        <p>in develop</p>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default AllproductNav;