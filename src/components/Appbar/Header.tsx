import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LoginForm from '../AuthForm/Login/Login';
import RegisterForm from '../AuthForm/Register/Register';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentUser } from '../Utils/auth';
import { getAccountByIdAPI, getCartItemsAPI, removeFromCartAPI } from '../API';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';

const HeaderContainer = styled.header`
  background: linear-gradient(to right, rgb(246, 238, 238), rgb(242, 12, 12) 50%, rgb(11, 9, 9));
  backdrop-filter: blur(8px);
  padding: 5px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

// Change CartButton from button to div
const CartButton = styled.div`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  margin-right: 15px;
  position: relative;
  
  &:hover {
    color: #e31837;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e31837;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const LogoContainer = styled.div`
  flex: 0 0 auto;
  z-index: 1001;
`;

// Add this styled component after other styled components
const UserAvatar = styled.img`
width: 32px;
height: 32px;
border-radius: 50%;
object-fit: cover;
margin-right: 8px;
border: 2px solid #e31837;
`;

const Logo = styled.img`
  height: 70px;
  margin: 10px 0;
  object-fit: contain;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const NavContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  font-size: 20px;
  gap: 30px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
`;

const AuthContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(RouterNavLink)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color:rgb(22, 18, 19);
  }

  &.active {
    color:rgb(229, 229, 245);
    
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
    text-align: center;
    padding: 15px;
    font-size: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    &.active:after {
      display: none;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 15px;
    margin-top: 20px;
  }
`;

const AuthButton = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$primary ? '#e31837' : 'transparent'};
  background-color: ${props => props.$primary ? '#e31837' : 'transparent'};
  color: white;
  min-width: 100px;

  &:hover {
    background-color: ${props => props.$primary ? '#c41730' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.$primary ? '#c41730' : 'white'};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    font-size: 28px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    gap: 15px;
  }
`;

const UserName = styled.span`
  color: #e31837;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const LogoutButton = styled(AuthButton)`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileNav = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1e2124;
    padding: 80px 20px 20px;
    overflow-y: auto;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1e2124;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1002;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 10px;
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

const ManagerDropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownContent} {
    display: block;
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
`;

const CartPreviewContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: #1e2124;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1002;
  display: none;
  padding: 8px;

  ${CartButton}:hover & {
    display: block;
  }
`;

// Add new styled component for delete button
const DeleteItemButton = styled.button`
  background: none;
  border: none;
  color: #888;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 8px;
  
  &:hover {
    color: #e31837;
    transform: scale(1.1);
  }
`;

// Update CartItemPreview to include delete button
const CartItemPreview = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
`;

const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemName = styled.div`
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
`;

const CartItemPrice = styled.div`
  color: #e31837;
  font-weight: 500;
  font-size: 13px;
`;

const CartItemQuantity = styled.span`
  color: #888;
  font-size: 12px;
  margin-left: 8px;
`;

const ViewCartButton = styled(AuthButton)`
  width: 100%;
`;

const ClearCartButton = styled(AuthButton)`
  width: 100%;
  background-color: #666;
  border-color: #666;
  
  &:hover {
    background-color: #555;
    border-color: #555;
  }
`;

// Add this new interface for cart items
interface CartItem {
  _id: string;
  quantity: number;
  product_id: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface Role {
  _id: string;
  name: string;
}

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState('');  // Add this state
  const user = getCurrentUser();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (user?.id) {
          const items = await getCartItemsAPI(user.id);
          setCartItems(items);
          setCartCount(items.length);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        if (user?.id) {
          const response = await getAccountByIdAPI(user.id);
          if (response && response.account) {
            setUserImage(response.account.image || '');
            // Check admin role from fetched account data
            const hasAdminRole = response.account.roles?.some(
              (role: Role) => role.name.toLowerCase() === 'admin'
            );
            setIsAdmin(hasAdminRole);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCartItems();
    fetchUserData();
  }, [user]); // Add user as dependency

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

  const removeCartItem = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    try {
      await removeFromCartAPI(itemId);
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      setCartCount(prev => prev - 1);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  const handleLogout = () => {
    // Clear all storage data
    localStorage.clear();
    sessionStorage.clear();
    // Clear JWT token from cookie if exists
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Reload the page to reset all states and redirect to home
    window.location.href = '/';
  };
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo src="https://res.cloudinary.com/drbjrsm0s/image/upload/v1745463450/logo_ulbaie.png" alt="Ô Tô Bá Thành" />
        </LogoContainer>

        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MenuButton>
        <div
          ref={searchRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '5px 10px',
            transition: 'width 0.4s ease',
            width: isSearchExpanded ? '350px' : '40px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => setIsSearchExpanded(true)}
        >
          <SearchIcon style={{ color: '#fff' }} />
          {isSearchExpanded && (
            <InputBase
              autoFocus
              placeholder="Bạn muốn tìm gì?"
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
        </div>
        <NavContainer>
          <NavLinks $isOpen={false}>
            <NavLink to="/" end>
              Trang chủ
            </NavLink>
            <NavLink to="/services">
              Dịch vụ
            </NavLink>
            <NavLink to="/products">
              Sản phẩm
            </NavLink>
            <NavLink to="/about">
              Giới thiệu
            </NavLink>
            <NavLink to="/contact">
              Liên hệ
            </NavLink>
            {isAdmin && (
              <ManagerDropdown>
                <NavLink to="/manager">
                  Quản lý
                </NavLink>
                <DropdownContent $isOpen={false}>
                  <DropdownItem to="/manager/accounts">
                    Quản lý tài khoản
                  </DropdownItem>
                  <DropdownItem to="/manager/products">
                    Quản lý sản phẩm
                  </DropdownItem>
                  <DropdownItem to="/manager/news">
                    Quản lý tin tức
                  </DropdownItem>
                  <DropdownItem to="/manager/banner">
                    Quản lý banner
                  </DropdownItem>
                  <DropdownItem to="/manager/category">
                    Quản lý danh mục
                  </DropdownItem>
                  <DropdownItem to="/manager/order">
                    Quản lý đơn hàng
                  </DropdownItem>
                </DropdownContent>
              </ManagerDropdown>
            )}
          </NavLinks>
        </NavContainer>

        <AuthContainer>
          <CartButton>
            <div onClick={() => navigate('/cart/cartDetail')}>
              <ShoppingCartIcon />
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </div>
            {cartItems.length > 0 && (
              <CartPreviewContainer>
                {cartItems.map((item) => (
                  <CartItemPreview key={item._id}>
                    <CartItemImage
                      src={item.product_id.image}
                      alt={item.product_id.name}
                    />
                    <CartItemInfo>
                      <CartItemName>
                        {item.product_id.name.length > 30
                          ? `${item.product_id.name.substring(0, 30)}...`
                          : item.product_id.name}
                      </CartItemName>
                      <CartItemPrice>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.product_id.price)}
                        <CartItemQuantity>x{item.quantity}</CartItemQuantity>
                      </CartItemPrice>
                    </CartItemInfo>
                    <DeleteItemButton
                      onClick={(e) => removeCartItem(e, item._id)}
                    >
                      ✕
                    </DeleteItemButton>
                  </CartItemPreview>
                ))}
                <ButtonGroup>
                  <ViewCartButton
                    $primary
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/cart/cartDetail');
                    }}
                  >
                    Xem giỏ hàng
                  </ViewCartButton>
                  <ClearCartButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setCartItems([]);
                      setCartCount(0);
                    }}
                  >
                    Xóa giỏ hàng
                  </ClearCartButton>
                </ButtonGroup>
              </CartPreviewContainer>
            )}
          </CartButton>
          {user ? (
            <UserInfo>
              <UserDropdown>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(userImage || user.image) && (
                    <UserAvatar
                      src={userImage || user.image}
                      alt={user.fullName}
                    />
                  )}
                  <UserName>
                    {user.fullName}
                  </UserName>
                </div>
                <DropdownContent $isOpen={isDropdownOpen}>
                  <DropdownItem to="/account/profile">
                    Thông tin tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/update">
                    Cập nhật tài khoản
                  </DropdownItem>
                  <DropdownItem to="/account/changePass">
                    Thay đổi mật khẩu
                  </DropdownItem>
                  <DropdownItem to="/account/historyOrder">
                    Lịch sử mua hàng
                  </DropdownItem>
                  <DropdownItem to="/account/likeProducts">
                    Sản phẩm yêu thích
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
        </AuthContainer>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <MobileNav>
            <NavLinks $isOpen={true}>
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} end>
                Trang chủ
              </NavLink>
              <NavLink to="/services" onClick={() => setIsMenuOpen(false)}>
                Dịch vụ
              </NavLink>
              <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>
                Sản phẩm
              </NavLink>
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                Giới thiệu
              </NavLink>
              <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
                Liên hệ
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/manager/accounts" onClick={() => setIsMenuOpen(false)}>
                    Quản lý tài khoản
                  </NavLink>
                  <NavLink to="/manager/products" onClick={() => setIsMenuOpen(false)}>
                    Quản lý sản phẩm
                  </NavLink>
                  <NavLink to="/manager/news" onClick={() => setIsMenuOpen(false)}>
                    Quản lý tin tức
                  </NavLink>
                </>
              )}
            </NavLinks>
            {user ? (
              <UserInfo>
                <UserName>{user.fullName}</UserName>
                <NavLink to="/account/profile" onClick={() => setIsMenuOpen(false)}>
                  Thông tin tài khoản
                </NavLink>
                <NavLink to="/account/update" onClick={() => setIsMenuOpen(false)}>
                  Cập nhật tài khoản
                </NavLink>
                <LogoutButton onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}>
                  Đăng xuất
                </LogoutButton>
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
          </MobileNav>
        )}
      </HeaderContent>

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
