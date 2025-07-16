import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { View,TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import OverlayLoading from '../../components/OverlayLoading';
import useMutateLogin from '../../hooks/mutation/useMutateLogin'
import useMutateCheckExist from '../../hooks/mutation/useMutateCheckExist'
import useMutateCreateUser from '../../hooks/mutation/useMutateCreateUser'
import OverlayLoading2 from '../../components/OverlayLoading2';
import {
	KakaoOAuthToken,
	KakaoProfile,
	getProfile,
	login,
	logout,
	unlink,
  } from '@react-native-seoul/kakao-login';
import Auth from '../../utils/auth'
const Start = ({navigation}) => {
	const [name, setName] = useState('')
	const [isCreate, setIsCreate] = useState(false)
	const [kakaoId, setKakaoId] = useState('')
	const handleLoadGame = async (): Promise<void> => {
		if(loadingCheck || loadingLogin || loadingCreate || loadingCheckNew) return;
		// const isLoggedIn = await Auth.isLoggedIn()
		// if(isLoggedIn){
		// 	navigation.navigate('Workspace')
		// }
		// else{
			const token: KakaoOAuthToken = await login();
			const profile: KakaoProfile = await getProfile();
			mutateCheckExist({kakao_id: profile.id})
	};
	const handleNewGame = async (): Promise<void> => {
		if(loadingCheck || loadingLogin || loadingCreate || loadingCheckNew) return;
	  	const token: KakaoOAuthToken = await login();
		const profile: KakaoProfile = await getProfile();
		mutateCheckExistNew({kakao_id: profile.id})
	};
	const handleCreate = () => {
		if(!name){
			Alert.alert('이름 없음', '이름을 입력해주세요.')
		}
		else{
			mutateCreateUser({kakao_id: kakaoId, name: name})
		}
	}
	const {mutate: mutateCreateUser, isLoading: loadingCreate} = useMutateCreateUser({
		onSuccess:(data) => {
			mutateLogin({user_id: data.user_id})
		}
	})
	const {mutate: mutateCheckExistNew, isLoading: loadingCheckNew} = useMutateCheckExist({
		onSuccess:(data) => {
			setKakaoId(data.kakao_id)
			setIsCreate(true)
		}
	})
	const {mutate: mutateCheckExist, isLoading: loadingCheck} = useMutateCheckExist({
		onSuccess:(data) => {
            console.log(data, 111)
			if(data.is_exist) mutateLogin({user_id: data.user_id})
			else{
				Alert.alert('계정 없음', 'New Game으로 시작해주세요.')
			}
		}
	})
	const {mutate: mutateLogin, isLoading: loadingLogin} = useMutateLogin({
		onSuccess:async(data) => {
			await Auth.login(data.token)
			if(data.is_first_scene){
				navigation.navigate('Detail')
			}
			else navigation.navigate('Workspace')

		}
	})
	return (
		<View style={styles.container}>
			{(loadingCheck || loadingLogin || loadingCreate || loadingCheckNew) && <OverlayLoading2/>}
		<Image
			source={require('../../assets/images/Home.jpg')}
			style={styles.image}
			resizeMode="cover"
		/>
		{(isCreate) 
		?
				<View style={{position:'absolute', bottom:20, width:'100%'}}>
					<TextInput
						style={{height:40,fontSize: 14, width:'100%', backgroundColor:'#fff' }}
						maxLength={10}
						onBlur={() => setIsCreate(false)}
						placeholder="이름을 입력해주세요"
						value={name}
						onChangeText={setName}
					/>
					<Button title="새 게임 시작하기" onPress={handleCreate} />
				</View>
		:	<>
        <View style={{position:'absolute', bottom:20, alignItems:'center', width:'100%', flexDirection:"row", justifyContent:'center'}}>
			<TouchableOpacity onPress={handleNewGame} style={styles.button}>
				<Image
					source={require('../../assets/images/new_game.png')}  
					style={styles.buttonImage}
					resizeMode="contain"
				/>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleLoadGame} style={styles.button2}>
				<Image
					source={require('../../assets/images/load_game.png')}  
					style={styles.buttonImage}
					resizeMode="contain"
				/>
			</TouchableOpacity>
        </View>
			</>		
		}
		</View>
	);
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent:'center',
  },
    button2: {
    alignItems: 'center',
    justifyContent:'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
    buttonImage: {
    width: 200,
    height: 80,
  },
});


export default Start