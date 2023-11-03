import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  signInWithCustomToken,
} from "firebase/auth";
export interface AuthProvider {
  signIn(email: string, password: string): Promise<UserCredential>;
  signInWithCustomToken(token: string): Promise<UserCredential>;
  signOut(auth: Auth): Promise<void>;
  getIsAuthenticated(): Promise<boolean>;
  getUser(): User | null;
}
// export { Auth, User, UserCredential}

export class AuthWithFirebase implements AuthProvider {
  private isAuthenticated = false;
  private auth: Auth;

  constructor(firebaseAuth: Auth) {
    this.auth = firebaseAuth;
  }
  async signInWithCustomToken(token: string): Promise<UserCredential> {
    try {
      this.isAuthenticated = true;
      return await signInWithCustomToken(this.auth, token);
    } catch (error) {
      this.isAuthenticated = false;
      console.error(error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (error) {
      this.isAuthenticated = false;
      console.error(error);
      throw error;
    }
  }
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.isAuthenticated = false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  private onAuthStateChangedPromise(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(
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
    const user = await this.onAuthStateChangedPromise();
    if (user) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }
  getUser(): User | null {
    return this.auth.currentUser;
  }
}
