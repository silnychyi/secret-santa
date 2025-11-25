"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Person from "@/components/Person";
import Form from "@/components/Form";

export default function PageContent() {
  const searchParams = useSearchParams();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const encodedData = isHydrated ? searchParams.get("data") : null;

  return encodedData ? <Person encodedData={encodedData} /> : <Form />;
}
