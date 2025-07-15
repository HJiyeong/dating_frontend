import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getImage = async(key) => {
	if(!key) return ''
	const res = await axios.get(url + '/file/image?key=' + key)
	return res.data.url
}
const useQueryGetImage = ({key, queryKey}) => {
	
	return useQuery({
		queryKey:queryKey,
		queryFn: () => getImage(key),
    })
}
export default useQueryGetImage