import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg flex items-start mb-4">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;
