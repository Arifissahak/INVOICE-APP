import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { HiIdentification } from "react-icons/hi";
import { IoIosNotifications } from "react-icons/io";
import { SiBrandfolder } from "react-icons/si";
import { BsPersonFill } from "react-icons/bs";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { IoSettingsSharp } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { IoFlash } from "react-icons/io5";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { logOutUser, resetState } from "../features/auth/authSlice";

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" >
        <div className="demo-logo-vertical">
        <div className='logoo '><h1 className='big-title'> <i className='green'><IoFlash /></i><span className='lg-logo'>dok&#123;<span className='green'>it</span>&#125;</span></h1></div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              dispatch(logOutUser())
                .then(() => {
                  navigate("/"); // Navigate to "/" after logout is successful
                  toast.success("Logout Successfullly.");
                  dispatch(resetState()); // Reset the auth state
                })
                .catch((error) => {
                  console.error("Logout failed:", error); // Handle logout failure
                });
            } else {
              navigate(key); // Navigate to the specified key
            }
          }}
          items={[
            {
              key: "",
              icon: <IoHome style={{ color: '#11CDEF' }} className="fs-4" />,
              label: "Home",
            },
            {
              icon: <BsPersonFill style={{ color: '#fc5555' }}className="fs-4" />,
              label: "Client",
              children: [
                {
                  key: "customers",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Customers List",
                },
                {
                  key: "add-client",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add - Customers",
                },
              ]
            },
            {
              key: "Invoice",
              icon: <RiCouponLine style={{ color: '#29cc6a' }}className="fs-4" />,
              label: "Invoice",
              children: [
                {
                  key: "invoice",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "View Invoice",
                },
                {
                  key: "client",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Create Invoice",
                },
              ],
            },
            {
              key: "profile",
              icon: <HiIdentification style={{ color: '#0099ff' }} className="fs-4" />,
              label: "Profile",
            },
            {
              key: "reports",
              icon: <SiBrandfolder style={{ color: '#7b61ff' }} className="fs-4" />,
              label: "Reports",
            },
            {
              key: "settings",
              icon: <IoSettingsSharp style={{ color: '#5E72E4' }} className="fs-4" />,
              label: "Settings",
            },
            {
              key: "Privacy Policy",
              icon: <HiOutlinePaperAirplane style={{ color: '#D8D8D8' }}className="fs-4" />,
              label: "Privacy Policy",
            },
            {
              key: "signout",
              icon: <HiOutlinePaperAirplane style={{ color: '#D8D8D8' }}className="fs-4" />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div>

            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img
                  width={32}
                  height={32}
                  src="https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                  alt=""
                />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">Muhammed Arif I</h5>
                <p className="mb-0">muhammedarif@gmail.com</p>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    Signout
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
