import {createContext, useContext, useEffect, useState} from 'react';
import sdk from '@lettercms/sdk';

//Sobreescribir el punto de acceso a la API, para usar la ultima version
//sdk.endpoint = 'https://lettercms-api-development.vercel.app';
sdk.endpoint = 'http://localhost:3009';

/**
 * Funcion que obtiene el token de acceso publico de la API de LetterCMS
 */
const renovateToken = async () => {
  const res = await fetch('/api/generate-token', {method: 'POST'});

  if (res.ok) {
    const {accessToken} = await res.json();
    
    //Añadir el token de acceso globalmente para el SDK
    sdk.setAccessToken(accessToken);

    return accessToken;
  } else {
    //si falla el obtener el token reintenta cada 10s
    setTimeout(renovateToken, 10000);
  }
}

const ClientContext = createContext();

export function getContext() {
  return ClientContext;
}

export function useToken() {
  const value = useContext(ClientContext);

  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      '[lettercms]: `useUser` must be wrapped in a <DashboardProvider />'
    );
  }

  return value;
}

export function ClientProvider({children, ready}) {
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {

    if (ready) {
      //Obtiene el token de acceso al montar el componente, despues refresca el token cada 25min
      renovateToken();

      const interval = setInterval(renovateToken, 25 * 60 * 1000);

      return () => clearInterval(interval);
    }

  }, [ready]);

  const status = loading ? {status: 'loading'} : {status: 'done'};

  return <ClientContext.Provider value={status}>{children}</ClientContext.Provider>;
}