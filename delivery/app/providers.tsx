"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();
  const queryClient = new QueryClient({});

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
