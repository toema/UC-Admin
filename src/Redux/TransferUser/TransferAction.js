import {TRANSFER_USER_REQUEST,TRANSFER_USER_SUCCESS,TRANSFER_USER_FAILURE,TRANSFER_TO_USER_SUCCESS} from "./TransferType"


export const TransferUserRequest=()=>{
    return{
        type: TRANSFER_USER_REQUEST
    }
}

export const TransferUserSuccess=users=>{
    return{
        type: TRANSFER_USER_SUCCESS,
        payload:users
    }
}
export const TransferToUserSuccess=users=>{
    return{
        type: TRANSFER_TO_USER_SUCCESS,
        payload:users
    }
}

export const TransferUserFailure=error=>{
    return{
        type: TRANSFER_USER_FAILURE,
        payload:error
    }
}