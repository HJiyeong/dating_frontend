import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Switch, Pressable } from 'react-native';
import { stopSound, playSignedUrl, playQuoteAudio, stopQuoteAudio } from '../utils/sound';
import effectTypeZustand from '../store/effectType'
import soundTypeZustand from '../store/soundType'
import voiceTypeZustand from '../store/voiceType'
import Auth from '../utils/auth'
const SettingsModal = ({ visible, onClose, backgroundSoundKey, effectSoundKey, navigation }) => {
	const effectType = effectTypeZustand(state => state.effectType)
	const setEffectType = effectTypeZustand(state => state.setEffectType)
	const soundType = soundTypeZustand(state => state.soundType)
	const setSoundType = soundTypeZustand(state => state.setSoundType)
	const voiceType = voiceTypeZustand(state => state.voiceType)
	const setVocieType = voiceTypeZustand(state => state.setVoiceType)
	const handleSound = () => {
		if(soundType == 'on'){
			setSoundType('off')
			stopSound()
		}
		else{
			setSoundType('on')
			if(backgroundSoundKey){
				playSignedUrl(backgroundSoundKey)
			}
		}
	}
	const handleVoice = () => {
		if(voiceType == 'on'){
			setVocieType('off')
			// stopSound()
		}
		else{
			setVocieType('on')
			// if(backgroundSoundKey){
			// 	playSignedUrl(backgroundSoundKey)
			// }
		}
	}
	const handleEffect = () => {
		if(effectType == 'on'){
			setEffectType('off')
			stopQuoteAudio()
		}
		else{
			setEffectType('on')
			if(effectSoundKey){
				playQuoteAudio(effectSoundKey)
			}
		}
	}
    return (
        <Modal visible={visible} style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}} transparent animationType="fade">

        <ImageBackground
            source={require('../assets/images/Home.jpg')}   // 너가 깔고 싶은 배경 이미지
            style={styles.backgroundImage}
        >
            
            <Pressable
				onPress={() => onClose()}
                source={require('../assets/images/modal.jpg')}
                style={styles.modalImage}
                imageStyle={{ resizeMode: 'contain' }}
            >
                <View style={{alignItems:'center', width:'100%'}}>

                <View style={styles.optionBox} onStartShouldSetResponder={() => true}>
                    <Text style={styles.optionText}>배경음</Text>
                    <Switch
                        value={soundType == 'on'}
                        onValueChange={handleSound}
                        thumbColor={soundType == 'on' ? '#57582f86' : '#eee'}
                        trackColor={{ true: '#a5a356ff', false: '#ccc' }}
                    />
                </View>

                {/* 효과음 박스 */}
                <View style={styles.optionBox} onStartShouldSetResponder={() => true}>
                    <Text style={styles.optionText}>효과음</Text>
                    <Switch
                        value={effectType == 'on'}
                        onValueChange={handleEffect}
                        thumbColor={effectType == 'on' ? '#57582f86' : '#eee'}
                        trackColor={{ true: '#a5a356ff', false: '#ccc' }}
                    />
                </View>
                <View style={styles.optionBox} onStartShouldSetResponder={() => true}>
                    <Text style={styles.optionText}>Ai 보이스</Text>
                    <Switch
                        value={voiceType == 'on'}
                        onValueChange={handleVoice}
                        thumbColor={voiceType == 'on' ? '#57582f86' : '#eee'}
                        trackColor={{ true: '#a5a356ff', false: '#ccc' }}
                    />
                </View>
                {/* <View style={{...styles.optionBox, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{...styles.optionText, color:'#dc4a43'}}>로그아웃</Text>
                </View> */}
                <TouchableOpacity 
					style={styles.closeButton} 
					onPress={async() => {
						await Auth.logout()
						navigation.navigate('Main')
					}}
				>
                    <Text style={styles.closeButtonText}>로그아웃</Text>
                </TouchableOpacity>
                </View>
            </Pressable>
        </ImageBackground>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
},
    modalImage: {
        position: 'absolute',
        width: 1000,  
        height: 400,  
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(41, 29, 19, 0.8)',

    },

    modalBox: {
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
},


    optionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',   // 옵션 박스 투명 박스
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 10,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},

optionText: {
    fontFamily: 'myfont',
    color: 'Black',
    fontWeight: 'bold',
    fontSize: 18,
},




    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },

    button: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
    },

    buttonText: {
        fontFamily: 'myfont',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30,
    },

    closeButton: {
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems:'center',
        width: '50%',
        paddingHorizontal: 30,
    },

    closeButtonText: {
        fontFamily: 'myfont',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SettingsModal;
