import { Calendar } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUserAuthContext } from '../../contexts/AuthContext/AuthContext';
import { authAPI } from '../../api/auth';
import MagneticButton from '../MagneticButton';

const navItem = {
  hidden: { y: -24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 22 } },
};

function MainNav() {
  const { userJwt, setUserJwt } = useUserAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authAPI.logout();
    setUserJwt('');
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 flex flex-col items-center justify-center px-0 sm:px-10">
        <motion.div
          className="z-51 h-20 w-full max-w-7xl px-6 backdrop-blur-[6px]"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <div className="flex h-full justify-between">
            <motion.div variants={navItem} className="flex items-center space-x-3">
              <Link to={userJwt ? "/dashboard" : "/"} className="flex items-center space-x-3">
                <Calendar className="h-7 w-7 text-brand-600"/>
                <h1 className="text-2xl text-brand-600">CareSync</h1>
              </Link>
            </motion.div>
            <motion.div variants={navItem} className="flex h-full items-center gap-3">
              {userJwt ? (
                <>
                  <MagneticButton
                    onClick={handleLogout}
                    className="rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700 px-6 py-2 text-sm font-medium transition-colors"
                  >
                    Logout
                  </MagneticButton>
                </>
              ) : (
                <MagneticButton as="link" to="/signin" className="rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700 px-6 py-2 text-sm font-medium transition-colors">
                  Login
                </MagneticButton>
              )}
            </motion.div>
          </div>
        </motion.div>
      </nav>
    </>
  );
}

export default MainNav;
