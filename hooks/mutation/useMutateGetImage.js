import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getImage = async({key}) => {
	const res = await axios.get(url + '/file/image?key=' + key  );
	return res.data
}
const useMutateGetImage = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getImage,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateGetImage