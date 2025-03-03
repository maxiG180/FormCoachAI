import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome, {user?.email}
          </h1>
          <p className="text-base-content/70 text-lg md:text-xl">
            Your AI-Powered Fitness Journey
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-primary">Workout Plans</h2>
              <p className="text-base-content/70">
                View and manage your workout plans.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Go to Plans</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-primary">Progress Tracking</h2>
              <p className="text-base-content/70">
                Track your fitness progress over time.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Progress</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-primary">Settings</h2>
              <p className="text-base-content/70">
                Update your account settings.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Settings</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={logout} className="btn btn-error">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
