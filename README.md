<div style="display:flex;  justify-content:center; align-items:center; gap: 20px">
    <h1 style="text-alignment:center">herafi-nestjs-backend</h1>
    <div style="display:flex; justify-content:center; align-items:center;"> 
        <img style="width: 80px; height: 80px" src="https://github.com/AbdAlghaniAlbiek/Herafi/blob/master/Herafi.UWP/Assets/Images/AppIcons/StoreLogo.scale-200.png"; alt="herfi-backend-image";/>
        <img style="width: 80px; height: 80px" src="https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg" alt="NestJs";/> 
    </div>
    <div style="display:flex; justify-content: center;">
        <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/AbdAlbiek?style=social">
        <img alt="GitHub" src="https://img.shields.io/github/license/AbdAlghaniAlbiek/herafi-nestjs-backend">
    </div>
</div>

### Introduction

This project considered as rebuild or refresh the current [herafi_backend](https://github.com/AbdAlghaniAlbiek/herafi_backend) repo using [Nest.js](https://github.com/nestjs/nest) framework.

### NestJS

-   A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
-   It uses progressive JavaScript, is built with and fully supports TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).
-   Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.

### About

This project serves 2 Android applications (User and Craftman apps) and UWP application (Admin app) by making APIs that enable these apps to consume them and fetch data from them, this Backend application contains almost all modules that described in NestJS documentation like: Caching, Uploading, Swagger, Task Schedualer, Queues.....

Architecture of this project is crafted so carefully so you can see each folder help is created for specific role like **apps** for client side applications, **Helpers** for classes and functions that used usualy, **Services** injectable classes that registered in DI (Dependency Injection) container and used in various places in the application....

# Table of content

-   [Setup](#setup)
-   [Libraries Used](#libraries-used)
-   [Versions](#versions)
-   [Project Status](project-status)

## Setup

To Initialize this NestJS project you need follow these instructions:

1. Node.js runtime from its website (or using nvm) => 16.5v or above
2. `git clone https://github.com/AbdAlghaniAlbiek/herafi-nestjs-backend`
3. `npm install`
4. Remove the current `.env.vault`
5. Create your own project on dotenv by following their docs
6. Create your .env with your secrets following the structure of `.env.example`
7. `npm run start:dev`

## Libraries Used

Various of libraries (modules) has been used that make this project able to handle requests of three client applications, so I'll go forward descriping these modules that I used.

### Configurations

The configuartion of all services and modules of this project it loaded from **.env** file and this sync with [dotenv](https://www.dotenv.org/) host service so all team members can push/pull (with custom permmision) securitly privatly between them without send **.env** files in emails or slack environments

`ConfigModule` it depends on custom hand-made functions that load data then they implemented in this module, by this We can call `ConfigService` with custom interface refers to that implemented functions, with that we can hard-coded all strings that existing in **.env** file.

### Mapping Data

`MapperModule` makes the way of mapping data from **entites** to **DTOs** and vice versa so easily by defining classes that have profiles about how mapping operation between **entites** and **DTOs** will happen.

### TypeOrm

TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

In this project I used `TypeOrmModule` to connect to postgress database and make realtions between entities classes and db tables using sync approach in dev environment or migrations files in prod environment, by this I cut short Entites Repo layer and I can use **InjectRepostity(Entity)** decorator directly instead, and make various of sql operations on db in easily way.

### Upload Files

Uploading files to server is so important thing that any backend server must deal with it so there is such already defined module `MulterModule` that enable nestjs backend server to handle sended files to it.

And as additional thing I provide it is about uploading files to [Cloudinary](https://cloudinary.com/) cloud-service by implementing `CloudinaryModule` for uploading files (images) to this host service in production environment.

### Queues Pattern

This pattern enable backend server to make jobs in certain queues and these jobs do some operations on seperate process freeing the process that run my Nestjs backend to handle various of requests, and it depends on **producer-consumer** jobs concept by adding jobs to the queues and remove them when they complete their mission.

`BullModule` is the library that used for this purpose and it heavily depends on [Redis](https://redis.io/) caching mechanism .

### Sending Emails

`MailerModule` makes sending emails to the clients much easier than before, and I connect its configuration with SendGrid environment, so it pretty awesome to see your emails sended on these 3 applications.

### Task Schedualling

`ScheduleModule` create jobs that works on different processes, and for this project I create **Cron** that works permanently as Nestjs backend server run, also it depends on **producer-consumer** concept by adding names to the functions that have **Cron** decorator, but I don't use this pattern in my project.

### Event Emitter

Events is so powerful tool to handle various of backend operations outside of specific scope, so we can use everywhere, and `EventEmitterModule` makes functions that have **OnEvent** decorator available in all of this project so we can call it in any controller, service, guard, pipe, .... so easily.

### Caching Data

Caching is so important in backend world that makes response of backend so fast, I used `CacheModule` for caching most requested data from the server like **cities** data and so on.

`CacheModule` is using RedisOptions so it depends on [Redis](https://redis.io/) configuration for caching data.

### Routing

Controllers considered as base routing layer in NestJS applications but in big production applications it doesn't enough like in this project I have 3 client side application to deal with, so can I make global prefix for each application that have its specific APIs to fetch data from them.

NestJS provides awesome `RouterModule` that enable global prefix for each module specified for specific client application that have its specific APIs to deal with.

### Swagger

Implementing Open API principles using `SwaggerModule` and I made a specific swagger UI for each client application in specific route

### Security

This project it contain on all possible security tools to make backend server secure as possible as it can

#### Authentication & Authorizaiton

I used for `Authentication` process [JWT](https://jwt.io/) RSA-512 Access/Refresh based Tokens so it's very high secure level for each client and server sides, and for `Authorization` process I used **RBAC**(Roles Based Access Control) concept to control who can access to resources of the server

`Passport-jwt` & `@nestjs/passport` libraries very helpful and make the implementation process to backend server more easier.

#### Encryption/Decryption & Hashing

Securig data by encrypting and decrypting it using AES-256 (Advanced Encryption Standard) algorithm and for hashing password in one way I used `bcryptjs` for maximum password security.

#### Throttler

`ThrottlerModule` is so crusial to prevent infinte requests on the server and this module solve this problem by adding TTL(Time To Life) and limit for each session of user on the backend server

#### Exception Filter

It can filter any type of HttpExcption that produce it by any layer of application (Mapper layer, validation layer, services layer, repos layer, controllers layer) and send a specific type of json data to client side. We can acheive that with custom `exception-filter` build inside this project.

#### Validation

All data that comes from clients' requests in **_Body_** validated (either in body schema or properties' data rules) by `ValidationPipe` and for **Param** or **Query** data all of them validated and transformed using `parseIntPipe`, `parseFloatPipe`, `parseEnumPipe`...

#### CORS & Helmet & CSRF

Implementing the required middlewares to make server protected from any maleware, spyware, warm viruses.... by using these middlewares

-   `CORS` (Cross Origin Resource Sharing) an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources
-   `Helmet`, Helps in setting various HTTP headers that protect headers from any potentialy threat
-   `CSRF` (Cross-Site Request Forgery) protect from attack that forces authenticated users to submit a request to a Web application against which they are currently authenticated

## Versions

### [1.0.0v]

Contains on all setup, development, admin, user and craftman latest updates

## Project Status

This project is maintained and updated frequently until it finish
