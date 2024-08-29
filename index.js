import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs", { isAvailable: "Try searching for a song!" });
});

app.post("/findlyrics", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${req.body.artistname}/${req.body.songname}`
    );
    var result = JSON.parse(JSON.stringify(response.data.lyrics));
    console.log(result);
    result = result.replace(/^Paroles de la chanson.*(\r\n|\r|\n)?/gm, ""); // regex function to delete the first lne that comes in French
    result = result.replace(/(?:\r\n|\r|\n)/g, "<br>"); // regex function to replace /n with <br>

    const upperArtist = req.body.artistname.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
      // regex function to uppercase the first letter of every word in the artist name
      // ^ = start of string, \w = any word characters, {1} = only first character
      // therefore ^\w{1} matches the first letter of the first word of the string.
      // | = or, \s+ = any amount of whitespace
      //therefore \s+\w{1} matches the first letters of the rest of the words in the string.
    );
    const upperSong = req.body.songname.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (letter) => letter.toUpperCase()
    );

    res.render("index.ejs", {
      lyrics: result,
      artist: upperArtist,
      song: upperSong,
    });
  } catch (error) {
    res.render("index.ejs", { isAvailable: "No lyrics available." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
