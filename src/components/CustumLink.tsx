"use client"
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React, { AnchorHTMLAttributes, FC } from "react";

// Combiner les types des props de <Link> et des attributs HTML d'un <a>
type CustomLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    activeClassName?: string; // Optionnel : pour gérer l'état actif
    absolutePath?: boolean; // Optionnel :
  };

const CustomLink: FC<CustomLinkProps> = ({
  href,
  as,
  className,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  children,
  absolutePath,
  ...rest
}) => {
  const pathname = usePathname();
  return (
    <Link
      className={cn("", className)}
      href={`${absolutePath ? href : pathname + "/" + href}`}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch ? prefetch : true}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
