import {TRANSFER_USER_REQUEST,TRANSFER_TO_USER_SUCCESS,TRANSFER_USER_SUCCESS,TRANSFER_USER_FAILURE} from "./TransferType"

const initialState={
    laoding: false,
    users:{
        to:{},
        from:{},
        total:{}
    },
    error:["error"],
}


export var TransferReducer=(state=initialState, action)=>{
    switch (action.type){
        case TRANSFER_USER_REQUEST:
            return{
                ...state,
                // users:[],
                loading:true
            }
        case TRANSFER_USER_SUCCESS:
            // let bindingDevices=(state)=>{return(state.users.bind(action.payload))}
                return{
                    ...state,
                    loading:false,
                    users:{...state.users,from:action.payload
                        ,total:{...state.users.total,user1:action.payload}
                    },
                    error:""
                }
        case TRANSFER_TO_USER_SUCCESS:
            // let bindingDevices=(state)=>{return(state.users.bind(action.payload))}
                return{
                    ...state,
                    loading:false,
                    // users:state={...state.users,...action.payload},
                    users:{...state.users,to:action.payload
                        ,total:{...state.users.total,user2:action.payload}
                        // ,total:{phoneDevices:[...state.users.from.phoneDevices?.concat(action.payload.phoneDevices)],VM:[...state.users.from.VM?.concat(action.payload.VM)],deviceProfiles:[...state.users.from.deviceProfiles?.concat(action.payload.deviceProfiles)]}
                    },
                    error:""
                }
            case TRANSFER_USER_FAILURE:
                    return{
                        ...state,
                       loading:false,
                    //    users:[],
                        error:action.payload
                    }
                    
            
            default: return state
    }

}