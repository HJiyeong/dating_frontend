import { useEffect, useState } from 'react';
import { Text, Image,Pressable, View, StyleSheet } from 'react-native';
import Container from '../../components/Container'
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	},
	imageBox:{
		position:'relative',
		width:200,
		height:200
	}
})
const Loading = ({navigation}) => {
	return(
		<Pressable style={({pressed}) => ({...styles.container})} onPress={() => navigation.navigate("Start")}>
			<Container>
				<Text>로딩창</Text>
			</Container>
		</Pressable>
	)
}
export default Loading