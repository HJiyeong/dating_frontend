/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {useEffect} from 'react'
import Orientation from 'react-native-orientation-locker'
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './screens/loading/Loading'
import MainScreen from './screens/main/Main'
import WorkspaceScreen from './screens/workspace-screen/WorkspaceScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from './utils/auth'
import {navigationRef, navigate} from './RootNavigation'
const Stack = createNativeStackNavigator();
function App() {
	const setDefaultInterceptor = () => {
		axios.interceptors.response.use(function (config) {
		return config;
		}, function (error) {
		if(error.response?.data?.message?.name == 'JsonWebTokenError'){
			Auth.logout()
			navigate("Loading")
		}
		return Promise.reject(error);
		});
		
		axios.interceptors.request.use(
		async function(config) {
			const token = await AsyncStorage.getItem("ainai-auth-token"); 
			if (token) {
			config.headers["Authorization"] = 'Bearer ' + token;
			}
			return config;
		},
		function(error) {
			return Promise.reject(error);
		}
		);
	}
	useEffect(() => {
		Orientation.lockToLandscape();
		return () => {
			Orientation.unlockAllOrientations()
		}
	},[])
	const checkIsLoggedIn = async() => {

		const item = await Auth.isLoggedIn()
		if(!item) navigate("Loading")
	}
	useEffect(() => {
		checkIsLoggedIn()
	},[])
	return (
		<>
			{setDefaultInterceptor()}
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator initialRouteName="Loading">
					<Stack.Screen name="Loading" options={{headerShown:false}} component={LoadingScreen}/>
					<Stack.Screen name="Main" options={{headerShown:false}} component={MainScreen}/>
					<Stack.Screen name="Workspace" options={{headerShown:false}} component={WorkspaceScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
