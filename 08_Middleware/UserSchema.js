const UserSchema = {
    id: 'User Schema',
    schema: 'User Schema',
    type: 'object',
    properties: {
        "first_name": {
            type: "string"
        },
        "last_name": {
            type: "string"
        },
        "email": {
            type: "string"
        },
        "gender": {
            type: "string"
        },
        "job_title": {
            type: "string"
        }
    },
    required: ['first_name', 'last_name', 'email', 'gender', 'job_title']
};
export default {
    UserSchema
}