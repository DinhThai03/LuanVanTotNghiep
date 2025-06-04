"use client"

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
export default function Home() {
  const [accessToken, setAccessToken] = useState<string>('');

  useEffect(() => {

    setAccessToken(String(Cookies.get('access_token')));
    console.log(accessToken);
  })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {accessToken}
    </div>
  );
}
