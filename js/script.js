var data = "";
var id = "";
var image = "";
var nameplaylist = "";
var songs = "";
var songsulrarray = [];
var audio = "";
var songcounter = 0;
//ben hagag on nav bar move 
function benhagagproject() {
        $("#bensprojecttomove").animate({
                left: '600px'
        }, 2000);
        $("#bensprojecttomove").fadeOut();
        $("#bensprojecttomove").fadeIn();
        $("#bensprojecttomove").animate({
                left: '0px'
        }, 2000);
        $("#bensprojecttomove").fadeOut();
        $("#bensprojecttomove").fadeIn();
}
getallplaylists();
// ajax call to get al playlists
function getallplaylists() {
        $(".main-playlists").css("margin-top", "");
        $("title").text(`project playlist ben hagag`);
        benhagagproject();
        data = "";
        id = "";
        image = "";
        nameplaylist = "";
        songs = "";
        songcounter = 0;
        if ($('.playing').is(':visible')) {
                stopspinimageandstopmusic();
        }
        $("#player").hide();

        $.ajax({
                url: "http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=playlist",
                success: function (result) {
                        loadallplaylists(result);
                }
        });
}
//load all the playlists and html thenm
function loadallplaylists(result) {
        var html = "";
        for (let i = 0; i < result.data.length; i++) {
                data = result.data[i];
                image = data.image;
                nameplaylist = data.name;
                id = data.id;
                html += `<div class="playlist col-lg-3 col-md-4 col-sm-6 ${nameplaylist}" id="${id}">
                 <div class="editdeletediv mainglyphicon">
                 <button class="fa fa-edit edit-main btn btn-default btn-md" data-toggle="modal" data-target="#editplaylist" data-id="${id}" data-name="${nameplaylist}" data-url="${image}"></button><button class="fa fa-remove remove-main btn btn-default btn-md" data-toggle="modal" data-target="#removeplaylist" data-id="${id}" data-name="${nameplaylist}"></button>
                 </div>
                        <div class="text">
                      <p class="roundtext">${nameplaylist}</p>
                    </div>
                      <img class="playlist-image" src="${image}" alt="${nameplaylist}">
                        <button class="fa fa-play-circle-o play-main mainglyphicon btn btn-default btn-md" onclick="playlistbyid(${id})"></button>
                    </div>`;
        }
        $(".main-playlists").html(html);
        for (var i = 0; i < $('.roundtext').length; i++) {
                const circleType = new CircleType($('.roundtext')[i]);
                circleType.radius(130);
        }
}
//ajax call to get 1 playlist by id
function playlistbyid(id) {
        $.ajax({
                url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=playlist&id=${id}`,
                success: function (result) {
                        makeplayer(result);
                }
        });
}
// function for making  the player and show on page 
function makeplayer(data) {
        songcounter = 0;
        image = data.data.image;
        nameplaylist = data.data.name;
        id = data.data.id;
        var player = `
        <div class="row playing" id="rowplayingnow-${id}">
   <div class="col-lg-2 col-md-2 col-sm-2"></div>
   <div class="theplaylist col-lg-8 col-md-8 col-sm-8">
     <img class="playingnow-image" src="${image}" alt="">
     <button class="fa fa-play-circle-o playingnow-play btn btn-default btn-md" onclick="spinimageplaymusic()" id="playingnowplay"></button>
     <button class="fa fa-pause-circle-o playingnow-play btn btn-default btn-md" onclick="stopspinimageandstopmusic()" id="pausenow"></button>
     <audio controls class="audio" id="audioplayer" onended="nextsongtoplay()" onpause="stopspinimageandstopmusic()" onplay="spinimage()">
     </audio>
     <h4 class="headsong"> Now Playing: ${nameplaylist}</h4>
     <div class="namesongs">
       <ol id="listsongs">
       </ol>
     </div>
   </div>
   <div class="plaingnowbutons col-lg-2 col-md-2 col-sm-2">
     <button class="fa fa-edit edit-playingnow  btn btn-default btn-md" data-toggle="modal" data-target="#editplaylist" data-id="${id}" data-name="${nameplaylist}" data-url="${image}"></button>
     <br>
     <br>
     <button class="fa fa-remove remove-plaingnow btn btn-default btn-md" onclick="removeplaylistandplayer(${id})" data-toggle="modal" data-target="#removeplaylist" data-id="${id}" data-name="${nameplaylist}"></button>
   </div>
 </div>
        `;
        $.ajax({
                url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=songs&id=${id}`,
                success: function (result) {
                        songs = result.data.songs;
                        songsulrarray = [];

                        // $('.listsongs').empty();
                        for (var i = 0; i < songs.length; i++) {
                                // playthis=songs[i].url;
                                $('#listsongs').append(`<li id="song${i}" class="songnametoplay" data-name="${songs[i].name}" data-place="${i}" data-songnum="${i}" data-url="${songs[i].url}" onclick="playthissong(song${i})"><span class="fa fa-play" id="songiconplay"></span><a href="#" class="clicksong">  &nbsp ${songs[i].name}</a></li>`);
                                songsulrarray.push(songs[i].url);
                        }
                        $(".fa-play").hide();
                        $("#songiconplay").show();
                        spinimageplaymusic(songsulrarray);
                }
        });
        $("#player").hide();
        $("#player").html(player).fadeIn(1000);
        $(".main-playlists").css("margin-top", "390px");
        window.scrollBy(0, -1000000000000);
        audio = $(`#audioplayer`)[0];
}
// when click x on pplayer remove it will hide the player 
function removeplaylistandplayer(id) {
        $("title").text(`project playlist ben hagag`);
}
//this is function onplay audio
function spinimage() {
        $(".playingnow-image").attr("id", "spinimage");
        $("#playingnowplay").hide();
        $("#pausenow").show();
}
//spining imageand playingmusic
function spinimageplaymusic() {

        if (audio.hasAttribute("src") && $(audio).attr("src") != "") {
                audio.play();
        } else {
                $(audio).attr("src", songsulrarray[songcounter]);
                audio.play();
        }
        $(".headsong").text(`Now-Playing-${nameplaylist}-song: ${songs[songcounter].name}.`);
        $("title").text(`${nameplaylist} - ${songs[songcounter].name}`);
        $(".playingnow-image").attr("id", "spinimage");
        $("#playingnowplay").hide();
        $("#pausenow").show();
        var playicon = $(".fa-play")[songcounter];
        var textnamesong = $(".clicksong")[songcounter];
        $(textnamesong).css("opacity", "1");
        $(playicon).show();
}
//when i click the stop button on the playlist image
function stopspinimageandstopmusic() {
        $(".playingnow-image").attr("id", "");
        $("#playingnowplay").show();
        $("#pausenow").hide();
        audio.pause();
}
//when song 1 ends go to the next and so on..
function nextsongtoplay() {
        songcounter++;
        $(".fa-play").hide();
        if (songcounter < songsulrarray.length) {
                var playicon = $(".fa-play")[songcounter];
                $(playicon).show();
                stopspinimageandstopmusic();
                $(".playingnow-image").attr("id", "spinimage");
                $("#playingnowplay").hide();
                $("#pausenow").show();
                $(audio).attr("src", songsulrarray[songcounter]);
                audio.play();
                $(".clicksong").css("opacity", "");
                var textnamesong = $(".clicksong")[songcounter];
                $(textnamesong).css("opacity", "1");
        } else {
                $(".clicksong").css("opacity", "");
                songcounter = 0;
                $(audio).attr("src", "");
                stopspinimageandstopmusic();
                spinimageplaymusic();
        }
        $(".headsong").text(`Now-Playing-${nameplaylist}-song: ${songs[songcounter].name}.`);
        $("title").text(`${nameplaylist} - ${songs[songcounter].name}`);
}
//this function to play the song i clicked
function playthissong(songliid) {
        var songtoplay = $(songliid).attr("data-url");
        var songplace = $(songliid).attr("data-place");
        songcounter = songplace;
        stopspinimageandstopmusic();
        $(".headsong").text(`Now-Playing-${nameplaylist}-song: ${songs[songcounter].name}.`);
        $("title").text(`${nameplaylist} - ${songs[songcounter].name}`);
        $(audio).attr("src", songsulrarray[songcounter]);
        audio.play();
        $(".fa-play").hide();
        var playicontoshow = $(songliid).find(".fa-play");
        $(playicontoshow).show();
        $(".clicksong").css("opacity", "");
        var textnamesong = $(".clicksong")[songcounter];
        $(textnamesong).css("opacity", "1");

}
//  remove playlist
//remove plylist  modal if click remove go to remove function
$('#removeplaylist').on('show.bs.modal', function (e) {
        var artibute = $(e.relatedTarget);
        id = $(artibute).attr("data-id");
        nameplaylist = $(artibute).attr("data-name");
        if ($(`#rowplayingnow-${id}`).is(':visible')) {
                $("title").text(`${nameplaylist} - ${songs[songcounter].name}`);
        }
        $("#removeList").html(`Are You Sure You Want To Delete <b> ${nameplaylist} </b>, Playlist number  ${id}  ?`);
        $("#remove-button-playlist").click(function () {
                removeplaylist(id);
        });
});
// abax call remove playlist 
function removeplaylist(id) {
        $.ajax({
                url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=playlist&id=${id}`,
                type: 'DELETE',
                success: function (result) {
                        $(`#${id}`).fadeOut(1000);
                        if ($(`#rowplayingnow-${id}`).is(':visible')) {
                                $("#player").hide();
                                audio.pause();
                                getallplaylists();
                        }
                }
        });
}
//  end remove playlist function
// =======================================================================
//check input urls oninput!!
// oninput add url image
function checkaddurlimage() {
        var regexpurlimage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(regexpurlimage);
        var urlinputimage = $("#playlisturladd").val();
        if (urlinputimage.match(regex)) {
                $("#playlisturladd").css({
                        "border": ""
                });
                $("#addurleror").html("");
        } else {
                $("#playlisturladd").css({
                        "border": "5px solid red"
                });
                $("#addurleror").html("Please Insert Valid jpg/gif/png URL");
        }
}
// on input edit url image
function checkediturlimage() {
        var regexpurlimage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(regexpurlimage);
        var urlinputimage = $("#playlisturledit").val();
        if (urlinputimage.match(regex)) {
                $("#playlisturledit").css({
                        "border": ""
                });
                $("#editplaylisturleror").html("");
        } else {
                $("#playlisturledit").css({
                        "border": "5px solid red"
                });
                $("#editplaylisturleror").html("Please Insert Valid jpg/gif/png URL");
        }
}
// oninput add url songs
function checkaddurlsong() {
        var songurlinput = $(".newsongtoadd").find(".songurl");
        var erorsongurl = $(".erorsogurladd");
        for (var i = 0; i < songurlinput.length; i++) {
                var regexmp3url = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp3)/g;
                var regex = new RegExp(regexmp3url);
                const songurl = songurlinput[i].value;
                var songid = $(songurlinput[i]).attr("id", `songurladd-${i}`);
                var erorsogurlid = $(erorsongurl[i]).attr("id", `erorsongurladd-${i}`);
                if (songurl.match(regex)) {
                        $(songid).css({
                                "border": ""
                        });
                        $(erorsogurlid).html("");
                } else {
                        $(songid).css({
                                "border": "5px solid red"
                        });
                        $(erorsogurlid).html("Please Insert Valid mp3 URL");
                }
        }
}
// oninput edit url songs inputs
function checkedirurlsongs() {
        var songurlinput = $(".songtoedit").find(".songurl");
        var erorsongurl = $(".erorsogurledit");
        for (var i = 0; i < songurlinput.length; i++) {
                var regexmp3url = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp3)/g;
                var regex = new RegExp(regexmp3url);
                const songurl = songurlinput[i].value;
                var songid = $(songurlinput[i]).attr("id", `songurledit-${i}`);
                var erorsogurlid = $(erorsongurl[i]).attr("id", `erorsongurledit-${i}`);
                if (songurl.match(regex)) {
                        $(songid).css({
                                "border": ""
                        });
                        $(erorsogurlid).html("");
                } else {
                        $(songid).css({
                                "border": "5px solid red"
                        });
                        $(erorsogurlid).html("Please Insert Valid mp3 URL");
                }
        }
}
// add playlist
//when show modal add playlist clean all the erors css and html bring back the regular image 
$('#addplaylist').on('show.bs.modal', function (e) {
        $("#playlisturladd").css({
                "border": ""
        });
        $("#addurleror").html("");

        $(".songurl").css({
                "border": ""
        });
        $(".erorsogurladd").html("");
        $("#imgforadd").attr("src", "images/playlsitimage.jpg");
        $(".playlisturl").val("");
        $(".playlistname").val("");
        $(".addplaylistclass").show();
        $(".addsongstoplaylist").hide();
        $(".playlisturl").change(function () {
                image = $(".playlisturl").val();
                nameplaylist = $(".playlistname").val();
                $("#imgforadd").attr("src", `${image}`);
        });
});
//when add modal is hide empty the inputs of add songs
$("#addplaylist").on('hide.bs.modal', function () {
        $(".addmoresongstomoadal").empty();
});
//when click to next save name and image make a valid on url image if all okay next to songs add div 
$("#addplaylistform").submit(function (e) {
        e.preventDefault();
        var regexpurlimage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(regexpurlimage);
        var urlinputimage = $("#playlisturladd").val();
        if (urlinputimage.match(regex)) {
                $(".addplaylistclass").hide();
                $(".addsongstoplaylist").show();
        } else {
                $("#playlisturladd").css({
                        "border": "5px solid red"
                });
                $("#addurleror").html("Please Insert Valid jpg/gif/png URL");
        }
        $(".songname").val("");
        $(".songurl").val("");
});
//when click to finish save add modal valid the value of urlmp3 inputs if all good add playlist to database
$("#addsongsform").submit(function (e) {
        e.preventDefault();
        var songnameinput = $(".newsongtoadd").find(".songname");
        var songurlinput = $(".newsongtoadd").find(".songurl");
        var erorsongurl = $(".erorsogurladd");
        songs = [];
        var counter = 0;
        for (let i = 0; i < songnameinput.length; i++) {
                const songname = songnameinput[i].value;
                objectsongs = {
                        name: "",
                        url: ""
                };
                songs.push(objectsongs);
                songs[i].name = songname;
        }
        for (var i = 0; i < songurlinput.length; i++) {
                var regexmp3url = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp3)/g;
                var regex = new RegExp(regexmp3url);
                const songurl = songurlinput[i].value;
                songs[i].url = songurl;
                var songid = $(songurlinput[i]).attr("id", `songurladd-${i}`);
                var erorsogurlid = $(erorsongurl[i]).attr("id", `erorsongurladd-${i}`);
                if (songurl.match(regex)) {
                        counter++;
                        $(songid).css({
                                "border": ""
                        });
                        $(erorsogurlid).html("");
                } else {
                        $(songid).css({
                                "border": "5px solid red"
                        });
                        $(erorsogurlid).html("Please Insert Valid mp3 URL");
                }
        }
        if (counter == i) {
                data = {
                        name: nameplaylist,
                        image: image,
                        songs: songs
                };
                $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=playlist',
                        data: data,
                        success: function (response) {
                                $('#addplaylist').modal('toggle');
                                getallplaylists();
                        }
                });
        }
});
// =======================================================================
// edit playlist
//on show edit modal clean al the eror css and html empty the div of inputs edit songs and bring the img to the regular image 
$('#editplaylist').on('show.bs.modal', function (e) {
        $(".addmoresongstomoadaledit").empty();
        $("#playlisturledit").css({
                "border": ""
        });
        $("#editplaylisturleror").html("");
        data = "";
        id = "";
        image = "";
        nameplaylist = "";
        songs = "";
        var artibute = $(e.relatedTarget);
        id = $(artibute).attr("data-id");
        dataname = $(artibute).attr("data-name");
        dataimage = ($(artibute).attr("data-url"));
        $("#playlisturledit").val(dataimage);
        $("#playlistnameedit").val(dataname);
        $("#imgforedit").attr("src", `${dataimage}`);
        $(".editplaylistclass").show();
        $(".editsongsplaylist").hide();
});
//after modal edit is close get all playlists with the update and show them
$('#editplaylist').on('hide.bs.modal', function (e) {
        getallplaylists();
});
//when url input change show the image if url is good 
$("#playlisturledit").change(function () {
        image = $("#playlisturledit").val();
        $("#imgforedit").attr("src", `${image}`);
});
//take val on url image val of name and image url in edit modal if all good it edits it and get inputs with the value of the exits songs
$("#editplaylistform").submit(function (e) {
        e.preventDefault();
        var regexpurlimage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(regexpurlimage);
        var urlinputimage = $("#playlisturledit").val();
        if (urlinputimage.match(regex)) {
                $(".editplaylistclass").hide();
                $(".editsongsplaylist").show();
                image = $("#playlisturledit").val();
                nameplaylist = $("#playlistnameedit").val();
                data = {
                        name: nameplaylist,
                        image: image,
                };
                $.ajax({
                        type: 'POST',
                        url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=playlist&id=${id}`,
                        data: data,
                        success: function (response) {}
                });
                $.ajax({
                        url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=songs&id=${id}`,
                        success: function (result) {
                                songs = result.data.songs;
                                for (let i = 0; i < songs.length; i++) {
                                        var songtoaddtoedit = songaddnewsongedit();
                                        $("div .addmoresongstomoadaledit").append(songtoaddtoedit);
                                        var songnameinput = $(".songtoedit").find(".songname");
                                        var songurlinput = $(".songtoedit").find(".songurl");
                                        var songname = songs[i].name;
                                        var songurl = songs[i].url;
                                        songnameinput[i].value = songname;
                                        songurlinput[i].value = songurl;
                                }
                        }
                });
        } else {
                $("#playlisturledit").css({
                        "border": "5px solid red"
                });
                $("#editplaylisturleror").html("Please Insert Valid jpg/gif/png URL");
        }
});
//finisand save button on edit take the value in each input make a valid on url if all good it gets inside thr playlist the songs
$("#editsongsform").submit(function (e) {
        e.preventDefault();
        var songnameinput = $(".songtoedit").find(".songname");
        var songurlinput = $(".songtoedit").find(".songurl");
        var erorsongurl = $(".erorsogurledit");
        var counter = 0;
        songs = [];
        for (let i = 0; i < songnameinput.length; i++) {
                const songname = songnameinput[i].value;
                objectsongs = {
                        name: "",
                        url: ""
                };
                songs.push(objectsongs);
                songs[i].name = songname;
        }
        for (var i = 0; i < songurlinput.length; i++) {
                var regexmp3url = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp3)/g;
                var regex = new RegExp(regexmp3url);
                const songurl = songurlinput[i].value;
                songs[i].url = songurl;
                var songid = $(songurlinput[i]).attr("id", `songurledit-${i}`);
                var erorsogurlid = $(erorsongurl[i]).attr("id", `erorsongurledit-${i}`);

                if (songurl.match(regex)) {
                        counter++;
                        $(songid).css({
                                "border": ""
                        });
                        $(erorsogurlid).html("");
                } else {
                        $(songid).css({
                                "border": "5px solid red"
                        });
                        $(erorsogurlid).html("Please Insert Valid mp3 URL");
                }
        }
        if (counter == i) {
                data = {
                        songs: songs
                };
                $.ajax({
                        type: 'POST',
                        url: `http://localhost:8080/Benserver/playlistbenhagag/api/playlist.php?type=songs&id=${id}`,
                        data: data,
                        success: function (response) {
                                $('#editplaylist').modal('toggle');
                                getallplaylists();
                        }
                });
        }
});
//to add more inputs songs to add modal 
$("#addsongtoadd").click(function () {
        var songinputstoadd = ` <div class="newsongtoadd newsongaddnew">
        <div class="form-group add-songs-form">
                <label for="songname">Song Name:</label>
                <input type="text"  required class="form-songs form-control songname" placeholder="Enter Song Name" name="songname">
         </div>
        <div class="form-group add-songs-form">
                <label for="songturl">Song URL:</label>
                <input type="text"  required class="form-songs form-control songurl" placeholder="http://" name="songurl" oninput="checkaddurlsong()">
                <small class="erorsogurladd"></small>
        </div>
</div> `;
        $("div .addmoresongstomoadal").append(songinputstoadd);
});
//when clicked add more inputs songs to edit modal  
$("#addsongtoedit").click(function () {
        var songtoadd = songaddnewsongedit();
        $("div .addmoresongstomoadaledit").append(songtoadd);
});
//to add more inputs to edit modal when clicked for adding more songs to player ,,and to load all the inputs with value (songs allready in playlist)
function songaddnewsongedit() {
        songtoadddiv = ` 
        <div class="songtoedit">
        <div class="form-group edit-songs-form">
          <label for="songname">Song Name:</label>
          <input type="text" required class="form-songs form-control songname" placeholder="Enter Song Name" name="songname">
        </div>
        <div class="form-group edit-songs-form">
          <label for="songturl">Song URL:</label>
          <input type="text"  required class="form-songs form-control songurl" placeholder="http://" name="songurl" oninput="checkedirurlsongs()">
          <small class="erorsogurledit"></small>
        </div>
      </div>    `;
        return songtoadddiv;
}
//search playlist by name
function searchplaylist() {
        var searchvalue = $("#searchinput").val();
        var playlisttoshow = [$(`.main-playlists`).find(`.${searchvalue}`)];
        if (searchvalue == "") {
                getallplaylists();
        }
        if (playlisttoshow.length >= 1) {
                for (let index = 0; index < playlisttoshow.length; index++) {
                        const showimg = playlisttoshow[index];
                        $(showimg).siblings().hide();
                        $(showimg).show();
                }
        } else {
                $(playlisttoshow).siblings().hide();
                $(playlisttoshow).show();
        }
}
//button to click to get all playlists 
$("#clicktoshowall").click(function () {
        getallplaylists();
});