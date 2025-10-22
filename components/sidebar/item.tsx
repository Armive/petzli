import Link from "next/link";
import { FC, SVGProps } from "react";

export const Item = ({
  IconChecked,
  Icon,
  isChecked,
  url,
}: {
  IconChecked: FC<SVGProps<SVGSVGElement>>;
  Icon: FC<SVGProps<SVGSVGElement>>;
  isChecked: boolean;
  url: string;
}) => {
  return (
    <Link href={url}>
      <div className="text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
        {isChecked ? (
          <IconChecked className="h-6 w-6" />
        ) : (
          <Icon className="h-6 w-6" />
        )}
      </div>
    </Link>
  );
};
