import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import url from '../../utils/backend'
const getAudio = async(key) => {
	if(!key) return ''
	const res = await axios.get(url + '/file/audio?key=' + key  );
	return res.data.url
}
const useQueryGetAudio = ({queryKey, key}) => {
	
	return useQuery({
		queryKey:queryKey,
		queryFn: () => getAudio(key),
    })
}
export default useQueryGetAudio