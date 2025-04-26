import { getCurrentUser } from '../Utils/auth';
import { getAccountByIdAPI } from '../API';

interface Role {
    id: string;
    name: string;
  }
  
  interface User {
    id: string;
    roles: Role[];
  }

export const checkIsMasterRole = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser?.id) return false;
  
  try {
    const userData = await getAccountByIdAPI(currentUser.id);
    return userData.account.roles?.some((role: Role) => role.name.toLowerCase() === 'master') || false;
  } catch (error) {
    console.error('Error checking master role:', error);
    return false;
  }
};