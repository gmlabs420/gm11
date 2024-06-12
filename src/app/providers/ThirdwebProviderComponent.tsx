"use client"
import { ThirdwebProvider } from "thirdweb/react";

export default function ThirdwebProviderComponent({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return(
        <ThirdwebProvider>
            {children}
        </ThirdwebProvider>
    )
}