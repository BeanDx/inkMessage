import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "../../context/AuthContext";
import { sidebarLinks } from "../../constants";
import { INavLink } from "../../types";

const LeftSidebar = () => {
  const { pathname } = useLocation();

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-5">
        <NavLink to='/' className="flex gap-3 items-center">
          <img src="/assets/icons/logo.svg" height={48} width={48} alt="logo" />
          <span className="h3-bold md:h2-bold pt-0 sm:pt-0 text-orange-2">Ink</span>
        </NavLink>

        <NavLink to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">
              {user.name}
            </p>
            <p className="small-regular text-orange-2">
              @{user.username}
            </p>
          </div>
        </NavLink>

        {sidebarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;

          return (
            <NavLink
              key={link.label}
              to={link.route}
              className={`flex gap-2 items-center p-3 leftsidebar-link group ${isActive && 'bg-orange-1'}`}
            >
              <img
                src={link.imgURL}
                alt={link.label}
                className={`group-hover:invert-white ${isActive && 'invert-white'}`}
              />
              {link.label}
            </NavLink>
          );
        })}
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img
          src="/assets/icons/logout.svg"
          alt="logout"
        />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
      </div>
    </nav>
  );
}

export default LeftSidebar;