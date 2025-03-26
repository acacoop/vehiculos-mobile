import AntDesign from "@expo/vector-icons/AntDesign";

export const IconCar = () => {
  return <AntDesign name="car" size={24} color="white" />;
};

export const IconCalendar = () => {
  return <AntDesign name="calendar" size={24} color="white" />;
};

export const IconSetting = () => {
  return <AntDesign name="setting" size={24} color="white" />;
};

export const IconUser = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="user"
      size={20}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};

export const IconWallet = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="wallet"
      size={20}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};

export const IconLock = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="lock"
      size={20}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};

export const IconLogout = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="logout"
      size={20}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};

export const IconArrowLeft = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="arrowleft"
      size={props.size || 50}
      color={props.pressed ? "white" : "black"}
      style={props.style}
    />
  );
};
