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
const Stack = createNativeStackNavigator();
function App() {
  useEffect(() => {
	Orientation.lockToLandscape();
	return () => {
		Orientation.unlockAllOrientations()
	}
  },[])
  return (
	<NavigationContainer>
		<Stack.Navigator initialRouteName="Loading">
			<Stack.Screen name="Loading" options={{headerShown:false}} component={LoadingScreen}/>
			<Stack.Screen name="Main" options={{headerShown:false}} component={MainScreen}/>
		</Stack.Navigator>
	</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
