"use client"

import { UpdatePasswordForm } from '@/components/admin/update-password-form';
import '../../admin/admin.css';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function UpdatePasswordPage() {
  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        backgroundImage: `url("/adminbackground.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80 z-0" />
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="text-center">
          <Image
            src="/top-modern-final-logo.png"
            alt="Top Modern Logo"
            width={300}
            height={300}
            className="h-auto w-auto max-w-full"
          />
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
