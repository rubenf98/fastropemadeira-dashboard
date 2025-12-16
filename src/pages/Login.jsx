import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import {
  login,
  setAuthorizationToken,
} from "../redux/redux-modules/auth/actions";
import { connect } from "react-redux";
import { useNavigate } from "react-router";

function Login(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: undefined, password: undefined });

  const handleSubmit = () => {
    props.login(form).then((response) => {
      const token = response.value.data.access_token;
      localStorage.setItem("token", token);
      props.setAuthorizationToken(token);
    });
  };

  useEffect(() => {
    if (props.isAuthenticated) {
      navigate("/tracker");
    }
  }, [props.isAuthenticated]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.formContainer}>
          <div>
            <h2>Iniciar Sessão</h2>
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
        <div className={styles.screenBackground}>
          <span className={styles.screenBackgroundShape4}></span>
          <span className={styles.screenBackgroundShape3}></span>
          <span className={styles.screenBackgroundShape2}></span>
          <span className={styles.screenBackgroundShape1}></span>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(login(data)),
    setAuthorizationToken: (token) => dispatch(setAuthorizationToken(token)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.auth.data,
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
