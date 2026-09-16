"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export const Oops = () => {
  return (
    <div className="text-primary font-bold flex gap-1 items-end mt-5">
      <span className="text-4xl">O</span>
      <span className="text-xl">O</span>
      <span className="text-2xl">O</span>
      <span className="text-4xl">p</span>
      <span className="text-4xl">S</span>
      <span className="text-4xl">!</span>
      <span className="text-2xl">!</span>
      <span className="text-xl">!</span>
    </div>
  );
};
type ApiError = Readonly<{ status?: number; originalStatus?: number }>;
type ErrorComponentProps = Readonly<{ error: ApiError }>;

const isStatus = (val: number | undefined, code: number) => val === code;
const is5xx = (val: number | undefined) => val !== undefined && val >= 500 && val < 600;

const ErrorComponent = ({ error }: ErrorComponentProps) => {
  const { t } = useTranslation();
  return (
    <div className="pt-20">
      {(is5xx(error.status) || is5xx(error.originalStatus)) && (
        <>
          <div className="flex justify-center items-center flex-col">
            <div className="relative">
              <div className="absolute text-4xl text-primary font-bold bottom-28 right-10">
                500
              </div>
            </div>
            <Oops />
          </div>
          <p className="text-center">{t("an_internal_error_occured")}</p>
        </>
      )}
      {(isStatus(error.status, 400) || isStatus(error.originalStatus, 400)) && (
        <>
          <div className="flex justify-center items-center flex-col">
            <Oops />
          </div>
          <p className="text-center">{t("bad_request")}</p>
        </>
      )}
      {(isStatus(error.status, 401) || isStatus(error.originalStatus, 401)) && (
        <>
          <div className="flex justify-center items-center flex-col">
            <Oops />
          </div>
          <p className="text-center">{t("unauthorized")}</p>
        </>
      )}
      {(isStatus(error.status, 403) || isStatus(error.originalStatus, 403)) && (
        <>
          <div className="flex justify-center items-center flex-col">
            <Oops />
          </div>
          <p className="text-center">{t("unauthorized")}</p>
        </>
      )}
      {(isStatus(error.status, 404) || isStatus(error.originalStatus, 404)) && (
        <>
          <div className="flex justify-center items-center flex-col">
            <Oops />
          </div>
          <p className="text-center">{t("not_found_ressource")}</p>
        </>
      )}
    </div>
  );
};
export default ErrorComponent;
