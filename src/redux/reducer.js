import { combineReducers } from "redux";
import auth from "./redux-modules/auth";
import transactionCategory from "./redux-modules/transactionCategory";
import transaction from "./redux-modules/transaction";
import tracker from "./redux-modules/tracker";


export const reducer = combineReducers({
    auth,
    transactionCategory,
    transaction,
    tracker
});
