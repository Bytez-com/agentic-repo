import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAuth, onAuthStateChanged } from "@/service/firebase/auth";

export default function useSession() {
  const [session, setSession] = useState({});
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(getAuth(), (session) => {
      if (session.isAnonymous) {
        router.replace("/");
      } else {
        setSession(session);
      }
    });
  }, [router]);

  return session;
}
