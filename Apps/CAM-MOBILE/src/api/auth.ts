import API from './API';

export async function login(credentials: { email: string; password: string }) {
  console.log('🔐 Attempting login to:', API.VOLUNTEER.LOGIN);
  console.log('📧 Email:', credentials.email);
  
  try {
    const response = await fetch(API.VOLUNTEER.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    console.log('📡 Login response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('✅ Login successful:', data);
    return data;
  } catch (error) {
    console.error('🔥 Login request failed:', error);
    throw error;
  }
}

export async function logout() {
  console.log('👋 Logging out...');
  // Implement logout logic (clear tokens, etc.)
  // This depends on your auth implementation
}

export async function getCurrentUser() {
  console.log('👤 Fetching current user from:', API.AUTH.ME);
  
  try {
    const response = await fetch(API.AUTH.ME, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add authorization header if needed
    });
    
    console.log('📡 Get user response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ Get user error:', error);
      throw new Error('Failed to get current user');
    }
    
    const data = await response.json();
    console.log('✅ Current user:', data);
    return data;
  } catch (error) {
    console.error('🔥 Get user request failed:', error);
    throw error;
  }
}

export async function registerVolunteer(data: {
  fullName: string;
  age?: number;
  email: string;
  phoneNumber: string;
  password: string;
  skillsAndInterest: string;
  availability: string;
}) {
  console.log('📝 Attempting registration to:', API.VOLUNTEER.REGISTER);
  console.log('📧 Email:', data.email);
  
  try {
    const response = await fetch(API.VOLUNTEER.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    console.log('📡 Registration response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
    
    const result = await response.json();
    console.log('✅ Registration successful:', result);
    return result;
  } catch (error) {
    console.error('🔥 Registration request failed:', error);
    throw error;
  }
}
