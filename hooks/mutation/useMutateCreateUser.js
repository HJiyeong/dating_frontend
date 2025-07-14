import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const createUser = async({kakao_id, name}) => {
	const res = await axios.put(url + '/user/login', {
		kakao_id, name
	})
	return res.data
}
const useMutateCreateUser = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: createUser,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateCreateUser