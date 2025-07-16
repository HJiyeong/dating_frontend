import {Modal, StyleSheet, View, ActivityIndicator,ImageBackground, Text} from 'react-native'
const styles = StyleSheet.create({
	container: {
	  flex: 1, justifyContent: 'center', alignItems: 'center'
	},
	overlay: {
		position:'absolute',
		width:'100%',
		height:'100%',
		zIndex:50,
		// backgroundColor: 'rgba(0,0,0,0.4)', // 반투명 배경
		justifyContent: 'center',
		alignItems: 'center',
	},
	spinnerContainer: {
	  backgroundColor: '#222',
	  padding: 20,
	  borderRadius: 10,
	  alignItems: 'center',
	},
	loadingText: {
	  marginTop: 10,
	  color: '#fff',
	  fontSize: 16,
	},
  });
const OverlayLoading = () => {
	return(
		<ImageBackground 
			source={require('../assets/images/loading.png')} 
			style={styles.overlay}
		>
			<View style={styles.spinnerContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={styles.loadingText}>로딩 중...</Text>
			</View>
		</ImageBackground>
	)
}

export default OverlayLoading