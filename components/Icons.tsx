import AntDesign from "@expo/vector-icons/AntDesign";

export const IconCar = ({ color }: { color: string }) => {
  return <AntDesign name="car" size={24} color={color} />;
};

export const IconCalendar = ({ color }: { color: string }) => {
  return <AntDesign name="calendar" size={24} color={color} />;
};

export const IconSetting = ({ color }: { color: string }) => {
  return <AntDesign name="setting" size={24} color={color} />;
};

export const IconHome = ({ color }: { color: string }) => {
  return <AntDesign name="home" size={24} color={color} />;
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

export const IconTool = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="tool"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconClip = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="paperclip"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconIdCard = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="idcard"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};

export const IconDownload = (props: {
  pressed?: boolean;
  style?: any;
  size?: number;
}) => {
  return (
    <AntDesign
      name="download"
      size={props.size || 25}
      color={props.pressed ? "white" : "#282D86"}
      style={props.style}
    />
  );
};
