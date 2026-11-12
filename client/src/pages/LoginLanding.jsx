import { Link } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import { ArrowRight } from "lucide-react";

const LoginLanding = ({ role, subtitle }) => {

  // Portal selection page
  if (!role) {
    const portals = [
      {
        title: "Admin Portal",
        href: "/login/admin",
      },
      {
        title: "Employee Portal",
        href: "/login/employee",
      },
    ];

    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <LoginLeftSide />

        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-left mb-3">
              Welcome Back!
            </h1>

            <p className="text-left text-slate-400 mb-8">
              Select your portal to securly access your account.
            </p>

            <div className="space-y-4">
              {portals.map((portal) => (
                <Link
                  key={portal.href}
                  to={portal.href}
                  className="flex justify-between items-center p-6 rounded-lg bg-slate-200 hover:bg-indigo-50 transition"
                >
                  {portal.title}
                  <ArrowRight />
                </Link>
              ))}
            </div>
            {/*footer*/}
            <div className="mt-12 text-center md:text-left text-sm text-slate-400">
              <p>© {new Date().getFullYear()} GreatStack. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginLanding;