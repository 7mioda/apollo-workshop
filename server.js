const { ApolloServer, gql } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");
const axios = require('axios');

const typeDefs = gql`
    type Post {
        user: User
        id: ID
        title: String
        body: String
    }
    
    type Address {
        street: String
        suite: String
        city: String
        zipcode: String
        geo: Geo
    }
    
    type Geo {
        lat: String
        lng: String
    }
    
    type Company {
        name: String
        catchPhrase: String
        bs: String
    }
    
    type User {
        id: ID
        name: String
        username: String
        email: String
        address: Address
        phone: String
        website: String
        company: Company
        posts: [Post]
    }
    
    type Query {
        posts: [Post]
        post(id: ID): Post
        users: [User]
        user(id: ID): User
    }
`;

const resolvers = {
    Query: {
        posts: async () => {
                     const { data } = await axios({
                         method: 'get',
                         url: 'https://jsonplaceholder.typicode.com/posts'
                     });
                     return data;
        },
        users: async () => {
            const { data } = await axios({
                method: 'get',
                url: 'https://jsonplaceholder.typicode.com/users'
            });
            return data;
        },
        user: async (_, { id }) => {
            const { data } = await axios({
                method: 'get',
                url: `https://jsonplaceholder.typicode.com/users/${id}`
            });
            return data;
        },
        post: async(_, { id }) => {
            const { data } = await axios({
                method: 'get',
                url: `https://jsonplaceholder.typicode.com/posts/${id}`
            });

            return data;
        }
    },

    User: {
        address: (root) => root.address,
        company: (root) => root.company,
        posts: async (root) => {
            const { data } = await axios({
                method: 'get',
                url: 'https://jsonplaceholder.typicode.com/posts'
            });
            console.log(root.id)
            return data.filter((post) => post.userId === root.id);
        }
    },

    Address: {
        geo: (root) =>  root.geo,
    },

    Post: {
        user: async ({userId}) => {
            const { data } = await axios({
                method: 'get',
                url: `https://jsonplaceholder.typicode.com/users/${userId}`
            });
            return data;
        }
    }

};

const server = new ApolloServer({typeDefs, resolvers});


server.listen().then(({ url }) => console.log(`Go go Oyez on ${url}`));
