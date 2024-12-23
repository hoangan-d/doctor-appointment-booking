'use client'
import React, { createContext, ReactNode } from 'react';

interface PanelContextProps {
    calculateAge: (dob: string) => number;
}

export const PanelContext = createContext<PanelContextProps>(null!);

interface PanelContextProviderProps {
    children: ReactNode;
}

const PanelContextProvider: React.FC<PanelContextProviderProps> = (props) => {

    const calculateAge = (dob: string) => {
        const today = new Date()
        const birtDate = new Date(dob)

        let age = today.getFullYear() - birtDate.getFullYear()
        return age;
    }
    const value: PanelContextProps = {
        calculateAge,
    };

    return (
        <PanelContext.Provider value={value}>
            {props.children}
        </PanelContext.Provider>
    );
};

export default PanelContextProvider;
