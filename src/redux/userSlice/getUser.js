import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeApiRequest, respStatus, showMessage, url } from "../../helper/api_helper";
export const getUser = createAsyncThunk('api/getUser', async () => {
    try {
        const response = await makeApiRequest(url.USER_API.detail, {}, url.API_EXTENSION);
        if (response.status !== respStatus['SUCCESS']) {
            if (response.code !== "validation_error") {
                showMessage("server error No data find", "error", "error")
                return;
            }
            showMessage("server error No data find", "error", "error");
            return;
        }
        return response;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem(url.USER_TOKEN);
            window.location.href = "/";
            return;
        }
        showMessage("Something went wrong", "error", "error");
    }
})