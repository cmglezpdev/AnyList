import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    user = 'user',
    admin = 'admin',
    superUser = 'super-user'
}

registerEnumType(ValidRoles, { 
    name: "ValidRoles", 
    description: "Valid roles for the users" 
})