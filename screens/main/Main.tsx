// App.js 또는 AuthScreen.js
import React, { useRef, useState } from 'react';
import { TextInput, Button, Alert, Image } from 'react-native';
import {useMutation} from '@tanstack/react-query'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Container from '../../components/Container';
import {playSignedUrl, stopSound} from '../../utils/sound'
import axios from 'axios'
import url from '../../utils/backend'
import useMutateGetTest from '../../hooks/mutation/useMutateGetTest'
import useMutateLogin from '../../hooks/mutation/useMutateLogin'
import useMutateCheckExist from '../../hooks/mutation/useMutateCheckExist'
import useMutateCreateUser from '../../hooks/mutation/useMutateCreateUser'
import Auth from '../../utils/auth'
import OverlayLoading from '../../components/OverlayLoading'
import {
	KakaoOAuthToken,
	KakaoProfile,
	getProfile,
	login,
	logout,
	unlink,
  } from '@react-native-seoul/kakao-login';
const Main = ({navigation}) => {
	const [name, setName] = useState('')
	const [isCreate, setIsCreate] = useState(false)
	const [kakaoId, setKakaoId] = useState('')
	const {mutate: mutateGetTest, isLoading} = useMutateGetTest({
		onSuccess:(data) => {
			console.log(1, data)
		}
	})
	const signInWithKakao = async (): Promise<void> => {
	  	const token: KakaoOAuthToken = await login();
		const profile: KakaoProfile = await getProfile();
		mutateCheckExist({kakao_id: profile.id})
	};
	const {mutate: mutateCreateUser, isLoading: loadingCreate} = useMutateCreateUser({
		onSuccess:(data) => {
			mutateLogin({user_id: data.user_id})
		}
	})
	const {mutate: mutateCheckExist, isLoading: loadingCheck} = useMutateCheckExist({
		onSuccess:(data) => {
			if(data.is_exist) mutateLogin({user_id: data.user_id})
			else{
				setKakaoId(data.kakao_id)
				setIsCreate(true)
			}
		}
	})
	const {mutate: mutateLogin, isLoading: loadingLogin} = useMutateLogin({
		onSuccess:async(data) => {
			await Auth.login(data.token)
		}
	})
	return (
		<>
			<Container>
				{(isLoading || loadingCheck || loadingLogin || loadingCreate) && <OverlayLoading/>}
				{/* <Image 
					source={{uri:'https://ai-o-siranai.s3.ap-northeast-2.amazonaws.com/ai-nai-example1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4GJUZYWKR46M7U2P%2F20250711%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250711T124023Z&X-Amz-Expires=3600&X-Amz-Signature=07f4b7fc1388d1d7abeb927ca0f43e214e55acacdfe6ac3306c127a6b382ea39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'}}
					style={{width:200, height:200}}
					resizeMode="contain"
				/> */}
				<Button title="카카오 로그인" onPress={signInWithKakao} />
				{/* <Button title="백그라운드 재생" onPress={() => playSignedUrl('')} />
				<Button title="스탑" onPress={() => stopSound()} />
				<Button title="시나리오" onPress={() => mutateGetTest()} /> */}
				<Button title='내 작업 공간' onPress={() => navigation.navigate('Workspace')} />
				<Button title='홈화면' onPress={() => navigation.navigate('Start')} />
				<Button title='소개화면' onPress={() => navigation.navigate('Detail')} />

				{isCreate && 
				<>
					<TextInput
						style={{height:50,fontSize: 14 }}
						maxLength={10}
						placeholder="이름을 입력해주세요"
						value={name}
						onChangeText={setName}
					/>
					<Button title="계정생성하기" onPress={() => mutateCreateUser({kakao_id: kakaoId, name: name})} />
				</>
				}
			</Container>
		</>
	);
}

export default Main