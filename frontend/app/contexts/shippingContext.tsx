"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  area: string;
  fullAddress: string;
  isDefaultShippingAddress: boolean;
}

interface ShippingContextValue {
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
}

const ShippingContext = createContext<ShippingContextValue | undefined>(
  undefined,
);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addresses, setAddresses] = useState<Address[]>([]);

  return (
    <ShippingContext.Provider
      value={{
        selectedAddressId,
        setSelectedAddressId,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error("useShipping must be used within a ShippingProvider");
  }
  return context;
}
