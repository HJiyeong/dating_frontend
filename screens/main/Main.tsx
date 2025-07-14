// App.js 또는 AuthScreen.js
import React, { useRef, useEffect } from 'react';
import { Modal, Button, Alert, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import Container from '../../components/Container';
import {playSignedUrl, stopSound} from '../../utils/sound'
import useMutateGetTest from '../../hooks/mutation/useMutateGetTest'
import OverlayLoading from '../../components/OverlayLoading'
import {
	KakaoOAuthToken,
	KakaoProfile,
	getProfile,
	login,
	logout,
	unlink,
  } from '@react-native-seoul/kakao-login';
// GoogleSignin.configure({
//   webClientId: '193607845791-lnq1d8qg4u1tae24n56rbqe7si147ve2.apps.googleusercontent.com', // Firebase에서 받은 웹용 client ID
//   offlineAccess: true,
// });
// import {NaverLogin, getProfile} from '@react-native-seoul/naver-login'
const androidKeys = {
	kConsumerKey: 'ejgjTEsGzu7thWW8q6CG',
	kConsumerSecret: 'ejgjTEsGzu7thWW8q6CG',
	kServiceAppName: '아이나이',
  };
const Main = ({navigation}) => {
	const {mutate: mutateGetTest, isLoading} = useMutateGetTest({
		onSuccess:(data) => {
			console.log(1, data)
		}
	})
	const signInWithKakao = async (): Promise<void> => {
	  const token: KakaoOAuthToken = await login();
		console.log(token, 1)
		await getKakaoProfile()
	};
	const getKakaoProfile = async (): Promise<void> => {
		const profile: KakaoProfile = await getProfile();
	
		console.log(profile, 2)
	  };
	// useEffect(() => {
	// 	GoogleSignin.configure({
	// 		webClientId: '937023082225-336mh92jog7lcmjlmud7g1qp0crcij8c.apps.googleusercontent.com',
	// 		offlineAccess: true,
	// 	});
	// }, []);
	// const signInWithGoogle = async () => {
	// 	try {
	// 	// await GoogleSignin.hasPlayServices(); // Play Services 체크
	// 	// await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
	// 	// const userInfo = await GoogleSignin.signIn(); // 로그인 트리거
	// 	// console.log(userInfo);
	// 	// const userId = userInfo.user.id;
	// 	// Alert.alert('로그인 성공', `User ID: ${userId}`);
	// 	const {idToken} = await GoogleSignin.signIn();
	// 	console.log(idToken);
	// 	const googleCredential = auth.GoogleAuthProvider.credential(idToken);
	// 	return auth().signInWithCredential(googleCredential);
	// 	// console.log(123)
	// 	// console.log(455)

	// 	// TODO: userId로 게임 세이브 로직 연결
	// 	} catch (error) {
	// 	console.error('로그인 실패', error);
	// 	}
	// };
	// const handleSignOut = () => {
	// 	try {
	// 	  auth().signOut();
	// 	} catch (error) {
	// 	  console.log(error.stack);
	// 	}
	//   };

	return (
		<>
			<Container>
				{isLoading && <OverlayLoading/>}
				{/* <Image 
					source={{uri:'https://ai-o-siranai.s3.ap-northeast-2.amazonaws.com/ai-nai-example1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4GJUZYWKR46M7U2P%2F20250711%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250711T124023Z&X-Amz-Expires=3600&X-Amz-Signature=07f4b7fc1388d1d7abeb927ca0f43e214e55acacdfe6ac3306c127a6b382ea39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject'}}
					style={{width:200, height:200}}
					resizeMode="contain"
				/> */}
				<Button title="구글 계정으로 시작하기" onPress={signInWithKakao} />
				<Button title="백그라운드 재생" onPress={() => playSignedUrl('')} />
				<Button title="스탑" onPress={() => stopSound()} />
				<Button title="시나리오" onPress={() => mutateGetTest()} />
				<Button title='내 작업 공간' onPress={() => navigation.navigate('Workspace')} />
			</Container>
		</>
	);
}

export default Main