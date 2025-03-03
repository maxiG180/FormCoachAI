interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, subtitle, children }: AuthCardProps) => (
  <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-base-content/70">
          {subtitle}
        </p>
      </div>
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthCard;
