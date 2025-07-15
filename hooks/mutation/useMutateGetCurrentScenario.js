import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getCurrentScenario = async() => {
	console.log('123')
	const res = await axios.get(url + '/scenario/current' );
	return res.data
}
const useMutateGetCurrentScenario = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getCurrentScenario,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateGetCurrentScenario