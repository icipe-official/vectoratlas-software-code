# Onboarding Tutorials
​
## ReactJS/NextJS
​
The Vector Atlas application utilizes NextJS, a wrapper for ReactJS, to take advantage of server-side rendering (SSR). However, for your typical daily developer workflow, it will be indistinguishable from a typical React Typescript project for the overwhelming focus of your work. Therefore, we have decided to collect a few resources aimed at helping newcomers onboard onto the project. This is not designed to be an exhaustive collection of tutorials on the subject, just a guide to get you started.
​
React is a JavaScript library used by many companies for building modern and responsive websites. The basis of its workflow is centered around the use of functional components – for example, defining a button by creating a function that will return a button component when called:
​
   ```
   export const HelloWorldComponent = () => {
    return (
        <div>Hello World!</div>
    );
   }
   ```
It’s at this point where I will direct you to this tutorial:
​
(1)	<https://beta.reactjs.org/learn>
<br/>
​
This should cover most of the concepts that you will use the most. However, it does not cover the use of the useEffect hook. Something we use very frequently. For that, one should read this slice of documentation:
​
(2)	<https://reactjs.org/docs/hooks-effect.html>
<br/>
​
Having read through these and made a of couple components or nested components of your own, you should be in a good position to have a look at how it is employed within the vector atlas application. React is a frontend framework so, navigate to vectoratlas-software-code/src/UI. In this directory, you will see several folders and files. Whilst all relevant in terms of allowing Next/React to function within the greater system, our focus lies with the components, pages, and styles folders – state is also relevant but that will be addressed later in the React-Redux section.
​
We will start with the pages folder. Once within this directory, we will look at about.tsx – notice how this is a .tsx file. Typically, React/Next uses the .jsx file format – however, this system utilizes TypeScript as opposed to plain JavaScript. Don’t let this worry you! The syntax is nearly identical, and you will pick it up quickly! The only difference we need concern ourselves with is that JavaScript will let you get away with not declaring types whereas TypeScript will require you to be explicit. If you are unsure, this is a good reference to have a quick flick through. Don’t feel the need to read through the entirety of the documentation. If you are familiar with JavaScript, you should not have much trouble:
​
(3)	https://www.typescripttutorial.net/
<br/>
​
Returning to our file, about.tsx, you will see the About function. This acts as the main “container” for calling on all the other components relevant to the about page. With reference to what you have learned from (1), notice how each component is written separately from all the others and then imported– not only does this result in cleaner code by separating out sections into areas of single responsibility, but it allows us to reuse components within our application instead of having to rewrite things repeatedly! For example, see how SectionPanel is called on multiple times with the required changes dictated by a change in the props that are passed in – one can think of these as arguments that are passed into a function. If we look at the SectionPanel component, we see how it is employed to allow for consistent styling of each section.
We are yet to touch on the styles folder. Whilst not as essential in terms of exploring the primary concepts of React, it is important with respect to how it is employed in the greater system. Within this folder, you will see a theme.ts file. Here we define the general styles for our application. We can set primary and secondary colours. We can define how we want certain components to be styled and create custom variants for these. This theme is “injected” into our application via the ThemeProvider in _app.tsx, but this is beyond the scope of this introduction. All you need to know to get started, is that you can access these styles very easily within your components. Returning to SectionPanel for example:
​
```import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
​
export default function sectionPanel({
​
...
​
      <Typography variant="sectionTitle" color="primary">
​
...
​
```
​
## Next/React-Redux
​
So far, we have only covered the setup of the components themselves, that is to say we have not fed data into them from a single source of truth – not efficiently at least. The tutorials and documentation above likely had you passing data and functions down through components as props. Whilst this is interesting and is the default approach for React, it does not scale well to larger applications and ultimately makes code less readable. This is where something called Redux comes in. Redux employs a store that acts a single source of truth for data within our system. But instead of having to pass this data down from top level components all the way down to low level nested components, we can call on the store independently wherever we are. Furthermore, the mutation of this data is handled by function that we declare completely independently for our components. This is achieved by dispatching things we call actions from our component. This is a simple call to our store with the details of the action and the payload. The payload of the action is how we pass data from our component to our store to allow it to mutate our state depending on the action and the payload provided. Taking the time to follow this documentation will be beneficial if you are unfamiliar – start with Redux Essentials before progressing onto Redux Fundamentals. However, I did find that a small amount of jumping between the two for clarification or reference to be useful.
​
<https://redux.js.org/tutorials/essentials/part-1-overview-concepts>
​
## Git
​
Git is our selected method of version control. Employing this with an appropriate git GUI client, such as GitKraken, will prove invaluable for effective team-working and branching strategies. But if this is not available, using the basic tools found in the Visual Studio Code editor (or similar) will suffice. We use it to maintain and interact with a central repository, which can be found here:
​
https://github.com/icipe-official/vectoratlas-software-code
​
If you are generally unfamiliar with git, below is a fantastic set of documentation which will get you up to speed. Following this, you will need some experience interacting with the project to really build up your confidence – but this will not take long:
​
https://www.atlassian.com/git/tutorials
​
Furthermore, once you have worked your way through some of the tutorials, consider referring to our developer branching strategy in the SMG. This will document the way we make commits and general changes to the repository to ensure consistency across developers.
​
## Docker
​
Docker is an open-source platform that enables developers to build, deploy, run, update, and manage containers—standardized, executable components that combine application source code with the operating system libraries and dependencies required to run that code in any environment. A nginx instance is created within one of our containers acting as a reverse proxy, by which we can call on each of our services independently as required. This helps us to increase our security, reliability, and performance. To familiarize yourself with the use of Docker, it will be helpful to review the Getting Started section of their documentation here:
​
https://docs.docker.com/get-started/
​
Following this, please review the Docker directory that can be found in the src folder of the main project alongside the relevant docker files that can be found in the src folder associated with each container.
​
## NestJS
​
NestJS is a Node.js back-end development framework for building server-side applications, based on TypeScript and JavaScript. The technical details of our configuration can be found within the API directory found within the src folder of the main project.
​
https://docs.nestjs.com/first-steps
​
Following the sections in the order presented should provide you with the understanding to review the codebase. The controllers, providers and modules sections should provide you with much of the information required. For example, within src/API/src/db/occurrence, inspecting how our occurrence.entity is defined using TypeORM before being manipulated and accessed through an occurrence.resolver. Which is in turn called on by an occurrence.service, a service which is then injected into a module that is injected into our app, as seen here: src/API/src/app.module.ts. That will sound complicated but will make much more sense when the suggested materials and the codebase has been reviewed.
​
## TypeORM
​
A simple but essential component of our use of NestJS focuses on TypeORM. This is a TypeScript object-relational mapper library that makes it easy to link TypeScript applications up to a relational database – in our case, PostgreSQL. In order to familiarize yourself, review the documentation that can be found here:
​
https://docs.nestjs.com/techniques/database
​
## OpenLayers
​
OpenLayers is an open-source JavaScript library for displaying map data in web browsers. It provides an API for building geographic applications – in our case, we are utilizing it to generate a base map (countries, oceans, lakes, rivers etc.) followed by several layers that are selected by the user – layers including data such as occurrence points, raster overlays etc.
The documentation can be very limited but these links to Quick Start and Tutorials will give you an idea of how it is used on the map page, vectoratlas-software-code/src/UI/components/map/map.tsx:
​
https://openlayers.org/doc/
​
Recently onboarded developers feel that the best way to get up to speed with OpenLayers, following review of the basic knowledge found above, is a combination of several things. Firstly, aim to speak to a more experienced developer prior to starting a ticket involving work with the maps – being talked through the stages and making some brief notes will prove invaluable. Secondly, review what is already available within the codebase – go through the map page mentioned above and play around. Change colours, observe how data from the TileServer is fed in using config.json within TileServer/data/. Finally, reviewing the examples not only shows you what is possible, but it will allow you to get a better feel for how to setup an OpenLayers component:
​
https://openlayers.org/en/latest/examples/
​
​