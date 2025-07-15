import {jwtDecode} from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

class Auth{
	static async isLoggedIn(){
		const token = await AsyncStorage.getItem('ainai-auth-token')
		if(token){
			const decoded = jwtDecode(token)
			if(decoded.exp * 1000 < Date.now()){
				this.logout();
			}
			return true;
		}
		else return false
	}
	static async login(token){
		try{

			const decoded = jwtDecode(token)
			if(!decoded) throw new Error('invalid_token')
			await AsyncStorage.setItem('ainai-auth-token', token);
			await AsyncStorage.setItem('ainai-auth-name', decoded?.name);
		}
		catch(e){
			console.log(e)
		}
		// axios.defaults.headers.common["authorization"] = 'Bearer ' + token;
	}
	static async logout(){
		await AsyncStorage.removeItem('ainai-auth-token')
		await AsyncStorage.removeItem('ainai-auth-name')
		axios.defaults.headers.common["Authorization"] = ""
	}
	static async getToken(){
		const token = await AsyncStorage.getItem('ainai-auth-token')
		return token
	}
	static async getName(){
		const name = await AsyncStorage.getItem('ainai-auth-name')
		return name
	}
}
export default Auth;