import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../Utils/auth';
import { getAccountByIdAPI } from '../../API';
import { Navigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  roles: Role[];
}

const ADMIN_ROLES = ['admin', 'master'] as const;
type AdminRole = typeof ADMIN_ROLES[number];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getCurrentUser();
  const showToast = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (!currentUser?.id) {
          showToast('Vui lòng đăng nhập để truy cập trang này', 'warning');
          setIsLoading(false);
          return;
        }
        const userData = await getAccountByIdAPI(currentUser.id);
        
        const hasAdminRole = userData.account.roles?.some((role: Role) => 
          ADMIN_ROLES.includes(role.name.toLowerCase() as AdminRole)
        );
        if (!hasAdminRole) {
          showToast('Bạn không có quyền truy cập trang này', 'error');
        }
        setIsAuthorized(hasAdminRole);
      } catch (error) {
        console.error('Error checking user role:', error);
        showToast('Có lỗi xảy ra khi kiểm tra quyền truy cập', 'error');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [currentUser?.id, showToast]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;