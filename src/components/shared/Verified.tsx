import { VerifiedIcon } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IUser } from "../../types";

export default function Verified({
  user,
}: {
  user: IUser;
}) {
  return (
    <div className="flex md:justify-center lg:justify-start items-center gap-1">
      {user.username}
      {user.verified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <VerifiedIcon className="text-blue-600 w-6 hover:text-blue-500 hover:cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              <p>Este é um usuário verificado.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
