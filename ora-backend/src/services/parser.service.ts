import { Request } from 'express';

export interface getParamsOfRequestResponse {
    baseRoute: string;
    method: string;
    urlParams: Array<string>;
    postParams: Record<string, any>;
    getParams: Record<string, any>;
}

export class Parser {

    static getParamsOfRequest(req: Request): getParamsOfRequestResponse {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const baseRoute = url.pathname.split('/')[1];

        const urlParams: Array<string> = [];
        url.pathname.split('/').forEach((element, index) => {
            if (index > 1) {
                urlParams.push(element);
            }
        })
        const getParams = this.normalizeGetParams(baseRoute, Object.fromEntries(url.searchParams.entries()));
        const postParams = req.body;
        const method = req.method;

        return {
            baseRoute,
            method,
            urlParams,
            postParams,
            getParams
        };
    }

    static normalizeGetParams(baseRoute: string, getParams: Record<string, string>): Record<string, string> {
        const entity = baseRoute;
        const normalizedGetParams: Record<string, any> = {};
        Object.keys(getParams).forEach((key) => {
            if (key.includes('_id')) {
                normalizedGetParams[key] = parseInt(getParams[key]);
            } else {
                normalizedGetParams[key] = getParams[key];
            }
        });
        return normalizedGetParams;
    }

    static transformObject(input: Record<string, any>): Record<string, any> {
        const output: Record<string, any> = {};
    
        Object.keys(input).forEach(key => {
            const value = input[key];
            const keys = key.split(/[\[\]]+/).filter(Boolean); // Split by '[' and ']', and filter out empty strings
            keys.reduce((acc, curr, index) => {
                if (index === keys.length - 1) {
                    acc[curr] = (value === "true") ? true : (value === "false") ? false : value;
                } else {
                    acc[curr] = acc[curr] || {};
                }
                return acc[curr];
            }, output);
        });
    
        return output;
    }
}