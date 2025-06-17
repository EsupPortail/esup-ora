import { constructParameters } from "./utilities";
import { navigateTo } from "../../router/router";
import { useConnectionStore } from "@/stores/connectionStore";

export const getApiRequest =  async ( url, getParameters = [] ) => {
    const { token } = useConnectionStore().token;
    console.log(token);
    const requestOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            // Authorization: 'Bearer ' + this.token.access_token
        }
    };

    let urlWithParameters = "";
    await constructParameters( url, getParameters ).then(r => urlWithParameters = r);

    const dataR = await fetch(url, requestOptions)
        .then( response => {
            return response.json()
        })
        .then( dataJson => {
            return dataJson;
        });
    if( dataR.redirect !== undefined && dataR.redirect === true ) {
        console.log('Redirection asked');
        navigateTo( dataR.redirectPath );
    }
    return dataR;
};