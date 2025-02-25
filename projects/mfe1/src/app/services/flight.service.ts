
import { Injectable, Injector } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, retry, switchMap, tap} from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Favoritemovies } from '../favoritemovies';
import { ErrorHandler } from '@angular/core'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  headers = {
    'api-version': 'v200',
    'Authorization': 'Basic U0FORV82OmNmbmpqZjJBWVl1WQ==',//prod
    //'Authorization': 'Basic U0FORV81X1hYOllYWDNZVEhNeTN2VQ==',//sandbox
    'x-api-key': 'mT86pUC21i3P2yG7G82o0aIOhT0f2pSlalHsHn5A',//prod
    //'x-api-key': 'ch3MbP6ffN3PIlStArHw65O0qTfuWRP45C9tIvug',//sandbox
    'device-datetime': '2025-02-04T07:03:46.115Z',
    'territory':'IN', //prod
    //'territory':'XX', //sandbox
    'client': 'SANE_6',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
  }

  params = new HttpParams();

  baseURL = "https://api-gate2.movieglu.com/";
  // baseURL = '/api';

  result:any;
  // ytapikey:string = 'AIzaSyC6o1eNqjf0EZJzzJtulwtuXLRwmKugfEg'; //apikey1
  ytapikey:string = 'AIzaSyDGu5JiOZKvis-nRMs_VWkTRkZca5OM79o'; //apikey2
  mockUserData:any;

  constructor(
    private http: HttpClient, public router: Router, private injector: Injector
    ) { }


  favoriteMovies:Favoritemovies[] = [
    { 
      film_id:1,
      film_name: 'Inception',
      is_favorite:true,
    },
    { 
      film_id:2,
      film_name: 'Jersey',
      is_favorite:true,
    },
    { 
      film_id:3,
      film_name: 'Nitham oru vaanam',
      is_favorite:true,
    },
  ];

  curUser: any;
  favmovies: any;

  loadcurUserFav(){
    this.curUser = window.localStorage.getItem('currentUser');
    window.localStorage.setItem("favoriteMovies", JSON.stringify(this.favoriteMovies));
  }

  getUserProfile():Observable<any>{
   
    this.curUser = window.localStorage.getItem('currentUser');
    const email:any = localStorage.getItem('email');
    this.favmovies = window.localStorage.getItem("favoriteMovies");
    this.mockUserData = {
      name: this.curUser ? JSON.parse(this.curUser)?.username : [],
      email: email,
      favoriteMovies: this.favmovies ? JSON.parse(this.favmovies) : [],
      profileImg:'',
    }
    return of(this.mockUserData);
  }

  getFavMovie(){
    this.favmovies = window.localStorage.getItem("favoriteMovies");
    return of(this.favmovies ? JSON.parse(this.favmovies) : []);
  }

  undo=false;

  addFavMovie(movie: any): void{
    this.undo = false;
    let snackBarRef : any;
    const movies = this.getFavMovie().subscribe(movies =>{
        const movieExists = movies.some(
          (data: { film_id: any; }) => data?.film_id == movie?.film_id );
        if(!movieExists){
            movies.push(movie);
            this.saveFavMovies(movies);
        }
      })
  }

  saveFavMovies(movie: any[]): void{
    console.log("save fav movies - ", movie);   
    localStorage.setItem('favoriteMovies', JSON.stringify(movie));
  }

  removeFavMovie(movie:any):void{
    this.getFavMovie().subscribe(movies=>{
      movies = movies.filter((data: { film_id: any; }) => data?.film_id !== movie?.film_id);
      // this.snackBar.open(`Removed ${movie?.film_name} from your favorite list!!`, '',{duration: 3000});
      this.saveFavMovies(movies);
    }) 
  }

  getMovies(params:string):Observable<any>{
    const apiURL = "https://api-gate2.movieglu.com/";
    return this.http.get<any>(apiURL+params,{headers: this.headers}).pipe(
      map(data=>{
        return Object.values(data) || [];
      })
    );
  }

  getMovieByIdYT(id:number):Observable<any>{
    const movieURL = this.baseURL+'filmDetails/?film_id='+id;  
    return this.http.get<any>(movieURL,{headers:this.headers}).pipe(
      switchMap( (movieDetails:any) => {
        const moviename = movieDetails.film_name; 
        let ytUrl = 'https://www.googleapis.com/youtube/v3/search?q='+moviename.replace(/\s/g,"+")+'+trailer&key='+this.ytapikey;
        return this.http.get<any>(ytUrl).pipe(
          switchMap( ytuserdata => {
              return of({
                movieDetails: movieDetails,
                trailer: ytuserdata
              })
          }));
      })
    );
  }
  

}
