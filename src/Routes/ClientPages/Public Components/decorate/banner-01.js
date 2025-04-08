import '../scss/banner.scss'
import banner from '../../../../img/UserIMG/AnotherIMG/hinh-nen-don-gian.jpg' 


const banner01 = () =>{
    return(
        <div className='banner01' >
            <img style={{width: "100%", height: "100%", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"}} src={banner} alt='Hehe'/>
        </div>
    )
}

export default banner01;