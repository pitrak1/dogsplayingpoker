TODO List:

- Initial deploy - DONE 8/18
- comb through type naming
- add strict zod testing for server contract tests/audit required fields for each endpoint
- Better loading display for different pages
- Better work in progress for different pages
- socketing
  - message notifications by chat
  - invite notifications
- improve floating temporary alerts for async actions (ex: accepting invite should show popup alert that fades)
- Obscure profile data unless logged in
- Gate messaging by MFA
- Properly show distance on map
- Map filtering by obfuscation distance
- Support Email verification on signup
- Support logging in through Google

TODO Bugs:

TODO Possibilities:
- Support purposes (Walking/Sitting/Training, Paid/Unpaid)
- Max range on message?


Type Naming Conventions:

Shared types/zod schemas will be in the shared directory so they can be used on the client and the server.

There will (probably) be a matching zod schema for each type, making pairs.  The zod schema will be camel-case and end in 'Schema', and the type will be pascal-case and will have the 'Schema' suffix removed.

Ex: Zod schema => `createUserInputSchema`, type => `CreateUserInput`

For each database entity, there will be five groups of types.  Some groups may have only one type in it.

1. `<Entity>Row` - This is the representation in Javascript of the row in the database.  This should almost always be generated from Drizzle.
2. `New<Entity>Row` - This is the representation of the data that is required to make a new entity.  This is also generated from Drizzle.
3. `<Entity>` - This is the representation of the entity that's returned from the backend and shared with the frontend.  This is very similar to the `<Entity>Row` type except it will only have things that should be visible to the frontend.  i.e. things like password when fetching a user.
4. `Full<Entity>` - This will be the `<Entity>` type with any directly related data attached.  Like a `User` will have their `Pet`s attached.  I hope this will be intuitive and not required a lot of different use cases, but I'll see how this one works.
5. `<Function><Entity>Input` - This is the data passed to the backend to do a particular operation.  For example, creating a user would required `CreateUserInput`.
6. `<Function><Entity>Form` - This is the type for the frontend to use for form components.  These will be very similar to the `<Function><Entity>Input` types with a couple exceptions.  All fields in this type will be nullable because we want the form to be empty on page load.  Also, more complex data types may differ, like we generally store a Javascript `File` and a generated file URL for a file form input, but the `<Function><Entity>Input` type uses a Cloudinary file URL.  This change is going to happen during validation/save where the data in the `Form` type is converted into the `Input` type.
7.  Miscellaneous types are used for things like file uploading, authentication, Mapbox functionality, and other generally useful things.  Some of those types that currently exist are `AuthResponse`, `UploadSignature`, `MapboxSearchPosition`, `IdInput`, and `PaginationInput`.  They don't really belong to a specific entity.

Worth noting that there may be prefixes like `Paginated` to indicate small additions.
