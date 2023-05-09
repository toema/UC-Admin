import { combineReducers } from "redux";
import { AddReducer } from "./AddUser/AddReducer";
import { TransferReducer } from "./TransferUser/TransferReducer";
import { DeleteReducer } from "./DeleteUser/DeleteReducer";

export const rootReducer =combineReducers({
    Add:AddReducer,
    Transfer: TransferReducer,
    Delete:DeleteReducer
})

