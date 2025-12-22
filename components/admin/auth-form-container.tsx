"use client";

import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface AuthFormContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  footerLink: string;
  footerText: string;
  footerLinkText: string;
}

export function AuthFormContainer({
  title,
  description,
  children,
  footerLink,
  footerText,
  footerLinkText,
}: AuthFormContainerProps) {
  return (
    <Card className="w-full max-w-md bg-slate-800 backdrop-blur-sm border border-border/50 shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <Image
            src="/top-modern-final-logo.png"
            alt="Top Modern Logo"
            width={64}
            height={64}
            className="h-16 w-auto"
          />
        </div>
        <div>
          <CardTitle className="text-white text-2xl font-serif">{title}</CardTitle>
          <CardDescription className="text-white">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {children}
        <p className="text-center text-sm text-white mt-4">
          {footerText}{" "}
          <Link href={footerLink} className="text-yellow-500 hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
