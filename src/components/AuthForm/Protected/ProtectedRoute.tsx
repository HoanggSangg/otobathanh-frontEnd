import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../Utils/auth';
import { getAccountByIdAPI } from '../../API';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  roles: Role[];
}

const MASTER_ONLY_ROUTES = ['/manager/accounts'];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getCurrentUser();
  const showToast = useToast();
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (!currentUser?.id) {
          showToast('Vui lòng đăng nhập để truy cập trang này', 'warning');
          setIsLoading(false);
          return;
        }
        
        const userData = await getAccountByIdAPI(currentUser.id);
        const userRoles = userData.account.roles?.map((role: Role) => 
          role.name.toLowerCase()
        ) || [];

        const isMasterRoute = MASTER_ONLY_ROUTES.includes(location.pathname);
        const hasMasterRole = userRoles.includes('master');

        if (isMasterRoute) {
          // Nếu là route chỉ dành cho master
          if (hasMasterRole) {
            setIsAuthorized(true);
          } else {
            showToast('Chỉ Master mới có quyền truy cập trang này', 'error');
            setIsAuthorized(false);
          }
        } else {
          // Các route bảo vệ khác (nếu có)
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

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;