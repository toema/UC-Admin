import {  DELETE_USER_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS } from "./DeleteType"

const initialState={
    loading: false,
    users:[],
    FNF:false,
    error:""
}

export var DeleteReducer=(state=initialState, action)=>{
    switch (action.type){
        case DELETE_USER_REQUEST:
            return{
                ...state,
                loading:true,
                error:""
            }
        case DELETE_USER_SUCCESS:
                return{
                    ...state,
                    loading:false,
                    users:action.payload,
                    error:""
                }
            case DELETE_USER_FAILURE:
                    return{
                    ...state,
                    loading:false,
                    users:[],
                    error:action.payload
                    }
            default: return state
    }

}

