import { Text, Image,Dimensions, View, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	container: {
		position:'relative',
		flex: 1,
		backgroundColor:"transparent",
		justifyContent: 'center',
		alignItems:'center'
	}
})
const Container = ({ children, style, ...props }) => {
  return (
    <View style={{...styles.container, ...style}}>{children}</View>
  );
}
export default Container