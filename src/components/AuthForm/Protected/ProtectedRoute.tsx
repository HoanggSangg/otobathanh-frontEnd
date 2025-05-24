import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../Utils/auth';
import { getAccountByIdAPI } from '../../API';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';
import LoginForm from '../Login/Login';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  roles: Role[];
}

const MASTER_ONLY_ROUTES = ['/manager/accounts'];
const ADMIN_ONLY_ROUTES = [
  '/manager/products',
  '/manager/news',
  '/manager/banner',
  '/manager/booking',
  '/admin-chat'
];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getCurrentUser();
  const showToast = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (!currentUser?.id) {
          setIsLoading(false);
          setIsLoginOpen(true);
          return;
        }
        
        const userData = await getAccountByIdAPI(currentUser.id);
        const userRoles = userData.account.roles?.map((role: Role) => 
          role.name.toLowerCase()
        ) || [];

        const isMasterRoute = MASTER_ONLY_ROUTES.includes(location.pathname);
        const isAdminRoute = ADMIN_ONLY_ROUTES.includes(location.pathname);
        const hasMasterRole = userRoles.includes('master');
        const hasAdminRole = userRoles.includes('admin') || hasMasterRole;

        if (isMasterRoute) {
          if (hasMasterRole) {
            setIsAuthorized(true);
          } else {
            showToast('Chỉ Master mới có quyền truy cập trang này', 'error');
            setIsAuthorized(false);
          }
        } else if (isAdminRoute) {
          if (hasAdminRole) {
            setIsAuthorized(true);
          } else {
            showToast('Chỉ Admin mới có quyền truy cập trang này', 'error');
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(true);
        }
        
      } catch (error) {
        console.error('Error checking user role:', error);
        showToast('Có lỗi xảy ra khi kiểm tra quyền truy cập', 'error');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [currentUser?.id, showToast, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser?.id) {
    return (
      <>
        <LoginForm
          open={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;