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
  return <AntDesign name="user" size={24} color="black" />;
};

export const IconWallet = (props: { pressed?: boolean; style?: any }) => {
  return <AntDesign name="wallet" size={24} color="black" />;
};

export const IconLock = (props: { pressed?: boolean; style?: any }) => {
  return <AntDesign name="lock" size={24} color="black" />;
};

export const IconLogout = (props: { pressed?: boolean; style?: any }) => {
  return <AntDesign name="logout" size={24} color="black" />;
};
