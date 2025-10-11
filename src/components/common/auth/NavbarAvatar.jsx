import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useToast } from '@/components/ui/use-toast';

export default function NavbarAvatar({ size, profile }) {
  const router = useRouter();
const {toast} = useToast()
  const onLogout = async () => {
    try {
      localStorage.removeItem('token');
      location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar style={{ cursor: 'pointer' }}>
          <AvatarImage width={size} src={profile?.imageUrl || `/user.png`} alt="Profile" />
          <AvatarFallback>{profile?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/profile')}>Hesabım</DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Çıkış Yap</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
