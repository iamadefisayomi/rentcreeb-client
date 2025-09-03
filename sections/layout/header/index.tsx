import useResponsive from "@/hooks/useResponsive";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

export default function Header() {
  const deviceType = useResponsive();

  if (deviceType === null) return null; // Wait until the device type is determined

  return deviceType === "desktop" ? <DesktopHeader /> : <MobileHeader />;
}
