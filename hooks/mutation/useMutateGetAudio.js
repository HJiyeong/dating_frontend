import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getAudio = async({key}) => {
	const res = await axios.get(url + '/file/audio?key=' + key  );
	return res.data
}
const useMutateGetAudio = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getAudio,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateGetAudio