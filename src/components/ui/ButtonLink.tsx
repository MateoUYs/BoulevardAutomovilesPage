import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonTone = "primary" | "secondary" | "ghost" | "dark";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

const tones: Record<ButtonTone, string> = {
  primary:
    "bg-[#D32F2F] text-white shadow-lg shadow-red-900/20 hover:bg-[#b92727] focus-visible:outline-[#D32F2F]",
  secondary:
    "bg-white text-zinc-950 ring-1 ring-zinc-200 hover:bg-zinc-50 focus-visible:outline-[#D32F2F]",
  ghost:
    "bg-transparent text-zinc-950 ring-1 ring-zinc-300 hover:bg-white focus-visible:outline-[#D32F2F]",
  dark: "bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:outline-zinc-950",
};

export function ButtonLink({ href, children, tone = "primary", className, ...props }: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = clsx(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-extrabold tracking-tight transition duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 sm:text-lg",
    tones[tone],
    className,
  );

  if (isExternal) {
    return (
      <a className={classes} href={href} {...(props as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {children}
    </Link>
  );
}
