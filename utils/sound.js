
import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
let currentSound: Sound | null = null;
export const playSignedUrl = (signedUrl) => {
	// 이전 사운드 정리
	if (currentSound) {
		currentSound.stop(() => {
		currentSound.release();
		});
	}

	// 새로운 사운드 객체 생성
	currentSound = new Sound(signedUrl, null, (error) => {
		if (error) {
		console.log('❌ Failed to load sound', error);
		return;
		}

		// ✅ 로딩 성공 시 재생
		currentSound?.play((success) => {
		if (success) {
			console.log('✅ Successfully finished playing');
		} else {
			console.log('❌ Playback failed due to audio decoding errors');
		}

		// currentSound?.release(); // 재생 종료 후 메모리 정리
		currentSound = null;
		});
	});
};

export const stopSound = () => {
	if (currentSound) {
		currentSound.stop(() => {
		currentSound?.release();
		currentSound = null;
		console.log('⏹️ Sound stopped');
		});
	}
  };
export const playQuoteAudio = (key) => {
	const name = effectList[key]
	try {
		SoundPlayer.playSoundFile(name, 'mp3'); // '파일명', '확장자'

	} catch (e) {
		console.log('오디오 재생 오류:', e);
	}
};
export const stopQuoteAudio = () => {
	try {
	  SoundPlayer.stop();
	} catch (e) {
	  console.log('오디오 정지 오류:', e);
	}
  };
const effectList = {
	keyboard: 'keyboard',
	camera:'camera', // 찰칵
	kakao_talk:'kakao_talk',
	bicycle:'bicycle', // 끼이이익
	foot_walk:'foot_walk', //터벅터벅
	heart_beat:'heart_beat', // 심장 두근대는
	wind:'wind', // 바람소리
	cheers:'cheers', // 짠소리

}