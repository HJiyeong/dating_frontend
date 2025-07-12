import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getTest = async() => {
	const res = await axios.get(url + '/scenario')
	return res.data
}
const useMutateGetTest = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getTest,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateGetTest