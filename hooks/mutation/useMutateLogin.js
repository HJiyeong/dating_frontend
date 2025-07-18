import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getToken = async({user_id}) => {
	const res = await axios.post(url + '/user/login', {
		user_id
	})
	return res.data
}
const useMutateLogin = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getToken,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateLogin