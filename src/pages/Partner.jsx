import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./Partner.module.css";
import { Cascader, DatePicker, Input, Popconfirm } from "antd";
import {
  fetchTransactionPartner,
  liquidateTransactionPartner,
} from "../redux/redux-modules/transactionPartner/actions";
import { login } from "../redux/redux-modules/auth/actions";
import dayjs from "dayjs";
import { setAuthorizationToken } from "../redux/redux-modules/auth/actions";
import { connect } from "react-redux";

function Partner(props) {
  const { transaction } = props;
  const [openPopConfirm, setOpenPopConfirm] = useState([false, false]);
  const [passwordInput, setPasswordInput] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    type: undefined,
    amount: undefined,
  });

  useEffect(() => {
    props.fetchTransactionPartner(id);
  }, []);

  const handlePasswordCheck = (type) => {
    if (passwordInput) {
      props
        .login({ email: props?.user?.email, password: passwordInput })
        .then((response) => {
          const token = response.value.data.access_token;
          localStorage.setItem("token", token);

          setAuthorizationToken(token);
          setErrorMessage(undefined);
          props.liquidateTransactionPartner(id, { type: type }).then(() => {
            // navigate("/tracker");
            resetStatus();
          });
        })
        .catch(() => {
          setErrorMessage("Credenciais incorretas!");
        });
    }
  };

  const resetStatus = () => {
    setErrorMessage(undefined);
    setPasswordInput(undefined);
    setOpenPopConfirm([false, false]);
  };

  useEffect(() => {
    if (transaction.id) {
      setForm({
        description: undefined,
        category: [transaction?.category?.id, transaction?.subCategory?.id],
        date: dayjs(transaction.date),
        type: transaction.type,
        amount: transaction?.amount.replace("-", ""),
      });
    }
  }, [transaction]);

  console.log(props.partner, "props.partner");

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{props?.partner?.name}</h2>
      <section className={styles.form}></section>

      <div className={`${styles.card}`}>
        <div className={`${styles.card_content}`}>
          <h4>A pagar (pendente)</h4>
          <span>{props.partner.pending_payment}€</span>
        </div>
        <Popconfirm
          placement="top"
          open={openPopConfirm[0]}
          // onOpenChange={(open) => setOpenPopConfirm(open)}
          title={
            <div>
              <p style={{ marginTop: 0 }}>
                Introduza a sua password para confirmar a ação:
              </p>

              <Input
                status={errorMessage ? "error" : ""}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                type="password"
                autoComplete={false}
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errorMessage}
              </span>
            </div>
          }
          onCancel={resetStatus}
          onConfirm={() => handlePasswordCheck("pending_payment")}
        >
          <button
            onClick={() => setOpenPopConfirm(true)}
            className={styles.pending_payment}
            type="submit"
          >
            Liquidar Dívida
          </button>
        </Popconfirm>
      </div>

      <div className={`${styles.card}`}>
        <div className={`${styles.card_content}`}>
          <h4>A receber (pendente)</h4>
          <span>{props.partner.pending_income}€</span>
        </div>
        <Popconfirm
          placement="top"
          open={openPopConfirm[1]}
          // onOpenChange={(open) => setOpenPopConfirm(open)}
          title={
            <div>
              <p style={{ marginTop: 0 }}>
                Introduza a sua password para confirmar a ação:
              </p>

              <Input
                status={errorMessage ? "error" : ""}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                type="password"
                autoComplete={false}
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errorMessage}
              </span>
            </div>
          }
          onCancel={resetStatus}
          onConfirm={() => handlePasswordCheck("pending_income")}
        >
          <button
            onClick={() => setOpenPopConfirm(true)}
            className={styles.pending_income}
            type="submit"
          >
            Liquidar Crédito
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransactionPartner: (id) => dispatch(fetchTransactionPartner(id)),
    liquidateTransactionPartner: (id, data) =>
      dispatch(liquidateTransactionPartner(id, data)),
    login: (data) => dispatch(login(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    partner: state.transactionPartner.current,
    data: state.transactionCategory.data,
    transaction: state.transaction.current,
    loading: state.transactionCategory.loading,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Partner);
