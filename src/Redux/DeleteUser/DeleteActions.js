import {DELETE_USER_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS} from './DeleteType'

export const DeleteUserRequest=()=>{
    return{
        type: DELETE_USER_REQUEST
    }
}

export const DeleteUserSuccess=(users)=>{
    return{
        type: DELETE_USER_SUCCESS,
        payload:users
    }
}

export const DeleteUserFailure=error=>{
    return{
        type: DELETE_USER_FAILURE,
        payload:error
    }
}