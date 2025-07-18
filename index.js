/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
	QueryClient,
	QueryClientProvider,
  } from '@tanstack/react-query'

export const queryClient = new QueryClient();
const Main = () => (
	<QueryClientProvider client={queryClient}>
		<App/>
	</QueryClientProvider>
)
AppRegistry.registerComponent(appName, () => Main);
