import {  ADD_USER_FAILURE, ADD_USER_REQUEST, ADD_USER_SUCCESS,ADD_USER_PARTITION,ADD_USER_VMTEMPLATES } from "./AddType"

const initialState={
    laoding: false,
    users:[],
    error:"",
    Partitions:["None"],
    VMTemplates:[],
}
function repeater(state=initialState,action){
switch(action.type){
    case ADD_USER_VMTEMPLATES:{
    for (let i in action.payload){
    if (!state.VMTemplates.includes({label:action.payload[i]})) {
        // ✅ only runs if value not in array
        state.VMTemplates.push({label:action.payload[i]});
      }
      }
      return state.VMTemplates}
      case ADD_USER_PARTITION:{
        for (let i in action.payload){
            if (!state.Partitions.includes(action.payload[i])) {
                // ✅ only runs if value not in array
                state.Partitions.push(action.payload[i]);
              }
              }
              return state.Partitions}
    default: return []
    }
    
}
export var AddReducer=(state=initialState, action)=>{
    switch (action.type){
        case ADD_USER_REQUEST:
            return{
                ...state,
                users:[],
                loading:true
            }
        case ADD_USER_SUCCESS:
                return{
                    ...state,
                    loading:false,
                    users:action.payload
                }
            case ADD_USER_FAILURE:
                    return{
                    ...state,
                    loading:false,
                    error:action.payload
                    }
            case ADD_USER_PARTITION:
                return{
                    ...state,
                    Partitions:repeater(state=initialState,action)
                }
            case ADD_USER_VMTEMPLATES:
                
                return{
                    ...state,
                    VMTemplates:repeater(state=initialState,action)

                }
            default: return state
    }

}


// function repeater(state=initialState){

//     for (let i in state.VMTemplates){
//     if (!state.VMTemplates.includes(i)) {
//         // ✅ only runs if value not in array
//         state.VMTemplates.push(i);
//       }
//       }
//       return state.VMTemplates
// }

// repeater()