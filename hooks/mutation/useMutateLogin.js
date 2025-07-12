import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getToken = async({google_id, gmail}) => {
	const res = await axios.post(url + '/user', {
		google_id, gmail
	})
	return res.data
}
const useMutateLogin = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getToken,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateLogin