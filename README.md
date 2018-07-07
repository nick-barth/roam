# roam

### Summary
This was a highly enjoyable assignment for me, as I was able to learn about GraphQL, Apollo, Mapbox GL, and typescript with react.  I went a little overboard on this, taking me about a total of 8 hours, but almost all of the extra time was spent learning, so no regrets.

### Instructions
1. clone
2. yarn install
3. npm start

## Self-Assessment

### Standardization, standardisation, standardizations 
* I never took the time to properly make a tsconfig that would be up to my standards (my eslint config).  
* I didn't add my editorconfig as well until near the very end, just powering through spaces and tabs.
* I used BEM & module imports, the global css file is a mess as well, no resets
* I never bothered to alphabetically sort any of the imports (also would disable that rule in my future tsconfig, so they could be grouped logically).
* Did a horrible job typing, was throwing around :any like a typeless pinata, definitely lame
* Overall shit code, query should be it's own component.


### Patterns
* Being new to Apollo & graphql & Mapbox GL, I struggled with these guys and eventually came up with a pattern I'm quite unhappy with.  Bubbling the data back up to put it on the map, which has to be rendered before we get the data, CANNOT possibly be a good pattern for this.  This also had super bad effects on flashing and loading.
* I didn't deem it worth the time to put a state management system in here, after running but I am very curious to find if best practice is to wait for the data in the render method and sent it to the store, seems strange, but I think you could make a pretty cool *generic* query component
* I didn't learn how to successfully do filtered queries (ie, get all bikeParks within x longitutes), which is why I grabbed all bike parks and filtered on the clientside (booooo). In addition I did this sketchy at best with some abhorrent float -> int conversions.
* Poor job approximenting distance.


### Complaints 
* Apollo's typescript docs are super [outdated](https://www.apollographql.com/docs/react/recipes/static-typing.html) 
* There must be a decent middleware for catching and printing decent errors in our graphQL query instead of just dumping a java.instance null error on us
* The digitransit.fi docs weren't stellar, they were passable, but a bit lacking in a few areas.










