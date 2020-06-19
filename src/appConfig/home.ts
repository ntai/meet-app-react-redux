import process from 'process';
import url from 'url';
import {stringify} from "querystring";

/* OK */

export const sweetHome = (function() :
    {
        baseUrl: string;
        backendUrl: string;
        websocketUrl: string;
    }
    {
        const href = document.location.href;
        const urlObj = url.parse(href, true);
        //if (urlObj.port === "3000") process.env.NODE_ENV = "development";
        const development = (urlObj.port === "3000");
        //  if (development) process.env.NODE_ENV = "development"

        return {
            baseUrl: urlObj.protocol + '//' + urlObj.hostname + ':' + urlObj.port,
            // For deployment, backendUrl is same as baseUrl. Just a hack for now

            backendUrl: development ?
                'http://localhost:3333' : urlObj.protocol + '//' + urlObj.hostname + ':' + urlObj.port,

            websocketUrl: development ?
                'ws://localhost:3333' : urlObj.protocol + '//' + urlObj.hostname + ':' + urlObj.port,
        }
});


