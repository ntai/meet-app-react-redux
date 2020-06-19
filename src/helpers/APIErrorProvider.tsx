// src/common/providers/APIErrorProvider/index.js
import React, {useState, useCallback, ReactNode} from 'react';
import { useContext } from 'react';

export type APIErrorState = null | {
        message: string,
        status: number,
    };

export type APIErrorContextType = {
    errorState: APIErrorState,
    addError: (message: string, status: number) => void,
    removeError: () => void,
};

export const APIErrorContext = React.createContext<APIErrorContextType>({
    errorState: null,
    addError: () => {},
    removeError: () => {}
});

export function useAPIError() {
    const { errorState, addError, removeError } = useContext(APIErrorContext);
    return { errorState, addError, removeError };
}

interface IAPIErrorProvider {
    children: JSX.Element;
}

export default function APIErrorProvider({ children } : IAPIErrorProvider) {
    const [errorState, setErrorState] = useState( null as APIErrorState);
    const removeError = () => setErrorState(null);
    const addError = (message:string, status:number) => setErrorState({ message, status });

    const contextValue = {
        errorState,
        addError: useCallback((message : string, status: number) => addError(message, status), []),
        removeError: useCallback(() => removeError(), [])
    };

    return (
        <APIErrorContext.Provider value={contextValue}>
            {children}
        </APIErrorContext.Provider>
    );
}
