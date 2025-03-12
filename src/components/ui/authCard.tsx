interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6500]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6500]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-20 right-40 w-96 h-96 bg-[#FF6500]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-[#FF8533]/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#FF6500] to-[#FF8533] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>

        <div className="bg-black border border-[#FF6500]/30 shadow-lg shadow-[#FF6500]/5 rounded-xl px-6 py-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
