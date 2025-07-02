import { useContext, useState, useEffect } from "react";
import '../scss/ratting.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";
import { UserContext } from "../../../../Context/userContext";
import { toast, ToastContainer } from "react-toastify";

const RatingWithComment = ({ PrdID, UserRatting }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useContext(UserContext);
  const [ratting, setRatting] = useState(null);

  useEffect(() => {
    const filteredRatting = UserRatting?.filter((m) => m.product_id === PrdID);
    setRatting(filteredRatting?.length > 0 ? filteredRatting[0] : null);
  }, [UserRatting, PrdID]);

  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(0);
  const handleClick = (index) => setSelected(index);

  const FetchRatting = async () => {
    try {
      const rs = await ResfulAPI.GetProductRating(user.data.id, user.token);
      if (rs.status === 200) {
        const filteredRatting = rs.data?.filter((m) => m.product_id === PrdID);
        setRatting(filteredRatting?.length > 0 ? filteredRatting[0] : null);
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const rs = await ResfulAPI.ProductRatting(
        PrdID,
        { rating: selected, comment },
        user.token
      );
      if (rs.status === 201) {
        toast.success("Thank you for your review");
        setSelected(0);
        setComment("");
        await FetchRatting();
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <FontAwesomeIcon
          key={index + 1}
          icon={faStar}
          className={`star ${index + 1 <= rating ? "Staractive" : "Star"}`}
        />
      ));
  };


  return (
    <div className="Ratting flex-column">
      {ratting ? (
        <div className="existing-rating d-flex">
         
            <div className="coments">
                <p>Comment</p>
                <textarea
                value={ratting.comment}
                readOnly
                ></textarea>
            </div>
            <div className="starRating">
                <p>Rating</p>
            <div className="ChooseStar">{renderStars(ratting.rating)}</div>
            </div>
        </div>
      ) : (
        <div className="d-flex">
          <div className="coments">
            <p>Comment</p>
            <textarea
              maxLength={200}
              placeholder="Let's talk a little about the product"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="starRating">
            <p>Evaluate</p>
            <div className="ChooseStar">
              {Array(5)
                .fill()
                .map((_, index) => {
                  const starIndex = index + 1;
                  return (
                    <FontAwesomeIcon
                      key={starIndex}
                      icon={faStar}
                      className={`star ${
                        starIndex <= (hovered || selected) ? "Staractive" : "Star"
                      }`}
                      onMouseEnter={() => handleMouseEnter(starIndex)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(starIndex)}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {!ratting && (
        <div className="option">
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={!selected || !comment}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default RatingWithComment;