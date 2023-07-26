
import { gql } from 'apollo-server';

const aboutSchema = gql`
  type ContactUsInfo {
    username: String!,
    email: String!,
    phoneNumber: String!,
    message: String!
  }

  input ContactUsInfoInput {
    username: String!,
    email: String!,
    phoneNumber: String!,
    message: String!
  }

  extend type Mutation {
    createContactUs(contactUsInfo: ContactUsInfoInput!) : Boolean
  }
`;

export default [aboutSchema];
