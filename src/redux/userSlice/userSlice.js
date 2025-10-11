import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "./getUser";

const initialState = {
    status : 0,
    isLogin : false,
    message : '',
    user : {
        id : null,
        username : null,
        email : null,
    },
}

const userSlice = createSlice({
    name : 'userRedux',
    initialState,
    reducers : {
        logout : function(state){
            state.status = false;
            state.isLogin = false;
            state.message = '';
            localStorage.removeItem('_token');
        },
        login : function(state, action){
            if(action.payload.status === "SUCCESS"){
                state.status = true;
                state.isLogin = true;
                state.message = 'Successfully Logged In..';
            }
            else{
                state.status = false;
                state.isLogin = false;
                state.message = '';
            }
        },
        getUserUpdate : function(state, action) {
            state.user.username = action.payload.username;
            state.user.email = action.payload.email;
        }
    },
    extraReducers : function(builder){
        builder.addCase(getUser.pending, function(state){
            state.message = "Please wait...";
        });
        builder.addCase(getUser.fulfilled, function(state, action){
            if(action.payload && action.payload.status === "SUCCESS"){
                state.message = "Get Successfully...";
                state.user = action.payload.data;
                state.isLogin = true;
            }
            else {
                state.message = "Fetch Faild.....";
            }
        });
        builder.addCase(getUser.rejected, function(state){
            state.message = "Fetch Faild.....";
        });
    }
})

export const { logout, login } = userSlice.actions;

export default userSlice.reducer;