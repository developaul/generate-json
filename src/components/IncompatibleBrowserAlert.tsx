import { FC, useContext } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckBrowserContext } from "@/providers";
import { ExternalLink } from "./ExternalLink";

interface Props {
  openInstructions: () => void;
  showSupportedBrowsers: () => void;
}

interface PossibleError {
  type: "browser" | "version" | "flag";
  title: string;
  message: React.ReactNode;
  error: string;
}

export const IncompatibleBrowserAlert: FC<Props> = ({
  openInstructions,
  showSupportedBrowsers,
}) => {
  const { error } = useContext(CheckBrowserContext);

  const userAgent = navigator.userAgent;

  const isChrome = userAgent.toLowerCase().includes("chrome");

  const possibleErrors: PossibleError[] = [
    {
      error:
        "Built-in AI is not ready, check your configuration in chrome://flags/#optimization-guide-on-device-model",
      type: "flag",
      title: "Please Enable Flags & Download Model",
      message: (
        <>
          Built-in AI is not ready.{" "}
          <button
            className="underline hover:opacity-70"
            onClick={() => openInstructions()}
          >
            Follow these instructions
          </button>{" "}
          to enable it.
        </>
      ),
    },
    {
      error:
        "Your browser is not supported. Please update to 127 version or greater.",
      type: isChrome ? "version" : "browser",
      title: isChrome ? "Please Update Chrome" : "Please Switch to Chrome",
      message: (
        <>
          Your browser is{" "}
          <button
            className="underline hover:opacity-70"
            onClick={() => showSupportedBrowsers()}
          >
            not supported
          </button>
          .{" "}
          {isChrome ? (
            "Please update Chrome to version 127 or higher."
          ) : (
            <>
              Please switch to Chrome (
              <ExternalLink href="https://www.google.com/chrome/dev/?extra=devchannel">
                Dev
              </ExternalLink>{" "}
              or{" "}
              <ExternalLink href="https://www.google.com/chrome/canary/">
                Canary
              </ExternalLink>
              ).
            </>
          )}
        </>
      ),
    },
    {
      error:
        "Prompt API is not available, check your configuration in chrome://flags/#prompt-api-for-gemini-nano",
      message:
        "Prompt API is not available, check your configuration in chrome://flags/#prompt-api-for-gemini-nano",

      type: "flag",
      title: "Please Enable Flags",
    },
  ];

  const currentError = possibleErrors.filter((e) => e.error === error)[0] ?? {
    error: "",
    title: "please try again",
  };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error: {currentError.title}</AlertTitle>
      <AlertDescription>
        <p>{currentError.message}</p>
      </AlertDescription>
    </Alert>
  );
};
