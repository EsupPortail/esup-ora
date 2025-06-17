export const constructParameters =  async ( url, getParameters = [] ) => {
    if( getParameters.length > 0 ) {
        finalUrl += "?";
        for( let j = 0; j < getParameters.length; j++ ) {
            let keys = Object.keys( getParameters[j] );
            for( let i = 0; i < keys.length; i++ ) {
                if( i != keys.length -1 ) {
                    url += keys[i] + "=" + getParameters[j][keys[i]] + "&";
                } else {
                    url += keys[i] + "=" + getParameters[j][keys[i]];
                }
            }
        }
    }
    return url;
}