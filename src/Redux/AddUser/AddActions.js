import {ADD_USER_FAILURE, ADD_USER_REQUEST, ADD_USER_SUCCESS,ADD_USER_PARTITION,ADD_USER_VMTEMPLATES} from './AddType'

export const AddUserRequest=()=>{
    return{
        type: ADD_USER_REQUEST
    }
}

export const AddUserSuccess=(users)=>{
    return{
        type: ADD_USER_SUCCESS,
        payload:users
    }
}

export const AddUserFailure=error=>{
    return{
        type: ADD_USER_FAILURE,
        payload:error
    }
}

export const AddUserLPartition=(data)=>{
    return{
        type: ADD_USER_PARTITION,
        payload:data
    }
}
export const AddUserVMTemplates=(data)=>{
    return{
        type: ADD_USER_VMTEMPLATES,
        payload:data
    }
}
// export const Fetchusers=data=>{
// return(dispatch=>{
//     dispatch(AddUserRequest)
// axios.post("/",data)
// .then(response=>{
//     const users=response.data
//     dispatch(AddUserSuccess(users))
// })
// .catch(error=>{
//     const errorMsg=error.message
//     dispatch(AddUserFailure(errorMsg))
// })
// })
// }