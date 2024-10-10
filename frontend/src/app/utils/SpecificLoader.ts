import { getStoredUser } from "../storage";

function SpecificLoader(props: any) {
  const user = getStoredUser();
  return props[user?.role] || (() => null);
}

export default SpecificLoader;
