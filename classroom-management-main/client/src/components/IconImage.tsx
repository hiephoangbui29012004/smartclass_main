import React from "react";
import styled from "styled-components";
import AdminIcon from "../assets/admin-icon.svg";
import Logo from "../assets/logo.svg";
import HomeIcon from "../assets/home-icon.svg";
import ClassroomIcon from "../assets/classroom-icon.svg";
import CameraIcon from "../assets/camera-icon.svg";
import AccountIcon from "../assets/account-icon.svg";
import SwitchOn from "../assets/switch-on.svg";
import SwitchOff from "../assets/switch-off.svg";
import UserIcon from "../assets/user-icon.svg";
import Statistics from "../assets/statistics.svg";
import Action from "../assets/action.svg";
import LiveTV from "../assets/live-tv.svg";
import LogoHust from "../assets/hust.svg";
const IconSet = {
  AdminIcon,
  Logo,
  HomeIcon,
  ClassroomIcon,
  CameraIcon,
  AccountIcon,
  SwitchOn,
  SwitchOff,
  UserIcon,
  Statistics,
  Action,
  LiveTV,
  LogoHust,
};

type Props = {
  icon?: keyof typeof IconSet;
  onClick?: () => {};
  cursor?: string;
  width?: number;
  height?: number;
  className?: string;
};

const IconImage: React.FC<Props> = ({
  icon,
  onClick,
  cursor,
  width,
  height,
  className,
}) => {
  return (
    <Styled
      className={className}
      src={icon && IconSet[icon]}
      onClick={onClick}
      cursor={cursor}
      width={width}
      height={height}
    />
  );
};

export { IconSet };

export default IconImage;

const Styled = styled.img<{
  hasEvent?: boolean;
  width?: number;
  height?: number;
  cursor?: string;
}>`
  width: ${(props) => props.width || 24}px;
  height: ${(props) => props.height || 24}px;
  cursor: ${(props) => props.cursor || null};
`;
