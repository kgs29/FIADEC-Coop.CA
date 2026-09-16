"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { generateBreadcrumbs } from "@/utils/breackcrumbs-config";
import { useTranslation } from "react-i18next";

const CustumBreadcrumb = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const crumbs = generateBreadcrumbs(pathname).filter((c) => c.path !== "/admin");

  return (
    <div
      data-breadcrumb-wrapper
      className="border-b px-6 py-3"
      style={{ backgroundColor: "var(--breadcrumb-bg, #0D9488)", borderColor: "var(--breadcrumb-separator, #99F6E4)" }}
    >
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          {pathname === "/admin" ? (
            <BreadcrumbItem>
              <BreadcrumbPage
                className="font-semibold text-sm"
                style={{ color: "var(--breadcrumb-text, #FFFFFF)" }}
              >
                {t("dashboard")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            crumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <BreadcrumbItem>
                  {index === crumbs.length - 1 ? (
                    <BreadcrumbPage
                      className="font-semibold text-sm"
                      style={{ color: "var(--breadcrumb-text, #FFFFFF)" }}
                    >
                      {t(crumb.title)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.path}
                      className="text-sm transition-colors hover:opacity-100"
                      style={{ color: "var(--breadcrumb-link, #CCFBF1)", opacity: 0.85 }}
                    >
                      {t(crumb.title)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < crumbs.length - 1 && (
                  <BreadcrumbSeparator style={{ color: "var(--breadcrumb-separator, #99F6E4)" }} />
                )}
              </React.Fragment>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CustumBreadcrumb;
