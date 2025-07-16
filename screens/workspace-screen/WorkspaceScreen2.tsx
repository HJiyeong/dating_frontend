import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet,Alert, ImageBackground, TouchableOpacity,Animated } from 'react-native';
import Container from '../../components/Container';
import FastImage from 'react-native-fast-image'
import useMutateGetImage from '../../hooks/mutation/useMutateGetImage'
import useMutateGetAudio from '../../hooks/mutation/useMutateGetAudio'
import OverlayLoading from '../../components/OverlayLoading';
import SettingsModal from '../../components/SettingsModal';
import { useMutation } from "@tanstack/react-query";
import useMutateGetScenario from '../../hooks/mutation/useMutateGetScenario'
import useMutateGetCurrentScenario from '../../hooks/mutation/useMutateGetCurrentScenario'
import useMutateGetCharacterList from '../../hooks/mutation/useMutateGetCharacterList'
import useQueryGetImage from '../../hooks/query/useQueryGetImage'
import url from '../../utils/backend'
import useQueryGetAudio from '../../hooks/query/useQueryGetAudio'
// import {backgroundImageObject, characterImageObject, characterHeadObject} from '../../utils/urlObject'
import effectTypeZustand from '../../store/effectType'
import soundTypeZustand from '../../store/soundType'
import {playSignedUrl, playQuoteAudio, stopQuoteAudio, stopSound} from '../../utils/sound'
import Auth from '../../utils/auth'
import josa from '../../utils/josa'
import axios from 'axios';
export const chapterImageObject = {
	'chapter1': require('../../assets/images/ch1.png'),
	'chapter2': require('../../assets/images/ch2.png'),
	'chapter3': require('../../assets/images/ch3.png'),
	'chapter4': require('../../assets/images/ch4.png')
}
export const backgroundImageObject = {
	'blackboard_harin.jpg': require('../../assets/images/background/blackboard_harin.jpg'),
	'blackboard_seoyeon.jpg': require('../../assets/images/background/blackboard_seoyeon.jpg'),
	'cafe.jpg': require('../../assets/images/background/cafe.jpg'),
	'cafeteria.jpg': require('../../assets/images/background/cafeteria.jpg'),
	'chicken.jpg': require('../../assets/images/background/chicken.jpg'),
	'city.jpg': require('../../assets/images/background/city.jpg'),
	'classroom_signboard.jpg': require('../../assets/images/background/classroom_signboard.jpg'),
	'classroom.jpg': require('../../assets/images/background/classroom.jpg'),
	'entrace.jpg': require('../../assets/images/background/entrace.jpg'),
	'entrance_rounge1.jpg': require('../../assets/images/background/entrance_rounge1.jpg'),
	'entrance_rounge2.jpg': require('../../assets/images/background/entrance_rounge2.jpg'),
	'goose.jpg': require('../../assets/images/background/goose.jpg'),
	'kakao_talk.png': require('../../assets/images/background/kakao_talk.png'),
	'middle_rounge.jpg': require('../../assets/images/background/middle_rounge.jpg'),
	'movie.jpg': require('../../assets/images/background/movie.jpg'),
	'night_light1.jpg': require('../../assets/images/background/night_light1.jpg'),
	'night_light2.jpg': require('../../assets/images/background/night_light2.jpg'),
	'passageway.jpg': require('../../assets/images/background/passageway.jpg'),
	'river1.jpg': require('../../assets/images/background/river1.jpg'),
	'river2.jpg': require('../../assets/images/background/river2.jpg'),
	'street.jpg': require('../../assets/images/background/street.jpg'),
	'sungsimdang.jpg': require('../../assets/images/background/sungsimdang.jpg'),
}
export const characterImageObject = {
	'harin_angry.png': require('../../assets/images/character/harin_angry.png'),
	'harin_back.png': require('../../assets/images/character/harin_back.png'),
	'harin_basic.png': require('../../assets/images/character/harin_basic.png'),
	'harin_detail.png': require('../../assets/images/character/harin_detail.png'),
	'harin_embarrass.png': require('../../assets/images/character/harin_embarrass.png'),
	'harin_half_back.png': require('../../assets/images/character/harin_half_back.png'),
	'harin_home.png': require('../../assets/images/character/harin_home.png'),
	'harin_shame.png': require('../../assets/images/character/harin_shame.png'),
	'harin_side.png': require('../../assets/images/character/harin_side.png'),
	'harin_smile.png': require('../../assets/images/character/harin_smile.png'),
	'harin_upset.png': require('../../assets/images/character/harin_upset.png'),
	'hero_detail.png': require('../../assets/images/character/hero_detail.png'),
	'hero_basic.png': require('../../assets/images/character/hero_basic.png'),
	'jinseop_basic.png': require('../../assets/images/character/jinseop_basic.png'),
	'jinseop_detail.png': require('../../assets/images/character/jinseop_detail.png'),
	'nubzuki_basic.png': require('../../assets/images/character/nubzuki_basic.png'),
	'nubzuki_detail.png': require('../../assets/images/character/nubzuki_detail.png'),
	'jihoo_basic.png': require('../../assets/images/character/jihoo_basic.png'),
	'jihoo_detail.png': require('../../assets/images/character/jihoo_detail.png'),
	'seoyeon_angry.png': require('../../assets/images/character/seoyeon_angry.png'),
	'seoyeon_back.png': require('../../assets/images/character/seoyeon_back.png'),
	'seoyeon_basic.png': require('../../assets/images/character/seoyeon_basic.png'),
	'seoyeon_detail.png': require('../../assets/images/character/seoyeon_detail.png'),
	'seoyeon_embarrass.png': require('../../assets/images/character/seoyeon_embarrass.png'),
	'seoyeon_home.png': require('../../assets/images/character/seoyeon_home.png'),
	'seoyeon_lighit_smile.png': require('../../assets/images/character/seoyeon_lighit_smile.png'),
	'seoyeon_shame.png': require('../../assets/images/character/seoyeon_shame.png'),
	'seoyeon_side.png': require('../../assets/images/character/seoyeon_side.png'),
	'seoyeon_smile.png': require('../../assets/images/character/seoyeon_smile.png'),
}
export const characterHeadImageObject = {
	'harin_head.png': require('../../assets/images/head/harin_head.png'),
	'hero_head.png': require('../../assets/images/head/hero_head.png'),
	'jihoo_head.png': require('../../assets/images/head/jihoo_head.png'),
	'jinseop_head.png': require('../../assets/images/head/jinseop_head.png'),
	'nubzuki_head.png': require('../../assets/images/head/nubzuki_head.png'),
	'seoyeon_head.png': require('../../assets/images/head/seoyeon_head.png'),
}
const WorkspaceScreen = ({navigation}) => {
	const intervalRef = useRef(null);         // 🔸 setInterval ID 저장
	const fullTextRef = useRef('');           // 🔸 전체 텍스트 저장
	const indexRef = useRef(0);
	const [showModal, setShowModal] = useState(false);
	const [displayedText, setDisplayedText] = useState('');
	const [justLoading, setJustLoading] = useState(false)
	const [nextSceneId, setNextSceneId] = useState('')
	const [dialogList, setDialogList] = useState([])
	const [characterList, setCharacterList] = useState([])
	const [isAction, setIsAction] = useState(false)
	const [isTyping, setIsTyping] = useState(false);
	// const [currentId, setCurrentId] = useState('')
	// const [currentCharacterId, setCurrentCharacterId] = useState()
	// const [currentType, setCurrentType] = useState('')
	// const [backgroundImageKey, setBackgroundImageKey] = useState('')
	// const [characterImageKey, setCharacterImageKey] = useState('')
	// const [secondCharacterImageKey, setSecondCharacterImageKey] = useState('')
	// const [backgroundSoundKey, setBackgroundSoundKey] = useState('')
	// const [effectSoundKey, setEffectSoundKey] = useState('')
	const [item, setItem] = useState({})
	const [visibleText, setVisibleText] = useState('')
	const effectType = effectTypeZustand(state => state.effectType)
	const [scoreList, setScoreList] = useState([])
	const soundType = soundTypeZustand(state => state.soundType)
	const [isChangeEffect, setIsChangeEffect] = useState(false)
	const [eventTitle, setEventTitle] = useState('')
	const [chapterTitle, setChapterTitle] = useState('')
	const [chapterNumber, setChapterNumber] = useState('')
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
		const doc = {}
		if(data.scene.scenario[0].where && data.scene.scenario[0].when) doc.info = data.scene.scenario[0].when + ', ' + data.scene.scenario[0].where
		if(data.scene.scenario[0].background_image_id) doc.background_image_id = data.scene.scenario[0].background_image_id
		if(data.scene.scenario[0].not_character) doc.character_image_id = ''
		else if(data.scene.scenario[0].character_image_id) doc.character_image_id = data.scene.scenario[0].character_image_id
		if(data.scene.scenario[0].not_character_second) doc.second_character_image_id = ''
		else if(data.scene.scenario[0].second_character_image_id) doc.second_character_image_id = data.scene.scenario[0].second_character_image_id
		if(data.scene.scenario[0].background_sound_id) doc.background_sound_id = data.scene.scenario[0].background_sound_id
		if(data.scene.scenario[0].character_id) doc.character_id = data.scene.scenario[0].character_id
		doc.type = data.scene.scenario[0].type
		doc.current_id = data.scene.scenario[0].id
		setNextSceneId(data.scene.next_scene_id)
		setItem(doc)
		setDialogList(data.scene.scenario)
	}
	const handleEventTitle = (event_title) => {
		setEventTitle(event_title); // 글자 띄우기
		const timer = setTimeout(() => {
			setEventTitle(''); // 일정 시간 후 사라지게
		  }, 3000); // 2초 표시
	  
		  return () => clearTimeout(timer); // cleanup
	}
    const {mutate: mutateGetScenario, isLoading: loadingScene} = useMutateGetScenario({
		onSuccess:(data) => {
			handleGetInfo(data)
			setJustLoading(false)
		}
	})
	const handleGetInfo = (data) => {
		if(data.scene.event == 1){
			setChapterTitle(data.scene.chapter_title)
			setChapterNumber(data.scene.chapter_number)
			const timer = setTimeout(() => {
				setChapterTitle('')
				setChapterNumber('')
				handleEventTitle(data.scene.event + '. ' + data.scene.event_title)
				handleSetScene(data)
			}, 3000)
			return () => clearTimeout(timer)
		}
		else{
			handleEventTitle(data.scene.event + '. ' + data.scene.event_title)
			handleSetScene(data)
		}
	}
	const {mutate: mutateGetCurrentScenario, isLoading: loadingScenario} = useMutateGetCurrentScenario({
		onSuccess:(data) => {
			handleGetInfo(data)
			setJustLoading(false)
		},
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
		let textItem = dialogList?.find(e => e.id == item.current_id)?.script || '';
		if(dialogList?.find(e => e.id == item.current_id)?.user_name === true){
			let josaType = dialogList.find(e => e.id == item.current_id)?.josa
			let userName = await Auth.getName()
			textItem = textItem.replace('user_name', josaType ? josa(userName, josaType): userName)
		}
		const text = textItem
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
	}
	useEffect(() => {
		handleText()
	}, [item.current_id]);
	const skipTyping = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			setDisplayedText(fullTextRef.current);
			setIsTyping(false);
		}
	};
	const handleChangeEvent = async() => {
		const res = await axios.post(url + '/user/score', {
			next_scene_id:nextSceneId,
			score_list: scoreList
		})
		return res.data
	}
	const {mutate: mutateChangeEvent, isLoading: loadingChangeEvent} = useMutation({
		mutationFn: handleChangeEvent,
		onSuccess:(data) => {
			setJustLoading(true)
			mutateGetScenario({id: nextSceneId})
			setScoreList([])
		}
	})
	const handleNext = () => {
		if(isTyping){
			skipTyping()
			return;
		}
		if(item.options?.length > 0 && scoreList.length == 0) return;
		if (isAction) return; // 타이핑 중일 땐 넘기기 방지
		const currentIndex = dialogList.findIndex(e => e.id == item.current_id)
		if (currentIndex < dialogList.length - 1) {
			const tmp = dialogList[currentIndex + 1]
			const doc = {...item}
			if(tmp.where && tmp.when) doc.info = tmp.when + ', ' + tmp.where
			else if(tmp.where && doc.when) doc.info = doc.when + ', ' + tmp.where
			else if(tmp.when && doc.where) doc.info = tmp.when + ', ' + doc.where
			else doc.info = ''
			if(tmp.background_image_id) doc.background_image_id = tmp.background_image_id
			if(tmp.not_character) doc.character_image_id = ''
			else if(tmp.character_image_id){
				doc.character_image_id = tmp.character_image_id
			}
			if(tmp.not_character_second) doc.second_character_image_id = ''
			else if(tmp.second_character_image_id){
				doc.second_character_image_id = tmp.second_character_image_id
			}
			if(tmp.background_sound_id) doc.background_sound_id = tmp.background_sound_id
			if(tmp.effect_sound_id){
				doc.effect_sound_id = tmp.effect_sound_id
				setIsChangeEffect(!isChangeEffect)
			}
			else doc.effect_sound_id = ''
			if(tmp.character_action_image_id){
				setIsAction(true)
				doc.character_image_id = tmp.character_action_image_id
			}
			if(tmp.character_id) doc.character_id = tmp.character_id
			else doc.character_id = ''
			if(tmp.options) doc.options = tmp.options
			else doc.options = []
			doc.type = tmp.type
			// setCurrentType(tmp.type)
			doc.current_id = dialogList[currentIndex + 1].id
			// setCurrentId(dialogList[currentIndex + 1].id)
			setItem(doc)
			setTimeout(() => {
				animateCharacter()
			},300)
			if(tmp.character_re_image_id){
				setTimeout(() => {
					// setCharacterImageKey(tmp.character_re_image_id)
					setItem({...doc, character_image_id: tmp.character_re_image_id})
					setIsAction(false)
				}, 1500)
			}
			else setIsAction(false)
		}
		else if(currentIndex == (dialogList.length - 1)){
			// mutateGetScenario({id: nextSceneId})
			mutateChangeEvent({})
		}
	};//where, when, options 필요

    // const handleChangeImage = () => {
	// 	if(isCurrent) setCharacterImage(require('../../assets/images/456.png'));
	// 	else setCharacterImage(require('../../assets/images/789.png'));  // 이미지 변경
	// 	setIsCurrent(!isCurrent)
	// };
	useEffect(() => {
		if (!item.info) return;
	
		setVisibleText(item.info); // 글자 띄우기
		const timer = setTimeout(() => {
			setVisibleText(''); // 일정 시간 후 사라지게
		  }, 3000); // 2초 표시
	  
		  return () => clearTimeout(timer); // cleanup
	},[item.info])
	useEffect(() => {
		if(item.background_sound_id){
			if(soundType == 'on') playSignedUrl(item.background_sound_id)
		}
		else stopSound()
	},[item.background_sound_id])
	useEffect(() => {
		if(item.effect_sound_id){
			if(effectType == 'on'){
				playQuoteAudio(item.effect_sound_id)
			}
		}
		else stopQuoteAudio()
	},[item.effect_sound_id, isChangeEffect])

	useEffect(() => {
		setJustLoading(true)
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
		<FastImage //ImageBackground
			// source={{uri: item.background_image_id}}
			source={backgroundImageObject[item.background_image_id]}
			style={{ flex: 1 }}
		>
			{(loadingAudio || loadingChangeEvent || loadingScenario || loadingScene || loadingCharacter) && <OverlayLoading/>}
			<Container style={styles.overlay}>
				<TouchableOpacity style={styles.settingsButton} onPress={() => setShowModal(true)}> 
					<Text style={styles.settingsText}>⚙️</Text>
				</TouchableOpacity>
				{eventTitle && 
				<ImageBackground
					source={require('../../assets/images/event_title_conatiner.png')}
					style={{width:500, height:100, zIndex:30, justifyContent:'center', alignItems:'center'}}
				>
					<Text style={{fontFamily:'myfont', color:'#412316', fontSize:30, fontWeight:'bold'}}>{eventTitle}</Text>
				</ImageBackground>}
				{chapterTitle && 
				<ImageBackground
					source={require('../../assets/images/chapter_title_container.png')}
					style={{position:'absolute', width:'100%', top:20, zIndex:30, height:'95%', flexDirection:'row',alignItems:'center',}}
				>
					<FastImage 
						source={chapterImageObject['chapter' + chapterNumber]}
						style={{width:171, height:256, marginLeft:50}}
					/>
					<View style={{flex: 1, paddingRight:50}}>
						<View style={{borderColor:'#000', borderBottomWidth:1, paddingBottom:10, alignItems:'center'}}>
							<Text style={{fontSize:30, color: '#fff', fontWeight:'bold'}}>{'Chapter' + chapterNumber +'.'}</Text>
						</View>
						<View style={{borderColor:'#000', borderBottomWidth:1,alignItems:'center', paddingBottom:10}}>
							<Text style={{fontSize:30, color: '#fff', fontWeight:'bold'}}>{'"' + chapterTitle + '"'}</Text>
						</View>
					</View>
				</ImageBackground>}
				{visibleText && 
				<View style={{position:'absolute', height: 30,zIndex:30, width:'100%', top:60, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', paddingLeft:30}}>
					<Text style={{fontFamily:'myfont', color:'#fff'}}>{visibleText}</Text>
				</View>}
				{item.options?.length > 0 && 
					<View style={{position:'absolute',width:'100%', gap:20, height:'100%', justifyContent:'center', alignItems:'center'}}>	
					{item.options.map(data => {
						return(
							<TouchableOpacity 
								onPress={() => {
									setScoreList(data.score_list); 
									setDisplayedText(data.text)
									setItem(prev => ({...prev, options: []}))
								}} 
								key={data.id} style={{width:450,fontFamily:'myfont',  height:60, borderRadius:33, justifyContent:'center', alignItems:'center', zIndex:20, backgroundColor:'#694E44', borderColor:'#050000', borderWidth:1}}>
								<Text style={{color:'#fff'}}>{data.text}</Text>
							</TouchableOpacity>
						)
					})}
					</View>
				}
				<View style={styles.characterContainer}>
					<Animated.View style={{position:'relative', transform: [{ translateX }] }}>
						{item.character_image_id && 
						<FastImage
							// source={{uri: item.character_image_id}}
							// source={require('../../assets/images/character/' + item.character_image_id)}
							source={characterImageObject[item.character_image_id]}
							style={item.second_character_image_id ? styles.characterImageFirst: styles.characterImage}
							resizeMode="contain"
						/>}
					</Animated.View>
						{item.second_character_image_id && 
					<Animated.View style={{position:'relative', transform: [{ translateX }] }}>

						<FastImage
							// source={{uri: item.second_character_image_id}}
							// source={require('../../assets/images/character/' + item.second_character_image_id)}
							source={characterImageObject[item.second_character_image_id]}
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
							// backgroundColor:'rgb(217, 217, 217)', 
							// left:-20, 
							alignItems:'center', 
							justifyContent:'center'
						}}
					>
						<FastImage 
							// source={{uri: item.character_id ? characterList?.find(e => e._id == item.character_id)?.head_image_id : characterList?.find(e => e.is_hero)?.head_image_id}} 
							// source={require('../../assets/images/character/' + (item.character_id ? characterList?.find(e => e._id == item.character_id)?.head_image_id : characterList?.find(e => e.is_hero)?.head_image_id))}
							source={characterHeadImageObject[(item.character_id ? characterList?.find(e => e._id == item.character_id)?.head_image_id : characterList?.find(e => e.is_hero)?.head_image_id)]}
							style={{width:80, height:80}}
						/>
					</View>
					{item.type != 'narration' && 
					<View style={styles.nameBox}>
						<Text style={styles.nameText}>{item.character_id ? characterList?.find(e => e._id == item.character_id)?.name : '나'}</Text>
					</View>}
					<View style={{ flex: 1, position:'relative'}}>
						{/* <View style={{position:'absolute', right:-50, top:-100, height:50, width:100}}>
							<View style={{height:30,backgroundColor:'rgba(0,0,0,0.6)'}}>
								<Text style={{color:'#fff'}}>선택지 1</Text>
							</View>
							<View style={{height:30,backgroundColor:'rgba(0,0,0,0.6)'}}>
								<Text style={{color:'#fff'}}>선택지 1</Text>
							</View>
							<View style={{height:30,backgroundColor:'rgba(0,0,0,0.6)'}}>
								<Text style={{color:'#fff'}}>선택지 1</Text>
							</View>
							<View style={{height:30,backgroundColor:'rgba(0,0,0,0.6)'}}>
								<Text style={{color:'#fff'}}>선택지 1</Text>
							</View>
						</View> */}
						<Text style={styles.dialogText}>{displayedText}</Text>
					</View>
					<View style={styles.nextButtonContainer}>
						<Text style={styles.nextButton}>▼</Text>
					</View>
				</TouchableOpacity>

				{/* <TouchableOpacity onPress={handleChangeImage} style={[styles.nextButton, { marginTop: 8 }]}>
				<Text style={{ color: 'white' }}>이미지 변경</Text>
				</TouchableOpacity> */}



			</Container>
			<SettingsModal visible={showModal} navigation={navigation} backgroundSoundKey={item.background_sound_id} effectSoundKey={item.effect_sound_id} onClose={() => setShowModal(false)} />
		</FastImage>
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
