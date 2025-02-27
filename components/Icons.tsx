import AntDesign from '@expo/vector-icons/AntDesign';

export const IconCar = (props: { pressed?: boolean, style?: any }) => {
  return <AntDesign name="car" size={24} color={props.pressed ? '#FE9000' : 'white'} style={props.style} />
}

export const IconCalendar = (props: { pressed?: boolean, style?: any }) => {
  return <AntDesign name="calendar" size={24} color={props.pressed ? '#FE9000' : 'white'} style={props.style} />
}

export const IconSetting = (props: { pressed?: boolean, style?: any }) => {
  return <AntDesign name="setting" size={24} color={props.pressed ? '#FE9000' : 'white'} style={props.style} />
}
