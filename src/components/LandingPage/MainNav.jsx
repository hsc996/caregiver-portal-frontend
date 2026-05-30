import { Calendar } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuthContext } from '../../contexts/AuthContext/AuthContext';
import { authAPI } from '../../api/auth';
import MagneticButton from '../MagneticButton';

function MainNav() {
  const { userJwt, setUserJwt, currentUser } = useUserAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authAPI.logout();
    setUserJwt('');
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center justify-center px-0 sm:px-10">
        <div className="z-51 h-20 w-full max-w-7xl px-6 backdrop-blur-[6px]">
          <div className="flex h-full justify-between">
            <div className="flex items-center space-x-3">
              <Link to={userJwt ? "/dashboard" : "/"} className="flex items-center space-x-3">
                <Calendar className="h-7 w-7 text-indigo-600"/>
                <h1 className="text-2xl text-indigo-600">CareSync</h1>
              </Link>
            </div>
            <div className="flex h-full items-center gap-3">
              {userJwt ? (
                <>
                  {currentUser?.role === 'Admin' && (
                    <MagneticButton as="link" to="/signup" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 text-sm font-medium transition-colors">
                      Create User
                    </MagneticButton>
                  )}
                  <MagneticButton
                    onClick={handleLogout}
                    className="rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-2 text-sm font-medium transition-colors"
                  >
                    Logout
                  </MagneticButton>
                </>
              ) : (
                <MagneticButton as="link" to="/signin" className="rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-2 text-sm font-medium transition-colors">
                  Login
                </MagneticButton>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default MainNav;
