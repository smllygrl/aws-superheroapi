MVP

Create a basic application for a superhero enthusiast, that can perform following functions:

1. Allow a user to search for their favourite superhero.
2. Select the superhero and see his/her image and power stats.
3. Edit the power stats
3. Save the image and stats to be viewed later.

So, essentially the app would allow a user to search superheroes by name, see his/her details, edit them and view all their saved super heroes.

ReactJS, GraphQL, NodeJS & Dynamo DB

Application Srategy:
- User searches for a Superhero by name using an external API
(https://akabab.github.io/superhero-api/api/all.json)
- SH powerstats can be edited on the FE, but pretty meaningless until they're saved to DB (don't hold state)
- Users can save their desired SH's, but only their name, powerstats and image URL
- Once a SH is saved, Users can then edit the name, powerstats and image of the SH and delete it
- SH's saved as My Superheroes
- Users choose if searching in external API or their saved SH's