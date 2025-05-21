import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LoginForm from '../AuthForm/Login/Login';
import RegisterForm from '../AuthForm/Register/Register';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentUser } from '../Utils/auth';
import { getAccountByIdAPI } from '../API';
import { useNavigate } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(246, 238, 238), rgb(242, 12, 12) 50%, rgb(11, 9, 9));
  backdrop-filter: blur(8px);
  padding: 5px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const SearchContainer = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    display: ${props => props.$isExpanded ? 'flex' : 'none'};
    width: 100%;
    margin-right: 20px;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 15px;
`;

const LogoContainer = styled.div`
  flex: 0 0 auto;
  z-index: 1001;
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 8px;
    padding: 24px;
    max-width: 600px;
    width: 100%;
  }
`;

const DialogTitleStyled = styled(DialogTitle)`
  padding: 0 0 16px 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

const DialogContentStyled = styled(DialogContent)`
  padding: 0;
  color: #666;
`;

const DialogActionsStyled = styled(DialogActions)`
  padding: 16px 0 0 0;
  gap: 8px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 8px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${props => props.$primary ? '#e31837' : '#f5f5f5'};
  color: ${props => props.$primary ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.$primary ? '#c41730' : '#e6e6e6'};
  }
`;

const UserAvatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  border: 2px solid #e31837;
`;

const UserInfoMobi = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  position: relative;
`;

const MobileDropdownContent = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.img`
  height: 64px;
  margin: 2px 0;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(227,24,55,0.12));
  border-radius: 14px;
  background: #fff;
  padding: 6px 18px;
  transition: box-shadow 0.3s, background 0.3s;
  border: 1.5px solid #e31837;
  &:hover {
    box-shadow: 0 8px 32px rgba(227,24,55,0.18);
    background: #f5f5f5;
  }
`;

const NavContainer = styled.div<{ $isOpen: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100vh;
    background-color: #000;
    margin: 0;
    padding-top: 80px;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    z-index: 1099;
  }
`;

const AuthButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$primary ? '#e31837' : 'rgba(255, 255, 255, 0.2)'};
  background-color: ${props => props.$primary ? '#e31837' : 'transparent'};
  color: white;
  min-width: 120px;

  &:hover {
    transform: translateY(-1px);
    background-color: ${props => props.$primary ? '#c41730' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.$primary ? '#c41730' : 'white'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 20px;

  @media (max-width: 1024px) {
    gap: 10px;
    font-size: 14px;

    > a {
      padding: 8px 8px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 0;
    width: 100%;
    background: linear-gradient(to bottom, #e31837, #000000);

    > a {
      width: 100%;
      padding: 15px 0;
      font-size: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }

      &.active::after {
        display: none;
      }

      &:hover {
        color: #e31837;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  @media (max-width: 480px) {
    padding: 15px;
    
    > a {
      font-size: 15px;
      padding: 12px 0;
    }
  }
`;

const DefaultAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 8px;
  border: 2px solid #e31837;
  color: white;
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  gap: 15px;
  padding: 20px;

  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    background: linear-gradient(to bottom, #000000, #e31837);
  }
`;

const NavLink = styled(RouterNavLink)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  position: relative;
  transition: color 0.3s ease;

  &.active {
    color: rgb(229, 229, 245);
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #e31837;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
    font-size: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const UserName = styled.span`
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 110%;
  right: -15%;
  background-color: #1e2124;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1002;

  @media (max-width: 768px) {
    position: static;
    display: ${props => props.$isOpen ? 'block' : 'none'};
    width: 100%;
    box-shadow: none;
    background-color: transparent;
  }
`;

const ManagerDropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownContent} {
    display: block;
  }

  ${DropdownContent}::before {
    content: "";
    position: absolute;
    border-width: 20px 30px;
    border-style: solid;
    border-color: transparent transparent #1e2124 transparent;
    right: 50px;
    top: -28px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${DropdownContent}::before {
    content: "";
    position: absolute;
    border-width: 20px 30px;
    border-style: solid;
    border-color: transparent transparent #1e2124 transparent;
    right: 50px;
    top: -30px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ManagerDropdownMobile = styled.div`
  position: relative;
  display: none;

  @media (max-width: 768px) {
    display: inline-block;
    width: 100%;

    > a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover ${DropdownContent} {
    display: block;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownItem = styled(NavLink)`
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #e31837;
  }

  @media (max-width: 768px) {
    padding: 10px 30px;
    font-size: 16px;
  }
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #e31837;
  }

  @media (max-width: 768px) {
    padding: 10px 30px;
    font-size: 16px;
  }
`;

const AuthContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1100;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: 1110;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1098;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;

interface Role {
  _id: string;
  name: string;
}

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isMaster, setIsMaster] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isManagerMobileDropdownOpen, setIsManagerMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.id) {
          const response = await getAccountByIdAPI(user.id);
          if (response && response.account) {
            setUserImage(response.account.image || '');

            const hasManagerAccess = response.account.roles?.some(
              (role: Role) => ['admin', 'master'].includes(role.name.toLowerCase())
            );
            setIsManager(hasManagerAccess);

            const hasMasterRole = response.account.roles?.some(
              (role: Role) => role.name.toLowerCase() === 'master'
            );
            setIsMaster(hasMasterRole);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      try {
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        setIsSearchExpanded(false);
        setSearchTerm('');
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo
            src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png"
            alt="Bá Thành"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </LogoContainer>

        <MobileNavOverlay $isOpen={isMenuOpen} onClick={closeMenu} />

        <NavContainer $isOpen={isMenuOpen}>
          <MobileMenu $isOpen={isMenuOpen}>
            <SearchContainer $isExpanded={true}>
              <SearchIcon style={{ color: '#fff' }} />
              <InputBase
                placeholder="Bạn muốn tìm gì?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                sx={{
                  marginLeft: 1,
                  color: 'white',
                  flex: 1,
                  '& input::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />
            </SearchContainer>

            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AuthButton onClick={() => setIsLoginOpen(true)}>
                  Đăng nhập
                </AuthButton>
                <AuthButton $primary onClick={() => setIsRegisterOpen(true)}>
                  Đăng ký
                </AuthButton>
              </div>
            )}

            {user && (
              <>
                <UserInfoMobi onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}>
                  {(userImage || user.image) ? (
                    <UserAvatar src={userImage || user.image} alt={user.fullName} />
                  ) : (
                    <DefaultAvatar>
                      <PersonIcon />
                    </DefaultAvatar>
                  )}
                  <UserName>{user.fullName}</UserName>
                  {isMobileDropdownOpen ? (
                    <KeyboardArrowUpIcon style={{ color: '#e31837' }} />
                  ) : (
                    <KeyboardArrowDownIcon style={{ color: '#fff' }} />
                  )}
                </UserInfoMobi>

                <MobileDropdownContent $isOpen={isMobileDropdownOpen}>
                  <DropdownItem to="/account/profile" onClick={closeMenu}>
                    Thông tin tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/update" onClick={closeMenu}>
                    Cập nhật tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/changePass" onClick={closeMenu}>
                    Thay đổi mật khẩu
                  </DropdownItem>
                  <DropdownItem to="/account/likeProducts" onClick={closeMenu}>
                    Dịch vụ yêu thích
                  </DropdownItem>
                  <DropdownButton onClick={handleLogout}>
                    Đăng xuất
                  </DropdownButton>
                </MobileDropdownContent>
              </>
            )}
          </MobileMenu>
          <NavLinks $isOpen={isMenuOpen}>
            <NavLink to="/" end onClick={closeMenu}>
              Trang chủ
            </NavLink>
            <NavLink to="/products" onClick={closeMenu}>
              Dịch vụ
            </NavLink>
            <NavLink to="/newslist" onClick={closeMenu}>
              Tin Tức
            </NavLink>
            <NavLink to="/about" onClick={closeMenu}>
              Giới thiệu
            </NavLink>
            <NavLink to="/contact" onClick={closeMenu}>
              Liên hệ
            </NavLink>
            {isManager && (
              <ManagerDropdown>
                <NavLink to="/manager" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Quản lý
                  <KeyboardArrowDownIcon style={{ color: '#fff' }} />
                </NavLink>
                <DropdownContent $isOpen={isDropdownOpen}>
                  {isMaster && (
                    <>
                      <DropdownItem to="/manager/accounts" onClick={closeMenu}>
                        Quản lý tài khoản
                      </DropdownItem>
                      <DropdownItem to="/manager/staff" onClick={closeMenu}>
                        Quản lý nhân viên
                      </DropdownItem>
                    </>
                  )}
                  <DropdownItem to="/manager/products" onClick={closeMenu}>
                    Quản lý dịch vụ
                  </DropdownItem>
                  <DropdownItem to="/manager/news" onClick={closeMenu}>
                    Quản lý tin tức
                  </DropdownItem>
                  <DropdownItem to="/manager/banner" onClick={closeMenu}>
                    Quản lý banner
                  </DropdownItem>
                  <DropdownItem to="/manager/category" onClick={closeMenu}>
                    Quản lý danh mục
                  </DropdownItem>
                  <DropdownItem to="/manager/category-staff" onClick={closeMenu}>
                    Quản lý chức vụ
                  </DropdownItem>
                  <DropdownItem to="/manager/booking" onClick={closeMenu}>
                    Quản lý lịch hẹn
                  </DropdownItem>
                </DropdownContent>
              </ManagerDropdown>
            )}
            {isManager && (
              <>
                <ManagerDropdownMobile>
                  <NavLink to="/manager" onClick={(e) => {
                    e.preventDefault();
                    if (window.innerWidth <= 768) {
                      setIsManagerMobileDropdownOpen(!isManagerMobileDropdownOpen);
                    }
                  }}>
                    Quản lý
                    {window.innerWidth <= 768 && (
                      isManagerMobileDropdownOpen ?
                        <KeyboardArrowUpIcon style={{ color: '#e31837' }} /> :
                        <KeyboardArrowDownIcon style={{ color: '#fff' }} />
                    )}
                  </NavLink>
                  <MobileDropdownContent $isOpen={isManagerMobileDropdownOpen}>
                    {isMaster && (
                      <DropdownItem to="/manager/accounts" onClick={closeMenu}>
                        Quản lý tài khoản
                      </DropdownItem>
                    )}
                    <DropdownItem to="/manager/products" onClick={closeMenu}>
                      Quản lý dịch vụ
                    </DropdownItem>
                    <DropdownItem to="/manager/news" onClick={closeMenu}>
                      Quản lý tin tức
                    </DropdownItem>
                    <DropdownItem to="/manager/banner" onClick={closeMenu}>
                      Quản lý banner
                    </DropdownItem>
                    <DropdownItem to="/manager/category" onClick={closeMenu}>
                      Quản lý danh mục
                    </DropdownItem>
                    <DropdownItem to="/manager/booking" onClick={closeMenu}>
                      Quản lý lịch hẹn
                    </DropdownItem>
                  </MobileDropdownContent>
                </ManagerDropdownMobile>
              </>
            )}
          </NavLinks>
        </NavContainer>
        <AuthContainer>
          {user ? (
            <UserInfo>
              <UserDropdown>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(userImage || user.image) ? (
                    <UserAvatar
                      src={userImage || user.image}
                      alt={user.fullName}
                    />
                  ) : (
                    <DefaultAvatar>
                      <PersonIcon />
                    </DefaultAvatar>
                  )}
                  <UserName>
                    {user.fullName}
                  </UserName>
                </div>
                <DropdownContent $isOpen={isDropdownOpen}>
                  <DropdownItem to="/account/profile" onClick={closeMenu}>
                    Thông tin tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/update" onClick={closeMenu}>
                    Cập nhật tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/changePass" onClick={closeMenu}>
                    Thay đổi mật khẩu
                  </DropdownItem>
                  <DropdownItem to="/account/likeProducts" onClick={closeMenu}>
                    Dịch vụ yêu thích
                  </DropdownItem>
                  <DropdownButton onClick={handleLogout}>
                    Đăng xuất
                  </DropdownButton>
                </DropdownContent>
              </UserDropdown>
            </UserInfo>
          ) : (
            <AuthButtons>
              <AuthButton onClick={() => setIsLoginOpen(true)}>
                Đăng nhập
              </AuthButton>
              <AuthButton $primary onClick={() => setIsRegisterOpen(true)}>
                Đăng ký
              </AuthButton>
            </AuthButtons>
          )}
          <MenuButton onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </MenuButton>
          <SearchContainer
            ref={searchRef}
            $isExpanded={isSearchExpanded}
            onClick={() => setIsSearchExpanded(true)}
          >
            <SearchIcon style={{ color: '#fff' }} />
            {isSearchExpanded && (
              <InputBase
                autoFocus
                placeholder="Bạn muốn tìm gì?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                sx={{
                  marginLeft: 1,
                  color: 'white',
                  flex: 1,
                  '& input::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                  },
                }}
              />
            )}
          </SearchContainer>
        </AuthContainer>
      </HeaderContent>
      <StyledDialog
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <DialogTitleStyled>
          Xác nhận đăng xuất
        </DialogTitleStyled>
        <DialogContentStyled>
          <DialogContentText style={{ margin: 0, color: 'inherit' }}>
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
          </DialogContentText>
        </DialogContentStyled>
        <DialogActionsStyled>
          <ActionButton onClick={() => setIsLogoutModalOpen(false)}>
            Hủy
          </ActionButton>
          <ActionButton $primary onClick={confirmLogout}>
            Đăng xuất
          </ActionButton>
        </DialogActionsStyled>
      </StyledDialog>
      <LoginForm
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <RegisterForm
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </HeaderContainer>
  );
};

export default Header;