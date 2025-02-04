import axios from "axios";

export const getFile = (url: string): Promise<any> => {
    return axios({
        method: 'get',
        url: `${url}`,
        responseType: 'stream'
    });
}