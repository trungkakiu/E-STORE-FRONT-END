import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingPage from './scss/LoadingPage.scss'


const Loading = () =>{
    return(
        <div className="Loading-container">
            <FontAwesomeIcon className="Loading-icon" icon={faSpinner}/>
            <div className="body">
                <p>Loading...</p>
            </div>
        </div>
    )
}

export default Loading;