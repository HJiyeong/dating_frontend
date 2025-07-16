import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet,Alert,InteractionManager, ImageBackground, TouchableOpacity,Animated } from 'react-native';
import Container from '../../components/Container';
import useMutateGetImage from '../../hooks/mutation/useMutateGetImage'
import useMutateGetAudio from '../../hooks/mutation/useMutateGetAudio'
import OverlayLoading from '../../components/OverlayLoading';
import SettingsModal from '../../components/SettingsModal';
import useMutateGetScenario from '../../hooks/mutation/useMutateGetScenario'
import useMutateGetCurrentScenario from '../../hooks/mutation/useMutateGetCurrentScenario'
import useMutateGetCharacterList from '../../hooks/mutation/useMutateGetCharacterList'
import useQueryGetImage from '../../hooks/query/useQueryGetImage'
import useQueryGetAudio from '../../hooks/query/useQueryGetAudio'
import effectTypeZustand from '../../store/effectType'
import soundTypeZustand from '../../store/soundType'
import {playSignedUrl, playQuoteAudio, stopQuoteAudio, stopSound} from '../../utils/sound'
import Auth from '../../utils/auth'
import josa from '../../utils/josa'
const WorkspaceScreen = ({navigation}) => {
	const intervalRef = useRef(null);         // 🔸 setInterval ID 저장
	const fullTextRef = useRef('');           // 🔸 전체 텍스트 저장
	const indexRef = useRef(0);
	const [showModal, setShowModal] = useState(false);
	const [displayedText, setDisplayedText] = useState('');
	const [currentId, setCurrentId] = useState('')
	const [nextSceneId, setNextSceneId] = useState('')
	const [dialogList, setDialogList] = useState([])
	const [characterList, setCharacterList] = useState([])
	const [currentCharacterId, setCurrentCharacterId] = useState()
	const [currentType, setCurrentType] = useState('')
	const [isAction, setIsAction] = useState(false)
	const [isTyping, setIsTyping] = useState(false);
	const [backgroundImageKey, setBackgroundImageKey] = useState('')
	const [characterImageKey, setCharacterImageKey] = useState('')
	const [secondCharacterImageKey, setSecondCharacterImageKey] = useState('')
	const [backgroundSoundKey, setBackgroundSoundKey] = useState('')
	const effectType = effectTypeZustand(state => state.effectType)
	const soundType = soundTypeZustand(state => state.soundType)
	const [effectSoundKey, setEffectSoundKey] = useState('')
	const [isChangeEffect, setIsChangeEffect] = useState(false)
  	const translateX = useRef(new Animated.Value(0)).current;
	//   const [characterImage, setCharacterImage] = useState(require('../../assets/images/sample_img.png'));  // 이미지 상태 추가


  	const animateCharacter = () => {
		Animated.sequence([
			Animated.timing(translateX, {
			toValue: 20,   // 오른쪽으로 20 이동
			duration: 500, // 0.5초
			useNativeDriver: true,
			}),
			Animated.timing(translateX, {
			toValue: -20,  // 왼쪽으로 20 이동
			duration: 500,
			useNativeDriver: true,
			}),
			Animated.timing(translateX, {
			toValue: 0,    // 원위치
			duration: 500,
			useNativeDriver: true,
			}),
		]).start();
	};


	const {mutate: mutateGetImage, isLoading: loadingImage} = useMutateGetImage({
		onSuccess:(data) => {
		console.log(data.url)
		}
	})

    const {mutate: mutateGetAudio, isLoading: loadingAudio} = useMutateGetAudio({
		onSuccess:(data) => {
			console.log(data.url)
		}
	})

	const {mutate: mutateGetCharacter, isLoading: loadingCharacter} = useMutateGetCharacterList({
		onSuccess:(data) => {
			setCharacterList(data.character_list)
		}
	})

	const handleSetScene = (data) => {
		if(data.scene.scenario[0].background_image_id) setBackgroundImageKey(data.scene.scenario[0].background_image_id)
		if(data.scene.scenario[0].not_character) setCharacterImageKey('')
		else if(data.scene.scenario[0].character_image_id) setCharacterImageKey(data.scene.scenario[0].character_image_id)
		if(data.scene.scenario[0].not_character_second) setSecondCharacterImageKey('')
		else if(data.scene.scenario[0].second_character_image_id) setSecondCharacterImageKey(data.scene.scenario[0].second_character_image_id)
		if(data.scene.scenario[0].background_sound_id) setBackgroundSoundKey(data.scene.scenario[0].background_sound_id)
		if(data.scene.scenario[0].character_id) setCurrentCharacterId(data.scene.scenario[0].character_id)
		setCurrentType(data.scene.scenario[0].type)
		setNextSceneId(data.scene.next_scene_id)
		setCurrentId(data.scene.scenario[0].id)
		setDialogList(data.scene.scenario)
	}

    const {mutate: mutateGetScenario, isLoading: loadingScene} = useMutateGetScenario({
		onSuccess:(data) => {
			console.log(data)
			handleSetScene(data)
		}
	})

	const {mutate: mutateGetCurrentScenario, isLoading: loadingScenario} = useMutateGetCurrentScenario({
		onSuccess:(data) => {
			console.log(data)
			handleSetScene(data)
		}
	})
//   const {data: backgroundImage = '', isLoading, isFetching} = useQueryGetImage({
// 	queryKey:['background_image', backgroundImageKey],
// 	key: backgroundImageKey
//   })
//   const {data: characterImage = ''} = useQueryGetImage({
// 	queryKey:['character_image', characterImageKey],
// 	key: characterImageKey
//   })
//   const {data: backgroundSound = ''} = useQueryGetAudio({
// 	queryKey:['background_sound', backgroundSoundKey],
// 	key: backgroundSoundKey
	//   })
	const handleText = async() => {
		// let textItem = dialogList?.find(e => e.id == currentId)?.script || '';
		// if(dialogList?.find(e => e.id == currentId)?.user_name){
		// 	let josaType = dialogList.find(e => e.id == currentId)?.josa
		// 	let userName = await Auth.getName()
		// 	textItem = textItem.replace('user_name', josaType ? josa(userName, josaType): userName)
		// }
		const text = dialogList?.find(e => e.id == currentId)?.script || '';
		fullTextRef.current = text;
		indexRef.current = 0
		intervalRef.current = setInterval(() => {
			if (indexRef.current < fullTextRef.current.length) {
			const nextChar = fullTextRef.current.charAt(indexRef.current);
			setDisplayedText((prev) => prev + nextChar);
			indexRef.current += 1;
			} else {
			clearInterval(intervalRef.current);
			setIsTyping(false);
			}
		}, 500); // 속도는 원하는 대로 조정
		// InteractionManager.runAfterInteractions(() => {
		// })

		return () => clearInterval(intervalRef.current);
	}
	useEffect(() => {
		handleText()
	}, [currentId]);
	const skipTyping = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			setDisplayedText(fullTextRef.current);
			setIsTyping(false);
		}
	};


	const handleNext = () => {
		if(isTyping){
			skipTyping()
			return;
		}
		if (isAction) return; // 타이핑 중일 땐 넘기기 방지
		const currentIndex = dialogList.findIndex(e => e.id == currentId)
		if (currentIndex < dialogList.length - 1) {
			const tmp = dialogList[currentIndex + 1]
			if(tmp.background_image_id) setBackgroundImageKey(tmp.background_image_id)
			if(tmp.not_character) setCharacterImageKey('')
			else if(tmp.character_image_id){
				setCharacterImageKey(tmp.character_image_id)
				setTimeout(() => {
				animateCharacter()
				},300)
			}
			if(tmp.not_character_second) setSecondCharacterImageKey('')
			else if(tmp.second_character_image_id){
				setSecondCharacterImageKey(tmp.second_character_image_id)
				setTimeout(() => {
					animateCharacter()
				},300)
			}
			if(tmp.background_sound_id) setBackgroundSoundKey(tmp.background_sound_id)
			if(tmp.effect_sound_id){
				setEffectSoundKey(tmp.effect_sound_id)
				setIsChangeEffect(!isChangeEffect)
			}
			else setEffectSoundKey('')
			if(tmp.character_action_image_id){
				setIsAction(true)
				setCharacterImageKey(tmp.character_action_image_id)
				if(tmp.character_re_image_id){
					setTimeout(() => {
						setCharacterImageKey(tmp.character_re_image_id)
						setIsAction(false)
					}, 1500)
				}
				else setIsAction(false)
			}
			if(tmp.character_id) setCurrentCharacterId(tmp.character_id)
			else setCurrentCharacterId(null)
			setCurrentType(tmp.type)
			setDisplayedText('');
			setIsTyping(true);
			setCurrentId(dialogList[currentIndex + 1].id)
		}
		else if(currentIndex == (dialogList.length - 1)){
			mutateGetScenario({id: nextSceneId})
		}
	};//where, when, options 필요

    // const handleChangeImage = () => {
	// 	if(isCurrent) setCharacterImage(require('../../assets/images/456.png'));
	// 	else setCharacterImage(require('../../assets/images/789.png'));  // 이미지 변경
	// 	setIsCurrent(!isCurrent)
	// };
	useEffect(() => {
		if(backgroundSoundKey){
			if(soundType == 'on') playSignedUrl(backgroundSoundKey)
		}
		else stopSound()
	},[backgroundSoundKey])
	useEffect(() => {
		if(effectSoundKey){
			if(effectType == 'on'){
				playQuoteAudio(effectSoundKey)
			}
		}
		else stopQuoteAudio()
	},[effectSoundKey, isChangeEffect])

	useEffect(() => {
		mutateGetCurrentScenario({})
		mutateGetCharacter({})
		// mutateGetScenario({id: '68769234a0a3f70c8c5faa39'})
	},[])
	const checkIsLoggedIn = async() => {
		const item = await Auth.isLoggedIn()
		if(!item){
			Alert.alert('로그인 필요', '시작화면으로 이동합니다.')
			navigation.navigate("Start")
		} 
	}
	useEffect(() => {
		checkIsLoggedIn()
	},[])
	return (
		<ImageBackground
			source={{uri: backgroundImageKey}}
			//   source={require('../../assets/images/background2.png')}
			style={{ flex: 1 }}
		>
			{(loadingAudio || loadingScenario || loadingCharacter) && <OverlayLoading/>}
			<Container style={styles.overlay}>
				<TouchableOpacity style={styles.settingsButton} onPress={() => setShowModal(true)}> 
					<Text style={styles.settingsText}>⚙️</Text>
				</TouchableOpacity>

				<View style={styles.characterContainer}>
					<Animated.View style={{position:'relative', transform: [{ translateX }] }}>
						{characterImageKey && 
						<Image
							source={{uri: characterImageKey}}
							style={secondCharacterImageKey ? styles.characterImageFirst: styles.characterImage}
							resizeMode="contain"
						/>}
					</Animated.View>
						{secondCharacterImageKey && 
					<Animated.View style={{position:'relative', transform: [{ translateX }] }}>

						<Image
							source={{uri: secondCharacterImageKey}}
							style={styles.characterImageSecond}
							resizeMode="contain"
						/>
					</Animated.View>
						}
				</View>

				<TouchableOpacity onPress={handleNext} activeOpacity={1} style={styles.dialogBox}>
					<View 
						style={{
							position:'absolute', 
							width:105, 
							height:105, 
							// borderRadius:100,
							// borderColor:'#05000069',
							// borderWidth:1, 
							zIndex:15, 
							alignItems:'center', 
							justifyContent:'center'
						}}
					>
						<Image source={{uri: currentCharacterId ? characterList?.find(e => e._id == currentCharacterId)?.head_image_id : characterList?.find(e => e.is_hero)?.head_image_id}} style={{width:80, height:80}}/>
					</View>
					{currentType != 'narration' && 
					<View style={styles.nameBox}>
						<Text style={styles.nameText}>{currentCharacterId ? characterList.find(e => e._id == currentCharacterId).name : '나'}</Text>
					</View>}
					<View style={{ flex: 1, position:'relative'}}>
						<Text style={styles.dialogText}>{displayedText}</Text>
					</View>
					<View style={styles.nextButtonContainer}>
						<Text style={styles.nextButton}>▼</Text>
					</View>
				</TouchableOpacity>



			</Container>
			<SettingsModal visible={showModal} navigation={navigation} backgroundSoundKey={backgroundSoundKey} effectSoundKey={effectSoundKey} onClose={() => setShowModal(false)} />
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		position: 'relative',
	},

	characterContainer: {
		position: 'absolute',
		bottom: 0,
		right: 100,
		paddingRight: 24,
		zIndex: 1,  
	},

	characterImage: {
		marginRight:100,
		width: 270,//300
		height: 360,//400
	},
	characterImageFirst: {
		position:'absolute',
		bottom:0,
		left:-600,
		width: 270,//300
		height: 360,//400
	},
	characterImageSecond: {
		position:'absolute',
		bottom:0,
		left:-300,
		width: 270,//300
		height: 360,//400
	},

dialogBox: {
   
    position: 'absolute',
	bottom:20,
	height:95,
    width: '85%',
    paddingVertical: 20,
    paddingHorizontal: 10,
	paddingLeft:95,
    // backgroundColor: '#81685DCC',
    backgroundColor: '#A78677CC',
	borderColor:'#05000069',
	borderWidth:1,
    borderRadius: 40,
    zIndex: 10,

    flexDirection: 'row',  // 가로로 배치
    justifyContent: 'space-between',
    alignItems: 'center',
},
    nextButtonContainer: {
      position:'absolute',
	  right:25,
	  bottom:10
  },

  nextButtonText: {
      color: 'white',
      fontSize: 18,
  },

	nameBox: {
		position:'absolute',
		top:-32,
		borderColor: '#05000069',
		borderWidth:1,
		backgroundColor:'#483B35CC',
		paddingHorizontal: 12,
		paddingTop:3,
		paddingBottom:7,
		width:100,
		alignItems:'center',
		borderRadius: 20,
	},

	nameText: {
    	// fontFamily: 'myfont',
		fontSize: 14,
		color: '#fff',
	},

dialogText: {
   fontFamily: 'myfont',
    fontSize: 17,
    color: '#fff',
    lineHeight: 24,
    flex: 1,  // 가로 공간 차지
    textAlign: 'left',
	// textShadowColor:'rgb(0,0,0)',
	// textShadowOffset:'-1px -1px',
	// textShadowRadius:1
},
nextButton: {
	fontSize:20,
	color:'rgb(58, 48, 43)'
},

	settingsButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 20,
		padding: 6,
		backgroundColor: 'rgba(255,255,255,0.4)',
		borderRadius: 8,
	},
});


export default WorkspaceScreen;
