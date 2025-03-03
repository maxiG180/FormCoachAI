interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <div className="alert alert-error shadow-lg mb-4 sm:mb-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span className="text-sm sm:text-base">{message}</span>
  </div>
);

export default ErrorAlert;
