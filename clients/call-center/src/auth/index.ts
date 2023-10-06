import {
  Auth,
  User,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthProvider {
  signIn(email: string, password: string): Promise<void>;
  signOut(auth: Auth): Promise<void>;
  getIsAuthenticated(): Promise<boolean>
  getUser(): User | null;
}

class AuthWithFirebase implements AuthProvider {
  private isAuthenticated = false;
  private firebaseAuth: Auth;

  constructor(firebaseAuth: Auth) {
    this.firebaseAuth = firebaseAuth;
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await this.firebaseAuth.setPersistence(browserLocalPersistence);
      await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      this.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      console.error(error);
      throw error;
    }
  }
  async signOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.isAuthenticated = false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  private onAuthStateChangedPromise(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.firebaseAuth.onAuthStateChanged(
        (user) => {
          resolve(user);
          unsubscribe();

        },
        (error) => {
          reject(error);
          unsubscribe();
        }
      );
    });
  }
  async getIsAuthenticated(): Promise<boolean> {
    const user =  await this.onAuthStateChangedPromise();
    if (user) {
      this.isAuthenticated = true;
    }else{
      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }
  getUser(): User | null {
    return this.firebaseAuth.currentUser;
  }
}

const authProvider = new AuthWithFirebase(auth);

export default authProvider;
