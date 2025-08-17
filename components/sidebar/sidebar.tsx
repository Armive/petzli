"use client";
import {
  MynauiPlusSquare,
  MynauiPlusSquareSolid,
  SolarBellBold,
  SolarBellOutline,
  SolarChatRoundLineBold,
  SolarChatRoundLineOutline,
  SolarCompassBold,
  SolarCompassOutline,
  SolarHomeAngleBold,
  SolarHomeAngleOutline,
  SolarSettingsOutline,
} from "../icons/icons";

import { usePathname } from "next/navigation";
import { Item } from "./item";

export default function VerticalNav() {
  const pathname = usePathname();
  return (
    <div className="border-border flex h-screen flex-col items-center border-r px-2 py-4">
      {/* Navigation Icons */}
      <div className="flex flex-col items-center gap-6">
        {/* Home Icon */}
        <Item
          IconChecked={SolarHomeAngleBold}
          Icon={SolarHomeAngleOutline}
          isChecked={pathname === "/" || pathname === "/protected"}
          url="/"
        />

        {/* Compass Icon */}
        <Item
          IconChecked={SolarCompassBold}
          Icon={SolarCompassOutline}
          isChecked={pathname === "/protected/explore"}
          url="/protected/explore"
        />

        {/* Plus Icon (Active State) */}
        <Item
          IconChecked={MynauiPlusSquareSolid}
          Icon={MynauiPlusSquare}
          isChecked={pathname === "/protected/create"}
          url="/protected/create"
        />

        {/* Bell Icon */}
        <Item
          IconChecked={SolarBellBold}
          Icon={SolarBellOutline}
          isChecked={pathname === "/protected/notifications"}
          url="/protected/notifications"
        />

        {/* Message Icon */}
        <Item
          IconChecked={SolarChatRoundLineBold}
          Icon={SolarChatRoundLineOutline}
          isChecked={pathname === "/protected/messages"}
          url="/protected/messages"
        />
      </div>

      {/* Spacer to push settings to bottom */}
      <div className="flex-grow"></div>

      {/* Settings Icon */}
      <div className="mt-auto">
        <div className="text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100">
          <SolarSettingsOutline className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
