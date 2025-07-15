import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity,Animated } from 'react-native';
import Container from '../../components/Container';
import useMutateGetImage from '../../hooks/mutation/useMutateGetImage'
import useMutateGetAudio from '../../hooks/mutation/useMutateGetAudio'
import OverlayLoading from '../../components/OverlayLoading';
import SettingsModal from '../../components/SettingsModal';
import useMutateGetScenario from '../../hooks/mutation/useMutateGetScenario'
import useMutateGetCurrentScenario from '../../hooks/mutation/useMutateGetCurrentScenario'
import useQueryGetImage from '../../hooks/query/useQueryGetImage'
import useQueryGetAudio from '../../hooks/query/useQueryGetAudio'
import effectTypeZustand from '../../store/effectType'
import soundTypeZustand from '../../store/soundType'
import {playSignedUrl, playQuoteAudio, stopQuoteAudio, stopSound} from '../../utils/sound'
import Auth from '../../utils/auth'
const WorkspaceScreen = ({navigation}) => {
	const intervalRef = useRef(null);         // 🔸 setInterval ID 저장
	const fullTextRef = useRef('');           // 🔸 전체 텍스트 저장
	const indexRef = useRef(0);
	const [isCurrent, setIsCurrent] = useState(false)
	const [showModal, setShowModal] = useState(false);
	const [displayedText, setDisplayedText] = useState('');
	const [currentId, setCurrentId] = useState('')
	const [dialogList, setDialogList] = useState([])
	const [isAction, setIsAction] = useState(false)
	const [isTyping, setIsTyping] = useState(false);
	const [backgroundImageKey, setBackgroundImageKey] = useState('')
	const [characterImageKey, setCharacterImageKey] = useState('')
	const [backgroundSoundKey, setBackgroundSoundKey] = useState('')
	const effectType = effectTypeZustand(state => state.effectType)
	const soundType = soundTypeZustand(state => state.soundType)
	const [effectSoundKey, setEffectSoundKey] = useState('')
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
	const {mutate: mutateGetCurrentScenario, isLoading: loadingScenario} = useMutateGetCurrentScenario({
		onSuccess:(data) => {
			console.log(data)
		if(data.scene.scenario[0].background_image_id) setBackgroundImageKey(data.scene.scenario[0].background_image_id)
		if(data.scene.scenario[0].not_character) setCharacterImageKey('')
		else if(data.scene.scenario[0].character_image_id) setCharacterImageKey(data.scene.scenario[0].character_image_id)
		if(data.scene.scenario[0].background_sound_id) setBackgroundSoundKey(data.scene.scenario[0].background_sound_id)
		setCurrentId(data.scene.scenario[0].id)
		setDialogList(data.scene.scenario)
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
	useEffect(() => {

		const text = dialogList.find(e => e.id == currentId)?.script || '';
		fullTextRef.current = text;
		indexRef.current = 0

		setDisplayedText('');
		setIsTyping(true);
		intervalRef.current = setInterval(() => {
			if (indexRef.current < fullTextRef.current.length) {
			const nextChar = fullTextRef.current.charAt(indexRef.current);
			setDisplayedText((prev) => prev + nextChar);
			indexRef.current += 1;
			} else {
			clearInterval(intervalRef.current);
			setIsTyping(false);
			}
		}, 50); // 속도는 원하는 대로 조정
		

		return () => clearInterval(intervalRef.current);
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
			if(tmp.background_sound_id) setBackgroundSoundKey(tmp.background_sound_id)
			if(tmp.effect_sound_id) setEffectSoundKey(tmp.effect_sound_id)
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
			setCurrentId(dialogList[currentIndex + 1].id)
		}
	};//where, when, options 필요

    const handleChangeImage = () => {
		if(isCurrent) setCharacterImage(require('../../assets/images/456.png'));
		else setCharacterImage(require('../../assets/images/789.png'));  // 이미지 변경
		setIsCurrent(!isCurrent)
	};
	useEffect(() => {
		if(backgroundSoundKey){
			if(soundType == 'on') playSignedUrl(backgroundSoundKey)
		}
		else stopSound()
	},[backgroundSoundKey])
	useEffect(() => {
		if(effectSoundKey){
			if(effectType == 'on') playQuoteAudio(effectSoundKey)
		}
		else stopQuoteAudio()
	},[effectSoundKey])
	useEffect(() => {
		mutateGetCurrentScenario({})
	},[])
	const checkIsLoggedIn = async() => {
		const item = await Auth.isLoggedIn()
		if(!item) navigation.navigate("Loading")
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
		{(loadingAudio || loadingScenario) && <OverlayLoading/>}
		<Container style={styles.overlay}>
			<TouchableOpacity style={styles.settingsButton} onPress={() => setShowModal(true)}> 
			<Text style={styles.settingsText}>⚙️</Text>
			</TouchableOpacity>

			<View style={styles.characterContainer}>
        <Animated.View style={{ transform: [{ translateX }] }}>
			{characterImageKey && 
			<Image
				source={{uri: characterImageKey}}
				style={styles.characterImage}
				resizeMode="contain"
			/>}
      </Animated.View>
			</View>

<TouchableOpacity onPress={handleNext} activeOpacity={1} style={styles.dialogBox}>

    <View style={{ flex: 1 }}>
        <View style={styles.nameBox}>
            <Text style={styles.nameText}>이름</Text>
        </View>

        <Text style={styles.dialogText}>{displayedText}</Text>
    </View>

    <View style={styles.nextButtonContainer}>
        <Text style={styles.nextButton}>▶</Text>
    </View>

</TouchableOpacity>

			{/* <TouchableOpacity onPress={handleChangeImage} style={[styles.nextButton, { marginTop: 8 }]}>
			<Text style={{ color: 'white' }}>이미지 변경</Text>
			</TouchableOpacity> */}



		</Container>
		<SettingsModal visible={showModal} backgroundSoundKey={backgroundSoundKey} effectSoundKey={effectSoundKey} onClose={() => setShowModal(false)} />

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
		width: 270,//300
		height: 360,//400
	},

dialogBox: {
   
    position: 'absolute',  
    bottom: 20,
    width: '80%',
    height: 100,  // 그대로 유지
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    zIndex: 10,

    flexDirection: 'row',  // 가로로 배치
    justifyContent: 'space-between',
    alignItems: 'center',
},
    nextButtonContainer: {
      alignSelf: 'flex-end',  // 항상 오른쪽 하단으로
      marginTop: 8,
  },

  nextButtonText: {
      color: 'white',
      fontSize: 18,
  },

	nameBox: {
		position: 'absolute',
		top: -40,
		left: 16,
		backgroundColor: 'rgba(255,255,255,0.8)',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 10,
	},

	nameText: {
    fontFamily: 'myfont',
		fontWeight: 'bold',
		fontSize: 14,
		color: '#222',
	},

dialogText: {
   fontFamily: 'myfont',
    fontSize: 18,
    color: '#fff',
    lineHeight: 24,
    flex: 1,  // 가로 공간 차지
    textAlign: 'left',
},
nextButton: {
    marginLeft: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
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
