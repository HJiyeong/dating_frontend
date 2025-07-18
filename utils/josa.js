function Josa(txt, josa, isKorea)
{
	var code = txt.charCodeAt(txt.length-1) - 44032;
	var cho = 19, jung = 21, jong=28;
	var i1, i2, code1, code2;

	// 원본 문구가 없을때는 빈 문자열 반환
	if (txt.length == 0){
		if(isKorea) return josa
		return '';
	} 

	// 한글이 아닐때
	if (code < 0 || code > 11171){
		if(isKorea) return txt + josa
		return txt;
	}
	//한글일 떄
	if (code % 28 == 0){
		return txt + Josa.get(josa, false)
	}
	else {
		return txt + Josa.get(josa, true)
	}
}
Josa.get = function (josa, jong) {
	// jong : true면 받침있음, false면 받침없음

	if (josa == '을' || josa == '를') return (jong?'을':'를');
	if (josa == '가') return (jong?'이가':'가');
	if (josa == '이') return (jong?'이':'');
	if (josa == '은' || josa == '는') return (jong?'은':'는');
	if (josa == '와' || josa == '과') return (jong?'와':'과');
	if (josa == '으로' || josa == '로') return (jong?'으로':'로');
	// 알 수 없는 조사
	return '**';
}

export default Josa