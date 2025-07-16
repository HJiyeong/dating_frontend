import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const checkExist = async({kakao_id}) => {
	console.log(kakao_id)
	const res = await axios.get(url + '/user/exist?id=' + kakao_id);
	return res.data
}
const useMutateCheckExist = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: checkExist,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateCheckExist