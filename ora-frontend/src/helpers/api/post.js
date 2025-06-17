export const postApiRequest =  async ( url, body = {} ) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        },
        body: new URLSearchParams(body).toString(),
    };

    const dataR = await fetch(url, requestOptions, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    })
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
}