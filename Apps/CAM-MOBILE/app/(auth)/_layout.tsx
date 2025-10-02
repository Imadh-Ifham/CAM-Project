import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />
			<Stack.Screen name="agent/login" options={{ title: 'Agent Login' }} />
			<Stack.Screen name="agent/signup" options={{ title: 'Agent Signup' }} />
			<Stack.Screen name="volunteer/login" options={{ title: 'Volunteer Login' }} />
			<Stack.Screen name="volunteer/signup" options={{ title: 'Volunteer Signup' }} />
		</Stack>
	);
}

