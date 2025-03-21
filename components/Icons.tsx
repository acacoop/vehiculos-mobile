import AntDesign from "@expo/vector-icons/AntDesign";

export const IconCar = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="car"
      size={24}
      color={props.pressed ? "#FE9000" : "white"}
      style={props.style}
    />
  );
};

export const IconCalendar = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="calendar"
      size={24}
      color={props.pressed ? "#FE9000" : "white"}
      style={props.style}
    />
  );
};

export const IconSetting = (props: { pressed?: boolean; style?: any }) => {
  return (
    <AntDesign
      name="setting"
      size={24}
      color={props.pressed ? "#FE9000" : "white"}
      style={props.style}
    />
  );
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


