import { useEffect, useState } from "react";

export default function useChangeFlash(dependency, timeout = 1250) {
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    setChanged(true);
    const timer = setTimeout(() => {
      setChanged(false);
    }, timeout);
    return () => clearTimeout(timer);
  }, [dependency, timeout]);

  return changed;
}
