import { useState } from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import "../scss/ForgotPassword.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResfulAPI from "../../../RouteAPI/ResfulAPI";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const State1 = {
  hidden: { opacity: 0, x: 150 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -150, transition: { duration: 0.3 } },
};

const State2 = {
  hidden: { opacity: 0, x: 150 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -150, transition: { duration: 0.3 } },
};

const State3 = {
  hidden: { opacity: 0, x: 150 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -150, transition: { duration: 0.3 } },
};
const ForgotPassword = ({ show, close }) => {
  const defaultState = {
    state1: true,
    state2: false,
    state3: false,
  };
  const LineDefault = {
    state1: "LineActive",
    state2: "LineOff",
    state3: "LineOff",
  };
  const UserData = {
    Email: "",
    OTP: "",
    NewPassword: "",
  };
  const [isLoad, setIsLoad] = useState(false);
  const [UserInput, setUserInput] = useState(UserData);
  const [state, setState] = useState(defaultState);
  const [stateLine, setStateLine] = useState(LineDefault);

  const SendEmail = async () => {
    try {
      if (!UserInput.Email) {
        toast.warning("Please enter your email", { containerId: "top-right" });
        return;
      }
      setIsLoad(true);
      const respone = await ResfulAPI.SendForgot(UserInput.Email);
      if (respone.status === 200) {
        setState((prev) => ({ ...prev, state1: false, state2: true }));
        setStateLine((prev) => ({
          ...prev,
          state1: "LineOn",
          state2: "LineActive",
        }));
        setIsLoad(false);
      }
      if (respone.status === 404) {
        toast.warning("There is no account associated with your email.", {
          containerId: "top-right",
        });
        setIsLoad(false);
        return;
      }
    } catch (error) {
      toast.warning("There is no account associated with your email.", {
        containerId: "top-right",
      });
      console.error(error);
      return;
    }
  };

  const NextStep = () => {
    if (!UserInput.Email) {
      toast.warning("Please enter Email that that received OTP before !", {
        containerId: "top-right",
      });
      return;
    }
    setState((prev) => ({ ...prev, state1: false, state2: true }));
    setStateLine((prev) => ({
      ...prev,
      state1: "LineOn",
      state2: "LineActive",
    }));
  };

  const PrevStep = () => {
    setState((prev) => ({ ...prev, state1: true, state2: false }));
    setStateLine((prev) => ({
      ...prev,
      state1: "LineActive",
      state2: "LineOff",
    }));
  };
  const SendOTP = async () => {
    try {
      setIsLoad(true);
      const respone = await ResfulAPI.SendOTP(
        UserInput.Email,
        UserInput.OTP,
        UserInput.NewPassword
      );
      if (respone.status === 200) {
        toast.success("Password changed successfully !", {
          containerId: "top-right",
        });
        setTimeout(() => {
          setIsLoad(false);
          setUserInput(UserData);
          setStateLine(LineDefault);
          close();
        }, 500);
        return;
      }
      if (respone.status === 422) {
        setState((prev) => ({ ...prev, state2: false, state3: true }));
        setStateLine((prev) => ({
          ...prev,
          state2: "LineOn",
          state3: "LineActive",
        }));
        setIsLoad(false);
        return;
      }
      if (respone.status === 403) {
        toast.warning("OTP is incorrect or expired", {
          containerId: "top-right",
        });
        setIsLoad(false);
      }
    } catch (error) {
      setIsLoad(false);
      console.error(error);
      return;
    }
  };
  const ChangePassWord = async () => {
    try {
      if (UserInput.NewPassword.length < 6) {
        toast.warning("Password must be at least 6 characters !", {
          containerId: "top-right",
        });
        return;
      }
      setIsLoad(true);
      const respone = await ResfulAPI.SendOTP(
        UserInput.Email,
        UserInput.OTP,
        UserInput.NewPassword
      );
      if (respone.status === 200) {
        toast.success("Password changed successfully !", {
          containerId: "top-right",
        });
        setTimeout(() => {
          setIsLoad(false);
          setUserInput(UserData);
          setStateLine(LineDefault);
          close();
        }, 1500);
        return;
      }
      if (respone.status === 422) {
        setState((prev) => ({ ...prev, state2: false, state3: true }));
        setStateLine((prev) => ({
          ...prev,
          state2: "LineOn",
          state3: "LineActive",
        }));
        setIsLoad(false);
        return;
      }
      if (respone.status === 403) {
        toast.warning("OTP is incorrect or expired", {
          containerId: "top-right",
        });
        setIsLoad(false);
      }
    } catch (error) {
      setIsLoad(false);
      console.error(error);
      return;
    }
  };

  //===================================================================================================================================//

  return (
    <Modal
      style={{ paddingTop: "4%" }}
      show={show}
      onHide={close}
      animation={false}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
      >
        <Modal.Body style={{ height: "300px" }}>
          <ToastContainer containerId="top-right" />
          <div className="ForgotPassword-container">
            <div className="ForgotHeader">
              <div className="pgHead">
                <p>Forgot Password</p>
              </div>
              <div className="d-flex stateLine">
                {stateLine.state1 !== "LineOn" ? (
                  <>
                    <div
                      className={
                        stateLine.state1 ? `${stateLine.state1}` : "LineOff"
                      }
                      style={{
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <p>Email</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={
                        stateLine.state1 ? `${stateLine.state1}` : "LineOff"
                      }
                      style={{
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    ></div>
                  </>
                )}
                {stateLine.state2 !== "LineOn" ? (
                  <>
                    <div
                      className={
                        stateLine.state2 ? `${stateLine.state2}` : "LineOff"
                      }
                      style={{ borderRadius: "0px" }}
                    >
                      <p>Code</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={
                        stateLine.state2 ? `${stateLine.state2}` : "LineOff"
                      }
                      style={{ borderRadius: "0px" }}
                    ></div>
                  </>
                )}
                {stateLine.state3 !== true ? (
                  <>
                    <div
                      className={
                        stateLine.state3 ? `${stateLine.state3}` : "LineOff"
                      }
                      style={{
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      }}
                    >
                      <p>New</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div></div>
                  </>
                )}
              </div>
            </div>

            {state?.state1 === true && (
              <>
                <motion.div
                  key="State1"
                  variants={State1}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "absolute", width: "100%" }}
                >
                  <div className="State1">
                    <div className="Header">
                      <p>
                        Get OTP if you don't have OTP, if you already have OTP
                        enter the Email that received OTP
                      </p>
                    </div>
                    <div className="EmailInput">
                      <label>Email</label>
                      <input
                        placeholder="Enter your Email"
                        value={UserInput.Email}
                        onChange={(e) =>
                          setUserInput((prev) => ({
                            ...prev,
                            Email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="d-flex">
                      <button
                        disabled={isLoad}
                        onClick={() => SendEmail()}
                        className={isLoad ? "btn-load btn" : "btn btn-on"}
                      >
                        <p>{isLoad ? "Sending..." : "Send"}</p>
                      </button>
                      <p
                        style={{ color: UserInput.Email ? "blue" : "gray" }}
                        onClick={NextStep}
                        className="HaveOTP"
                      >
                        I have OTP!
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
            {state?.state2 === true && (
              <>
                <motion.div
                  key="State2"
                  variants={State2}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "absolute", width: "100%" }}
                >
                  <div className="State2">
                    <div className="Header">
                      <p>
                        Please enter the OTP sent to Email: {UserInput.Email}
                      </p>
                    </div>
                    <div className="OTPInput">
                      <label>OTP</label>
                      <input
                        placeholder="Enter OTP"
                        value={UserInput.OTP}
                        onChange={(e) =>
                          setUserInput((prev) => ({
                            ...prev,
                            OTP: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="d-flex">
                      <p onClick={PrevStep} className="PrevStep">
                        {" "}
                        {`< `}Send Mail
                      </p>
                      <button
                        disabled={isLoad}
                        onClick={() => SendOTP()}
                        className={isLoad ? "btn-load btn" : "btn btn-on"}
                      >
                        <p>{isLoad ? "Vetifing..." : "Vetify"}</p>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
            {state?.state3 === true && (
              <>
                <motion.div
                  key="State3"
                  variants={State3}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ position: "absolute", width: "100%" }}
                >
                  <div className="State3">
                    <div className="Header">
                      <p>
                        Enter a new password for the account: {UserInput.Email}
                      </p>
                    </div>
                    <div className="NewPassInput">
                      <label>New password</label>
                      <input
                        placeholder="Enter new password"
                        value={UserInput.NewPassword}
                        onChange={(e) =>
                          setUserInput((prev) => ({
                            ...prev,
                            NewPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      disabled={isLoad}
                      onClick={() => ChangePassWord()}
                      className={isLoad ? "btn-load btn" : "btn btn-on"}
                    >
                      <p>{isLoad ? "Loading..." : "Confirm"}</p>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
            <div></div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default ForgotPassword;
