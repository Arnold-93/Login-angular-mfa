import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, single, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments.';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { VerifyMfaResponse } from '../interfaces/verify-mfa.interface';
import { TokenUser } from '../interfaces/token-user.interface';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseurl: string = environment.baseUrl;

  private http = inject(HttpClient);

  private _currentUser = signal<User | null> (null); 
  private _authState = signal<AuthStatus>(AuthStatus.checking);
  private _loading = signal<boolean>(false);

  public currentUser = computed(() => this._currentUser());
  public authState = computed(() => this._authState());
  public loading = computed(() => this._loading());

  get tokeUser () {
    return localStorage.getItem('token') || '';
  }

  constructor(){
    this.confirmarAuthentication().subscribe();
  }

  userData(user: User, token: string): boolean{
    this._currentUser.set(user);
    this._authState.set(AuthStatus.authenticated);
    localStorage.setItem('token', token)
    return true;
  }

  login(username: string,password: string):Observable<Boolean>{
    const url = `${this.baseurl}/login`
    this._loading.set(true);
    return this.http.post<LoginResponse>(url, {username, password})
      .pipe(
        tap(({ user, token }) => { 
          this._loading.set(false);
          localStorage.setItem('token', token) 
        })
        ,map(()=> true)
        ,catchError(err => throwError( () => { 
          this._loading.set(false);
          return err.error.message 
        }) )
      )
  }

  confirmarAuthentication(): Observable<Boolean>{
    const url = `${this.baseurl}/token-user`
    const token = localStorage.getItem('token');
    if(!token) return of(false)
    const decodedToken:any = jwtDecode(token!);
    if(decodedToken.tipoToken ==='MFA_TOKEN' )return of(false)
    return this.http.post<any>(url, {token}).pipe(
      map(resp => {
        const {user, token } = resp.data;
        this._loading.set(false);
        return this.userData(user, token)

      })
      ,catchError(err => throwError( () => err.error.message) )
    )
  }

  mfaCode(userSecret: string): Observable<Boolean>{
    this._loading.set(true);
    const url = `${this.baseurl}/verify-totp`;
    const token = localStorage.getItem('token');
    return this.http.post<VerifyMfaResponse>(url, { tokenUser: token,  userSecret})
      .pipe(
        map(({ user, token }) =>  { 
          this._loading.set(false);
          return this.userData(user, token) 
        } )
       ,catchError(err =>  { 
          this._authState.set(AuthStatus.notAuthenticated);
          return throwError( () => { 
            this._loading.set(false);
            return err.error.message 
          });
      })
      )
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authState.set(AuthStatus.notAuthenticated);
  }


}
