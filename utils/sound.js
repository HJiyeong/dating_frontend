
import Sound from 'react-native-sound';
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