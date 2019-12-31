$(document).ready(()=>{

//login funkcija
$("#login").click(()=>{
  //uzimamo username i password iz forme
  var username = $("#username").val();
  var password = $("#password").val();

  //pakujemo u login request (to ocekuje nas user service)
  var loginRequest={username:username,password:password}

  $.ajax({
    //gadjamo login rutu user servica preko api-getaway
    url: 'http://localhost:8084/cinema-user-service/api/user/login',
    //koristimo post request
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(loginRequest),
  }).done(function(data) {
     /**
        kada dobijemo response iz njega izvlacimo token i stavljamo ga u local localStorage
        i posle cemo ga slati u headeru svakog reuquesta zbog autentifikacije
     */
     localStorage.setItem("token", data.token);
     //nakon uspesnog logovanja skloniti login formu
     $("#loginForm").hide();
  });

});

//dohvatanje filmova
$("#getMovies").click(getMovies)

//dodavanje novog filma
$("#addMovie").click(()=>{
  var title = $("#title").val();
  var description = $("#description").val();

  //pakujemo podatke u DTO koji ocekuje nas service
  var addMovieRequest={title:title,description:description}

  $.ajax({
    url: 'http://localhost:8084/cinema-movie-service/api/movie',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(addMovieRequest),
    headers: {
         //dodajemo token u header
        'Authorization':'Bearer '+localStorage.getItem("token")
    },
  }).done(function(data) {
    //ako je zahtev uspesan resetujemo listu da bi se prikazao film koji je upravo dodat
    getMovies()
  });

});


function getMovies(){
  //brisevo sve redove iz tabele osim headera
  $("#movies").find("tr:gt(0)").remove();


  $.ajax({
    //saljemo zahtev za dohvatanjem svim filmova sa cinema-movie-servica preko api-getaway
    url: 'http://localhost:8084/cinema-movie-service/api/movie',
    type: 'GET',
    contentType: 'application/json',
    headers: {
        //izvlacimo token iz local storage i stavljamo ga u header requesta
        'Authorization':'Bearer '+localStorage.getItem("token")
    },
  }).done(function(data) {
    //kada dobijemo podatke upisemo ih u tabelu
    for(var i=0;i<data.content.length;i++){

       var row="<tr>";
       row+="<td>"+data.content[i].id+"</td>";
       row+="<td>"+data.content[i].title+"</td>";
       row+="<td>"+data.content[i].description+"</td>";
       row+="</tr>";
       $("#movies").append(row);
     }
  });
}


})
