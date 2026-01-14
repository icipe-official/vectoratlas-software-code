import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuth } from '../../../api/api'; // Assumed path for client-side fetchAuth
import axios from 'axios';

const VERIFY_ENDPOINT = '/api/auth/verifyToken';

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  let token: string;

  // 1. RETRIEVE TOKEN: Use the existing client-side function to get the raw token.
  try {
    token = await fetchAuth();
  } catch (error: any) {
    // Handle failure to get token (e.g., 401 response from NestJS)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(
        'Failed to retrieve token: Session expired or unauthorized.'
      );
    }
    throw new Error(
      `Token retrieval failed: ${error.message || 'Network error'}`
    );
  }

  // 2. VERIFY TOKEN: POST the raw token to the secure Next.js API route.
  try {
    const verificationResponse = await axios.post(VERIFY_ENDPOINT, { token });

    // 3. The API route returns the fully verified user info
    return verificationResponse.data;
  } catch (error: any) {
    // Handle failure of the verification request with safe type checking
    if (axios.isAxiosError(error)) {
      const errorResponseData = error.response?.data;

      // Safely check if the response data is an object with an 'error' property
      if (
        errorResponseData &&
        typeof errorResponseData === 'object' &&
        'error' in errorResponseData
      ) {
        const serverErrorMessage = (errorResponseData as { error: unknown })
          .error;

        if (typeof serverErrorMessage === 'string') {
          // Throw a new Error object using the server message
          throw new Error(serverErrorMessage);
        }
      }

      // Handle generic server error response (e.g., status 500 without a body)
      if (error.response) {
        throw new Error(
          `Verification request failed: ${
            error.response.statusText || 'Server Error'
          }`
        );
      }
    }

    // Default catch for network errors, etc.
    throw new Error(
      `Verification failed: ${error.message || 'Unknown network error'}`
    );
  }
});
