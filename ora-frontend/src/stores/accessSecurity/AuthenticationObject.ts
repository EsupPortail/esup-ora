export type AuthenticationObject = {
    isConnected: boolean;
    dataConnection: {
        tokenInformations: {
            token: string;  
            refresh_time: number;  
            expires_in: number;
            refresh_token: string;
        };
        userInformations: {
            userID: string;
            username: string;
            firstname: string;
            lastname: string;
            role: string;
            email: string;
        };
    };
};
