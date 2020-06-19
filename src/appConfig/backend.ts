import {sweetHome} from ".";
import { normalize, Schema } from 'normalizr'
// import { camelizeKeys } from 'humps'

/**
 * picks off the "link" or next from response
 */
function getNextPageUrl(response : Response) : string | null {
    const link = response.headers.get('link')
    if (!link) {
        return null
    }

    const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
    if (!nextLink) {
        return null
    }

    return nextLink.split(';')[0].slice(1, -1)
}


export function callJsonApi(method: string, path: string, data?: any)
{
    const endpoint = sweetHome().backendUrl;
    return fetch(`${endpoint}/${path}`, {
        method: method,
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
        },
        body:  data ? JSON.stringify(data) : null
    })
        .then((response) => response.json().then(json => ({json, response})))
        .then(({ json, response}) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            // const camelizedJson = camelizeKeys(json);
            const nextPageUrl = getNextPageUrl(response);

            return Object.assign({},
                json,
                { nextPageUrl }
            );
        })
        .then(
            response => ({response}),
            error => ({error: error.message || "Something is wrong"}));
}

export function checkHttpStatus(response: Response) : Response
{
    if (!response.ok) {
        throw Error(response.statusText);
    }

    if (response.status >= 200 && response.status < 300) {
        return response
    }

    let error = new Error(response.statusText);
    // error.response = response;
    throw error;
    return response;
}
