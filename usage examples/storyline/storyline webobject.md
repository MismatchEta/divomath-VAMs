# Embedding divoVAM as a webobject in Articulate Storyline

Storyline lets you embed local html files as a `web object`. For this you have to specify a location with an index.html.
To use the divoVAM framework with this it is not recommended that you rename `divoVAM.html` to `index.html` although that is an option.

If you do this you won't be able to supply any GET parameters like you normally would. Instead use an `index.html` like the one in this directory and have the `divoVAM.html` next to it. This way you can specify the source **with** parameters inside the `index.html`.

 So basically like this:

```bash
webobject # the directories name
    ├─ index.html
    ├─ divoVAM.html
    └─ ... # whatever else you might need for the webobject to work
```