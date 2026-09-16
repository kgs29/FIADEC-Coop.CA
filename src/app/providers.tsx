"use client";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import i18n from "@/locale/i18n";
import { applyThemeConfig } from "@/lib/applyTheme";
import { useLazyGetUserProfileQuery } from "@/store/apis/auth/authentication.api";
import { useGetConfigurationQuery } from "@/store/apis/core/configuration.api";
import { loginSuccess } from "@/store/slices/authslice";
import { setConfig } from "@/store/slices/configSlice";
import { store } from "@/store/store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

const AuthReadyContext = createContext(false);
export const useAuthReady = () => useContext(AuthReadyContext);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppConfigProvider>
          <AuthProvider>
            <I18n>{children}</I18n>
          </AuthProvider>
        </AppConfigProvider>
      </I18nextProvider>
    </Provider>
  );
}

/** Charge la configuration au démarrage et applique le thème global. */
const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isSuccess, isError } = useGetConfigurationQuery();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(setConfig(data));
      applyThemeConfig(data);
    }
    // Marque comme prêt dès que la réponse arrive (succès ou erreur)
    if (isSuccess || isError) {
      setReady(true);
    }
  }, [data, dispatch, isSuccess, isError]);

  // Petit délai : on attend la config avant de rendre l'app pour éviter le flash de thème
  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#0D9488", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [getProfile, { data, isSuccess, isError }] = useLazyGetUserProfileQuery();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      getProfile();
    } else {
      setIsAuthReady(true);
    }
  }, [getProfile]);

  useEffect(() => {
    if (data) {
      dispatch(loginSuccess({ isLoggedIn: true, user: data }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    if (isSuccess || isError) {
      setIsAuthReady(true);
    }
  }, [isSuccess, isError]);

  return (
    <AuthReadyContext.Provider value={isAuthReady}>
      {children}
    </AuthReadyContext.Provider>
  );
};
const I18n = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("fr");
    }
    setActive(true);
  }, []);
  return <>{active && children}</>;
};
