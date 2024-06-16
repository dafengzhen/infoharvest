import { createContext } from 'react';

export interface IGlobalContext {}

export const GlobalContext = createContext<IGlobalContext>({});
