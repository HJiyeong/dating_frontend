import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getScenario = async({id}) => {
	const res = await axios.get(url + '/scene/' + id  );
	return res.data
}
const useMutateGetCharacterList = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: getCharacter,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        },
		onError:(err) => {
			console.log(err)
		}
    })
}
export default useMutateGetCharacterList