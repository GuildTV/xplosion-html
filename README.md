
Run ```dotnet ef database update``` to setup sqllite for the server

## Changing Teams
The team names are defined in config.js. The initials must be kept to 2 characters, the full names are only used in the controller, so accuracy is not essential.

Team logos are located at /public/img/logo-l.png and /public/img/logo-r.png. The sizes should be kept the same, as they otherwise are likely to spill outside of the bar, or cause collisions with other sections.

Team colours are defined in /sass/variables.css. The first color should be based on the team kit colour, with the second colour having the darken percentage adjusted to look good in the graphic.

After changing all these, the application should be recompiled and can then be run.

