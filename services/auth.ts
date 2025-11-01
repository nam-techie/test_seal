import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Đăng nhập với email và password
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Đăng ký tài khoản mới với email và password
 */
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Đăng xuất
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Chuyển đổi Firebase error code sang message tiếng Việt
 */
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị vô hiệu hóa';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này';
    case 'auth/wrong-password':
      return 'Mật khẩu không đúng';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu (cần ít nhất 6 ký tự)';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng thử lại';
    case 'auth/too-many-requests':
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
    default:
      return error.message || 'Đã xảy ra lỗi. Vui lòng thử lại';
  }
};

